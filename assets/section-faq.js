(function (window) {
  'use strict';

  const faqCategories = document.querySelectorAll('.faq-category');
  const faqTypes = document.querySelectorAll('.faq-type');
  const faqQas = document.querySelectorAll('.faq-qa');

  faqCategories[0].classList.add('active');

	const removeDuplicateTypes = () => {
		let textArr = [];

		const activeFaqTypes =  document.querySelectorAll('.faq-type.active');
		
		activeFaqTypes.forEach(function (d, i) {
      if (textArr.indexOf(d.innerText) > -1) {
        d.remove();
      } else {
        textArr.push(d.innerText);
      }
    });
	}

  const removeDuplicateEl = () => {
    let textArr = [];

    faqCategories.forEach(function (d, i) {
      if (textArr.indexOf(d.innerText) > -1) {
        d.remove();
      } else {
        textArr.push(d.innerText);
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

    faqTypes.forEach(type => {
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
    faqCategories.forEach(tab => {
      tab.addEventListener('click', function () {
        const categoryId = `.${this.dataset.categoryId}`;
        const contents = document.querySelectorAll(categoryId);

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
      });
    });
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
})(window);
