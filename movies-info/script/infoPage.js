document.addEventListener('DOMContentLoaded', () => {
  const movieId = localStorage.getItem('selectedMovieId');
  const searchMovieId = localStorage.getItem('searchSelectedMovieId');
  const suggestedMovies = JSON.parse(localStorage.getItem('suggestedMovies'));
  const searchedMovies = JSON.parse(localStorage.getItem('searchedMovies'));

  let movie = ""; 
  if (movieId) {
    movie = suggestedMovies.find(m => m.id == movieId);
  } else if (searchMovieId) {
    movie = searchedMovies.find(m => m.id == searchMovieId);
  }

  if (!movie) {
    document.querySelector('.information-container').innerHTML = "Movie not found in saved data.";
    return;
  }

  const html = `
    <div style="
       background-image: url('${movie.backdropUrl}');
       background-size: cover;
       background-repeat: no-repeat;
       background-position: center;
       height: 100%;
       width:100%;
       margin: 0;
       padding: 0; 
      ;">
    <div class="up-info-card">
      <img src="${movie.imageUrl}" alt="${movie.title}" class="search-info-poster">
      
      <div class="middle-info-card">
        <div class="search-info-title">${movie.title}</div>
        <div class="vote-pop">
          <div class="vote-pop">
            <span class="vote">${movie.vote}</span>
          <img class="vote-icon" src="images/vote.png">
          </div>
          <div class="vote-pop">
            <span class="search-info-popularity">${movie.popularity}</span>
            <img class="pop-icon" src="images/popularity.png">
          </div>
        </div>

        <div class="rating">
          <span class="search-info-rating">${movie.rating}</span>
          <img src="images/stars.png" class="stars-icon">
        </div>
        <div class="search-info-date">${movie.releaseDate}</div>
      </div>
    </div>

    <div class="down-info-card">
      <p class="search-info-description">
        <strong>Description:</strong> ${movie.description}
      </p>
    </div>
    </div>
  `;

  document.querySelector('.information-container').innerHTML = html;
});
