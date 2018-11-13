class ButtonFactory {
  constructor(type, secondary) {
    let button = document.createElement("button");
    button.innerHTML = "Add Movie";
    button.id = "Add Movie";
    button.onclick = addMovie;
    return button;
  }
}

class MovieObject {
  constructor(title, yor, rating) {
    this.title = title;
    this.yor = yor;
    this.rating = rating;
  }
}

class MovieThing {
  constructor(movieObject, index) {
    let movieLi = document.createElement("li");
    movieLi.id = movieObject.title;
    let inner = document.createElement('p');
    inner.setAttribute('class', 'movie-info')

    inner.innerHTML = "" + movieObject.title + ' (' + movieObject.yor +
      ') - Rated: ' + movieObject.rating + " ";
    movieLi.appendChild(inner)
    return movieLi;
  }
}

class PFactory {
  constructor(movieObject, type) {
    let buttonIcon = {
      "edit": "../css/icons/pencil.png",
      "delete": "../css/icons/trash.png"
    };

    let buttonValues = {
      "edit": "Edit",
      "delete": "Delete"
    };

    let buttonMethods = {
      "edit": editMovie,
      "delete": deleteMovie
    }
    let del = document.createElement('p');
    let image = document.createElement('img');
    image.setAttribute('src', buttonIcon[type])
    image.setAttribute('class', 'icon')
    del.appendChild(image)
    del.setAttribute('class', 'icon-outer')
    del.id = buttonValues[type] + "-" + movieObject.title;
    del.onclick = buttonMethods[type];
    return del;
  }
}

function editMovie() {
  let movieList = JSON.parse(sessionStorage.getItem("movieList"));
  let movie;
  for (let i = 0; i < movieList.length; i++) {
    if (movieList[i].title == this.parentNode.id) {
      movie = movieList[i];
      break;
    }
  }
  document.getElementById("title").value = movie.title;
  document.getElementById("yor").value = movie.yor;
  let rating = document.getElementById("rating");
  let options = rating.options;
  for (let i = 0; i < options.length; i++) {
    if (options[i].value == movie.rating) {
      rating.selectedIndex = i;
      break;
    }
  }
  openDialog();
  document.getElementById("save-button").setAttribute("value", movie.title);
  document.getElementById("save-button").onclick = editingMovie;
}

function addMovie() {
  openDialog();
  document.getElementById("save-button").onclick = newMovie;
}

function getInfoFromDialog() {
  let title = DOMPurify.sanitize(document.getElementById("title").value);
  let year = DOMPurify.sanitize(document.getElementById("yor").value);
  let sel = document.getElementById("rating");
  let rating = sel.options[sel.selectedIndex].value;
  return {
    "title": title,
    "year": year,
    "rating": rating
  }
}

function newMovie() {
  let movieInfo = getInfoFromDialog();
  let movieList = JSON.parse(sessionStorage.getItem("movieList"));
  movieList.push(new MovieObject(movieInfo.title, movieInfo.year, movieInfo.rating));
  sessionStorage.setItem("movieList", JSON.stringify(movieList));
  addMovies();
  closeDialog();
}

function editingMovie() {
  let movieInfo = getInfoFromDialog();
  let movieList = JSON.parse(sessionStorage.getItem("movieList"));
  for (let i = 0; i < movieList.length; i++) {
    if (movieList[i].title == this.value) {
      movieList[i].title = movieInfo.title;
      movieList[i].yor = movieInfo.year;
      movieList[i].rating = movieInfo.rating;
      break;
    }
  }
  sessionStorage.setItem("movieList", JSON.stringify(movieList));
  addMovies();
  closeDialog();
}

function clearDialog() {
  document.getElementById("yor").value = "";
  document.getElementById("title").value = "";
  document.getElementById("rating").selectedIndex = 0;
}

function openDialog() {
  document.getElementById("gray-out").hidden = false;
  document.getElementById("dialog").show();
}

function closeDialog() {
  clearDialog();
  document.getElementById("gray-out").hidden = true;
  document.getElementById("dialog").open = false;
}

function deleteMovie() {

  let movieList = JSON.parse(sessionStorage.getItem("movieList"));
  for (let i = 0; i < movieList.length; i++) {
    if (movieList[i].title == this.parentNode.id) {
      movieList.splice(i, 1);
    }
  }
  sessionStorage.setItem("movieList", JSON.stringify(movieList));
  addMovies();
}

function initializeMovies() {
  if (sessionStorage.getItem("movieList") === null) {
    sessionStorage.setItem("movieList", JSON.stringify(
      [new MovieObject("Star Wars", "1977", "PG"),
        new MovieObject("The Emperor Strikes Back", "1980", "PG"),
        new MovieObject("The Revenge of the Jedi", "1983", "PG"),
        new MovieObject("The Matrix", "1999", "R")
      ]));
  }
}

function removeMovies() {
  var myNode = document.getElementById("movies-list");
  while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
  }
}

function addMovies() {
  removeMovies();
  let movieList = JSON.parse(sessionStorage.getItem("movieList"));
  document.getElementById("buttons-n-such").innerHTML = "";
  if (!movieList.length) {
    document.getElementById("buttons-n-such").insertBefore(
      document.createTextNode("No movies currently listed "),
      document.getElementById("add"))
  }
  let button = document.createElement("button");
  button.onclick = addMovie;
  button.id = "add"
  button.innerHTML = "Add Movie"
  document.getElementById("buttons-n-such").appendChild(button)
  for (let movieObject in movieList) {
    document.getElementById("movies-list").appendChild(new MovieThing(
      movieList[movieObject], movieObject));
    document.getElementById(movieList[movieObject].title).appendChild(
      new PFactory(movieList[movieObject], "edit"))
    document.getElementById(movieList[movieObject].title).appendChild(
      document.createTextNode(" "))
    document.getElementById(movieList[movieObject].title).appendChild(
      new PFactory(movieList[movieObject], "delete"))
  }
}

function initializeEverything() {
  initializeMovies();
  addMovies();
}
