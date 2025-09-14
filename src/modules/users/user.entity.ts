// src/modules/users/user.entity.ts

export interface User {
  id: string; // UUID
  name: string;
  email: string;
  password_hash?: string | null;
  google_id?: string | null;
  last_login_at?: Date | null;
  created_at?: Date; // This property is now optional
}