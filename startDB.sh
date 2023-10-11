#!/bin/bash

# 检查是否是 root 用户
if [[ $EUID -ne 0 ]]; then
   echo "此脚本必须以 root 权限运行" 
   exit 1
fi

# 如果是 root 用户，运行以下命令
sudo mongod --replSet rs0 --port 27017 --dbpath /srv/mongodb/rs0-0 --oplogSize 128 &

sudo mongod --replSet rs0 --port 27018 --dbpath /srv/mongodb/rs0-1 --oplogSize 128 &

sudo mongod --replSet rs0 --port 27019 --dbpath /srv/mongodb/rs0-2 --oplogSize 128 &

