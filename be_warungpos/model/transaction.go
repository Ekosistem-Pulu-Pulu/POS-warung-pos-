package model

import "time"

type Transaction struct {
	ID          int64             `json:"id" gorm:"primaryKey;autoIncrement"`
	UserID      string            `json:"user_id" gorm:"type:varchar(100);not null"`
	TotalAmount float64           `json:"total_amount"`
	FeePOS      float64           `json:"fee_pos"`
	GrandTotal  float64           `json:"grand_total"`
	Status      string            `json:"status" gorm:"type:varchar(20);default:'draft'"`
	Items       []TransactionItem `json:"items" gorm:"foreignKey:TransactionID"`
	CreatedAt   time.Time         `json:"created_at"`
	UpdatedAt   time.Time         `json:"updated_at"`
}

func (Transaction) TableName() string { return "transactions" }

type TransactionItem struct {
	ID            int64   `json:"id" gorm:"primaryKey;autoIncrement"`
	TransactionID int64   `json:"transaction_id" gorm:"not null"`
	ItemID        int64   `json:"item_id" gorm:"not null"`
	Qty           int     `json:"qty" gorm:"not null"`
	Price         float64 `json:"price" gorm:"not null"`
	Subtotal      float64 `json:"subtotal" gorm:"not null"`
}

func (TransactionItem) TableName() string { return "transaction_items" }
