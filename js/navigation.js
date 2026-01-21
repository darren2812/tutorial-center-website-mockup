const sidebarBtn = document.getElementById("sidebar-btn");
const sidebar = document.getElementById("sidebar");
const sidebarExit = document.getElementById("sidebar-exit-btn");
const navDropdownBtn = document.getElementById("nav-dropdown-btn");
const navDropdownContent = document.getElementById("nav-dropdown-content");
const overlay = document.getElementById("overlay");

sidebarBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
});

sidebarExit.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
});

navDropdownBtn.addEventListener('click', () => {
    navDropdownContent.classList.toggle('open');
});

overlay.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !sidebarBtn.contains(e.target) &&
        sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    }
});