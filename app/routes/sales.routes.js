const express = require("express");
const salesController = require("../controllers/salesController");
const router = express.Router();

router.post("/", salesController.createSale);
router.get("/summary/total", salesController.getTotalSalesAmount)
router.get("/summary/product", salesController.getSalesCountAndRevenue)
router.get("/summary/monthly", salesController.getMonthlySalesTrend)
router.get("/top-customers", salesController.getTopCustomersBySaleVolume)
router.get("/average-order-value", salesController.getAOV)

module.exports = router;

