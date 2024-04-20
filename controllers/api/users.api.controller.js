const { utc } = require("moment-timezone");
const userModel = require("../../models/users.model");
const multer = require('multer');
const fs = require('fs');
const bcrypt = require("bcrypt");
const { userInforModel } = require("../../models/userInfo.model");
const { friendshipModel } = require("../../models/friendships.model");

exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  let query;
  if (isValidEmail(username)) {
    query = { email: username };
  } else if (isValidPhoneNumber(username)) {
    query = { phone: username };
  } else {
    return res.status(400).send("Tên đăng nhập không hợp lệ.");
  }

  try {
    const checkExistUser = await userModel.userModel.findOne(query);
    if (checkExistUser) {
      if (checkExistUser.status === 0) {
        const checkPasswd = await bcrypt.compare(password, checkExistUser.password);
        if (checkPasswd) {
          return res.status(200).json(checkExistUser);
        } else {
          return res.status(401).send("Mật khẩu không đúng.");
        }
      } else {
        return res.status(401).send("Tài khoản đã bị khóa.");
      }
    } else {
      return res.status(401).send("Tài khoản không tồn tại.");
    }
  } catch (error) {
    return res.status(500).send("Đã xảy ra lỗi khi đăng nhập: " + error.message);
  }
};

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhoneNumber(phoneNumber) {
  const phoneRegex = /^0\d{9,}$/;
  return phoneRegex.test(phoneNumber);
}
exports.getAccount = async (req, res, next) => {
  const idUser = req.params.idUser;
  let user = await userModel.userModel.findOne({ _id: idUser }).select("-password");
  if (user != null) {
    if (user.status === 0) {
      res.json(user);
    } else {
      res.status(401).send("Tài khoản đã bị khóa.");
    }
  } else {
    res.status(401).send("Lỗi thông tin tài khoản.");
  }
};
exports.createUser = async (req, res, next) => {
  const { username, password } = req.body;

  let query;
  if (isValidEmail(username)) {
    query = { email: username };
  } else if (isValidPhoneNumber(username)) {
    query = { phone: username };
  } else {
    return res.status(400).send("Tên đăng nhập không hợp lệ.");
  }

  try {
    // Kiểm tra xem đã tồn tại tài khoản với username đã nhập chưa
    const checkExistUser = await userModel.userModel.findOne(query);
    if (checkExistUser) {
      return res.status(400).send("Email hoặc Số điện thoại đã tồn tại.");
    }

    let objuser = new userModel.userModel();
    if (JSON.stringify(query) === JSON.stringify({ email: username })) {
      objuser.email = req.body.username;
      objuser.phone = ""
    } else if (JSON.stringify(query) === JSON.stringify({ phone: username })) {
      objuser.phone = req.body.username;
      objuser.email = ""
    }

    const salt = await bcrypt.genSalt(15);
    objuser.password = await bcrypt.hash(req.body.password, salt);
    objuser.fullname = req.body.fullname;
    objuser.checkFriend = 3;
    objuser.status = 0 // 0-bt, 1 - khóa
    objuser.avatar = "/uploads/1712912703894-anh-mac-dinh-7.jpg";
    objuser.idAccountType = "65fd48f0d1562307a2ffae35";
    objuser.createAt = Date.now();
    objuser.updateAt = Date.now();
    await objuser.save()
    res.status(200).json(objuser);
  } catch (error) {
    return res
      .status(500)
      .send("Đã xảy ra lỗi khi đăng ký: " + error.message);
  }
};
exports.updateUser = async (req, res, next) => {
  const { idUser } = req.params;
  const { email, phone } = req.body;

  try {
    let user = await userModel.userModel.findById(idUser);
    if (!user) {
      return res.status(404).send("Người dùng không tồn tại.");
    }

    if (user.status !== 0) {
      return res.status(401).send("Tài khoản đã bị khóa.");
    }

    // Kiểm tra email đã tồn tại hay chưa
    if (email !== undefined && email !== "") {
      const existingEmailUser = await userModel.userModel.findOne({ email });
      if (existingEmailUser && existingEmailUser._id.toString() !== idUser) {
        return res.status(400).send("Email đã tồn tại.");
      }
      if (!isValidEmail(email)) {
        return res.status(400).send("Email không hợp lệ.");
      }
      user.email = email;
    }

    // Kiểm tra số điện thoại đã tồn tại hay chưa
    if (phone !== undefined && phone !== "") {
      const existingPhoneUser = await userModel.userModel.findOne({ phone });
      if (existingPhoneUser && existingPhoneUser._id.toString() !== idUser) {
        return res.status(400).send("Số điện thoại đã tồn tại.");
      }
      if (!isValidPhoneNumber(phone)) {
        return res.status(400).send("Số điện thoại không hợp lệ.");
      }
      user.phone = phone;
    }

    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).send("Đã xảy ra lỗi khi cập nhật người dùng: " + error.message);
  }
};
exports.updateFullname = async (req, res, next) => {
  const { idUser } = req.params;
  const { fullname } = req.body;

  try {
    let user = await userModel.userModel.findById(idUser);
    if (!user) {
      return res.status(404).send("Người dùng không tồn tại.");
    }

    if (user.status !== 0) {
      return res.status(401).send("Tài khoản đã bị khóa.");
    }

    if (fullname !== undefined && fullname !== "") {
      user.fullname = fullname;
    }

    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).send("Đã xảy ra lỗi khi cập nhật người dùng: " + error.message);
  }
};
exports.updateAvatar = async (req, res, next) => {
  try {
    const { idUser } = req.params;
    const user = await userModel.userModel.findById(idUser);
    if (!user) {
      return res.status(404).send("Người dùng không tồn tại.");
    }

    if (user.status !== 0) {
      return res.status(401).send("Tài khoản đã bị khóa.");
    }
    user.avatar =
    req.file == null || req.file == undefined? ""
    : `/uploads/${req.file.filename}`;

    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Đã xảy ra lỗi khi cập nhật avatar người dùng: " + error.message);
  }
};
exports.changePassword = async (req, res, next) => {
  const accountId = req.params.idUser;
  const currentPassword = req.body.currentPassword || "";
  const newPassword = req.body.newPassword || "";

  try {
    // Tìm tài khoản trong cơ sở dữ liệu
    const user = await userModel.userModel.findById(accountId);
    if (!user) {
      return res.status(404).send("Tài khoản không tồn tại.");
    }

    if (user.status !== 0) {
      return res.status(401).send("Tài khoản đã bị khóa.");
    }

    // Kiểm tra mật khẩu hiện tại
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(400).send("Mật khẩu hiện tại không đúng.");
    }

    // Kiểm tra mật khẩu mới trùng với mật khẩu hiện tại
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res
        .status(400)
        .send("Mật khẩu mới phải khác mật khẩu hiện tại.");
    }

    // Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(15);
    const newPasswordHashed = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu mới vào cơ sở dữ liệu
    user.password = newPasswordHashed;
    user.updateAt = new Date();

    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .send("Đã xảy ra lỗi khi đổi mật khẩu: " + error.message);
  }
};
// exports.searchUser = async(req,res,next)=>{
//   try {
//     const idUser = req.params.idUser;
//     const textSearch = req.body.textSearch;
//     const regexSearch = new RegExp(textSearch,'i');

//     let resultUser = await userModel.userModel.find({fullname: {$regex: regexSearch}}).select("fullname avatar")
//     res.status(200).json(resultUser)
//   } catch (error) {
//     console.log("Lỗi try catch");
//     return res.status(500).send("Đã xảy ra lỗi: " + error.message);
//   }
// }
exports.searchUser = async (req, res, next) => {
  try {
    const idUser = req.params.idUser;
    const textSearch = req.body.textSearch;
    const regexSearch = new RegExp(textSearch, 'i');

    // Tạo map ánh xạ giá trị status sang checkFriend
    const statusToCheckFriendMap = {
      0: 0,
      1: 1,
      2: 2,
    };

    // Tìm kiếm người dùng theo điều kiện textSearch
    let resultUser = await userModel.userModel
      .find({ fullname: { $regex: regexSearch } })
      .select("fullname avatar");

    // Lặp qua danh sách người dùng tìm được
    for (let i = 0; i < resultUser.length; i++) {
      const user = resultUser[i];

      // Kiểm tra xem người dùng đó có phải là bạn bè của idUser không
      const friendship = await friendshipModel
        .findOne({
          $or: [
            { idUser: idUser, idFriend: user._id },
            { idUser: user._id, idFriend: idUser },
          ],
        })
        .exec();

      // Ánh xạ giá trị status sang checkFriend
      user.checkFriend = friendship
        ? statusToCheckFriendMap[friendship.status]
        : 3;
    }

    res.status(200).json(resultUser);
  } catch (error) {
    console.log("Lỗi try catch");
    return res.status(500).send("Đã xảy ra lỗi: " + error.message);
  }
};