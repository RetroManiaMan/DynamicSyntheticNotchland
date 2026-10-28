;(function () {
  const app = document.getElementById('app')
  const state = { view: 'home', value: '', feedback: '', sidebarExpanded: true, bookmarks: [] }
  const enhancementStyle = document.createElement('style')
  enhancementStyle.textContent = `.nt-sidebar svg,.nt-brand svg,.nt-profile svg,.nt-sidebar-toggle svg,.nt-actions svg,.nt-quick-access-add svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}.nt-sidebar{width:56px;flex-basis:56px;overflow:hidden;align-items:center;transition:width .62s cubic-bezier(.16,1,.3,1),flex-basis .62s cubic-bezier(.16,1,.3,1),padding .62s cubic-bezier(.16,1,.3,1)}.nt-sidebar.is-expanded{width:190px;flex-basis:190px;align-items:stretch}.nt-brand{flex:0 0 34px;justify-content:center;overflow:hidden;white-space:nowrap;transition:justify-content .5s cubic-bezier(.16,1,.3,1),padding .62s cubic-bezier(.16,1,.3,1),gap .62s cubic-bezier(.16,1,.3,1)}.nt-brand svg{width:29px;height:29px;flex:0 0 29px;transition:width .58s cubic-bezier(.16,1,.3,1),height .58s cubic-bezier(.16,1,.3,1)}.nt-brand>span:last-child{display:block;max-width:0;overflow:hidden;opacity:0;transform:translateX(-12px);font-size:15px;font-weight:700;letter-spacing:.15em;transition:max-width .55s cubic-bezier(.16,1,.3,1),opacity .32s ease,transform .55s cubic-bezier(.16,1,.3,1)}.nt-sidebar.is-expanded .nt-brand{justify-content:flex-start;padding-left:8px;gap:10px}.nt-sidebar.is-expanded .nt-brand svg{width:31px;height:31px}.nt-sidebar.is-expanded .nt-brand>span:last-child{max-width:52px;opacity:1;transform:translateX(0)}.nt-nav{flex:0 0 auto;width:100%;}.nt-nav button{width:38px;transition:width .62s cubic-bezier(.16,1,.3,1),grid-template-columns .62s cubic-bezier(.16,1,.3,1),padding .62s cubic-bezier(.16,1,.3,1),gap .62s cubic-bezier(.16,1,.3,1),color .3s ease,background .3s ease,transform .3s ease}.nt-sidebar.is-expanded .nt-nav button{width:100%;grid-template-columns:24px 1fr;justify-items:start;padding:0 12px;gap:13px}.nt-nav button span,.nt-profile span,.nt-sidebar-toggle span{display:block;max-width:0;overflow:hidden;opacity:0;white-space:nowrap;transform:translateX(-14px);transition:max-width .52s cubic-bezier(.16,1,.3,1),opacity .28s ease,transform .52s cubic-bezier(.16,1,.3,1)}.nt-sidebar.is-expanded .nt-nav button span,.nt-sidebar.is-expanded .nt-profile span,.nt-sidebar.is-expanded .nt-sidebar-toggle span{max-width:110px;opacity:1;transform:translateX(0);font-size:13px}.nt-sidebar-spacer{flex:1;min-height:24px}.nt-profile,.nt-sidebar-toggle{display:flex;align-items:center;justify-content:center;gap:12px;width:100%;min-height:38px;padding:0;border:0;border-radius:10px;color:rgba(255,255,255,.5);background:transparent;cursor:pointer;transition:justify-content .5s cubic-bezier(.16,1,.3,1),padding .62s cubic-bezier(.16,1,.3,1),color .3s ease,background .3s ease}.nt-sidebar.is-expanded .nt-profile,.nt-sidebar.is-expanded .nt-sidebar-toggle{justify-content:flex-start;padding:0 12px}.nt-profile:hover,.nt-sidebar-toggle:hover{color:#d4f11e;background:rgba(212,241,30,.08)}.nt-profile b{display:none;margin-left:auto;padding:2px 5px;border-radius:8px;color:#111;background:#d4f11e;font-size:9px}.nt-sidebar.is-expanded .nt-profile b{display:block}.nt-sidebar-toggle svg{transition:transform .62s cubic-bezier(.16,1,.3,1)}.nt-sidebar.is-expanded .nt-sidebar-toggle svg{transform:rotate(180deg)}.nt-search-form{width:min(720px,100%)}.nt-search-wrap{min-height:54px}.nt-quick-access-add{display:grid;place-items:center;width:42px;height:42px;border:1px solid rgba(255,255,255,.08);border-radius:12px;color:rgba(255,255,255,.55);background:rgba(255,255,255,.035);cursor:pointer}.nt-quick-access-add:hover{border-color:rgba(212,241,30,.23);color:#d4f11e;background:rgba(212,241,30,.06)}.nt-actions svg{width:14px;height:14px;vertical-align:middle}.nt-actions button{display:flex;align-items:center;justify-content:center;gap:7px}.nt-bookmark{font-weight:600}`
  document.head.appendChild(enhancementStyle)
  const settingsButtonStyle = document.createElement('style')
  settingsButtonStyle.textContent = '.nt-settings-gear{position:fixed;right:18px;bottom:16px;z-index:8;display:grid;place-items:center;width:38px;height:38px;border:1px solid rgba(255,255,255,.08);border-radius:11px;color:rgba(255,255,255,.5);background:rgba(255,255,255,.04);cursor:pointer}.nt-settings-gear:hover{border-color:rgba(212,241,30,.25);color:#d4f11e;background:rgba(212,241,30,.08)}'
  document.head.appendChild(settingsButtonStyle)
  const links = [
    ['Google', 'https://google.com'],
    ['GitHub', 'https://github.com'],
    ['YouTube', 'https://youtube.com'],
  ]
  try { state.bookmarks = JSON.parse(localStorage.getItem('dsn-notchtab-bookmarks') || '[]') } catch (_) { state.bookmarks = [] }
  const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
  const isWebUrl = (value) => { try { const u = new URL(String(value)); return u.protocol === 'http:' || u.protocol === 'https:' } catch (_) { return false } }
  state.bookmarks = (Array.isArray(state.bookmarks) ? state.bookmarks : []).filter((item) => item && typeof item.label === 'string' && isWebUrl(item.url)).slice(0, 100)
  const saveBookmarks = () => localStorage.setItem('dsn-notchtab-bookmarks', JSON.stringify(state.bookmarks))
  const icons = { star: '<svg viewBox="0 0 24 24"><path d="M12 2 13.5 10.5 22 12l-8.5 1.5L12 22l-1.5-8.5L2 12l8.5-1.5Z"/></svg>', home: '<svg viewBox="0 0 24 24"><path d="m3 9.5 9-6 9 6V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/></svg>', search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>', commands: '<svg viewBox="0 0 24 24"><path d="m4 17 6-6-6-6M12 19h8"/></svg>', apps: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>', bookmark: '<svg viewBox="0 0 24 24"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/></svg>', user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/></svg>', plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>', chevron: '<svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>', close: '<svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>' }

  const time = () => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  const date = () => new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })

  function parse(value) {
    const trimmed = value.trim()
    if (!trimmed) return { type: 'empty' }
    if (!trimmed.startsWith('/')) return { type: 'search', query: trimmed }
    const parts = trimmed.slice(1).trim().split(/\s+/).filter(Boolean)
    return { type: 'command', command: (parts[0] || '').toLowerCase(), args: parts.slice(1) }
  }

  function route(value) {
    const parsed = parse(value)
    if (parsed.type === 'empty' || parsed.type === 'search') return parsed
    const argument = parsed.args.join(' ')

    if (parsed.command === 'search') {
      return argument ? { type: 'search', query: argument } : { type: 'error', message: '/search requires a query.' }
    }

    if (parsed.command === 'open') {
      if (!argument) return { type: 'error', message: '/open requires a URL.' }
      const normalized = argument.includes('://') ? argument : `https://${argument}`
      try {
        const url = new URL(normalized)
        if (!['http:', 'https:'].includes(url.protocol)) throw new Error('scheme')
        return { type: 'open', url: normalized, message: `Opening ${url.hostname}...` }
      } catch {
        return { type: 'error', message: "That doesn't appear to be a valid URL." }
      }
    }

    if (parsed.command === 'newtab') return { type: 'newtab' }
    if (parsed.command === 'help' || parsed.command === 'commands') {
      return { type: 'help', message: 'Commands: /search <query>, /open <url>, /newtab, /help' }
    }
    return { type: 'error', message: 'Unknown command. Try /help.' }
  }

  function submit() {
    const result = route(state.value)
    if (result.type === 'empty') return
    if (result.type === 'search') {
      window.location.href = `https://www.google.com/search?q=${encodeURIComponent(result.query)}`
      return
    }
    if (result.type === 'open') {
      window.location.href = result.url
      return
    }
    if (result.type === 'newtab') {
      if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
        chrome.runtime.sendMessage({ type: 'dsn:browser-action', action: { type: 'newtab' } }, (response) => {
          if (chrome.runtime.lastError || response?.ok === false) {
            state.feedback = 'The browser action could not be completed.'
            state.view = 'commands'
            render()
          }
        })
      }
      return
    }
    state.feedback = result.message
    state.view = 'commands'
    render()
  }

  function render() {
    app.replaceChildren()
    const page = document.createElement('div')
    page.className = 'nt-page'
    page.innerHTML = `<div class="nt-ambient"></div>
      <aside class="nt-sidebar ${state.sidebarExpanded ? 'is-expanded' : ''}">
        <button class="nt-brand" type="button" aria-label="Toggle sidebar"><span class="nt-brand-mark">${icons.star}</span><span>DSN</span></button>
        <nav class="nt-nav">
          <button data-view="home">${icons.home}<span>Home</span></button>
          <button data-view="commands">${icons.commands}<span>Commands</span></button>
          <button data-view="apps">${icons.apps}<span>Apps</span></button>
          <button data-view="bookmarks">${icons.bookmark}<span>Bookmarks</span></button>
        </nav>
        <div class="nt-sidebar-spacer"></div><button class="nt-profile" type="button">${icons.user}<span>Profile</span></button><button class="nt-sidebar-toggle" type="button">${icons.chevron}<span>Collapse</span></button>
      </aside>
      <main class="nt-main">
        <div class="nt-clock"><strong>${time()}</strong><span>${date()}</span></div>
        <section class="nt-hero">
          <div class="nt-identity">Notchland</div>
          <p class="nt-subtitle">The environment behind the notch.</p>
          <div id="view"></div>
          <div class="nt-feedback" id="feedback" hidden></div>
          <div class="nt-actions">
            <button data-view="home">${icons.search} <span>Search</span></button>
            <button data-view="commands">${icons.commands} <span>Commands</span></button>
            <button data-view="apps">${icons.apps} <span>Apps</span></button>
          </div>
        </section>
        <section class="nt-quick-access"><span>Quick Access</span><div>${links.map(([label, url]) => `<a href="${url}" aria-label="${label}" title="${label}">${label.slice(0, 1)}</a>`).join('')}${state.bookmarks.map((item) => `<a class="nt-bookmark" href="${esc(item.url)}" aria-label="${esc(item.label)}" title="${esc(item.label)}">${esc(item.label.charAt(0).toUpperCase())}</a>`).join('')}<button class="nt-quick-access-add" type="button" aria-label="Add bookmark">${icons.plus}</button></div></section>
      </main>`
    app.appendChild(page)
    const settingsButton = document.createElement('button')
    settingsButton.type = 'button'
    settingsButton.className = 'nt-settings-gear'
    settingsButton.textContent = '⚙'
    settingsButton.setAttribute('aria-label', 'Open DSN settings')
    settingsButton.title = 'Settings'
    settingsButton.addEventListener('click', () => chrome.runtime.openOptionsPage())
    page.querySelector('.nt-profile')?.addEventListener('click', () => chrome.tabs.create({ url: chrome.runtime.getURL('settings.html#account') }))
    page.appendChild(settingsButton)
    window.DSNFeedbackPrompt?.(page)

    const view = page.querySelector('#view')
    if (state.view === 'apps') {
      view.innerHTML = `<div class="nt-apps">
        <button class="nt-app-card" data-view="home"><span class="nt-app-icon">⌕</span><strong>Search</strong><small>Search the web</small></button>
        <button class="nt-app-card" data-view="commands"><span class="nt-app-icon">/</span><strong>Commands</strong><small>Run DSN commands</small></button>
      </div>`
    } else {
      view.innerHTML = `<form class="nt-search-form"><div class="nt-search-wrap"><span class="nt-search-icon">${state.view === 'commands' ? '⌘' : '⌕'}</span><input id="search" value="" placeholder="Search the web or type a command..." autocomplete="off" aria-label="Search the web or type a command"><kbd>Enter</kbd></div></form>`
      const input = page.querySelector('#search')
      input.value = state.value
      input.focus()
      input.setSelectionRange(input.value.length, input.value.length)
      input.oninput = () => { state.value = input.value }
      input.onkeydown = (event) => {
        if (event.key === 'Escape') {
          state.view = 'home'
          state.feedback = ''
          render()
        }
      }
      view.querySelector('form').onsubmit = (event) => {
        event.preventDefault()
        submit()
      }
    }

    const feedback = page.querySelector('#feedback')
    if (state.feedback) {
      feedback.hidden = false
      feedback.textContent = state.feedback
    }

    page.querySelectorAll('[data-view]').forEach((button) => {
      button.onclick = () => {
        state.view = ['search', 'bookmarks'].includes(button.dataset.view) ? 'home' : button.dataset.view
        state.feedback = ''
        render()
      }
    })
    const sidebar = page.querySelector('.nt-sidebar')
    const toggleSidebar = () => {
      state.sidebarExpanded = !state.sidebarExpanded
      sidebar.classList.toggle('is-expanded', state.sidebarExpanded)
    }
    page.querySelector('.nt-brand').onclick = toggleSidebar
    page.querySelector('.nt-sidebar-toggle').onclick = toggleSidebar
    page.querySelector('.nt-quick-access-add').onclick = () => {
      const label = window.prompt('Bookmark name')
      const url = window.prompt('Website URL')
      if (!label || !url) return
      const normalized = url.includes('://') ? url : `https://${url}`
      if (!isWebUrl(normalized)) { state.feedback = 'Please enter a valid http or https URL.'; render(); return }
      state.bookmarks.push({ label: label.trim(), url: normalized }); saveBookmarks(); render()
    }
  }

  render()
  window.setInterval(() => {
    const clock = document.querySelector('.nt-clock')
    if (clock) clock.innerHTML = `<strong>${time()}</strong><span>${date()}</span>`
    const edgeClock = document.querySelector('#edge-clock')
    if (edgeClock) edgeClock.innerHTML = `${time()}<small>${new Date().toLocaleTimeString([], { hour12: true }).slice(-2)}</small>`
  }, 1000)
})()
