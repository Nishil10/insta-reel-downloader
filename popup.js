document.getElementById('download-btn').addEventListener('click', async () => {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const response = await chrome.tabs.sendMessage(tab.id, { action: "downloadReel" });
        
        if (response && response.success) {
            console.log("Download initiated successfully");
        } else {
            alert("No Reel found on this page!");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error: " + (error.message || "Failed to download reel"));
    }
});
