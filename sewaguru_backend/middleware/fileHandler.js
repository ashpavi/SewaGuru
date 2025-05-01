import multer from 'multer';

// Memory storage — stores files in memory as Buffer
const storage = multer.memoryStorage();

export const upload = multer({ storage });
