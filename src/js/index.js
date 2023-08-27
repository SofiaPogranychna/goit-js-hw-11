import axios from 'axios';
import Notiflix from 'notiflix';

const searchForm = document.getElementById('search-form');
const searchInput = searchForm.querySelector('input[name="searchQuery"]');
const galleryElement = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
const APIKEY = '39086917-cf1f2b6a071a94394fe60a2ff';
let currentPage = 1;
let currentQuery = '';
loadMoreButton.style.display = 'none';


searchForm.addEventListener('submit', async function (event) {
  event.preventDefault();
  const searchQuery = searchInput.value;
  if (searchQuery !== '') {
    await searchImages(searchQuery);
  }
});

async function fetchImages(searchQuery) {
  const params = new URLSearchParams({
    key: APIKEY,
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: currentPage,
    per_page: 40
  });

  const url = `https://pixabay.com/api/?${params}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching images:", error);
    return null;
  }
}

async function searchImages(searchQuery) {
  currentPage = 1;
  currentQuery = searchQuery;
  galleryElement.innerHTML = '';

  const data = await fetchImages(searchQuery);
  if (data && data.hits.length === 0) {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    loadMoreButton.style.display = 'none';
    return;
  }

  data.hits.forEach(renderImageCard);

  if (data && data.hits.length >= currentPage * 40) {
    loadMoreButton.style.display = 'block';
  } else {
    loadMoreButton.style.display = 'none';
  }
}

function renderImageCard(image) {
  const card = document.createElement('div');
  card.classList.add('photo-card');
  card.innerHTML = `
    <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
    <div class="info">
      <p class="info-item"><b>Likes:</b> ${image.likes}</p>
      <p class="info-item"><b>Views:</b> ${image.views}</p>
      <p class="info-item"><b>Comments:</b> ${image.comments}</p>
      <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
    </div>
  `;
  galleryElement.appendChild(card);
}


loadMoreButton.addEventListener('click', loadMoreImages);

async function loadMoreImages() {
  currentPage++;
  const data = await fetchImages(currentQuery);
  
if (data && data.hits.length > 0 && data.hits.length < 40) {
  data.hits.forEach(renderImageCard);
  loadMoreButton.style.display = 'none';
  }
else {
  data.hits.forEach(renderImageCard);
  loadMoreButton.style.display = 'block';
  }
}


