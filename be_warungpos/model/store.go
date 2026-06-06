package model

import "time"

type Store struct {
	ID        int64     `json:"id" gorm:"primaryKey;autoIncrement"`
	Name      string    `json:"name" gorm:"type:varchar(150);not null"`
	Address   string    `json:"address,omitempty" gorm:"type:varchar(255)"`
	Phone     string    `json:"phone,omitempty" gorm:"type:varchar(20)"`
	OwnerID   int64     `json:"owner_id" gorm:"not null"`
	IsActive     bool          `json:"is_active" gorm:"default:true"`
	CreatedAt    time.Time     `json:"created_at"`
	Subscription *Subscription `json:"subscription,omitempty" gorm:"foreignKey:StoreID"`
	Owner        *User         `json:"owner,omitempty" gorm:"foreignKey:OwnerID"`
}
