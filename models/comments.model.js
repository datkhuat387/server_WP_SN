var db = require('./db');

const commentSchema = new db.mongoose.Schema(
    {
        idUser:{type:db.mongoose.Schema.Types.ObjectId, ref:"userModel"},
        idPost:{type:db.mongoose.Schema.Types.ObjectId, ref:"postModel"},
        comment:{type:String,required:true},
        status:{type:Number,required:false},
        isEditing:{type:Boolean,required:false},
        createAt:{type: Date,required: false,default: Date.now()},
        updateAt:{type: Date,required: false,default: Date.now()}
    },
    {
        collection:"comments"
    }
);

let commentModel = db.mongoose.model("commentModel",commentSchema);

module.exports = {
    commentModel
}