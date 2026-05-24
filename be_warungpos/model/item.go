package model

type Item struct {
	ID    int64   `json:"id" gorm:"primaryKey;autoIncrement"`
	Name  string  `json:"name" gorm:"type:varchar(100);not null"`
	Price float64 `json:"price" gorm:"not null"`
}

func (Item) TableName() string { return "items" }
