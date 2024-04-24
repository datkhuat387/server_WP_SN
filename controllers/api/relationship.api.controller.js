const relationship = require("../../models/relationship.model")

exports.createTypeRelationship = async(req,res,next)=>{
    try {
        const name = req.body.name;
        const checkType = await relationship.typeRelationshipModel.findOne({name: name});
        if(checkType){
            return res.status(400).send("Tên mối quan hệ đã tồn tại");
        }
        let objType = new relationship.typeRelationshipModel();
        objType.name = name;
        await objType.save()
        res.status(200).json(objType)
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    }
}

exports.updateTypeRelationship = async(req,res,next)=>{
    try {
        const idType = req.params.idType;
        const name = req.body.name;
        const checkType = await relationship.typeRelationshipModel.findOne({_id: idType})
        const checkName = await relationship.typeRelationshipModel.findOne({name: name});
        if(!checkType){
            return res.status(400).send("Mối quan hệ không tồn tại");
        }
        if(checkName){
            return res.status(400).send("Tên mối quan hệ đã tồn tại");
        }
        checkType.name = name;
        await checkType.save();
        res.status(200).json(checkType)
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    }
}
