package repository

import (
	"be_warungpos/config"
	"be_warungpos/model"
)

// GetUserByEmail mencari user berdasarkan alamat email
func GetUserByEmail(email string) (model.User, error) {
	var user model.User
	result := config.GetDB().Where("email = ? AND is_active = true", email).First(&user)
	return user, result.Error
}

// GetUserByUsername mencari user berdasarkan username
func GetUserByUsername(username string) (model.User, error) {
	var user model.User
	result := config.GetDB().Where("username = ? AND is_active = true", username).First(&user)
	return user, result.Error
}

// GetUserByID mencari user berdasarkan ID
func GetUserByID(id int64) (model.User, error) {
	var user model.User
	result := config.GetDB().First(&user, "id = ?", id)
	return user, result.Error
}

// CreateUser menyimpan user baru ke database
func CreateUser(user *model.User) (*model.User, error) {
	result := config.GetDB().Create(user)
	return user, result.Error
}

// UpdateUserActiveStatus mengaktifkan atau menonaktifkan user untuk toko tertentu
func UpdateUserActiveStatus(id int64, storeID int64, isActive bool) error {
	return config.GetDB().Model(&model.User{}).
		Where("id = ? AND store_id = ?", id, storeID).
		Update("is_active", isActive).Error
}

// GetUsersByStoreID mengambil semua data user untuk suatu toko tertentu
func GetUsersByStoreID(storeID int64) ([]model.User, error) {
	var users []model.User
	result := config.GetDB().Select("id, name, username, email, role, smartbank_user_id, is_active, created_at").
		Where("store_id = ?", storeID).Find(&users)
	return users, result.Error
}
