import { Request,Response,NextFunction } from "express";

export const logoutController = (req:Request,res:Response,next:NextFunction) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(400).json({
                message : "Log-out Gagal"
            })
        }
        res.clearCookie("connect.sid")
        res.status(200).json({
            message : "Log-out Berhasil"
        })
    })
}