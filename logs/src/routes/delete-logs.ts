import express, { Request, Response } from 'express';
import { requireAuth, NotFoundError, AuthorizationError } from '@cgestione/fl-common';
import { Logs } from '../models';
import { LogDeletedPublisher } from '../events';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete('/api/logs/:logId', requireAuth, async (req: Request, res: Response) => {
    const { logId } = req.params;
    const log = await Logs.findById(logId)
    

    if (!log || log === null) {
        throw new NotFoundError();
    }

    if (log.user.id !== req.currentUser!.id) {
        throw new AuthorizationError();
    }

    
    //we publish before deleting, since we can't get log details after deletion.
    new LogDeletedPublisher(natsWrapper.client).publish({
        id: log.id,
        version: log.version,
        user: {
            id: log.user.id
        },
    });

    await log.delete();

    res.status(204).send({message: "Your log has been successfully deleted!"});
});

export default router;