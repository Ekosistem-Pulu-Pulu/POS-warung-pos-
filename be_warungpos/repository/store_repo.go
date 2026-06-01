package repository

import (
	"be_warungpos/config"
	"be_warungpos/model"
)

func GetStoreByID(id int64) (model.Store, error) {
	var store model.Store
	result := config.GetDB().First(&store, "id = ?", id)
	return store, result.Error
}

func CreateStore(store *model.Store) (*model.Store, error) {
	result := config.GetDB().Create(store)
	return store, result.Error
}

func GetSubscriptionByStoreID(storeID int64) (model.Subscription, error) {
	var sub model.Subscription
	result := config.GetDB().First(&sub, "store_id = ?", storeID)
	return sub, result.Error
}

func CreateSubscription(sub *model.Subscription) error {
	return config.GetDB().Create(sub).Error
}

func UpdateStore(store *model.Store) error {
	return config.GetDB().Save(store).Error
}
