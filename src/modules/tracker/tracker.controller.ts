import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { TrackerRepository } from './tracker.repository';

const repo = new TrackerRepository();

// CREATE
export const createApplication = async (req: AuthRequest, res: Response) => {
  const user_id = req.user!.id;
  const { company_name, job_title, status, platform, notes } = req.body;
  if (!company_name || !job_title) {
    return res.status(400).json({ message: 'Nama perusahaan dan posisi wajib diisi' });
  }
  try {
    const newApp = await repo.create({ ...req.body, status: status || 'Applied', user_id, application_date: new Date() });
    res.status(201).json(newApp);
  } catch (error) { res.status(500).json({ message: 'Gagal menyimpan aplikasi' }); }
};

// READ (List)
export const getMyApplications = async (req: AuthRequest, res: Response) => {
  try {
    const apps = await repo.findAllByUserId(req.user!.id);
    res.status(200).json(apps);
  } catch (error) { res.status(500).json({ message: 'Gagal mengambil data aplikasi' }); }
};

// READ (Detail)
export const getApplicationById = async (req: AuthRequest, res: Response) => {
    try {
        const app = await repo.findByIdAndUserId(req.params.id, req.user!.id);
        if (!app) {
            return res.status(404).json({ message: 'Aplikasi tidak ditemukan' });
        }
        res.status(200).json(app);
    } catch (error) { res.status(500).json({ message: 'Gagal mengambil detail aplikasi' }); }
};

// UPDATE
export const updateApplication = async (req: AuthRequest, res: Response) => {
    try {
        const existingApp = await repo.findByIdAndUserId(req.params.id, req.user!.id);
        if (!existingApp) {
            return res.status(404).json({ message: 'Aplikasi tidak ditemukan' });
        }
        const updatedData = { ...existingApp, ...req.body };
        const updatedApp = await repo.update(req.params.id, req.user!.id, updatedData);
        res.status(200).json(updatedApp);
    } catch (error) { res.status(500).json({ message: 'Gagal memperbarui aplikasi' }); }
};

// DELETE
export const deleteApplication = async (req: AuthRequest, res: Response) => {
    try {
        const success = await repo.remove(req.params.id, req.user!.id);
        if (!success) {
            return res.status(404).json({ message: 'Aplikasi tidak ditemukan' });
        }
        res.status(204).send(); // No content
    } catch (error) { res.status(500).json({ message: 'Gagal menghapus aplikasi' }); }
};