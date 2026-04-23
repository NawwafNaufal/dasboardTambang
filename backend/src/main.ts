import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { syncDailyOperationJob } from "./jobs/syncMonthlyPlan.job";
import { error } from "./middleware/errorHandling/error";
import { connectMongo } from "./config/mongo";
import cors from "cors";
import session from "express-session";
import "./types/express";

import productivity from "./routes/productivity/productivity";
import planRkpa from "./routes/productivity/planRkpa"
import staticD from "./routes/productivity/dailyStatic"
import monthlyTarget from "./routes/productivity/monthlyTarget"
import getActivityUnit from "./routes/productivity/getActivitiesRoute"
import produktivityIndexMounth from "./routes/productivity/getProductivityIndexRoute"
import getUnit from "./routes/productivity/getUnit"
import avaibilityIndex from "./routes/productivity/getTotalPaUaMaUe"
import dailyProductivity from "./routes/productivity/dailyProductivity"
import getPaUaMaEu from "./routes/productivity/getPaMaUaEu"
import sigIn from "./routes/auth/loginRoutes"
import logOut from "./routes/auth/logoutRoutes"
import { validateCookie } from "./middleware/auth/validateCookie";


const app = express();
const PORT = process.env.PORT;


app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://43.157.205.158:5173",
    "http://43.157.205.158",
        "http://moa2.site",       
    "https://moa2.site"   
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(session({
  secret: process.env.SECRET_SESSION,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly:true,
   secure: true,       // 🔥 WAJIB kalau HTTPS
  sameSite: "lax",
    maxAge:60000
  }
}))

app.use(express.json());

app.get("/h",(req,res) => {
  res.send("Hello World")
})

app.use("/api", validateCookie,productivity);
app.use("/api",validateCookie,planRkpa)
app.use("/api",staticD)
app.use("/api",monthlyTarget)
app.use("/api",getActivityUnit)
app.use("/api",produktivityIndexMounth)
app.use("/api",getUnit)
app.use("/api",avaibilityIndex)
app.use("/api",dailyProductivity)
app.use("/api",getPaUaMaEu)

app.use("/auth",sigIn)
app.use("/auth",logOut)
app.use(error);

const startServer = async () => {
  try {
    console.log("[STARTUP] Connecting to MongoDB...");
    await connectMongo();
    console.log("[STARTUP] ✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`[STARTUP] ✅ Server listening on PORT: ${PORT}`);
    });

    setInterval(async () => {
      try {
        await syncDailyOperationJob();
      } catch (error) {
        console.error("[CRON] Job failed:", error);
      }
    },1 * 60 * 1000);

    console.log("[STARTUP] ✅ CRON scheduler started (every 10s)");
    console.log("[STARTUP] All systems ready!");

  } catch (error) {
    console.error("[STARTUP] ❌ Failed to start:", error);
    process.exit(1);
  }
};

startServer();
