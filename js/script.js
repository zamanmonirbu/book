const API_URL = 'https://gutendex.com/books';
let currentPage = 1;
let searchQuery = '';
let genreFilter = '';
let authorYearStart = '';
let authorYearEnd = '';
let copyrightFilter = '';
let idsFilter = '';
let languagesFilter = '';
let mimeTypeFilter = '';
let sortFilter = '';
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Fetch books from API
async function fetchBooks(page = 1, search = '', genre = '', yearStart = '', yearEnd = '', copyright = '', ids = '', languages = '', mimeType = '', sort = '') {
    document.getElementById('loading').style.display = 'block'; // Show loading spinner
    
    let url = `${API_URL}/?page=${page}`;
    if (search) url += `&search=${search}`;
    if (genre) url += `&topic=${genre}`;
    if (yearStart) url += `&author_year_start=${yearStart}`;
    if (yearEnd) url += `&author_year_end=${yearEnd}`;
    if (copyright) url += `&copyright=${copyright}`;
    if (ids) url += `&ids=${ids}`;
    if (languages) url += `&languages=${languages}`;
    if (mimeType) url += `&mime_type=${mimeType}`;
    if (sort) url += `&sort=${sort}`;
    
    const response = await fetch(url);
    const data = await response.json();

    document.getElementById('loading').style.display = 'none'; // Hide loading spinner

    displayBooks(data.results);
    populateGenreDropdown(data.results);
    handlePagination(data.next, data.previous);
    
    // Show pagination after loading
    document.getElementById('pagination').classList.remove('hidden'); 
}


// Display books
function displayBooks(books) {
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '';

    books.forEach(book => {
        const cover = book.formats['image/jpeg'];
        const isWishlisted = wishlist.includes(book.id);
        const truncatedTitle = book.title.length > 25 ? book.title.slice(0, 25) + '...' : book.title;

        const bookCard = `
            <div class="book border rounded p-4">
                <a href="BookDetails.html?bookId=${book.id}">
                    <img src="${cover}" alt="${book.title}" class="w-full h-auto rounded mb-2">
                </a>
                <h3 class="text-lg font-bold">${truncatedTitle}</h3>
                <p class="text-gray-600">${book.authors[0]?.name || 'Unknown Author'}</p>
                <span class="wishlist-icon cursor-pointer" onclick="toggleWishlist(${book.id}, event)">
                    ${isWishlisted ? '<span class="material-icons">favorite</span>' : '<span class="material-icons">favorite_border</span>'}
                </span>
            </div>
        `;

        bookList.innerHTML += bookCard;
    });
}

// Populate genre dropdown with sorted genres
function populateGenreDropdown(books) {
    const genreDropdown = document.getElementById('genreDropdown');
    const uniqueGenres = new Set();

    books.forEach(book => {
        book.subjects.forEach(subject => uniqueGenres.add(subject));
    });

    const sortedGenres = Array.from(uniqueGenres).sort();
    genreDropdown.innerHTML = '';

    sortedGenres.forEach(genre => {
        const genreItem = document.createElement('li');
        genreItem.innerHTML = `<a href="#" class="dropdown-link" onclick="filterByGenre('${genre}')">${genre.slice(0, 15)}</a>`;
        genreDropdown.appendChild(genreItem);
    });
}

// Filter books by selected genre
function filterByGenre(genre) {
    genreFilter = genre;
    fetchBooks(1, searchQuery, genreFilter, authorYearStart, authorYearEnd, copyrightFilter, idsFilter, languagesFilter, mimeTypeFilter, sortFilter);
}

// Handle pagination
function handlePagination(next, previous) {
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');

    nextBtn.disabled = !next;
    prevBtn.disabled = !previous;

    // Optionally hide pagination if both buttons are disabled
    if (!next && !previous) {
        document.getElementById('pagination').style.display = 'none'; 
    }
}
// Search functionality
document.getElementById('searchBar').addEventListener('input', (e) => {
    searchQuery = e.target.value;
    fetchBooks(1, searchQuery, genreFilter, authorYearStart, authorYearEnd, copyrightFilter, idsFilter, languagesFilter, mimeTypeFilter, sortFilter);
});

// Wishlist functionality
function toggleWishlist(bookId, event) {
    event.stopPropagation();
    if (wishlist.includes(bookId)) {
        wishlist = wishlist.filter(id => id !== bookId);
    } else {
        wishlist.push(bookId);
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    fetchBooks(currentPage, searchQuery, genreFilter, authorYearStart, authorYearEnd, copyrightFilter, idsFilter, languagesFilter, mimeTypeFilter, sortFilter);
}

// Pagination buttons
document.getElementById('nextBtn').addEventListener('click', () => {
    currentPage++;
    fetchBooks(currentPage, searchQuery, genreFilter, authorYearStart, authorYearEnd, copyrightFilter, idsFilter, languagesFilter, mimeTypeFilter, sortFilter);
    document.getElementById('currentPage').textContent = currentPage;
});

document.getElementById('prevBtn').addEventListener('click', () => {
    currentPage--;
    fetchBooks(currentPage, searchQuery, genreFilter, authorYearStart, authorYearEnd, copyrightFilter, idsFilter, languagesFilter, mimeTypeFilter, sortFilter);
    document.getElementById('currentPage').textContent = currentPage;
});

// Additional filters functionality
document.getElementById('authorYearStart').addEventListener('input', (e) => {
    authorYearStart = e.target.value;
    fetchBooks(1, searchQuery, genreFilter, authorYearStart, authorYearEnd, copyrightFilter, idsFilter, languagesFilter, mimeTypeFilter, sortFilter);
});

document.getElementById('authorYearEnd').addEventListener('input', (e) => {
    authorYearEnd = e.target.value;
    fetchBooks(1, searchQuery, genreFilter, authorYearStart, authorYearEnd, copyrightFilter, idsFilter, languagesFilter, mimeTypeFilter, sortFilter);
});

document.getElementById('copyrightFilter').addEventListener('change', (e) => {
    copyrightFilter = e.target.value;
    fetchBooks(1, searchQuery, genreFilter, authorYearStart, authorYearEnd, copyrightFilter, idsFilter, languagesFilter, mimeTypeFilter, sortFilter);
});

document.getElementById('idsFilter').addEventListener('input', (e) => {
    idsFilter = e.target.value;
    fetchBooks(1, searchQuery, genreFilter, authorYearStart, authorYearEnd, copyrightFilter, idsFilter, languagesFilter, mimeTypeFilter, sortFilter);
});

document.getElementById('languagesFilter').addEventListener('input', (e) => {
    languagesFilter = e.target.value;
    fetchBooks(1, searchQuery, genreFilter, authorYearStart, authorYearEnd, copyrightFilter, idsFilter, languagesFilter, mimeTypeFilter, sortFilter);
});

document.getElementById('mimeTypeFilter').addEventListener('input', (e) => {
    mimeTypeFilter = e.target.value;
    fetchBooks(1, searchQuery, genreFilter, authorYearStart, authorYearEnd, copyrightFilter, idsFilter, languagesFilter, mimeTypeFilter, sortFilter);
});

document.getElementById('sortFilter').addEventListener('change', (e) => {
    sortFilter = e.target.value;
    fetchBooks(1, searchQuery, genreFilter, authorYearStart, authorYearEnd, copyrightFilter, idsFilter, languagesFilter, mimeTypeFilter, sortFilter);
});

// Initial fetch
fetchBooks();
