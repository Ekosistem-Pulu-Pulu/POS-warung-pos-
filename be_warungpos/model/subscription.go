package model

import "time"

type Subscription struct {
	ID        int64     `json:"id" gorm:"primaryKey;autoIncrement"`
	StoreID   int64     `json:"store_id" gorm:"not null;index"`
	Plan      string    `json:"plan" gorm:"type:varchar(20);default:'basic'"`
	Status    string    `json:"status" gorm:"type:varchar(20);default:'active'"`
	StartedAt time.Time `json:"started_at"`
	ExpiresAt time.Time `json:"expires_at"`
	CreatedAt time.Time `json:"created_at"`
}
