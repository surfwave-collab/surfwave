import './style.css'

const SHEETDB_API = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS4GkvDeMa2vkauFrXghkMCjpzcyJiuwTREQLz5QmaNdAyS4Cr4PtcLZkQwXOeOIUzJggPLNV1XjVAG/pub?output=csv'

// ฟังก์ชันแปลง CSV เป็น JSON อัตโนมัติ เพื่อให้เว็บอ่านข้อมูลได้เหมือนเดิม
async function fetchProductsFromCSV(url) {
  const response = await fetch(url);
  const text = await response.text();
  const rows = text.split('\n').map(row => {
    // จัดการเคสเครื่องหมายคำพูดใน CSV
    const values = [];
    let inQuote = false;
    let currentValue = '';
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (char === '"') {
        inQuote = !inQuote;
      } else if (char === ',' && !inQuote) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());
    return values;
  });

  const headers = rows[0].map(h => h.replace(/^"|"$/g, '').trim());
  return rows.slice(1).filter(row => row.length === headers.length && row[0]).map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      let val = row[index] || '';
      val = val.replace(/^"|"$/g, '').trim();
      obj[header] = val;
    });
    return obj;
  });
}
const INSTAGRAM_USERNAME = 'surfwave.vtg' // เปลี่ยนเป็นไอจีร้านของคุณ

let currentLang = 'th' // ค่าเริ่มต้นภาษาไทย

const translations = {
  th: {
    brandSubtitle: 'SURF & VINTAGE ',
    instagram: 'INSTAGRAM ↗',
    eyebrow: 'Surfwave Archive · SURF · VINTAGE',
    heroTitleHtml: 'โต้คลื่นไปกับไอเท็มเหนือกาลเวลา</em>',
    heroCopy: 'The archive of ocean culture',
    heroButton: 'เลือกดูสินค้า ↓',
    archiveEyebrow: 'SURFWAVE ARCHIVE',
    catalogTitle: 'สินค้าทั้งหมด',
    searchPlaceholder: 'ค้นหาชื่อสินค้า...',
    allCategories: 'ทุกหมวด',
    allStatuses: 'สินค้าทั้งหมด',
    availableStatus: 'Available',
    soldStatus: 'Sold',
    emptyState: 'ไม่พบสินค้าที่ค้นหา',
    footerCopy: 'Good finds, good tides.',
    footerLink: 'ติดตามร้านบน Instagram ↗',
    sizeLabel: 'ไซซ์',
    conditionLabel: 'สภาพ',
    statusLabel: 'สถานะ',
    noDescription: 'ไม่มีรายละเอียดเพิ่มเติม',
    orderButton: 'สอบถาม / สั่งซื้อทาง Instagram ↗',
    copyHint: 'คัดลอกข้อความด้านล่าง แล้วนำไปวางในแชต Instagram',
    copyButton: 'คัดลอกข้อความ',
    copiedText: 'คัดลอกแล้ว เปิดแชต Instagram แล้ววางข้อความได้เลย',
    copyFailed: 'เลือกข้อความไว้แล้ว กดคัดลอก แล้วนำไปวางในแชต Instagram',
    soldNote: 'สินค้าชิ้นนี้ขายแล้ว',
    orderMsg: (name, id, url) => `สวัสดีค่ะ/ครับ สนใจซื้อสินค้าชิ้นนี้ครับ/ค่ะ\nชื่อ: ${name} (รหัส ${id})\nลิงก์สินค้า: ${url}`
  },
  en: {
    brandSubtitle: 'SURF & VINTAGE ',
    instagram: 'INSTAGRAM ↗',
    eyebrow: 'Surfwave Archive · SURF · VINTAGE',
    heroTitleHtml: 'Riding waves and timeless pieces</em>',
    heroCopy: 'The archive of ocean culture',
    heroButton: 'Explore Collection ↓',
    archiveEyebrow: 'SURFWAVE ARCHIVE',
    catalogTitle: 'All Products',
    searchPlaceholder: 'Search products...',
    allCategories: 'All Categories',
    allStatuses: 'All Status',
    availableStatus: 'Available',
    soldStatus: 'Sold',
    emptyState: 'No products found',
    footerCopy: 'Good finds, good tides.',
    footerLink: 'Follow on Instagram ↗',
    sizeLabel: 'Size',
    conditionLabel: 'Condition',
    statusLabel: 'Status',
    noDescription: 'No additional details provided.',
    orderButton: 'Inquire / Order via Instagram ↗',
    copyHint: 'Copy the message below and paste it into Instagram chat',
    copyButton: 'Copy Message',
    copiedText: 'Copied! Open Instagram chat and paste the message.',
    copyFailed: 'Text selected. Copy it and paste into Instagram chat.',
    soldNote: 'This item is sold out.',
    orderMsg: (name, id, url) => `Hi! I am interested in this item:\nName: ${name} (ID: ${id})\nLink: ${url}`
  }
}

const sampleProducts = [
  {
    id: 'SW001',
    name: 'Vintage Sample Item',
    category: 'Shirts',
    price: '850',
    size: 'L',
    condition: 'Great',
    description: 'Sample item. Please replace with your Google Sheets data.',
    status: 'available',
    image1: '',
    image2: '',
    image3: '',
  },
]

const app = document.querySelector('#app')
let products = []

const categoryImages = {
  'all': 'https://media.discordapp.net/attachments/1573650314857422858/1573703405862387782/7ce9f3091f0b7724f4a403f658cd1900.png?ex=6b02f901&is=6b01a781&hm=b0352dd4151607f024bede464f9973b1a3534734ec1d239e864233da234bd635&format=webp&quality=lossless&width=315&height=350',
  'Boardshorts': 'https://media.discordapp.net/attachments/1573650314857422858/1573703146147152042/723976959_18089096168119062_8182039262938932493_n.png?ex=6b02f8c4&is=6b01a744&hm=1e78b414facdc5d4eb79884d0ad526c4b9cca86b07a57dbbde2ce8d5b8c3bc15&format=webp&quality=lossless&width=784&height=784',
  'T-SHIRT': 'https://media.discordapp.net/attachments/1573650314857422858/1573702762904953004/900634902_18109545605119062_1945479826964785950_n.png?ex=6b02f868&is=6b01a6e8&hm=e678a5beed0a19f41837da543acca337ca2b537d44a0b51388576296eac50ef9&format=webp&quality=lossless&width=588&height=784',
  'SWEATSHIRTS': 'https://media.discordapp.net/attachments/1573650314857422858/1573712483674230804/755390438_18094805393119062_8801441992495232438_n.png?ex=6b030176&is=6b01aff6&hm=021c023b88cab4682fd0afc85fa3a011f5b3792890bb88eaae2dc896e6b0d663&format=webp&quality=lossless&width=588&height=784',

}

function escapeHTML(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  })[char])
}

function safeImageUrl(value) {
  try {
    const url = new URL(String(value || ''))
    return ['https:', 'http:'].includes(url.protocol) ? url.href : ''
  } catch {
    return ''
  }
}

function isSold(product) {
  const status = String(product.status || '').toLowerCase()
  return status === 'sold' || status.includes('ขายแล้ว')
}

function formatPrice(value) {
  const number = Number(String(value || '').replace(/,/g, ''))
  return Number.isFinite(number)
    ? `${number.toLocaleString('th-TH')} ฿`
    : `${escapeHTML(value)} ฿`
}

function renderPage() {
  const t = translations[currentLang]
  const categories = [...new Set(
    products.map((product) => String(product.category || '').trim()).filter(Boolean),
  )]

  app.innerHTML = `
    <header class="site-header">
      <a class="brand" href="#">
        <img class="brand-logo" src="https://media.discordapp.net/attachments/1573369469407989822/1573646993962836029/829339873_18103738355119062_8169741796844273233_n.jpg?ex=6b02c478&is=6b0172f8&hm=49b929be9d9c06de3bf5e82a1fc684453527b25b078578781cbf2034aaf95697&format=webp" />
        <span>SURFWAVE<span class="brand-subtitle">${t.brandSubtitle}</span></span>
      </a>

      <div class="header-right">
        <button id="langToggle" class="lang-toggle" type="button">
          ${currentLang === 'th' ? 'EN 🇬🇧' : 'TH 🇹🇭'}
        </button>
        <a class="instagram-link"
           href="https://www.instagram.com/${encodeURIComponent(INSTAGRAM_USERNAME)}"
           target="_blank" rel="noreferrer">${t.instagram}</a>
      </div>
    </header>

        <section class="hero">
      <p class="eyebrow">${t.eyebrow}</p>
      <h1>${t.heroTitleHtml}</h1>
      <p class="hero-copy">${t.heroCopy}</p>
      <a class="hero-button" href="#catalog">${t.heroButton}</a>
    </section>

    <section class="category-carousel-section">
      <div class="category-header">
        <h2>CATEGORIES</h2>
        <div class="carousel-arrows">
          <button id="scrollLeft" type="button" aria-label="Previous">‹</button>
          <button id="scrollRight" type="button" aria-label="Next">›</button>
        </div>
      </div>
      <div id="categoryCarousel" class="category-carousel">
        <button class="cat-card all-card" type="button" data-cat="" style="${categoryImages[''] || categoryImages['all'] ? `background-image: linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2)), url('${escapeHTML(categoryImages[''] || categoryImages['all'])}'); background-size: cover; background-position: center;` : ''}">
          <span class="cat-title">ALL</span>
          <span class="cat-count">ITEMS</span>
        </button>
        ${categories.sort((a, b) => {
          const order = ['T-SHIRT','boardshorts','SWEATSHIRTS']
          const indexA = order.indexOf(a)
          const indexB = order.indexOf(b)
          
          if (indexA !== -1 && indexB !== -1) return indexA - indexB
          if (indexA !== -1) return -1
          if (indexB !== -1) return 1
          return a.localeCompare(b)
        }).map((cat) => {
          const catLower = String(cat).trim().toLowerCase()
          const matchedKey = Object.keys(categoryImages).find(k => k.trim().toLowerCase() === catLower)
          const bgImage = matchedKey ? categoryImages[matchedKey] : ''
          
          return `
            <button class="cat-card" type="button" data-cat="${escapeHTML(cat)}" style="${bgImage ? `background-image: url('${escapeHTML(bgImage)}'); background-size: cover; background-position: center;` : ''}">
              <span class="cat-title">${escapeHTML(cat).toUpperCase()}</span>
            </button>
          `
        }).join('')}
    </section>

    <main id="catalog" class="catalog">
      <div class="section-heading">
        <div>
          <p class="eyebrow">${t.archiveEyebrow}</p>
          <h2>${t.catalogTitle}</h2>
        </div>
        <span id="productCount" class="product-count"></span>
      </div>

      <div class="filters">
        <input id="searchInput" type="search" placeholder="${t.searchPlaceholder}" aria-label="${t.searchPlaceholder}" />
        <select id="categoryFilter" aria-label="Category">
          <option value="">${t.allCategories}</option>
          ${categories.map((category) =>
            `<option value="${escapeHTML(category)}">${escapeHTML(category)}</option>`,
          ).join('')}
        </select>
        <select id="statusFilter" aria-label="Status">
          <option value="all">${t.allStatuses}</option>
          <option value="available">${t.availableStatus}</option>
          <option value="sold">${t.soldStatus}</option>
        </select>
      </div>

      <div id="productGrid" class="product-grid"></div>
      <p id="loadMessage" class="load-message"></p>
    </main>

    <footer class="site-footer">
      <div>
        <strong>SURFWAVE</strong>
        <p>${t.footerCopy}</p>
      </div>
      <a href="https://www.instagram.com/${encodeURIComponent(INSTAGRAM_USERNAME)}"
         target="_blank" rel="noreferrer">${t.footerLink}</a>
    </footer>

    <dialog id="detailDialog" class="detail-dialog">
      <button class="dialog-close" type="button" aria-label="Close">×</button>
      <div id="dialogContent"></div>
    </dialog>
  `

  document.querySelector('#langToggle').addEventListener('click', () => {
    currentLang = currentLang === 'th' ? 'en' : 'th'
    renderPage()
  })

  document.querySelector('#searchInput').addEventListener('input', drawProducts)
  document.querySelector('#categoryFilter').addEventListener('change', drawProducts)
  document.querySelector('#statusFilter').addEventListener('change', drawProducts)

  document.querySelector('#productGrid').addEventListener('click', (event) => {
    const button = event.target.closest('[data-open]')
    if (!button) return
    const product = products.find((item) => String(item.id) === button.dataset.open)
    if (product) openDetails(product)
  })

  const dialog = document.querySelector('#detailDialog')
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close())
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close()
  })

  document.querySelectorAll('.cat-card').forEach((card) => {
    card.addEventListener('click', () => {
      const selectedCat = card.dataset.cat
      const categorySelect = document.querySelector('#categoryFilter')
      if (categorySelect) {
        categorySelect.value = selectedCat
        drawProducts()
        document.querySelector('#catalog').scrollIntoView({ behavior: 'smooth' })
      }
    })
  })

  const carousel = document.querySelector('#categoryCarousel')
  document.querySelector('#scrollLeft')?.addEventListener('click', () => {
    carousel.scrollBy({ left: -300, behavior: 'smooth' })
  })
  document.querySelector('#scrollRight')?.addEventListener('click', () => {
    carousel.scrollBy({ left: 300, behavior: 'smooth' })
  })

  drawProducts()
}

function drawProducts() {
  const t = translations[currentLang]
  const search = document.querySelector('#searchInput').value.trim().toLowerCase()
  const category = document.querySelector('#categoryFilter').value
  const status = document.querySelector('#statusFilter').value

  const filtered = products.filter((product) => {
    const sold = isSold(product)
    const matchesSearch = `${product.name || ''} ${product.category || ''}`
      .toLowerCase()
      .includes(search)
    const matchesCategory = !category || product.category === category
    const matchesStatus =
      status === 'all' ||
      (status === 'sold' && sold) ||
      (status === 'available' && !sold)

    return matchesSearch && matchesCategory && matchesStatus
  })

  document.querySelector('#productCount').textContent = `${filtered.length} ITEMS`

  document.querySelector('#productGrid').innerHTML = filtered.length
    ? filtered.map((product) => {
        const firstImage = safeImageUrl(product.image1)
        const image = firstImage || 'https://placehold.co/600x750?text=SurfWave'
        const sold = isSold(product)

        return `
          <button class="product-card" type="button" data-open="${escapeHTML(product.id)}">
            <span class="product-image-wrap">
              <img class="product-image" src="${escapeHTML(image)}"
                   alt="${escapeHTML(product.name || 'SurfWave Product')}" loading="lazy" />
              <span class="status-badge ${sold ? 'sold' : ''}">
                ${sold ? t.soldStatus : t.availableStatus}
              </span>
            </span>
            <span class="product-info">
              <span class="product-category">${escapeHTML(product.category || 'SURF GOODS')}</span>
              <span class="product-name">${escapeHTML(product.name || 'Unnamed')}</span>
              <span class="product-price">${formatPrice(product.price)}</span>
            </span>
          </button>
        `
      }).join('')
    : `<p class="empty-state">${t.emptyState}</p>`
}

function openDetails(product) {
  const t = translations[currentLang]
  const dialog = document.querySelector('#detailDialog')
  const content = document.querySelector('#dialogContent')

  const images = [product.image1, product.image2, product.image3]
    .map(safeImageUrl)
    .filter(Boolean)

  const mainImage = images[0] || 'https://placehold.co/700x850?text=SurfWave'
  const sold = isSold(product)
  const username = INSTAGRAM_USERNAME.replace(/^@/, '')
  const instagramUrl = `https://ig.me/m/${username}`;
  const productUrl = window.location.href.split('#')[0] + '#item-' + encodeURIComponent(product.id || '')
  const message = t.orderMsg(product.name || '', product.id || '', productUrl)

  content.innerHTML = `
    <div class="detail-layout">
      <div class="detail-gallery">
        <img id="mainDetailImage" class="detail-main-image"
             src="${escapeHTML(mainImage)}" alt="${escapeHTML(product.name || 'Product Image')}" />
        ${images.length > 1 ? `
          <div class="thumbnail-row">
            ${images.map((image, index) => `
              <button type="button" class="thumbnail-button" data-photo="${index}">
                <img src="${escapeHTML(image)}" alt="Thumbnail ${index + 1}" />
              </button>
            `).join('')}
          </div>` : ''}
      </div>

      <div class="detail-info">
        <p class="eyebrow">${escapeHTML(product.category || 'SURF GOODS')} · ${escapeHTML(product.id || '')}</p>
        <h2>${escapeHTML(product.name || 'Unnamed')}</h2>
        <p class="detail-price">${formatPrice(product.price)}</p>
        <div class="detail-facts">
          <p><strong>${t.sizeLabel}</strong><span>${escapeHTML(product.size || '-')}</span></p>
          <p><strong>${t.conditionLabel}</strong><span>${escapeHTML(product.condition || '-')}</span></p>
          <p><strong>${t.statusLabel}</strong><span>${sold ? t.soldStatus : t.availableStatus}</span></p>
        </div>
        <p class="detail-description">${escapeHTML(product.description || t.noDescription)}</p>
        ${sold 
          ? `<p class="sold-note">${escapeHtml(t.soldNote)}</p>` 
          : `<a class="order-button" href="${escapeHtml(instagramUrl)}" target="_blank" rel="noreferrer">สั่งซื้อสินค้า</a>`}
        


      </div>
    </div>
  

  content.querySelectorAll('[data-photo]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelector('#mainDetailImage').src = images[Number(button.dataset.photo)]
    })
  })

  const copyButton = document.querySelector('#copyMessage')
  if (copyButton) {
    copyButton.addEventListener('click', async () => {
      const text = document.querySelector('#orderMessage').value
      try {
        await navigator.clipboard.writeText(text)
        document.querySelector('#copyStatus').textContent = t.copiedText
      } catch {
        document.querySelector('#orderMessage').focus()
        document.querySelector('#orderMessage').select()
        document.querySelector('#copyStatus').textContent = t.copyFailed
      }
    })
  }

  dialog.showModal()
}

async function start() {
  try {
    // เปลี่ยนมาดึงข้อมูลผ่าน CSV ที่เราเขียนไว้ด้านบน
    products = await fetchProductsFromCSV(SHEETDB_API)
    renderPage()
  } catch (error) {
    console.error('Error loading products:', error)
    products = sampleProducts
    renderPage()
  }

  // เปิดสินค้าอัตโนมัติถ้ามี #item- ในลิงก์
  const hash = window.location.hash
  if (hash.startsWith('#item-')) {
    const targetId = hash.replace('#item-', '')
    const found = products.find((item) => String(item.id) === targetId)
    if (found) openDetails(found)
  }
}

start()