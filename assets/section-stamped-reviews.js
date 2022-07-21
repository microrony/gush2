const stampedHeaderTitle = document.querySelector('#stamped-main-widget .stamped-container .stamped-header-title')
const stampedSummaryCaptionText = document.querySelector('#stamped-main-widget .stamped-container .stamped-header .stamped-summary-caption .stamped-summary-text')
const stampedSummaryRatingText = document.querySelector('#stamped-main-widget .stamped-container .stamped-header .stamped-summary-text-1')
const stampedSummaryActionsNewReview = document.querySelector('#stamped-main-widget .stamped-container .stamped-header .stamped-summary-actions .stamped-summary-actions-newreview')

stampedHeaderTitle.textContent = 'Overall Rating';
stampedSummaryCaptionText.textContent = stampedSummaryCaptionText.textContent.replace('Based on ', '');
stampedSummaryActionsNewReview.textContent = stampedSummaryActionsNewReview.textContent.replace('Write', 'Leave');
stampedSummaryRatingText.textContent = stampedSummaryRatingText.textContent
stampedHeaderTitle.classList.add('gush-font-p2');
stampedSummaryCaptionText.classList.add('gush-font-p2');
stampedSummaryRatingText.classList.add('gush-font-h1')
stampedSummaryActionsNewReview.classList.add('gush-font-p1')

const stampedReviews = document.querySelectorAll('#stamped-main-widget .stamped-content .stamped-review');
const stampedContent = document.querySelector('#stamped-main-widget .stamped-content');

// console.log(stampedSummaryRatingText.textContent);

const stampedReviewsArr = Array.from(stampedReviews)

const stampedReviewsHTML = stampedReviewsArr.map(review => {

const reviewTitle = review.childNodes[3].childNodes[5].childNodes[1].textContent
const reviewStar = review.childNodes[1].childNodes[3].outerHTML
const reviewAuthor = review.childNodes[1].childNodes[7].textContent
const reviewContent = review.childNodes[3].childNodes[5].childNodes[3].textContent
	
const sliderHTML = `<div class="swiper-slide">
									<div class="swiper-slide__card">
											<h3 class="gush-font-p1">${reviewTitle}</h3>
											${reviewStar}
											<p class="gush-font-p2">“${reviewContent.length > 140 ? reviewContent.slice(0, 190) + '...' : reviewContent}”</p>
											<p class="gush-font-p1 client-name">${reviewAuthor}</p>
									</div>
							</div>
			`
	// console.log(sliderHTML)
	return sliderHTML
})

stampedContent.innerHTML += `<div class='stamped-slider-reviews'>
        
<!-- Swiper -->
	<div class="swiper stampedSliderSwiper">
			<div class="swiper-wrapper">${stampedReviewsHTML.join('\n')}</div>
			<div class="swiper-button-next"><svg class="icon icon-arrow-right-slide" xmlns="http://www.w3.org/2000/svg" width="48" height="40" viewBox="0 0 48 40" fill="none">
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
			</div>`

// console.log(stampedReviewsHTML)
// console.log('first')

var stampedSliderSwiper = new Swiper(".stampedSliderSwiper", {
	slidesPerView: 3,
	spaceBetween: 30,
	slidesPerGroup: 3,
	loop: false,
	loopFillGroupWithBlank: true,
	pagination: {
		el: ".swiper-pagination",
		clickable: true,
	},
	navigation: {
		nextEl: ".swiper-button-next",
		prevEl: ".swiper-button-prev",
	},
});