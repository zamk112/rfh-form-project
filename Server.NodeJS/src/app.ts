import express, { Request, Response, Express } from 'express';
import cors from 'cors';
import { UserService } from './Services/UserServices';
import UserController from './Controllers/UserController';
import UserRoutes from './Routes/UserRoutes';

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: ['http://localhost:3000']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next) => {
    console.log(`API Request: ${req.method} ${req.path}`);
    next();
});

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Hello, from TypeScript Express!' });
});

const services: UserRoutes = new UserRoutes(new UserController(new UserService()));

app.use('/api', services.router);

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
        message: 'Internal Server error'
    });
});

app.use((req: Request, res: Response) => {
    const message = `Route ${req.method} ${req.path} not found`;
    console.warn(message);
    res.status(404).json({
        success: false,
        message: message
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
    console.log(`👥 Users API: http://localhost:${PORT}/api/users`);
});