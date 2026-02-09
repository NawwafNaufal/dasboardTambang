// // controllers/monthlyPlan.controller.ts
// import { Request, Response } from "express";
// import { saveMonthlyPlanService } from "../../service/productivity/postProduktivityS";

// export const saveMonthlyPlan = async (req: Request, res: Response) => {
// try {
//     const { month, site, activities } = req.body;

//     await saveMonthlyPlanService(month, site, activities);

//     return res.status(200).json({
//         success: true,
//         message: "Monthly plan saved successfully"
//     });
// } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//         success: false,
//         message: "Failed to save monthly plan"
//         });
//     }
// };
