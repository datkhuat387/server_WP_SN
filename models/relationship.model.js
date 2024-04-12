var db = require('./db');

const relationshipSchema = new db.mongoose.Schema(
    {
        status:{type:Number,required:false},
        relationship:{type:db.mongoose.Schema.Types.ObjectId,required:false,ref:"typeRelationshipModel"},
        lifePartner:{type:db.mongoose.Schema.Types.ObjectId,required:false,ref:"userModel"},
        year:{type:String,required:false}
    },
    {
        collection:"relationship"
    }
)

const typeRelationshipSchema = new db.mongoose.Schema(
    {
        name:{type: String,required: true}
    },
    {
        collection:"typeRelationship"
    }
)

let relationshipModel = db.mongoose.model("relationshipModel",relationshipSchema);
let typeRelationshipModel = db.mongoose.model("typeRelationshipModel",typeRelationshipSchema);

module.exports = {
    relationshipModel,
    typeRelationshipModel
}