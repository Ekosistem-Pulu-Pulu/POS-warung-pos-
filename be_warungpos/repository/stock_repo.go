package repository

import (
	"be_warungpos/config"
	"be_warungpos/model"
	"gorm.io/gorm"
)

func GetLowStockItems(storeID int64) ([]model.Item, error) {
	var items []model.Item
	result := config.GetDB().Where("store_id = ? AND stock <= min_stock", storeID).Find(&items)
	return items, result.Error
}

func CreateStockMovement(movement *model.StockMovement) error {
	return config.GetDB().Create(movement).Error
}

func GetStockMovements(storeID int64, itemID int64) ([]model.StockMovement, error) {
	var movements []model.StockMovement
	result := config.GetDB().Where("store_id = ? AND item_id = ?", storeID, itemID).Order("created_at desc").Find(&movements)
	return movements, result.Error
}

func AdjustStock(storeID int64, itemID int64, qty int, movementType string, note string, userID int64) error {
	tx := config.GetDB().Begin()

	// Update item stock
	var updateQuery *gorm.DB
	if movementType == "restock" || movementType == "correction_up" {
		updateQuery = tx.Model(&model.Item{}).Where("id = ? AND store_id = ?", itemID, storeID).UpdateColumn("stock", gorm.Expr("stock + ?", qty))
	} else {
		// sale, damage, correction_down
		updateQuery = tx.Model(&model.Item{}).Where("id = ? AND store_id = ?", itemID, storeID).UpdateColumn("stock", gorm.Expr("stock - ?", qty))
	}

	if updateQuery.Error != nil {
		tx.Rollback()
		return updateQuery.Error
	}

	// Create movement log
	movement := &model.StockMovement{
		StoreID: storeID,
		ItemID:  itemID,
		Type:    movementType,
		Qty:     qty,
		Note:    note,
		UserID:  userID,
	}
	if err := tx.Create(movement).Error; err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}
