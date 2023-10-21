# 部分变量及API格式详情

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
  contactId: req.session._id
}
```

---

#### 3. 新消息的格式：
```
{
  sender: {
    senderId: new mongoose.Types.ObjectId('')
  },
  receiver:{
    receiverId: new mongoose.Types.ObjectId('')
  },
  message: {
    messageType: '',
    messageContent: ''
  },
  date: new Date(),
  unread: Boolen(false)
}
```

---

#### 4. personalProfile API 返回数据包含：
```
{
  'username': req.session.username,
  'profilePictureURL': "http://localhost:5000/static/profile_photos/"+response.profilePictureName,
  'self_intro': response.self_intro,
  'gender': response.gender,
  'contacts': response.contacts,
  'like': response.like
}
```
由personalProfile调用，在个人主页 UserProfile 中使用

---

#### 5. 建立websocket后初始化数据内容：
```
let messageContent={
  'message': {},
};
```

---
### 6. key.txt

该文件中16位字符串用于注册。每整点自动刷新
目录：/my-api/key.txt

---

### 7. EXPRESS_API_BASE_URL

如果不在系统变量中设置，则其会自动使用/my-api/.env中的参数

推荐设置一下，设置方法：

export EXPRESS_API_BASE_URL=......

---

### 8. getFriendBoxInfo API 返回内容

```
let resData={
  _id: '',
  username: '',
  self_intro: '',
  gender: '',
  profilePictureURL: '',
  like: 0
}
```

---

### 9. getUnread API 

发送内容

```
{'sender.senderId': req.body.receiverId, 'receiver.receiverId': req.body.senderId}
```

返回内容

```
{unread: true}
```

