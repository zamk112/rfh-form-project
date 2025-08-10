import User from "../Models/User";

interface IUserServices {
    getAllUsers(): Promise<User[]>;
    getUserById(id: number): Promise<User | undefined>;
    createUser(userData: Omit<User, 'Id'>): Promise<void>;
    updateUser(id: number, userData: Omit<User, 'Id'>): Promise<void>;
    deleteUser(id: number): Promise<void>;
}

export default IUserServices;