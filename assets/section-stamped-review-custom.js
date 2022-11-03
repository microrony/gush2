const camelize = function camelize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '').replace(/^-/, '');
};

let show_review_container = false;

// pagination page track
let page = 1;
const productId = document.querySelector('.stamped-review-main').dataset
  .productId;
const form = document.getElementById('review_form');

form.addEventListener('submit', e => {
  e.preventDefault();

  let formData = Object.fromEntries(new FormData(form));
  formData.productId = productId;
  formData.reviewRating =
    getRatingValue('stars') == undefined ? 1 : getRatingValue('stars');
  formData.category =
    getRatingValue('option') == undefined ? 'all' : getRatingValue('option');

  postReview(formData);

  const review_container = document.querySelector('.review_giving_container');
  review_container.style.display = 'none';
  show_review_container = !show_review_container;
});

let allReviews = [];
let filtered_reviews = [];
const filterOptions = document.querySelectorAll('.option');
filterOptions.forEach(filter => {
  filter.addEventListener('click', e => {
    page = 1;
    filterOptions.forEach(filter => {
      filter.classList.remove('active');
    });
    e.target.classList.add('active');
    document.querySelector('.review-mobile-dropdown').removeAttribute('open');
    let selectedFilter = camelize(e.target.getAttribute('data-filter'));
    const review_mobile_selected_filter = document.querySelector(
      '.mobile_review_filter_option'
    );
    review_mobile_selected_filter.innerText = e.target.getAttribute('data-filter');
    filtered_reviews = allReviews.filter(review => {
      if (selectedFilter == 'all-reviews') {
        return true;
      } else if(review.review.body.match(/\[[^\][]*]$/)) {
        return review.review.body.match(/\[[^\][]*]$/)[0].match(/\[(.*?)\]/)[1] == selectedFilter;
      }
    });
    reviewArrayToHtml([]);
    setTimeout(()=> reviewArrayToHtml(filtered_reviews), 100)
    mobileReviewHtmlGenaretor(filtered_reviews);
    mobile_review_html(filtered_reviews);
    let itemsToShow = document.querySelectorAll(`.mySwiper2 .swiper-slide`);
    itemsToShow.forEach(item => {
      if (filtered_reviews.length == 1) {
        item.classList.add('swiper-slide_custom_width');
      }
      if (filtered_reviews.length == 2) {
        item.classList.add('swiper-slide_custom_width');
      }
      if(filtered_reviews.length > 2){
        item.classList.remove('swiper-slide_custom_width');
      }
    });
  });
});

let pubkey = 'pubkey-AO91DKEz2x93p9q306GOxS9WrDNZ6k';
let password = 'key-67RLw0h5WNIe0o3Bp9Yn3rE73xkYi5';
let storeHash = '261547';

var myHeaders = new Headers();
myHeaders.append('Authorization', 'Basic ' + btoa(pubkey + ':' + password));
myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow',
};

// fetch all published review
fetch(
  `https://stamped.io/api/v2/${storeHash}/dashboard/reviews/?search=&rating=&state=published&dateFrom&dateTo`,
  requestOptions
)
  .then(response => response.json())
  .then(data => {
    allReviews = data?.results;
    reviewArrayToHtml(data.results);
    mobile_review_html(data.results);
    mobileReviewHtmlGenaretor(data.results);
    const total_review = document.querySelector(
      '.top_review_info .total_reviews'
    );
    const average_rating = document.querySelector(
      '.stamped_top .average_rating'
    );
    const top_star_container = document.querySelector('.top_star_container');
    total_review.innerText = `${data.total} Reviews`;
    average_rating.innerText = overallRating(data);
    top_star_container.innerHTML = ratingBuilder(overallRating(data));
  })
  .catch(error => console.log(error));

// post a review
function postReview(formData) {
  let myPostHeaders = new Headers();
  myPostHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

  let urlencoded = new URLSearchParams();

  Object.keys(formData).forEach(key => {
    if (key !== 'category' && key !== 'reviewMessage') {
      urlencoded.append(key, formData[key]);
    } else if (key == 'reviewMessage') {
      urlencoded.append(key, `${formData[key]}[${formData['category']}]`);
    } else {
			return;
		}
  });

  const postRequestOptions = {
    method: 'POST',
    headers: myPostHeaders,
    body: urlencoded,
    redirect: 'follow',
  };

  fetch(
    'https://stamped.io/api/reviews3?apiKey=pubkey-AO91DKEz2x93p9q306GOxS9WrDNZ6k&sId=261547',
    postRequestOptions
  )
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

// review array tto html
function reviewArrayToHtml(arr) {
  const stampedReviewsHTML = arr.map(review => {
    const { title, rating, body, author } = review.review;
		const reviewMessage = body.replace(/\[[^\][]*]$/, '');
		const filter = body.match(/\[[^\][]*]$/) ? body.match(/\[[^\][]*]$/)[0].match(/\[(.*?)\]/)[1] : 'all';
    const sliderHTML = `<div class="swiper-slide" data-filter="${camelize(
      filter 
    )}">
                        <div class="stamped-review-slide__card swiper-slide">
                           <div class="stamped-review-slide__card_inner">
                            <div>
                             <h3 class="gush-font-p1">${title}</h3>
                            ${ratingBuilder(rating)}
                            <p class="gush-font-p2 review_body_text">“${
                              reviewMessage.length > 100
                                ? reviewMessage.slice(0, 100) + '...'
                                : reviewMessage
                            }”</p>
                           </div>
                            <p class="gush-font-p1 client-name">${author}</p>
                           </div>
                        </div>
                    </div>
            `;

    return sliderHTML;
  });
  const swiper_wrapper = document.querySelector(
    '.slider-content-main .swiper-wrapper'
  );
  swiper_wrapper.innerHTML = stampedReviewsHTML.join('\n');
}

function mobileReviewHtmlGenaretor(arr) {
  const mobile_pagination_container = document.querySelector(
    '.mobile_review_pagination'
  );
  mobile_pagination_container.innerHTML = `<div class="pagination_box"> ${paginationGenerator(
    Math.ceil(arr.length / 3)
  )} </div>`;
  const pagination_list = document.querySelectorAll('[pagination-page]');
  pagination_list.forEach(ele => {
    ele.addEventListener('click', () => {
      pagination_list.forEach(filter => {
        filter.classList.remove('pagination-active');
      });
      ele.classList.add('pagination-active');
      if (ele.getAttribute('pagination-page') == 'next') {
        page++;
        const currentPagination = document.querySelector(
          `[pagination-page="${page}"]`
        );
        currentPagination.classList.add('pagination-active');
        mobile_review_html(arr);
      } else {
        page = ele.getAttribute('pagination-page');
        mobile_review_html(arr);
      }
    });
  });
}
function mobile_review_html(arr) {
  let slicedArray = arr.slice(page * 3 - 3, page * 3 - 3 + 3);
  const stampedReviewsHTMLMobile = slicedArray.map(review => {
    const { title, rating, body, author } = review.review;
		const reviewMessage = body.replace(/\[[^\][]*]$/, '');
    const review_html = `<div class="mobile_responsive_review_box">
                <div class="mobile_review_box_top">
                    <p class="gush-font-p1">${title}</p>
                    <div>
                        ${ratingBuilder(rating)}
                    </div>
                </div>
                <div class="mobile_review_body">
                    <p class="gush-font-p2">${reviewMessage}</p>
                </div>
                <p class="gush-font-p2 author">${author}</p>
            </div>`;
    return review_html;
  });
  const mobile_review_container = document.querySelector(
    '.mobile-reviews-container'
  );
  mobile_review_container.innerHTML = stampedReviewsHTMLMobile.join('\n');
  const next_btn = document.querySelector('.pagination_next_btn');
  if (!(page < Math.ceil(arr.length / 3))) {
    next_btn.setAttribute('disabled', true);
  } else {
    next_btn?.removeAttribute('disabled');
  }
}

// number to rating builder
function ratingBuilder(rating) {
  let rating_element = '';
  for (let i = 1; i < 6; i++) {
    if (i <= rating) {
      rating_element += `<span class="fa-regular fa-star colored_star"></span>`;
    } else {
      if (rating >= `${i - 1}.5`) {
        rating_element += `<span class="fa-regular fa-star colored_star"></span>`;
      } else {
        rating_element += `<span class="fa-regular fa-star"></span>`;
      }
    }
  }
  return rating_element;
}

// avarage rating calculating function
function overallRating(data) {
  const average_rating = data.results.reduce((accu, result) => {
    accu += result.review.rating;
    return accu;
  }, 0);
  return (average_rating / data.total).toFixed(1);
}

// get rating value
function getRatingValue(name) {
  const stars = document.getElementsByName(name);
  for (i = 0; i < stars.length; i++) {
    if (stars[i].checked) return stars[i].value;
  }
}

// pagination generator
function paginationGenerator(pCount) {
  let paginationList = '';

  for (let i = 1; i <= pCount + 1; i++) {
    if (i <= pCount) {
      paginationList += `<li class="gush-font-teritary ${
        i == 1 && 'pagination-active'
      }" pagination-page="${i}">${i}</li>`;
    } else {
      paginationList += `<button class="pagination_next_btn" pagination-page="next" >></button>`;
    }
  }
  return paginationList;
}
const leave_review_btn = document.querySelector('.leave_review_btn');
const mobile_leave_review_btn = document.querySelector(
  '.mobile_review_btn_show'
);
leave_review_btn.addEventListener('click', leaveReviewBtnHandler);
mobile_leave_review_btn.addEventListener('click', leaveReviewBtnHandler);

function leaveReviewBtnHandler(e) {
  show_review_container = !show_review_container;

  // const stamped_new_reviewBtn = document.querySelector(".stamped-summary-actions-newreview");
  // stamped_new_reviewBtn.click();
  const review_container = document.querySelector('.review_giving_container');
  if (show_review_container) {
    review_container.style.display = 'block';
    const name = form.querySelector("#name");
    name.focus();
  } else {
    review_container.style.display = 'none';
  }
}

// swiper settings
var stampedSliderSwiper = new Swiper('.mySwiper2', {
  slidesPerView: 1,
  spaceBetween: 30,
  slidesPerGroup: 1,
  loop: false,
  loopFillGroupWithBlank: true,
  breakpoints: {
    750: {
      slidesPerView: 1,
      spaceBetween: 30,
      slidesPerGroup: 1
    },
    990: {
      slidesPerView: 2,
      spaceBetween: 30,
      slidesPerGroup: 2
    },
    1150: {
      slidesPerView: 3,
      spaceBetween: 30,
      slidesPerGroup: 3
    },
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});
