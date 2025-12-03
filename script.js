const API_KEY = "d1fdb22551613717a622bc5adbf2893a"
const BASE_URL = "https://api.themoviedb.org/3"

async function getTrendingMovies() {
    const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`)
    const data = await res.json()
    displayMovies(data.results)
}

function displayMovies(movies) {
    const movieContainer = document.getElementById("movieContainer")
    movieContainer.innerHTML = ""

    movies.forEach(movie => {
        const div = document.createElement("div")
        div.classList.add("movie")
        div.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${moive.title}">
        <h3>${movie.title}<h3>
        `
        div.addEventListener("click", () => openMovieDetails(movie.id))
        movieContainer.appendChild(div)
    })
}