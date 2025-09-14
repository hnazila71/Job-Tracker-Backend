export interface User {
  id: string; // UUID
  name: string;
  email: string;
  password_hash?: string | null; // <-- Menjadi opsional
  google_id?: string | null;     // <-- Kolom baru
  last_login_at?: Date | null;
  created_at: Date;
}

