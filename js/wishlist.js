// Get references to elements
const bookList = document.getElementById('wishlistBooks');
const loader = document.getElementById('loader');
const wishlistIcon = document.getElementById('wishlistIcon');
const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Function to fetch and display the wishlisted books
async function fetchWishlistedBooks() {
    loader.style.display = 'block'; // Show the loader before fetching

    try {
        bookList.innerHTML = ''; // Clear the list before adding new books
        for (let id of wishlist) {
            const response = await fetch(`https://gutendex.com/books/?ids=${id}`);
            const data = await response.json();
            const book = data.results[0];
            const cover = book.formats['image/jpeg'];
            const readLink = book.formats['text/html'] || book.formats['text/plain'];

            // Construct the HTML for each book
            const bookCard = `
                <div class="book" data-id="${id}">
                    <img src="${cover}" alt="${book.title}" class="book-image">
                    <div class="book-info">
                        <h3>${book.title}</h3>
                        <p>${book.authors[0].name}</p>
                        <button class="read-button" onclick="window.open('${readLink}', '_blank')">Read the Book</button>
                        <span class="material-icons favorite-icon red" onclick="toggleBookWishlist(${id}, this)">favorite</span>
                    </div>
                </div>
            `;
            bookList.innerHTML += bookCard; // Append the book to the list
        }
        // Set the wishlist icon to red if on the wishlist page
        wishlistIcon.classList.add('red');
    } catch (error) {
        console.error('Error fetching books:', error);
    } finally {
        loader.style.display = 'none'; // Hide the loader after fetching
    }
}

// Function to toggle wishlist for a book
function toggleBookWishlist(id, icon) {
    const bookIndex = wishlist.indexOf(id);
    if (bookIndex > -1) {
        // Remove from wishlist
        wishlist.splice(bookIndex, 1); // Remove the book ID from the wishlist
        icon.classList.remove('red'); // Change the icon back to default
        const bookCard = icon.closest('.book');
        bookCard.remove(); // Remove the book card from the wishlist page
    } else {
        // Add to wishlist
        wishlist.push(id); // Add the book ID to the wishlist
        icon.classList.add('red'); // Change the icon to red
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist)); // Save updated wishlist
}

// Fetch books when the page loads
fetchWishlistedBooks();
