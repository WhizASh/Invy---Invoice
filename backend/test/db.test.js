import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { query, isConnected } from '../src/config/db.js';
import { runMigration, migrationSQL } from '../src/db/migrate.js';
import { checkDatabaseConnection } from '../src/db/check-db.js';

describe('Database Configuration & Migrations', () => {
  it('provides a query function', () => {
    assert.equal(typeof query, 'function');
  });

  it('exposes connection status indicator', () => {
    assert.equal(typeof isConnected, 'function');
  });

  it('contains valid migration DDL statements', () => {
    assert.ok(migrationSQL.includes('CREATE TABLE IF NOT EXISTS invoices'));
    assert.ok(migrationSQL.includes('CREATE TABLE IF NOT EXISTS invoice_items'));
  });

  it('executes runMigration without throwing', async () => {
    await assert.doesNotReject(runMigration());
  });

  it('checkDatabaseConnection returns error gracefully when host unreachable', async () => {
    const result = await checkDatabaseConnection('postgresql://invalid_user:invalid_pass@127.0.0.1:59999/nonexistent');
    assert.equal(result.connected, false);
    assert.ok(result.error);
    assert.ok(result.url.includes('****')); // Password masked
  });
});


