/**
 * Test the real admin state mutations with a Supabase-shaped in-memory adapter.
 * No live DB, customer records, payment calls, or order submissions.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const requireTs = createRequire(import.meta.url);
const ts = requireTs('typescript');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const orderId = 'b2dd412e-d3c9-4e4e-9909-aa99e2de4720';

function loadTypeScript(path, imports = {}) {
  const source = readFileSync(resolve(root, path), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    fileName: path,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const module = { exports: {} };
  vm.runInNewContext(outputText, {
    module,
    exports: module.exports,
    require: (name) => {
      if (name === 'server-only') return {};
      if (Object.hasOwn(imports, name)) return imports[name];
      throw new Error(`Unexpected import in regression harness: ${name}`);
    },
  }, { filename: path });
  return module.exports;
}

const types = loadTypeScript('types/admin-orders.ts');
const validation = loadTypeScript('lib/admin/orders-admin-validation.ts', {
  '@/types/admin-orders': types,
});

function fakeDatabase({ changeAfterRead, failHistory = false } = {}) {
  const order = {
    id: orderId, order_number: 123, status: 'جديد', confirmation_status: 'pending',
  };
  const history = [];
  let changed = false;
  let lastWriteGuards = {};

  const client = {
    from(table) {
      if (table === 'order_status_history') {
        return {
          async insert(record) {
            if (failHistory) return { error: { message: 'mock history failure' } };
            history.push(record);
            return { error: null };
          },
        };
      }
      assert.equal(table, 'orders');
      return {
        select() {
          return {
            eq(column, value) {
              assert.equal(column, 'id');
              assert.equal(value, orderId);
              return this;
            },
            async maybeSingle() {
              const snapshot = { ...order };
              if (changeAfterRead && !changed) {
                changed = true;
                changeAfterRead(order);
              }
              return { data: snapshot, error: null };
            },
          };
        },
        update(patch) {
          const guards = {};
          return {
            eq(column, value) { guards[column] = value; return this; },
            select() { return this; },
            async maybeSingle() {
              lastWriteGuards = { ...guards };
              const matches = Object.entries(guards).every(([key, value]) => order[key] === value);
              if (!matches) return { data: null, error: null };
              Object.assign(order, patch);
              return { data: { id: orderId }, error: null };
            },
          };
        },
      };
    },
  };
  return { client, order, history, getLastWriteGuards: () => lastWriteGuards };
}

function actions(db) {
  return loadTypeScript('lib/admin/orders-admin-writes.ts', {
    '@/lib/supabase/server-admin': { getSupabaseServerAdminClient: () => db.client },
    '@/lib/admin/orders-admin-validation': validation,
  });
}

{
  const db = fakeDatabase();
  const result = await actions(db).applyAdminOrderActionOrThrow(orderId, 'preparing');
  assert.equal(result.toStatus, 'جاري التحضير');
  assert.equal(db.order.status, 'جاري التحضير');
  assert.equal(db.history.length, 1);
  assert.equal(db.history[0].from_status, 'جديد');
  assert.equal(db.getLastWriteGuards().status, 'جديد');
  assert.equal(db.getLastWriteGuards().confirmation_status, 'pending');
}

{
  const db = fakeDatabase({ changeAfterRead: (order) => { order.status = 'ملغي'; } });
  await assert.rejects(
    actions(db).applyAdminOrderActionOrThrow(orderId, 'preparing'),
    /حالة الطلب اتغيرت/,
  );
  assert.equal(db.order.status, 'ملغي');
  assert.equal(db.history.length, 0);
}

{
  const db = fakeDatabase({ changeAfterRead: (order) => { order.confirmation_status = 'confirmed'; } });
  await assert.rejects(
    actions(db).applyAdminOrderActionOrThrow(orderId, 'confirm'),
    /حالة الطلب اتغيرت/,
  );
  assert.equal(db.order.confirmation_status, 'confirmed');
  assert.equal(db.history.length, 0);
}

{
  const db = fakeDatabase();
  const result = await actions(db).applyAdminOrderActionOrThrow(orderId, 'confirm');
  assert.equal(result.confirmationStatus, 'confirmed');
  assert.equal(db.order.status, 'جديد');
  assert.equal(db.order.confirmation_status, 'confirmed');
  assert.equal(db.history.length, 0);
}

// Limitation proof: audit insert and order update are NOT one atomic transaction.
{
  const db = fakeDatabase({ failHistory: true });
  await assert.rejects(
    actions(db).applyAdminOrderActionOrThrow(orderId, 'preparing'),
    /تعذر حفظ سجل تغيير الحالة/,
  );
  assert.equal(db.order.status, 'جاري التحضير');
  assert.equal(db.history.length, 0);
}

console.log('PASS: 5 admin order concurrency tests; no merchant database accessed');
