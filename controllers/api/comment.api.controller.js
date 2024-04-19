const commentModel = require("../../models/comments.model")
const { postModel } = require("../../models/posts.model")
const { userModel } = require("../../models/users.model")

exports.commentByIdPost = async(req,res,next)=>{
    const idUser = req.body.idUser
    const idPost = req.body.idPost

    try {
        const checkPost = await postModel.findById(idPost)
        if(!checkPost){
            return res.status(404).send("Bài viết không tồn tại.")
        }
        let objComment = await commentModel.commentModel.create({
            idUser: idUser,
            idPost: idPost,
            isEditing: false,
            status: 0,
            comment: req.body.comment,
            createAt: Date.now(),
            updateAt: Date.now()
        });
        if(!objComment.comment){
            return res.status(400).send("Bạn chưa nhập bình luận.");
        }
        await objComment.populate("idUser", "fullname avatar")
        await postModel.findOneAndUpdate(
            {_id: idPost},
            {
                $push: {comment: objComment._id},
                $inc: { commentCount: 1 }
            }
        )
        res.status(200).json(objComment)
    } catch (error) {
        return res
      .status(500)
      .send("Đã xảy ra lỗi: " + error.message);
    }
}

exports.getListCmtByIdPost = async(req,res,next)=>{
    try {
        const idPost = req.params.idPost;
        let listCmt = await commentModel.commentModel.find({idPost:idPost}).populate("idUser","fullname avatar")
        if(listCmt!=null){
            res.status(200).json(listCmt)
        }else{
            res.status(401).send("Không có bình luận nào.")
        }
    } catch (error) {
        return res
        .status(500)
        .send("Đã xảy ra lỗi: " + error.message);
    }
}

exports.removeComment = async(req,res,next)=>{
    try {
        const idComment = req.params.id;
        const checkComment = await commentModel.commentModel.findById(idComment).populate("idUser", "fullname avatar");
        if(checkComment){
            await postModel.findOneAndUpdate(
                {_id: checkComment.idPost},
                {
                    $pull: {comment: idComment},
                    $inc: { commentCount: -1 }
                }
            )

            await commentModel.commentModel.deleteOne({_id:idComment});
            console.log(checkComment);
            res.status(200).json(checkComment)
        }else{
            res.status(401).send("Không tìm thấy bình luận.");
        }
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi: " + error.message);
    }
}

exports.updateComment = async(req,res,next)=>{
    try {
        const idComment = req.params.id;
        const checkComment = await commentModel.commentModel.findById(idComment).populate("idUser", "fullname avatar");
        if(!checkComment){
            return res.status(404).send("Bình luận không tồn tại");
        }
        checkComment.comment = req.body.comment;
        checkComment.updateAt = Date.now();

        const updateComment = await checkComment.save()
        res.status(200).json(updateComment);
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi: " + error.message);
    }
}
