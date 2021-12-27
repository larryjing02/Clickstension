async function getCurrentDomain() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    let url = new URL(tab.url);
    // console.log(url.hostname);
    return url.hostname;
}


async function getSession() {
    console.log("Getting cur session");
    var p = new Promise(function(resolve, reject) {
        chrome.storage.local.get("curSession", (result) => {
        var site = result.curSession != null ? result.curSession : getCurrentDomain();
        console.log(site);
        resolve(site);
    })});
    console.log("Preprom")
    const prevDomain = await p;
    console.log("Postprom")
    console.log(prevDomain)

    return prevDomain
}

function setSession(curDomain) {
    console.log("Setting cur session")
    chrome.storage.local.set({curSession:curDomain}, function(){});
}

async function updateStorage() {
    var prev = await getSession();
    console.log("prev");
    console.log(prev);
    var cur = await getCurrentDomain();
    console.log("cur");
    console.log(cur);
    // If cur != prev then we changed domains
    if (cur != prev) {
        console.log("domain change detected!");
        chrome.storage.local.get("counter", (result) => {
            const count = result.counter != null ? result.counter + 1 : 1;
            chrome.storage.local.set({"counter":count}, function(){});
            console.log(count);
        });
        setSession(cur);
    } else {
        console.log("Ignoring");
    }
}

chrome.tabs.onUpdated.addListener(function(activeInfo) {
    console.log("Updated");
    updateStorage();
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
    console.log("Updated");
    updateStorage();
});

// add on activated, on created?


