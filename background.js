// Gets domain of currently active tab
async function getCurrentDomain() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    if (tab != null) {
        let url = new URL(tab.url);
        return url.hostname;
    } else {
        console.log("Error");
        return "error";
    }
}

// Gets previous domain
async function getSession() {
    console.log("Getting prev session");
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
    console.log("Getting start time");
    var p = new Promise(function(resolve, reject) {
        chrome.storage.local.get("timeA", (result) => {
        var time = result.timeA != null ? result.timeA : performance.now();
        console.log(time);
        resolve(time);
    })});

    const prevTime = await p;
    const elapsed = Math.floor((performance.now() - prevTime)/1000);
    return elapsed
}

// Sets value of domain, start time in storage
function setSession(curDomain) {
    console.log("Setting cur session")
    chrome.storage.local.set({curSession:curDomain}, function(){});
    chrome.storage.local.set({timeA:performance.now()}, function(){});
}

// On tab activity, updates stored times if necessary
async function updateStorage() {
    var prev = await getSession();
    var cur = await getCurrentDomain();

    // If cur != prev then we changed domains
    if (cur != prev) {
        console.log("Domain change detected!");

        var elapsed = await getElapsedTime();
        console.log(elapsed);

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
        setSession(cur);
    } else {
        console.log("Ignoring");
    }
}

chrome.tabs.onUpdated.addListener(function(activeInfo) {
    console.log("Updated Detected");
    updateStorage();
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
    console.log("Activation Detected");
    updateStorage();
});

// Modify functionality to account for when browser startup/shutdown, see details about active tab?


