async function loadSubject() {
  const params = new URLSearchParams(window.location.search);
  const subjectId = params.get("id");
  const res = await fetch(`https://script.google.com/macros/s/AKfycby2TLCtNSapumt7K_7kiJp0TUDyQh6s1v4ovZ1b46H8Tu6amAlVBYuckkAe43anlfu16g/exec?subject=${subjectId}`);
  const subjects = await res.json();
  return subjects;
}

function createRow(entry) {
  const tableRow = document.createElement("tr");
  Object.entries(entry).forEach(([key, value]) => {
    if (key != "Saturday") {
      const tableData = document.createElement("td");
      tableData.textContent = value;
      tableRow.append(tableData);
    }
  });
  return tableRow;
}

// have to change this function because now we have multiple sections instead of just one schedule
function renderTable(data, section) {
  if (!data) {
    document.getElementById(`${section}-info`).remove();
    return;
  }

  const TABLE_CONFIG = {
    dropin: ["Course", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",],
    etc: ["Course", "Instructor", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    online: ["Course", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  };

  // creating headings
  const tableHeading = document.getElementById(`${section}-table-headings`);
  tableHeading.innerHTML = "";
  TABLE_CONFIG[section].forEach(heading => {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = heading;
    tableHeading.appendChild(th);
  });

  // creating table body
  const tableBody = document.getElementById(`${section}-table-contents`);
  tableBody.innerHTML = "";
  data.forEach(element => {
    console.log(element);
    tableBody.appendChild(createRow(element));
  });
}

function populateFilters(data) {
  const uniqueCourses = new Set();
  const uniqueInstructors = new Set();
  const courseFilter = document.getElementById("course-filter");
  const instructorFilter = document.getElementById("instructor-filter");
  const typeFilter = document.getElementById("type-filter");

  Object.values(data).forEach((section) => {
    Object.values(section).forEach(dataEntry => {
      uniqueCourses.add(dataEntry.Course);
      if (dataEntry.Instructor) {
        uniqueInstructors.add(dataEntry.Instructor);
      }
    });
  });

  const sortedCourses = [...uniqueCourses].sort((a, b) => a.localeCompare(b));
  const sortedInstructors = [...uniqueInstructors].sort((a, b) => a.localeCompare(b));

  sortedCourses.forEach((uniqueEntry) => {
    courseFilter.add(new Option(uniqueEntry, uniqueEntry.toLowerCase()));
  });

  sortedInstructors.forEach((uniqueEntry) => {
    instructorFilter.add(new Option(uniqueEntry, uniqueEntry.toLowerCase()));
  });

  const TYPE_LABELS = {
    dropin: "Drop-in Tutoring",
    etc: "Extending the Class (ETC)",
    online: "Online Tutoring"
  };

  Object.keys(data).forEach(type => {
    const label = TYPE_LABELS[type] || type;
    typeFilter.add(new Option(label, type));
  });
}


loadSubject().then(subjects => {
  console.log(subjects);
  const SECTIONS = ["dropin", "etc", "online"];
  SECTIONS.forEach(section => {
    if (subjects[section]) {
      console.log(subjects[section]);
      renderTable(subjects[section], section);
    }
    else {
      document.getElementById(`${section}-info`).remove();
    }
  });
  populateFilters(subjects);
});

/*
fetch("https://script.google.com/macros/s/AKfycbyGjEIH9y0M7NNRb1mlWXtGNU8zFF-k1OX9z08DQFnX7kN5u-YHvMHOLG6untMkN8qppw/exec?subject=${subjectId}")
  .then(res => res.json())
  .then(subjects => {

    const subject = subjects[subjectId];

    

    function populateFilter(dataToFilter, filterId) {
      const uniqueCourses = new Set();
      const uniqueInstructors = new Set();
      const allCourses = dataToFilter.map((dataEntry) => dataEntry.Course);
      const allInstructors = dataToFilter.map((dataEntry) => dataEntry.Instructor);

      allCourses.forEach((course) => uniqueCourses.add(course));
      allInstructors.forEach((instructor) => uniqueInstructors.add(instructor));
      
      const filterList = document.getElementById(filterId);

      uniqueCourses.forEach((uniqueEntry) => {
        filterList.add(new Option(uniqueEntry, uniqueEntry.toLowerCase()));
      });

      console.log(filterList);
    }

    // determining which schedule gets displayed
    function applySection(sectionName, iframeId, containerId) {
      const section = subject.sections?.[sectionName];
      const locationList = document.getElementById("in-person-location");
      const iframe = document.getElementById(iframeId);

      if (section) {
        const sectionCsv = section.iframe;

        // parsing file using Papa Parse
        Papa.parse(sectionCsv, {
          download: true,
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            renderTable(results.data);
            console.log(results);
            populateFilter(results.data, "course-filter");
          }
        });

        iframe.src = section.iframe;
        iframe.style.height = `${section.height}px`;

        if (sectionName === "dropin") {
          document.getElementById("dropin-location").textContent = section?.["location"];
          const dropInLocation = document.createElement("li");
          dropInLocation.textContent = `Drop in at ${section?.["location"]} during hours below.`;
          locationList.appendChild(dropInLocation);
        }
        if (sectionName === "etc") {
          const etcAvailability = document.createElement("li");
          etcAvailability.textContent = "ETC Available for instructors below";
          locationList.appendChild(etcAvailability);
        }
      }
      else {
        document.getElementById(containerId).remove();
      }
    }

    if (!subject) {
      document.body.innerHTML = "<h1>Subject not found</h1>";
      return;
    }

    document.getElementById("subject-title").textContent = subject.name;

    // checks if description exists
    const subjectDescription = subject?.description;
    if (subjectDescription) {
      document.getElementById("subject-description").textContent = subjectDescription;
    }
    else {
      document.getElementById("subject-description").remove();
    }

    // applySection("dropin", "dropin-iframe", "dropin-info");
    applySection("etc", "etc-iframe", "etc-info");
    // applySection("online", "online-iframe", "online-info");

  });
  */
