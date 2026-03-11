import { Router } from "express";
import { getDailyAvailabilityController } from "../../controller/productivity/getDailyAvailabilityController";

const router = Router();

router.get("/daily-availability", getDailyAvailabilityController);

export default router