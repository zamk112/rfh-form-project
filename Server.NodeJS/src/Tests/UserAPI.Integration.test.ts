import { describe, it, expect, beforeEach } from "vitest";
import request from 'supertest';
import express from 'express';
import UserService from '../Services/UserServices';
import UserController from "../Controllers/UserController";
import UserRoutes from "../Routes/UserRoutes";
import User from "../Models/User";

const createTestApp = () => {
    const app = express();
    app.use(express.json());

    const userService = new UserService();
    const userController = new UserController(userService);
    const userRoutes = new UserRoutes(userController);

    app.use('/api', userRoutes.router);

    return app;
};

describe('User API Integration Tests', () => {
    let app: express.Application;

    beforeEach(() => {
        UserService.userIds = 1;
        UserService.users = [
            new User(1, 'testuser1', 'test1@example.com', new Date(), new Date()),
            new User(2, 'testuser2', 'test2@example.com', new Date(), new Date())            
        ];
        UserService.userIds = 3;

        app = createTestApp();
    });

    describe('GET /api/users', () => {
        it('Should return all users with 200 status', async () => {
            const response = await request(app)
                .get('/api/users')
                .expect(200);
            
            expect(response.body).toEqual({
                success: true,
                data: expect.arrayContaining([
                    expect.objectContaining({
                        id: 1,
                        username: 'testuser1',
                        email: 'test1@example.com'
                    }),
                    expect.objectContaining({
                        id: 2,
                        username: 'testuser2',
                        email: 'test2@example.com'
                    })
                ])
            });
        });

        it('Should return empty array when no users exist', async () => {
            UserService.users = [];

            const response = await request(app)
                .get('/api/users')
                .expect(200);
            
            expect(response.body).toEqual({
                success: true,
                data: []
            });
        });

        it('Should have proper response structure', async () => {
            const response = await request(app).get('/api/users');

            expect(response.body).toHaveProperty('success');
            expect(response.body).toHaveProperty('data');
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });

    describe('GET /api/users/:id', () => {
        it('Should return specific user when found', async () => {
            const response = await request(app)
                .get('/api/users/1')
                .expect(200);
            
            expect(response.body).toEqual({
                success: true,
                data: expect.objectContaining({
                    id: 1,
                    username: 'testuser1',
                    email: 'test1@example.com'
                })
            });
        });
        
        it('Should return 404 when user not found', async () => {
            const response = await request(app)
                .get('/api/users/999')
                .expect(404);
            
            expect(response.body).toEqual({
                success: false,
                message: 'User not found'
            });
        });

        it('Should return 400 for invalid user ID', async () => {
            const response = await request(app)
                .get('/api/users/invalid')
                .expect(400);
            
            expect(response.body).toEqual({
                success: false,
                message: 'Invalid user ID format'
            });
        });

        it.each([
            ['string', 'abc'],
            ['decimal', '1.5'],
            ['negative', '-1'],
            ['zero', '0']
        ])('Should handle %s ID gracefully', async (_, id) => {
            await request(app)
                .get(`/api/users/${id}`)
                .expect(res => {
                    expect([400, 401]).toContain(res.status),
                    expect(res.body.success).toBe(false)
                });
        });
    });

    describe('POST /api/users', () => {
        it('Should create new user successfully', async () => {
            const newUser = {
                UserName: 'newuser',
                Email: 'newuser@example.com'
            };

            const response = await request(app)
                .post('/api/users')
                .send(newUser)
                .expect(201);
            
            expect(response.body).toEqual({
                success: true,
                message: 'User created successfully'
            });

            const allUsers = await request(app).get('/api/users');
            expect(allUsers.body.data).toHaveLength(3);
            expect(allUsers.body.data[2]).toMatchObject({
                username: 'newuser',
                email: 'newuser@example.com'
            });
        });

        it.each([
            ['UserName missing', { Email: 'incomplete@example.com' }],
            ['Email missing', { UserName: 'incompleteuser' }],
            ['Both fields missing', {}],
            ['null Username', { UserName: null, Email: 'test@example.com' }],
            ['Empty Username', { UserName: '', Email: 'test@example.com' }],
            ['null Email', { UserName: 'test', Email: null }],
            ['Empty Email', { UserName: 'test', Email: '' }]
        ])('Should return 400 when %s', async (_, invalidUser) => {
            const response = await request(app)
                .post('/api/users')
                .send(invalidUser)
                .expect(400);
            
            expect(response.body).toEqual({
                success: false,
                message: 'UserName and Email are required'
            });
        });

        it('Should handle malformed JSON', async () => {
            await request(app)
                .post('/api/users')
                .set('Content-Type', 'application/json')
                .send('{ invalid json }')
                .expect(400)
        });
    });
});