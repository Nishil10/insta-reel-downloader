document.getElementById('download-btn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getReelUrl" }, (response) => {
            if (response.url) {
                const a = document.createElement('a');
                a.href = response.url;
                a.download = 'reel.mp4'; // You can modify the filename as needed
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                alert("No Reel found!");
            }
        });
    });
});
