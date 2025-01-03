# 🚀 一个较为简单的聊天室项目

这是一个使用React和Express开发的前后端分离的聊天室项目，项目开发模式为JavaScript全栈开发

# 尚未完成路由拆分，详情见apiRouter.js

## 💻 技术栈

- 前端：React
- 后端：Express
- 状态管理：Redux

## 🔬 项目结构

```
├── how_2_deploy
├── my-api
│   ├── bin
│   ├── routes
│   ├── schema
│   ├── static
│   │   └── profile_photos
│   └── views
└── my-app
    ├── build
    │   └── static
    │       ├── css
    │       └── js
    ├── public
    └── src
        ├── components
        │   ├── Interface
        │   │   ├── AvatarUploader
        │   │   ├── Chat
        │   │   │   ├── Contacts
        │   │   │   │   ├── GroupItem
        │   │   │   │   └── PersonItem
        │   │   │   ├── FriendBox
        │   │   │   │   ├── FriendProfile
        │   │   │   │   └── MessageContent
        │   │   │   │       ├── MessageInput
        │   │   │   │       └── WebSocketContext
        │   │   │   └── GroupBox
        │   │   │       ├── GroupProfile
        │   │   │       │   ├── ManageGroupMember
        │   │   │       │   └── ManageNotice
        │   │   │       │       └── AddNotice
        │   │   │       └── MessageContent
        │   │   │           ├── MessageInput
        │   │   │           └── WebSocketContext
        │   │   ├── TopBar
        │   │   │   ├── AddFriend
        │   │   │   ├── CreateGroup
        │   │   │   └── LogOut
        │   │   └── UserProfile
        │   │       ├── EditInfo
        │   │       ├── EditPwd
        │   │       └── ManageContacts
        │   ├── LoginForm
        │   └── SignUp
        ├── reduxActions
        └── reduxSlice
```


🔍 **关键文件/文件夹说明**
- /my-api 后端代码 / 服务器
- /my-app 前端代码 / 服务器
- /my-api/key.txt 保存了服务器每整点自动刷新的密钥，用于登录
- /my-api/.env 后端环境变量（在系统没有设置的情况下）
- /my-app/.env 编写阶段中所用的环境变量
- /my-app/.env.production 部署（实际使用）阶段中所用的环境变量。该值需要根据实际情况来更改
- startDB.sh 需要在管理员权限下启动的，一键启动所有数据库副本集的脚本
- terminateDB.sh 同上，只不过用来终止数据库

## 💾 安装与运行

见how_2_deploy文件夹


## 📝 开发日志

见LOGS.MD文件

## 🔌 API/技术文档

见PROJECT.MD

