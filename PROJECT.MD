# 部分变量及API格式详情

#### 1. 数据库中users的储存格式：
```js
{
  username: {type: String, unique: true},
  password: String,
  profilePictureName: String,
  self_intro: String,
  gender: String,
  like: {type: Number, default: 0},
  contacts: [
    {
      _id: false,
      contactId: mongoose.Schema.Types.ObjectId,
    }
  ],
  groups: [
    {
      _id: false,
      groupId: mongoose.Schema.Types.ObjectId,
    }
  ]
}
```

---

#### 2. ChatInterface中的userInfo:
```js
{
  'username': req.session.username,
  'contacts': response.contacts,
  'groups': response.groups,
  '_id': req.session._id
}
```

其中，contacts为一个数组，里面储存的是对象：
```js
{
  contactId: req.session._id
}
```

---

#### 3. 新消息的格式：
```js
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
```js
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
```js
let messageContent={
  'message': {},
};
```

---
#### 6. key.txt

该文件中16位字符串用于注册。每整点自动刷新
目录：/my-api/key.txt

---

#### 7. EXPRESS_API_BASE_URL

如果不在系统变量中设置，则其会自动使用/my-api/.env中的参数

推荐设置一下，设置方法：

```bash
export EXPRESS_API_BASE_URL=......

```

---

#### 8. getFriendInfo API 返回内容

```js
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

#### 9. getUnread API 

发送内容

```js
{'sender.senderId': req.body.receiverId, 'receiver.receiverId': req.body.senderId}
```

返回内容

```js
{unread: true}
```

---

#### 10. fullContact API 返回数组内每个元素的格式

```js
{
  _id: item._id,
  username: item.username,
  profilePictureURL: URLPath+item.profilePictureName,
  isNewMessage: false
}
```

---

#### 11. Redux中unreadContact 状态内容

```js
{
  state[contactId]={
    unreadCount: 0,
    messageIds: []
  }
}
```

---

#### 12. 群组基础信息获取(groupInfo)
```js
const group: [
  {
    _id: group._id.toString(),
    groupName: group.groupName,
    groupProfilePictureURL: URLPath+group.groupProfilePictureName
  }
]

```

#### 13. 群组完整信息获取(fullGroupInfo)
```js
const fullGroupInfo = {
  groupName: group.groupName,
  groupOwnerId: group.groupOwnerId,
  groupMembers: group.groupMembers,
  groupProfilePictureURL: URLPath + group.groupProfilePictureName,
  group_intro: group.group_intro,
  group_notice: group.group_notice
};
```
