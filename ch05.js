rs.reconfig({
   "_id" : "myRS",
   …
   "members" : [
       { "_id" : 0, "host" : "mongodb0.bigbank.local:27017", ...,
          "tags": { "dc": "east-1", "use": "prod" }, ... },
       { "_id" : 1, "host" : "mongodb1.bigbank.local:27017", ...,
           "tags": { "dc": "east-2", "use": "prod" }, ... },
       { "_id" : 2, "host" : "mongodb2.bigbank.local:27017", ...,
          "tags": { "dc": "west", "use": "analytics" }, ... }
   ],
   …
}
)


conf = rs.conf();
conf.settings = {
  getLastErrorModes: { multi_dc : { "region": 2 } }
};
rs.reconfig(conf);

// Update a document with this custom write concern
db.collection.update( { _id: 123, status: "Important" },
  { writeConcern: { w: "multi_dc" } } );


// Remove votes from one node
conf = rs.conf();
/*
The `conf` variable will look similar to:
{
   "_id" : "rs0",
   "version" : 1,
   "protocolVersion" : NumberLong(1),
   "members" : [
      {
         "_id" : 0,
         "host" : "mongodb0.example.local:27017",
         "arbiterOnly" : false,
         "hidden" : false,
         "priority" : 1,
         "votes" : 1
      },
      {
         "_id" : 1,
         "host" : "mongodb1.example.local:27017",
         "arbiterOnly" : false,
         "hidden" : false,
         "priority" : 1,
         "votes" : 1
      },
      {
         "_id" : 2,
         "host" : "mongodb2.example.local:27017",
         "arbiterOnly" : true,
         "hidden" : false,
         "priority" : 0
         "votes" : 1
      }
   ],
   "settings" : {
      …
   }
}
*/
conf. members[1].votes = 0;
rs.reconfig(conf);
