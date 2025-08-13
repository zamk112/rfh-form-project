import { Router } from 'express';
import UserController from '../Controllers/UserController';


class UserRoutes {
    public router: Router;
    private userController: UserController;

    constructor(userController: UserController) 
    {
        this.router = Router();
        this.userController = userController;
        // this.initializeMiddleWare();
        this.initializeRoutes();
    }

    // private initializeMiddleWare(): void {
    //     this.router.use((req, res, next) => {
    //         console.log(`User API: ${req.method} ${req.originalUrl}`);
    //         next();
    //     });      
    // }

    private initializeRoutes(): void {
        this.router.get('/users', this.userController.getAllUsers.bind(this.userController));
        this.router.get('/users/:id', this.userController.getUserById.bind(this.userController));
        this.router.post('/users', this.userController.createUser.bind(this.userController));
        this.router.put('/users/:id', this.userController.updateUser.bind(this.userController));
        this.router.delete('/users/:id', this.userController.deleteUser.bind(this.userController));
    }
    
}

export default UserRoutes;