package middleware

import (
	"be_warungpos/model"

	"github.com/gofiber/fiber/v2"
)

// RoleMiddleware mengembalikan handler yang mengizinkan akses hanya untuk role tertentu.
// Harus dipasang SETELAH AuthMiddleware agar claims sudah tersedia.
func RoleMiddleware(allowedRoles ...string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims, ok := c.Locals("user").(*JWTClaims)
		if !ok || claims == nil {
			return c.Status(fiber.StatusUnauthorized).JSON(model.Response{
				Message: "user tidak terautentikasi",
			})
		}

		for _, role := range allowedRoles {
			if claims.Role == role {
				return c.Next()
			}
		}

		return c.Status(fiber.StatusForbidden).JSON(model.Response{
			Message: "akses ditolak: role '" + claims.Role + "' tidak memiliki izin untuk endpoint ini",
		})
	}
}

// ==========================================
// Shorthand middleware helpers
// ==========================================

// OwnerOnly hanya mengizinkan role owner
var OwnerOnly = RoleMiddleware("owner")

// KasirOnly hanya mengizinkan role kasir
var KasirOnly = RoleMiddleware("kasir")

// GudangOnly hanya mengizinkan role gudang
var GudangOnly = RoleMiddleware("gudang")

// OwnerOrKasir mengizinkan role owner dan kasir
var OwnerOrKasir = RoleMiddleware("owner", "kasir")

// GudangOrOwner mengizinkan gudang dan owner
var GudangOrOwner = RoleMiddleware("owner", "gudang")

// SuperadminOnly hanya mengizinkan role superadmin
var SuperadminOnly = RoleMiddleware("superadmin")

// SuperadminOrOwner mengizinkan superadmin dan owner
var SuperadminOrOwner = RoleMiddleware("superadmin", "owner")

// AllRoles mengizinkan semua role yang valid
var AllRoles = RoleMiddleware("owner", "kasir", "gudang", "superadmin")
