# 部分变量格式详情

#### 1. 数据库中users的储存格式：
```
{
  username: req.body.newUsername,
  password: req.body.newPassword,
  contacts:[]
  profilePictureName: 'default.png'
}
```

---

#### 2. ChatInterface中的userInfo:
```
{
  'username': req.session.username,
  'contacts': response.contacts,
  '_id': req.session._id
}
```

其中，contacts为一个数组，里面储存的是对象：
```
{
  contactUsername: req.session.username,
  contactId: req.session._id
}
```

---

#### 3. 新消息的格式：
```
{
  sender: {
    senderName:'',
    senderId: new mongoose.Types.ObjectId('')
  },
  receiver:{
    receiverName: '',
    receiverId: new mongoose.Types.ObjectId('')
  },
  message: {
    messageType: '',
    messageContent: ''
  },
  date: new Date()
}
```

#### 4. 个人信息包含：
用户名
个人简介
头像
个人资料：性别，生日

修改密码
