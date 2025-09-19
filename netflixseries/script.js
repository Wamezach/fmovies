const genres = [
  { id: 10759, name: "Action & Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 10762, name: "Kids" },
  { id: 9648, name: "Mystery" },
  { id: 10763, name: "News" },
  { id: 10764, name: "Reality" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 10766, name: "Soap" },
  { id: 10767, name: "Talk" },
  { id: 10768, name: "War & Politics" },
  { id: 37, name: "Western" }
];
const main = document.getElementById("main");
const form = document.getElementById("form");
const searchInput = document.getElementById("search");
const tagsEl = document.getElementById("tags");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const current = document.getElementById("current");
const autocompleteList = document.getElementById("autocomplete-list");
let currentPage = 1;
let nextPage = 2;
let prevPage = 0;
let lastUrl = '';
let totalPages = 100;
let selectedGenre = [];

setGenre();
getMovies("https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&api_key=9a134c87182ea691afbebbf099bea806");

function setGenre() {
  tagsEl.innerHTML = '';
  genres.forEach(genre => {
    const tag = document.createElement("div");
    tag.classList.add("tag");
    tag.id = genre.id;
    tag.innerText = genre.name;
    tag.addEventListener("click", () => {
      if (selectedGenre.includes(genre.id)) {
        selectedGenre = selectedGenre.filter(id => id !== genre.id);
      } else {
        selectedGenre.push(genre.id);
      }
      let url = "https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&api_key=9a134c87182ea691afbebbf099bea806";
      if (selectedGenre.length > 0) {
        url += "&with_genres=" + encodeURIComponent(selectedGenre.join(','));
      }
      getMovies(url);
      highlightSelection();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    tagsEl.appendChild(tag);
  });
}

function highlightSelection() {
  const tags = document.querySelectorAll(".tag");
  tags.forEach(tag => tag.classList.remove("highlight"));
  selectedGenre.forEach(id => {
    const tag = document.getElementById(id);
    if (tag) tag.classList.add("highlight");
  });
  clearBtn();
}

function clearBtn() {
  let clear = document.getElementById("clear");
  if (!clear) {
    clear = document.createElement("div");
    clear.classList.add("tag", "highlight");
    clear.id = "clear";
    clear.innerText = "Clear x";
    clear.addEventListener("click", () => {
      selectedGenre = [];
      setGenre();
      getMovies("https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&api_key=9a134c87182ea691afbebbf099bea806");
    });
    tagsEl.appendChild(clear);
  } else {
    clear.classList.add("highlight");
  }
}

function getMovies(url) {
  lastUrl = url;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.results.length > 0) {
        showMovies(data.results);
        currentPage = data.page;
        nextPage = currentPage + 1;
        prevPage = currentPage - 1;
        totalPages = data.total_pages;
        current.innerText = currentPage;
        prev.classList.toggle("disabled", currentPage <= 1);
        next.classList.toggle("disabled", currentPage >= totalPages);
      } else {
        main.innerHTML = "<h1 class=\"no-results\">No Results Found</h1>";
      }
    })
    .catch(() => {
      main.innerHTML = "<h1 class=\"no-results\">Error fetching data</h1>";
    });
}

function showMovies(movies) {
  main.innerHTML = '';
  movies.forEach(show => {
    const title = show.name || show.title;
    const poster = show.poster_path;
    const rating = show.vote_average;
    const overview = show.overview;
    const id = show.id;
    const showDiv = document.createElement("div");
    showDiv.classList.add("movie");
    showDiv.innerHTML = `
      <img src="${poster ? "https://image.tmdb.org/t/p/w500" + poster : "https://via.placeholder.com/500x750?text=No+Image"}" alt="${title}">
      <div class="movie-info">
        <h3>${title}</h3>
        <span class="${getColor(rating)}">${rating}</span>
      </div>
      <div class="overview">
        <div class="overview-text">${overview}</div>
        <button class="know-more" id="show-${id}">Watch Now</button>
      </div>
    `;
    main.appendChild(showDiv);
    showDiv.querySelector(".know-more").addEventListener("click", () => {
      openModal(show);
    });
  });
}

function getColor(rating) {
  if (rating >= 8) return "green";
  if (rating >= 5) return "orange";
  return "red";
}

const modal = document.getElementById("movieModal");
const closeButton = document.querySelector(".close-button");
const movieTitle = document.getElementById("movieTitle");
const movieOverview = document.getElementById("movieOverview");
const movieIframe = document.getElementById("movieIframe");
const modalPoster = document.getElementById("modalPoster");
const modalRating = document.getElementById("modalRating");

function getRatingClass(rating) {
  if (rating >= 8) return "high";
  if (rating >= 5) return "medium";
  return "low";
}

function openModal(show) {
  movieTitle.textContent = show.name || show.title;
  movieOverview.textContent = show.overview;
  modalPoster.src = show.poster_path 
    ? "https://image.tmdb.org/t/p/w500" + show.poster_path
    : "https://via.placeholder.com/120x180?text=No+Image";
  modalPoster.alt = show.name || show.title;
  modalRating.textContent = show.vote_average ? `⭐ ${show.vote_average}` : "No rating";
  modalRating.className = "rating-badge " + getRatingClass(show.vote_average);

  fetch(`https://api.themoviedb.org/3/tv/${show.id}/videos?api_key=9a134c87182ea691afbebbf099bea806`)
    .then(res => res.json())
    .then(() => {
      movieIframe.src = `https://vidsrc.cc/v2/embed/tv/${show.id}`;
      modal.style.display = "block";
      const server = document.getElementById("server");
      server.innerHTML = '';
      const servers = [
        { name: "Server 1", url: `https://vidsrc.cc/v2/embed/tv/${show.id}` },
        { name: "Server 2", url: `https://another-server.com/embed/${show.id}` },
        { name: "Server 3", url: `https://yetanother-server.com/embed/${show.id}` }
      ];
      servers.forEach(srv => {
        const opt = document.createElement("option");
        opt.value = srv.url;
        opt.textContent = srv.name;
        server.appendChild(opt);
      });
      server.value = servers[0].url;
      const serverClone = server.cloneNode(true);
      server.parentNode.replaceChild(serverClone, server);
      serverClone.addEventListener("change", e => {
        movieIframe.src = e.target.value;
      });
    })
    .catch(() => {
      movieIframe.src = '';
      modal.style.display = "block";
    });
}

closeButton.addEventListener("click", () => {
  modal.style.display = "none";
  movieIframe.src = '';
});

window.addEventListener("click", e => {
  if (e.target === modal) {
    modal.style.display = "none";
    movieIframe.src = '';
  }
});

form.addEventListener("submit", e => {
  e.preventDefault();
  const query = searchInput.value.trim();
  selectedGenre = [];
  setGenre();
  if (query) {
    getMovies(`https://api.themoviedb.org/3/search/tv?api_key=9a134c87182ea691afbebbf099bea806&query=${encodeURIComponent(query)}`);
  } else {
    getMovies("https://api.themoviedb.org/3/discover/tv?sort_by=popularity.desc&api_key=9a134c87182ea691afbebbf099bea806");
  }
});

prev.addEventListener("click", () => {
  if (prevPage > 0) {
    pageCall(prevPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

next.addEventListener("click", () => {
  if (nextPage <= totalPages) {
    pageCall(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

function pageCall(pageNum) {
  let urlParts = lastUrl.split('?');
  let params = urlParts[1].split('&');
  let pageIndex = params.findIndex(p => p.startsWith("page="));
  if (pageIndex === -1) {
    getMovies(lastUrl + "&page=" + pageNum);
  } else {
    params[pageIndex] = "page=" + pageNum;
    const newUrl = urlParts[0] + '?' + params.join('&');
    getMovies(newUrl);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const clearSearchBtn = document.getElementById("clearSearch");
  const search = document.getElementById("search");
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener("click", () => {
      search.value = '';
      location.reload();
    });
  }
});

function clearAutocomplete() {
  autocompleteList.innerHTML = '';
  autocompleteList.style.display = "none";
}

function renderAutocomplete(results) {
  clearAutocomplete();
  if (!results || results.length === 0) return;
  results.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("autocomplete-item");
    const img = document.createElement("img");
    img.src = item.poster_path ? "https://image.tmdb.org/t/p/w92" + item.poster_path : "https://via.placeholder.com/40x60?text=No+Img";
    img.alt = item.name || item.title;
    const span = document.createElement("span");
    span.textContent = item.name || item.title;
    div.appendChild(img);
    div.appendChild(span);
    div.addEventListener("click", () => {
      searchInput.value = item.name || item.title;
      clearAutocomplete();
      openModal(item);
    });
    autocompleteList.appendChild(div);
  });
  autocompleteList.style.display = "block";
}

let debounceTimeout;
searchInput.addEventListener("input", () => {
  const val = searchInput.value.trim();
  if (!val) {
    clearAutocomplete();
    return;
  }
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    fetch(`https://api.themoviedb.org/3/search/tv?api_key=9a134c87182ea691afbebbf099bea806&query=${encodeURIComponent(val)}`)
      .then(res => res.json())
      .then(data => {
        renderAutocomplete(data.results || []);
      })
      .catch(() => {
        clearAutocomplete();
      });
  }, 300);
});

document.addEventListener("click", e => {
  if (!autocompleteList.contains(e.target) && e.target !== searchInput) {
    clearAutocomplete();
  }
});

function toggleNav() {
  document.getElementById("navMenu").classList.toggle("active");
}