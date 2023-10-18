var express = require('express');
var router = express.Router();


const mongoose=require("mongoose");
mongoose.Promise = require("bluebird");
mongoose.connect(process.env.EXPRESS_DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// 导入拆分后的路由文件
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');


// 将路由挂载到主路由上
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/message', messageRoutes);

// 拆分暂未完成，需要使用apiRouter copy.js.backup来代替本文件



module.exports = router;
