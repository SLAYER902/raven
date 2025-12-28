// lightweight JSON DB using lowdb adapter
const { Low, JSONFile } = require('lowdb');
const path = require('path');
const dbFile = path.join(process.cwd(), 'data', 'db.json');

const adapter = new JSONFile(dbFile);
const db = new Low(adapter);

async function init() {
  await db.read();
  db.data ||= { conversations: [], projects: [], settings: {} };
  await db.write();
}

async function addConversation(entry) {
  db.data.conversations.push(entry);
  await db.write();
}

async function queryConversations(filterFn) {
  await db.read();
  return (db.data.conversations || []).filter(filterFn);
}

module.exports = { init, addConversation, queryConversations };
