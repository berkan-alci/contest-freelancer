import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { User } from '../../models';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 201 on sucessful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
});

it('returns a 400 with an invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test',
            password: 'password'
        })
        .expect(400);
});

it('returns a 400 with an invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'prd'
        })
        .expect(400);
});

it('returns a 400 with missing email and/or password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({})
        .expect(400);
    
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
        })
        .expect(400);
    
    await request(app)
        .post('/api/users/signup')
        .send({
            password: 'test@test.com',
        })
        .expect(400);
});

it('no duplicate emails', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400);
});

it('sets cookie after sucessful signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    
    expect(response.get('Set-Cookie')).toBeDefined();
   
});

it('publishes an event user:created after a succesful signup.', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'root'
        })
        .expect(201);
    
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});