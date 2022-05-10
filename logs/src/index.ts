
import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';



const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }

    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }

    if (!process.env.NATS_URL) {
        throw new Error('NATS_URL must be defined!');
    }

    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS_CLUSTER_ID must be defined!');
    }

    if (!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID must be defined!');
    }

    const url = process.env.MONGO_URI

    try {
        //Connection to nats
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!');
            process.exit();
        });
        //Gracefull shutdown to nats
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close())

        await mongoose.connect(url);
    } catch (err) {
        console.log(err);
    }

    app.listen(3000, async () => {
        console.log('LOGS-MS PORT:3000')
    });
};

start();