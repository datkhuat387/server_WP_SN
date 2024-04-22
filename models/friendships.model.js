var db = require('./db');

const friendshipSchema = new db.mongoose.Schema(
    {
        idUser:{type:db.mongoose.Schema.Types.ObjectId,required:true, ref:"userModel"},
        idFriend:{type:db.mongoose.Schema.Types.ObjectId,required:true, ref:"userModel"},
        status:{type:Number,required:false},
        isFriend:{type:Boolean,required:false},
        isBlock:[
            {
                type:db.mongoose.Schema.Types.ObjectId,
                required:false,
                ref:"userModel"
            }
        ],
        createAt:{type: Date,required: false,default: Date.now()}
    },
    {
        collection:"friendships"
    }
);

let friendshipModel = db.mongoose.model("friendshipModel",friendshipSchema);

module.exports = {
    friendshipModel
}