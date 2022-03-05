// Gets domain of currently active tab
async function getCurrentDomain() {
    // console.log("Getting current domain");
    var queryOptions = { active: true, currentWindow: true };
    var [tab] = await chrome.tabs.query(queryOptions);
    if (tab != null) {
        const url = new URL(tab.url);
        var host = url.hostname;
        if (host.startsWith("www.")) host = host.substring(4)
        if (!host.includes(".")) return "error";
        setSession(host);
        return host;
    } else {
        console.log("Error getting current domain.");
        return "error";
    }
}

// Gets previous domain
async function getSession() {
    // console.log("Getting prev session");
    var p = new Promise(function(resolve, reject) {
        chrome.storage.local.get("curSession", (result) => {
        var site = result.curSession != null ? result.curSession : getCurrentDomain();
        resolve(site);
    })});

    const prevDomain = await p;
    return prevDomain
}

// Gets elapsed time in seconds
async function getElapsedTime() {
    // console.log("Getting start time");
    var p = new Promise(function(resolve, reject) {
        chrome.storage.local.get("timeA", (result) => {
        var time = result.timeA != null ? result.timeA : Math.floor(performance.now());
        // console.log(time);
        resolve(time);
    })});

    const prevTime = await p;

    const elapsed = Math.floor((performance.now() - prevTime)/1000);
    return elapsed
}

// Sets value of domain, start time in storage
function setSession(curDomain) {
    // console.log("Setting cur session")
    chrome.storage.local.set({curSession:curDomain}, function(){});
    chrome.storage.local.set({timeA:Math.floor(performance.now())}, function(){});
}

// On tab activity, updates stored times if necessary
async function updateStorage() {
    const prev = await getSession();
    const elapsed = await getElapsedTime();
    const cur = await getCurrentDomain();
    // console.log("Current: " + cur);
    // console.log("Previous:" + prev);

    // If cur != prev then we changed domains
    // if (cur != "error") {
    if (cur != prev && cur != "error") {
        console.log("Change detected: " + cur);

        // If elapsed time returns negative then new session just began
        // Thus, is necessary to use current performance.now() as time factor
        if (elapsed < 0) {
            elapsed = Math.floor(performance.now()/1000);
        }

        console.log("Elapsed time for " + prev + ": " + elapsed);

        chrome.storage.local.get("timeMap", (result) => {
            var map = result.timeMap;
            if (map != null) {
                if (prev in map) {
                    map[prev] += elapsed;
                } else {
                    map[prev] = elapsed;
                }
            } else {
                map = {prev : elapsed};
            };
            chrome.storage.local.set({"timeMap":map}, function(){});
            console.log(map);
        });
    } else {
        console.log("Event ignored");
    }
    
}

// chrome.tabs.onUpdated.addListener(function(activeInfo) {
//     console.log("Updated Detected");
//     updateStorage();
// });

chrome.tabs.onActivated.addListener(function(activeInfo) {
    console.log("Activation Detected");
    updateStorage();
});

// chrome.windows.onFocusChanged.addListener(function(activeInfo) {
//     console.log("Activation Detected");
//     updateStorage();
// });

// Modify functionality to account for when browser startup/shutdown, see details about active tab?


