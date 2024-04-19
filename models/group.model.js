var db = require('./db');

const groupSchema = new db.mongoose.Schema(
    {
        name:{type:String,required:false},
        avatar:{type:String,required:false},
        coverImage:{type:String,required:false},
        description:{type:String,required:false},
        creatorId:{type:db.mongoose.Schema.Types.ObjectId, ref:"userModel"},
        userCount:{type:Number,required:false},
        status:{type:Number,required:false},
        createAt:{type: Date,required: false,default: Date.now()},
        updateAt:{type: Date,required: false,default: Date.now()}
    },
    {
        collection:"group"
    }
)

let groupModel = db.mongoose.model("groupModel",groupSchema);

module.exports = {
    groupModel
}