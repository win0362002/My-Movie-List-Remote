const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const MOVIES_PER_PAGE = 12

let dispalyCard = 1
const movies = []
let filteredMovies = []
let currentPageMovies = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const displayList = document.querySelector('.display-list')
const displayCard = document.querySelector('.display-card')

//Render movie list by card format
function renderMovieListByCard(data) {
  currentPageMovies = data
  let htmlContent = ``

  data.forEach(item => {
    htmlContent += `
      <div class="col-sm-3">
        <div class="mb-2">
          <div class="card"">
            <img src="${POSTER_URL + item.image}"
            class="card-img-top" alt="Movie Poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal"
                data-target="#movie-modal" data-id=${item.id}>More</button>
              <button class="btn btn-info btn-add-favorite" data-id=${item.id}>+</button>
            </div>
          </div>
        </div>
      </div>
  `
  })

  dataPanel.innerHTML = htmlContent
}

//Render movie list by list format
function renderMovieListByList(data) {
  currentPageMovies = data
  let htmlContent = ``

  data.forEach(item => {
    htmlContent += `
    <div class="row list d-flex border-top justify-content-between align-items-center w-100 mx-5">
      <h5 class="card-title">${item.title}</h5>
      <div class="mr-5">
        <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id=${item.id}>More</button>
        <button class="btn btn-info btn-add-favorite" data-id=${item.id}>+</button>  
      </div>      
    </div>
  `
  })
  dataPanel.innerHTML = htmlContent
}

//Render paginator
function renderPaginator(amount) {
  //Calculate total page number
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)

  let htmlContent = ''
  for (let page = 1; page <= numberOfPages; page++) {
    htmlContent += `
    <li class="page-item"><a class="page-link" href="#">${page}</a></li>
    `
  }
  paginator.innerHTML = htmlContent
}

function getMoviesByPage(page) {
  //Check if there is any element in filtered movies
  //If yes, set source data from filtered movies
  //If not, set source data from orignal movie data(movies)
  const data = filteredMovies.length ? filteredMovies : movies

  //Calculate start movie index by input page index
  const startMoiveIndex = (MOVIES_PER_PAGE * (page - 1))

  //Get target movies by slice method and return
  return data.slice(startMoiveIndex, startMoiveIndex + MOVIES_PER_PAGE)
}

//Create movie modal content
function showMovieModal(id) {
  const title = document.querySelector('#movie-modal-title')
  const image = document.querySelector('#movie-modal-image')
  const date = document.querySelector('#movie-modal-date')
  const description = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL + id).then(response => {
    data = response.data.results
    title.innerText = data.title
    image.innerHTML = `
    <img src="${POSTER_URL + data.image}" alt="movie-poster" class="fluid">
    `
    date.innerText = 'release data:' + data.release_date
    description.innerText = data.description
  })
}

//Add movie to favorite list
function addFavoriteMovies(id) {
  //Check if there is favorite movies been stored in local storage
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []

  //Find favorite movie data
  const movie = movies.find(movie => movie.id === id)

  //Check if input id is already in favorite list by some method
  if (list.some(movie => movie.id === id)) {
    return alert('This movie is already in favorite list!!')
  }

  //Push favorite movie to favorite movie list
  list.push(movie)

  //Store in local storage
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

//Event listener for showing movie modal or add to favorite
dataPanel.addEventListener('click', function onPannelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addFavoriteMovies(Number(event.target.dataset.id))
  }
})

//Event listener for searching specific movie
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  //Find all movies which including keyword by filter and includes method
  filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(keyword))

  //Show alert information if can't find any result and return
  if (filteredMovies.length === 0) {
    return alert('Cannot find movies with keyword : ' + keyword)
  }

  //Render movie list and paginator by searching result
  renderMovieListByCard(getMoviesByPage(1))
  renderPaginator(filteredMovies.length)
})

//Event listener for rendering specific movies by paginator
paginator.addEventListener('click', function renderMovieListByPage(event) {
  if (event.target.tagName !== 'A') return

  const pageIndex = Number(event.target.innerText)
  if (dispalyCard) {
    renderMovieListByCard(getMoviesByPage(pageIndex))
  } else {
    renderMovieListByList(getMoviesByPage(pageIndex))
  }

})

//Event listener for changing movie list to list format
displayList.addEventListener('click', () => {
  dispalyCard = 0
  renderMovieListByList(currentPageMovies)
})

//Event listener for changing movie list to card format
displayCard.addEventListener('click', () => {
  dispalyCard = 1
  renderMovieListByCard(currentPageMovies)
})

//Get origianl movie data by axios and render movie list and paginator
axios.get(INDEX_URL).then(response => {
  movies.push(...response.data.results)
  renderMovieListByCard(getMoviesByPage(1))
  renderPaginator(movies.length)
})
