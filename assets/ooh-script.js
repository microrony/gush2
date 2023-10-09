class OOHCampaignComponent extends HTMLElement {
  constructor() {
    super()
    
    this.form = this.querySelector('#vibe-selection')
    this.filter = this.form.querySelector('select#collection-filter-select')
    
    this.selectedColors = []
    this.colorInfoEl = this.querySelector('#selected_colors span')

    this.selectedVariants = []
    
    this.q1 = ""
    this.q2 = ""
  }

  connectedCallback() {
    this.form.addEventListener('change', this.handleChange.bind(this))
    this.filter.addEventListener('change', this.handleFilterChange.bind(this))
    this.form.addEventListener('submit', this.handleSubmit.bind(this))

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

  handleSubmit(e) {
    e.preventDefault()

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
      if (vibe === _vibe) {
        if (item.classList.contains('hidden')) item.classList.remove('hidden')
      }
      else {
        if (!item.classList.contains('hidden')) item.classList.add('hidden')
      }
    })
  }

  updateSelectedVibeTitle(title) {
    this.vibeTitleEl.innerHTML = title
  }

  handleChange(e) {
    const el = e.target
    const formData = new FormData(this.form)
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
      

      this.colorInfoEl.innerHTML = this.selectedColors.join(', ')
      console.log(this.selectedVariants)
    }

    if(el.getAttribute('name') == 'question1') {
      this.q1 = el.value
    }

    if(el.getAttribute('name') == 'question2') {
      this.q2 = el.value
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