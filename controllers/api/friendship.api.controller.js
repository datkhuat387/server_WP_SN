const friendShip = require("../../models/friendships.model")
 
exports.addFriend = async (req, res, next) => {
    try {
        const idUser = req.body.idUser;
        const idFriend = req.body.idFriend;
    
        const checkIsFriend = await friendShip.friendshipModel.findOne({
            $or: [
            { idUser: idUser, idFriend: idFriend },
            { idUser: idFriend, idFriend: idUser },
            ],
        });
    
        if (checkIsFriend) {
            if (checkIsFriend.status === 0) {
            return res.status(401).send("Chờ chấp nhận");
            } else if (checkIsFriend.status === 1) {
            return res.status(401).send("Đã là bạn bè");
            } else if (checkIsFriend.status === 2) {
            return res.status(401).send("Trạng thái chặn");
            } else {
            return res.status(404).send("Lỗi trạng thái");
            }
        } else {
            const objFriend = new friendShip.friendshipModel({
            idUser: idUser,
            idFriend: idFriend,
            status: 0,
            isBlock: [],
            createAt: Date.now(),
            });
    
            if (!idUser || !idFriend) {
            return res.status(400).send("Lỗi thông tin người dùng");
            }
    
            await objFriend.save();
            console.log(objFriend);
            res.status(200).json(objFriend);
        }
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    }
};

exports.conFirmAddFriend = async(req,res,next)=>{
    try {
        const id = req.params.id;
        const checkFriend = await friendShip.friendshipModel.findOne({_id:id, status:0})
        if(!checkFriend){
            return res.status(400).send("Lời mời quá hạn.")
        }
        checkFriend.status = 1;
        const conFrim = await checkFriend.save();
        res.status(200).json(conFrim)
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    }
}

exports.notConFirmAddFriend = async(req,res,next)=>{
    try {
        const id = req.params.id;
        const checkFriend = await friendShip.friendshipModel.findOne({_id:id, status:0})
        if(!checkFriend){
            return res.status(400).send("Lời mời quá hạn.")
        }
        await friendShip.friendshipModel.deleteOne({_id:id})
        res.status(200).send("Đã xóa")
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    }
}

exports.block = async (req, res, next) => {
    try {
        const idFriend = req.params.idFriend;
        const idUser = req.params.idUser;
    
        const friendship = await friendShip.friendshipModel.findOne({
            $or: [
            { idUser: idUser, idFriend: idFriend },
            { idUser: idFriend, idFriend: idUser },
            ],
        });
    
        if (friendship) {
            friendship.status = 2;
            friendship.isBlock = [idUser];
            await friendship.save();
            return res.status(200).send("Đã chặn");
        } else {
            const objFriend = new friendShip.friendshipModel({
            idUser: idUser,
            idFriend: idFriend,
            status: 2,
            isBlock: [idUser],
            createAt: Date.now(),
            });
    
            if (!idUser || !idFriend) {
            return res.status(400).send("Lỗi thông tin người dùng");
            }
    
            await objFriend.save();
            console.log(objFriend);
            res.status(200).json(objFriend);
        }
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    }
};

exports.unBlock = async(req,res,next)=>{

}

exports.unfriend = async (req, res, next) => {
    try {
        const idUser = req.params.idUser;
  
        const checkIsFriend = await friendShip.friendshipModel.findOne({
            $or: [{ idUser: idUser, status: 1 }, { idFriend: idUser, status: 1 }],
        });
    
        if (checkIsFriend) {
            if (checkIsFriend.idUser === idUser) {
            await friendShip.friendshipModel.deleteOne({ idUser: idUser });
            console.log("idUser = idUser");
            return res.status(200).send("Đã hủy kết bạn");
            } else if (checkIsFriend.idFriend === idUser) {
            await friendShip.friendshipModel.deleteOne({ idFriend: idUser });
            console.log("idFriend = idUser");
            return res.status(200).send("Đã hủy kết bạn");
            } else {
            return res.status(400).send("Lỗi trạng thái: Không thể hủy kết bạn");
            }
        } else {
            return res.status(400).send("Không phải là bạn bè");
        }
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    }
};

exports.getStatus = async (req, res, next) => {
    try {
        const idUser = req.params.idUser;
        const idFriend = req.params.idFriend;
    
        const checkIsFriend = await friendShip.friendshipModel.findOne({
            $or: [
            { idUser: idUser, idFriend: idFriend },
            { idUser: idFriend, idFriend: idUser },
            ],
        });
    
        if (checkIsFriend) {
            if (checkIsFriend.status === 0 || checkIsFriend.status === 1) {
            return res.status(200).json(checkIsFriend);
            } else if (checkIsFriend.status === 2) {
            return res.status(401).send("Trạng thái chặn");
            } else {
            return res.status(404).send("Lỗi trạng thái");
            }
        }
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    }
};

exports.getListFriend = async (req, res, next) => {
    try {
        const idUser = req.params.idUser;
    
        const listFriend = await friendShip.friendshipModel
            .find({ $and: [{ $or: [{ idUser: idUser }, { idFriend: idUser }] }, { status: 1 }] })
            .populate("idFriend", "fullname avatar")
            .populate("idUser", "fullname avatar");
    
        if (listFriend.length > 0) {
            return res.status(200).json(listFriend);
        } else {
            return res.status(400).send("Không có bạn bè nào.");
        }
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    }
};

exports.getListFriendWaitConfrim = async(req,res,next)=>{
    try {
        const idUser = req.params.idUser;
        let listFriend = await friendShip.friendshipModel.find({idFriend:idUser,status:0}).populate("idUser", "fullname avatar")
                                                                                        .populate("idFriend", "fullname avatar");
        res.status(200).json(listFriend)
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    }
}

exports.getListFriendIsWaitConfrim = async(req,res,next)=>{
    try {
        const idUser = req.params.idUser;
        let listFriend = await friendShip.friendshipModel.find({idUser:idUser,status:0}).populate("idUser", "fullname avatar")
                                                                                        .populate("idFriend", "fullname avatar");
        res.status(200).json(listFriend)
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    }
}

exports.getListFriendIsBlock = async (req, res, next) => {
    try {
        const idUser = req.params.idUser;
        let listFriend = await friendShip.friendshipModel
            .find({ idUser: idUser, isBlock: { $in: [idUser] }, status: 2 })
            .populate("idUser", "fullname avatar");
        res.status(200).json(listFriend);
    } catch (error) {
        return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
    }
};

// exports.addFriend = async(req,res,next)=>{
//     try {
//         const idUser = req.body.idUser;
//         const idFriend = req.body.idFriend;

//         const checkIsFriend = await friendShip.friendshipModel.findOne({
//             idUser:idUser,
//             idFriend:idFriend
//         })
//         const checkIsFriend2 = await friendShip.friendshipModel.findOne({
//             idUser:idFriend,
//             idFriend:idUser
//         })
//         if(checkIsFriend||checkIsFriend2){
//             if(checkIsFriend && checkIsFriend.status === 0 || checkIsFriend2 && checkIsFriend2.status === 0){
//                 return res.status(401).send("Chờ chấp nhận")
//             }else if(checkIsFriend && checkIsFriend.status === 1 || checkIsFriend2 && checkIsFriend2.status === 1){
//                 return res.status(401).send("Đã là bạn bè")
//             }else if(checkIsFriend && checkIsFriend.status === 2 || checkIsFriend2 && checkIsFriend2.status === 2){
//                 return res.status(401).send("Trạng thái chặn")
//             }else{
//                 return res.status(404).send("Lỗi trạng thái")
//             }
//         }else{
//             let objFriend = new friendShip.friendshipModel();
//             objFriend.idUser = idUser;
//             objFriend.idFriend = idFriend;
//             objFriend.status = 0;
//             objFriend.isBlock = [];
//             objFriend.createAt = Date.now();
//             if(!idUser||!idFriend){
//                 return res.status(400).send("Lỗi thông tin người dùng")
//             }
//             await objFriend.save();
//             console.log(objFriend);
//             res.status(200).json(objFriend)
//         }
//     } catch (error) {
//         return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
//     }
// }

// exports.block = async (req, res, next) => {
//     try {
//         const idFriend = req.params.idFriend;
//         const idUser = req.params.idUser;
//         const checkIsFriend = await friendShip.friendshipModel.findOne({
//             idUser: idUser,
//             idFriend: idFriend
//         });
//         const checkIsFriend2 = await friendShip.friendshipModel.findOne({
//             idUser: idFriend,
//             idFriend: idUser
//         });
//         if (checkIsFriend) {
//             checkIsFriend.status = 2;
//             checkIsFriend.isBlock = [idUser];
//             await checkIsFriend.save();
//             return res.status(200).send("Đã chặn");
//         }
//         if (checkIsFriend2) {
//             checkIsFriend2.status = 2;
//             checkIsFriend2.isBlock = [idUser];
//             await checkIsFriend2.save();
//             return res.status(200).send("Đã chặn");
//         }
//         if (!checkIsFriend && !checkIsFriend2) {
//             let objFriend = new friendShip.friendshipModel();
//             objFriend.idUser = idUser;
//             objFriend.idFriend = idFriend;
//             objFriend.status = 2;
//             objFriend.isBlock = [idUser];
//             objFriend.createAt = Date.now();
//             if (!idUser || !idFriend) {
//                 return res.status(400).send("Lỗi thông tin người dùng");
//             }
//             await objFriend.save();
//             console.log(objFriend);
//             res.status(200).json(objFriend);
//         }
//     } catch (error) {
//         return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
//     }
// }

// exports.unfriend = async(req,res,next)=>{
//     try {
//         const idUser = req.params.idUser;

//         const checkIsFriend = await friendShip.friendshipModel.findOne({
//             idUser:idUser
//         })
//         const checkIsFriend2 = await friendShip.friendshipModel.findOne({
//             idFriend:idUser
//         })
//         if(checkIsFriend||checkIsFriend2){
//             if(checkIsFriend && checkIsFriend.status === 1){
//                 await friendShip.friendshipModel.deleteOne({idUser:idUser})
//                 console.log("idUser = idUser");
//                 return res.status(200).send("Đã hủy kết bạn")
//             }else if(checkIsFriend2 && checkIsFriend2.status === 1){
//                 await friendShip.friendshipModel.deleteOne({idFriend:idUser})
//                 console.log("idFriend = idUser");
//                 return res.status(200).send("Đã hủy kết bạn")
//             }else{
//                 return res.status(400).send("Lỗi trạng thái : Không thể hủy kết bạn")
//             }
//         }else{
//             return res.status(400).send("Không phải là bạn bè")
//         }
//     } catch (error) {
//         return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
//     }
// }

// exports.getStatus = async(req,res,next)=>{
//     try {
//         const idUser = req.params.idUser;
//         const idFriend = req.params.idFriend;

//         const checkIsFriend = await friendShip.friendshipModel.findOne({
//             idUser:idUser,
//             idFriend:idFriend
//         })
//         const checkIsFriend2 = await friendShip.friendshipModel.findOne({
//             idUser:idFriend,
//             idFriend:idUser
//         })
//         if(checkIsFriend||checkIsFriend2){
//             if(checkIsFriend && checkIsFriend.status === 0 || checkIsFriend2 && checkIsFriend2.status === 0){
//                 return res.status(200).json(checkIsFriend||checkIsFriend2)
//             }else if(checkIsFriend && checkIsFriend.status === 1 || checkIsFriend2 && checkIsFriend2.status === 1){
//                 return res.status(200).json(checkIsFriend||checkIsFriend2)
//             }else if(checkIsFriend && checkIsFriend.status === 2 || checkIsFriend2 && checkIsFriend2.status === 2){
//                 return res.status(401).send("Trạng thái chặn")
//             }else{
//                 return res.status(404).send("Lỗi trạng thái")
//             }
//         }
//     } catch (error) {
//         return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
//     }
// }

// exports.getListFriend = async(req,res,next)=>{
//     try {
//         const idUser = req.params.idUser;
//         let listFriend = await friendShip.friendshipModel.find({idUser:idUser, status:1}).populate("idFriend", "fullname avatar")
//         let listFriend2 = await friendShip.friendshipModel.find({idFriend:idUser,status:1}).populate("idUser", "fullname avatar");
//         if (listFriend.length > 0 && listFriend2.length === 0) {
//             return res.status(200).json(listFriend);
//         } else if (listFriend.length === 0 && listFriend2.length > 0) {
//             return res.status(200).json(listFriend2);
//         } else {
//             return res.status(400).send("Không có bạn bè nào.");
//         }
//     } catch (error) {
//         return res.status(500).send("Đã xảy ra lỗi svr: " + error.message);
//     }
// }