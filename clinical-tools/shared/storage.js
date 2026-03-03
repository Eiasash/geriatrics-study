/**
 * localStorage wrapper with 24-hour TTL and patient data clearing.
 */
const SecureStorage = {
  set(key, value, ttlHours = 24) {
    try {
      localStorage.setItem(key, JSON.stringify({
        value, expires: Date.now() + ttlHours * 3600000
      }));
    } catch(e) { console.warn('Storage write failed', e); }
  },
  get(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const item = JSON.parse(raw);
      if (item.expires && Date.now() > item.expires) {
        localStorage.removeItem(key); return null;
      }
      return item.value;
    } catch(e) { return null; }
  },
  remove(key) { localStorage.removeItem(key); },
  clearPatientData() {
    ['geriatricMeds','geriatricPatient','geriatricNotes','chatHistory']
      .forEach(k => localStorage.removeItem(k));
  }
};
window.SecureStorage = SecureStorage;
