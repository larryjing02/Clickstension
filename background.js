async function getCurrentDomain() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    let url = new URL(tab.url)
    console.log("Something happened")
    console.log(url.hostname)
    return url.hostname;
}


chrome.tabs.onActivated.addListener(function(activeInfo) {
    console.log("UPDATED HERE")
    chrome.storage.local.get(["count"], (result) => {
        const count = result.count ? result.count++ : 1;
        chrome.storage.local.set({count});
        console.log(count);
    });
    console.log("counter finished")
    getCurrentDomain();
    chrome.tabs.get(activeInfo.tabId, function(tab){
       console.log(tab.url);
    });
    
});



