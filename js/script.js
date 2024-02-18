const global={
  currentPage: window.location.pathname,
  search:{
    term:'',
    type:'',
    page:1,
    totalPages:1,
    totalResults:0,
  },
  api:{
   API_KEY:'bd740a807997e3be9674559055b4779e',
   API_URL:'https://api.themoviedb.org/3/'

  }
};
//add paginaton

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
    //overllay for background image
    displaybackgroundimage('movie',movie.backdrop_path)
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
//search movies /Shows
async function  search(){
const querystring=window.location.search;
const urlParams=new URLSearchParams(querystring);
global.search.type=urlParams.get('type');
global.search.term=urlParams.get('search-term');
if(global.search.term!=='' && global.search.term!=null)
{
//to do the request
const {results,total_pages,page,total_results}=await SearchAPIData();
global.search.page=page;
global.search.totalPages=total_pages;
global.search.totalResults=total_results;
console.log(total_results);
if(results.length===0)
{
  showalert('No results found');
  return;
}
displaySearchResults(results);
document.querySelector('#search-inputs').value='';


}
else{
showalert('Please add some inputs');

}}
//Displayresults
function displaySearchResults(results){
  results.forEach((result)=>{
    const div=document.createElement('div');
    div.classList.add('card');
    div.innerHTML=`
    
      <a href="${global.search.type}-details.html?id=${result.id}">
        ${
            result.poster_path
            ?`<img
            src="https://image.tmdb.org/t/p/w500/${result.poster_path}"
            class="card-img-top"
            alt="${global.search.type==='movie'? result.title: result.name}"
          />`:`<img
          src="images/no-image.jpg"
          class="card-img-top"
          alt="${global.search.type==='movie'? result.title: result.name}"
        />`
        }
      </a>
      <div class="card-body">
        <h5 class="card-title">${global.search.type==='movie'? result.title: result.name}</h5>
        <p class="card-text">
          <small class="text-muted">Release:${global.search.type==='movie'? result.release_date: result.first_air_date}</small>
        </p>
    `;
    document.querySelector('#search-results-heading').innerHTML=`<h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>`
    document.querySelector('#search-results').appendChild(div);
});
}

//show alert
function showalert(msg,classname='error')
{
  const alertEl=document.createElement('div');
  alertEl.classList.add('alert',classname);
  alertEl.appendChild(document.createTextNode(msg));
  document.querySelector('#alert').appendChild(alertEl);
  setTimeout(()=>alertEl.remove(),4000)
}
//display backdrop on details page
function displaybackgroundimage(type,bgpath){
const overlaydiv=document.createElement('div');
overlaydiv.style.backgroundImage=`url(https://image.tmdb.org/t/p/original/${bgpath})`;
overlaydiv.style.backgroundSize='cover';
overlaydiv.style.backgroundPosition='center';
overlaydiv.style.backgroundRepeat='no-repeat';
overlaydiv.style.height='100vh';
overlaydiv.style.width='100vw';
overlaydiv.style.position='absolute';
overlaydiv.style.top='0';
overlaydiv.style.left='0';
overlaydiv.style.zIndex='-1';
overlaydiv.style.opacity='0.1';
if(type==='movie')
{
  document.querySelector('#movie-details').appendChild(overlaydiv);
}
else{
  document.querySelector('#show-details').appendChild(overlaydiv);
}
}
//
//add commas
function addCommasTonumber(number){
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//display TV Show Details
async function DisplayShowdetail(){
  const showId=window.location.search.split('=')[1];
  const show=await fetchAPIData(`tv/${showId}`);
  //overllay for background image
  displaybackgroundimage('tv',show.backdrop_path)
  const div=document.createElement('div');
  div.innerHTML=`  <div class="details-top">
  <div>
  ${
      show.poster_path
      ?`<img
      src="https://image.tmdb.org/t/p/w500${show.poster_path}"
      class="card-img-top"
      alt="${show.name}"
    />`:`<img
    src="images/no-image.jpg"
    class="card-img-top"
    alt="${show.name}"
  />`
  }
  </div>
  <div>
    <h2>${show.name}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${show.vote_average.toFixed(1)}
    </p>
    <p class="text-muted">Last Air Date:${show.last_air_date}</p>
    <p>
     ${show.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
     ${show.genres.map((genre)=>`<li>${genre.name}</li>`).join('')}
    </ul>
    <a href="${show.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Movie Info</h2>
  <ul>
    <li><span class="text-secondary">Number of Episodes: </span>${show.number_of_episodes}</li>
    <li><span class="text-secondary">Last episode to air: </span>${show.last_episode_to_air.name}</li>
    <li><span class="text-secondary">Status: </span>${show.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">
  ${show.production_companies.map((company)=>`<span>${company.name}<span/>`).join(' ')}
  </div>
</div>`;
document.querySelector('#show-details').appendChild(div);
  console.log(showId);

}
//display Tv Shows
async function displayPopularTvshows(){
    const {results}=await fetchAPIData('tv/popular');
    results.forEach(shows=>{
        const div=document.createElement('div');
        div.classList.add('card');
        div.innerHTML=`
        
          <a href="tv-details.html?id=${shows.id}">
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
    Showspinner();
    const response=await fetch(`
    ${global.api.API_URL}${endpoint}?api_key=${global.api.API_KEY}`);
    const data=await response.json();
    Hidespinner();
    return data;
}
//make request to search
async function SearchAPIData(){
  Showspinner();
  const response=await fetch(`
  ${global.api.API_URL}search/${global.search.type}?api_key=${global.api.API_KEY}&query=${global.search.term}`);
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
//Display Sliders movie
async function Displayslider(){
const {results}=await fetchAPIData('movie/now_playing');
// console.log('All now Playing',results?.poster_path);
results.forEach((movie)=>{
  const div=document.createElement('div');
  div.classList.add('swiper-slide');
  div.innerHTML=`
  <a href="movie-details.html?id=${movie.id}">
    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
  </a>
  <h4 class="swiper-rating">
    <i class="fas fa-star text-secondary"></i> ${movie.vote_average}
  </h4>
</div>`;
document.querySelector('.swiper-wrapper').appendChild(div);
// document.querySelector('.swiper-wrapper').appendChild(div);
initSwipper();

})
// console.log(results);
}
function initSwipper(){
  const swiper=new Swiper('.swiper',{
    slidesPerView:1,
    spaceBetween:30,
    freeMode:true,
    loop:true,
    autoplay:{
      delay:4000,
      disableOnInteraction:false
    },
    breakpoints:{
      500:{
        slidesPerView:2
      },
       700:{
        slidesPerView:3
      },
      1200:{
        slidesPerView:4
      }
    }
  })
  console.log(swiper);
}


//init App
function init(){
    switch(global.currentPage){
        case '/':
        case '/index.html':
        //   console.log('Home');
        Displayslider();
        displayPopularMovies();
          break;
        case '/shows.html':
        displayPopularTvshows();
            break;
        case '/movie-details.html':
            Displaydetail();
            
            break;
        case '/tv-details.html':
           DisplayShowdetail();
            break;
        case '/search.html':
            search();
            break;


    }
HighlightActiveLink();
}
document.addEventListener('DOMContentLoaded',init);
