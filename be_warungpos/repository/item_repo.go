package repository

import (
	"be_warungpos/config"
	"be_warungpos/model"
)

func GetAllItemsByStore(storeID int64) ([]model.Item, error) {
	var items []model.Item
	result := config.GetDB().Where("store_id = ?", storeID).Find(&items)
	return items, result.Error
}

func GetItemByIDAndStore(id int64, storeID int64) (model.Item, error) {
	var item model.Item
	result := config.GetDB().First(&item, "id = ? AND store_id = ?", id, storeID)
	return item, result.Error
}

func InsertItem(item *model.Item) (*model.Item, error) {
	result := config.GetDB().Create(item)
	return item, result.Error
}

func UpdateItem(item *model.Item) error {
	return config.GetDB().Save(item).Error
}

func DeleteItem(id int64, storeID int64) error {
	return config.GetDB().Where("id = ? AND store_id = ?", id, storeID).Delete(&model.Item{}).Error
}
