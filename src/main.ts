const REPO_BASE = 'https://saberbadri24-tech.github.io/city-of-eterniuty/';
const RAW_BASE = 'https://raw.githubusercontent.com/saberbadri24-tech/city-of-eternity/main/';

async function boot() {
  const root = document.querySelector<HTMLDivElement>('#app');
  if (!root) throw new Error('App root not found');
  if (window.location.hash === '#admin') {
    const { renderAdmin } = await import('./admin');
    await renderAdmin(root);
    return;
  }
  const html = await fetch(`${RAW_BASE}index.html?ts=${Date.now()}`).then((r) => {
    if (!r.ok) throw new Error(`latest_ui_${r.status}`);
    return r.text();
  });
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  document.documentElement.lang = parsed.documentElement.lang || 'fa';
  document.documentElement.dir = parsed.documentElement.dir || 'rtl';
  document.head.innerHTML = parsed.head.innerHTML
    .replaceAll('href="style.css"', `href="${RAW_BASE}style.css"`)
    .replaceAll('href="manifest.webmanifest"', `href="${REPO_BASE}manifest.webmanifest"`)
    .replaceAll('href="icon.svg"', `href="${REPO_BASE}icon.svg"`);
  const base = document.createElement('base');
  base.href = REPO_BASE;
  document.head.prepend(base);
  document.body.innerHTML = parsed.body.innerHTML;
  const script = document.createElement('script');
  script.src = `${RAW_BASE}script.js?ts=${Date.now()}`;
  script.defer = true;
  document.body.appendChild(script);
  const sw = document.createElement('script');
  sw.textContent = "if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});";
  document.body.appendChild(sw);
}

boot().catch((error) => {
  const root = document.querySelector<HTMLDivElement>('#app');
  if (root) root.innerHTML = '<main style="padding:40px;font-family:Arial;text-align:center">ANIL X is loading the latest experience. Please refresh once.</main>';
  console.error(error);
});
