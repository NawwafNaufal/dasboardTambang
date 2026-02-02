// import { Request,Response,NextFunction } from "express";
// import { getDataGoogleService } from "../../service/productivity/getProduktivityS";

// export const getDataGoogleController = async (req : Request, res : Response, next : NextFunction) => {
//     try {
//         const result = await getDataGoogleService()
//             res.status(200).json({
//                 message : result
//             })
//     } catch (error) {
//         return next(error)
//     }
// }