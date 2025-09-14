import pool from '../../config/postgres_connection';
import { JobApplication } from './tracker.entity';

export class TrackerRepository {
  // CREATE
  async create(appData: Omit<JobApplication, 'id'>): Promise<JobApplication> {
    const { company_name, job_title, status, platform, notes, user_id, application_date } = appData;
    const result = await pool.query(
      `INSERT INTO job_applications (company_name, job_title, status, platform, notes, user_id, application_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [company_name, job_title, status, platform, notes, user_id, application_date]
    );
    return result.rows[0];
  }

  // READ (All for a user)
  async findAllByUserId(userId: string): Promise<JobApplication[]> {
    const result = await pool.query(
      'SELECT * FROM job_applications WHERE user_id = $1 ORDER BY application_date DESC',
      [userId]
    );
    return result.rows;
  }

  // READ (Single by ID for a user)
  async findByIdAndUserId(id: string, userId: string): Promise<JobApplication | null> {
    const result = await pool.query(
      'SELECT * FROM job_applications WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rows[0] || null;
  }

  // UPDATE
  async update(id: string, userId: string, appData: Partial<Omit<JobApplication, 'id' | 'user_id'>>): Promise<JobApplication | null> {
    const { company_name, job_title, status, platform, notes, application_date } = appData;
    const result = await pool.query(
      `UPDATE job_applications 
       SET company_name = $1, job_title = $2, status = $3, platform = $4, notes = $5, application_date = $6, updated_at = NOW()
       WHERE id = $7 AND user_id = $8 RETURNING *`,
      [company_name, job_title, status, platform, notes, application_date, id, userId]
    );
    return result.rows[0] || null;
  }
  
  // DELETE
  async remove(id: string, userId: string): Promise<boolean> {
    const result = await pool.query(
        'DELETE FROM job_applications WHERE id = $1 AND user_id = $2',
        [id, userId]
    );
    // INI BAGIAN YANG DIPERBAIKI
    return (result.rowCount ?? 0) > 0;
  }
}