import { Request,Response,NextFunction } from "express";
import { getDataGoogleService } from "../../service/productivity/getProduktivityS";

export const getDataGoogleController = async (req : Request, res : Response, next : NextFunction) => {
    const sheetName = req.query.sheetName as string

        const result = await getDataGoogleService(sheetName)
            res.status(200).json({
                message : result
            })
}