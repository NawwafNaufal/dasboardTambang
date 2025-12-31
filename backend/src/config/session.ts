import session from "express-session";
import "dotenv/config"

export const sessionConfig = session ({
    name : "sid",
    secret : process.env.SESSION_SECRET as string,
    resave : false,
    saveUninitialized : false,
    rolling : true,
    cookie : {
        httpOnly : true,
        secure : false, 
        sameSite : "lax",
        maxAge : 1000 * 60 * 60
    }
})