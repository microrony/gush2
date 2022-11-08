import {
  handleize,
  overallRating,
  getRatingValue,
  category,
  ratingBuilder,
  paginationGenerator,
} from './helpers.js';

const PUBKEY = 'pubkey-AO91DKEz2x93p9q306GOxS9WrDNZ6k';
const PASSWORD = 'key-67RLw0h5WNIe0o3Bp9Yn3rE73xkYi5';
const STOREHASH = '261547';

const initialize = reviews => {
  const swiperWrapper = document.querySelector(
    '.slider-content-main .swiper-wrapper'
  );
  const categories = document.querySelectorAll(
    '.stamped-reviews-filter-container .option'
  );
  const form = document.getElementById('review_form');
  const leave_review_btn = document.querySelector('.leave_review_btn');
  const mobile_leave_review_btn = document.querySelector(
    '.mobile_review_btn_show'
  );

  let page = 1;
  let show_review_container = false;
  let activeCategory = handleize(
    document.querySelector('.stamped-reviews-filter-container .option.active')
      .textContent
  );
  let lastCategory = activeCategory;
  let finalGroup;

	// Not refactored

  leave_review_btn.addEventListener('click', leaveReviewBtnHandler);
  mobile_leave_review_btn.addEventListener('click', leaveReviewBtnHandler);

  function leaveReviewBtnHandler(e) {
    show_review_container = !show_review_container;

    const review_container = document.querySelector('.review_giving_container');
    if (show_review_container) {
      review_container.style.display = 'block';
      const name = form.querySelector('#name');
      name.focus();
    } else {
      review_container.style.display = 'none';
    }
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
      const { title, rating, reviewMessage, author } = review;
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

	// ***********

  const postReview = formData => {
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
      `https://stamped.io/api/reviews3?apiKey=${PUBKEY}&sId=${STOREHASH}`,
      postRequestOptions
    )
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  };

  const onSubmit = e => {
    e.preventDefault();
    const review_container = document.querySelector('.review_giving_container');
    let formData = Object.fromEntries(new FormData(form));
    review_container.style.display = 'none';
    show_review_container = !show_review_container;
    const productId = document.querySelector('.stamped-review-main').dataset
      .productId;

    formData.productId = productId;
    formData.reviewRating =
      getRatingValue('stars') == undefined ? 1 : getRatingValue('stars');
    formData.category =
      getRatingValue('option') == undefined ? 'all' : getRatingValue('option');

    postReview(formData);
  };

  form.addEventListener('submit', onSubmit);

  const selectCategory = e => {
    page = 1;
    finalGroup = [];
    categories.forEach(category => {
      category.classList.remove('active');
    });
    e.target.classList.add('active');
    activeCategory = handleize(
      document.querySelector('.stamped-reviews-filter-container .option.active')
        .textContent
    );

    // Not refactored
    document.querySelector('.review-mobile-dropdown').removeAttribute('open');
    let selectedFilter = handleize(e.target.getAttribute('data-filter'));
    const review_mobile_selected_filter = document.querySelector(
      '.mobile_review_filter_option'
    );
    review_mobile_selected_filter.innerText =
      e.target.getAttribute('data-filter');
    // *************

    if (activeCategory === lastCategory) {
      return;
    } else {
      activeCategory = handleize(
        document.querySelector(
          '.stamped-reviews-filter-container .option.active'
        ).textContent
      );
      lastCategory = activeCategory;

      if (activeCategory === 'all-reviews') {
        finalGroup = reviews;

        updateDisplay();
        stampedSliderSwiper.update();
        // Not refactored
        mobileReviewHtmlGenaretor(finalGroup);
        mobile_review_html(finalGroup);
      } else {
        finalGroup = reviews.filter(
          review => review.category === activeCategory
        );

        updateDisplay();
        stampedSliderSwiper.update();
				// Not refactored
				mobileReviewHtmlGenaretor(finalGroup);
        mobile_review_html(finalGroup);
      }
    }
  };

  categories.forEach(category => {
    category.addEventListener('click', selectCategory);
  });

  const showReview = reviews => {
    let slidesHTML = '';

    reviews.forEach(review => {
      const { title, rating, reviewMessage, author } = review;
      const slideHTML = `<div class="swiper-slide">
                        <div class="stamped-review-slide__card swiper-slide">
                           <div class="stamped-review-slide__card_inner">
                            <div>
                             <h3 class="gush-font-p1">${title}</h3>
                            ${ratingBuilder(rating)}
                            <p class="gush-font-p2 review_body_text">“${
                              reviewMessage.length > 80
                                ? reviewMessage.slice(0, 70) + '...'
                                : reviewMessage
                            }”</p>
                           </div>
                            <p class="gush-font-p1 client-name">${author}</p>
                           </div>
                        </div>
                    </div>
            `;

      slidesHTML += slideHTML;
    });

    swiperWrapper.innerHTML = slidesHTML;
  };

  const updateDisplay = () => {
    while (swiperWrapper.firstChild) {
      swiperWrapper.removeChild(swiperWrapper.firstChild);
    }

    if (finalGroup.length === 0) {
      const para = document.createElement('p');
      para.textContent = 'No reviews to display. Please leave a review!';

      swiperWrapper.appendChild(para);
    } else {
      showReview(finalGroup);
    }
  };

  finalGroup = reviews;
  updateDisplay();

  const overallRatingReviews = () => {
    const total_review = document.querySelector(
      '.top_review_info .total_reviews'
    );
    const average_rating = document.querySelector(
      '.stamped_top .average_rating'
    );
    const top_star_container = document.querySelector('.top_star_container');

    total_review.innerText = `${reviews.length} Reviews`;
    average_rating.innerText = overallRating(reviews);
    top_star_container.innerHTML = ratingBuilder(overallRating(reviews));
  };

  overallRatingReviews();

  mobile_review_html(reviews);
  mobileReviewHtmlGenaretor(reviews);
};

const myHeaders = new Headers();
myHeaders.append('Authorization', 'Basic ' + btoa(PUBKEY + ':' + PASSWORD));
myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

const requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow',
};

const getReviewsAPIUrl = `https://stamped.io/api/v2/${STOREHASH}/dashboard/reviews/?search=&rating=&state=published&dateFrom&dateTo`;

// fetch all published review
fetch(getReviewsAPIUrl, requestOptions)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
  })
  .then(json => {
    const reviews = json.results.map(
      ({ review: { title, author, body, rating } }) => ({
        title,
        author,
        rating,
        reviewMessage: body.replace(/\[[^\][]*]$/, ''),
        category: handleize(category(body)),
      })
    );

    initialize(reviews);
  })
  .catch(err => console.error(`Fetch problem: ${err.message}`));

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
      slidesPerGroup: 1,
    },
    990: {
      slidesPerView: 2,
      spaceBetween: 30,
      slidesPerGroup: 2,
    },
    1150: {
      slidesPerView: 3,
      spaceBetween: 30,
      slidesPerGroup: 3,
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
