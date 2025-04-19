// Ensure the background script is ready
chrome.runtime.sendMessage({ action: "ping" }, (response) => {
  if (chrome.runtime.lastError) {
    console.error("Background script not ready:", chrome.runtime.lastError);
  } else {
    console.log("Background script is ready");
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "downloadReel") {
    console.log("Looking for video element...");
    
    // Function to find video URL from different possible sources
    function findVideoUrl() {
      // Method 1: Direct video element
      const videoElements = document.querySelectorAll('video');
      console.log("Found video elements:", videoElements.length);
      
      for (const video of videoElements) {
        console.log("Checking video element:", video);
        
        // Check direct src
        if (video.src && video.src.startsWith('blob:')) {
          // For blob URLs, we need to get the actual video URL
          const videoUrl = URL.createObjectURL(video.src);
          console.log("Found blob URL, converted to:", videoUrl);
          return videoUrl;
        } else if (video.src) {
          console.log("Found direct src:", video.src);
          return video.src;
        }
        
        // Check source elements
        const sources = video.querySelectorAll('source');
        for (const source of sources) {
          if (source.src) {
            console.log("Found source src:", source.src);
            return source.src;
          }
        }
      }

      // Method 2: Look for video URLs in the page
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      for (const script of scripts) {
        try {
          const data = JSON.parse(script.textContent);
          if (data.video && data.video.contentUrl) {
            console.log("Found video URL in JSON-LD:", data.video.contentUrl);
            return data.video.contentUrl;
          }
        } catch (e) {
          console.log("Error parsing JSON:", e);
        }
      }

      // Method 3: Look for video URLs in meta tags
      const metaTags = document.querySelectorAll('meta[property="og:video"]');
      for (const meta of metaTags) {
        if (meta.content) {
          console.log("Found video URL in meta tag:", meta.content);
          return meta.content;
        }
      }

      return null;
    }

    const videoUrl = findVideoUrl();
    
    if (videoUrl) {
      console.log("Sending video URL to background:", videoUrl);
      // Use a Promise to handle the async communication
      new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: "download", url: videoUrl }, (response) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(response);
          }
        });
      })
      .then(response => {
        sendResponse(response || { success: true });
      })
      .catch(error => {
        console.error("Error sending message:", error);
        sendResponse({ success: false, error: error.message });
      });
    } else {
      console.log("No video URL found using any method");
      sendResponse({ success: false, error: "No video found" });
    }
    
    return true; // Keep the message channel open for async response
  }
});

