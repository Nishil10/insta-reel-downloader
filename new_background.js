// background.js
console.log("Background script initialized");

// Handle ping from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "ping") {
    console.log("Received ping from content script");
    sendResponse({ status: "ready" });
    return true;
  }

  if (request.action === "download") {
    const { url } = request;
    console.log("Received download request for URL:", url);

    // Check if the URL is valid
    if (!url) {
      console.error('No URL provided for download');
      sendResponse({ success: false, error: 'No URL provided' });
      return true;
    }

    try {
      // Validate URL format
      const urlObj = new URL(url);
      if (!urlObj.protocol.startsWith('http')) {
        throw new Error('Invalid URL protocol');
      }

      console.log("Starting download for URL:", url);
      chrome.downloads.download({
        url: url,
        filename: 'reel.mp4',
        conflictAction: 'uniquify',
        saveAs: true // Let user choose where to save
      }, (downloadId) => {
        if (chrome.runtime.lastError) {
          console.error('Download failed:', chrome.runtime.lastError);
          sendResponse({ 
            success: false, 
            error: chrome.runtime.lastError.message || 'Download failed' 
          });
        } else {
          console.log('Download started successfully:', downloadId);
          sendResponse({ success: true, downloadId });
        }
      });
    } catch (error) {
      console.error('Error processing download:', error);
      sendResponse({ 
        success: false, 
        error: error.message || 'Invalid URL format' 
      });
    }

    return true; // Keep the message channel open for async response
  }
});
