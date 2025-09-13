import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { 
    createApplication, 
    getMyApplications, 
    getApplicationById,
    updateApplication,
    deleteApplication
} from './tracker.controller';

const router = Router();

router.use(authMiddleware); // Melindungi semua rute di bawah ini

router.route('/')
    .post(createApplication)   // POST /api/tracker -> Buat baru
    .get(getMyApplications);    // GET /api/tracker -> Lihat semua

router.route('/:id')
    .get(getApplicationById)    // GET /api/tracker/:id -> Lihat detail
    .put(updateApplication)     // PUT /api/tracker/:id -> Update
    .delete(deleteApplication); // DELETE /api/tracker/:id -> Hapus

export default router;