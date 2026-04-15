document.getElementById('findVideoBtn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
        chrome.tabs.sendMessage(tab.id, { type: 'FIND_VIDEOS' });
        window.close();
    }
});
