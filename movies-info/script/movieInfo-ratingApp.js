const apiKey = "df8a5ba85307f27856548f3e6a6790b0";
const baseURL = "https://api.themoviedb.org/3";
let movieData = [];
let searchMovieData = [];


async function fetchMovies() {
  try{
  const response = await fetch(`${baseURL}/movie/popular?api_key=${apiKey}`);
  const data= await response.json();
  if (!data.results) {
    throw new Error("Invalid API response. No results found.");
  }
  console.log(data);
  movieData = data.results;
  const suggestedMovies = suggestedMovieInfo();  
  localStorage.setItem('suggestedMovies', JSON.stringify(suggestedMovies)); 

  displayMovies(suggestedMovies); 
  } catch (error) {
    document.querySelector('.movieCard-container').innerHTML = `error fetching movies: ${error}`;
  }
}

function suggestedMovieInfo() {
  return movieData.map(movie => ({
    id: movie.id,
    title: movie.title,
    description: movie.overview, 
    rating: movie.vote_average ? movie.vote_average.toFixed(1) : "N/A", 
    imageUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "default-image.jpg",
    releaseDate: movie.release_date || "Unknown",
    popularity: movie.popularity.toFixed(2),
    vote: movie.vote_count,
    backdropUrl:  movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
    : "images/no-poster-available.jpg"
  }));
}

document.addEventListener("DOMContentLoaded", fetchMovies);

function displayMovies(movies) {
  let moviesHTML = movies.map(movie => `
    <div class="movie-card">
      <div class="image-container">
        <a class="info-link" href="info-page.html"  data-id="${movie.id}" target="_self">
          <img class="movie-poster" src="${movie.imageUrl}" alt="${movie.title}">
        </a>
      </div>
      <div class="title-container">
        <a class="info-link" href="info-page.html"  data-id="${movie.id}" target="_self">
          ${movie.title}
        </a>
      </div>
      <div class="rating-container">⭐ ${movie.rating}</div>
      <div class="releaseDate-container"> ${movie.releaseDate}</div>
    </div>
  `).join('');  

  document.querySelector('.movieCard-container').innerHTML = moviesHTML;

  document.querySelectorAll('.info-link').forEach(link => {
    link.addEventListener('click', (event) => {
      const movieId = event.currentTarget.dataset.id;
      localStorage.setItem('selectedMovieId', movieId);
      localStorage.removeItem('searchSelectedMovieId'); 
    });
  });
}

document.querySelector('.search-icon-button').addEventListener('click', () => {
  const movieName = document.querySelector('.input-text').value;
  if (movieName) {
    fetchSearchMovies(movieName);
    document.querySelector('.searched-container').classList.add('searched-container-add');
    document.querySelector('.header-searched').classList.add('header-searched-add');
  }
});


async function fetchSearchMovies(movieName) {
  const url =  `${baseURL}/search/movie?query=${encodeURIComponent(movieName)}&api_key=${apiKey}`;

  try{
    const response = await fetch(url);
    const data = await response.json();

    if (data.results.length > 0){
      searchMovieData = data.results;
      const searchedMovies = searchedMovieInfo();  
      localStorage.setItem('searchedMovies', JSON.stringify(searchedMovies)); 

      displaySearchMovies(searchedMovies); 
    }else{
      document.querySelector('.display-search-movies').innerHTML = 'Movie Not Found';
    }
  }catch (error) {
    document.querySelector('.display-search-movies').innerHTML = 'Error Fetching the Movie Check the console for more details';
    console.error('error fetchig movie:', error);
  }
}

function searchedMovieInfo() {
  return searchMovieData.map(movie => ({
    id: movie.id,
    title: movie.title,
    description: movie.overview, 
    rating: movie.vote_average ? movie.vote_average.toFixed(1) : "0.0",
    imageUrl: movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : "images/no-poster-available.jpg",
    releaseDate: movie.release_date || "Unknown", 
    popularity: movie.popularity.toFixed(2),
    vote: movie.vote_count,
    backdropUrl:  movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
    : "images/no-poster-available.jpg"
  }));
}

function displaySearchMovies(movies) {
  let moviesHTML = movies.map(movie =>
   `
    <div class="movie-card">
      <div class="image-container">
        <a class="info-link" href="info-page.html"  data-id="${movie.id}" target="_self">
          <img class="movie-poster" src="${movie.imageUrl}" alt="${movie.title}">
        </a>
      </div>
      <div class="title-container">
        <a class="info-link" href="info-page.html"  data-id="${movie.id}" target="_self">
          ${movie.title}
        </a>
      </div>
      <div class="rating-container">⭐ ${movie.rating}</div>
      <div class="releaseDate-container"> ${movie.releaseDate}</div>
    </div>
    `).join('');

    document.querySelector('.display-search-movies').innerHTML = moviesHTML;

    document.querySelectorAll('.info-link').forEach(link => {
      link.addEventListener('click', (event) => {
        const movieId = event.currentTarget.dataset.id;
        localStorage.setItem('searchSelectedMovieId', movieId);
        localStorage.removeItem('selectedMovieId');
});
});
}
  






