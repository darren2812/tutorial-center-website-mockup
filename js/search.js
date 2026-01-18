const searchInput = document.getElementById('subject-search');
const subjectBoxes = document.querySelectorAll('.subjects-box');

// OPTIMIZATION: 
// Pre-calculate the relationship between boxes and links once on load.
// We map the NodeList of boxes into an array of Javascript objects.
const subjectData = Array.from(subjectBoxes).map(box => {
  return {
    element: box, // The actual HTML box
    links: box.querySelectorAll('.subjects-content a') // The links inside this specific box
  };
});

searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();

  if (query.length >= 1) {
    
    // Loop through our PRE-CALCULATED data, not the DOM
    subjectData.forEach(data => {
      let anyVisible = false;

      // We use data.links (cached), not box.querySelectorAll (slow)
      data.links.forEach(link => {
        const text = link.textContent.toLowerCase();
        
        if (text.includes(query)) {
          link.style.display = 'block';
          anyVisible = true;
        } else {
          link.style.display = 'none';
        }
      });

      // We use data.element to control the box visibility
      data.element.style.display = anyVisible ? 'block' : 'none';
    });

  } else {
    // Reset Logic
    subjectData.forEach(data => {
      data.element.style.display = 'block';
      data.links.forEach(link => link.style.display = 'block');
    });
  }
});