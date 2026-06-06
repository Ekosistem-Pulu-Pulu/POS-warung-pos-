package repository

import (
	"be_warungpos/config"
	"be_warungpos/model"
)

func CreateTransaction(trx *model.Transaction) (*model.Transaction, error) {
	result := config.GetDB().Create(trx)
	return trx, result.Error
}

func GetTransactionByIDAndStore(id int64, storeID int64) (model.Transaction, error) {
	var trx model.Transaction
	result := config.GetDB().Preload("Items").First(&trx, "id = ? AND store_id = ?", id, storeID)
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

func GetHistory(storeID int64, kasirID int64, role string) ([]model.Transaction, error) {
	var data []model.Transaction
	query := config.GetDB().Preload("Items").Where("store_id = ? AND status != 'draft'", storeID)
	if role == "kasir" {
		query = query.Where("kasir_id = ?", kasirID)
	}
	result := query.Order("created_at desc").Find(&data)
	return data, result.Error
}

type AggregatedFees struct {
	TotalAmount float64 `json:"total_amount"`
	FeePOS      float64 `json:"fee_pos"`
}

func GetAggregatedFeesByStore(storeID int64) (AggregatedFees, error) {
	var agg AggregatedFees
	// Hitung total_amount dan fee_pos hanya untuk transaksi yang sudah dibayar (paid)
	result := config.GetDB().Model(&model.Transaction{}).
		Where("store_id = ? AND status = 'paid'", storeID).
		Select("COALESCE(SUM(total_amount), 0) as total_amount, COALESCE(SUM(fee_pos), 0) as fee_pos").
		Scan(&agg)
	return agg, result.Error
}
