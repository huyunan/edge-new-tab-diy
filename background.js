function onCreated(tab) {
  console.log(`Created new tab: ${tab.id}`);
}

function onError(error) {
  console.log(`Error: ${error}`);
}

let newTabUrl = "https://www.baidu.com"
getNewTabUrl()
// 获取 newTabUrl = ""
function getNewTabUrl() {
  chrome.storage.local.get(['newTabUrl'], (result) => {
    if (result.newTabUrl) {
      newTabUrl = result.newTabUrl
    } else {
      newTabUrl = "https://www.baidu.com"
    }
  })
}
// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "changeUrl") {
    getNewTabUrl();
    sendResponse({ msg: 'success' });
    return true;  // 保持消息通道开放
  }
});

function handleCreated(tab) {
  if (tab.pendingUrl == "edge://newtab/" || tab.url == "edge://newtab/"
        || tab.pendingUrl == "chrome://newtab/" || tab.url == "chrome://newtab/") {
      let creating = chrome.tabs.update({
        url: newTabUrl,
      });
      creating.then(onCreated, onError);
  }
}

chrome.tabs.onCreated.addListener(handleCreated);

chrome.storage.local.get(['switchInput'], (result) => {
  switchInput = !!result.switchInput
  setPopup(switchInput)
})

chrome.action.onClicked.addListener(() => {
  if (!switchInput) return
  let creating = chrome.tabs.create({
    url: newTabUrl,
  });
  creating.then(onCreated, onError);
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes['switchInput']) {
    switchInput = changes['switchInput'].newValue
    setPopup(switchInput)
  }
});

chrome.contextMenus.onClicked.addListener(
  (info) => {
    if (info.menuItemId != 'pop-up box') return
    switchInput = info.checked
    chrome.storage.local.set({ switchInput })
  }
)

// popup 以及右键菜单设置
async function setPopup(switchInput) {
  if (switchInput) {
    chrome.action.setPopup({popup: ''});
  } else {
    chrome.action.setPopup({popup: 'popup.html'});
  }
  try {
    await chrome.contextMenus.update('pop-up box', {
      title: `Pop-up box hidden`,
      type: 'checkbox',
      contexts: ['action'],
      checked: switchInput
    });
  } catch (error) {
    if (error.toString().indexOf('pop-up box') > -1) {
      chrome.contextMenus.create({
        id: 'pop-up box',
        title: `Pop-up box hidden`,
        type: 'checkbox',
        checked: switchInput,
        contexts: ['action']
      });
    } else {
      console.log('error', error)
    }
  }
}