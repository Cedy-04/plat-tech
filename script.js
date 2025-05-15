const watchlistUl = document.getElementById("watchlist");
const waitinglistUl = document.getElementById("waitinglist");
const watchedlistUl = document.getElementById("watchedlist");
const messageDiv = document.getElementById("message");
const addMovieForm = document.getElementById("addMovieForm");
const movieInput = document.getElementById("movieInput");

const WATCHLIST_LIMIT = 5;

// Helper: create movie list item
function createMovieItem(name, listType) {
  const li = document.createElement("li");

  const leftGroup = document.createElement("div");
  leftGroup.className = "left-group";

  const emojiSpan = document.createElement("span");
  emojiSpan.className = "emoji-icon";

  const titleSpan = document.createElement("span");
  titleSpan.className = "movie-title";
  titleSpan.textContent = name;

  leftGroup.appendChild(emojiSpan);
  leftGroup.appendChild(titleSpan);

  const trashSpan = document.createElement("span");
  trashSpan.className = "trash-icon";
  trashSpan.textContent = "🗑️";

  li.appendChild(leftGroup);
  li.appendChild(trashSpan);

  // Click handlers
  if (listType === "watchlist") {
    // Click movie to move to watched, then promote waiting to watchlist
    li.addEventListener("click", (e) => {
      if (e.target === trashSpan) return; // skip if trash clicked
      moveWatchToWatched(li);
    });
    // Trash icon removes from watchlist and moves to watched (like clicking the movie)
    trashSpan.addEventListener("click", (e) => {
      e.stopPropagation();
      moveWatchToWatched(li);
    });
  } else if (listType === "waitinglist") {
    // Trash icon removes from waitinglist only
    trashSpan.addEventListener("click", (e) => {
      e.stopPropagation();
      removeWaiting(li);
    });
    // Clicking waiting movie does nothing
    li.addEventListener("click", (e) => e.stopPropagation());
  } else if (listType === "watchedlist") {
    // Trash icon removes from watched list
    trashSpan.addEventListener("click", (e) => {
      e.stopPropagation();
      removeWatched(li);
    });
    // Clicking watched movie does nothing
    li.addEventListener("click", (e) => e.stopPropagation());
  }

  return li;
}

function showMessage(msg) {
  messageDiv.textContent = msg;
  setTimeout(() => {
    if (messageDiv.textContent === msg) {
      messageDiv.textContent = "";
    }
  }, 3000);
}

function addMovie(name) {
  // Check for empty or duplicate (case insensitive)
  if (!name.trim()) {
    showMessage("Please enter a valid movie name.");
    return;
  }

  const nameLower = name.trim().toLowerCase();

  // Check duplicates in all lists
  const allLists = [watchlistUl, waitinglistUl, watchedlistUl];
  for (const ul of allLists) {
    for (const li of ul.children) {
      const movieName = li.querySelector(".movie-title").textContent.toLowerCase();
      if (movieName === nameLower) {
        showMessage("This movie is already in one of your lists.");
        return;
      }
    }
  }

  // Add to watchlist if under limit, else to waitinglist
  if (watchlistUl.children.length < WATCHLIST_LIMIT) {
    const li = createMovieItem(name, "watchlist");
    watchlistUl.appendChild(li);
    showMessage(`The movie "${name}" has been added to your watchlist.`);
  } else {
    const li = createMovieItem(name, "waitinglist");
    waitinglistUl.appendChild(li);
    showMessage(`The movie "${name}" has been added to your waiting list.`);
  }
}

function moveWatchToWatched(li) {
  const movieName = li.querySelector(".movie-title").textContent;

  // Remove from watchlist
  li.remove();

  // Add to watched list
  const watchedLi = createMovieItem(movieName, "watchedlist");
  watchedlistUl.appendChild(watchedLi);
  showMessage(`You watched "${movieName}". It has been moved to watched movies.`);

  // Promote first waiting movie if any
  if (waitinglistUl.children.length > 0) {
    const firstWaiting = waitinglistUl.children[0];
    const waitingMovieName = firstWaiting.querySelector(".movie-title").textContent;
    firstWaiting.remove();

    const watchLi = createMovieItem(waitingMovieName, "watchlist");
    watchlistUl.appendChild(watchLi);
    showMessage(`"${waitingMovieName}" has moved from waiting list to your watchlist.`);
  }
}

function removeWaiting(li) {
  const movieName = li.querySelector(".movie-title").textContent;
  li.remove();
  showMessage(`"${movieName}" has been removed from your waiting list.`);
}

function removeWatched(li) {
  const movieName = li.querySelector(".movie-title").textContent;
  li.remove();
  showMessage(`"${movieName}" has been removed from your watched movies.`);
}

// Form submit handler
addMovieForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const movieName = movieInput.value.trim();
  addMovie(movieName);
  movieInput.value = "";
  movieInput.focus();
});
