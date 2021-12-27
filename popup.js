function testFunc() {
    console.log("Function: testFunc");

    chrome.storage.local.get("counter", (result) => {
        const count = result.counter != null ? result.counter + 1 : 1;
        chrome.storage.local.set({"counter":count}, function(){});
        console.log(count);
    });
}

function convertTime(s) {
    var hours   = Math.floor(s / 3600)
    var minutes = Math.floor(s / 60) % 60
    var seconds = s % 60

    return [hours,minutes,seconds]
        .map(v => v < 10 ? "0" + v : v)
        .filter((v,i) => v !== "00" || i > 0)
        .join(":")
}

window.onload = function() {
    //document.getElementById("clickactivity").addEventListener("click", testFunc);
    
    // Get time attributes from storage
    chrome.storage.local.get("timeMap", (result) => {
        let timeMap = result.timeMap != null ? result.timeMap : {"Website Domain":"0"};  

        let sortedData = Object.keys(timeMap).sort(function(a,b){return timeMap[b]-timeMap[a]});

        let table = document.getElementById("timeList");
        
        // // Set table header
        // let header = document.createElement("tr");
        // let key = document.createElement("td");
        // key.appendChild(document.createTextNode("Site Domain"));
        // let val = document.createElement("td");
        // val.appendChild(document.createTextNode("Time Spent"));
        // header.appendChild(key);
        // header.appendChild(val);
        // table.appendChild(header);

        // Append all data to table
        sortedData.forEach((item)=>{
            let row = document.createElement("tr");
            let key = document.createElement("td");
            key.appendChild(document.createTextNode(item));
            let val = document.createElement("td");
            val.appendChild(document.createTextNode(convertTime(timeMap[item])));

            row.appendChild(key);
            row.appendChild(val);

            table.appendChild(row);
        });
    });
};