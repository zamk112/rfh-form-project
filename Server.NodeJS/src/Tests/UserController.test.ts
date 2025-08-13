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
        vi.clearAllMocks()

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
    });
});