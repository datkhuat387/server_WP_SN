const page = require("../../models/page.model");

exports.createTypePage = async(req,res,next)=>{
    try {
        let objTypePage = new page.typePageModel();
        objTypePage.name = req.body.name;
        
        await objTypePage.save()
        res.status(200).json(objTypePage);
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