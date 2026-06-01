package main

import (
	"be_warungpos/config"
	"be_warungpos/model"
	"be_warungpos/router"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"golang.org/x/crypto/bcrypt"
)

func main() {
	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET,POST,PUT,DELETE,OPTIONS",
	}))

	app.Use(logger.New())

	config.InitDB()
	
	// AutoMigrate database (urutan penting: User dulu karena transactions butuh FK kasir_id)
	err := config.GetDB().AutoMigrate(
		&model.User{}, &model.Item{}, &model.Transaction{}, &model.TransactionItem{},
		&model.Store{}, &model.Subscription{}, &model.StockMovement{},
	)
	if err != nil {
		log.Fatalf("Gagal migrasi database: %v", err)
	}

	// Seed superadmin
	var adminCount int64
	config.GetDB().Model(&model.User{}).Where("role = ?", "superadmin").Count(&adminCount)
	if adminCount == 0 {
		hashedPw, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
		config.GetDB().Create(&model.User{
			Name: "Platform Admin", Username: "admin",
			Email: "admin@warungpos.id", Password: string(hashedPw),
			Role: "superadmin", IsActive: true,
		})
		log.Println("✅ Superadmin default: admin / admin123")
	}

	// Seed data item jika masih kosong
	var count int64
	config.GetDB().Model(&model.Item{}).Count(&count)
	if count == 0 {
		items := []model.Item{
			{Name: "Indomie Goreng", Price: 3000, Stock: 100},
			{Name: "Beras 1Kg", Price: 15000, Stock: 50},
			{Name: "Telur 1Kg", Price: 25000, Stock: 20},
			{Name: "Kopi Sachet", Price: 1500, Stock: 200},
		}
		config.GetDB().Create(&items)
		log.Println("✅ Berhasil seed data master Item")
	}

	router.SetupRouter(app)

	log.Println("WarungPOS backend is running on port 3001")
	app.Listen(":3001")
}
