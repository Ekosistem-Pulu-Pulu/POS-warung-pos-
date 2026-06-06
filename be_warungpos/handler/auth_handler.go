package handler

import (
	"be_warungpos/middleware"
	"be_warungpos/model"
	"be_warungpos/repository"
	"os"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// registerPayload mendefinisikan body request untuk POST /auth/register
type registerPayload struct {
	Name            string `json:"name"`
	Username        string `json:"username"`
	Email           string `json:"email"`
	Password        string `json:"password"`
	Role            string `json:"role"`
	SmartBankUserID string `json:"smartbank_user_id"`
}

// RegisterStore mendaftarkan toko baru beserta owner secara mandiri (public)
// POST /api/auth/register-store
func RegisterStore(c *fiber.Ctx) error {
	var payload struct {
		StoreName string `json:"store_name"`
		Address   string `json:"address"`
		Phone     string `json:"phone"`
		OwnerName string `json:"owner_name"`
		Email     string `json:"email"`
		Username  string `json:"username"`
		Password  string `json:"password"`
	}

	if err := c.BodyParser(&payload); err != nil {
		return c.Status(400).JSON(model.Response{Message: "Payload tidak valid"})
	}

	if payload.StoreName == "" || payload.OwnerName == "" || payload.Email == "" || payload.Username == "" || payload.Password == "" {
		return c.Status(400).JSON(model.Response{Message: "Semua kolom wajib diisi"})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(payload.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(500).JSON(model.Response{Message: "Gagal memproses password", Error: err.Error()})
	}

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

	// Default plan is 'basic'
	err = repository.CreateStoreWithOwner(store, user, "basic")
	if err != nil {
		errStr := strings.ToLower(err.Error())
		if strings.Contains(errStr, "duplicate") || strings.Contains(errStr, "unique constraint failed") {
			return c.Status(409).JSON(model.Response{Message: "Username atau email sudah digunakan"})
		}
		return c.Status(500).JSON(model.Response{Message: "Gagal mendaftar toko", Error: err.Error()})
	}

	return c.Status(201).JSON(model.Response{Message: "Toko berhasil didaftarkan"})
}

// loginPayload mendefinisikan body request untuk POST /auth/login
// Field "identifier" bisa diisi email ATAU username
type loginPayload struct {
	Identifier string `json:"identifier"` // email atau username
	Password   string `json:"password"`
}

// Register mendaftarkan user baru (hanya bisa dilakukan oleh owner)
// POST /api/auth/register
func Register(c *fiber.Ctx) error {
	var payload registerPayload
	if err := c.BodyParser(&payload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(model.Response{
			Message: "payload tidak valid",
			Error:   err.Error(),
		})
	}

	// Validasi field wajib
	if payload.Name == "" || payload.Username == "" || payload.Email == "" ||
		payload.Password == "" || payload.Role == "" {
		return c.Status(fiber.StatusBadRequest).JSON(model.Response{
			Message: "name, username, email, password, dan role wajib diisi",
		})
	}

	// Validasi role
	validRoles := map[string]bool{"owner": true, "kasir": true, "gudang": true}
	if !validRoles[payload.Role] {
		return c.Status(fiber.StatusBadRequest).JSON(model.Response{
			Message: "role tidak valid, gunakan: owner, kasir, atau gudang",
		})
	}

	// Hash password menggunakan bcrypt
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(payload.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(model.Response{
			Message: "gagal memproses password",
			Error:   err.Error(),
		})
	}

	// Ambil StoreID dari Owner yang mendaftarkan
	claims, ok := c.Locals("user").(*middleware.JWTClaims)
	var storeID int64
	if ok && claims != nil {
		storeID = claims.StoreID
	}

	// Validasi Limitasi Langganan
	if storeID != 0 {
		sub, err := repository.GetSubscriptionByStoreID(storeID)
		if err == nil {
			users, _ := repository.GetUsersByStoreID(storeID)
			
			limit := 1 // Basic limit
			if sub.Plan == "pro" {
				limit = 5
			} else if sub.Plan == "enterprise" {
				limit = 9999
			}
			
			if len(users) >= limit {
				return c.Status(fiber.StatusForbidden).JSON(model.Response{
					Message: "Batas kuota pengguna telah tercapai untuk paket " + sub.Plan + ". Silakan upgrade paket Anda.",
				})
			}
		}
	}

	user := &model.User{
		Name:            payload.Name,
		Username:        payload.Username,
		Email:           payload.Email,
		Password:        string(hashedPassword),
		Role:            payload.Role,
		StoreID:         storeID,
		SmartBankUserID: payload.SmartBankUserID,
		IsActive:        true,
	}

	created, err := repository.CreateUser(user)
	if err != nil {
		// Deteksi duplicate entry
		if strings.Contains(err.Error(), "Duplicate") || strings.Contains(err.Error(), "duplicate") {
			return c.Status(fiber.StatusConflict).JSON(model.Response{
				Message: "username atau email sudah digunakan",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(model.Response{
			Message: "gagal mendaftarkan user",
			Error:   err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(model.Response{
		Message: "user berhasil didaftarkan",
		Data:    created,
	})
}

// Login mengautentikasi user dan mengembalikan JWT token
// POST /api/auth/login
// Field "identifier" bisa berupa email (mengandung "@") atau username
func Login(c *fiber.Ctx) error {
	var payload loginPayload
	if err := c.BodyParser(&payload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(model.Response{
			Message: "payload tidak valid",
			Error:   err.Error(),
		})
	}

	if payload.Identifier == "" || payload.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(model.Response{
			Message: "identifier (email/username) dan password wajib diisi",
		})
	}

	// Deteksi otomatis: email atau username
	var user model.User
	var err error
	if strings.Contains(payload.Identifier, "@") {
		user, err = repository.GetUserByEmail(payload.Identifier)
	} else {
		user, err = repository.GetUserByUsername(payload.Identifier)
	}

	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(model.Response{
			Message: "email/username atau password salah",
		})
	}

	// Verifikasi password dengan bcrypt
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(payload.Password)); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(model.Response{
			Message: "email/username atau password salah",
		})
	}

	// Cek apakah akun user ini aktif
	if !user.IsActive {
		return c.Status(fiber.StatusUnauthorized).JSON(model.Response{
			Message: "Akun Anda dinonaktifkan. Hubungi owner Anda.",
		})
	}

	// Cek apakah toko aktif
	var storeName, storeAddress string
	if user.Role != "superadmin" && user.StoreID > 0 {
		store, err := repository.GetStoreByID(user.StoreID)
		if err == nil {
			if !store.IsActive {
				return c.Status(fiber.StatusForbidden).JSON(model.Response{
					Message: "Toko Anda dinonaktifkan oleh admin. Hubungi tim WarungPOS.",
				})
			}
			storeName = store.Name
			storeAddress = store.Address
		}
	}

	// Generate JWT token dengan masa berlaku 8 jam
	secret := os.Getenv("JWT_SECRET")
	claims := middleware.JWTClaims{
		ID:              user.ID,
		Username:        user.Username,
		Email:           user.Email,
		Role:            user.Role,
		StoreID:         user.StoreID,
		SmartBankUserID: user.SmartBankUserID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(8 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString([]byte(secret))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(model.Response{
			Message: "gagal membuat token",
			Error:   err.Error(),
		})
	}

	return c.JSON(model.Response{
		Message: "login berhasil",
		Data: fiber.Map{
			"token": signed,
			"user": fiber.Map{
				"id":            user.ID,
				"name":          user.Name,
				"username":      user.Username,
				"email":         user.Email,
				"role":          user.Role,
				"store_id":      user.StoreID,
				"store_name":    storeName,
				"store_address": storeAddress,
			},
		},
	})
}

// Me mengembalikan profil user yang sedang login berdasarkan JWT
// GET /api/auth/me
func Me(c *fiber.Ctx) error {
	claims, ok := c.Locals("user").(*middleware.JWTClaims)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(model.Response{
			Message: "tidak terautentikasi",
		})
	}

	user, err := repository.GetUserByID(claims.ID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(model.Response{
			Message: "user tidak ditemukan",
		})
	}

	var storeName, storeAddress string
	if user.StoreID > 0 {
		store, err := repository.GetStoreByID(user.StoreID)
		if err == nil {
			storeName = store.Name
			storeAddress = store.Address
		}
	}

	return c.JSON(model.Response{
		Message: "berhasil mengambil profil",
		Data: fiber.Map{
			"id":            user.ID,
			"name":          user.Name,
			"username":      user.Username,
			"email":         user.Email,
			"role":          user.Role,
			"store_id":      user.StoreID,
			"store_name":    storeName,
			"store_address": storeAddress,
		},
	})
}

// GetAllUsers mengembalikan daftar semua user (Hanya Owner) untuk tokonya saja
// GET /api/auth/users
func GetAllUsers(c *fiber.Ctx) error {
	claims, ok := c.Locals("user").(*middleware.JWTClaims)
	if !ok || claims == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(model.Response{Message: "Unauthorized"})
	}

	users, err := repository.GetUsersByStoreID(claims.StoreID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(model.Response{
			Message: "gagal mengambil data user",
			Error:   err.Error(),
		})
	}

	return c.JSON(model.Response{
		Message: "berhasil mengambil data user",
		Data:    users,
	})
}

// UpdateUserStatus mengubah status aktif/non-aktif user (Hanya Owner)
// PUT /api/auth/users/:id/status
func UpdateUserStatus(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(model.Response{
			Message: "id tidak valid",
		})
	}

	var payload struct {
		IsActive bool `json:"is_active"`
	}
	if err := c.BodyParser(&payload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(model.Response{
			Message: "payload tidak valid",
		})
	}

	claims, ok := c.Locals("user").(*middleware.JWTClaims)
	if !ok || claims == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(model.Response{Message: "Unauthorized"})
	}

	err = repository.UpdateUserActiveStatus(int64(id), claims.StoreID, payload.IsActive)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(model.Response{
			Message: "gagal mengubah status user",
			Error:   err.Error(),
		})
	}

	return c.JSON(model.Response{
		Message: "status user berhasil diubah",
	})
}
