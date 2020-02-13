const fetchData = async (searchTerm) => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "f0d20119",
            s: searchTerm
        }
    });

    if (response.data.Error) {
        return [];
    }

    //return just the search data from the response
    return response.data.Search
}

//render contents to root class in html
const root = document.querySelector('.autocomplete');
root.innerHTML = `
  <label><b>Search For a Movie</b></label>
  <input class="input" />
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results"></div>
    </div>
  </div>
`;

const input = document.querySelector("input");
const dropdown = document.querySelector(".dropdown")
const resultsWrapper = document.querySelector(".results")


const onInput = async event => {
    const movies = await fetchData(event.target.value);

    //no results are brought back, close drop down and return early with nothing
    if (!movies.length) {
        dropdown.classList.remove("is-active")
        return;
    }

    //clear search result
    resultsWrapper.innerHTML = ""

    //when we get results add them to dropdown and expand dropdown with class
    dropdown.classList.add("is-active")

    for (let movie of movies) {
        //generate option of movies
        const option = document.createElement("a");
        //if no image is available. Dont show 
        const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
        option.classList.add("dropdown-item")
        //make it tabable for a11y
        option.setAttribute("tabindex", "0")
        option.innerHTML = `
            <img  src="${imgSrc}"/>
            ${movie.Title}
            `

        //once selection has been made. Close dropdown and add exact text into input
        option.addEventListener("click", () => {
            dropdown.classList.remove("is-active")
            input.value = movie.Title;
            onMovieSelect(movie)
        })


        resultsWrapper.appendChild(option)
    }
}


//once person has selected movie from drop down
const onMovieSelect = async movie => {
    //follow up query based on individual ID 
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "f0d20119",
            i: movie.imdbID
        }
    });

    document.querySelector("#summary").innerHTML = movieTemplate(response.data)
}

//html build up for the detailed movie data
const movieTemplate = (movieDetail) => {
    return `
    <article class="media">
    <figure class="media-left">
      <p class="image">
        <img src="${movieDetail.Poster}">
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <h2>${movieDetail.Title}</h2>
        <h3>${movieDetail.Genre}</h3>
        <p>${movieDetail.Plot}</p>
      </div>
    </div>
  </article>
  <article class="notification is-secondary">
    <p class="title">${movieDetail.Awards}</p>
    <p class="subtitle">Awards</p>
  </article>
  <article class="notification is-secondary">
    <p class="title">${movieDetail.BoxOffice}</p>
    <p class="subtitle">Box Office</p>
  </article>
  <article class="notification is-secondary">
    <p class="title">${movieDetail.Metascore}</p>
    <p class="subtitle">Metascore</p>
  </article>
  <article class="notification is-secondary">
    <p class="title">${movieDetail.imdbRating}</p> 
    <p class="subtitle">IMDB Rating</p> 
  </article>
  <article class="notification is-secondary">
    <p class="title">${movieDetail.imdbVotes}</p> 
    <p class="subtitle">IMDB Votes</p> 
  </article>

    `


}







input.addEventListener("input", debounce(onInput))

//global even listener (bubbles up DOM)
document.addEventListener("click", event => {
    //if click event is anywhere but the root, close the autocomplete
    if (!root.contains(event.target)) {
        dropdown.classList.remove("is-active")
    }
})