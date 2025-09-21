import multer from "multer";
import path from "path";
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define upload directory path
const uploadDir = join(dirname(__dirname), 'uploads');

// Ensure the uploads directory exists
try {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log('Uploads directory created at:', uploadDir);
    }
} catch (error) {
    console.error('Error creating uploads directory:', error);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Double-check directory exists before saving
        if (!fs.existsSync(uploadDir)) {
            return cb(new Error('Uploads directory does not exist'));
        }
        cb(null, uploadDir); // Use consistent directory path
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        // Only allow image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

export default upload;