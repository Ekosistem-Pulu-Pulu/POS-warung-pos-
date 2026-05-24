package repository

import (
	"be_warungpos/config"
	"be_warungpos/model"
)

func CreateTransaction(trx *model.Transaction) (*model.Transaction, error) {
	result := config.GetDB().Create(trx)
	return trx, result.Error
}

func GetTransactionByID(id int64) (model.Transaction, error) {
	var trx model.Transaction
	result := config.GetDB().Preload("Items").First(&trx, "id = ?", id)
	return trx, result.Error
}

func UpdateTransactionStatus(id int64, status string, fee float64, total float64, grandTotal float64) error {
	return config.GetDB().Model(&model.Transaction{}).Where("id = ?", id).Updates(map[string]interface{}{
		"status":       status,
		"fee_pos":      fee,
		"total_amount": total,
		"grand_total":  grandTotal,
	}).Error
}

func UpdateTransactionStatusOnly(id int64, status string) error {
	return config.GetDB().Model(&model.Transaction{}).Where("id = ?", id).Update("status", status).Error
}

func GetHistoryByUserID(userID string) ([]model.Transaction, error) {
	var data []model.Transaction
	result := config.GetDB().Preload("Items").Where("user_id = ? AND status != 'draft'", userID).Order("created_at desc").Find(&data)
	return data, result.Error
}
