import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { AuthorizationError, NotFoundError, validateRequest, requireAuth } from '@cgestione/fl-common';
import { Logs } from '../models';
import { natsWrapper } from '../nats-wrapper';
import { LogUpdatedPublisher } from '../events';

const router = express.Router();

router.put('/api/logs/:logId', requireAuth, [
    body('title')
        .not()
        .isEmpty()
        .isString()
        .withMessage('Title is required'),
    body('description')
        .not()
        .isEmpty()
        .isString()
        .withMessage('Description is required'),
    body('startsAt')
        .not()
        .isEmpty()
        .isString()
        .withMessage('Start date is required'),
    body('expiresAt')
        .not()
        .isEmpty()
        .isString()
        .withMessage('End date is required'),
], validateRequest, async (req: Request, res: Response) => {
    const log = await Logs.findById(req.params.logId);

    if (!log || log === null) {
        throw new NotFoundError();
    }

    if (log.user.id !== req.currentUser!.id) {
        throw new AuthorizationError();
    }


    log.set({
        title: req.body.title,
        description: req.body.description,
        startsAt: req.body.startsAt,
        expiresAt: req.body.expiresAt
    });

    await log.save();
    new LogUpdatedPublisher(natsWrapper.client).publish({
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

    res.send(log);
});

export default router;