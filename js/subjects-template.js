async function loadSubject() {
  const params = new URLSearchParams(window.location.search);
  const subjectId = params.get("id");
  const res = await fetch(`https://script.google.com/macros/s/AKfycbznc7pGFPOu-_g1wzyTRbbWAaNbc3XB9vBLvDkSdWozISk1qqN7q52SP-9J6kgwdmr_Cw/exec?subject=${subjectId}`);
  const subjects = await res.json();
  return subjects;
}

function formatSectionName(sectionName) {
  if (sectionName === "dropin") return "Drop-in at LI-134";
  if (sectionName === "etc") return "ETC";
  if (sectionName === "online") return "Online";
  return sectionName;
}

function createAccordion(course) {
  const accordionWrapper = document.getElementById("accordion-wrapper");
  const accordionHeader = createAccordionButton(course.course, "main-accordion-btn");
  const accordionSection = createAccordionSection(course.sections);
  accordionWrapper.appendChild(accordionHeader);
  accordionWrapper.appendChild(accordionSection);
}

function createSearchBar() {
  const searchBar = document.createElement("input");
  searchBar.type = "text";
  searchBar.classList.add("search-bar");
  searchBar.id = "schedule-search";
  searchBar.placeholder = "Search for a course, tutoring type (e.g., Drop-in, ETC, Online), or instructor...";
  return searchBar;
}

function createAccordionButton(buttonText, secondButtonClass) {
  const button = document.createElement("button");
  button.classList.add("accordion-btn", secondButtonClass);
  button.innerHTML = `
    ${buttonText} <span class="accordion-arrow">&#9662;</span>
  `;
  return button;
}

function createAccordionSection(courseSections) {
  const content = document.createElement("div");
  content.classList.add("accordion-content");
  Object.entries(courseSections).forEach(([sectionKey, sectionArray]) => {
    if (sectionArray.length > 0) {
      const sectionButton = createAccordionButton(formatSectionName(sectionKey), "section-accordion-btn");
      content.appendChild(sectionButton);

      const sectionSchedules = document.createElement("div");
      sectionSchedules.classList.add("section-schedules");

      if (sectionKey === "etc") {
        sectionSchedules.classList.add("etc-schedules");
      }

      sectionArray.forEach(scheduleObject => {
        const scheduleContent = document.createElement("div");
        scheduleContent.classList.add("schedule-content");

        if (sectionKey === "etc") {
          const sectionTab = document.createElement("div");
          sectionTab.classList.add("section-tab");
          const sectionTitle = document.createElement("h4");
          sectionTitle.textContent = formatSectionName(sectionKey);
          sectionTab.appendChild(sectionTitle);
          scheduleContent.appendChild(sectionTab);
          sectionTitle.textContent = scheduleObject.Instructor;
        }

        const scheduleBox = document.createElement("div");
        scheduleBox.classList.add("rounded-box", "schedule-box");
        const scheduleBoxContent = document.createElement("div");
        scheduleBoxContent.classList.add("schedule-box-content");

        Object.entries(scheduleObject).forEach(([key, value]) => {
          if (key != "Instructor" && key != "Saturday") {
            const daysAndHours = document.createElement("div");
            daysAndHours.classList.add("days-and-hours");
            const days = document.createElement("h4");
            days.classList.add("days");
            days.textContent = key;
            const hours = document.createElement("h4");
            hours.classList.add("hours");
            hours.textContent = value;
            daysAndHours.appendChild(days);
            daysAndHours.appendChild(hours);
            scheduleBoxContent.appendChild(daysAndHours);
          }
        });
        scheduleBox.appendChild(scheduleBoxContent);
        scheduleContent.appendChild(scheduleBox);
        sectionSchedules.appendChild(scheduleContent);
      });
      content.appendChild(sectionSchedules);
    }
  });
  return content;
}

function closeOtherAccordions(currentButton, buttonClass) {
  const buttons = document.querySelectorAll(`.${buttonClass}`);
  buttons.forEach(otherButtons => {
    if (otherButtons !== currentButton) {
      otherButtons.nextElementSibling.classList.remove('open');
      otherButtons.querySelector(".accordion-arrow").classList.remove('open');
      otherButtons.classList.remove('open');
    }
  });
}

async function initializePage() {
  const params = new URLSearchParams(window.location.search);
  const subjectId = params.get("id");
  fetch("../data/subjects.json")
    .then(res => res.json())
    .then(subjects => {
      const subject = subjects[subjectId];
      if (subject) {
        const subjectTitle = document.getElementById("subject-title");
        subjectTitle.textContent = subject.name;
        const subjectDescription = document.getElementById("subject-description");
        if (subject.description) {
          subjectDescription.textContent = subject.description;
        } else {
          subjectDescription.style.display = "none";
        }
        const searchBar = createSearchBar();
        const subjectInfoContainer = document.getElementById("subject-info-container");
        subjectInfoContainer.appendChild(searchBar);

      }
    });
}

function buildLayout(coursesArray) {
  coursesArray.forEach(course => {
    createAccordion(course);
  });
}

const loadingScreen = document.getElementById("loading-screen");
const loadingText = document.getElementById("loading-text");

function showLoading(message = "Loading...") {
  loadingText.textContent = message;
  loadingScreen.classList.remove("hidden");
  mainContent.hidden = true;
}

function updateLoading(message) {
  loadingText.textContent = message;
}

function hideLoading() {
  loadingScreen.style.display = 'none';
  mainContent.hidden = false;
}

async function loadPage() {
  try {
    showLoading("Initializing page...");
    initializePage();

    updateLoading("Fetching subject data...");
    const coursesArray = await loadSubject();

    updateLoading("Building schedule layout...");
    buildLayout(coursesArray);

    updateLoading("Finalizing page...");
    document.dispatchEvent(new Event("subjectsRendered"));

    hideLoading();
  } catch (error) {
    loadingText.textContent = "Failed to load schedules.";
    console.error(error);
  }
}

function enableAccordions() {
  const accordionButtons = document.querySelectorAll(".accordion-btn");
  accordionButtons.forEach(button => {
    button.addEventListener('click', () => {
      console.log("dawg");
      button.classList.toggle('open');
      button.nextElementSibling.classList.toggle('open');
      button.querySelector(".accordion-arrow").classList.toggle('open');

      if (button.classList.contains("main-accordion-btn")) {
        closeOtherAccordions(button, "main-accordion-btn");
      }
      else if (button.classList.contains("section-accordion-btn")) {
        closeOtherAccordions(button, "section-accordion-btn");
      }
    });
  });
}

async function run() {
  await loadPage();
  enableAccordions();
  console.log("Subject loaded successfully.");
}

run();