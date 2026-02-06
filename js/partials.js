async function loadPartial(id, file) {
  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error(`Failed to load ${file}: ${res.status}`);
    const html = await res.text();
    const element = document.getElementById(id);
    if (!element) throw new Error(`Element with id "${id}" not found`);
    element.innerHTML = html;
    console.log(`Loaded ${file} into #${id}`);
  } catch (error) {
    console.error(error);
  }
}

async function loadLayout() {
  await loadPartial("navbar", "/partials/navbar.html");
  await loadPartial("sidebar", "/partials/sidebar.html");
  await loadPartial("site-footer", "/partials/footer.html");
  await import("/js/navigation.js");
}

loadLayout();
