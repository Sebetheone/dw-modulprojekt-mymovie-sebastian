function getHeaders() {
    return {
        accept: "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NWRlZTI3Yzc2OWMyYjgxZTFmMWIwMjQyMDc5OGVlZCIsIm5iZiI6MTc5MDU4MjY3MC44OTIsInN1YiI6IjZhYmExZjhlYmQ0NDFkMmE5NmRkYmQ2OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1gWt6ACWDNRrNa71vPtLzBLVUIsCmKx9EnPjBaDZ9qA"
    };
}

export async function nowPlaying() {
    const response = await fetch(
        "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1",
        { headers: getHeaders() }
    );
    return response.json();
}

export async function orderPopular(page = 1) {
    const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`,
        { headers: getHeaders() }
    );
    return response.json();
}

export async function getMovie(id) {
    const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
        { headers: getHeaders() }
    );
    return response.json();
}

export async function getMovieCredits(id) {
    const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`,
        { headers: getHeaders() }
    );
    return response.json();
}

export async function getMovieVideos(id) {
    const response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
        { headers: getHeaders() }
    );
    return response.json();
}

export async function getGenreList() {
    const response = await fetch(
        "https://api.themoviedb.org/3/genre/movie/list?language=en-US",
        { headers: getHeaders() }
    );
    return response.json();
}