const group  =require("../../models/group.model");

exports.createGroup = async(req,res,next)=>{
    try {
        const idUser = req.params.idUser;

        let objGroup = new group.groupModel();
        objGroup.name = req.body.name;
        objGroup.avatar = null;
        objGroup.coverImage = "/uploads/1713001266078-Untitled.png";
        objGroup.description = req.body.description;
        objGroup.creatorId = idUser;
        objGroup.memberCount = 1;
        objGroup.status = 0;
        objGroup.createAt = Date.now();
        objGroup.updateAt = Date.now();

        if(!objGroup.name){
            return res.status(400).send("Tên Nhóm không được để trống");
        }
        await objGroup.save()
        res.status(200).json(objGroup);
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    }
}

exports.getMyGroupManage = async(req,res,next)=>{
    try {
        const idUser = req.params.idUser;
        let listGroup = await group.groupModel.find({creatorId:idUser})
        res.status(200).json(listGroup);
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    }
}

exports.getDetailGroup = async(req,res,next)=>{
    try {
        const idGroup = req.params.idGroup;
        let groupDetail = await group.groupModel.findById(idGroup);
        if(!groupDetail){
            return res.status(400).send("Nhóm không tồn tại")
        }
        res.status(200).json(groupDetail);
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    }
}