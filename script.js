const API_KEY = "e5330b50b96fa363d7eecd41f8105b63"; // Replace with your TMDb API key
const BASE_URL = "https://api.themoviedb.org/3";

const recommendBtn = document.getElementById("recommend-btn");
const applyFiltersBtn = document.getElementById("apply-filters");

const genreSelect = document.getElementById("genre");
const yearInput = document.getElementById("year");
const ratingInput = document.getElementById("rating");

const movieDetails = document.getElementById("movie-details");
const movieTitle = document.getElementById("movie-title");
const moviePoster = document.getElementById("movie-poster");
const movieOverview = document.getElementById("movie-overview");
const movieLink = document.getElementById("movie-link");
const saveForLaterBtn = document.getElementById("save-for-later");
const savedMoviesList = document.getElementById("saved-movies-list");

const loadingSpinner = document.getElementById("loading-spinner");

// Function to fetch movies based on filters
async function fetchMovies() {
  const genre = genreSelect.value;
  const year = yearInput.value;
  const rating = ratingInput.value;

  // Build query parameters
  let query = `?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&page=1`;
  if (genre) query += `&with_genres=${genre}`;
  if (year) query += `&primary_release_year=${year}`;
  if (rating) query += `&vote_average.gte=${rating}`;

  showLoading();

  try {
    const response = await fetch(`${BASE_URL}/discover/movie${query}`);
    const data = await response.json();
    hideLoading();

    if (data.results.length > 0) {
      const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];
      displayMovie(randomMovie);
    } else {
      alert("No movies found for the selected filters. Try again!");
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
    hideLoading();
  }
}

// Function to display movie details
function displayMovie(movie) {
  movieTitle.textContent = movie.title || movie.name;
  moviePoster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  movieOverview.textContent = movie.overview || "No description available.";
  movieLink.href = `https://www.youtube.com/results?search_query=${movie.title} trailer`;
  movieDetails.classList.remove("hidden");

  // Save current movie data for later use
  saveForLaterBtn.dataset.movie = JSON.stringify(movie);
}

// Function to save movie to localStorage
function saveMovie() {
  const movie = JSON.parse(saveForLaterBtn.dataset.movie);
  const savedMovies = JSON.parse(localStorage.getItem("savedMovies")) || [];
  savedMovies.push(movie);
  localStorage.setItem("savedMovies", JSON.stringify(savedMovies));
  displaySavedMovies();
}

// Function to display saved movies
function displaySavedMovies() {
  const savedMovies = JSON.parse(localStorage.getItem("savedMovies")) || [];
  savedMoviesList.innerHTML = "";
  savedMovies.forEach(movie => {
    const li = document.createElement("li");
    li.textContent = movie.title || movie.name;
    savedMoviesList.appendChild(li);
  });
}

// Show loading spinner
function showLoading() {
  loadingSpinner.classList.remove("hidden");
  movieDetails.classList.add("hidden");
}

// Hide loading spinner
function hideLoading() {
  loadingSpinner.classList.add("hidden");
}

// Event listeners
recommendBtn.addEventListener("click", fetchMovies);
applyFiltersBtn.addEventListener("click", fetchMovies);
saveForLaterBtn.addEventListener("click", saveMovie);

// Initialize saved movies list
displaySavedMovies();
