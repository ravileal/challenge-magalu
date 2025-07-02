import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('favorite_products', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.uuid('client_id').notNullable().references('id').inTable('clients').onDelete('CASCADE');
    table.string('product_id').notNullable();
    table.timestamps(true, true);

    table.unique(['client_id', 'product_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('favorite_products');
}
