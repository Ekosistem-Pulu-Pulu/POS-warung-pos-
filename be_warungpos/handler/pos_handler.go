package handler

import (
	"be_warungpos/config"
	"be_warungpos/middleware"
	"be_warungpos/model"
	"be_warungpos/repository"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

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
	claims := c.Locals("user").(*middleware.JWTClaims)
	items, err := repository.GetAllItemsByStore(claims.StoreID)
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

	claims := c.Locals("user").(*middleware.JWTClaims)

	trx := model.Transaction{
		UserID:  payload.UserID, // Keep for backward compatibility or change to KasirID string logic if needed
		KasirID: claims.ID,
		StoreID: claims.StoreID,
		Status:  "draft",
	}

	var trxItems []model.TransactionItem
	for _, it := range payload.Items {
		itemDB, err := repository.GetItemByIDAndStore(it.ItemID, claims.StoreID)
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

	claims := c.Locals("user").(*middleware.JWTClaims)
	trx, err := repository.GetTransactionByIDAndStore(payload.TransactionID, claims.StoreID)
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

	claims := c.Locals("user").(*middleware.JWTClaims)
	trx, err := repository.GetTransactionByIDAndStore(payload.TransactionID, claims.StoreID)
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

	// Deduct stock after payment
	for _, it := range trx.Items {
		repository.AdjustStock(claims.StoreID, it.ItemID, it.Qty, "sale", fmt.Sprintf("Sale TRX #%d", trx.ID), claims.ID)
	}

	trx.Status = "paid"
	return c.JSON(model.Response{
		Message: "berhasil melakukan pembayaran melalui SmartBank",
		Data:    trx,
	})
}

func PosRiwayat(c *fiber.Ctx) error {
	claims := c.Locals("user").(*middleware.JWTClaims)

	data, err := repository.GetHistory(claims.StoreID, claims.ID, claims.Role)
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

	claims := c.Locals("user").(*middleware.JWTClaims)
	trx, err := repository.GetTransactionByIDAndStore(trxID, claims.StoreID)
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

// PosAggregatedFees mengembalikan total transaksi dan estimasi fee yang dipotong oleh ekosistem
func PosAggregatedFees(c *fiber.Ctx) error {
	claims := c.Locals("user").(*middleware.JWTClaims)
	
	agg, err := repository.GetAggregatedFeesByStore(claims.StoreID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(model.Response{
			Message: "gagal mengambil agregasi biaya",
			Error:   err.Error(),
		})
	}

	// POS hanya menambahkan Fee POS secara resmi, tetapi untuk dashboard (Estimasi Bersih),
	// kita simulasikan pemotongan dari Gateway, Bank, dan Pajak Sistem berdasarkan Total Amount.
	totalTransaction := agg.TotalAmount
	feePOS := agg.FeePOS // Total Fee POS yang ditarik kasir
	
	feeGateway := totalTransaction * 0.005 // 0.5%
	feeBank := totalTransaction * 0.01     // 1%
	pajakSistem := totalTransaction * 0.02 // 2%

	totalPotongan := feePOS + feeGateway + feeBank + pajakSistem
	estimasiBersih := totalTransaction - totalPotongan

	return c.JSON(model.Response{
		Message: "berhasil mengambil data agregasi",
		Data: map[string]interface{}{
			"total_transaksi": totalTransaction,
			"fee_pos":         feePOS,
			"fee_gateway":     feeGateway,
			"fee_bank":        feeBank,
			"pajak_sistem":    pajakSistem,
			"total_potongan":  totalPotongan,
			"estimasi_bersih": estimasiBersih,
		},
	})
}
func PosDashboard(c *fiber.Ctx) error {
	claims := c.Locals("user").(*middleware.JWTClaims)

	var revenue float64
	var trxCount int64
	var customers int64

	db := config.GetDB()

	// Revenue Hari Ini (hanya paid)
	today := time.Now().Format("2006-01-02")
	db.Model(&model.Transaction{}).
		Where("store_id = ? AND status = 'paid' AND DATE(created_at) = ?", claims.StoreID, today).
		Select("COALESCE(SUM(total_amount), 0)").Scan(&revenue)

	// Transaksi Hari Ini
	db.Model(&model.Transaction{}).
		Where("store_id = ? AND status = 'paid' AND DATE(created_at) = ?", claims.StoreID, today).
		Count(&trxCount)

	// Total Pelanggan (semua paid transaction user_id unik)
	db.Model(&model.Transaction{}).
		Where("store_id = ? AND status = 'paid'", claims.StoreID).
		Select("count(distinct(user_id))").Scan(&customers)

	// Grafik 7 Hari Terakhir
	type DailyChart struct {
		Name  string  `json:"name"`
		Total float64 `json:"total"`
	}
	var chartData []DailyChart
	
	for i := 6; i >= 0; i-- {
		d := time.Now().AddDate(0, 0, -i)
		dayName := d.Format("Mon")
		switch dayName {
		case "Mon": dayName = "Sen"
		case "Tue": dayName = "Sel"
		case "Wed": dayName = "Rab"
		case "Thu": dayName = "Kam"
		case "Fri": dayName = "Jum"
		case "Sat": dayName = "Sab"
		case "Sun": dayName = "Min"
		}
		chartData = append(chartData, DailyChart{Name: dayName, Total: 0})
	}

	sevenDaysAgo := time.Now().AddDate(0, 0, -6).Format("2006-01-02")
	type AggResult struct {
		Date  string
		Total float64
	}
	var agg []AggResult
	db.Model(&model.Transaction{}).
		Select("DATE(created_at) as date, COALESCE(SUM(total_amount), 0) as total").
		Where("store_id = ? AND status = 'paid' AND DATE(created_at) >= ?", claims.StoreID, sevenDaysAgo).
		Group("DATE(created_at)").
		Scan(&agg)

	for _, a := range agg {
		t, _ := time.Parse("2006-01-02", a.Date)
		dayName := t.Format("Mon")
		switch dayName {
		case "Mon": dayName = "Sen"
		case "Tue": dayName = "Sel"
		case "Wed": dayName = "Rab"
		case "Thu": dayName = "Kam"
		case "Fri": dayName = "Jum"
		case "Sat": dayName = "Sab"
		case "Sun": dayName = "Min"
		}
		for i := range chartData {
			if chartData[i].Name == dayName {
				chartData[i].Total = a.Total
				break
			}
		}
	}

	// Aktivitas Terakhir (5 trx terakhir yang paid/pending)
	var recentTrx []model.Transaction
	db.Preload("Items").Where("store_id = ? AND status != 'draft'", claims.StoreID).
		Order("created_at desc").Limit(5).Find(&recentTrx)

	var formattedRecent []map[string]interface{}
	for _, r := range recentTrx {
		statusStr := "Sukses"
		if r.Status == "pending" {
			statusStr = "Pending"
		} else if r.Status == "failed" {
			statusStr = "Gagal"
		}

		formattedRecent = append(formattedRecent, map[string]interface{}{
			"id":     fmt.Sprintf("INV-%d", r.ID),
			"user":   r.UserID,
			"time":   r.CreatedAt.Format("15:04"),
			"date":   r.CreatedAt.Format("2006-01-02"),
			"amount": r.TotalAmount,
			"status": statusStr,
			"method": "SmartBank",
		})
	}

	return c.JSON(model.Response{
		Message: "berhasil mengambil dashboard",
		Data: map[string]interface{}{
			"revenue":   revenue,
			"trxCount":  trxCount,
			"customers": customers,
			"chartData": chartData,
			"recent":    formattedRecent,
		},
	})
}
