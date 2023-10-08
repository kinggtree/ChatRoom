// Configuration for the replica set
var cfg = {
  "_id": "myReplSet",
  "members": [
    {
      "_id": 0,
      "host": "localhost:27017"
    },
    {
      "_id": 1,
      "host": "localhost:27018"
    },
    {
      "_id": 2,
      "host": "localhost:27019"
    }
  ]
};

// Initialize the replica set
rs.initiate(cfg);

// Give it a moment to complete the initiation
sleep(5000);

// Check the status
printjson(rs.status());
