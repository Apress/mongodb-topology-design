use test;

// Insert one example document
db.msglog.insertOne(
  {
    from: "nic", to: "sophie",
    createDate: ISODate("2019-11-04T20:55"),
    msg: "What's for dessert?",
    metadata: {
      deviceId: "34-A4-8C-71",
      deviceName: "iPhone XS",
      ip: "123.45.67.89",
      gps: { lat: 48.86, long: 2.349 }
   });

// Create an index that will purge documents after 365 days
db.msglog.createIndex(
   { "createDate": 1 },
   { expireAfterSeconds: 365*24*3600 } )

// Update a document and just remove the metadata which contains personal data
db.msglog.update(
   { _id: ObjectId(1234...) },
   { $unset: {metadata: "" } )

// Insert a document with medical test data
db.participants.insertOne({
	"name" : "Jon Smith",
	"ssn" : "213-43535-612",
	"birthdate" : ISODate("1979-05-20T22:00:00Z"),
	"weight" : NumberDecimal("81.6"),
  "address": {
    "street" : "123 High St",
    "suburb": "Oxford",
    "state": "OXF",
    "country": "GB" ,
    "postcode": "OX1 4DF"
  }
});

// Create a view which includes age (but not birthdate) for all adults in the collection
db.createView(
  "participants_adults_nonpersonal",
  "participants",
  [ { $addFields: {
        age: {
          $divide: [{
            $subtract: [new Date(), "$birthdate"]
          },
          365.25 * 24 * 60 * 60 * 1000]
        }
      }},
    { $match: { age: { $gt: 18 }}},
    { $project: {
        name: 0, ssn: 0, birthdate: 0, "address.street": 0, age: 0
      }}
  ]);

// Create a researcher role to access only adult data
use admin;
db.createRole({
    role  : "researcher",
    privileges : [
      {
        resource : {
            db : "app1",
            collection : " participants_adults_nonpersonal" },
        actions  : [ "find" ]
      }
    ],
      roles : []
    });

// Create an account for a researcher
db.createUser({
  user : "nic",
  pwd : "securepassword",
  roles : ["researcher "] }
);
