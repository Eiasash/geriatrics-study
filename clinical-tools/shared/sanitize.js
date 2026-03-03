/**
 * HTML-escape helper. Use esc() for any user data inserted into innerHTML.
 */
function esc(str) {
  const d = document.createElement('div');
  d.textContent = (str == null) ? '' : String(str);
  return d.innerHTML;
}
window.esc = esc;
