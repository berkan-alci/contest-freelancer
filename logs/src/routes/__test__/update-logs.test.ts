import request from 'supertest';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';
import { Logs } from '../../models';
import mongoose from 'mongoose';

it('listens to route /api/logs/:id for put requests', async () => {
    const response = await request(app).put('/api/logs/:id').send({});
  
    expect(response.status).not.toEqual(404);
});

it('Returns a 401 if user not signed in', async () => {
    await request(app).put('/api/logs/:id').send({}).expect(401);
});

it('Returns NOT a 401 if user signed in', async () => {
    const response = await request(app)
        .put('/api/logs')
        .set('Cookie', global.signin())
        .send({});

    expect(response.status).not.toEqual(401);
});

it('returns a 404 if log is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/logs/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'title',
            description: 'desc',
            startsAt: '2021-01-01T12:00:00Z',
            expiresAt: '2021-01-01T12:00:00Z"'
        })
        .expect(404);
});

it('Returns a 400 with invalid input', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    const log = Logs.build({
        title: 'title',
        description: "desc",
        startsAt: '2021-01-01T12:00:00Z',
        expiresAt: '2021-01-01T12:00:00Z',
        user: {
            id: id
        },
    });

    await request(app)
        .put(`/api/logs/${log.id}`)
        .set('Cookie', global.signin(id))
        .send({
            title: '',
            description: 'desc',
            startsAt: '2021-01-01T12:00:00Z',
            expiresAt: '2021-01-01T12:00:00Z"'
        })
        .expect(400);

});

it('Returns a 200 if Log with valid input is updated & publishes event', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    const log = Logs.build({
        title: 'title',
        description: "desc",
        startsAt: '2021-01-01T12:00:00Z',
        expiresAt: '2021-01-01T12:00:00Z',
        user: {
            id: id
        },
    });
    await log.save();

    await request(app)
        .put(`/api/logs/${log.id}`)
        .set('Cookie', global.signin(id))
        .send({
            title: 'titlee',
            description: 'desc',
            startsAt: '2021-01-01T12:00:00Z',
            expiresAt: '2021-01-01T12:00:00Z'
        })
        .expect(200);
    
    

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

