const global = {
    currentPage: window.location.pathname,
    search: {
        term: "",
        type: "",
        page: 1,
        totalPages: 1,
        totalResults: 0
    }
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

async function fetchSearchAPIData() {
    showSpinner();
    const API_URL = "https://api.themoviedb.org/3/";

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NWQ4YTk2NThjOTRkNThmYzE4MTdjMTJjNWYzNDcxZSIsIm5iZiI6MTc0NjMyNjcyMi4wODQsInN1YiI6IjY4MTZkNGMyNWFlMmYzYjhiOThiNjM4ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.eF4hrLblatBxN6rZ5OuV7MX2wjkXjL-04UcN5pr5TE8'
        }
    };

    const URL = `${API_URL}search/${global.search.type}?query=${global.search.term}&language=en-US&page=${global.search.page}`;

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
    });

    document.addEventListener("DOMContentLoaded", initSwiper());
}

function initSwiper() {

    const swiper = new Swiper(".swiper", {
        slidesPerView: 1,
        preventClicks: true,
        preventClicksPropagation: true,
        spaceBetween: 30,
        freeMode: true,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false
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
    });
}

// Display Search Results
async function search() {
    const searchCardsDiv = document.querySelector("#search-results");
    // The type is already initialised in changSearchType
    // The search term is also initialised in changeSearchType
    const { results, total_pages, page, total_results } = await fetchSearchAPIData();

    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

    const searchHeading = document.querySelector("#search-results-heading h2");
    if (total_results !== 0) {
        searchHeading.textContent = `${results.length} of ${global.search.totalResults} Results for "${global.search.term}"`;
    } else {
        searchHeading.textContent = `No Results Found for "${global.search.term}"`;
    }


    results.forEach(result => searchCardsDiv.appendChild(createCard(result, `${global.search.type}`)));

    displayPagination();
}

// Create and Display Pagination for Search
function displayPagination() {
    const pageCounter = document.querySelector(".page-counter");
    pageCounter.textContent = `Page ${global.search.page} of ${global.search.totalPages}`;

    // Disable buttons
    if (global.search.page === 1) {
        document.querySelector("#prev").style.display = "none";
    } else {
        document.querySelector("#prev").style.display = "";
    }
    if (global.search.page === global.search.totalPages) {
        document.querySelector("#next").style.display = "none";
    } else {
        document.querySelector("#next").style.display = "";
    }
}

function setupPaginationControls() {
    const prev = document.querySelector("#prev");
    const next = document.querySelector("#next");

    prev.addEventListener("click", async () => {
        if (global.search.page > 1) {
            global.search.page--;
            clearSearchResults();
            await search();
        }
    });

    next.addEventListener("click", async () => {
        if (global.search.page < global.search.totalPages) {
            global.search.page++;
            clearSearchResults();
            await search();
        }
    });
}

function clearSearchResults() {
    document.querySelector("#search-results").replaceChildren();
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

async function displayCast(type) {
    const actorList = document.querySelector(".actors");
    const mediaId = window.location.search.split("=")[1];

    const credits = await fetchAPIData(`${type}/${mediaId}/credits`);

    credits.cast.forEach((actor) => actorList.appendChild(createCastCard(actor)));
}

function createCastCard(actor) {
    const actorCard = document.createElement("li");
    actorCard.classList.add("actor-card");

    //-> This link goes actorCard
    const link = document.createElement("a");
    link.href = `https://www.themoviedb.org/person/${actor.id}`;
    link.target = "_blank";

    //->-> This div goes in the link
    const imgDiv = document.createElement("div");
    imgDiv.classList.add("actor-img");
    //->->-> This image goes in the imgDiv
    const actorImage = document.createElement("img");
    if (actor.profile_path) {
        actorImage.src = `https://media.themoviedb.org/t/p/w500${actor.profile_path}`;
    } else {
        actorImage.src = "images/no-image.jpg";
    }
    actorImage.alt = "Cast Image";
    imgDiv.appendChild(actorImage);

    //->-> This div goes in the link
    const infoDiv = document.createElement("div");
    infoDiv.classList.add("actor-info");
    //->->-> Both p's goes in the infoDiv
    const name = document.createElement("p");
    name.classList.add("actor-name");
    name.textContent = actor.name;
    const character = document.createElement("p");
    character.classList.add("character-name");
    character.textContent = actor.character;
    infoDiv.appendChild(name);
    infoDiv.appendChild(character);

    link.appendChild(imgDiv);
    link.appendChild(infoDiv)

    actorCard.appendChild(link);

    return actorCard;
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

function changeSearchType() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const input = document.querySelector("#search-term");
    if (urlParams.has("movie-search-term")) {
        // Sets the search type and term
        global.search.type = "movie";
        global.search.term = urlParams.get("movie-search-term");
        input.name = "movie-search-term";
        input.placeholder = "Enter Movie Name";
    }
    if (urlParams.has("tv-search-term")) {
        global.search.type = "tv";
        global.search.term = urlParams.get("tv-search-term");
        input.name = "tv-search-term";
        input.placeholder = "Enter Show Name";
    }
}

function backToSearchButton() {
    const button = document.querySelector(".back a");
    // Checks if the previous page is search.html
    const referrer = document.referrer;

    if (referrer.includes("search.html")) {
        button.textContent = "Back To Search Results"
    }
}

function showSearchAlert() {
    const inputBox = document.querySelector("#search-term");
    const inputButton = document.querySelector(".search-flex button");
    inputBox.value = "Please Enter a Valid Search Term!";
    inputBox.style.color = "red";
    inputBox.disabled = true;
    inputButton.disabled = true;

    setTimeout(() => {
        inputBox.value = "";
        inputBox.style.color = "#fff";
        inputBox.disabled = false;
        inputButton.disabled = false;
    }, 3000);
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
        // Highlight movies or tv shows link when searching
        if (link.textContent.includes("Movies") && urlParams.has("movie-search-term")) {
            link.classList.add("active");
        }
        if (link.textContent.includes("Shows") && urlParams.has("tv-search-term")) {
            link.classList.add("active");
        }
    })

}

//Init App
function init() {
    const page = global.currentPage;
   
    if (["/", "/index.html"].includes(page)) {
        addSearchlistener();
        displayPopularMovies();
        displaySlider("movie");
    } else if (page.includes("shows")) {
        addSearchlistener();
        displayPopularShows();
        displaySlider("tv");
    } else if (page.includes("movie-details")) {
        displayMovieDetails();
        backToSearchButton();
        displayCast("movie");
    } else if (page.includes("tv-details")) {
        displayShowDetails();
        backToSearchButton();
        displayCast("tv");
    } else if (page.includes("search")) {
        addSearchlistener();
        changeSearchType();
        search();
        setupPaginationControls();
    }
   
    highlightActiveLink();
  }

document.addEventListener("DOMContentLoaded", init);

function addSearchlistener() {
    document.querySelector(".search-form").addEventListener("submit", (e) => {
        const input = document.querySelector("#search-term");
        if (input.value === "" || input.value === null || input.style.color === "red") {
            e.preventDefault();
            showSearchAlert();
        }
    });
}
