use library;

db.borrowers.insertOne({
  _id: "js1234",
  name: "John",
  surname: "Smith",
  email: "john@smith.net",
  state: "NY",
  dob: Date("1978-05-12")
});

db.authors.insertOne({
  _id: 123,
  name: "Homer",
  books: [{
    id: ObjectId("5ee64b887077a4ee07e49e81"),
    title: "The Oddysey",
    cover_img: "the_oddysey.png"
  }]
});


db.books.insertOne({
  _id: ObjectId("5ee64b887077a4ee07e49e81"),
  author: 123,
  title: "The Oddysey",
  cover_img: "the_oddysey.png",
  available: 4,
  checkout: [{
    by: "js1234",
    date: "2019-10-14"
  }, {
    by: "nic",
    date: "2019-09-12"
  }],
  publisher: "Penguin",
  ISBN: "123-456789-012"
});

// Find a particular book, and check it out _only_ if there is one available
db.books.findAndModify({
  query: {
    _id: ObjectId("5ee64b887077a4ee07e49e81"),
    available: {
      $gt: 0
    }
  },
  update: {
    $inc: {
      available: -1
    },
    $push: {
      checkout: {
        by: "jill",
        date: new Date()
      }
    }
  }
});
