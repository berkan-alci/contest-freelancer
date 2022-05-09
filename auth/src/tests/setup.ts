import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
    var signin: (id?: string) => string[];
}


jest.mock('../nats-wrapper');

//Init mongo & env variables before testing
let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = "asdf";
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri);
});

//Clear each collection before running tests
beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

//Close the connection after testing.
afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
}, 150000);


//get cookie in valid format for testing with optional userId.
global.signin = (id?: string) => {
    const token = jwt.sign({ id: id || new mongoose.Types.ObjectId().toHexString(), email: 'test@test.com' }, process.env.JWT_KEY!)
    const sessionJSON = JSON.stringify({ jwt: token });
    const base64 = Buffer.from(sessionJSON).toString('base64');

    return [`session=${base64}`];
};