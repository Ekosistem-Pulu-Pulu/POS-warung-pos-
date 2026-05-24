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

	user := &model.User{
		Name:            payload.Name,
		Username:        payload.Username,
		Email:           payload.Email,
		Password:        string(hashedPassword),
		Role:            payload.Role,
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

	// Generate JWT token dengan masa berlaku 8 jam
	secret := os.Getenv("JWT_SECRET")
	claims := middleware.JWTClaims{
		ID:              user.ID,
		Username:        user.Username,
		Email:           user.Email,
		Role:            user.Role,
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
				"id":       user.ID,
				"name":     user.Name,
				"username": user.Username,
				"email":    user.Email,
				"role":     user.Role,
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

	return c.JSON(model.Response{
		Message: "berhasil mengambil profil",
		Data:    user,
	})
}

// GetAllUsers mengembalikan daftar semua user (Hanya Owner)
// GET /api/auth/users
func GetAllUsers(c *fiber.Ctx) error {
	users, err := repository.GetAllUsers()
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

	err = repository.UpdateUserActiveStatus(int64(id), payload.IsActive)
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
