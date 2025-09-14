import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // 1. Membuat tipe ENUM (hanya jika belum ada)
  await knex.raw(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
        CREATE TYPE application_status AS ENUM (
          'Applied', 'Screening', 'Interview HR', 'Interview User', 
          'Technical Test', 'Offer', 'Rejected'
        );
      END IF;
    END$$;
  `);

  // 2. Membuat tabel 'users' (hanya jika belum ada)
  const usersExists = await knex.schema.hasTable('users');
  if (!usersExists) {
    await knex.schema.createTable('users', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('name', 255).notNullable();
      table.string('email', 255).notNullable().unique();
      table.string('password_hash', 255).nullable();
      table.string('google_id').nullable().unique(); // Kolom google_id sudah ada di sini
      table.timestamp('last_login_at', { useTz: true });
      table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    });
  }

  // 3. Membuat tabel 'job_applications' (hanya jika belum ada)
  const jobApplicationsExists = await knex.schema.hasTable('job_applications');
  if (!jobApplicationsExists) {
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
      table.uuid('user_id')
           .notNullable()
           .references('id')
           .inTable('users')
           .onDelete('CASCADE');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('job_applications');
  await knex.schema.dropTableIfExists('users');
  await knex.raw('DROP TYPE IF EXISTS application_status;');
}