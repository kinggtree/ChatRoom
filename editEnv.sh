#!/bin/bash

# 检查是否以root用户运行脚本
if [ "$(id -u)" != "0" ]; then
   echo "这个脚本必须以root用户运行" 1>&2
   exit 1
fi

# 永久设置系统环境变量EXPRESS_API_BASE_URL
echo "export EXPRESS_API_BASE_URL='123.60.24.173:5000'" >> /etc/environment
source /etc/environment


# 修改.env.production文件中的REACT_APP_API_BASE_URL变量
env_file="my-app/.env.production"
api_url="123.60.24.173:5000"
sed -i "/^REACT_APP_API_BASE_URL=/c\REACT_APP_API_BASE_URL=$api_url" $env_file