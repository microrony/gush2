const faqCategories = document.querySelectorAll('.faq-category');
const faqMobileCategories = document.querySelectorAll('.mobile-faq-category');
const faqTypes = document.querySelectorAll('.faq-type');
const mobileFaqTypes = document.querySelectorAll('.mobile-faq-type');
const faqQas = document.querySelectorAll('.faq-qa');

faqCategories[0].classList.add('active');
faqMobileCategories[0].classList.add('active');

const categorySummary = document.querySelector('.active-category-mobile');
const TypeSummary = document.querySelector('.active-type-mobile');
const categoryDetails = document.querySelector('.category_selection_details');
const typeDetails = document.querySelector('.type_selection_details');

const removeDuplicateTypes = () => {
  let textArr = [];

  const activeFaqTypes = document.querySelectorAll('.faq-type.active');
  const mobileActiveFaqTypes = document.querySelectorAll(
    '.mobile-faq-type.active'
  );
  activeFaqTypes.forEach(function (d, i) {
    if (textArr.indexOf(d.innerText) > -1) {
      d.remove();
    } else {
      textArr.push(d.innerText);
    }
  });
  //for mobile
  let textArrMobile = [];
  mobileActiveFaqTypes.forEach(function (d, i) {
    if (textArrMobile.indexOf(d.textContent.trim()) > -1) {
      d.remove();
    } else {
      textArrMobile.push(d.textContent.trim());
    }
  });
};

const removeDuplicateEl = () => {
  let textArr = [];
  faqCategories.forEach(function (d, i) {
    if (textArr.indexOf(d.innerText) > -1) {
      d.remove();
    } else {
      textArr.push(d.innerText);
    }
  });
  //for mobile
  let textArrMobile = [];
  faqMobileCategories.forEach(function (d, i) {
    if (textArrMobile.indexOf(d.textContent.trim()) > -1) {
      d.remove();
    } else {
      textArrMobile.push(d.textContent.trim());
    }
  });

  removeDuplicateTypes();
};

const addInitialActiveClass = () => {
  faqCategories.forEach(category => {
    if (category.classList.contains('active')) {
      const categoryId = `.${category.dataset.categoryId}`;
      const contents = document.querySelectorAll(categoryId);
      contents.forEach(function (content) {
        content.classList.add('active');
      });
      contents[0].classList.add('selected');
    }
  });
  // for mobile
  faqMobileCategories.forEach(category => {
    if (category.classList.contains('active')) {
      const categoryId = `.${category.dataset.categoryId}`;
      const contents = document.querySelectorAll(categoryId);
      contents.forEach(function (content) {
        content.classList.add('active');
      });
      contents[0].classList.add('selected');
    }
  });

  faqTypes.forEach(type => {
    if (type.classList.contains('selected')) {
      const categoryId = `.${type.dataset.typeId}`;
      const contents = document.querySelectorAll(categoryId);
      contents.forEach(function (content) {
        content.classList.add('active');
      });
    }
  });
  // for mobile
  mobileFaqTypes.forEach(type => {
    if (type.classList.contains('selected')) {
      const categoryId = `.${type.dataset.typeId}`;
      const contents = document.querySelectorAll(categoryId);
      contents.forEach(function (content) {
        content.classList.add('active');
      });
    }
  });
};

addInitialActiveClass();

const handleCategoryClick = () => {
  faqCategories.forEach(categoryHandler);
  faqMobileCategories.forEach(mobileCategoryHandler);

  function categoryHandler(tab) {
    let contents = [];
    tab.addEventListener('click', function () {
      const categoryId = `.${this.dataset.categoryId}`;
      contents = document.querySelectorAll(categoryId);
      faqTypes.forEach(function (type) {
        type.classList.remove('active');
      });
      contents.forEach(function (content) {
        content.classList.add('active');
      });

      faqCategories.forEach(function (tab) {
        tab.classList.remove('active');
      });

      tab.classList.add('active');
      //content.classList.add('active');

      if (tab.classList.contains('active')) {
        contents.forEach(function (content) {
          content.classList.add('active');
        });
        contents[0].classList.add('selected');
      }

      faqTypes.forEach(type => {
        if (type.classList.contains('selected')) {
          const categoryId = `.${type.dataset.typeId}`;
          const contents = document.querySelectorAll(categoryId);
          contents.forEach(function (content) {
            content.classList.toggle('active');
          });
        }
      });

      removeDuplicateTypes();
      contents[0].click();
      // updating mobile details summary
      const activeCategory = document.querySelector(
        '.mobile-faq-category.active'
      );
      categorySummary.innerText = activeCategory.innerText.trim();
    });
  }
  // mobile category handler
  function mobileCategoryHandler(tab) {
    let contents = [];
    tab.addEventListener('click', function () {
      const categoryId = `.${this.dataset.categoryId}`;
      contents = document.querySelectorAll(categoryId);
      mobileFaqTypes.forEach(function (type) {
        type.classList.remove('active');
      });

      contents.forEach(function (content) {
        content.classList.add('active');
      });

      faqMobileCategories.forEach(function (tab) {
        tab.classList.remove('active');
      });

      tab.classList.add('active');
      //content.classList.add('active');

      if (tab.classList.contains('active')) {
        contents.forEach(function (content) {
          content.classList.add('active');
        });
        contents[0].classList.add('selected');
        TypeSummary.innerText = contents[0].textContent.trim();
      }

      mobileFaqTypes.forEach(type => {
        if (type.classList.contains('selected')) {
          const categoryId = `.${type.dataset.typeId}`;
          const contents = document.querySelectorAll(categoryId);
          contents.forEach(function (content) {
            content.classList.toggle('active');
          });
        }
      });

      removeDuplicateTypes();
      contents[0].click();
      // updating mobile details summary
      const activeCategory = document.querySelector(
        '.mobile-faq-category.active'
      );
      categorySummary.innerText = `${
        activeCategory.textContent.trim().length > 12
          ? `${activeCategory.textContent.trim().slice(0, 12)}..`
          : activeCategory.textContent.trim()
      }`;
      categoryDetails.removeAttribute('open');
    });
  }
};

handleCategoryClick();

const handleTypeClick = () => {
  faqTypes.forEach(type => {
    type.addEventListener('click', function () {
      const typeId = `.${this.dataset.typeId}`;
      const contents = document.querySelectorAll(typeId);

      faqQas.forEach(function (qa) {
        qa.classList.remove('active');
      });

      contents.forEach(function (content) {
        content.classList.add('active');
      });

      faqTypes.forEach(function (tab) {
        tab.classList.remove('selected');
      });

      type.classList.add('selected');
    });
  });
  // for mobile
  mobileFaqTypes.forEach(type => {
    type.addEventListener('click', function () {
      const typeId = `.${this.dataset.typeId}`;
      const contents = document.querySelectorAll(typeId);

      faqQas.forEach(function (qa) {
        qa.classList.remove('active');
      });

      contents.forEach(function (content) {
        content.classList.add('active');
      });

      mobileFaqTypes.forEach(function (tab) {
        tab.classList.remove('selected');
      });

      type.classList.add('selected');
      typeDetails.removeAttribute('open');
      TypeSummary.innerText = `${
        type.textContent.trim().length > 12
          ? `${type.textContent.trim().slice(0, 12)}..`
          : type.textContent.trim()
      }`;
    });
  });
};

handleTypeClick();

const accordion = () => {
  let Faqquestions = document.querySelectorAll('.faq_qus');

  Faqquestions.forEach(question => {
    question.addEventListener('click', ele => {
      let ans_id = question.dataset.contentId;
      let ans = document.getElementById(ans_id);

      let FaqiconPlus = question.querySelector('.icon-plus-new');
      let FaqiconMinus = question.querySelector('.icon-minus-new');

      if (!FaqiconMinus.classList.contains('is-active')) {
        FaqiconPlus.classList.remove('is-active');
        FaqiconPlus.classList.add('not-active');
        FaqiconMinus.classList.add('is-active');
        FaqiconMinus.classList.remove('not-active');
        ans.classList.add('is-active');
      } else {
        FaqiconMinus.classList.remove('is-active');
        FaqiconMinus.classList.add('not-active');
        FaqiconPlus.classList.add('is-active');
        FaqiconPlus.classList.remove('not-active');
        ans.classList.remove('is-active');
      }
    });
  });
};

accordion();
removeDuplicateEl();
// for mobile responsive
const selectedType = document.querySelector('.faq__types .selected');
const activeCategory = document.querySelector('.faq-category.active');
categorySummary.innerText = activeCategory.innerText.trim();
TypeSummary.innerText = selectedType.innerText.trim();
