use test;

db.players.insertMany([{
    _id: 123,
    userName: "petesampras",
    country: "US",
    titles: 64
  },
  {
    _id: 124,
    userName: "bjornborg",
    country: "SE",
    titles: 63
  }
]);

db.players.aggregate([
  { $match: { country: "SE" } },
  { $group: {
     _id: "$country",
     count: { $sum: "$titles" }
    }
  }
]);

sh.updateZoneKeyRange("myDb.players",
   { country: "SE", userName: MinKey },
   { country: "SE", userName: MaxKey }, "EUR")

sh.addShardToZone("shardA", "EUR")


// See http://blog.rueckstiess.com/mtools/mlaunch.html
// mlaunch --replicaset --sharded shardA shardB shardC

use crm;

sh.splitAt("crm.contacts", {country: "US", acct: "a"});
sh.splitAt("crm.contacts", {country: "US", acct: "l"});
sh.splitAt("crm.contacts", {country: "US", acct: "r"});
sh.splitAt("crm.contacts", {country: "US", acct: "zzzzzzzzz"});

sh.moveChunk("crm.contacts",
   {country: "US", acct: "abc"}, "shardA")
sh.moveChunk("crm.contacts",
   {country: "US", acct: "man"}, "shardB")
sh.moveChunk("crm.contacts",
   {country: "US", acct: "sta"}, "shardC")
