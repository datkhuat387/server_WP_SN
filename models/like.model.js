var db = require('./db');

const likeSchema = new db.mongoose.Schema(
    {
        idUser:{type:db.mongoose.Schema.Types.ObjectId, ref:"userModel"},
        idPost:{type:db.mongoose.Schema.Types.ObjectId, ref:"postModel"},
        createAt:{type: Date,required: false,default: Date.now()}
    },
    {
        collection:"like"
    }
);
let likeModel = db.mongoose.model("likeModel",likeSchema);

module.exports = {
    likeModel
}