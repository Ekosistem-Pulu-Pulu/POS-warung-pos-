package handler

import (
	"be_warungpos/middleware"
	"be_warungpos/model"
	"be_warungpos/repository"

	"github.com/gofiber/fiber/v2"
)

func InventoryDashboard(c *fiber.Ctx) error {
	claims := c.Locals("user").(*middleware.JWTClaims)
	items, _ := repository.GetAllItemsByStore(claims.StoreID)
	lowStock, _ := repository.GetLowStockItems(claims.StoreID)
	
	outOfStock := 0
	for _, item := range items {
		if item.Stock <= 0 {
			outOfStock++
		}
	}

	return c.JSON(model.Response{
		Data: fiber.Map{
			"total_products": len(items),
			"low_stock":      len(lowStock),
			"out_of_stock":   outOfStock,
		},
	})
}

func InventoryProducts(c *fiber.Ctx) error {
	claims := c.Locals("user").(*middleware.JWTClaims)
	items, _ := repository.GetAllItemsByStore(claims.StoreID)
	return c.JSON(model.Response{Data: items})
}

func InventoryCreateProduct(c *fiber.Ctx) error {
	claims := c.Locals("user").(*middleware.JWTClaims)
	var item model.Item
	if err := c.BodyParser(&item); err != nil {
		return c.Status(400).JSON(model.Response{Message: "Invalid input"})
	}
	item.StoreID = claims.StoreID
	repository.InsertItem(&item)
	return c.JSON(model.Response{Message: "Produk ditambahkan", Data: item})
}

func InventoryUpdateProduct(c *fiber.Ctx) error {
	claims := c.Locals("user").(*middleware.JWTClaims)
	id, _ := c.ParamsInt("id")
	item, err := repository.GetItemByIDAndStore(int64(id), claims.StoreID)
	if err != nil {
		return c.Status(404).JSON(model.Response{Message: "Produk tidak ditemukan"})
	}

	var payload model.Item
	c.BodyParser(&payload)
	item.Name = payload.Name
	item.Price = payload.Price
	item.Category = payload.Category
	item.MinStock = payload.MinStock

	repository.UpdateItem(&item)
	return c.JSON(model.Response{Message: "Produk diupdate"})
}

func InventoryDeleteProduct(c *fiber.Ctx) error {
	claims := c.Locals("user").(*middleware.JWTClaims)
	id, _ := c.ParamsInt("id")
	repository.DeleteItem(int64(id), claims.StoreID)
	return c.JSON(model.Response{Message: "Produk dihapus"})
}

func InventoryRestock(c *fiber.Ctx) error {
	claims := c.Locals("user").(*middleware.JWTClaims)
	var payload struct {
		ItemID int64  `json:"item_id"`
		Qty    int    `json:"qty"`
		Note   string `json:"note"`
	}
	c.BodyParser(&payload)

	err := repository.AdjustStock(claims.StoreID, payload.ItemID, payload.Qty, "restock", payload.Note, claims.ID)
	if err != nil {
		return c.Status(500).JSON(model.Response{Message: "Gagal restock"})
	}
	return c.JSON(model.Response{Message: "Restock berhasil"})
}

func InventoryAdjust(c *fiber.Ctx) error {
	claims := c.Locals("user").(*middleware.JWTClaims)
	var payload struct {
		ItemID int64  `json:"item_id"`
		Qty    int    `json:"qty"`
		Type   string `json:"type"` // "damage", "correction_down", "correction_up"
		Note   string `json:"note"`
	}
	c.BodyParser(&payload)

	err := repository.AdjustStock(claims.StoreID, payload.ItemID, payload.Qty, payload.Type, payload.Note, claims.ID)
	if err != nil {
		return c.Status(500).JSON(model.Response{Message: "Gagal penyesuaian stok"})
	}
	return c.JSON(model.Response{Message: "Penyesuaian stok berhasil"})
}

func InventoryMovements(c *fiber.Ctx) error {
	claims := c.Locals("user").(*middleware.JWTClaims)
	id, _ := c.ParamsInt("item_id")
	movements, _ := repository.GetStockMovements(claims.StoreID, int64(id))
	return c.JSON(model.Response{Data: movements})
}
