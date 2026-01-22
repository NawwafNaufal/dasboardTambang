import mongose from "mongoose"
import "dotenv/config"

export const connectMongo = async () => {
    try {
        await mongose.connect(process.env.MONGO_URI as string)
        console.log("MongoDb connected")
    } catch (error) {
        console.error("MongoDb connection error",error)
            process.exit(1)
    }
}