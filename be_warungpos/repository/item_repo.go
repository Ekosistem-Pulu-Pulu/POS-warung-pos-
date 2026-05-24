package repository

import (
	"be_warungpos/config"
	"be_warungpos/model"
)

func GetAllItems() ([]model.Item, error) {
	var items []model.Item
	result := config.GetDB().Find(&items)
	return items, result.Error
}

func GetItemByID(id int64) (model.Item, error) {
	var item model.Item
	result := config.GetDB().First(&item, "id = ?", id)
	return item, result.Error
}

func InsertItem(item *model.Item) (*model.Item, error) {
	result := config.GetDB().Create(item)
	return item, result.Error
}
