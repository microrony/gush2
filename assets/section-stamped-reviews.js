const camalize = function camalize(str) {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
};

function generateStampedReviewsHTML(stampedReviewsArr) {
  const stampedReviewsHTML = stampedReviewsArr.map(review => {
    const reviewTitle = review.querySelector(
      '.stamped-review-header-title'
    ).textContent;
    const reviewStar = review.querySelector(
      '.stamped-review-header-starratings'
    ).outerHTML;
    const reviewAuthor = review.querySelector('.author').textContent;
    const reviewContent = review.querySelector(
      '.stamped-review-content-body'
    ).textContent;
    const category =
      review.querySelector(
        '.stamped-review-options .stamped-review-option-radio span'
      )?.textContent ?? '';

    const sliderHTML = `<div class="swiper-slide" data-filter="${camalize(
      category
    )}">
									 <div class="swiper-slide__card">
											 <h3 class="gush-font-p1">${reviewTitle}</h3>
											 ${reviewStar}
											 <p class="gush-font-p2">“${
                         reviewContent.length > 140
                           ? reviewContent.slice(0, 190) + '...'
                           : reviewContent
                       }”</p>
											 <p class="gush-font-p1 client-name">${reviewAuthor}</p>
									 </div>
							 </div>
			 `;
    return sliderHTML;
  });
  return stampedReviewsHTML.join('\n');
}

// function toggleClass(elem, className) {
//   if (elem.className.indexOf(className) !== -1) {
//     elem.className = elem.className.replace(className, '');
//   } else {
//     elem.className = elem.className.replace(/\s+/g, ' ') + ' ' + className;
//   }

//   return elem;
// }

// function toggleDisplay(elem) {
//   const curDisplayStyle = elem.style.display;

//   if (curDisplayStyle === 'none' || curDisplayStyle === '') {
//     elem.style.display = 'block';
//   } else {
//     elem.style.display = 'none';
//   }
// }

// function toggleMenuDisplay(e) {
//   const dropdown = e.currentTarget.parentNode;
//   const menu = dropdown.querySelector('.menu');
//   const icon = dropdown.querySelector('.fa-angle-right');

//   toggleClass(menu, 'hide');
//   toggleClass(icon, 'rotate-90');
// }

// function handleOptionSelected(e) {
//   toggleClass(e.target.parentNode, 'hide');

//   const id = e.target.id;
//   const newValue = e.target.textContent + ' ';
//   const titleElem = document.querySelector('.dropdown .title');
//   const icon = document.querySelector('.dropdown .title .fa');

//   titleElem.textContent = newValue;
//   titleElem.appendChild(icon);

//   //trigger custom event
//   document.querySelector('.dropdown .title').dispatchEvent(new Event('change'));
//   //setTimeout is used so transition is properly shown
//   setTimeout(() => toggleClass(icon, 'rotate-90', 0));
// }

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
			<div class='option' data-filter='option4'>Option 4</div>
	</div>
	<!-- Swiper -->
	<div class="swiper stampedSliderSwiper">
			<div class="swiper-wrapper">${generateStampedReviewsHTML(
        stampedReviewsNodeArr
      )}</div>
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

// console.log(filteredArr)

// const tab1 = document.getElementById('option1');
// window.onload = function () {
// 	tab1.click();
// };

//get elements
// const dropdownTitle = document.querySelector('.dropdown .title');
const filterOptions = document.querySelectorAll('.stamped-reviews_filter .option');

//bind listeners to these elements
// dropdownTitle.addEventListener('click', toggleMenuDisplay);

// dropdownOptions.forEach(option =>
//   option.addEventListener('click', handleOptionSelected)
// );

filterOptions.forEach(filter => {
  filter.addEventListener('click', handleFilter);
});

// document
//   .querySelector('.dropdown .title')
//   .addEventListener('change', handleTitleChange);

// console.log(filteredArr)

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
