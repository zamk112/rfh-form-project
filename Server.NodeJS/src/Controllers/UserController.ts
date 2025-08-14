import { Request, Response } from 'express';
import IUserServices from "../Interfaces/IUserServices";
import User from "../Models/User";
import { APIResponse } from "../Types/TAPIResponse";

class UserController {
    constructor(private userService: IUserServices){}

    public async getAllUsers(req: Request, res: Response): Promise<void>
    {
        try 
        {
            const users = await this.userService.getAllUsers();
            const response: APIResponse<User[]> = {
                success: true,
                data: users
            };

            res.status(200).json(response);
        } 
        catch (error: any) 
        {
            console.error('Error in getAllUsers:',error);
            const response: APIResponse<null> = {
                success: false,
                message: 'Internal Server Error'
            };

            res.status(500).json(response);
        }
    }

    public async getUserById(req: Request, res: Response): Promise<void>
    {
        try 
        {
            const id = parseInt(req.params.id);
            
            if(isNaN(id))
            {
                const response: APIResponse<null> = {
                    success: false,
                    message: 'Invalid user ID format'
                };
                res.status(400).json(response);
                return;
            }

            const user = await this.userService.getUserById(id);

            if (!user)
            {
                const response: APIResponse<null> = {
                    success: false,
                    message: 'User not found'
                };

                res.status(404).json(response);
                return;
            }

            const response: APIResponse<User> = {
                success: true,
                data: user
            };

            res.status(200).json(response);
        } 
        catch (error) {
            console.error('Error in getUserById:', error);
            const response: APIResponse<null> = {
                success: false,
                message: 'Internal Server Error'
            }
            res.status(500).json(response);
        }
    }
    
    public async createUser(req: Request, res: Response): Promise<void> {
        try {
            const userData = req.body;

            if (!userData.UserName || !userData.Email) {
                const response: APIResponse<null> = {
                    success: false,
                    message: 'UserName and Email are required'
                };

                res.status(400).json(response);
                return;
            }

            await this.userService.createUser(userData);
            const response: APIResponse<null> = {
                success: true,
                message: 'User created successfully'
            };

            res.status(201).json(response);
        }
        catch (error: any)
        {
            console.error('Error in createUser:', error);

            const response: APIResponse<null> = {
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error'
            };

            const statusCode = error instanceof Error && 
                (error.message.includes('already exists') || 
                error.message.includes('required') ||
                error.message.includes('Invalid')) ? 400 : 500;
            
            res.status(statusCode).json(response);            
        }
    }

    public async updateUser(req: Request, res: Response): Promise<void> {
        try
        {
            const id = parseInt(req.params.id);

            if (isNaN(id)) 
            {
                const response: APIResponse<null> = {
                    success: false,
                    message: 'Invalid user ID format'
                };

                res.status(400).json(response);
                return;
            }

            const updateData: User = req.body;
            await this.userService.updateUser(id, updateData);

            const response: APIResponse<null> = {
                success: true,
                message: 'User updated successfully'
            };

            res.status(200).json(response);

        }
        catch(error: any)
        {
            console.error('Error in updateUser:', error);
            
            const response: APIResponse<null> = {
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error'
            };

            const statusCode = error instanceof Error &&
                (error.message.includes('already exits') || error.message.includes('Invalid')) ? 400 : 500;
            
                res.status(statusCode).json(response);
        }
    }

    public async deleteUser(req: Request, res: Response): Promise<void> {
        try 
        {
            const id = parseInt(req.params.id);

            if (isNaN(id))
            {
                const response: APIResponse<null> = {
                    success: false,
                    message: 'Invalid user ID'
                };

                res.status(400).json(response);
                return;
            }

            await this.userService.deleteUser(id);

            const response: APIResponse<null> = {
                success: true,
                message: 'User deleted successfully'
            };

            res.status(200).json(response);
        }
        catch(error: any)
        {
            console.error('Error in deleteUser:', error);

            const response: APIResponse<null> = {
                success: false,
                message: error instanceof Error ? error.message : 'Internal Server Error'
            };
            
            const statusCode = error instanceof Error && error.message.includes('User not found') ? 404 : 500;
            res.status(statusCode).json(response);
        }
    }
}

export default UserController;