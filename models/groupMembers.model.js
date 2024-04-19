var db = require('./db');

const groupMemberSchema = new db.mongoose.Schema(
    {
        idUser:{type:db.mongoose.Schema.Types.ObjectId, ref:"userModel"},
        idGroup:{type:db.mongoose.Schema.Types.ObjectId, ref:"groupModel"},
        status:{type:Number,required:false},
        createAt:{type: Date,required: false,default: Date.now()},
        updateAt:{type: Date,required: false,default: Date.now()}
    },
    {
        collection:"groupMembers"
    }
)

let groupMemberModel = db.mongoose.model("groupMemberModel",groupMemberSchema);

module.exports = {
    groupMemberModel
}