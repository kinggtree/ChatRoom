#!/bin/bash

# 检查是否以root用户运行脚本
if [ "$(id -u)" != "0" ]; then
   echo "这个脚本必须以root用户运行" 1>&2
   exit 1
fi

# 动态获取公网IP并设置为环境变量
public_ip=$(curl -s ifconfig.me)
echo "export EXPRESS_API_BASE_URL='$public_ip:5000'" >> /etc/environment
source /etc/environment

# 修改.env.production文件中的REACT_APP_API_BASE_URL变量
env_file="/root/ChatRoom/my-app/.env.production"
sed -i "/^REACT_APP_API_BASE_URL=/c\REACT_APP_API_BASE_URL=http://$public_ip:5000" $env_file

echo $EXPRESS_API_BASE_URL

echo $REACT_APP_API_BASE_URL
