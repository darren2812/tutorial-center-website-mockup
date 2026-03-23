document.addEventListener("subjectsRendered", () => {
  initScheduleSearch();
});

function initScheduleSearch() {
  const searchInput = document.getElementById("schedule-search");
  const mainButtons = document.querySelectorAll(".main-accordion-btn");

  const scheduleData = Array.from(mainButtons).map(button => {
    const accordionContent = button.nextElementSibling;
    return {
      button: button, // The actual accordion button
      content: accordionContent, // The actual HTML accordion content
    };
  });

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();

    if (query.length >= 1) {
      scheduleData.forEach(data => {
        
        // We check if the accordion button has the query.
        if (data.button.textContent.toLowerCase().includes(query)) {
          data.content.classList.remove('open');
          data.button.classList.remove('open');
          data.content.querySelectorAll(".schedule-content").forEach(schedule => schedule.style.display = 'block');
          data.button.style.display = 'flex';
        }
        // If not, we check if any of the section tabs match the query.
        else {
          let anyVisible = false;
          data.content.querySelectorAll(".schedule-content").forEach(schedule => {
            const sectionTab = schedule.firstChild;
            const text = sectionTab.querySelector("h4").textContent.toLowerCase();
            if (text.includes(query)) {
              schedule.style.display = 'block';
              anyVisible = true;
            } else {
              schedule.style.display = 'none';
            }
          });
          // If any schedule is visible, show the button. Otherwise, hide it.
          if (anyVisible) {
            data.button.style.display = 'flex';
          }
          else {
            data.button.classList.remove('open');
            data.content.classList.remove('open');
            data.button.querySelector(".accordion-arrow").classList.remove('open');
            data.button.style.display = 'none';
          }
        }
      });
    } else {
      // Reset Logic
      scheduleData.forEach(data => {
        data.content.classList.remove('open');
        data.button.classList.remove('open');
        data.content.querySelectorAll(".schedule-content").forEach(schedule => schedule.style.display = 'block');
        data.button.style.display = 'flex';
      });
    }
  });
}