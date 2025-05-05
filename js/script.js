const global = {
    currentPage: window.location.pathname
};

//Fetch Data from TMDB API
async function fetchAPIData(endpoint) {
    showSpinner();
    const API_URL = "https://api.themoviedb.org/3/";

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NWQ4YTk2NThjOTRkNThmYzE4MTdjMTJjNWYzNDcxZSIsIm5iZiI6MTc0NjMyNjcyMi4wODQsInN1YiI6IjY4MTZkNGMyNWFlMmYzYjhiOThiNjM4ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.eF4hrLblatBxN6rZ5OuV7MX2wjkXjL-04UcN5pr5TE8'
        }
    };

    const URL = `${API_URL}${endpoint}${endpoint.includes("?") ? "&" : "?"}language=en-US`;

    const response = await fetch(URL, options);

    const data = await response.json();
    hideSpinner();
    return data;
}

// Display 20 most popular movies
async function displayPopularMovies() {
    const popularMoviesDiv = document.querySelector("#popular-movies");
    // There is an array inside the response object called results
    // so the curly braces { results } grabs that array
    const { results } = await fetchAPIData("movie/popular");
    // Adds the movie card to the card list
    results.forEach(movie => popularMoviesDiv.appendChild(createCard(movie, "movie")));
}

// Display 20 most popular shows
async function displayPopularShows() {
    const popularShowsDiv = document.querySelector("#popular-shows");
    // There is an array inside the response object called results
    // so the curly braces { results } grabs that array
    const { results } = await fetchAPIData("trending/tv/week");
    // Adds the movie card to the card list
    results.forEach(show => popularShowsDiv.appendChild(createCard(show, "tv")));
}

// Create either a movie or tv show card
function createCard(result, type) {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");

    // -> Link is a child of cardDiv
    const link = document.createElement("a");
    link.href = `${type}-details.html?id=${result.id}`;
    // ->-> img is a child of link
    const img = document.createElement("img");
    img.src = result.poster_path
        ? `https://image.tmdb.org/t/p/w500${result.poster_path}`
        : "images/no-image.jpg";
    img.classList.add("card-img-top");
    img.alt = "Movie/Show Poster";
    link.appendChild(img);

    // -> This card-body div is a child of card div
    const bodyDiv = document.createElement("div");
    bodyDiv.classList.add("card-body");

    // ->-> This h5 is a child of bodyDiv
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = type === "movie" ? result.title : result.name;

    // ->-> This p is a child of bodyDiv
    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    // ->->-> This small is a child of cardText
    const releaseDate = document.createElement("small");
    releaseDate.classList.add("text-muted");
    releaseDate.textContent = type === "movie" ? `Release Date: ${result.release_date}` : `Aired: ${result.first_air_date}`;
    cardText.appendChild(releaseDate);

    bodyDiv.appendChild(cardTitle);
    bodyDiv.appendChild(cardText);

    cardDiv.appendChild(link);
    cardDiv.appendChild(bodyDiv);

    return cardDiv;
}

function showSpinner() {
    document.querySelector(".spinner").classList.add("show");
}

function hideSpinner() {
    document.querySelector(".spinner").classList.remove("show");
}

// Highlight active link
function highlightActiveLink() {
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
        if (link.getAttribute("href") === global.currentPage) {
            link.classList.add("active");
        }
    })
}

//Init App
function init() {
    // Check what page we are on
    switch (global.currentPage) {
        case "/":
        case "/index.html":
            displayPopularMovies();
            break;
        case "/shows.html":
            displayPopularShows();
            break;
        case "/movie-details.html":
            console.log("Movie Details");
            break;
        case "/tv-details.html":
            console.log("TV Details");
            break;
        case "/search.html":
            console.log("Search");
            break;
    }

    highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);