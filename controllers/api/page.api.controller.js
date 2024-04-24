const page = require("../../models/page.model");

exports.createTypePage = async(req,res,next)=>{
    try {
        const name = req.body.name;
        const checkName = await page.typePageModel.findOne({name:name})
        if(checkName){
            return res.status(400).send("Loại trang đã tồn tại");
        }
        let objTypePage = new page.typePageModel();
        objTypePage.name = req.body.name;
        
        await objTypePage.save()
        res.status(200).json(objTypePage);
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    }
}

exports.updateTypePage = async(req,res,next)=>{
    try {
        const idType = req.params.idType;
        const name = req.body.name;
        const checkType = await page.typePageModel.findOne({_id:idType})
        const checkName = await page.typePageModel.findOne({name:name})
        if(!checkType){
            res.status(400).send("Loại trang không tồn tại");
        }
        if(checkName){
            return res.status(400).send("Loại trang đã tồn tại");
        }
        checkType.name = name;
        await checkType.save();
        
        res.status(200).json(checkType);
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    }
}

exports.createPage = async(req,res,next)=>{
    try {
        const idUser = req.params.idUser;

        let objPage = new page.pageModel();
        objPage.name = req.body.name;
        objPage.avatar = null;
        objPage.coverImage = "/uploads/1713001266078-Untitled.png"
        objPage.description = req.body.description;
        objPage.typePage = req.body.typePage;
        objPage.creatorId = idUser;
        objPage.likeCount = 0;
        objPage.followCount = 0;
        objPage.status = 0;
        objPage.createAt = Date.now();
        objPage.updateAt = Date.now();

        if(!objPage.name){
            return res.status(400).send("Tên trang không được để trống");
        }
        await objPage.save();
        res.status(200).json(objPage);
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    }
}