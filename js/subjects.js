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
    <h2>${courseName}</h2>
  `;
  return header;
}

function createAccordionSection(courseSections) {
  const content = document.createElement("div");
  content.classList.add("accordion-content");
  Object.entries(courseSections).forEach(([sectionKey, sectionArray]) => {
    if (sectionArray.length > 0) {
      const section = document.createElement("div");
      section.id = sectionKey;
      const sectionTitle = document.createElement("h3");
      sectionTitle.textContent = formatSectionName(sectionKey);
      section.appendChild(sectionTitle);
      
      const scheduleContent = document.createElement("div");
      scheduleContent.classList.add("schedule-content");

      sectionArray.forEach(scheduleObject => {
        if (sectionKey === "etc") {
          const instructor = document.createElement("h4");
          instructor.textContent = "Instructor: " + scheduleObject.Instructor;
          scheduleContent.appendChild(instructor);
        }
        const scheduleBox = document.createElement("div");
        scheduleBox.classList.add("rounded-box");
        const scheduleBoxContent = document.createElement("div");
        scheduleBoxContent.classList.add("rounded-box-content");

        Object.entries(scheduleObject).forEach(([key, value]) => {
          if (key != "Instructor" && key != "Saturday") {
            const daysAndHours = document.createElement("div");
            daysAndHours.classList.add("days-and-hours");
            const days = document.createElement("h4");
            days.textContent = key;
            const hours = document.createElement("h4");
            hours.textContent = value;
            daysAndHours.appendChild(days);
            daysAndHours.appendChild(hours);
            scheduleBoxContent.appendChild(daysAndHours);
          }
        });
        scheduleBox.appendChild(scheduleBoxContent);
        scheduleContent.appendChild(scheduleBox);
      });
      section.appendChild(scheduleContent);
      content.appendChild(section);
    }
  });
  return content;
}


loadSubject().then(coursesArray => {
  coursesArray.forEach(course => {
    createAccordion(course);
    console.log(course);
  });
});