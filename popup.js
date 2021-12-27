function testFunc() {
    console.log("testFunc HERE")

    chrome.tabs.get(activeInfo.tabId, function(tab){
       console.log(tab.url);
    });

    chrome.storage.local.get(["count"], (result) => {
        const count = result.count ? result.count++ : 1;
        chrome.storage.local.set({count});
        console.log(count);
    });
}

document.getElementById("clickMe").addEventListener("click", testFunc);

