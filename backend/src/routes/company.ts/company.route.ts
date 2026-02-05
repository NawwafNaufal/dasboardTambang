<<<<<<< HEAD
// ========================================
// File: routes/productivity/productivity.route.ts
// ========================================
import express from "express";
// import { createCompanyController } from "../../controller/company/createCompany.controller";
// import { getCompanyController } from "../../controller/company/getCompany.controller";
// import { updateCompanyController } from "../../controller/company/updateCompany.controller";
// import { deleteCompanyController } from "../../controller/company/deleteCompany.controller";
// import { validateCompany } from "../../middleware/company/validateCompany";
import { getMonthlyActualBySite } from "../../service/productivity/dailyReport";

const routes = express.Router()

console.log("🔥 PRODUCTIVITY ROUTE LOADED");

// ❌ MASALAH: getCompanyController tidak di-define di routes
// ✅ SOLUSI: Tambahkan route GET untuk company
// routes.get("/company", getCompanyController);
// routes.post("/company", validateCompany, createCompanyController);
// routes.patch("/company/:id", validateCompany, updateCompanyController);
// routes.delete("/company/:id", deleteCompanyController);

// Route untuk monthly actual
routes.get("/monthly-actual-by-site", getMonthlyActualBySite);

export default routes;
=======
import express from "express";
import { createCompanyController } from "../../controller/company/createCompany.controller";
import { getCompanyController } from "../../controller/company/getCompany.controller";
import { updateCompanyController } from "../../controller/company/updateCompany.controller";
import { deleteCompanyController } from "../../controller/company/deleteCompany.controller";
import { validateCompany } from "../../middleware/company/validateCompany";

const routes = express.Router()

routes.post("/company",validateCompany, createCompanyController)
routes.get("/company", getCompanyController)
routes.patch("/company/:id",validateCompany,updateCompanyController)
routes.delete("/company/:id", deleteCompanyController)

export default routes
>>>>>>> f734bc196743bbce448ea7b7d360b032d26ce8a9
