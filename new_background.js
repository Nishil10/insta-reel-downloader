// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "download") {
    const { url } = request;

    // Check if the URL is valid
    if (url) {
      chrome.downloads.download({
        url: url,
        filename: 'reel.mp4', // You can customize the filename
        conflictAction: 'uniquify' // Ensures unique filenames
      }, (downloadId) => {
        if (chrome.runtime.lastError) {
          console.error(`Download failed: ${chrome.runtime.lastError.message}`);
        } else {
          console.log(`Download started: ${downloadId}`);
        }
      });
    } else {
      console.error('Invalid URL received for download.');
    }
  }
});
