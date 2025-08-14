import IUserServices from "../Interfaces/IUserServices";
import User from "../Models/User";
import { setTimeout } from "timers/promises";

export class UserService implements IUserServices {
    static readonly TIMEOUT: number = 2000;
    static userIds: number = 1;
    static users: User[] = [
        new User(this.userIds++, 'zamk112', 'zamk112@gmail.com', new Date(), new Date()),
        new User(this.userIds++, 'zav454', 'zav454@someemail.com', new Date(), new Date())
    ];

    public async getAllUsers(): Promise<User[]> {
        await setTimeout(UserService.TIMEOUT);
        return [...UserService.users];
    }

    public async getUserById(id: number): Promise<User | undefined> {
        await setTimeout(UserService.TIMEOUT);
        return UserService.users.find(user => user.Id == id);
    }

    public async createUser(userData: Omit<User, "Id">): Promise<void> {
       await setTimeout(UserService.TIMEOUT);
        const newUser = new User(UserService.userIds++, userData.UserName, userData.Email, new Date(), new Date());
        UserService.users.push(newUser);
    }

    public async updateUser(id: number, userData: Partial<Omit<User, "Id" | "toJSON">>): Promise<void> {
        const index = UserService.users.findIndex(user => user.Id == id);

        try {
            if (index === -1)
                throw new Error("User not found");
            else
            {
                UserService.users[index] = { ...UserService.users[index], ...userData };
            }

            await setTimeout(UserService.TIMEOUT);
                
        } catch (error: any) {
            throw error;
        }
    }

    public async deleteUser(id: number): Promise<void> {
        const index = UserService.users.findIndex(user => user.Id == id);

        try 
        {
            if (index === -1)
                throw new Error("User not found");
            else
            {
                UserService.users.splice(index, 1);
            }

            await setTimeout(UserService.TIMEOUT);
        } catch (error: any) {
            throw error;
        }
    }
}