package handler

import (
	"be_warungpos/middleware"
	"be_warungpos/model"
	"be_warungpos/repository"

	"github.com/gofiber/fiber/v2"
)

// GetMyStore mengembalikan detail toko user
func GetMyStore(c *fiber.Ctx) error {
	claims := c.Locals("user").(*middleware.JWTClaims)
	store, err := repository.GetStoreByID(claims.StoreID)
	if err != nil {
		return c.Status(404).JSON(model.Response{Message: "Toko tidak ditemukan"})
	}
	return c.JSON(model.Response{Data: store})
}

// UpdateMyStore memperbarui detail toko
func UpdateMyStore(c *fiber.Ctx) error {
	claims := c.Locals("user").(*middleware.JWTClaims)
	var payload struct {
		Name    string `json:"name"`
		Address string `json:"address"`
		Phone   string `json:"phone"`
	}
	if err := c.BodyParser(&payload); err != nil {
		return c.Status(400).JSON(model.Response{Message: "Payload tidak valid"})
	}

	store, err := repository.GetStoreByID(claims.StoreID)
	if err != nil {
		return c.Status(404).JSON(model.Response{Message: "Toko tidak ditemukan"})
	}

	store.Name = payload.Name
	store.Address = payload.Address
	store.Phone = payload.Phone

	// Assuming UpdateStore is added to store_repo.go
	if err := repository.UpdateStore(&store); err != nil {
		return c.Status(500).JSON(model.Response{Message: "Gagal memperbarui toko"})
	}
	return c.JSON(model.Response{Message: "Toko diperbarui"})
}

func GetSubscription(c *fiber.Ctx) error {
	claims := c.Locals("user").(*middleware.JWTClaims)
	sub, err := repository.GetSubscriptionByStoreID(claims.StoreID)
	if err != nil {
		return c.Status(404).JSON(model.Response{Message: "Langganan tidak ditemukan"})
	}
	return c.JSON(model.Response{Data: sub})
}

func UpgradeSubscription(c *fiber.Ctx) error {
	claims := c.Locals("user").(*middleware.JWTClaims)
	var payload struct {
		Plan string `json:"plan"`
	}
	c.BodyParser(&payload)

	// Simulate payment to SmartBank and upgrade
	err := repository.UpdateStoreSubscription(claims.StoreID, payload.Plan)
	if err != nil {
		return c.Status(500).JSON(model.Response{Message: "Gagal memproses langganan"})
	}
	return c.JSON(model.Response{Message: "Berhasil upgrade ke " + payload.Plan})
}

func GetPlans(c *fiber.Ctx) error {
	plans := []fiber.Map{
		{"id": "basic", "name": "Basic", "price": 0, "features": []string{"Kasir POS", "Riwayat Transaksi", "Pembayaran SmartBank"}},
		{"id": "pro", "name": "Pro", "price": 99000, "features": []string{"Fitur Basic", "Manajemen Stok", "Analytics & Laporan"}},
		{"id": "enterprise", "name": "Enterprise", "price": 299000, "features": []string{"Fitur Pro", "Multi-Outlet", "Laporan Konsolidasi"}},
	}
	return c.JSON(model.Response{Data: plans})
}
