package model

type Item struct {
	ID    int64   `json:"id" gorm:"primaryKey;autoIncrement"`
	Name  string  `json:"name" gorm:"type:varchar(100);not null"`
	Price    float64 `json:"price" gorm:"not null"`
	Stock    int     `json:"stock" gorm:"default:0"`
	MinStock int     `json:"min_stock" gorm:"default:10"`
	Category string  `json:"category,omitempty" gorm:"type:varchar(50)"`
	StoreID  int64   `json:"store_id" gorm:"index"`
}

func (Item) TableName() string { return "items" }
