import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
    var signin: (id?: string) => string[];
}


jest.mock('../nats-wrapper');

let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = "asdf";
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri);
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
}, 150000);


global.signin = (id?: string) => {
    const token = jwt.sign({ id: id || new mongoose.Types.ObjectId().toHexString(), email: 'test@test.com' }, process.env.JWT_KEY!)
    const sessionJSON = JSON.stringify({ jwt: token });
    const base64 = Buffer.from(sessionJSON).toString('base64');

    return [`session=${base64}`];
};