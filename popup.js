// Function to test Chrome storage api; simple incrementation
function testFunc() {
    console.log("Function: testFunc");

    chrome.storage.local.get("counter", (result) => {
        const count = result.counter != null ? result.counter + 1 : 1;
        chrome.storage.local.set({"counter":count}, function(){});
        console.log(count);
    });
}

// Convert seconds into HH:MM:SS time
function convertTime(s) {
    var hours   = Math.floor(s / 3600)
    var minutes = Math.floor(s / 60) % 60
    var seconds = s % 60

    return [hours,minutes,seconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v,i) => v !== "00" || i > 0)
        .join(":")
}

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

// Gets elapsed time in seconds
async function getElapsedTime() {
    //console.log("Getting start time");
    var p = new Promise(function(resolve, reject) {
        chrome.storage.local.get("timeA", (result) => {
        var time = result.timeA != null ? result.timeA : Math.floor(performance.now());
        // console.log(time);
        resolve(time);
    })});

    const prevTime = await p;

    return Math.floor((performance.now() - prevTime)/1000);
}

// On tab activity, updates stored times and populates elements
async function forceUpdate() {
    var cur = await getCurrentDomain();

    console.log("Forcing update: " + cur);

    var elapsed = await getElapsedTime();

    // If elapsed time returns negative then new session just began
    // Thus, is necessary to use current performance.now() as time factor
    if (elapsed < 0) {
        elapsed = Math.floor(performance.now()/1000);
    }

    chrome.storage.local.get("timeMap", (result) => {
        console.log("here " + cur)
        var map = result.timeMap;
        if (map != null) {
            if (cur in map) {
                console.log("map");
                console.log(map[cur]);
                console.log(elapsed);
                map[cur] += elapsed;
            } else {
                map[cur] = elapsed;
            }
            console.log(map[cur])
        } else {
            map = {cur : elapsed};
        };

        let sortedData = Object.keys(map).sort(function(a,b){return map[b]-map[a]});

        let table = document.getElementById("timeList");

        // Append all data to table
        sortedData.forEach((item)=>{
            let row = document.createElement("tr");
            let key = document.createElement("td");
            key.appendChild(document.createTextNode(item));
            let val = document.createElement("td");
            val.appendChild(document.createTextNode(convertTime(map[item])));

            row.appendChild(key);
            row.appendChild(val);

            table.appendChild(row);
        });

        chrome.storage.local.set({"timeMap":map}, function(){});
        chrome.storage.local.set({timeA:Math.floor(performance.now())}, function(){});
    });
}




window.onload = function() {
    //document.getElementById("clickactivity").addEventListener("click", testFunc);
    
    // Force update and populate time attributes
    forceUpdate();

    // Get time attributes from storage
    // chrome.storage.local.get("timeMap", (result) => {
    //     let timeMap = result.timeMap != null ? result.timeMap : {"Website Domain":"0"};  

    //     let sortedData = Object.keys(timeMap).sort(function(a,b){return timeMap[b]-timeMap[a]});

    //     let table = document.getElementById("timeList");
        

    //     // Append all data to table
    //     sortedData.forEach((item)=>{
    //         let row = document.createElement("tr");
    //         let key = document.createElement("td");
    //         key.appendChild(document.createTextNode(item));
    //         let val = document.createElement("td");
    //         val.appendChild(document.createTextNode(convertTime(timeMap[item])));

    //         row.appendChild(key);
    //         row.appendChild(val);

    //         table.appendChild(row);
    //     });
    // });
};