function onCreated(tab) {
  console.log(`Created new tab: ${tab.id}`);
}

function onError(error) {
  console.log(`Error: ${error}`);
}

function handleCreated(tab) {
  if (tab.pendingUrl == "edge://newtab/" || tab.url == "edge://newtab/") {
      let creating = chrome.tabs.update({
        url: "https://www.baidu.com",
      });
      creating.then(onCreated, onError);
  }
}

chrome.tabs.onCreated.addListener(handleCreated);

chrome.action.onClicked.addListener((tab) => {
  let creating = chrome.tabs.create({
    url: "https://www.baidu.com",
  });
  creating.then(onCreated, onError);
});