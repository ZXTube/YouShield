chrome.tabs.onUpdated.addListener((tabId, tab) => {
  if (tab.url) {
    if (tab.url.includes('youtube.com/watch')) {
      chrome.tabs.sendMessage(tabId, {
        type: 'NEW_VIDEO_STARTED',
      });
    }
    if (tab.url.includes('youtube.com/shorts')) {
      chrome.tabs.sendMessage(tabId, {
        type: 'SHORTS_STARTED',
      });
    }
  }
});

