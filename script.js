const API_KEY = "d1fdb22551613717a622bc5adbf2893a"
const BASE_URL = "https://api.themoviedb.org/3"

async function getTrendingMovies() {
    const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`)
    const data = await res.json()
    displayMovies(data.results)
}

function displayMovies(movies) {
    const movieDiv = document.getElementById("movieDiv")
    movieDiv.innerHTML = ""

    movies.forEach(movie => {
        const div = document.createElement("div")
        div.classList.add("movie")
        div.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${moive.title}">
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
  const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
  const data = await res.json();
  displayMovies(data.results);
}


async function openMovieDetails(id) {
  const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
  const movie = await res.json();


  const videoRes = await fetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`);
  const videoData = await videoRes.json();


  const providersRes = await fetch(`${BASE_URL}/movie/${id}/watch/providers?api_key=${API_KEY}`);
  const providersData = await providersRes.json();
  const providers = providersData.results.US; // change to your country


  const trailer = videoData.results.find(
    vid => vid.type === "Trailer" && vid.site === "YouTube"
  );


  const modal = document.getElementById("modal");
  const details = document.getElementById("modalDetails");


  let providerHTML = "<p>No streaming providers found.</p>";


  if (providers && providers.flatrate) {
    providerHTML = `
      <h3>Available On</h3>
      <div class="provider-list">
        ${providers.flatrate.map(p => `
          <div class="provider">
            <img src="https://image.tmdb.org/t/p/w45${p.logo_path}" alt="${p.provider_name}">
            <span>${p.provider_name}</span>
          </div>
        `).join('')}
      </div>
    `;
    }

      details.innerHTML = `
    <h2>${movie.title}</h2>
    <img style="width:100%" src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
    <button id="favBtn" class="fav-btn">⭐ Add to Favorites</button>


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


  document.getElementById("favBtn").addEventListener("click", () => addToFavorites(movie));
  modal.classList.remove("hidden");
}

