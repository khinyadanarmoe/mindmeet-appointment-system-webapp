import express from 'express';
import { registerUser, loginUser , getUserInfo, updateUserProfile, bookAppointment, getUserAppointments, syncSlotsBooked, cancelAppointment} from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

// Route for user registration
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/get-user-info', authUser, getUserInfo);
userRouter.put('/update-profile', authUser, upload.single('image'), updateUserProfile);
userRouter.post('/book-appointment', authUser, bookAppointment);
userRouter.get('/my-appointments', authUser, getUserAppointments);
userRouter.post('/sync-slots-booked', syncSlotsBooked);

// route for cancel appointment
userRouter.delete('/cancel-appointment', authUser, cancelAppointment);

export default userRouter;