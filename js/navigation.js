const sidebarBtn = document.getElementById("sidebar-btn-wrapper");
const sidebar = document.getElementById("sidebar");
const sidebarExit = document.getElementById("sidebar-exit-btn");
const navDropdownBtn = document.getElementById("nav-dropdown-btn");
const navDropdownArrow = document.getElementById("nav-dropdown-arrow");
const navDropdownContent = document.getElementById("nav-dropdown-content");
const sidebarDropdownBtn = document.getElementById("sidebar-dropdown-btn");
const sidebarDropdownArrow = document.getElementById("sidebar-dropdown-arrow");
const sidebarDropdownContent = document.getElementById("sidebar-dropdown-content");
const overlay = document.getElementById("overlay");
const mainContent = document.getElementById("main-content");

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
    navDropdownArrow.classList.toggle('open');
});

sidebarDropdownBtn.addEventListener('click', () => {
    sidebarDropdownContent.classList.toggle('open');
    sidebarDropdownArrow.classList.toggle('open');
})

overlay.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !sidebarBtn.contains(e.target) &&
        sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    }
});

mainContent.addEventListener('click', (e) => {
    if (!navDropdownContent.contains(e.target) && !navDropdownBtn.contains(e.target) &&
    navDropdownContent.classList.contains('open')) {
        navDropdownContent.classList.remove('open');
        navDropdownArrow.classList.remove('open');
    }
});