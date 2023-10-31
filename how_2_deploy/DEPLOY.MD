## 安装或更新 Node.js

首先检查 node.js 版本：

```bash
node -v
```

node.js 版本要求为18以上


## 安装必备 Node.js 库

分别进入 my-api 和 my-app，在两文件夹目录下分别运行npm install


## 安装并配置 mongodb 副本集

见 replicaSet.txt


## 安装并启用 nginx

见nginx.txt


## 安装并使用 pm2 （后台运行服务端用）

见pm2.txt


## 安全组放开端口

云服务器控制台中，在安全组中放开3000，5000以及其他必须端口


## 安装并启用防火墙（非必须）

见ufw.txt

注：在启动防火墙之前，一定要先放开22端口，SSH才不会断


## 启动 mongodb 副本集

配置好后在管理员模式下运行 startDB.sh 即可运行数据库


## 设置变量

在管理员模式下运行editEnv.sh即可


## 编译react app

在my-app下运行npm run build，将生成好的文件（build目录下）连同build文件夹放在一个所有用户都能访问（权限低）的文件夹

放置的目录需要填写到nginx配置文件中

或者放在一个由当前用户创建的文件夹，然后由当前用户进行下述操作





