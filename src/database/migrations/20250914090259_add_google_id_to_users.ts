// src/database/migrations/20250914090259_add_google_id_to_users.ts

import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    // Menambahkan kolom google_id yang bisa null dan harus unik
    table.string('google_id').nullable().unique();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    // Menghapus kolom google_id jika migrasi di-rollback
    table.dropColumn('google_id');
  });
}