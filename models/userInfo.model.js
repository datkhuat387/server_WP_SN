var db = require('./db');

const userInfoSchema = new db.mongoose.Schema(
    {
        isActive:{type:Boolean,required: false},
        dateOfBirth:{type:String,required:false},
        highSchool:{type:String,required:false},
        collegeUniversity:{type:String,required:false},
        workingAt:{type:String,required:false},
        provinceCityAt:{type:String,required:false},
        postSave:[
            {
            type:db.mongoose.Schema.Types.ObjectId,
            required:false,
            ref:"postModel"
            }
        ],
        relationship:{type:db.mongoose.Schema.Types.ObjectId,required:false, ref:"relationshipModel"},
        socialLinks:{type:String,required:false},
        createAt:{type: Date,required: false,default: Date.now()},
        updateAt:{type: Date,required: false,default: Date.now()}

    },
    {
        collection:"userInfo"
    }
)

let userInfoModel = db.mongoose.model("userInfoModel",userInfoSchema);

module.exports = {
    userInfoModel
}