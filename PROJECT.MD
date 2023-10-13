# 部分变量格式详情

#### 1. 数据库中users的储存格式：
```
{
  username: req.body.newUsername,
  password: req.body.newPassword,
  contacts:[],
  self_intro: 'introduce to yourself!',
  gender: '',
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

---

#### 4. 个人信息包含：
```
{
  'username': req.session.username,
  'profilePictureURL': "http://localhost:5000/static/profile_photos/"+response.profilePictureName,
  'self_intro': response.self_intro,
  'gender': response.gender,
  'contacts': response.contacts
}
```
由personalProfile调用

---

#### 5. 建立websocket后初始化数据内容：
```
let messageContent={
  'message': {},
  'friendInfo': {}
};
```

---
### 6. key.txt

该文件中16位字符串用于注册。每整点自动刷新
目录：/my-api/key.txt


