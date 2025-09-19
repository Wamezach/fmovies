const searchInput = document.getElementById("search");
const autocompleteList = document.getElementById("autocomplete-list");
const genres = [{
  'id': 0x1c,
  'name': "Action"
}, {
  'id': 0xc,
  'name': "Adventure"
}, {
  'id': 0x10,
  'name': "Animation"
}, {
  'id': 0x23,
  'name': "Comedy"
}, {
  'id': 0x50,
  'name': "Crime"
}, {
  'id': 0x63,
  'name': "Documentary"
}, {
  'id': 0x12,
  'name': "Drama"
}, {
  'id': 0x29ff,
  'name': "Family"
}, {
  'id': 0xe,
  'name': "Fantasy"
}, {
  'id': 0x24,
  'name': "History"
}, {
  'id': 0x1b,
  'name': "Horror"
}, {
  'id': 0x28a2,
  'name': "Music"
}, {
  'id': 0x25b0,
  'name': "Mystery"
}, {
  'id': 0x29fd,
  'name': "Romance"
}, {
  'id': 0x36e,
  'name': "Science Fiction"
}, {
  'id': 0x2a12,
  'name': "TV Movie"
}, {
  'id': 0x35,
  'name': "Thriller"
}, {
  'id': 0x2a00,
  'name': "War"
}, {
  'id': 0x25,
  'name': "Western"
}];
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const tagsEl = document.getElementById("tags");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const current = document.getElementById("current");
var currentPage = 0x1;
var nextPage = 0x2;
var prevPage = 0x3;
var lastUrl = '';
var totalPages = 0x64;
var selectedGenre = [];
setGenre();
function setGenre() {
  tagsEl.innerHTML = '';
  genres.forEach(_0x55a7e4 => {
    const _0x662fab = document.createElement("div");
    _0x662fab.classList.add("tag");
    _0x662fab.id = _0x55a7e4.id;
    _0x662fab.innerText = _0x55a7e4.name;
    _0x662fab.addEventListener("click", _0x150a22 => {
      _0x150a22.preventDefault();
      if (selectedGenre.length === 0x0) {
        selectedGenre.push(_0x55a7e4.id);
      } else if (selectedGenre.includes(_0x55a7e4.id)) {
        selectedGenre = selectedGenre.filter(_0x1a2e22 => _0x1a2e22 !== _0x55a7e4.id);
      } else {
        selectedGenre.push(_0x55a7e4.id);
      }
      getMovies("https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=9a134c87182ea691afbebbf099bea806&with_genres=" + encodeURI(selectedGenre.join(',')));
      window.scrollTo({
        'top': 0x0,
        'behavior': "smooth"
      });
      highlightSelection();
    });
    tagsEl.append(_0x662fab);
  });
}
function highlightSelection() {
  const _0x5db42e = document.querySelectorAll(".tag");
  _0x5db42e.forEach(_0x64c07 => {
    _0x64c07.classList.remove("highlight");
  });
  clearBtn();
  if (selectedGenre.length !== 0x0) {
    selectedGenre.forEach(_0x2f9bbd => {
      const _0x37f082 = document.getElementById(_0x2f9bbd);
      _0x37f082.classList.add("highlight");
    });
  }
}
function clearBtn() {
  let _0x560574 = document.getElementById("clear");
  if (_0x560574) {
    _0x560574.classList.add("highlight");
  } else {
    clear = document.createElement("div");
    clear.classList.add("tag", "highlight");
    clear.id = "clear";
    clear.innerText = "Clear x";
    clear.addEventListener("click", () => {
      selectedGenre = [];
      setGenre();
      getMovies("https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=9a134c87182ea691afbebbf099bea806");
    });
    tagsEl.append(clear);
  }
}
getMovies("https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=9a134c87182ea691afbebbf099bea806");
function getMovies(_0x1b8e9d) {
  lastUrl = _0x1b8e9d;
  fetch(_0x1b8e9d).then(_0x213937 => _0x213937.json()).then(_0x12e1dc => {
    if (_0x12e1dc.results.length !== 0x0) {
      showMovies(_0x12e1dc.results);
      currentPage = _0x12e1dc.page;
      nextPage = currentPage + 0x1;
      prevPage = currentPage - 0x1;
      totalPages = _0x12e1dc.total_pages;
      current.innerText = currentPage;
      prev.classList.toggle("disabled", currentPage <= 0x1);
      next.classList.toggle("disabled", currentPage >= totalPages);
    } else {
      main.innerHTML = "<h1 class=\"no-results\">No Results Found</h1>";
    }
  });
}
function showMovies(_0x20d5fa) {
  main.innerHTML = '';
  _0x20d5fa.forEach(_0x1cb703 => {
    const {
      title: _0x6e87cb,
      poster_path: _0x24f3c7,
      vote_average: _0x14a653,
      overview: _0xb87fd,
      id: _0x2945cc
    } = _0x1cb703;
    const _0x34b27d = document.createElement("div");
    _0x34b27d.classList.add("movie");
    _0x34b27d.innerHTML = "\n            <img src=\"" + (_0x24f3c7 ? "https://image.tmdb.org/t/p/w500" + _0x24f3c7 : "http://via.placeholder.com/1080x1580") + "\" alt=\"" + _0x6e87cb + "\">\n            <div class=\"movie-info\">\n                <h3>" + _0x6e87cb + "</h3>\n                <span class=\"" + getColor(_0x14a653) + "\">" + _0x14a653 + "</span>\n            </div>\n            <div class=\"overview\">\n                <div class=\"overview-text\">" + _0xb87fd + "</div>\n                <button class=\"know-more\" id=\"" + _0x2945cc + "\">Watch Now</button>\n            </div>\n        ";
    main.appendChild(_0x34b27d);
    document.getElementById(_0x2945cc).addEventListener("click", () => {
      openModal(_0x1cb703);
    });
  });
}
function getColor(_0x2b65bd) {
  if (_0x2b65bd >= 0x8) {
    return "green";
  } else {
    if (_0x2b65bd >= 0x5) {
      return "orange";
    } else {
      return "red";
    }
  }
}
// ... previous code remains unchanged ...

// ... previous code remains unchanged ...

const modal = document.getElementById("movieModal");
const closeButton = document.querySelector(".close-button");
const movieTitle = document.getElementById("movieTitle");
const movieOverview = document.getElementById("movieOverview");
const movieIframe = document.getElementById("movieIframe");
const modalPoster = document.getElementById("modalPoster");
const modalRating = document.getElementById("modalRating");

function getRatingClass(vote) {
  if (vote >= 8) return "high";
  if (vote >= 5) return "medium";
  return "low";
}

function openModal(_0x4fc362) {
  movieTitle.textContent = _0x4fc362.title;
  movieOverview.textContent = _0x4fc362.overview;
  modalPoster.src = _0x4fc362.poster_path 
    ? "https://image.tmdb.org/t/p/w500" + _0x4fc362.poster_path 
    : "https://via.placeholder.com/120x180?text=No+Image";
  modalPoster.alt = _0x4fc362.title;

  // Set rating
  modalRating.textContent = _0x4fc362.vote_average ? `⭐ ${_0x4fc362.vote_average}` : "No rating";
  modalRating.className = "rating-badge " + getRatingClass(_0x4fc362.vote_average);

  fetch("https://api.themoviedb.org/3/movie/" + _0x4fc362.id + "/videos?" + "api_key=9a134c87182ea691afbebbf099bea806").then(_0x2ba462 => _0x2ba462.json()).then(_0x238aeb => {
    if (_0x238aeb.results.length > 0x0) {
      movieIframe.src = "https://vidsrc.cc/v2/embed/movie/" + _0x4fc362.id;
    } else {
      movieIframe.src = '';
    }
    modal.style.display = "block";
    const _0x364dd9 = document.getElementById("server");
    _0x364dd9.innerHTML = '';
    const _0x2d99cc = [{
      'name': "Server 1",
      'url': "https://vidsrc.cc/v2/embed/movie/" + _0x4fc362.id
    }, {
      'name': "Server 2",
      'url': "https://another-server.com/embed/" + _0x4fc362.id
    }, {
      'name': "Server 3",
      'url': "https://yetanother-server.com/embed/" + _0x4fc362.id
    }];
    _0x2d99cc.forEach(_0x2d0ac5 => {
      const _0x10eff8 = document.createElement("option");
      _0x10eff8.value = _0x2d0ac5.url;
      _0x10eff8.textContent = _0x2d0ac5.name;
      _0x364dd9.appendChild(_0x10eff8);
    });
    _0x364dd9.value = _0x2d99cc[0x0].url;
    const _0x473f98 = _0x364dd9.cloneNode(true);
    _0x364dd9.parentNode.replaceChild(_0x473f98, _0x364dd9);
    _0x473f98.addEventListener("change", _0x3b68d1 => {
      movieIframe.src = _0x3b68d1.target.value;
    });
  });
}

// ... rest of the code remains unchanged ...
// ... rest of the code remains unchanged ...
closeButton.addEventListener("click", () => {
  modal.style.display = "none";
  movieIframe.src = '';
});
window.addEventListener("click", _0x567233 => {
  if (_0x567233.target === modal) {
    modal.style.display = "none";
    movieIframe.src = '';
  }
});
form.addEventListener("submit", _0x33a1df => {
  _0x33a1df.preventDefault();
  const _0x5c503c = search.value.trim();
  selectedGenre = [];
  setGenre();
  if (_0x5c503c) {
    getMovies("https://api.themoviedb.org/3/search/movie?api_key=9a134c87182ea691afbebbf099bea806&query=" + _0x5c503c).then(_0x54f823 => {
      if (!_0x54f823 || _0x54f823.length === 0x0) {
        location.reload();
      }
    });
  } else {
    location.reload();
  }
});
prev.addEventListener("click", () => {
  if (prevPage > 0x0) {
    pageCall(prevPage);
    window.scrollTo({
      'top': 0x0,
      'behavior': "smooth"
    });
  }
});
next.addEventListener("click", () => {
  if (nextPage <= totalPages) {
    pageCall(nextPage);
    window.scrollTo({
      'top': 0x0,
      'behavior': "smooth"
    });
  }
});
function pageCall(_0x141fd1) {
  let _0x42c598 = lastUrl.split('?');
  let _0x2d11f1 = _0x42c598[0x1].split('&');
  let _0x166192 = _0x2d11f1[_0x2d11f1.length - 0x1].split('=');
  if (_0x166192[0x0] !== "page") {
    let _0x104aa9 = lastUrl + "&page=" + _0x141fd1;
    getMovies(_0x104aa9);
  } else {
    _0x166192[0x1] = _0x141fd1.toString();
    let _0x5caf06 = _0x166192.join('=');
    _0x2d11f1[_0x2d11f1.length - 0x1] = _0x5caf06;
    let _0xea0e70 = _0x2d11f1.join('&');
    let _0x3eda1b = _0x42c598[0x0] + '?' + _0xea0e70;
    getMovies(_0x3eda1b);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const _0x3b6184 = document.getElementById("clearSearch");
  const _0x49d85c = document.getElementById("search");
  _0x3b6184.addEventListener("click", () => {
    _0x49d85c.value = '';
    location.reload();
  });
});
function clearAutocomplete() {
  autocompleteList.innerHTML = '';
  autocompleteList.style.display = "none";
}
function renderAutocomplete(_0x3e963b) {
  clearAutocomplete();
  if (!_0x3e963b || _0x3e963b.length === 0x0) {
    return;
  }
  _0x3e963b.forEach(_0x543bc0 => {
    const _0x4acf2f = document.createElement("div");
    _0x4acf2f.classList.add("autocomplete-item");
    const _0x21b54c = document.createElement("img");
    _0x21b54c.src = _0x543bc0.poster_path ? "https://image.tmdb.org/t/p/w92" + _0x543bc0.poster_path : "https://via.placeholder.com/40x60?text=No+Img";
    _0x21b54c.alt = _0x543bc0.title;
    const _0x1f3237 = document.createElement("span");
    _0x1f3237.textContent = _0x543bc0.title;
    _0x4acf2f.appendChild(_0x21b54c);
    _0x4acf2f.appendChild(_0x1f3237);
    _0x4acf2f.addEventListener("click", () => {
      searchInput.value = _0x543bc0.title;
      clearAutocomplete();
      openModal(_0x543bc0);
    });
    autocompleteList.appendChild(_0x4acf2f);
  });
  autocompleteList.style.display = "block";
}
let debounceTimeout;
searchInput.addEventListener("input", () => {
  const _0x2d5d53 = searchInput.value.trim();
  if (!_0x2d5d53) {
    clearAutocomplete();
    return;
  }
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    fetch("https://api.themoviedb.org/3/search/movie?api_key=9a134c87182ea691afbebbf099bea806&query=" + encodeURIComponent(_0x2d5d53)).then(_0x59bf42 => _0x59bf42.json()).then(_0x24ee08 => {
      renderAutocomplete(_0x24ee08.results || []);
    })["catch"](() => {
      clearAutocomplete();
    });
  }, 0x12c);
});
document.addEventListener("click", _0x572f6d => {
  if (!autocompleteList.contains(_0x572f6d.target) && _0x572f6d.target !== searchInput) {
    clearAutocomplete();
  }
});
function toggleNav() {
  document.getElementById("navMenu").classList.toggle("active");
}