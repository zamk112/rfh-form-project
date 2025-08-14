import { describe, it, expect, beforeEach, vi, type MockedFunction } from 'vitest';
import type { Request, Response } from 'express';
import UserController from '../Controllers/UserController';
import type IUserServices from '../Interfaces/IUserServices';
import User from '../Models/User';


const mockUserService: IUserServices = {
    getAllUsers: vi.fn(),
    getUserById: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn()
};

describe('UserController', () => {
    let userController: UserController;
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;

    beforeEach(() => {
        vi.clearAllMocks();

        userController = new UserController(mockUserService);
        mockReq = (global as any).testHelpers.createMockRequest();
        mockRes = (global as any).testHelpers.createMockResponse();
    });

    describe('getAllUsers', () => {
        it('Should return all users successfully', async () => {
            const mockUsers: User[] = [
                new User(1, 'john_doe', 'john@example.com', new Date(), new Date()),
                new User(2, 'jane_smith', 'jane@exmaple.com', new Date(), new Date())
            ];

            (mockUserService.getAllUsers as MockedFunction<any>).mockResolvedValue(mockUsers);

            await userController.getAllUsers(mockReq as Request, mockRes as Response);

            expect(mockUserService.getAllUsers).toHaveBeenCalledOnce();
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                data: mockUsers
            });          
        });

        it('Should handle service errors gracefully', async () => {
            const errorMessage = 'Database connection failed';
            (mockUserService.getAllUsers as MockedFunction<any>).mockRejectedValue(new Error(errorMessage));

            await userController.getAllUsers(mockReq as Request, mockRes as Response);

            expect(mockUserService.getAllUsers).toHaveBeenCalledOnce();
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Internal Server Error'
            });            
        });
        
        it('Should handle unexpected errors', async () => {
            (mockUserService.getAllUsers as MockedFunction<any>).mockRejectedValue('Unexpected error');

            await userController.getAllUsers(mockReq as Request, mockRes as Response);
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Internal Server Error'
            });
        });
    });
    
    describe('getUserById', () => {
        it('Should return user when found', async () => {
            const userId = 1;
            const mockUser = new User(userId, 'john_doe', 'john@example.com', new Date(), new Date());
            mockReq.params = { id: userId.toString() };

            (mockUserService.getUserById as MockedFunction<any>).mockResolvedValue(mockUser);
            await userController.getUserById(mockReq as Request, mockRes as Response);

            expect(mockUserService.getUserById).toHaveBeenCalledWith(userId);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                data: mockUser
            });          
        });
        
        it('Should return 400 for invalid user ID', async () => {
            mockReq.params = { id: 'invalid-id' };

            await userController.getUserById(mockReq as Request, mockRes as Response);

            expect(mockUserService.getUserById).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Invalid user ID format'
            });
        });

        it('Should return 404 when user not found', async () => {
            const userId = 999;
            mockReq.params = { id: userId.toString() };

            (mockUserService.getUserById as MockedFunction<any>).mockResolvedValue(undefined);

            await userController.getUserById(mockReq as Request, mockRes as Response);

            expect(mockUserService.getUserById).toHaveBeenCalledWith(userId);
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'User not found'
            });     
        });   
    });

    describe('createUser', () => {
        it('Should create user successfully', async () => {
            const userData = {
                UserName: 'new_user',
                Email: 'newuser@example.com'
            };

            mockReq.body = userData;
            
            (mockUserService.createUser as MockedFunction<any>).mockResolvedValue(undefined);

            await userController.createUser(mockReq as Request, mockRes as Response);

            expect(mockUserService.createUser).toHaveBeenCalledWith(userData);
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                message: 'User created successfully'
            });            
        });

        it('Should return 400 when UserName is missing', async () => {
            mockReq.body = { Email: 'test@example.com' };

            await userController.createUser(mockReq as Request, mockRes as Response);

            expect(mockUserService.createUser).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'UserName and Email are required'
            });          
        });

        it('Should handle validation errors', async () => {
            mockReq.body = { UserName: 'testuser', Email: 'invalid-email' };

            (mockUserService.createUser as MockedFunction<any>).mockRejectedValue(new Error('Invalid email format'));

            await userController.createUser(mockReq as Request, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Invalid email format'
            });
        });
    });

    describe('updateUser', () => {
        it('Should update user successfully', async () => {
            const userId = 1;
            const updateData = { UserName: 'updated_user' };
            
            mockReq.params = { id: userId.toString() };
            mockReq.body = updateData;

            (mockUserService.updateUser as MockedFunction<any>).mockResolvedValue(undefined);

            await userController.updateUser(mockReq as Request, mockRes as Response);

            expect(mockUserService.updateUser).toHaveBeenCalledWith(userId, updateData);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                message: 'User updated successfully'
            });
        });

        it('Should return 400 for invalid user ID', async () => {
            mockReq.params = { id: 'invalid '};
            mockReq.body = { UserName: 'updated_user' };

            await userController.updateUser(mockReq as Request, mockRes as Response);

            expect(mockUserService.updateUser).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'Invalid user ID format'
            });
        });
    });

    describe('deleteUser', () => {
        it('Should delete user successfully', async () => {
            const userId = 1;
            mockReq.params = { id: userId.toString() };

            (mockUserService.deleteUser as MockedFunction<any>).mockResolvedValue(undefined);

            await userController.deleteUser(mockReq as Request, mockRes as Response);

            expect(mockUserService.deleteUser).toHaveBeenCalledWith(userId);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                message: 'User deleted successfully'
            });
        });

        it('Should handle user not found error', async () => {
            const userId = 999;
            mockReq.params = { id: userId.toString() };

            (mockUserService.deleteUser as MockedFunction<any>).mockRejectedValue(new Error('User not found'));

            await userController.deleteUser(mockReq as Request, mockRes as Response);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: 'User not found'
            });
        });
    });

});