// Load env then initialize
importScript('../shared/env-loader.js').then(() => {
    initApp();
});

// Helper to load external script since we're not using modules everywhere yet
function importScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

const baseURL = "https://api.themoviedb.org/3";
const imageBaseURL = "https://image.tmdb.org/t/p/w500";
const backdropBaseURL = "https://image.tmdb.org/t/p/original";
let apiKey = ""; // Will be loaded

async function initApp() {
    const env = await loadEnv();
    apiKey = env.TMDB_API_KEY || "df8a5ba85307f27856548f3e6a6790b0"; // Fallback for demo
    fetchMovies('popular');
}

const moviesGrid = document.getElementById('moviesGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const loader = document.getElementById('loader');

// Modal Elements
const modal = document.getElementById('movieModal');
const closeBtn = document.querySelector('.close-btn');
const modalPoster = document.getElementById('modalPoster');
const modalTitle = document.getElementById('modalTitle');
const modalRating = document.getElementById('modalRating');
const modalOverview = document.getElementById('modalOverview');
const modalDate = document.getElementById('modalDate');
const modalBackdrop = document.querySelector('.modal-backdrop-img');

searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) fetchMovies('search', query);
});

searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) fetchMovies('search', query);
    }
});

async function fetchMovies(type, query = '') {
    if (!apiKey) return;

    loader.classList.remove('hidden');
    moviesGrid.innerHTML = ''; // Clear existing

    let url = type === 'popular'
        ? `${baseURL}/movie/popular?api_key=${apiKey}`
        : `${baseURL}/search/movie?query=${encodeURIComponent(query)}&api_key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            displayMovies(data.results);
        } else {
            moviesGrid.innerHTML = '<p class="error-msg">No movies found.</p>';
        }
    } catch (error) {
        console.error("Error:", error);
        moviesGrid.innerHTML = '<p class="error-msg">Failed to fetch data.</p>';
    } finally {
        loader.classList.add('hidden');
    }
}

function displayMovies(movies) {
    moviesGrid.innerHTML = movies.map(movie => {
        const imagePath = movie.poster_path ? imageBaseURL + movie.poster_path : 'https://via.placeholder.com/500x750?text=No+Image';
        const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

        return `
            <div class="movie-card" onclick="openModal(${movie.id})">
                <img src="${imagePath}" alt="${movie.title}" loading="lazy">
                <div class="movie-overlay">
                    <div class="movie-title">${movie.title}</div>
                    <div class="movie-rating">⭐ ${rating}</div>
                </div>
            </div>
        `;
    }).join('');
}

// Modal Logic
window.openModal = async (id) => {
    // Show modal immediately with loading state? Or fetch first?
    // Let's fetch details for high res backdrop
    try {
        const url = `${baseURL}/movie/${id}?api_key=${apiKey}`;
        const response = await fetch(url);
        const movie = await response.json();

        modalPoster.src = movie.poster_path ? imageBaseURL + movie.poster_path : 'https://via.placeholder.com/500x750';
        modalTitle.textContent = movie.title;
        modalRating.textContent = `⭐ ${movie.vote_average.toFixed(1)}`;
        modalOverview.textContent = movie.overview || "No overview available.";
        modalDate.textContent = movie.release_date ? movie.release_date.split('-')[0] : 'Unknown';

        const backdropPath = movie.backdrop_path ? backdropBaseURL + movie.backdrop_path : '';
        if (backdropPath) {
            modalBackdrop.style.backgroundImage = `url('${backdropPath}')`;
        } else {
            modalBackdrop.style.background = '#111';
        }

        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent scrolling bg
    } catch (e) {
        console.error(e);
    }
};

closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
});
