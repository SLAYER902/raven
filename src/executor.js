// Safe executor for local actions. NO destructive system-level operations allowed.
// Use a whitelist of allowed directories and require confirmAction from main.
const path = require('path');
const fs = require('fs');

const allowedDirs = [path.join(process.cwd(), 'user_files'), path.join(process.cwd(), 'projects')];

function isPathAllowed(targetPath) {
  const normalized = path.resolve(targetPath);
  return allowedDirs.some(dir => normalized.startsWith(path.resolve(dir)));
}

async function deleteFileWithConfirmation(apiConfirm, targetPath) {
  if (!isPathAllowed(targetPath)) throw new Error('Operation not allowed on this path');
  const ok = await apiConfirm({ title: 'Delete file', message: `Delete ${targetPath}? This cannot be undone.` });
  if (!ok) return false;
  fs.unlinkSync(targetPath);
  return true;
}

module.exports = { deleteFileWithConfirmation, isPathAllowed };
