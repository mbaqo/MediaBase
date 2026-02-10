# MediaBase

MediaBase is a responsive web application that allows users to browse, search, and view details for movies and TV shows. It leverages the TMDB (The Movie Database) API to provide real-time data on ratings, release dates, cast members, and more.

## Features

* **Now Playing Slider:** Features a "Swiper" slider to showcase movies currently in theaters and shows currently airing.
* **Popular Content:** Displays grids of popular movies and trending TV shows.
* **Search Functionality:** Allows users to search for specific movies or TV shows with pagination support.
* **Detailed Views:** Provides in-depth information including:
    * Star ratings and release dates.
    * Plot overviews and genres.
    * Cast lists with photos.
    * Production companies and official homepage links.
* **Responsive Design:** Optimized for various screen sizes with a mobile-friendly layout.

## Simple Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript (ES6+)
* **API:** [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api)
* **Libraries:**
    * [Swiper.js](https://swiperjs.com/) (for touch-enabled sliders)
    * [FontAwesome](https://fontawesome.com/) (for icons)
    * Google Fonts (Poppins)

## Project Structure

* **`index.html`**: The homepage displaying a slider of recent releases and a grid of popular movies.
* **`shows.html`**: displays currently airing shows and popular TV series.
* **`movie-details.html`** & **`tv-details.html`**: Template pages for displaying specific media details.
* **`search.html`**: Handles the display of search results and pagination.
* **`js/script.js`**: Contains all logic for routing, API fetching, DOM manipulation, and event handling.
* **`css/style.css`**: Custom styling for the application.
* **`lib/`**: Contains third-party assets like Swiper and FontAwesome.

## License

This project is for educational purposes. Data provided by [The Movie Database](https://www.themoviedb.org/).
