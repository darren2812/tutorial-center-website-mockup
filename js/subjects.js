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
    
    // determining which schedule gets displayed
    function applySection (sectionName, iframeId, containerId) {
      const section = subject?.sections?.[sectionName];
      if (section) {
        document.getElementById(iframeId).src = section.iframe;
        if (sectionName === "drop-in") {
          document.getElementById("drop-in-location").textContent = section?.["location"];
        }
      }
      else {
        document.getElementById(containerId).remove();
      }
    }
    
    applySection("drop-in", "drop-in-iframe", "drop-in-info");
    applySection("etc", "etc-iframe", "etc-info");
    applySection("online", "online-iframe", "online-info");

  });
