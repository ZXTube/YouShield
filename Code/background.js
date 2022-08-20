chrome.tabs.onUpdated.addListener((tabId, tab) => {
  if (tab.url) {
    if (tab.url.includes('youtube.com/watch')) {
      chrome.tabs.sendMessage(tabId, {
        type: 'NEW_VIDEO_STARTED',
      });
    }
    else {
      chrome.tabs.sendMessage(tabId, {
        type: 'REMOVE_OLD_PROMPT',
      });
    }
  }
});
