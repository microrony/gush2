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
  const average_rating = data.results.reduce((accu, result) => {
    accu += result.review.rating;
    return accu;
  }, 0);
  return (average_rating / data.total).toFixed(1);
}

// get rating value
export const getRatingValue = (name) => {
  const stars = document.getElementsByName(name);
  for (i = 0; i < stars.length; i++) {
    if (stars[i].checked) return stars[i].value;
  }
}