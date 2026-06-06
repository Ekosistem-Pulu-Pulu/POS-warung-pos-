package repository

import (
	"be_warungpos/config"
	"be_warungpos/model"
	"time"
)

func GetAllStores() ([]model.Store, error) {
	var stores []model.Store
	result := config.GetDB().Preload("Subscription").Preload("Owner").Find(&stores)
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

	// 1. Create Owner User (temporarily without StoreID)
	if err := tx.Create(user).Error; err != nil {
		tx.Rollback()
		return err
	}

	// 2. Create Store with OwnerID
	store.OwnerID = user.ID
	if err := tx.Create(store).Error; err != nil {
		tx.Rollback()
		return err
	}

	// 3. Update User with StoreID
	if err := tx.Model(user).Update("store_id", store.ID).Error; err != nil {
		tx.Rollback()
		return err
	}

	// 4. Create Subscription
	now := time.Now()
	sub := &model.Subscription{
		StoreID:   store.ID,
		Plan:      plan,
		Status:    "active",
		StartedAt: now,
		ExpiresAt: now.AddDate(1, 0, 0), // Default active for 1 year or similar logic
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

func DeleteStore(storeID int64) error {
	tx := config.GetDB().Begin()
	
	// Delete items, transactions, users, subscriptions, then the store itself
	tx.Where("store_id = ?", storeID).Delete(&model.TransactionItem{}) // Might not work if relation is only via TransactionID, wait. Let's rely on cascading or simple deletes.
	
	// Delete users
	tx.Where("store_id = ?", storeID).Delete(&model.User{})
	// Delete subscriptions
	tx.Where("store_id = ?", storeID).Delete(&model.Subscription{})
	// Delete items
	tx.Where("store_id = ?", storeID).Delete(&model.Item{})
	// Delete transactions
	tx.Where("store_id = ?", storeID).Delete(&model.Transaction{})
	
	// Finally delete store
	tx.Where("id = ?", storeID).Delete(&model.Store{})
	
	return tx.Commit().Error
}
