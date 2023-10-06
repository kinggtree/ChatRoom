# 一个不知道什么时候能做完的聊天室

9.27

将前端的基础框架搭起来了。目前还未考虑美观性

同时消息部分还没有测试

10.6 

session，从数据库访问用户，登录，登出，消息发送（到数据库）已经完成

接下来需要完成消息实时显示。（使用websocket）

目前搭好了wss的架子，需要进一步完善

websocket前端还没有调用

www文件负责将两个路由合并到一块，apiRouter.js和app.js负责Express部分的路由，wsServer顾名思义

在ChatInterface以及其里面的组件中，userInfo已经包含了一个比较完整的用户内容。其中的通讯录中包括用户名(contactUsername)，用户ID(contactId)

接收消息已经用express api完成了

明天只需要看看websocket如何使用，如何用websocket实现消息的实时显示