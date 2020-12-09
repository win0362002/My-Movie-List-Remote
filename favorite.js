const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const movies = JSON.parse(localStorage.getItem('favoriteMovies'))
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

function renderMovieList(data) {
  let rawHTML = ``

  data.forEach(item => {
    rawHTML += `
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
              <button class="btn btn-danger btn-remove-favorite" data-id=${item.id}>X</button>
            </div>
          </div>
        </div>
      </div>
  `
  })

  dataPanel.innerHTML = rawHTML
}

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

function removeMovieFromFavorite(id) {
  if (!movies) return

  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) return

  movies.splice(movieIndex, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovieList(movies)
}

dataPanel.addEventListener('click', function onPannelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeMovieFromFavorite(Number(event.target.dataset.id))
  }
})

renderMovieList(movies)
