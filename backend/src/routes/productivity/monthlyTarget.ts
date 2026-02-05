import { Router } from "express";
import { getMonthlyTarget } from "../../service/productivity/monthlyTarget";

const router = Router();

router.get("/monthly-target/:site/:year/:month", getMonthlyTarget);

export default router