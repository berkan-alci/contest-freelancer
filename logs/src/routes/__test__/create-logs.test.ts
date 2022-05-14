import request from 'supertest';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';
import { Logs } from '../../models';
import mongoose from 'mongoose';

it('listens to route /api/logs for post requests', async () => {
    const response = await request(app).post('/api/logs').send({});
  
    expect(response.status).not.toEqual(404);
});

it('Returns a 401 if user not signed in', async () => {
    await request(app).post('/api/logs').send({}).expect(401);
});

it('Returns NOT a 401 if user signed in', async () => {
    const response = await request(app)
        .post('/api/logs')
        .set('Cookie', global.signin())
        .send({});

    expect(response.status).not.toEqual(401);
});

it('Returns a 400 with invalid input', async () => {
    await request(app)
        .post('/api/logs')
        .set('Cookie', global.signin())
        .send({
            title: '',
            description: 'desc',
            startsAt: '2021-01-01T12:00:00Z',
            expiresAt: '2021-01-01T12:00:00Z"'
        })
        .expect(400);

    await request(app)
        .post('/api/logs')
        .set('Cookie', global.signin())
        .send({
            title: 'title',
            description: 3,
            startsAt: '2021-01-01T12:00:00Z',
            expiresAt: '2021-01-01T12:00:00Z"'
        })
        .expect(400);

});

it('Returns a 201 if Log with valid input is created & publishes event', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    
    await request(app)
        .post('/api/logs')
        .set('Cookie', global.signin(id))
        .send({
            title: 'title',
            description: "desc",
            startsAt: '2021-01-01T12:00:00Z',
            expiresAt: '2021-01-01T12:00:00Z',
        })
        .expect(201)
    
    
    const log = Logs.build({
        title: 'title',
        description: "desc",
        startsAt: '2021-01-01T12:00:00Z',
        expiresAt: '2021-01-01T12:00:00Z',
        user: {
            id: id
        },
    });
    
    await log.save()
   
    expect(natsWrapper.client.publish).toHaveBeenCalled();
    
});
