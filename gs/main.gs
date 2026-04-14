// google apps script to fetch data from google sheets

function convertToArray(id) {
  // opening spreadsheet, accessing specific sheet, and getting a 2d array of rows
  const spreadsheet = SpreadsheetApp.openById(id);
  const sheet = spreadsheet.getSheets()[0];
  const rows = sheet.getDataRange().getDisplayValues();

  return rows;
}

function doGet(e) {
  const subject = e.parameter.subject;
  const subjectData = SUBJECTS[subject];
  const coursesObject = {};

  Object.entries(subjectData.sections).forEach(([sectionName, sectionData]) => {

    const id = sectionData.id;
    const rows = convertToArray(id);
    const headers = rows[0];
    const data = rows.slice(1);

    data.forEach(row => {
      const courseTitle = row[0];

      // creating fields if they do not exist yet
      if (!coursesObject[courseTitle]) {
        coursesObject[courseTitle] =
        {
          course: courseTitle,
          sections: {}
        }
      }
      // the bottom layer of the data is an array of objects (so dropin will have 1 object, etc will have multiple due to many instructors)
      if (!coursesObject[courseTitle].sections[sectionName]) {
        coursesObject[courseTitle].sections[sectionName] = [];
      }

      const newObject = {}

      for (i = 1; i < row.length; i++) {
        newObject[headers[i]] = row[i];
      }

      coursesObject[courseTitle].sections[sectionName].push(newObject);
    });
  });

  const coursesArray = Object.values(coursesObject)
    .sort((a, b) => a.course.localeCompare(b.course));

  if (!subjectData) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: "Invalid subject" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService
    .createTextOutput(JSON.stringify(coursesArray))
    .setMimeType(ContentService.MimeType.JSON);
}





