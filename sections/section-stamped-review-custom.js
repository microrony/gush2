    let allReviews = [];
    let filtered_reviews = []
    const filterOptions = document.querySelectorAll('.stamped-reviews-filter-container .option');
    filterOptions.forEach(filter => {
        filter.addEventListener('click', (e)=>{

            filterOptions.forEach(filter => {
                filter.classList.remove('active')
            })
            e.target.classList.add('active');
            let selectedFilter = e.target.getAttribute('data-filter');
             filtered_reviews = allReviews.filter((review)=> {
                if(selectedFilter=="all"){
                    return true;
                }else{
                    return review.review.optionsList[0]?.value == selectedFilter;
                }
            })
            reviewArraToHtml(filtered_reviews)
            let itemsToShow = document.querySelectorAll(`.mySwiper2 .swiper-slide`);
            itemsToShow.forEach( item => {
                if(filtered_reviews.length == 1){
                    item.classList.add('swiper-slide_full_width')
                }
                if(filtered_reviews.length == 2){
                    item.classList.add('swiper-slide_half_width')
                }
            })
        });
    });
    const camalize = function camalize(str) {
    return str
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
    };
    let pubkey = 'pubkey-AO91DKEz2x93p9q306GOxS9WrDNZ6k';
    let password = 'key-67RLw0h5WNIe0o3Bp9Yn3rE73xkYi5';
    let storeHash = "261547"

    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'Basic ' + btoa(pubkey + ":" + password));
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");


    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
        // fetch all published review
        fetch(`https://stamped.io/api/v2/${storeHash}/dashboard/reviews/?search=&rating=&state=published&dateFrom&dateTo`, requestOptions)
        .then(response => response.json())
        .then(data => {
            allReviews = data?.results;
            reviewArraToHtml(data.results)
            const total_review = document.querySelector(".top_review_info .total_reviews")
            const average_rating = document.querySelector(".stamped_top .average_rating")
            const top_star_container = document.querySelector(".top_star_container")
            total_review.innerText = `${data.total} Reviews`;
            average_rating.innerText = overallRating(data);
            top_star_container.innerHTML = ratingBuilder(overallRating(data));
            })
        .catch(error=>console.log(error))
        // post a review
        function postReview(){
            
            var formdata = new FormData();
            formdata.append("productId", "402438sfsdfasdds8163");
            formdata.append("author", "John Doh");
            formdata.append("email", "john.doh@example.com");
            formdata.append("reviewRating", "5");
            formdata.append("reviewTitle", "This is a test review title");
            formdata.append("reviewMessage", "This is a test review message");

            var postRequestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
            };

            fetch(`https://stamped.io/api/reviews3?apiKey=${pubkey}&sId=${storeHash}`, postRequestOptions)
            .then(response => response.json())
            .then( postResult => console.log({postResult}))
            .catch(postError=> console.log({postError}))
        }
        postReview()
    // review array tto html
    function reviewArraToHtml(arr){
        const stampedReviewsHTML = arr.map(review=>{
            const { title, rating, body, author, optionsList } = review.review;
            const sliderHTML = `<div class="swiper-slide" data-filter="${camalize(
            optionsList?.length == 0 ? "all" : optionsList[0].value
                )}">
                        <div class="stamped-review-slide__card swiper-slide">
                           <div class="stamped-review-slide__card_inner">
                            <div>
                             <h3 class="gush-font-p1">${title}</h3>
                            ${ratingBuilder(rating)}
                            <p class="gush-font-p2 review_body_text">“${
                                body.length > 100
                                ? body.slice(0, 100) + '...'
                                : body
                            }”</p>
                           </div>
                            <p class="gush-font-p1 client-name">${author}</p>
                           </div>
                        </div>
                    </div>
            `;
            
            return sliderHTML;
            })

        const swiper_wrapper = document.querySelector('.slider-content-main .swiper-wrapper')
        swiper_wrapper.innerHTML =  stampedReviewsHTML.join('\n');
    }
        //number to rating builder
        function ratingBuilder(rating){
            let rating_element ='';
            for(let i=1;i<6;i++){
                if(i<=rating){
                    rating_element+=`<span class="fa-regular fa-star colored_star"></span>`
                }else{
                    if(rating>=`${i-1}.5`){
                        rating_element+=`<span class="fa-regular fa-star colored_star"></span>`
                    }else{
                        rating_element+=`<span class="fa-regular fa-star"></span>`
                    }
                }
            }
            return rating_element;
        }
        // avarage rating calculating function
        function overallRating(data){
            const average_rating = data.results.reduce((accu, result)=>{
                accu += result.review.rating;
                return accu;
            },0)
            return (average_rating/data.total).toFixed(1);
        }
        var stampedSliderSwiper = new Swiper('.mySwiper2', {
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
