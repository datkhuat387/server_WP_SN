var db = require('./db');

const userSchema = new db.mongoose.Schema(
    {
        email:{type:String,required:false},
        phone:{type:String,required:false},
        password:{type:String,required:true},
        fullname:{type:String,required:true},
        status:{type:Number,required:false},
        avatar:{type:String,required:false},
        checkFriend:{type:Number,required:false},
        idAccountType:{type:db.mongoose.Schema.Types.ObjectId, ref:"accountTypesModel"},
        createAt:{type: Date,required: false,default: Date.now()},
        updateAt:{type: Date,required: false,default: Date.now()}
    },
    {
        collection:"users"
    }
);

const accounTypesSchema = new db.mongoose.Schema(
    {
        name:{type: String,required:true}
    },
    {
        collection:"accountTypes"
    }
);

let userModel = db.mongoose.model("userModel",userSchema);
let accountTypesModel = db.mongoose.model("accountTypesModel",accounTypesSchema);

module.exports = {
    userModel,
    accountTypesModel
};