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
        <h2>${movieDetail.Title} (${movieDetail.Year})</h2>
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

//duplicate autocomplete component config
createAutoComplete({
    root: document.querySelector(".autocomplete"),
    renderOption: (movie) => {
        //if no image is available. Dont show 
        const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
        return `
        <img  src="${imgSrc}"/>
        ${movie.Title}
        (${movie.Year})
        `
    },
    //What happens when selection of movie is made
    onOptionSelect(movie) {
        onMovieSelect(movie)
    },
    //return value in input
    inputValue(movie) {
        return movie.Title;
    },

    //fetching data
    async fetchData(searchTerm) {
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
})



//once person has selected movie from drop down
const onMovieSelect = async movie => {
    //follow up query based on individual ID 
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "f0d20119",
            i: movie.imdbID
        }

    });
    console.log(response.data)
    document.querySelector("#summary").innerHTML = movieTemplate(response.data)
}