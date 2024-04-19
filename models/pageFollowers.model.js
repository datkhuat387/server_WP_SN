var db = require('./db');

const pageFollowerSchema = new db.mongoose.Schema(
    {
        idUser:{type:db.mongoose.Schema.Types.ObjectId, ref:"userModel"},
        idPage:{type:db.mongoose.Schema.Types.ObjectId, ref:"pageModel"},
        status:{type:Number,required:false},
        createAt:{type: Date,required: false,default: Date.now()},
        updateAt:{type: Date,required: false,default: Date.now()}
    }
)