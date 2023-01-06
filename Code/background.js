chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && changeInfo.status == 'complete') {
    if (tab.url.includes('youtube.com/watch')) {
      chrome.tabs.sendMessage(tabId, {
        type: 'NEW_VIDEO_OPENED',
      });
    }
    else if (tab.url.includes('youtube.com/shorts')) {
      chrome.tabs.sendMessage(tabId, {
        type: 'SHORTS_OPENED',
      });
    }
    else if (tab.url == 'https://www.youtube.com/' || tab.url.startsWith('https://www.youtube.com/?')) {
      chrome.tabs.sendMessage(tabId, {
        type: 'HOMEPAGE_OPENED',
      });
    }
    else if (tab.url.includes('www.youtube.com')) {
      chrome.tabs.sendMessage(tabId, {
        type: 'REMOVE_DANGEROUS_THINGS',
      });
    }
  }
});

