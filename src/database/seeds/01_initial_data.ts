// // dalam file src/database/seeds/01_initial_data.ts

// import type { Knex } from 'knex';
// import bcrypt from 'bcrypt';
// import { v4 as uuidv4 } from 'uuid';

// export async function seed(knex: Knex): Promise<void> {
//   // Hapus data yang ada untuk menghindari duplikasi
//   await knex('job_applications').del();
//   await knex('users').del();

//   // Buat user baru
//   const userId = uuidv4();
//   const hashedPassword = await bcrypt.hash('password123', 10);

//   await knex('users').insert([
//     {
//       id: userId,
//       name: 'Admin User',
//       email: 'admin@example.com',
//       password_hash: hashedPassword,
//     },
//   ]);

//   // Buat contoh lamaran untuk user tersebut
//   await knex('job_applications').insert([
//     {
//       company_name: 'Google',
//       job_title: 'Software Engineer',
//       user_id: userId,
//     },
//     {
//       company_name: 'Facebook',
//       job_title: 'Frontend Developer',
//       status: 'Interview HR',
//       user_id: userId,
//     },
//   ]);
// }