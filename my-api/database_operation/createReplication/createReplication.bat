:: Start MongoDB instances
start mongod --dbpath C:\MongoDB_Data\db1 --port 27017 --replSet myReplSet
start mongod --dbpath C:\MongoDB_Data\db2 --port 27018 --replSet myReplSet
start mongod --dbpath C:\MongoDB_Data\db3 --port 27019 --replSet myReplSet

:: Wait a bit to ensure MongoDB instances have started
timeout /t 10

:: Connect to one instance and configure the replica set
mongosh --port 27017 C:\Projects\ChatRoom\my-api\database_operation\createReplication\config_replica_set.js

:: Keep the cmd window open
pause
