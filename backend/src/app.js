import express from 'express';
import cors from 'cors';
import girlRoutes from './routes/girl.routes.js';
import userRoutes from './routes/user.routes.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/girls', girlRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 