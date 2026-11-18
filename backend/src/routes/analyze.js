import { Router } from 'express';
import multer from 'multer';
import * as controller from '../controllers/analyze.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { analysisSchema } from '../validators/analysis.js';
import { ApiError } from '../utils/ApiError.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype !== 'application/pdf' || !file.originalname.toLowerCase().endsWith('.pdf')) {
      return callback(new ApiError(400, 'Upload a PDF file no larger than 5 MB'));
    }
    callback(null, true);
  },
});

router.post('/text', authenticate, validate(analysisSchema), controller.analyzeText);
router.post('/', authenticate, upload.single('resume'), validate(analysisSchema), controller.analyzePdf);

export default router;
