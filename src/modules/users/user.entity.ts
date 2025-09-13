export interface User {
  id: string; // UUID
  name: string;
  email: string;
  password_hash: string;
  last_login_at?: Date | null;
  created_at: Date;
}