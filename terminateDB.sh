#!/bin/bash

# 检查是否是 root 用户
if [[ $EUID -ne 0 ]]; then
   echo "此脚本必须以 root 权限运行" 
   exit 1
fi

sudo pkill mongod
pkill mongosh
