const postModel = require("../../models/posts.model");
const multer = require('multer');
const fs = require('fs');
const { commentModel } = require("../../models/comments.model");
const { likeModel } = require("../../models/like.model");

exports.getAllPost = async(req,res, next) =>{
  const idUser = req.params.idUser;
  let listPost = await postModel.postModel.find().populate("idUser","fullname avatar")
                                                .populate(
                                                  {
                                                    path: "comment",
                                                    populate: {
                                                      path: "idUser",
                                                      select: "fullname avatar"
                                                    },
                                                  } 
                                                )
                                                .populate(
                                                  {
                                                    path: "like",
                                                    populate: {
                                                      path: "idUser",
                                                      select: "fullname avatar"
                                                    },
                                                  }
                                                );
  listPost = listPost.map((post) => {
    const isOwner = post.idUser._id.toString() === idUser;
    const isLiked = post.like.some((like) => like.idUser._id.toString() === idUser);
    return { ...post.toObject(), isOwner, isLiked };
  });
  res.status(200).json(listPost);
}

exports.getPostByidUser = async(req,res, next) =>{
  const idUser = req.params.idUser;
  let listPost = await postModel.postModel.find({idUser:idUser}).populate("idUser","fullname avatar")
                                                .populate(
                                                  {
                                                    path: "comment",
                                                    populate: {
                                                      path: "idUser",
                                                      select: "fullname avatar"
                                                    },
                                                  } 
                                                )
                                                .populate(
                                                  {
                                                    path: "like",
                                                    populate: {
                                                      path: "idUser",
                                                      select: "fullname avatar"
                                                    },
                                                  }
                                                );
  listPost = listPost.map((post) => {
    const isOwner = post.idUser._id.toString() === idUser;
    const isLiked = post.like.some((like) => like.idUser._id.toString() === idUser);
    return { ...post.toObject(), isOwner, isLiked };
  });
  res.status(200).json(listPost);
}

exports.createPost = async (req, res, next) => {
  try {
    let objPost = new postModel.postModel();
    objPost.idUser = req.body.idUser;
    objPost.isOwner = true;
    objPost.idGroup = null;
    objPost.idPage = null;
    objPost.isLiked = false;
    objPost.content = req.body.content;
    objPost.comment = [];
    objPost.like = [];
    objPost.commentCount = 0;
    objPost.likeCount = 0;
    objPost.status = 0;
    // objPost.image = "";
    objPost.video = "";
    objPost.image = req.file == null || req.file == undefined
    ? ""
    : `/uploads/${req.file.filename}`; // Sử dụng req.file.path để lấy đường dẫn tới ảnh đã tải lên
    objPost.createAt = Date.now();
    objPost.updateAt = Date.now();
    
    console.log(objPost);
    // Kiểm tra xem các trường thông tin bài viết đã được cung cấp hay chưa
    if(!objPost.image){
      if (!objPost.idUser || !objPost.content) {
        return res.status(400).send("Vui lòng cung cấp đầy đủ thông tin bài viết.");
        
      }
    }
    await objPost.save();
    res.status(200).json(objPost)
  } catch (error) {
    return res.status(500).send("Đã xảy ra lỗi khi tạo bài viết: " + error.message);
  }
};

exports.updatePost = async(req,res,next)=>{
  try {
    const idPost = req.params.id
    const checkPost = await postModel.postModel.findById(idPost);
    if(!checkPost){
      return res.status(404).send("Bài viết không tồn tại");
    }
    checkPost.isOwner = true;
    checkPost.content = req.body.content
    checkPost.image =
     req.file == null || req.file == undefined? ""
    : `/uploads/${req.file.filename}`;
    checkPost.updateAt = Date.now()
    if(!checkPost.image){
      if (!checkPost.idUser || !checkPost.content) {
        return res.status(400).send("Vui lòng cung cấp đầy đủ thông tin bài viết.");
      }
    }
    const updatePost = await checkPost.save()
    res.status(200).json(updatePost)
  } catch (error) {
    return res.status(500).send("Đã xảy ra lỗi: " + error.message);
  }
}
exports.removePost = async(req,res,next)=>{
  try {
    const idPost = req.params.id
    const checkPost = await postModel.postModel.findById(idPost);
    let checkCommentByIdPost = await commentModel.find({idPost:idPost})
    let checkLikeByIdPost = await likeModel.find({idPost:idPost})
    if(checkPost){
      if(checkCommentByIdPost){
        await commentModel.deleteMany({idPost:idPost})
        console.log("remove cmt");
      }
      if(checkLikeByIdPost){
        await likeModel.deleteMany({idPost:idPost})
        console.log("remove like");
      }
      await postModel.postModel.deleteOne({_id:idPost})
      if(checkPost.image!==null||checkPost.image!==""){
        const imagePath = checkPost.image;
        if (imagePath) {
          fs.unlinkSync("D:/Android_Kotlin/Server/server_WP_SN/public"+imagePath);
          console.log("remove image");
        }
      }
      res.status(200).send("Đã xóa bài viết")
    }else{
      res.status(401).send("Không tìm thấy bài viết.");
    }
  } catch (error) {
    return res.status(500).send("Đã xảy ra lỗi: " + error.message);
  }
}
exports.getDetailPostById = async(req,res,next)=>{
  try {
    const idPost = req.params.id
    console.log(idPost);
    let detailPost = await postModel.postModel.findOne({_id:idPost}).populate("idUser","fullname avatar")
                                                  .populate({
                                                      path: "comment",
                                                      populate: {
                                                        path: "idUser",
                                                        select: "fullname avatar"
                                                      }})
                                                  .populate({
                                                      path: "like",
                                                      populate: {
                                                        path: "idUser",
                                                        select: "fullname avatar"
                                                      }});
    if(detailPost != null|| detailPost!=[]){
      res.status(200).json(detailPost);
      console.log("Null or []");
    }else{
      res.status(401).send("Lỗi thông tin bài viết.");
      console.log("Lỗi thông tin");
    }
  } catch (error) {
    console.log("Lỗi try catch");
    return res.status(500).send("Đã xảy ra lỗi: " + error.message);
  }
}

exports.searchPosts = async(req,res,next)=>{
  try {
    const idUser = req.params.idUser;
    const textSearch = req.body.textSearch;
    const regexSearch = new RegExp(textSearch,'i');

    let resultPost = await postModel.postModel.find({content: { $regex: regexSearch}}).populate("idUser","fullname avatar")
                                                                                      .populate(
                                                                                        {
                                                                                          path: "comment",
                                                                                          populate: {
                                                                                            path: "idUser",
                                                                                            select: "fullname avatar"
                                                                                          },
                                                                                        } 
                                                                                      )
                                                                                      .populate(
                                                                                        {
                                                                                          path: "like",
                                                                                          populate: {
                                                                                            path: "idUser",
                                                                                            select: "fullname avatar"
                                                                                          },
                                                                                        }
                                                                                      );
    listPost = resultPost.map((post) => {
    const isOwner = post.idUser._id.toString() === idUser;
    const isLiked = post.like.some((like) => like.idUser._id.toString() === idUser);
    return { ...post.toObject(), isOwner, isLiked };
    });
    res.status(200).json(listPost);
  } catch (error) {
    console.log("Lỗi try catch");
    return res.status(500).send("Đã xảy ra lỗi: " + error.message);
  }
}