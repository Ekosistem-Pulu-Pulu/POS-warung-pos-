package model

import "time"

type StockMovement struct {
	ID        int64     `json:"id" gorm:"primaryKey;autoIncrement"`
	StoreID   int64     `json:"store_id" gorm:"not null;index"`
	ItemID    int64     `json:"item_id" gorm:"not null"`
	Type      string    `json:"type" gorm:"type:varchar(20);not null"`
	Qty       int       `json:"qty" gorm:"not null"`
	Note      string    `json:"note,omitempty" gorm:"type:varchar(255)"`
	UserID    int64     `json:"user_id" gorm:"not null"`
	CreatedAt time.Time `json:"created_at"`
}
