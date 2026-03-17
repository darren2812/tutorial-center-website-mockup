async function loadSubject() {
  const params = new URLSearchParams(window.location.search);
  const subjectId = params.get("id");
  const res = await fetch(`https://script.google.com/macros/s/AKfycbyDaKg2zFOqjKZ5DzB4UjLBj4eMNNEB596uhBckDIzCJDG3dJTqDj6DHvBcZIBb2z6kLg/exec?subject=${subjectId}`);
  const subjects = await res.json();
  return subjects;
}

function formatSectionName(sectionName) {
  if (sectionName === "dropin") return "Drop-in";
  if (sectionName === "etc") return "ETC";
  if (sectionName === "online") return "Online";
  return sectionName;
}

function createAccordion(course) {
  const accordionWrapper = document.getElementById("accordion-wrapper");
  const accordionHeader = createAccordionHeader(course.course);
  const accordionSection = createAccordionSection(course.sections);
  accordionWrapper.appendChild(accordionHeader);
  accordionWrapper.appendChild(accordionSection);
}

function createAccordionHeader(courseName) {
  const header = document.createElement("button");
  header.classList.add("accordion-btn");
  header.innerHTML = `
    <h3>${courseName}</h3>
  `;
  return header;
}

function createAccordionSection(courseSections) {
  const content = document.createElement("div");
  content.classList.add("accordion-content");
  Object.entries(courseSections).forEach(([sectionKey, sectionArray]) => {
    if (sectionArray.length > 0) {

      const sectionSchedules = document.createElement("div");
      sectionSchedules.classList.add("section-schedules");

      sectionArray.forEach(scheduleObject => {
        const scheduleContent = document.createElement("div");
        scheduleContent.classList.add("schedule-content");
        const sectionTab = document.createElement("div");
        sectionTab.classList.add("section-tab");
        const sectionTitle = document.createElement("h4");
        sectionTitle.textContent = formatSectionName(sectionKey);
        sectionTab.appendChild(sectionTitle);
        scheduleContent.appendChild(sectionTab);

        if (sectionKey === "etc") {
          sectionTitle.textContent += " - " + scheduleObject.Instructor;
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

loadSubject().then(coursesArray => {
  coursesArray.forEach(course => {
    createAccordion(course);
    console.log(course);
  });
  const accordionButtons = document.querySelectorAll(".accordion-btn");
  accordionButtons.forEach(button => {
    button.addEventListener('click', () => {
      button.nextElementSibling.classList.toggle('open');
    });
  });
});