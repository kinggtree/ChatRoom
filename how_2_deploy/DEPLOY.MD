## 设置变量

设置react变量

调整my-app下.env.production文件里面的内容为服务器IP地址（或者为能够访问API的地址）

设置系统变量（后端使用）

使用export default ...... 

```
EXPRESS_API_BASE_URL=http://localhost:5000
EXPRESS_DATABASE_URL=mongodb://127.0.0.1/ChatRoom
```

具体的值需要根据实际情况调整

---

## 编译react app

在my-app下运行npm run build，将生成好的文件（build目录下）连同build文件夹放在一个所有用户都能访问（权限低）的文件夹

或者放在一个由当前用户创建的文件夹，然后由当前用户进行下述操作

---

## 安装并配置mongodb副本集

见replicaSet.txt

配置好后在管理员模式下运行startDB.sh即可运行数据库

---

## 安装并启用nginx

见nginx.txt

---

## 安装并使用pm2（后台运行服务端用，非必须）

见pm2.txt

---

## 安装并启用防火墙

见ufw.txt

注：一定要先放开22端口，SSH才不会断

云服务器控制台也要在安全组中放开3000，5000端口

## 设置环境变量

