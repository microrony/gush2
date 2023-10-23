class OOHCampaignComponent extends HTMLElement {
  constructor() {
    super()
    
    this.form = this.querySelector('#vibe-selection')
    this.filter = this.form.querySelector('select#collection-filter-select')
    this.selectToggle = this.querySelector('.vibe_selection_strip_label')
    
    this.selectedColors = []
    this.colorInfoEl = this.querySelector('#selected_colors span')

    this.statusTextEl = this.querySelector('.text--status')

    this.selectedVariants = []
    this.selectedColors = []
    
    this.q1 = ""
    this.q2 = ""

    this.cart = {}
    
    this.removable = {}
  }

  connectedCallback() {
    this.form.addEventListener('change', this.handleChange.bind(this))
    this.filter.addEventListener('change', this.handleFilterChange.bind(this))
    this.form.addEventListener('submit', this.handleSubmit.bind(this))
    this.selectToggle.addEventListener('click', this.openToggler.bind(this))

    const jumpToEls = document.querySelectorAll('.jump-to-destination')
    jumpToEls.forEach(el => {
      el.addEventListener('click', this.jumpToHandler.bind(this))
    })

    document.addEventListener('click', this.handleBlur.bind(this))

    this.selectOptions = this.querySelectorAll('.vibe-option')
    this.errorMessage = this.querySelector('.error--message')

    this.labels = this.querySelectorAll('.vibe_label')

    this.selectOptions.forEach(item => {
      item.addEventListener('click', this.changeSelect.bind(this))
    })

    this.labels.forEach(item => {
      item.addEventListener('click', this.listenLebelClick.bind(this))
    })

    const selectedVibes = this.querySelectorAll('.vibe_input')
    
    if(selectedVibes) {
      selectedVibes.forEach(input => {
        if(input.hasAttribute('checked')) input.removeAttribute('checked')
      })
    }

    this.selectionButtons = this.querySelectorAll('.vibe-selection-button')

    this.selectionButtons.forEach(button => {
      button.addEventListener('click', this.selectVibe.bind(this))
    })

    this.vibeTitleEl = this.querySelector('.selected-vibe__title')

    fetch("/cart.js", { method: 'GET', headers: { "Content-Type": "application/json" }})
    .then(res => res.json())
    .then(data => {
      this.cart = data

      this.cart.items.forEach(item => {
        // if(item.properties.ooh_item) this.removable[item.id] = 0
        this.removable[item.id] = 0
      })

      fetch("/cart/update.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          updates: this.removable
        })
      })
    })
  }

  jumpToHandler(e) {
    e.preventDefault()
    const el = e.currentTarget
    const destination = el.getAttribute('href')
    const destinationEl = document.querySelector(destination)

    if(destinationEl) {
      const windowHeight = window.innerHeight;
      const elementHeight = destinationEl.clientHeight;
      const offset = 100;
      window.scrollTo({
        top: destinationEl.offsetTop - offset,
        behavior: "smooth"
      });
    }
  }

  getCookies() {
    var cookiePairs = document.cookie.split(';');
    var cookies = {};
    for (var i = 0; i < cookiePairs.length; i++) {
      var pair = cookiePairs[i].trim()
      var separatorIndex = pair.indexOf('=');
      if (separatorIndex === -1) {
        continue; // Skip invalid cookie pairs
      }
      var key = pair.slice(0, separatorIndex);
      var value = pair.slice(separatorIndex + 1);
      value = decodeURIComponent(value);
      cookies[key] = value;
    }
    return cookies
  }

  handleBlur(e) {
    const targetEl = this.querySelector('.vibe__selector--helper')
    const triggerEl = this.querySelector('.vibe_selection_strip_label')
    
    document.removeEventListener('click', this.handleBlur.bind(this), true)
    
    if(targetEl.contains(e.target) || triggerEl.contains(e.target)) return

    if(targetEl.classList.contains('active')) targetEl.classList.remove('active')
  }

  changeSelect(evt) {
    const el = evt.currentTarget
    const value = el.dataset.value

    this.filter.value = value
    const event = new Event('change')

    this.filter.dispatchEvent(event)

    el.parentNode.classList.remove('active')
  }

  openToggler(e) {
    const el = e.currentTarget
    const isOpen = el.dataset.open
    const toggleEl = this.querySelector('.vibe__selector--helper')
    if(isOpen == 'true') {
      el.setAttribute('data-open', false)
      if(toggleEl) {
        if(toggleEl.classList.contains('active')) toggleEl.classList.remove('active')
      }
      document.removeEventListener('click', this.handleBlur.bind(this), true)
    }
    else {
      el.setAttribute('data-open', true)
      if(toggleEl) {
        if(!toggleEl.classList.contains('active')) toggleEl.classList.add('active')
      }
      document.addEventListener('click', this.handleBlur.bind(this), true)
    }
    
    
  }

  listenLebelClick(e) {
    const el = e.currentTarget
    const input = el.querySelector('input')
    if(input) {
      if(input.disabled) {
        const messageEl = this.querySelector('.error--message[data-error-type="maximum_selection"')
        if(!messageEl.classList.contains('active')) messageEl.classList.add('active')

        setTimeout(() => {
          if(messageEl.classList.contains('active')) messageEl.classList.remove('active')
        }, 3000)
      }
    }
  }

  selectVibe(e) {
    const el = e.currentTarget
    this.filter.value = el.dataset.value

    var event = new Event('change')
    this.filter.dispatchEvent(event)
  }

  handleSubmit(e) {
    e.preventDefault()

    const cookies = this.getCookies()
    if(!cookies.ooh_campaign) {
      if(this.selectedVariants.length < 3) {
        const qty_error = this.querySelector('.error--message[data-error-type="vibe_selection"]')
        if(!qty_error.classList.contains('active')) qty_error.classList.add('active')
        setTimeout(() => {
          if(qty_error.classList.contains('active')) qty_error.classList.remove('active')
        }, 5000)
        return
      }
  
  
      const questionErrorEl = this.querySelector('.error--message[data-error-type="questionire"]')
  
      const formData = new FormData(this.form)
      const q1 = formData.get('question1')
      const q2 = formData.get('question2')

      console.log('Questions................', q1, q2)
  
      if(!q1 || !q2) {
        if(!questionErrorEl.classList.contains('active')) questionErrorEl.classList.add('active')
        setTimeout(() => {
          if(questionErrorEl.classList.contains('active')) questionErrorEl.classList.remove('active')
        }, 5000)
        return
      }
  
      const tnc_field = this.querySelector('input.gush_tnc_checkbox')
      const tnc_error = this.querySelector('.error--message[data-error-type="tnc_error"]')
      if(!tnc_field.checked) {
        if(!tnc_error.classList.contains('active')) tnc_error.classList.add('active')
        setTimeout(() => {
          if(tnc_error.classList.contains('active')) tnc_error.classList.remove('active')
        }, 5000)
        return
      }
  
      const note = `
        What are you painting: ${this.q1}.
        How soon do you want to start painting: ${this.q2}
      `
      
      const data = {
        items: [],
        note: note,
        properties: {
          is_ooh_order: true
        }
      }
  
      this.selectedVariants.forEach(variantId => {
        data.items.push({
          id: variantId,
          quantity: 1
        })
      })
  
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      };
  
      fetch("/cart/add.js", options)
      .then(res => res.json())
      .then(data => {
        const cookieData = {
          checkout: true
        }

        
        document.cookie = "ooh_campaign=" + JSON.stringify(cookieData) + "; expires=3m; path=/";
        window.location.href = '/checkout?discount=ohmygush'

        webengage.track("ohmygush_campaign", {
          "ProductColor1": "Astral",
          "ProductColor2": "KittyKat",
          "ProductColor3": "Malfoy",
          "Number of Selected Products": 3,
          "What are you painting" : q1,
          "How soon you want to start" : q2
        });
      })
      .catch(err => console.log(err))
    }
    else {
      const duplicateErrorEl = this.querySelector('.error--message[data-error-type="duplicate_order"]')
      console.log(duplicateErrorEl)
      if(!duplicateErrorEl.classList.contains('active')) duplicateErrorEl.classList.add('active')
      setTimeout(() => {
        if(duplicateErrorEl.classList.contains('active')) duplicateErrorEl.classList.remove('active')
      }, 5000)
      return
    }

    
  }

  handleFilterChange(e) {
    e.preventDefault()
    const el = e.currentTarget

    const collections = this.querySelectorAll('[data-vibe]')
    const vibe = el.value

    const selectedOption = el.options[el.selectedIndex];
    const vibe_title = selectedOption.dataset.title

    this.updateSelectedVibeTitle(vibe_title)

    collections.forEach(item => {
      const _vibe = item.dataset.vibe
      if(vibe == _vibe) {
        item.setAttribute('data-active', true)
      }
      else {
        item.setAttribute('data-active', false)
      }
    })
  }

  updateSelectedVibeTitle(title) {
    this.vibeTitleEl.innerHTML = title
  }

  handleChange(e) {
    const el = e.target
    const formData = new FormData(this.form)
    const submitBtn = this.form.querySelector('button[type="submit"]')
    if(el.getAttribute('name') == 'vibe') {
      
      const value = el.dataset.title
      const vibes = []
      
      if(el.checked) {
        if(!this.selectedColors.includes(value)) this.selectedColors.push(value)
      }
      else {
        const newArray = this.selectedColors.filter(item => item !== value);
        this.selectedColors = newArray
      }

      formData.getAll('vibe').forEach(vibe => {
        vibes.push(parseInt(vibe))
      })
      this.selectedVariants = vibes

      this.disabledVibeSelection(3, this.selectedVariants.length)
      this.updateSelectedStatus(3, this.selectedVariants.length)
      

      this.colorInfoEl.innerHTML = this.selectedColors.join(', ')

      if(el.checked) this.applyBackground(el.dataset.bgColor)

      this.updateOrderMarker()

      const eyeContainer = this.querySelector('.selection--status')
      if(this.selectedVariants.length == 3) {
        submitBtn.removeAttribute('disabled')
        if(!eyeContainer.classList.contains('active')) eyeContainer.classList.add('active')
      }
      else {
        submitBtn.setAttribute('disabled', true)
        if(eyeContainer.classList.contains('active')) eyeContainer.classList.remove('active')
      }
    }

    if(el.getAttribute('name') == 'question1') {
      this.q1 = el.value
    }

    if(el.getAttribute('name') == 'question2') {
      this.q2 = el.value
    }
  }

  updateOrderMarker() {
    const orderMarkers = this.querySelectorAll('.order-marker span')
    const selectedElements = this.querySelectorAll('input.vibe_input[type="checkbox"]:checked')
    this.selectedColors = []
    selectedElements.forEach(el => this.selectedColors.push(el))

    orderMarkers.forEach((marker, i) => {
      const input = selectedElements[i]
      if(input) {
        const color = input.dataset.bgColor
        if(marker.classList.contains('hidden')) marker.classList.remove('hidden')
        marker.style.background = `${color}`
      }
      else {
        if(!marker.classList.contains('hidden')) marker.classList.add('hidden')
        marker.style.background = `transparent`
      }
    })
  }

  updateSelectedStatus(max, current) {
    this.statusTextEl.innerHTML = `${current}/${max}`
  }

  applyBackground(bg) {
    
    const container = this.querySelector("#ooh_product_filter_section")
    if(container) {
      const currentBg = container.style.backgroundColor
      container.style.background = `${bg}`
      setTimeout(() => {
        container.style.background = "#F2E5FF"
      }, 1000)
    }
  }

  disabledVibeSelection(max, current) {
    const vibesInput = this.querySelectorAll(`.vibe_input`)
    if(max == current) {
      vibesInput.forEach(item => {
        if(!item.checked) item.disabled = true
      })
    }
    else {
      vibesInput.forEach(item => {
        item.disabled = false
      })
    }
  }
}

customElements.define('ooh-campaign-component', OOHCampaignComponent)

class HeightObserver extends HTMLElement {
  constructor() {
    super()
    this.container = this.querySelector(this.dataset.container)
    this.activeSlider = this.querySelector('.vibe__wrapper[data-active="true"] vibe-slider-component')

    document.addEventListener('vibeSlider:inited', this.afterSliderInit.bind(this))
  }

  connectedCallback() {
    // if(this.container) {
    //   this.applyHeight()
    //   this.observeHeight()
    // }
  }

  afterSliderInit(e) {
    this.applyHeight(e.detail.height)
  }

  applyHeight(sliderHeight) {

    let height = 0

    if(sliderHeight) {
      height = sliderHeight
    }
    else {
      height = this.container.scrollHeight
    }
    this.container.style.setProperty('--container-height', `${height}px` || 'auto')
  }

  observeHeight() {
    const resizeObserver = new ResizeObserver(entries => {
      this.applyHeight()
    })

    resizeObserver.observe(this.container);
  }
}

customElements.define('height-observer', HeightObserver)

class VibeSliderComponent extends HTMLElement {
  constructor() {
    super()
    this.container = this.querySelector(this.dataset.container)
  }

  connectedCallback() {
    const paginationEl = this.querySelector('.pagination')
    
    let pagination = false
    let navigation = false

    const nextEl = this.querySelector('.prev-next-btn-next')
    const prevEl = this.querySelector('.prev-next-btn-prev')

    if(nextEl && prevEl) {
      navigation = {
        nextEl: nextEl,
        prevEl: prevEl,
      }
    }

    if(paginationEl) {
      pagination = {
        el: paginationEl,
        type: "fraction",
      }
    }
    
    this.slider = new Swiper(this.container, {
      slidesPerView: 3,
      slidesPerGroup: 3,
      spaceBetween: 15,
      grid: {
        rows: 2,
        fill: "row"
      },
      pagination: pagination,
      navigation: navigation,
      breakpoints: {
        740: {
          spaceBetween: 40
        }
      },
      on: {
        afterInit: slider => {
          const event = new CustomEvent('vibeSlider:inited', {
            detail: {
              height: slider.height,
              wrapper: slider.wrapperEl
            }
          })
          document.dispatchEvent(event)
        },
        resize: slider => {
          const event = new CustomEvent('vibeSlider:inited', {
            detail: {
              height: slider.height,
              wrapper: slider.wrapperEl
            }
          })
          document.dispatchEvent(event)
        }
      }
    })
  }
}

customElements.define('vibe-slider-component', VibeSliderComponent)


class VibeSelectionSlider extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.container = this.querySelector('.swiper')
    let navigation = false
    
    const nextEl = this.querySelector('.vibe--selection__prev-next-btn-next')
    const prevEl = this.querySelector('.vibe--selection__prev-next-btn-prev')

    if(nextEl && prevEl) {
      navigation = {
        nextEl: nextEl,
        prevEl: prevEl,
      }
    }
    
    this.slider = new Swiper(this.container, {
      slidesPerView: 1,
      navigation: navigation
    })
  }
}
customElements.define('vibe-selection-slider', VibeSelectionSlider)

class OOHErrors extends HTMLElement {
  constructor() {
    super()
    this.errorClasses = {
      vibeSelection: `[data-error-type="vibeSelection"]`,
      maximumLimit: `[data-error-type="maximumLimit"]`,
      tncError: `[data-error-type="tncError"]`
    }
  }
  connectedCallback() {
    document.addEventListener('ooh:error', this.triggerErrorMessage.bind(this))
  }

  triggerErrorMessage(evt) {
    const errorType = e.detail.type
    if(errorType) {
      const errorEl = this.querySelector(`${this.errorClasses[errorType]}`)
    }
  }
}

