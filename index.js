//html build up for the detailed movie data
const movieTemplate = (movieDetail) => {
  //replace $ and , with empty strings
  const dollars = movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
  //turn string into number
  const metascore = parseInt(movieDetail.Metascore)
  //turn string into number w/ decimal
  const imdbRating = parseFloat(movieDetail.imdbRating)
  //turn string into number and replace comma with empty string
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""))
  //add up total number of award

  const awards = movieDetail.Awards.split(" ").reduce((prev, word) => {
    const value = parseInt(word);

    if (isNaN(value)) {
      return prev;
    } else {
      return prev + value;
    }
  }, 0)

  console.log(awards)

  return `
    <article class="media">
    <figure class="media-left">
      <p class="image">
        <img src="${movieDetail.Poster}">
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <h2>${movieDetail.Title} (${movieDetail.Year})</h2>
        <h3>${movieDetail.Genre}</h3>
        <p>${movieDetail.Plot}</p>
      </div>
    </div>
    </article>
  <article data-value=${awards} class="notification is-secondary">
    <p class="title">${movieDetail.Awards}</p>
    <p class="tag is-warning">Awards</p>
  </article>
  <article data-value=${dollars} class="notification is-secondary">
    <p class="title">${movieDetail.BoxOffice}</p>
    <p class="tag is-warning">Box Office</p>
  </article>
  <article data-value=${metascore} class="notification is-secondary">
    <p class="title">${movieDetail.Metascore}</p>
    <p class="tag is-warning">Metascore</p>
  </article>
  <article data-value=${imdbRating} class="notification is-secondary">
    <p class="title">${movieDetail.imdbRating}</p> 
    <p class="tag is-warning">IMDB Rating</p> 
  </article>
  <article data-value=${imdbVotes} class="notification is-secondary">
    <p class="title">${movieDetail.imdbVotes}</p> 
    <p class="tag is-warning">IMDB Votes</p> 
  </article>

    `
}

const autoCompleteConfig = {
  renderOption: (movie) => {
    //if no image is available. Dont show 
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    return `
        <img  src="${imgSrc}"/>
        ${movie.Title}
        (${movie.Year})
        `
  },
  //return value in input
  inputValue(movie) {
    return movie.Title;
  },

  //fetching data
  async fetchData(searchTerm) {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: config.API_KEY,
        s: searchTerm
      }
    });

    if (response.data.Error) {
      return [];
    }

    //return just the search data from the response
    return response.data.Search
  }
}

//duplicate autocomplete component config
//left search
createAutoComplete({
  ...autoCompleteConfig,
  //where to render the component to
  root: document.querySelector("#left-autocomplete"),

  //What happens when selection of movie is made
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden")
    onMovieSelect(movie, document.querySelector("#left-summary"), "left")
  },
})

//right searcg
createAutoComplete({
  ...autoCompleteConfig,
  //where to render the component to
  root: document.querySelector("#right-autocomplete"),

  //What happens when selection of movie is made
  onOptionSelect(movie) {
    document.querySelector(".tutorial").classList.add("is-hidden")
    onMovieSelect(movie, document.querySelector("#right-summary"), "right")
  },
})

//variables for storing side of search for comparison
let leftMovie;
let rightMovie;

//once person has selected movie from drop down
const onMovieSelect = async (movie, summaryElement, side) => {
  //follow up query based on individual ID 
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: config.API_KEY,
      i: movie.imdbID
    }

  });
  console.log(response.data)
  summaryElement.innerHTML = movieTemplate(response.data)

  if (side === "left") {
    leftMovie = response.data;
  } else {
    rightMovie = response.data
  }

  //make sure both right and left has filled in
  if (leftMovie && rightMovie) {
    runComparison();
  }
}


//compare both
const runComparison = () => {
  const leftSideStats = document.querySelectorAll("#left-summary .notification")
  const rightSideStats = document.querySelectorAll("#right-summary .notification")

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];
    const leftSideValue = parseInt(leftStat.dataset.value);
    const rightSideValue = parseInt(rightStat.dataset.value);

    if (rightSideValue > leftSideValue) {
      rightStat.classList.add("is-primary")
    } else {
      leftStat.classList.add("is-primary")
    }
  })
}