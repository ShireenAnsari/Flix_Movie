const global={

  currentPage: window.location.pathname
};
//highlight active links
function HighlightActiveLink(){
    const links=document.querySelectorAll('.nav-link');
    links.forEach((link)=>{
        if(link.getAttribute('href')===global.currentPage)
        {
            link.classList.add('active');
        }
    })
}
//display 20 most popular movies
async function displayPopularMovies(){
    const {results}=await fetchAPIData('movie/popular');
    results.forEach(movie=>{
        const div=document.createElement('div');
        div.classList.add('card');
        div.innerHTML=`
        
          <a href="movie-details.html?id=${movie.id}">
            ${
                movie.poster_path
                ?`<img
                src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                class="card-img-top"
                alt="${movie.title}"
              />`:`<img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}"
            />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release:${movie.release_date}</small>
            </p>
        `;
        document.querySelector('#popular-movies').appendChild(div);
    });
   
}
//Display Movie Details
async function Displaydetail(){
    const movieId=window.location.search.split('=')[1];
    const movie=await fetchAPIData(`movie/${movieId}`);
    const div=document.createElement('div');
    div.innerHTML=`  <div class="details-top">
    <div>
    ${
        movie.poster_path
        ?`<img
        src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
        class="card-img-top"
        alt="${movie.title}"
      />`:`<img
      src="images/no-image.jpg"
      class="card-img-top"
      alt="${movie.title}"
    />`
    }
    </div>
    <div>
      <h2>${movie.title}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
        ${movie.vote_average.toFixed(1)}
      </p>
      <p class="text-muted">Release Date:${movie.release_date}</p>
      <p>
       ${movie.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
       ${movie.genres.map((genre)=>`<li>${genre.name}</li>`).join('')}
      </ul>
      <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Budget: </span>$${addCommasTonumber(movie.budget)}</li>
      <li><span class="text-secondary">Revenue: </span>$${addCommasTonumber(movie.revenue)}</li>
      <li><span class="text-secondary">Runtime: </span>${movie.runtime} minutes</li>
      <li><span class="text-secondary">Status: </span>${movie.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">
    ${movie.production_companies.map((company)=>`<span>${company.name}<span/>`).join(' ')}
    </div>
  </div>`;
  document.querySelector('#movie-details').appendChild(div);
    console.log(movieId);

}
//add commas
function addCommasTonumber(number){
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//display Tv Shows
async function displayPopularTvshows(){
    const {results}=await fetchAPIData('tv/popular');
    results.forEach(shows=>{
        const div=document.createElement('div');
        div.classList.add('card');
        div.innerHTML=`
        
          <a href="movie-details.html?id=${shows.id}">
            ${
                shows.poster_path
                ?`<img
                src="https://image.tmdb.org/t/p/w500${shows.poster_path}"
                class="card-img-top"
                alt="${shows.name}"
              />`:`<img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${shows.name}"
            />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${shows.name}</h5>
            <p class="card-text">
              <small class="text-muted">Air Date:${shows.first_air_date}</small>
            </p>
        `;
        document.querySelector('#popular-shows').appendChild(div);
    });
   
}

//fetch data from API
async function fetchAPIData(endpoint){
    const API_KEY='bd740a807997e3be9674559055b4779e';
    const API_URL='https://api.themoviedb.org/3/';

    Showspinner();
    const response=await fetch(`
    ${API_URL}${endpoint}?api_key=${API_KEY}`);
    const data=await response.json();
    Hidespinner();
    return data;
}
function Showspinner(){
    document.querySelector('.spinner').classList.add('show');
}
function Hidespinner(){
    document.querySelector('.spinner').classList.remove('show');
}
//init App
function init(){
    switch(global.currentPage){
        case '/':
        case '/index.html':
        //   console.log('Home');
        displayPopularMovies();
          break;
        case '/shows.html':
        displayPopularTvshows();
            break;
        case '/movie-details.html':
            Displaydetail();
            
            break;
        case '/tv-details.html':
            console.log('Tv Details');
            break;
        case '/search.html':
            console.log('Search');
            break;


    }
HighlightActiveLink();
}
document.addEventListener('DOMContentLoaded',init);
