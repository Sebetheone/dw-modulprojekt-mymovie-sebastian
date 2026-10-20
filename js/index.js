import {
    nowPlaying,
    orderPopular,
    getMovie,
    getMovieCredits,
    getMovieVideos,
    getGenreList
} from "./api.js";

const rootElm = document.querySelector("#root");

let genreMap = {};
let currentPage = 1;
let isLoadingPopular = false;
let observer = null;

function getPoster(posterPath) {
    return posterPath
        ? `https://image.tmdb.org/t/p/w500${posterPath}`
        : "https://via.placeholder.com/300x450?text=No+Image";
}

function getBackdrop(backdropPath) {
    return backdropPath ? `https://image.tmdb.org/t/p/w1280${backdropPath}` : "";
}

function getProfileImg(profilePath) {
    return profilePath
        ? `https://image.tmdb.org/t/p/w185${profilePath}`
        : "https://via.placeholder.com/100x100?text=No+Photo";
}

function formatRuntime(minutes) {
    if (!minutes) return "Unknown";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
}

function initDarkMode() {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
        document.body.classList.add("dark");
    }
}

function setupDarkModeToggle() {
    const toggle = document.querySelector("#darkMode");
    if (!toggle) return;

    toggle.checked = document.body.classList.contains("dark");

    toggle.addEventListener("change", () => {
        document.body.classList.toggle("dark", toggle.checked);
        localStorage.setItem("darkMode", toggle.checked);
    });
}

function createHeader() {
    return `
        <header class="header">
            <h1 class="logo">MyMovies</h1>
            <label class="switch">
                <input type="checkbox" id="darkMode">
                <span class="slider"></span>
            </label>
        </header>
    `;
}

function createMovieCard(movie) {
    return `
        <article class="movie-card" data-id="${movie.id}">
            <img src="${getPoster(movie.poster_path)}" alt="${movie.title}">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <p class="rating">⭐ ${movie.vote_average.toFixed(1)} /10 IMDb</p>
            </div>
        </article>
    `;
}

function createPopularMovieCard(movie) {
    const genresHTML = (movie.genre_ids || [])
        .slice(0, 3)
        .map(id => `<span>${genreMap[id] || "Genre"}</span>`)
        .join("");

    return `
        <article class="popular-movie" data-id="${movie.id}">
            <img src="${getPoster(movie.poster_path)}" alt="${movie.title}">
            <div class="popular-info">
                <h3>${movie.title}</h3>
                <p class="rating">⭐ ${movie.vote_average.toFixed(1)} /10 IMDb</p>
                <div class="genres popular-genres">${genresHTML}</div>
            </div>
        </article>
    `;
}

async function loadGenres() {
    if (Object.keys(genreMap).length === 0) {
        const data = await getGenreList();
        data.genres.forEach(g => {
            genreMap[g.id] = g.name;
        });
    }
}

async function showHome() {
    currentPage = 1;

    rootElm.innerHTML = `
        <div class="app">
            ${createHeader()}
            <main class="home">
                <section class="movie-section">
                    <div class="section-title">
                        <h2>Now Showing</h2>
                        <button class="see-more">See more</button>
                    </div>
                    <div id="nowPlaying" class="movie-row">Loading...</div>
                </section>

                <section class="movie-section popular-section">
                    <div class="section-title">
                        <h2>Popular</h2>
                        <button class="see-more">See more</button>
                    </div>
                    <div id="popular" class="popular-list"></div>
                    <div id="scrollAnchor" class="scroll-anchor"></div>
                </section>
            </main>

            <nav class="bottom-nav">
                <button>⚙</button>
                <button>♡</button>
                <button>🔖</button>
            </nav>
        </div>
    `;

    setupDarkModeToggle();

    try {
        await loadGenres();
        const nowData = await nowPlaying();
        const popularData = await orderPopular(currentPage);

        const nowElm = document.querySelector("#nowPlaying");
        const popularElm = document.querySelector("#popular");

        nowElm.innerHTML = nowData.results
            .slice(0, 10)
            .map(movie => createMovieCard(movie))
            .join("");

        popularElm.innerHTML = popularData.results
            .map(movie => createPopularMovieCard(movie))
            .join("");

        addMovieEvents();
        setupInfiniteScroll();

    } catch (error) {
        console.error(error);
        rootElm.innerHTML = `<div class="error"><h2>Something went wrong</h2></div>`;
    }
}

function setupInfiniteScroll() {
    const anchor = document.querySelector("#scrollAnchor");
    if (!anchor) return;

    if (observer) observer.disconnect();

    observer = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting && !isLoadingPopular) {
            isLoadingPopular = true;
            currentPage++;
            try {
                const popularData = await orderPopular(currentPage);
                const popularElm = document.querySelector("#popular");
                const newCardsHTML = popularData.results
                    .map(movie => createPopularMovieCard(movie))
                    .join("");
                
                popularElm.insertAdjacentHTML("beforeend", newCardsHTML);
                addMovieEvents();
            } catch (err) {
                console.error("Infinite scroll error:", err);
            } finally {
                isLoadingPopular = false;
            }
        }
    }, { threshold: 0.5 });

    observer.observe(anchor);
}

function addMovieEvents() {
    const cards = document.querySelectorAll("[data-id]");
    cards.forEach(card => {
        card.replaceWith(card.cloneNode(true));
    });

    document.querySelectorAll("[data-id]").forEach(card => {
        card.addEventListener("click", () => {
            const id = card.dataset.id;
            history.pushState({}, "", `?movie=${id}`);
            showMovieDetails(id);
        });
    });
}

async function showMovieDetails(id) {
    rootElm.innerHTML = `
        <div class="detail-page">
            <div class="detail-loading">Loading movie...</div>
        </div>
    `;

    try {
        const [movie, credits, videos] = await Promise.all([
            getMovie(id),
            getMovieCredits(id),
            getMovieVideos(id)
        ]);

        const trailer = videos.results?.find(
            v => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
        );

        const castHTML = (credits.cast || [])
            .slice(0, 6)
            .map(actor => `
                <div class="cast-person">
                    <img src="${getProfileImg(actor.profile_path)}" alt="${actor.name}" class="cast-img">
                    <span>${actor.name}</span>
                </div>
            `).join("");

        const genreBadges = (movie.genres || [])
            .map(g => `<span>${g.name}</span>`)
            .join("");

        rootElm.innerHTML = `
            <div class="detail-page">
                <div class="detail-hero" style="background-image: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.85)), url('${getBackdrop(movie.backdrop_path)}');">
                    <button id="backButton" class="back-button">←</button>
                    
                    ${trailer ? `
                        <div class="trailer-button" id="playTrailerBtn">
                            <div class="play-circle">▶</div>
                            <span>Play Trailer</span>
                        </div>
                    ` : ""}
                </div>

                <main class="detail-content">
                    <div class="detail-title-row">
                        <h1>${movie.title}</h1>
                        <button class="bookmark">♡</button>
                    </div>

                    <div class="genres">${genreBadges}</div>

                    <div class="movie-stats">
                        <div>
                            <small>Length</small>
                            <strong>${formatRuntime(movie.runtime)}</strong>
                        </div>
                        <div>
                            <small>Language</small>
                            <strong>${movie.spoken_languages?.[0]?.english_name || "English"}</strong>
                        </div>
                        <div>
                            <small>Rating</small>
                            <strong>${movie.vote_average.toFixed(1)} / 10</strong>
                        </div>
                    </div>

                    <section class="description">
                        <h2>Description</h2>
                        <p>${movie.overview || "No description available."}</p>
                    </section>

                    <section class="cast">
                        <div class="section-title" style="padding: 0 0 10px 0;">
                            <h2>Cast</h2>
                            <button class="see-more">See more</button>
                        </div>
                        <div class="cast-list">${castHTML}</div>
                    </section>
                </main>
            </div>
        `;

        document.querySelector("#backButton").addEventListener("click", () => {
            history.pushState({}, "", "index.html");
            showHome();
        });

        if (trailer) {
            document.querySelector("#playTrailerBtn").addEventListener("click", () => {
                window.open(`https://www.youtube.com/watch?v=${trailer.key}`, "_blank");
            });
        }

    } catch (error) {
        console.error(error);
        rootElm.innerHTML = `
            <div class="error">
                <h2>Could not load movie</h2>
                <button id="backButton">Go back</button>
            </div>
        `;
        document.querySelector("#backButton")?.addEventListener("click", () => {
            history.pushState({}, "", "index.html");
            showHome();
        });
    }
}

// Initialisering
initDarkMode();

const params = new URLSearchParams(window.location.search);
const movieId = params.get("movie");

if (movieId) {
    showMovieDetails(movieId);
} else {
    showHome();
}

window.addEventListener("popstate", () => {
    const currentParams = new URLSearchParams(window.location.search);
    const currentMovieId = currentParams.get("movie");

    if (currentMovieId) {
        showMovieDetails(currentMovieId);
    } else {
        showHome();
    }
});