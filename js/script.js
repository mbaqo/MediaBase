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

// Display Slider
async function displaySlider(type) {
    const endpoint = type === "movie" ? `${type}/now_playing` : `${type}/on_the_air`
    const { results } = await fetchAPIData(endpoint);

    // Make a slide for each results
    results.forEach((result) => {
        document.querySelector(".swiper-wrapper").appendChild(createSliderCard(result, type));

        initSwiper();
    });
}

function initSwiper() {
    const swiper = new Swiper(".swiper", {
        slidesPerView: 1,
        spaceBetween: 30,
        freeMode: true,
        loop: true,
        autoplay: {
            delay: 4000
        },
        breakpoints: {
            500: {
                slidesPerView: 2
            },
            700: {
                slidesPerView: 3
            },
            1200: {
                slidesPerView: 4
            }
        }
    })
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

// Display movie details
async function displayMovieDetails() {
    // Gets the id from the query param in the URL
    const movieId = window.location.search.split("=")[1];

    const movie = await fetchAPIData(`movie/${movieId}`);

    getDetails(movie, "movie");
}

// Display show details
async function displayShowDetails() {
    // Gets the id from the query param in the URL
    const showId = window.location.search.split("=")[1];

    const show = await fetchAPIData(`tv/${showId}`);

    getDetails(show, "tv");
}

// Creates slider Card
function createSliderCard(result, type) {
    const slideDiv = document.createElement("div");
    slideDiv.classList.add("swiper-slide");

    //-> This link goes in the slideDiv class
    const detailLink = document.createElement("a");
    detailLink.href = `${type}-details.html?id=${result.id}`;
    //->-> This img goes in the detailLink
    const img = document.createElement("img");
    img.src = result.poster_path
        ? `https://image.tmdb.org/t/p/w500${result.poster_path}`
        : "images/no-image.jpg";
    img.alt = "Movie Poster";
    detailLink.appendChild(img);

    //-> This h4 (rating) goes in the slideDiv
    const h4 = document.createElement("h4");
    h4.classList.add("swiper-rating");
    //->-> This icon goes in the h4
    const starIcon = document.createElement("i");
    starIcon.classList.add("fas", "fa-star", "text-secondary");
    //->-> This span goes in the h4
    const span = document.createElement("span");
    span.textContent = `${result.vote_average.toFixed(1)} / 10`;
    h4.appendChild(starIcon);
    h4.appendChild(span);

    slideDiv.appendChild(detailLink);
    slideDiv.appendChild(h4);

    return slideDiv;
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

// Get the details of the movie or show
// type - movie or tv
function getDetails(result, type) {
    // Set the backdrop
    displayBackgroundImage(`${type}`, result.backdrop_path);

    // Set the Image
    document.querySelector(".card-img-top").src = result.poster_path
        ? `https://image.tmdb.org/t/p/w500${result.poster_path}`
        : "images/no-image.jpg";
    // Set the title
    document.querySelector("#details h2").textContent = type === "movie" ? result.title : result.name;
    // Set the ratings - round to one
    document.querySelector("#rating").textContent = `${result.vote_average.toFixed(1)} / 10`
    // Set the release Date / Air Date
    document.querySelector(".date").textContent = type === "movie" ? `Release Date: ${result.release_date}` : `Aired: ${result.first_air_date}`;
    // Set the description/overview
    document.querySelector("#overview").textContent = result.overview;
    // Set the genres
    const genreList = document.querySelector(".genre");
    result.genres.forEach((genre) => {
        const li = document.createElement("li");
        li.textContent = genre.name;
        genreList.appendChild(li);
    })
    // Set the homepage button
    document.querySelector('#details .btn').href = result.homepage;

    // For Movies: set the budget, revenue, and runtime
    if (type === "movie") {
        if (result.budget !== 0) {
            document.querySelector("#budget").textContent = `$${(result.budget.toLocaleString())}`;
        }
        if (result.revenue !== 0) {
            document.querySelector("#revenue").textContent = `$${(result.revenue.toLocaleString())}`;
        }
        document.querySelector("#runtime").textContent = result.runtime + " minutes";
    }
    // For Shows: set the num EPs, Last ep Date
    if (type === "tv") {
        document.querySelector("#episodes").textContent = result.number_of_episodes;
        document.querySelector("#lastEpisode").textContent = result.last_episode_to_air.air_date;
    }
    // Set the status
    document.querySelector("#status").textContent = result.status;
    // Set the production companies
    document.querySelector(".company").textContent = result.production_companies.map(company => company.name).join(", ");
}

function displayBackgroundImage(type, path) {
    if (path) {
        const overlayDiv = document.createElement("div");
        overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${path})`;
        overlayDiv.style.backgroundSize = "cover";
        overlayDiv.style.backgroundPosition = "center";
        overlayDiv.style.backgroundRepeat = "no-repeat";
        overlayDiv.style.height = "100%";
        overlayDiv.style.width = "100%";
        overlayDiv.style.position = "absolute";
        overlayDiv.style.top = "0";
        overlayDiv.style.left = "0";
        overlayDiv.style.zIndex = "-1";
        overlayDiv.style.opacity = 0.1;

        document.body.appendChild(overlayDiv);
    }
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

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        if (link.textContent.toLowerCase().includes(urlParams.get("type"))) {
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
            displaySlider("movie");
            break;
        case "/shows.html":
            displayPopularShows();
            displaySlider("tv");
            break;
        case "/movie-details.html":
            displayMovieDetails();
            break;
        case "/tv-details.html":
            displayShowDetails();
            break;
        case "/search.html":
            console.log("Search");
            break;
    }

    highlightActiveLink();
}

document.addEventListener("DOMContentLoaded", init);