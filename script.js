const API_KEY = "d1fdb22551613717a622bc5adbf2893a"
const BASE_URL = "https://api.themoviedb.org/3"


async function getTrendingMovies() {
    try {
        const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`)
        const data = await res.json()
        displayMovies(data.results)
    } catch (error) {
        console.log("Error loading movies", error);
    }
}

function displayMovies(movies) {
    const movieDiv = document.getElementById("movieDiv")
    movieDiv.innerHTML = ""

    movies.forEach(movie => {
        const div = document.createElement("div")
        div.classList.add("movie")
        div.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        <h3>${movie.title}<h3>
        `
        div.addEventListener("click", () => openMovieDetails(movie.id))
        movieDiv.appendChild(div)
    })
}


document.getElementById("searchInput").addEventListener("keyup", (e) => {
  if (e.target.value.length > 2) {
    searchMovies(e.target.value);
  }
});

async function searchMovies(query) {
    try {
        const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
        const data = await res.json();
        displayMovies(data.results);  
    } catch (error) {
        console.log("Error loading movies", error);
    }
}


async function openMovieDetails(id) {
    let movie, videoData, providers, trailer;

    
    try {
        const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
        movie = await res.json();
    } catch (error) {
        console.log("Error loading movie details:", error);
        return; 
    }

    
    try {
        const videoRes = await fetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`);
        videoData = await videoRes.json();
    } catch (error) {
        console.log("Error loading movie videos:", error);
        videoData = { results: [] }; 
    }

    
    try {
        const providersRes = await fetch(`${BASE_URL}/movie/${id}/watch/providers?api_key=${API_KEY}`);
        const providersData = await providersRes.json();
        providers = providersData.results?.US;
    } catch (error) {
        console.log("Error loading providers:", error);
        providers = null;
    }

    
    trailer = videoData?.results?.find(
        vid => vid.type === "Trailer" && vid.site === "YouTube"
    );

    
    const modal = document.getElementById("modal");
    const details = document.getElementById("modalDetails");

    
    let providerHTML = "<p>No streaming providers found.</p>";

    if (providers?.flatrate) {
        providerHTML = `
            <h3>Available On</h3>
            <div class="provider-list">
                ${providers.flatrate.map(p => `
                    <div class="provider">
                        <img src="https://image.tmdb.org/t/p/w45${p.logo_path}" alt="${p.provider_name}">
                        <span>${p.provider_name}</span>
                    </div>
                `).join("")}
            </div>
        `;
    }

    
    details.innerHTML = `
        <h2>${movie.title}</h2>
        <img style="width:100%" src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
        <button id="favBtn" class="fav-btn"> Add to Favorites</button>

        <p><strong>Release Date:</strong> ${movie.release_date}</p>
        <p><strong>Rating:</strong> ${movie.vote_average}</p>
        <p>${movie.overview}</p>

        ${providerHTML}

        ${trailer ? `
            <h3>Trailer</h3>
            <iframe width="100%" height="250"
                src="https://www.youtube.com/embed/${trailer.key}"
                frameborder="0" allowfullscreen>
            </iframe>
        ` : "<p>No trailer available.</p>"}
    `;

    document.getElementById("favBtn")
        .addEventListener("click", () => addToFavorites(movie));

    modal.classList.remove("hidden");
}

document.getElementById("closeModal").onclick = () => {
    document.getElementById("modal").classList.add("hidden")
}

function loadFavorites () {
    return JSON.parse(localStorage.getItem("favorites")) || []
}

function saveFavorites (list) {
    localStorage.setItem("favorites", JSON.stringify(list))
}

function addToFavorites(movie) {
    let favorites = loadFavorites()

    if (favorites.some(fav => fav.id === movie.id)) {
        alert("Already in Favorites!")
        return
    }

    favorites.push(movie)
    saveFavorites(favorites)
    alert("Added to Favorites!")
    displayFavorites()
}

function displayFavorites() {
    const container = document.getElementById("favoritesDiv")
    const favorites = loadFavorites()
    container.innerHTML = ""

    favorites.forEach(movie => {
        const div = document.createElement("div")
        div.classList.add("movie")

        div.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
        <h3>${movie.title}<h3>
        `
        div.addEventListener("click", () => openMovieDetails(movie.id))
        container.appendChild(div)
    })
}

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
})

getTrendingMovies()
displayFavorites()