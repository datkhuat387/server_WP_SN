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
                objUserInfo.college_university = null;
                objUserInfo.workingAt = null;
                objUserInfo.provinceCityAt = null;
                objUserInfo.postSave = [];
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
        let userInf = await userInfo.userInfoModel.findOne({_id: idUser}).populate("relationship").populate("postSave");
        if(userInf != null){
            return res.json(userInf)
        }else{
            return res.status(401).send("Lỗi thông tin tài khoản.");
        }
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    }
}