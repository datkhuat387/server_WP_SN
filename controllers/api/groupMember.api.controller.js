const groupMember  =require("../../models/groupMembers.model");

exports.joinGroup = async(req,res,next)=>{
    try {
        const idUser = req.body.idUser;
        const idGroup = req.body.idGroup;
        const checkJoin = await groupMember.groupMemberModel.findOne({
            idUser:idUser,
            idGroup:idGroup
        });
        if(checkJoin){
            if(checkJoin.status === 0){
                return res.status(401).send("Chờ phê duyệt");
            } else if(checkJoin.status === 1){
                return res.status(401).send("Đã tham gia nhóm");
            }else if(checkJoin.status === 2){
                return res.status(401).send("Bạn đã bị cấm");
            } else{
                return res.status(404).send("Lỗi");
            }
        }else{
            const objGroupMember = new groupMember.groupMemberModel()
            objGroupMember.idGroup = idGroup;
            objGroupMember.idUser = idUser;
            objGroupMember.status = 0;
            objGroupMember.createAt = Date.now();
            objGroupMember.updateAt = Date.now();

            await objGroupMember.save();
            res.status(200).json(objGroupMember);
        }
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    }
}

exports.confirmJoin = async(req,res,next)=>{
    try {
        const idGroupMember = req.params.idGroupMember;
        const checkJoin = await groupMember.groupMemberModel.findById(idGroupMember);
        if(!checkJoin){
            return res.status(400).send("không tìm thấy đơn tham gia nhóm");
        }
        checkJoin.status = 1;
        checkJoin.updateAt = Date.now();

        const confirmJoin = await checkJoin.save();
        res.status(200).json(confirmJoin);
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    }
}

exports.cancelJoin = async(req,res,next)=>{
    try {
        const idGroupMember = req.params.idGroupMember;
        const checkJoin = await groupMember.groupMemberModel.findById(idGroupMember).populate("idUser","fullname avatar");
        if(!checkJoin){
            return res.status(400).send("không tìm thấy đơn tham gia nhóm");
        }
        await groupMember.groupMemberModel.deleteOne({_id:idGroupMember});
        res.status(200).json(checkJoin);
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    }
}

exports.banMember = async(req,res,next)=>{
    try {
        const idGroupMember = req.params.idGroupMember;
        const checkJoin = await groupMember.groupMemberModel.findById(idGroupMember).populate("idUser","fullname avatar");
        if(!checkJoin){
            return res.status(400).send("không tìm thấy đơn tham gia nhóm");
        }
        checkJoin.status = 2;
        checkJoin.updateAt = Date.now();

        const confirmJoin = await checkJoin.save();
        res.status(200).json(confirmJoin);
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    }
}

exports.kickMember = async(req,res,next)=>{
    try {
        const idGroupMember = req.params.idGroupMember;
        const checkJoin = await groupMember.groupMemberModel.findById(idGroupMember).populate("idUser","fullname avatar");
        if(!checkJoin){
            return res.status(400).send("không tìm thấy đơn tham gia nhóm");
        }
        await groupMember.groupMemberModel.deleteOne({_id:idGroupMember});
        res.status(200).send("Đã mời thành viên ra khỏi nhóm");
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    }
}

exports.outGroup = async(req,res,next)=>{
    try {
        const idGroupMember = req.params.idGroupMember;
        const checkJoin = await groupMember.groupMemberModel.findOne({_id:idGroupMember,status:1}).populate("idUser","fullname avatar");
        if(!checkJoin){
            return res.status(400).send("không tìm thấy đơn tham gia nhóm");
        }
        await groupMember.groupMemberModel.deleteOne({_id:idGroupMember});
        res.status(200).send("Đã ra khỏi nhóm");
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    }
}

exports.checkJoin = async(req,res,next)=>{
    try {
        const idUser = req.params.idUser;
        const idGroup = req.params.idGroup;
        const checkJoin = await groupMember.groupMemberModel.findOne({
            idUser:idUser,
            idGroup:idGroup
        });
        if(!checkJoin){
            return res.status(400).send("Bạn chưa tham gia nhóm")
        }
        res.status(200).json(checkJoin);
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    }
}

exports.listWaitJoin = async(req,res,next)=>{
    try {
        const idGroup = req.params.idGroup;
        let listWaitJoin = await groupMember.groupMemberModel.find({idGroup:idGroup,status:0}).populate("idUser","fullname avatar");
        res.status.json(listWaitJoin);
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    }
}

exports.listMember = async(req,res,next)=>{
    try {
        const idGroup = req.params.idGroup;
        let listMember = await groupMember.groupMemberModel.find({idGroup:idGroup,status:1}).populate("idUser","fullname avatar");
        res.status.json(listMember);
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    }
}

exports.listMemberBan = async(req,res,next)=>{
    try {
        const idGroup = req.params.idGroup;
        let listMemberBan = await groupMember.groupMemberModel.find({idGroup:idGroup,status:2}).populate("idUser","fullname avatar");
        res.status.json(listMemberBan);
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    }
}

exports.listJoinedGroup = async(req,res,next)=>{
    try {
        const idUser = req.params.idUser;
        let listJoinedGroup = await groupMember.groupMemberModel.find({idUser:idUser, status:1}).populate("idGroup","name coverImage updateAt")
                                                                                                .populate("idUser","fullname avatar");
        res.status(200).json(listJoinedGroup);
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    }
}