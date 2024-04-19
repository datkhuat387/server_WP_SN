const { name } = require('ejs');
var db = require('./db');

const pageSchema = new db.mongoose.Schema(
    {
        name:{type:String,required:false},
        avatar:{type:String,required:false},
        coverImage:{type:String,required:false},
        description:{type:String,required:false},
        typePage:{type:db.mongoose.Schema.Types.ObjectId, ref:"typePageModel"},
        creatorId:{type:db.mongoose.Schema.Types.ObjectId, ref:"userModel"},
        likeCount:{type:Number,required:false},
        followCount:{type:Number,required:false},
        status:{type:Number,required:false},
        createAt:{type: Date,required: false,default: Date.now()},
        updateAt:{type: Date,required: false,default: Date.now()}
    },
    {
        collection:"page"
    }
)

const typePageSchema = new db.mongoose.Schema(
    {
        name:{type: String,required:true}
    },
    {
        collection:"typePage"
    }
)

let pageModel = db.mongoose.model("pageModel",pageSchema);
let typePageModel = db.mongoose.model("typePageModel",typePageSchema);

module.exports = {
    pageModel,
    typePageModel
}