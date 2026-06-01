package handler

import (
	"be_warungpos/model"
	"be_warungpos/repository"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

// AdminDashboard mengembalikan statistik platform
func AdminDashboard(c *fiber.Ctx) error {
	stores, _ := repository.GetAllStores()
	users, _ := repository.GetAllUsersGlobal()
	
	activeStores := 0
	for _, s := range stores {
		if s.IsActive {
			activeStores++
		}
	}

	return c.JSON(model.Response{
		Message: "Dashboard stats",
		Data: fiber.Map{
			"total_stores":  len(stores),
			"active_stores": activeStores,
			"total_users":   len(users),
		},
	})
}

// AdminGetStores mengembalikan semua toko
func AdminGetStores(c *fiber.Ctx) error {
	stores, err := repository.GetAllStores()
	if err != nil {
		return c.Status(500).JSON(model.Response{Message: "Gagal memuat toko"})
	}
	return c.JSON(model.Response{Data: stores})
}

// AdminCreateStore membuat toko beserta akun owner dan langganan awal
func AdminCreateStore(c *fiber.Ctx) error {
	var payload struct {
		StoreName string `json:"store_name"`
		Address   string `json:"address"`
		Phone     string `json:"phone"`
		OwnerName string `json:"owner_name"`
		Email     string `json:"email"`
		Username  string `json:"username"`
		Password  string `json:"password"`
		Plan      string `json:"plan"`
	}

	if err := c.BodyParser(&payload); err != nil {
		return c.Status(400).JSON(model.Response{Message: "Payload tidak valid"})
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(payload.Password), bcrypt.DefaultCost)

	store := &model.Store{
		Name:    payload.StoreName,
		Address: payload.Address,
		Phone:   payload.Phone,
	}

	user := &model.User{
		Name:     payload.OwnerName,
		Username: payload.Username,
		Email:    payload.Email,
		Password: string(hashedPassword),
		Role:     "owner",
		IsActive: true,
	}

	err := repository.CreateStoreWithOwner(store, user, payload.Plan)
	if err != nil {
		return c.Status(500).JSON(model.Response{Message: "Gagal membuat toko", Error: err.Error()})
	}

	return c.JSON(model.Response{Message: "Toko berhasil dibuat"})
}

// AdminToggleStoreStatus mengubah status aktif toko
func AdminToggleStoreStatus(c *fiber.Ctx) error {
	id, _ := c.ParamsInt("id")
	var payload struct {
		IsActive bool `json:"is_active"`
	}
	c.BodyParser(&payload)

	err := repository.UpdateStoreStatus(int64(id), payload.IsActive)
	if err != nil {
		return c.Status(500).JSON(model.Response{Message: "Gagal update status toko"})
	}
	return c.JSON(model.Response{Message: "Status toko diupdate"})
}

func AdminChangeSubscription(c *fiber.Ctx) error {
	id, _ := c.ParamsInt("id")
	var payload struct {
		Plan string `json:"plan"`
	}
	c.BodyParser(&payload)

	err := repository.UpdateStoreSubscription(int64(id), payload.Plan)
	if err != nil {
		return c.Status(500).JSON(model.Response{Message: "Gagal update paket langganan"})
	}
	return c.JSON(model.Response{Message: "Paket langganan diupdate"})
}

func AdminGetAllUsers(c *fiber.Ctx) error {
	users, _ := repository.GetAllUsersGlobal()
	return c.JSON(model.Response{Data: users})
}

func AdminGetAllTransactions(c *fiber.Ctx) error {
	trx, _ := repository.GetAllTransactionsGlobal()
	return c.JSON(model.Response{Data: trx})
}
