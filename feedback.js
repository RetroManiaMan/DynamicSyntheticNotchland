;(function () {
  const SETTINGS_KEY = 'dsn-settings-v1'
  const QUEUE_KEY = 'dsn-feedback-queue-v1'
  const DISMISSED_KEY = 'dsn-feedback-dismissed-at-v1'
  const OPENS_KEY = 'dsn-feedback-opens-v1'
  const COOLDOWN = 30 * 24 * 60 * 60 * 1000
  const MIN_OPENS = 3 // never on a first impression: only from the third time NotchTab is opened

  function storeDismissal() {
    return new Promise((resolve) => chrome.storage.local.set({ [DISMISSED_KEY]: Date.now() }, resolve))
  }

  function addPrompt(page) {
    if (typeof chrome === 'undefined' || !chrome.storage?.local) return
    chrome.storage.local.get([SETTINGS_KEY, DISMISSED_KEY, OPENS_KEY], (stored) => {
      const opens = Number(stored[OPENS_KEY] || 0) + 1
      chrome.storage.local.set({ [OPENS_KEY]: opens })
      if (!page.isConnected || opens < MIN_OPENS) return
      const settings = stored[SETTINGS_KEY] || {}
      const lastDismissed = Number(stored[DISMISSED_KEY] || 0)
      if (settings.feedbackPromptsEnabled === false || Date.now() - lastDismissed < COOLDOWN) return
      if (page.querySelector('.dsn-feedback-prompt, .dsn-feedback-shade')) return

      const prompt = document.createElement('aside')
      prompt.className = 'dsn-feedback-prompt'
      const text = document.createElement('span')
      text.textContent = 'Have feedback for DSN?'
      const open = document.createElement('button')
      open.type = 'button'
      open.textContent = 'Leave feedback'
      const close = document.createElement('button')
      close.type = 'button'
      close.textContent = '×'
      close.setAttribute('aria-label', 'Not now')
      close.onclick = () => { void storeDismissal(); prompt.remove() }
      open.onclick = () => { prompt.remove(); addForm(page) }
      prompt.append(text, open, close)
      page.appendChild(prompt)
    })
  }

  function addForm(page) {
    const shade = document.createElement('div')
    shade.className = 'dsn-feedback-shade'
    const dialog = document.createElement('section')
    dialog.className = 'dsn-feedback-dialog'
    dialog.setAttribute('role', 'dialog')
    dialog.setAttribute('aria-modal', 'true')
    dialog.setAttribute('aria-labelledby', 'dsn-feedback-title')
    const close = document.createElement('button')
    close.type = 'button'; close.className = 'dsn-feedback-close'; close.textContent = '×'; close.setAttribute('aria-label', 'Close')
    close.onclick = () => shade.remove()
    const form = document.createElement('form')
    const title = document.createElement('h2'); title.id = 'dsn-feedback-title'; title.textContent = 'Give Feedback'
    const fieldLabel = document.createElement('label'); fieldLabel.htmlFor = 'dsn-feedback-message'; fieldLabel.textContent = 'What would you like to tell us?'
    const textarea = document.createElement('textarea'); textarea.id = 'dsn-feedback-message'; textarea.minLength = 3; textarea.maxLength = 5000; textarea.required = true; textarea.rows = 5
    const fieldset = document.createElement('fieldset'); const legend = document.createElement('legend'); legend.textContent = 'Type'; fieldset.appendChild(legend)
    for (const type of ['suggestion', 'bug', 'feedback', 'other']) {
      const label = document.createElement('label'); const radio = document.createElement('input'); radio.type = 'radio'; radio.name = 'dsn-feedback-type'; radio.value = type; radio.checked = type === 'suggestion'
      label.append(radio, document.createTextNode(type[0].toUpperCase() + type.slice(1))); fieldset.appendChild(label)
    }
    const note = document.createElement('p'); note.className = 'dsn-feedback-privacy'; note.textContent = 'Only the text you submit is saved locally. It is not sent to GitHub.'
    const actions = document.createElement('div'); actions.className = 'dsn-feedback-buttons'
    const cancel = document.createElement('button'); cancel.type = 'button'; cancel.textContent = 'Cancel'; cancel.onclick = () => shade.remove()
    const submit = document.createElement('button'); submit.type = 'submit'; submit.textContent = 'Submit'; actions.append(cancel, submit)
    form.append(title, fieldLabel, textarea, fieldset, note, actions)
    form.onsubmit = (event) => {
      event.preventDefault()
      const message = textarea.value.trim().replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
      if (message.length < 3 || message.length > 5000) return
      submit.disabled = true
      submit.textContent = 'Saving…'
      const selected = form.querySelector('input[name="dsn-feedback-type"]:checked')
      chrome.storage.local.get(QUEUE_KEY, (stored) => {
        const entries = Array.isArray(stored[QUEUE_KEY]) ? stored[QUEUE_KEY] : []
        entries.push({ id: crypto.randomUUID(), type: selected?.value || 'suggestion', message, createdAt: Date.now(), delivery: 'local-only' })
        chrome.storage.local.set({ [QUEUE_KEY]: entries, [DISMISSED_KEY]: Date.now() }, () => {
          if (chrome.runtime.lastError) { submit.disabled = false; submit.textContent = 'Submit'; note.textContent = 'Could not save feedback locally. Please try again.'; return }
          dialog.replaceChildren()
          const heading = document.createElement('h2'); heading.textContent = 'Thank you'
          const thanks = document.createElement('p'); thanks.textContent = 'Thanks for the review or suggestion. We promise we will look through it and implement or change things to fit your needs if possible!'
          const disclaimer = document.createElement('small'); disclaimer.textContent = 'Saved locally. Automatic GitHub issue creation requires the DSN feedback backend.'
          const done = document.createElement('button'); done.type = 'button'; done.textContent = 'Done'; done.onclick = () => shade.remove()
          dialog.append(heading, thanks, disclaimer, done)
        })
      })
    }
    dialog.append(close, form)
    shade.appendChild(dialog)
    page.appendChild(shade)
  }

  window.DSNFeedbackPrompt = addPrompt
})()
