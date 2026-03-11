import { Router } from "express";
import { getAvailabilityIndexController } from "../../controller/productivity/getAvailabilityIndexController";

const router = Router();

router.get("/availability-index", getAvailabilityIndexController);

export default router