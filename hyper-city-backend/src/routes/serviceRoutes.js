import express from "express";
import {
    createService,
    getServices,
    getNearbyServices,
    getLocalListings,
    getVendorServicesController,
    getAdminServicesController,
    getPendingServiceRequests,
    updateService,
} from "../controllers/serviceController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getServices);
router.get("/nearby", getNearbyServices);
router.get("/listings", getLocalListings);
router.get("/pending", protect, authorize("admin"), getPendingServiceRequests);
router.get("/admin", protect, authorize("admin"), getAdminServicesController);
router.get("/vendor", protect, authorize("vendor", "admin"), getVendorServicesController);
router.post("/", protect, authorize("vendor", "admin"), createService);
router.patch("/:id", protect, authorize("vendor", "admin"), updateService);

export default router;
