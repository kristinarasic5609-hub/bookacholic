require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('./models/Book');
const User = require('./models/User');
const Request = require('./models/Request');
const booksData = require('./books.json');
const usersData = require('./users.json');
const requestsData = require('./requests.json');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(async () => {
        console.log('Connected to MongoDB');

        await Book.deleteMany({});
        await User.deleteMany({});
        await Request.deleteMany({});

        await Book.insertMany(booksData);
        await User.insertMany(usersData);
        await Request.insertMany(requestsData);

        console.log('Data imported!');
        mongoose.disconnect();
    })
    .catch(err => console.log(err));
