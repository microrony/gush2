const camalize = function camalize(str) {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
};

 function generateStampedReviewsHTML(cb) {
  let username = 'pubkey-AO91DKEz2x93p9q306GOxS9WrDNZ6k';
  let password = 'key-67RLw0h5WNIe0o3Bp9Yn3rE73xkYi5';

  var myHeaders = new Headers();
  myHeaders.append('Authorization', 'Basic ' + btoa(username + ":" + password));
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");


  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
    fetch("https://stamped.io/api/v2/261547/dashboard/reviews/?search=&rating=&state=published&dateFrom&dateTo", requestOptions)
    .then(response => response.json())
    .then(data => {
        const stampedReviewsHTML = data.results.map(review=>{
        const { title, rating, body, author, optionsList } = review.review;
        const sliderHTML = `<div class="swiper-slide" data-filter="${camalize(
          optionsList?.length == 0 ? "all" : optionsList[0].value
            )}">
                      <div class="swiper-slide__card">
                          <h3 class="gush-font-p1">${title}</h3>
                          ${rating}
                          <p class="gush-font-p2">“${
                            body.length > 140
                              ? body.slice(0, 190) + '...'
                              : body
                          }”</p>
                          <p class="gush-font-p1 client-name">${author}</p>
                      </div>
                  </div>
          `;
          
          return sliderHTML;
        })
      cb(stampedReviewsHTML.join("\n"))
    }).catch(error=>{
      console.log(error)
    })





  // const stampedReviewsHTML = stampedReviewsArr.map(review => {
  //   const reviewTitle = review.querySelector(
  //     '.stamped-review-header-title'
  //   ).textContent;
  //   const reviewStar = review.querySelector(
  //     '.stamped-review-header-starratings'
  //   ).outerHTML;
  //   const reviewAuthor = review.querySelector('.author').textContent;
  //   const reviewContent = review.querySelector(
  //     '.stamped-review-content-body'
  //   ).textContent;
  //   const category =
  //     review.querySelector(
  //       '.stamped-review-options .stamped-review-option-radio span'
  //     )?.textContent ?? '';

  //   const sliderHTML = `<div class="swiper-slide" data-filter="${camalize(
  //     category
  //   )}">
	// 								 <div class="swiper-slide__card">
	// 										 <h3 class="gush-font-p1">${reviewTitle}</h3>
	// 										 ${reviewStar}
	// 										 <p class="gush-font-p2">“${
  //                        reviewContent.length > 140
  //                          ? reviewContent.slice(0, 190) + '...'
  //                          : reviewContent
  //                      }”</p>
	// 										 <p class="gush-font-p1 client-name">${reviewAuthor}</p>
	// 								 </div>
	// 						 </div>
	// 		 `;
  //   return sliderHTML;
  // });
  
}

function handleFilter(e) {

	filterOptions.forEach(filter => filter.classList.remove('active'))

	e.target.classList.add('active');

  let selectedFilter = e.target.getAttribute('data-filter');

  let itemsToHide = document.querySelectorAll(
    `.swiper .swiper-slide:not([data-filter='${selectedFilter}'])`
  );
  let itemsToShow = document.querySelectorAll(
    `.swiper [data-filter='${selectedFilter}']`
  );

  if (selectedFilter == 'all') {
    itemsToHide = [];
    itemsToShow = document.querySelectorAll('.swiper [data-filter]');
  }

  itemsToHide.forEach(el => {
    el.classList.add('hide');
    el.classList.remove('show');
  });

  itemsToShow.forEach(el => {
    el.classList.remove('hide');
    el.classList.add('show');
  });
}

const stampedHeaderTitle = document.querySelector(
  '#stamped-main-widget .stamped-container .stamped-header-title'
);
const stampedSummaryCaptionText = document.querySelector(
  '#stamped-main-widget .stamped-container .stamped-header .stamped-summary-caption .stamped-summary-text'
);
const stampedSummaryRatingText = document.querySelector(
  '#stamped-main-widget .stamped-container .stamped-header .stamped-summary-text-1'
);
const stampedSummaryActionsNewReview = document.querySelector(
  '#stamped-main-widget .stamped-container .stamped-header .stamped-summary-actions .stamped-summary-actions-newreview'
);

stampedHeaderTitle.textContent = 'Overall Rating';
stampedSummaryCaptionText.textContent =
  stampedSummaryCaptionText.textContent.replace('Based on ', '');
stampedSummaryActionsNewReview.textContent =
  stampedSummaryActionsNewReview.textContent.replace('Write', 'Leave');
stampedSummaryRatingText.textContent = stampedSummaryRatingText.textContent;
stampedHeaderTitle.classList.add('gush-font-p2');
stampedSummaryCaptionText.classList.add('gush-font-p2');
stampedSummaryRatingText.classList.add('gush-font-h1');
stampedSummaryActionsNewReview.classList.add('gush-font-p1');

const stampedReviews = document.querySelectorAll(
  '#stamped-main-widget .stamped-content .stamped-review'
);
const stampedContent = document.querySelector(
  '#stamped-main-widget .stamped-content'
);
const stampedReviewsNodeArr = Array.from(stampedReviews);

stampedContent.innerHTML += `<div class='stamped-slider-reviews'>
	
	<div class='stamped-reviews_filter gush-font-p1'>
		  <div class='option active' data-filter='all'>All Reviews</div>
			<div class='option' data-filter='option1'>Option 1</div>
			<div class='option' data-filter='option2'>Option 2</div>
			<div class='option' data-filter='option3'>Option 3</div>
	</div>
	<!-- Swiper -->
	<div class="swiper stampedSliderSwiper">
  <div class="swiper-wrapper">
    ${generateStampedReviewsHTML((swiper_sliders)=>swiper_sliders)}
  </div>
			</div><div class="swiper-button-next"><svg class="icon icon-arrow-right-slide" xmlns="http://www.w3.org/2000/svg" width="48" height="40" viewBox="0 0 48 40" fill="none">
			<circle cx="46" cy="20" r="2" fill="#2D2014"/>
			<circle cx="34" cy="20" r="2" fill="#2D2014"/>
			<circle cx="26" cy="20" r="2" fill="#2D2014"/>
			<circle cx="18" cy="20" r="2" fill="#2D2014"/>
			<circle cx="10" cy="20" r="2" fill="#2D2014"/>
			<circle cx="2" cy="20" r="2" fill="#2D2014"/>
			<circle cx="40" cy="26" r="2" fill="#2D2014"/>
			<circle cx="34" cy="32" r="2" fill="#2D2014"/>
			<circle cx="28" cy="38" r="2" fill="#2D2014"/>
			<circle cx="40" cy="14" r="2" fill="#2D2014"/>
			<circle cx="34" cy="8" r="2" fill="#2D2014"/>
			<circle cx="28" cy="2" r="2" fill="#2D2014"/>
			</svg></div>
				<div class="swiper-button-prev"><svg class="icon icon-arrow-left-slide" xmlns="http://www.w3.org/2000/svg" width="48" height="40" viewBox="0 0 48 40" fill="none">
				<circle r="2" transform="matrix(-1 0 0 1 2 20)" fill="#2D2014"/>
				<circle r="2" transform="matrix(-1 0 0 1 14 20)" fill="#2D2014"/>
				<circle r="2" transform="matrix(-1 0 0 1 22 20)" fill="#2D2014"/>
				<circle r="2" transform="matrix(-1 0 0 1 30 20)" fill="#2D2014"/>
				<circle r="2" transform="matrix(-1 0 0 1 38 20)" fill="#2D2014"/>
				<circle r="2" transform="matrix(-1 0 0 1 46 20)" fill="#2D2014"/>
				<circle r="2" transform="matrix(-1 0 0 1 8 26)" fill="#2D2014"/>
				<circle r="2" transform="matrix(-1 0 0 1 14 32)" fill="#2D2014"/>
				<circle r="2" transform="matrix(-1 0 0 1 20 38)" fill="#2D2014"/>
				<circle r="2" transform="matrix(-1 0 0 1 8 14)" fill="#2D2014"/>
				<circle r="2" transform="matrix(-1 0 0 1 14 8)" fill="#2D2014"/>
				<circle r="2" transform="matrix(-1 0 0 1 20 2)" fill="#2D2014"/>
				</svg></div>
	</div>`;
  const swiper_wrapper = stampedContent.querySelector('.swiper-wrapper')
  // swiper_wrapper.innerHTML = `
  // <div  class="swiper-slide" data-filter="all">slider -1</div>
  // <div  class="swiper-slide" data-filter="all">slider -2</div>
  // <div  class="swiper-slide" data-filter="all">slider -3</div>
  // <div  class="swiper-slide" data-filter="all">slider -4</div>
  // <div  class="swiper-slide" data-filter="all">slider -5</div>
  // <div  class="swiper-slide" data-filter="all">slider -6</div>
  // `
  // console.log(swiper_wrapper)

const filterOptions = document.querySelectorAll('.stamped-reviews_filter .option');

filterOptions.forEach(filter => {
  filter.addEventListener('click', handleFilter);
});

var stampedSliderSwiper = new Swiper('.stampedSliderSwiper', {
  slidesPerView: 3,
  spaceBetween: 30,
  slidesPerGroup: 3,
  loop: false,
  loopFillGroupWithBlank: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

generateStampedReviewsHTML(cb=>console.log(cb))