document.addEventListener("subjectsRendered", () => {
  initScheduleSearch();
});

function initScheduleSearch() {
  const searchInput = document.getElementById("schedule-search");
  const mainButtons = document.querySelectorAll(".main-accordion-btn");

  const scheduleData = Array.from(mainButtons).map(button => {
    const accordionContent = button.nextElementSibling;
    return {
      mainButton: button, // The actual accordion button
      content: accordionContent, // The actual HTML accordion content
    };
  });

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();

    // Resetting layout with every input
    document.querySelectorAll(".accordion-btn").forEach(button => {
      button.style.display = 'flex'
      button.classList.remove('open');
      button.querySelector(".accordion-arrow").classList.remove('open');
    });
    document.querySelectorAll(".accordion-content").forEach(content => content.classList.remove('open'));
    document.querySelectorAll(".schedule-content").forEach(schedule => schedule.style.display = 'none');

    scheduleData.forEach(data => {
      // We check if the accordion button has the query.
      if (data.mainButton.textContent.toLowerCase().includes(query)) {
        data.mainButton.style.display = 'flex';
        data.content.querySelectorAll(".section-accordion-btn").forEach(sectionButton => {
          sectionButton.style.display = 'flex';
        });
        data.content.querySelectorAll(".schedule-content").forEach(schedule => {
          schedule.style.display = 'block';
        });
      }

      // If not, we check if any of section buttons and section tabs have the query.
      else {
        let mainButtonVisible = false;

        data.content.querySelectorAll(".section-accordion-btn").forEach(sectionButton => {

          if (sectionButton.textContent.toLowerCase().includes(query)) {
            sectionButton.style.display = 'flex';
            data.content.querySelectorAll(".schedule-content").forEach(schedule => {
              schedule.style.display = 'block';
            });
            mainButtonVisible = true;
          }
          else {
            let sectionButtonVisible = false;

            if (sectionButton.nextElementSibling.classList.contains("etc-schedules")) {
              const etcSchedule = sectionButton.nextElementSibling;
              etcSchedule.querySelectorAll(".section-tab").forEach(sectionTab => {
                const instructor = sectionTab.querySelector("h4").textContent.toLowerCase();
                const schedule = sectionTab.closest(".schedule-content");
                if (instructor.includes(query)) {
                  schedule.style.display = 'block';
                  sectionButtonVisible = true;
                }
                else {
                  schedule.style.display = 'none';
                }
              });
            }

            if (sectionButtonVisible) {
              sectionButton.style.display = 'flex';
              mainButtonVisible = true;
            }
            else {
              sectionButton.style.display = 'none';
            }
          }
        });

        // If any schedule is visible, show the button. Otherwise, hide it.
        if (mainButtonVisible) {
          data.mainButton.style.display = 'flex';
        }
        else {
          data.mainButton.style.display = 'none';
        }
      }
    });
  });
}