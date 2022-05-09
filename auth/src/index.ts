
import { app } from './app';


const initEnv = () => {
    if (!process.env.JWT_KEY) {
        
    }
};

const initMongo = async () => {
    const url = process.env.MONGO_URI
};