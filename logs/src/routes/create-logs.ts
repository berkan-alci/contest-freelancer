import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { requireAuth, validateRequest } from '@cgestione/fl-common';
import { Logs } from '../models';
import { natsWrapper } from '../nats-wrapper';
import { LogCreatedPublisher } from '../events';
const router = express.Router();

router.post('/api/logs', requireAuth, [
    body('title')
        .not()
        .isEmpty()
        .withMessage('Title is required'),
    body('description')
        .not()
        .isEmpty()
        .withMessage('Description is required'),
    body('startsAt')
        .not()
        .isEmpty()
        .withMessage('Start date is required'),
    body('expiresAt')
        .not()
        .isEmpty()
        .withMessage('End date is required'),
], validateRequest, async (req: Request, res: Response) => {

    const log = Logs.build({
        title: req.body.title,
        description: req.body.description,
        startsAt: req.body.startsAt,
        expiresAt: req.body.expiresAt,
        user: {
            id: req.body.currentUser!.id
        }
    });

    await log.save();
    new LogCreatedPublisher(natsWrapper.client).publish({
        id: log.id,
        version: log.version,
        title: log.title,
        description: log.description,
        startsAt: log.startsAt,
        expiresAt: log.expiresAt,
        user: {
            id: log.user.id
        }
    });
    
    res.status(201).send(log);
});

export default router;