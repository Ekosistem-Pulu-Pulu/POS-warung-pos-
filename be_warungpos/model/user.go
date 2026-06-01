package model

import "time"

type User struct {
	ID              int64     `json:"id" gorm:"primaryKey;autoIncrement"`
	Name            string    `json:"name" gorm:"type:varchar(100);not null"`
	Username        string    `json:"username" gorm:"type:varchar(50);uniqueIndex;not null"`
	Email           string    `json:"email" gorm:"type:varchar(100);uniqueIndex;not null"`
	Password        string    `json:"-" gorm:"type:varchar(255);not null"`
	Role            string    `json:"role" gorm:"type:varchar(20);not null"`
	StoreID         int64     `json:"store_id" gorm:"index"`
	SmartBankUserID string    `json:"smartbank_user_id,omitempty" gorm:"type:varchar(100)"`
	IsActive        bool      `json:"is_active" gorm:"default:true"`
	CreatedAt       time.Time `json:"created_at"`
}

func (User) TableName() string { return "users" }
