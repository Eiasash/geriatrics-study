// Minimal no-op mock so requiring build scripts doesn't touch the real FS.
const mem = new Map();

module.exports = {
  ensureDirSync: () => {},
  emptyDirSync: () => {},
  mkdirpSync: () => {},
  existsSync: () => true,
  readdirSync: () => [],
  copySync: () => {},
  removeSync: () => {},
  writeFileSync: () => {},
  readFileSync: () => Buffer.from(''),
  readJsonSync: () => ({}),
  writeJsonSync: (p, obj) => mem.set(p, JSON.stringify(obj)),
  // Async shapes if any script imports them:
  ensureDir: async () => {},
  emptyDir: async () => {},
  copy: async () => {},
  readJson: async () => ({}),
  writeJson: async () => {},
};