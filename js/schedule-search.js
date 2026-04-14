document.addEventListener("subjectsRendered", () => {
  initScheduleSearch();
});

function closeAccordion(button, content) {
  button.style.display = "flex";
  button.classList.remove("open");
  button.querySelector(".accordion-arrow")?.classList.remove("open");
  content?.classList.remove("open");
}

function showSchedules(schedules, display = "block") {
  schedules.forEach(schedule => {
    schedule.style.display = display;
  });
}

function initScheduleSearch() {
  const searchInput = document.getElementById("schedule-search");

  if (!searchInput || searchInput.dataset.initialized === "true") {
    return;
  }

  searchInput.dataset.initialized = "true";

  // precaching DOM queries
  const mainButtons = document.querySelectorAll(".main-accordion-btn");
  const scheduleData = Array.from(mainButtons).map(mainButton => {
    const content = mainButton.nextElementSibling;
    const sections = Array.from(content.querySelectorAll(".section-accordion-btn")).map(sectionButton => {
      const scheduleGroup = sectionButton.nextElementSibling;
      const schedules = Array.from(scheduleGroup?.querySelectorAll(".schedule-content") ?? []);
      const instructorNames = schedules.map(schedule => {
        const instructorHeading = schedule.querySelector(".section-tab h4");
        return instructorHeading ? instructorHeading.textContent.toLowerCase() : "";
      });

      return {
        button: sectionButton,
        scheduleGroup,
        schedules,
        instructorNames,
      };
    });

    return {
      mainButton,
      content,
      sections,
    };
  });

  function resetSearchState() {
    scheduleData.forEach(({ mainButton, content, sections }) => {
      closeAccordion(mainButton, content);

      sections.forEach(({ button, scheduleGroup, schedules }) => {
        closeAccordion(button, scheduleGroup);
        showSchedules(schedules, "none");
      });
    });
  }

  function showAllSections(sections) {
    sections.forEach(({ button, schedules }) => {
      button.style.display = "flex";
      showSchedules(schedules);
    });
  }

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();

    resetSearchState();

    scheduleData.forEach(({ mainButton, sections }) => {
      if (mainButton.textContent.toLowerCase().includes(query)) {
        mainButton.style.display = "flex";
        showAllSections(sections);
        return;
      }

      let mainButtonVisible = false;

      sections.forEach(({ button, scheduleGroup, schedules, instructorNames }) => {
        const sectionMatches = button.textContent.toLowerCase().includes(query);

        if (sectionMatches) {
          button.style.display = "flex";
          showSchedules(schedules);
          mainButtonVisible = true;
          return;
        }

        const isEtcSection = scheduleGroup?.classList.contains("etc-schedules");
        let sectionButtonVisible = false;

        if (isEtcSection) {
          schedules.forEach((schedule, index) => {
            const instructorMatches = instructorNames[index].includes(query);
            schedule.style.display = instructorMatches ? "block" : "none";
            sectionButtonVisible = sectionButtonVisible || instructorMatches;
          });
        }

        if (sectionButtonVisible) {
          button.style.display = "flex";
          mainButtonVisible = true;
        } else {
          button.style.display = "none";
          showSchedules(schedules, "none");
        }
      });

      mainButton.style.display = mainButtonVisible ? "flex" : "none";
    });
  });
}