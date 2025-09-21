import { v2 as cloudinary } from 'cloudinary';

const connectCloudinary = async() => {
    try {
        // Check if Cloudinary environment variables are set
        if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            console.error("Cloudinary environment variables are missing!");
            console.error("Required variables: CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET");
            console.error("Current values:", {
                CLOUDINARY_NAME: process.env.CLOUDINARY_NAME || 'not set',
                CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? '(set but hidden)' : 'not set',
                CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? '(set but hidden)' : 'not set',
            });
            throw new Error("Missing Cloudinary configuration");
        }
        
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        
        // Test the connection by getting account info
        const result = await cloudinary.api.ping();
        console.log("Cloudinary connected successfully:", result.status);   
    } catch (error) {
        console.error("Cloudinary connection error:", error);
        console.warn("Continuing without exiting, but image uploads may not work correctly");
    }
}

export default connectCloudinary;