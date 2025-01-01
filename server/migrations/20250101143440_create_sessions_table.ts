import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sessions', (table) => {
    table.increments('id').primary()
    table.integer('therapist').notNullable()
    table.foreign('therapist').references('users.id')
    table.integer('client').nullable()
    table.foreign('client').references('users.id')
    table.string('date').notNullable()
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTable('sessions')
}
