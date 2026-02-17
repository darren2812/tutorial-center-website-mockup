const params = new URLSearchParams(window.location.search);
const subjectId = params.get("id");

fetch("../data/subjects.json")
  .then(res => res.json())
  .then(subjects => {
    const subject = subjects[subjectId];

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

    function createRow(entry) {
      const tableRow = document.createElement("tr");
      tableRow.innerHTML = `
      <td>${entry.Course.toUpperCase()}</td>
      <td>${entry.Instructor}</td>
      <td>${entry.Sunday}</td>
      <td>${entry.Monday}</td>
      <td>${entry.Tuesday}</td>
      <td>${entry.Wednesday}</td>
      <td>${entry.Thursday}</td>
      <td>${entry.Friday}</td>
      <td>${entry.Saturday}</td>
  `   ;
      console.log("Row created");
      return tableRow;
    }

    function renderTable(data) {
      const tableBody = document.getElementById("table-contents");
      tableBody.innerHTML = "";

      data.forEach(element => {
        tableBody.appendChild(createRow(element));
      });

      console.log("Table rendered");
    }

    function populateFilter(dataToFilter, filterId) {
      const allData = dataToFilter.map((dataEntry) => dataEntry.Course);
      const uniqueData = [...new Set(allData)];
      const filterList = document.getElementById(filterId);

      uniqueData.forEach((uniqueEntry) => {
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

        if (sectionName === "drop-in") {
          document.getElementById("drop-in-location").textContent = section?.["location"];
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

    // applySection("drop-in", "drop-in-iframe", "drop-in-info");
    applySection("etc", "etc-iframe", "etc-info");
    // applySection("online", "online-iframe", "online-info");

  });
