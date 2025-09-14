// src/database/migrations/TIMESTAMP_create_initial_tables.ts

import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Membuat tabel 'users'
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 255).notNullable();
    table.string('email', 255).notNullable().unique();
    // Made password_hash nullable to allow for Google-only signups
    table.string('password_hash', 255).nullable(); 
    table.timestamp('last_login_at', { useTz: true });
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
  });

  // Membuat tipe ENUM untuk status
  await knex.raw(`
    CREATE TYPE application_status AS ENUM (
      'Applied', 'Screening', 'Interview HR', 'Interview User', 
      'Technical Test', 'Offer', 'Rejected'
    );
  `);

  // Membuat tabel 'job_applications'
  await knex.schema.createTable('job_applications', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('company_name', 255).notNullable();
    table.string('job_title', 255).notNullable();
    table.date('application_date').notNullable().defaultTo(knex.fn.now());
    table.specificType('status', 'application_status').notNullable().defaultTo('Applied');
    table.string('platform', 100);
    table.text('notes');
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now());

    // Foreign Key
    table.uuid('user_id')
         .notNullable()
         .references('id')
         .inTable('users')
         .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  // Menghapus tabel dalam urutan terbalik
  await knex.schema.dropTableIfExists('job_applications');
  await knex.schema.dropTableIfExists('users');
  await knex.raw('DROP TYPE IF EXISTS application_status;');
}