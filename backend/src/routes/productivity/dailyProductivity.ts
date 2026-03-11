import express from "express"
import { getDailyProductivityController } from "../../controller/productivity/getDailyProductivityController";

const router = express.Router()

router.get("/daily-productivity", getDailyProductivityController);

export default router