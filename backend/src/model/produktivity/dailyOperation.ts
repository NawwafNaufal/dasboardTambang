import {Schema,model} from "mongoose"

const DailyOperationSchema = new Schema(
    {
        date: {type: String, required:true},
        site: {type: String, required:true},

        activities: {
            type: Map,
            of : new Schema(
                {
                    unit: {type: String, required:true},
                    breakdown: {
                        type: Map,
                        of: Number
                    }
                },
                {_id: false}
            ),
            required: true
        }
    },
    {timestamps: true}
)

DailyOperationSchema.index(
    {date:1, site: 1},
    {unique: true}
)

export const DailyOperation = model(
    "DailyOperation",
    DailyOperationSchema
)