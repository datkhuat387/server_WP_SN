const likeModel = require("../../models/like.model");
const { postModel } = require("../../models/posts.model");

// exports.like = async (req, res, next) => {
//   try {
//     const idPost = req.body.idPost;
//     const idUser = req.body.idUser;
//     console.log("idUser: "+idUser)
//     console.log("idPost: "+idPost)
//     // Kiểm tra
//     const existingLike = await likeModel.likeModel.findOne({
//       idPost: idPost,
//       idUser: idUser
//     })
  
//     if (existingLike) {
//       res.status(200).send("Bạn đã thích bài viết trước đó.");
//     } else {
//       let objLike = new likeModel.likeModel();
//       objLike.idPost = idPost;
//       objLike.idUser = idUser;
//       objLike.createAt = Date.now();
//       if(!idUser||!idPost){
//         return res.status(400).send("Lỗi thông tin bài viết hoặc người dùng.");
//       }
//       await objLike.save();
//       console.log("Like: "+objLike)
//       res.status(200).json(objLike)
//     }
//   } catch (error) {
//     return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    
//   }
// };

exports.likeByIdPost = async(req,res,next)=>{
  try {
    const idPost = req.body.idPost;
    const idUser = req.body.idUser;
    console.log("idUser: "+idUser)
    console.log("idPost: "+idPost)
    // Kiểm tra
    const existingLike = await likeModel.likeModel.findOne({
      idPost: idPost,
      idUser: idUser
    })
    const checkPost = await postModel.findOne({_id:idPost})
    if(checkPost){
      if (existingLike) {
        res.status(200).send("Bạn đã thích bài viết trước đó.");
      } else {
        let objLike = await likeModel.likeModel.create({
          idPost: idPost,
          idUser: idUser,
          status: 0,
          createAt: Date.now()
        })
      
        if(!idUser||!idPost){
          return res.status(400).send("Lỗi thông tin bài viết hoặc người dùng.");
        }
        await objLike.populate("idUser", "fullname avatar")
        // Cập nhật trường like trong bài viết
        await postModel.findOneAndUpdate(
          { _id: idPost },
          { 
            $push: { like: objLike._id },
            $inc: { likeCount: 1 },
            $set: { isLiked: true },
           }
        );

        console.log("Like: "+objLike)
        res.status(200).json(objLike)
      }
    }else{
      return res.status(400).send("Bài viết không tồn tại.");
    }
    
  } catch (error) {
    return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    
  }
}

exports.removeLike = async (req, res, next) => {
  try {
    const likeId = req.params.id;

    // Tìm kiếm like với _id
    const existingLike = await likeModel.likeModel.findById(likeId).populate("idUser", "fullname avatar")

    if (existingLike) {
      // Xóa likeId khỏi trường 'like' của bài viết
      await postModel.findOneAndUpdate(
        { _id: existingLike.idPost },
        { 
          $pull: { like: likeId },
          $inc: { likeCount: -1 },
          $set: { isLiked: false },
        }
      );

      // Xóa like
      await likeModel.likeModel.deleteOne({ _id: likeId })

      console.log(existingLike);
      res.status(200).json(existingLike);
    } else {
      res.status(404).send("Không tìm thấy bản ghi thích.");
    }
  } catch (error) {
    return res.status(500).send("Đã xảy ra lỗi: " + error.message);
  }
};

exports.getLikeByIdPost = async(req,res,next) =>{
  try {
    const idPost = req.params.idPost
    let listLike = await likeModel.likeModel.find({idPost:idPost})
                                            .populate("idUser", "fullname avatar");
    if(listLike!=null){
      res.json(listLike)
    }else{
      res.status(401).send("Lỗi thông tin lượt thích.")
    }
    } catch (error) {
      return res
      .status(500)
      .send("Đã xảy ra lỗi: " + error.message);
  }    
}