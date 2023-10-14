class OOHCampaignComponent extends HTMLElement {
  constructor() {
    super()
    
    this.form = this.querySelector('#vibe-selection')
    this.filter = this.form.querySelector('select#collection-filter-select')
    
    this.selectedColors = []
    this.colorInfoEl = this.querySelector('#selected_colors span')

    this.statusTextEl = this.querySelector('.text--status')

    this.selectedVariants = []
    
    this.q1 = ""
    this.q2 = ""

    this.cart = {}
    
    this.removable = {}
  }

  connectedCallback() {
    this.form.addEventListener('change', this.handleChange.bind(this))
    this.filter.addEventListener('change', this.handleFilterChange.bind(this))
    this.form.addEventListener('submit', this.handleSubmit.bind(this))
    this.errorMessage = this.querySelector('.error--message')

    this.labels = this.querySelectorAll('.vibe_label')

    this.labels.forEach(item => {
      item.addEventListener('click', this.listenLebelClick.bind(this))
    })

    const selectedVibes = this.querySelectorAll('.vibe_input')
    
    if(selectedVibes) {
      selectedVibes.forEach(input => {
        console.log(input.checked)
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
        console.log(item, item.id)
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
      note: note
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
      console.log(data)
      window.location.href = '/checkout?discount=CAMPAIGN100'
    })
    .catch(err => console.log(err))
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
      console.log(this.selectedVariants)

      if(el.checked) this.applyBackground(el.dataset.bgColor)

      this.updateOrderMarker()

      const eyeContainer = this.querySelector('.selection--status')
      if(this.selectedVariants.length == 3) {
        this.submitBtn.removeAttribute('disabled')
        if(!eyeContainer.classList.contains('active')) eyeContainer.classList.add('active')
      }
      else {
        this.submitBtn.addAttribute('disabled', true)
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
    console.log(bg)
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
    console.log('Inited: ', e.detail)
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
    console.log(height)
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
      console.log(errorEl)
    }
  }
}

