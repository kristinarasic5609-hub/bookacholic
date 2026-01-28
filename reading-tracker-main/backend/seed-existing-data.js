require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Book = require('./models/Book');
const User = require('./models/User');
const Request = require('./models/Request');

const booksData = require('../src/jsonfiles/books.json');
const usersData = require('../src/jsonfiles/users.json');
const requestsData = require('../src/jsonfiles/request.json');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/reading-tracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(async () => {
        console.log('Connected to MongoDB');

        try {
            await Book.deleteMany({});
            await User.deleteMany({});
            await Request.deleteMany({});
            console.log('Cleared existing data');

            const hashedUsers = await Promise.all(
                usersData.users.map(async (user) => {
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(user.password, salt);
                    return {
                        ...user,
                        password: hashedPassword
                    };
                })
            );

            await Book.insertMany(booksData.books);
            console.log(`Inserted ${booksData.books.length} books`);

            await User.insertMany(hashedUsers);
            console.log(`Inserted ${hashedUsers.length} users with hashed passwords`);

            await Request.insertMany(requestsData.requests);
            console.log(`Inserted ${requestsData.requests.length} requests`);

            console.log('✅ Data import completed successfully!');
            console.log('\n📋 Available accounts:');
            console.log('Admin: username=admin, password=admin');
            console.log('Users: username=tina, password=1234');
            console.log('       username=userr1, password=user1');
            console.log('       username=user2, password=user2');
            console.log('       username=kristina, password=pssw');
            console.log('       username=test, password=test');
            console.log('       username=test11, password=test');
            console.log('       username=ab32, password=test');

            mongoose.disconnect();
        } catch (error) {
            console.error('Error importing data:', error);
            mongoose.disconnect();
        }
    })
    .catch(err => console.error('MongoDB connection error:', err));

