window.slider = (function() {

class Ticket {
  constructor (name, dateStr, place, price, imgUrl) {
    this.name = name;
    this.date = new Date(dateStr);
    this.place = place;
    this.price = price;
    this.imgUrl = imgUrl;
  }
}

const bannerPosters = [
  new Ticket(
    'Дай Дарогу! ХХ лет!',
    '2018-05-08',
    'Prime Hall',
    '30 – 40 р.',
    'img/banner-1.jpeg'
  ),
  new Ticket(
    'E-Commerce Day',
    '2018-03-30',
    'SPACE',
    '25 р.',
    'img/banner-2.png'
  ),
  new Ticket(
    'Луна. Остров Свободы',
    '2018-05-10',
    'RE:PUBLIC',
    '68 р.',
    'img/banner-3.jpeg'
  ),
];

const postersCount = bannerPosters.length;
let currentSlide = 0;

const forward = document.querySelector('.banner__ticket__nav:first-child');
const back = document.querySelector('.banner__ticket__nav:last-child');
const dots = document.querySelectorAll('.banner__dots__dot');

const poster = document.querySelector('.banner__ticket__poster');
const name = document.querySelector('.banner__ticket__details__name');
const date = document.querySelector('.banner__ticket__details-secondary__date');
const place = document.querySelector('.banner__ticket__details-secondary__place');
const price = document.querySelector('.banner__ticket__details-secondary__price');

const next = function() {
  currentSlide += 1;
  if (currentSlide >= postersCount) {
    currentSlide = currentSlide - postersCount;
  }

  return currentSlide;
}

const previous = function() {
  currentSlide -= 1;
  if (currentSlide < 0) {
    currentSlide = postersCount + currentSlide;
  }

  return currentSlide;
}

const onSlideChange = function(event) {
  event.preventDefault();

  dots[currentSlide].classList.remove('banner__dots__dot-active');
  poster.classList.remove('banner__ticket__poster-fadeIn');
  poster.classList.add('banner__ticket__poster-fadeOut');

  if (event.target.dataset.sliderNav === 'back') {
    previous();
  }
  if (event.target.dataset.sliderNav === 'forward') {
    next();
  }

  setTimeout(() => {
    name.innerText = bannerPosters[currentSlide].name;
    date.innerText = bannerPosters[currentSlide].date.toLocaleDateString();
    place.innerText = bannerPosters[currentSlide].place;
    price.innerText = bannerPosters[currentSlide].price;
    poster.src = bannerPosters[currentSlide].imgUrl;

    poster.classList.remove('banner__ticket__poster-fadeOut');
    poster.classList.add('banner__ticket__poster-fadeIn');
  }, 250);

  dots[currentSlide].classList.add('banner__dots__dot-active');
}

return {
  length: postersCount,
  onSlideChange,
}

})();
