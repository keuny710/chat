const mongoose = require('mongoose');
const User = require('../app/models/user');
const userData = { name: 'Test1', email:'test@gmail.com' };
require('dotenv').config();
const {MONGO_ID, MONGO_PASSWORD, MONGO_DB} = process.env;

describe('User Model Test', () => {
    let connection;
    let db;


    // It's just so easy to connect to the MongoDB Memory Server 
    // By using mongoose.connect
    beforeAll(async () => {
        connection = await mongoose.connect('mongodb://root:qwer1234@localhost:27017/', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err) => {
            if (err) {
                console.error(err);
                
            }
        });
        db = await connection.db('nodejs');

    });

    afterAll(async () => {
        await connection.close();
        // await db.close();
      });



    it('create & save user successfully', async () => {
        const validUser = new User(userData);
        const savedUser = await validUser.save();
        // Object Id should be defined when successfully saved to MongoDB.
        expect(savedUser._id).toBeDefined();
        expect(savedUser.name).toBe(userData.name);
        expect(savedUser.email).toBe(userData.email);
    });

    // Test Schema is working!!!
    // You shouldn't be able to add in any field that isn't defined in the schema
    it('insert user successfully, but the field does not defined in schema should be undefined', async () => {
        const userWithInvalidField = new User({ name: 'Test1', email: 'test@gmail.com' });
        const savedUserWithInvalidField = await userWithInvalidField.save();
        expect(savedUserWithInvalidField._id).toBeDefined();
    });

    // Test Validation is working!!!
    // It should us told us the errors in on gender field.
    it('create user without required field should failed', async () => {
        const userWithoutRequiredField = new User({ name: 'Test1' });
        let err;
        try {
            const savedUserWithoutRequiredField = await userWithoutRequiredField.save();
            error = savedUserWithoutRequiredField;
        } catch (error) {
            err = error
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
        expect(err.errors.email).toBeDefined();
    });

    
});