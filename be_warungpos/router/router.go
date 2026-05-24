package router

import (
	"be_warungpos/handler"
	"be_warungpos/middleware"
	"be_warungpos/model"

	"github.com/gofiber/fiber/v2"
)

func SetupRouter(app *fiber.App) {
	// Health check (public)
	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(model.Response{
			Message: "API WarungPOS aktif",
		})
	})

	// =============================================
	// AUTH ROUTES — tidak memerlukan token
	// =============================================
	auth := app.Group("/api/auth")
	auth.Post("/login", handler.Login)
	// Register hanya bisa dilakukan oleh owner (butuh token)
	auth.Post("/register", middleware.AuthMiddleware, middleware.OwnerOnly, handler.Register)
	// Manajemen User (Hanya Owner)
	auth.Get("/users", middleware.AuthMiddleware, middleware.OwnerOnly, handler.GetAllUsers)
	auth.Put("/users/:id/status", middleware.AuthMiddleware, middleware.OwnerOnly, handler.UpdateUserStatus)
	// Me butuh token untuk tahu siapa yang sedang login
	auth.Get("/me", middleware.AuthMiddleware, handler.Me)

	// =============================================
	// POS ROUTES — semua butuh autentikasi JWT
	// =============================================
	pos := app.Group("/api/pos", middleware.AuthMiddleware)

	// Daftar Produk — semua role boleh akses
	pos.Get("/produk", middleware.AllRoles, handler.GetAllItems)

	// Input Transaksi — owner dan kasir
	pos.Post("/input", middleware.OwnerOrKasir, handler.PosInput)

	// Generate Tagihan — owner dan kasir
	pos.Post("/generate", middleware.OwnerOrKasir, handler.PosGenerate)

	// Pembayaran — owner dan kasir
	pos.Post("/pay", middleware.OwnerOrKasir, handler.PosPay)

	// Riwayat Transaksi — owner dan kasir
	// Catatan: kasir hanya bisa lihat riwayat miliknya sendiri (dikontrol di handler)
	pos.Get("/riwayat/:user_id", middleware.OwnerOrKasir, handler.PosRiwayat)

	// Detail Biaya — semua role boleh lihat
	pos.Get("/biaya/:transaction_id", middleware.AllRoles, handler.PosBiaya)
}
