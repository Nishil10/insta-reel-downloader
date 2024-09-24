chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "downloadReel") {
    const videoElement = document.querySelector('video'); // Adjust selector as necessary
    if (videoElement) {
      const videoUrl = videoElement.src;
      chrome.runtime.sendMessage({ action: "download", url: videoUrl });
    }
  }
});

