import winston from "winston"
import path from "path"

const logPath = path.resolve(__dirname,"../../logsDasboard/dasboardTambang.log")

export const logger = winston.createLogger({
    level : "info",
    format : winston.format.combine(
        winston.format.timestamp({
            format : "YYYY-MM-DD hh:mm:ss.SSS A"
        }),
        winston.format.label({label:"LOGGER"}),
        winston.format.ms(),
        winston.format.printf(info =>
            `${info.label} ${info.timestamp} ${info.level} ${info.message}`
        )
    ),
    transports : [
        new winston.transports.Console({
            level : "info",
            format : winston.format.colorize({
                all : true
            })
        }),
        new winston.transports.File({filename : logPath, level : 'info'})
    ]

})