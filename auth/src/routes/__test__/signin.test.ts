import request from 'supertest';
import { app } from '../../app';

it('returns a 200 on sucessful signin', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(200);
});

it('Responds with cookie when given valid credentials', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    
    const res = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(200);
    
    expect(res.get('Set-Cookie')).toBeDefined();
});


it('returns a 400 on unregistered email', async () => {
    return request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400);
});

it('returns a 400 with an invalid email', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test1@test.com',
            password: 'password'
        })
        .expect(400);
});

it('returns a 400 with an invalid password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'prd'
        })
        .expect(400);
});

it('returns a 400 with missing email and/or password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);
    
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
        })
        .expect(400);
    
    await request(app)
        .post('/api/users/signin')
        .send({
            password: 'test@test.com',
        })
        .expect(400);
});