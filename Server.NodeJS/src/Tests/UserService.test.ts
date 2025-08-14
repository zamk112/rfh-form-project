import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from '../Services/UserServices';
import User from '../Models/User';

describe('UserService', () => {
    let userService: UserService;

    beforeEach(() => {
        UserService.userIds = 1;
        UserService.users = [
            new User(1, 'zamk112', 'zamk112@gmail.com', new Date(), new Date()),
            new User(2, 'zav454', 'zav454@someemail.com', new Date(), new Date())
        ];

        UserService.userIds = 3;

        userService = new UserService();
    });

    describe('getAllUsers', () => {
        it('Should return all users', async () => {
            const result = await userService.getAllUsers();

            expect(result).toHaveLength(2);
            expect(result[0].UserName).toBe('zamk112');
            expect(result[1].UserName).toBe('zav454');          
        });

        it('Should return empty array when no users exit', async () => {
            UserService.users = [];

            const result = await userService.getAllUsers();

            expect(result).toHaveLength(0);
            expect(result).toEqual([]);
        });

        it('Should return a copy of users array', async () => {
            const result = await userService.getAllUsers();

            expect(result).not.toBe(UserService.users);
            expect(result).toEqual(UserService.users);
        });
    });

    describe('getUserById', () => {
        it('Should return user when found', async () => {
            const result = await userService.getUserById(1);

            expect(result).toBeDefined();
            expect(result?.Id).toBe(1);
            expect(result?.UserName).toBe('zamk112');
            expect(result?.Email).toBe('zamk112@gmail.com');
        });

        it('Should return undefined when user not found', async () => {
            const result = await userService.getUserById(999);

            expect(result).toBeUndefined();
        });

        it.each([
            [-1, 'negative ID'],
            [0, 'zero ID'],
            [1.5, 'decimal ID'],
            [NaN, 'NaN ID']
        ])('Should return undfined for %s (%s)', async (id) => {
            const result = await userService.getUserById(id);

            expect(result).toBeUndefined();
        });
    });

    describe('createUser', () => {
        it('Should create user successfully', async () => {
            const userData1 = {
                UserName: 'user1',
                Email: 'user1@example.com',
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            };

            const userData2 = {
                UserName: 'user2',
                Email: 'user2@example.com',
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            };

            await userService.createUser(userData1);
            await userService.createUser(userData2);
            
            const users = UserService.users;
            expect(users[users.length - 2].Id).toBe(3);
            expect(users[users.length - 1].Id).toBe(4);          
        });
    });
});