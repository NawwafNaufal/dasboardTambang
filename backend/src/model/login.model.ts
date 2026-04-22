import mongoose, { Schema } from "mongoose";

const loginModel = new Schema (
    {
        username : {
            type : String, 
            required : true    
        },
        
        password : {
            type : String,
            required : true
        }
    }
)

export const dataLogin = mongoose.model("datauser",loginModel)