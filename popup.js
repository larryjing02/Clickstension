function testFunc() {
    console.log("Function: testFunc");

    chrome.storage.local.get("counter", (result) => {
        const count = result.counter != null ? result.counter + 1 : 1;
        chrome.storage.local.set({"counter":count}, function(){});
        console.log(count);
    });
}



window.onload = function() {
    //document.getElementById("clickactivity").addEventListener("click", testFunc);
    
    // Get time attributes from storage
    chrome.storage.local.get("timeMap", (result) => {
        let timeMap = result.timeMap != null ? result.timeMap : {"Website Domain":"0"};  

        let sortedData = Object.keys(timeMap).sort(function(a,b){return timeMap[b]-timeMap[a]});

        let table = document.getElementById("timeList");
        
        sortedData.forEach((item)=>{
            let row = document.createElement("tr");
            let key = document.createElement("td");
            key.appendChild(document.createTextNode(item));
            let val = document.createElement("td");
            val.appendChild(document.createTextNode(timeMap[item]));

            row.appendChild(key);
            row.appendChild(val);

            table.appendChild(row);
        });
    });
};