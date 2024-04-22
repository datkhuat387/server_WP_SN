const userInfo = require("../../models/userInfo.model")
const {userModel} = require("../../models/users.model")

exports.createUserInfo = async(req,res,next)=>{
    try {
        const idUser = req.params.idUser;
        const checkUser = await userModel.findOne({_id:idUser})
        const checkUserInfor = await userInfo.userInfoModel.findById(idUser)
        if(checkUser){
            if(!checkUserInfor){
                let objUserInfo = new userInfo.userInfoModel();
                objUserInfo._id = idUser
                objUserInfo.isActive = false;
                objUserInfo.dateOfBirth = null;
                objUserInfo.highSchool = null;
                objUserInfo.collegeUniversity = null;
                objUserInfo.workingAt = null;
                objUserInfo.provinceCityAt = null;
                objUserInfo.postSave = [];
                objUserInfo.coverImage = "/uploads/1713001266078-Untitled.png";
                objUserInfo.relationship = null;
                objUserInfo.socialLinks = null;
                objUserInfo.createAt = Date.now();
                objUserInfo.updateAt = Date.now();
                await objUserInfo.save();
                res.status(200).json(objUserInfo)
            }else{
                return res.status(400).send("Hồ sơ đã tồn tại.");
            }
        }else{
            return res.status(400).send("Người dùng không tồn tại.");
        }
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    }
}

exports.getUserInfo = async(req,res,next)=>{
    try {
        const idUser = req.params.idUser;
        let userInf = await userInfo.userInfoModel.findOne({_id: idUser}).populate("relationship").populate({
                                                                                                        path: "postSave",
                                                                                                        populate: [
                                                                                                        {
                                                                                                            path: "idUser",
                                                                                                            select: "fullname avatar",
                                                                                                        },
                                                                                                        {
                                                                                                            path: "like",
                                                                                                            populate: {
                                                                                                                path: "idUser",
                                                                                                                select: "fullname avatar"
                                                                                                              },
                                                                                                        },
                                                                                                        {
                                                                                                            path: "comment",
                                                                                                            populate: {
                                                                                                                path: "idUser",
                                                                                                                select: "fullname avatar"
                                                                                                              },
                                                                                                        },
                                                                                                        ],
                                                                                                    });
        if(userInf != null){
            return res.json(userInf)
        }else{
            return res.status(401).send("Lỗi thông tin tài khoản.");
        }
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    }
}

exports.updateDatOfBirth = async(req,res,next)=>{
    try {
        const id = req.params.id
        const dateOfBirth = req.body.dateOfBirth
        const checkUserInfor = await userInfo.userInfoModel.findById(id);
        if(!checkUserInfor){
            return res.status(404).send("Thông tin người dùng không tồn tại");
        }
        if(dateOfBirth=== null || dateOfBirth===""){
            return res.status(400).send("Ngày sinh không được để trống");
        }
        checkUserInfor.dateOfBirth = dateOfBirth
        
        const updateUser = await checkUserInfor.save()
        res.status(200).json(updateUser)
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    }
}

exports.updateUserInfo = async(req,res,next)=>{
    try {
        const id = req.params.id;
        const {
            highSchool,
            collegeUniversity,
            workingAt,
            provinceCityAt,
            relationship,
            socialLinks} = req.body;
        const checkUserInfor = await userInfo.userInfoModel.findById(id);
        if(!checkUserInfor){
            return res.status(404).send("Thông tin người dùng không tồn tại");
        }
        if(highSchool !== undefined && highSchool !== ""){
            checkUserInfor.highSchool = highSchool;
        }
        if(collegeUniversity !== undefined && collegeUniversity !== ""){
            checkUserInfor.collegeUniversity = collegeUniversity;
        }
        if(workingAt !== undefined && workingAt !== ""){
            checkUserInfor.workingAt = workingAt;
        }
        if(provinceCityAt !== undefined && provinceCityAt !== ""){
            checkUserInfor.provinceCityAt = provinceCityAt
        }
        if(relationship !== undefined && relationship !==""){
            checkUserInfor.relationship = relationship
        }
        if(socialLinks !== undefined && relationship !==""){
            checkUserInfor.socialLinks = socialLinks
        }

        const updateUserInfo = await checkUserInfor.save();
        res.status(200).json(updateUserInfo)
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    }

}

exports.updateCoverImage = async(req,res,next)=>{
    try {
        const id = req.params.id;
        const checkUserInfor = await userInfo.userInfoModel.findById(id);
        if(!checkUserInfor){
            return res.status(404).send("Thông tin người dùng không tồn tại");
        }
        checkUserInfor.coverImage =
        req.file == null || req.file == undefined? ""
        : `/uploads/${req.file.filename}`;
        const updateCoverImage = await checkUserInfor.save();
        res.status(200).json(updateCoverImage);
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    }
}