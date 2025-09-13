import express from 'express';
import { registerUser, loginUser , getUserInfo} from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';

const userRouter = express.Router();

// Route for user registration
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/get-user-info', authUser ,getUserInfo);

export default userRouter;