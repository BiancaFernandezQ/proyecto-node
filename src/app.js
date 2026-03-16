import express from "express";
import morgan from "morgan";
import usersRoutes from './routes/users.route.js';
import authRoutes from './routes/auth.route.js';
import tasksRoutes from './routes/tasks.route.js';
import { authenticateToken } from './middlewares/authenticate.middleware.js';

const app = express(); // Crear una instancia de Express

//Middlewares
app.use(morgan("combined")); //usamos morgan en combined para que los loggers se vean mejor
//es un middleware que se ejecuta antes de las rutas, para loguear las peticiones
app.use(express.json());

//Routes
app.use('/api/users/', usersRoutes);
app.use('/api/tasks/', authenticateToken, tasksRoutes);
app.use('/api/login', authRoutes);

app.get('/', (req, res) => {
    res.send('bienvenido a proyecto backend node');
});

export default app;