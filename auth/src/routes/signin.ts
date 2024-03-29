import express, {Request, Response} from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { InvalidRequestError, validateRequest } from '@cgestione/fl-common';
import { User } from '../models';
import { PasswordHashAndCompare } from '../helpers/password';

const router = express.Router();

router.post('/api/users/signin', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid!'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('You must supply a password!')
], validateRequest, async (req: Request, res: Response) => {
    
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        throw new InvalidRequestError('Invalid credentials!');
    }

    const valid = await PasswordHashAndCompare.compare(existingUser.password, password);
    if (!valid) {
        throw new InvalidRequestError('Invalid credentials!');
    }

    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
    }, process.env.JWT_KEY!)
    
    req.session = {
        jwt: userJwt
    };

    return res.status(200).send(existingUser);

});

export default router;