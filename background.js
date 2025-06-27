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

// chrome.action.onClicked.addListener((tab) => {
//   let creating = chrome.tabs.create({
//     url: newTabUrl,
//   });
//   creating.then(onCreated, onError);
// });