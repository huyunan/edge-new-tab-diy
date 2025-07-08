document.addEventListener('DOMContentLoaded', function () {
  const defaultUrl = 'https://www.baidu.com/'
  const regexp = new RegExp(
    '^(https?)://[^\s/$.?#].[^\s]*.*$'
  )

  // 初始化时获取 newTabUrl
  getNewTabUrl()

  // 获取 newTabUrl
  function getNewTabUrl() {
    chrome.storage.local.get(['newTabUrl'], (result) => {
      setUrl(result.newTabUrl, 'init')
    })
  }

  document.getElementById('save').addEventListener('click', () => {
    const value = document.getElementById('urlInput').value
    if (!regexp.test(value)) {
      setMessage('hint', '输入的链接地址不正确！', 'msg-error')
      setTimeout(() => {
        getNewTabUrl()
      }, 1000)
    } else {
      setUrl(value, 'save')
    }
  })

  document.getElementById('reset').addEventListener('click', () => {
    setUrl(defaultUrl, 'reset')
  })

  function setUrl(url, type) {
    if (!url) {
      setMessage('link', null, 'msg-info', defaultUrl)
      chrome.storage.local.set({ newTabUrl: defaultUrl })
      setMessage('link', null, 'msg-info', defaultUrl)
      return
    }
    if (type == 'init') {
      setMessage('link', null, 'msg-info', url)
    } else if (type == 'save') {
      chrome.storage.local.set({ newTabUrl: url }, () => {
        setMessage('hint', '链接地址保存成功！', 'msg-success')
        setTimeout(() => {
          setMessage('link', null, 'msg-info', url)
        }, 1000)
        chrome.runtime.sendMessage({action: "changeUrl"}, (response) => {
            console.log(response)
        });
      })
    } else if (type == 'reset') {
      chrome.storage.local.set({ newTabUrl: url }, () => {
        setMessage('hint', '重置成功！', 'msg-success')
        setTimeout(() => {
          setMessage('link', null, 'msg-info', url)
        }, 1000)
        chrome.runtime.sendMessage({action: "changeUrl"}, (response) => {
            console.log(response)
        });
      })
    }
  }

  function setMessage(type, msg, cls, url) {
    if (type == 'hint') {
      document.getElementById(
        'content'
      ).innerHTML = `<div class="${cls} message">${msg}</div>`
    } else if (type == 'link') {
      document.getElementById(
        'content'
      ).innerHTML = `<div class="${cls} message" title="${url}"><a target="_blank" href="${url}">${url}</a></div>`
    }
  }
})
