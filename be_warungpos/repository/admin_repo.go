package repository

import (
	"be_warungpos/config"
	"be_warungpos/model"
)

func GetAllStores() ([]model.Store, error) {
	var stores []model.Store
	result := config.GetDB().Find(&stores)
	return stores, result.Error
}

func GetAllUsersGlobal() ([]model.User, error) {
	var users []model.User
	result := config.GetDB().Find(&users)
	return users, result.Error
}

func GetAllTransactionsGlobal() ([]model.Transaction, error) {
	var transactions []model.Transaction
	result := config.GetDB().Order("created_at desc").Find(&transactions)
	return transactions, result.Error
}

func CreateStoreWithOwner(store *model.Store, user *model.User, plan string) error {
	tx := config.GetDB().Begin()
	if tx.Error != nil {
		return tx.Error
	}

	// 1. Create Store (temporarily without OwnerID)
	if err := tx.Create(store).Error; err != nil {
		tx.Rollback()
		return err
	}

	// 2. Create Owner User
	user.StoreID = store.ID
	if err := tx.Create(user).Error; err != nil {
		tx.Rollback()
		return err
	}

	// 3. Update Store with OwnerID
	if err := tx.Model(store).Update("owner_id", user.ID).Error; err != nil {
		tx.Rollback()
		return err
	}

	// 4. Create Subscription
	sub := &model.Subscription{
		StoreID: store.ID,
		Plan:    plan,
		Status:  "active",
	}
	if err := tx.Create(sub).Error; err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}

func UpdateStoreStatus(storeID int64, isActive bool) error {
	return config.GetDB().Model(&model.Store{}).Where("id = ?", storeID).Update("is_active", isActive).Error
}

func UpdateStoreSubscription(storeID int64, plan string) error {
	return config.GetDB().Model(&model.Subscription{}).Where("store_id = ?", storeID).Update("plan", plan).Error
}
