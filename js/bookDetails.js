const params = new URLSearchParams(window.location.search);
const bookId = params.get('bookId');

// Fetch book details based on bookId
async function fetchBookDetails(id) {
  try {
    // Show loading spinner
    document.getElementById('loading').style.display = 'flex';

    const response = await fetch(`https://gutendex.com/books/${id}`);
    const data = await response.json();

    // Hide loading spinner and show book content
    document.getElementById('loading').style.display = 'none';
    document.getElementById('bookCoverContainer').style.display = 'block';
    document.getElementById('bookInfo').style.display = 'block';

    // Populate the HTML with book details
    document.getElementById('bookTitle').textContent = data.title;
    document.getElementById('bookCover').src = data.formats['image/jpeg'];
    document.getElementById('bookAuthor').textContent = `Author: ${data.authors[0].name} (${data.authors[0].birth_year} - ${data.authors[0].death_year})`;

    // Display subjects as a list
    const subjectsList = document.getElementById('bookSubjects');
    subjectsList.innerHTML = ''; // Clear existing subjects
    data.subjects.forEach(subject => {
      const li = document.createElement('li');
      li.textContent = subject;
      subjectsList.appendChild(li);
    });

    document.getElementById('bookLanguages').textContent = `Languages: ${data.languages.join(', ')}`;
    document.getElementById('bookDownloadCount').textContent = `Download Count: ${data.download_count}`;

    // Show 'text/html' format as a button
    const formatsList = document.getElementById('bookFormats');
    formatsList.innerHTML = ''; // Clear existing formats
    const htmlFormat = data.formats['text/html'];

    if (htmlFormat) {
      const button = document.createElement('button');
      button.classList.add('read-now-btn');
      button.innerHTML = `<a href="${htmlFormat}" target="_blank">Read Now</a>`;
      formatsList.appendChild(button);
    }
  } catch (error) {
    console.error('Error fetching book details:', error);
    document.getElementById('loading').textContent = 'Error loading book details.';
  }
}

// Fetch the book details when the page loads
fetchBookDetails(bookId);
