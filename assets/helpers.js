// Shopify handleize in JavaScript

export const handleize = (str) => {
	str = str.toLowerCase();

	var toReplace = ['"', "'", "\\", "(", ")", "[", "]"];

	// For the old browsers
	for (var i = 0; i < toReplace.length; ++i) {
		str = str.replace(toReplace[i], "");
	}

	str = str.replace(/\W+/g, "-");

	if (str.charAt(str.length - 1) == "-") {
		str = str.replace(/-+\z/, "");
	}

	if (str.charAt(0) == "-") {
		str = str.replace(/\A-+/, "");
	}

	return str;
};

// avarage rating calculating function
export const overallRating = (data) => {
  const average_rating = data.reduce((accu, result) => {
    accu += result.rating;
    return accu;
  }, 0);
  return (average_rating / data.length).toFixed(1);
}

// get rating value
export const getRatingValue = (name) => {
  const stars = document.getElementsByName(name);
  for (let i = 0; i < stars.length; i++) {
    if (stars[i].checked) return stars[i].value;
  }
}

// number to rating builder
export const  ratingBuilder = (rating) => {
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

// pagination generator
export const paginationGenerator = (pCount) => {
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

export const category = (reviewMessage) => {
	return reviewMessage.match(/\[[^\][]*]$/)
? reviewMessage.match(/\[[^\][]*]$/)[0].match(/\[(.*?)\]/)[1]
: 'all'
}