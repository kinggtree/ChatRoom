#!/bin/bash

# 检查是否以root用户运行脚本
if [ "$(id -u)" != "0" ]; then
   echo "这个脚本必须以root用户运行" 1>&2
   exit 1
fi

# 在/root/ChatRoom/my-api目录下使用pm2启动Express服务
cd my-api
pm2 start npm --name "Express-Service" -- start

# 启动nginx服务
service nginx start
