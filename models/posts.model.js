var db = require('./db');

const postSchema = new db.mongoose.Schema(
    {
        idUser:{type:db.mongoose.Schema.Types.ObjectId, ref:"userModel"},
        isOwner:{type:Boolean,required:false},
        isLiked:{type:Boolean,required:false},
        content:{type:String,required:false},
        image:{type:String,required:false},
        video:{type:String,required:false},
        comment:[
            {
            type:db.mongoose.Schema.Types.ObjectId,
            required:false,
            ref:"commentModel"
            }
        ],
        like:[
            {
            type:db.mongoose.Schema.Types.ObjectId,
            required:false,
            ref:"likeModel"
            }
        ],
        commentCount:{type:Number,required:false},
        likeCount:{type:Number,required:false},
        status:{type:Number,required:false},
        createAt:{type: Date,required: false,default: Date.now()},
        updateAt:{type: Date,required: false,default: Date.now()}
    },
    {
        collection:"posts"
    }
);

let postModel = db.mongoose.model("postModel",postSchema);

module.exports = {
    postModel
}