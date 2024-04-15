var express = require('express');
var router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads'); // Chỉ định thư mục lưu trữ ảnh
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Đặt tên tệp tin ảnh
    }
});
const upload = multer({ storage: storage });
const apiUSer = require('../controllers/api/users.api.controller');
const apiPost = require("../controllers/api/post.api.controller");
const apiLike = require("../controllers/api/like.api.controller");
const apiComment = require("../controllers/api/comment.api.controller");
const apiUserInfo = require("../controllers/api/userInfo.api.controller");
const apiFriendShip = require("../controllers/api/friendship.api.controller");
const token = require("../middleware/ensureAuthenticated");
const apiRelationship = require("../controllers/api/relationship.api.controller");

///-------------user----------------///
router.post('/login',apiUSer.login);
router.post('/createAccount',apiUSer.createUser);
router.get('/user/:idUser',apiUSer.getAccount);
router.put('/user/:idUser',apiUSer.updateUser);
router.put('/updateFullname/:idUser',apiUSer.updateFullname);
router.put('/updateAvatar/:idUser',upload.single('avatar'),apiUSer.updateAvatar);
router.put('/userChangePasswd/:idUser',apiUSer.changePassword);
///-----------userInfor-------------///
router.post('/createUserInfo/:idUser',apiUserInfo.createUserInfo);
router.get('/userInfo/:idUser',apiUserInfo.getUserInfo);
router.put('/updateDateOfBirth/:id',apiUserInfo.updateDatOfBirth);
router.put('/updateUserInfo/:id',apiUserInfo.updateUserInfo);
///-------------post----------------///
router.post('/createPost',upload.single('image'),apiPost.createPost);
router.get('/getAllPost/:idUser',apiPost.getAllPost);
router.put('/updatePost/:id',upload.single('image'),apiPost.updatePost)
router.delete('/post/:id',apiPost.removePost);
router.get('/detailPost/:id',apiPost.getDetailPostById)
router.get('/getPostByIdUser/:idUser',apiPost.getPostByidUser);
///------------like----------------///
// router.post('/like',apiLike.like);
router.delete('/removeLike/:id',apiLike.removeLike);
router.get('/listLikeByIdPost/:idPost',apiLike.getLikeByIdPost)
router.post('/like',apiLike.likeByIdPost)
///-----------comment-------------///
router.post('/comment/',apiComment.commentByIdPost);
router.get('/comment/:idPost',apiComment.getListCmtByIdPost);
router.put('/comment/:id',apiComment.updateComment);
router.delete('/comment/:id',apiComment.removeComment);
///------------Friend------------///
router.post('/addFriend',apiFriendShip.addFriend);
router.delete('/unFriend/:idUser',apiFriendShip.unfriend);
router.get('/friend/:idUser/:idFriend',apiFriendShip.getStatus);
router.get('/listFriend/:idUser',apiFriendShip.getListFriend);
router.get('/listFriendWaitConfirm/:idUser',apiFriendShip.getListFriendWaitConfrim);
router.get('/listFriendIsWaitConfirm/:idUser',apiFriendShip.getListFriendIsWaitConfrim);
router.get('/listFriendIsBlock/:idUser',apiFriendShip.getListFriendIsBlock);
router.put('/confirmAddFriend/:id',apiFriendShip.conFirmAddFriend);
router.delete('/notConfirmAddFriend/:id',apiFriendShip.notConFirmAddFriend);
router.put('/block/:idUser/:idFriend',apiFriendShip.block);
///----------Type Relationship------///
router.post("/createTypeRelationship",apiRelationship.createTypeRelationship);

module.exports = router;