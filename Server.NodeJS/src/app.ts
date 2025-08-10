import express, { Request, Response, Express } from 'express';
import cors from 'cors';
import { UserService } from './Services/UserServices';
import UserController from './Controllers/UserController';
import UserRoutes from './Routes/UserRoutes';

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const configureServices = () => {
    const userService = new UserService();
    const userController = new UserController(userService);
    const userRoutes = new UserRoutes(userController);
    
    return { userRoutes };
};

const services = configureServices();

app.use('/api', services.userRoutes.router);

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Hello, from TypeScript Express!' });
});

app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString()
    });
});

app.use((err: Error, req: Request, res: Response, next: any) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: `Internal Server error`
    });
});

app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.path} not found`
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
    console.log(`👥 Users API: http://localhost:${PORT}/api/users`);
});