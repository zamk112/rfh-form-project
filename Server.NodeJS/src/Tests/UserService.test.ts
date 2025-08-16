import { describe, it, expect, beforeEach } from 'vitest';
import UserService from '../Services/UserServices';
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
            const userData = {
                UserName: 'newuser',
                Email: 'newuser@example.com',
                CreatedAt: new Date(),
                UpdatedAt: new Date()                
            }

            const initialUserCount = UserService.users.length;

            await userService.createUser(userData);

            expect(UserService.users).toHaveLength(initialUserCount + 1);
            const newUser = UserService.users[UserService.users.length - 1];
            expect(newUser.UserName).toBe('newuser');
            expect(newUser.Email).toBe('newuser@example.com');
            expect(newUser.Id).toBe(3);
            expect(newUser.CreatedAt).toBeInstanceOf(Date);
            expect(newUser.UpdatedAt).toBeInstanceOf(Date);          
        });

        it('Should assign incremental IDs', async () => {
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
        
        it('Should set current timestamps', async () => {
            const userData = {
                UserName: 'timetest',
                Email: 'timetest@example.com',
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            };

            const beforeCreate = Date.now();

            await userService.createUser(userData);

            const newUser = UserService.users[UserService.users.length - 1];
            
            expect(newUser.CreatedAt.getTime()).toBeGreaterThanOrEqual(beforeCreate);
            expect(newUser.UpdatedAt.getTime()).toBeGreaterThanOrEqual(beforeCreate);
        });
    });

    describe('updateUser', () => {
        it('Should update existing user successfully', async () => {
            const updateData = {
                UserName: 'updated_zamk',
                Email: 'updated_zamk@gmail.com'
            };

            await userService.updateUser(1, updateData);

            const updatedUser = UserService.users.find(u => u.Id === 1);
            expect(updatedUser?.UserName).toBe('updated_zamk');
            expect(updatedUser?.Email).toBe('updated_zamk@gmail.com');
            expect(updatedUser?.Id).toBe(1);
        });

        it('Should update only provided fields', async () => {
            const originalUser = UserService.users.find(u => u.Id === 1);
            const originalUpdatedAt = originalUser?.UpdatedAt.getTime();
            const updateData = { UserName: 'timestamp_test' };

            await new Promise(resolve => setTimeout(resolve, 10));
            await userService.updateUser(1, updateData);

            const updatedUser = UserService.users.find(u => u.Id === 1);
            expect(updatedUser?.UpdatedAt).toBeInstanceOf(Date);
            expect(updatedUser?.UpdatedAt.getTime()).toBeGreaterThan(originalUpdatedAt!);
        });

        it('Should preverse Created when updating', async () => {
            const updateData = { UserName: 'nonexistent' };

            await expect(userService.updateUser(999, updateData))
                .rejects
                .toThrow('User not found');
        });
    });

    describe('deleteUser', () => {
        it('Should delete existing user successfully', async () => {
            const initalCount = UserService.users.length;

            await userService.deleteUser(1);

            expect(UserService.users).toHaveLength(initalCount - 1);
            expect(UserService.users.find(u => u.Id === 1)).toBeUndefined();
        });

        it('Should not affect other users when deleting', async () => {
            const otherUser = UserService.users.find(u => u.Id === 2);
            const initalCount = UserService.users.length;

            await userService.deleteUser(1);

            expect(UserService.users).toHaveLength(initalCount - 1);
            expect(UserService.users.find(u => u.Id === 2)).toEqual(otherUser);
        });

        it('Should throw error when user not found', async () => {
            await expect(userService.deleteUser(999))
                    .rejects
                    .toThrow('User not found');
        });

        it('Should handle deleting the last user', async () => {
            UserService.users = [new User(1, 'onlyuser', 'only@example.com', new Date(), new Date())];

            await userService.deleteUser(1);

            expect(UserService.users).toHaveLength(0);
        });
    });
});