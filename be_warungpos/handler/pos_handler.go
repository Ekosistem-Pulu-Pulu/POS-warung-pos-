package handler

import (
	"be_warungpos/model"
	"be_warungpos/repository"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type InputPayload struct {
	UserID string `json:"user_id"`
	Items  []struct {
		ItemID int64 `json:"item_id"`
		Qty    int   `json:"qty"`
	} `json:"items"`
}

type IdPayload struct {
	TransactionID int64 `json:"transaction_id"`
}

func GetAllItems(c *fiber.Ctx) error {
	items, err := repository.GetAllItems()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(model.Response{
			Message: "gagal mengambil data produk",
			Error:   err.Error(),
		})
	}
	return c.JSON(model.Response{
		Message: "berhasil mengambil data produk",
		Data:    items,
	})
}

func PosInput(c *fiber.Ctx) error {
	var payload InputPayload
	if err := c.BodyParser(&payload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(model.Response{
			Message: "payload tidak valid",
			Error:   err.Error(),
		})
	}

	if payload.UserID == "" || len(payload.Items) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(model.Response{
			Message: "user_id dan items tidak boleh kosong",
		})
	}

	trx := model.Transaction{
		UserID: payload.UserID,
		Status: "draft",
	}

	var trxItems []model.TransactionItem
	for _, it := range payload.Items {
		itemDB, err := repository.GetItemByID(it.ItemID)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(model.Response{
				Message: fmt.Sprintf("item dengan id %d tidak ditemukan", it.ItemID),
				Error:   err.Error(),
			})
		}
		
		subtotal := itemDB.Price * float64(it.Qty)
		trxItems = append(trxItems, model.TransactionItem{
			ItemID:   itemDB.ID,
			Qty:      it.Qty,
			Price:    itemDB.Price,
			Subtotal: subtotal,
		})
	}

	trx.Items = trxItems
	data, err := repository.CreateTransaction(&trx)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(model.Response{
			Message: "gagal membuat transaksi draft",
			Error:   err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(model.Response{
		Message: "berhasil membuat input (draft) transaksi",
		Data:    data,
	})
}

func PosGenerate(c *fiber.Ctx) error {
	var payload IdPayload
	if err := c.BodyParser(&payload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(model.Response{
			Message: "payload tidak valid",
			Error:   err.Error(),
		})
	}

	trx, err := repository.GetTransactionByID(payload.TransactionID)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(model.Response{
				Message: "transaksi tidak ditemukan",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(model.Response{
			Message: "gagal mengambil transaksi",
			Error:   err.Error(),
		})
	}

	if trx.Status != "draft" {
		return c.Status(fiber.StatusBadRequest).JSON(model.Response{
			Message: "transaksi bukan berstatus draft",
		})
	}

	var totalAmount float64
	for _, it := range trx.Items {
		totalAmount += it.Subtotal
	}

	// Hitung fee POS 1%
	feePOS := totalAmount * 0.01
	grandTotal := totalAmount + feePOS

	err = repository.UpdateTransactionStatus(trx.ID, "generated", feePOS, totalAmount, grandTotal)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(model.Response{
			Message: "gagal update kalkulasi transaksi",
			Error:   err.Error(),
		})
	}

	trx.TotalAmount = totalAmount
	trx.FeePOS = feePOS
	trx.GrandTotal = grandTotal
	trx.Status = "generated"

	return c.JSON(model.Response{
		Message: "berhasil generate total dan fee transaksi",
		Data:    trx,
	})
}

func PosPay(c *fiber.Ctx) error {
	var payload IdPayload
	if err := c.BodyParser(&payload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(model.Response{
			Message: "payload tidak valid",
			Error:   err.Error(),
		})
	}

	trx, err := repository.GetTransactionByID(payload.TransactionID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(model.Response{
			Message: "transaksi tidak ditemukan",
			Error:   err.Error(),
		})
	}

	if trx.Status != "generated" {
		return c.Status(fiber.StatusBadRequest).JSON(model.Response{
			Message: "transaksi belum digenerate atau sudah dibayar",
		})
	}

	// Simulasi kirim payment request ke Gateway (SmartBank)
	gatewayURL := os.Getenv("GATEWAY_URL")
	if gatewayURL == "" {
		gatewayURL = "http://localhost:8080/gateway" // default fallback
	}

	// Buat payload untuk gateway
	paymentPayload := map[string]interface{}{
		"user_id":        trx.UserID,
		"transaction_id": trx.ID,
		"amount":         trx.GrandTotal,
		"source":         "warungpos",
	}

	jsonPayload, _ := json.Marshal(paymentPayload)
	log.Printf("Mengirim payment request ke: %s dengan payload: %s", gatewayURL, string(jsonPayload))

	// Mocking request ke gateway
	// Karena ini simulasi dan gateway mungkin belum hidup, kita mock HTTP call nya
	// Namun secara ideal, begini cara panggilnya:
	// resp, err := http.Post(gatewayURL+"/pay", "application/json", bytes.NewBuffer(jsonPayload))
	
	// === MOCKING ===
	mockGatewaySuccess := true
	if !mockGatewaySuccess {
		return c.Status(fiber.StatusBadGateway).JSON(model.Response{
			Message: "gateway menolak request pembayaran",
		})
	}
	// ===============

	// Anggap gateway mengembalikan sukses
	err = repository.UpdateTransactionStatusOnly(trx.ID, "paid")
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(model.Response{
			Message: "pembayaran sukses tapi gagal update status DB",
			Error:   err.Error(),
		})
	}

	trx.Status = "paid"
	return c.JSON(model.Response{
		Message: "berhasil melakukan pembayaran melalui SmartBank",
		Data:    trx,
	})
}

func PosRiwayat(c *fiber.Ctx) error {
	userID := c.Params("user_id")
	if userID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(model.Response{
			Message: "user_id dibutuhkan di URL parameter",
		})
	}

	data, err := repository.GetHistoryByUserID(userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(model.Response{
			Message: "gagal mengambil riwayat transaksi",
			Error:   err.Error(),
		})
	}

	return c.JSON(model.Response{
		Message: "berhasil mengambil riwayat transaksi",
		Data:    data,
	})
}

func PosBiaya(c *fiber.Ctx) error {
	trxIDStr := c.Params("transaction_id")
	trxID, err := strconv.ParseInt(trxIDStr, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(model.Response{
			Message: "transaction_id tidak valid",
			Error:   err.Error(),
		})
	}

	trx, err := repository.GetTransactionByID(trxID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(model.Response{
			Message: "transaksi tidak ditemukan",
			Error:   err.Error(),
		})
	}

	return c.JSON(model.Response{
		Message: "berhasil mengambil info biaya transaksi",
		Data: map[string]interface{}{
			"transaction_id": trx.ID,
			"total_amount":   trx.TotalAmount,
			"fee_pos":        trx.FeePOS,
			"grand_total":    trx.GrandTotal,
			"status":         trx.Status,
		},
	})
}
