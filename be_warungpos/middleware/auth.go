package middleware

import (
	"be_warungpos/model"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

// JWTClaims mendefinisikan isi payload JWT
type JWTClaims struct {
	ID              int64  `json:"id"`
	Username        string `json:"username"`
	Email           string `json:"email"`
	Role            string `json:"role"`
	StoreID         int64  `json:"store_id"`
	SmartBankUserID string `json:"smartbank_user_id"`
	jwt.RegisteredClaims
}

// AuthMiddleware memverifikasi JWT token dari header Authorization
// dan meng-inject claims ke dalam fiber.Ctx Locals("user")
func AuthMiddleware(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if !strings.HasPrefix(authHeader, "Bearer ") {
		return c.Status(fiber.StatusUnauthorized).JSON(model.Response{
			Message: "token tidak ditemukan, silakan login terlebih dahulu",
		})
	}

	tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return c.Status(fiber.StatusInternalServerError).JSON(model.Response{
			Message: "konfigurasi server tidak valid",
		})
	}

	token, err := jwt.ParseWithClaims(tokenStr, &JWTClaims{}, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fiber.ErrUnauthorized
		}
		return []byte(secret), nil
	})

	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(model.Response{
			Message: "token tidak valid atau sudah kadaluarsa",
		})
	}

	claims, ok := token.Claims.(*JWTClaims)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(model.Response{
			Message: "token tidak dapat dibaca",
		})
	}

	// Inject claims ke context agar bisa diakses handler
	c.Locals("user", claims)
	return c.Next()
}
