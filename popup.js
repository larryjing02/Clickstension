function testFunc() {
    console.log("Function: testFunc");

    chrome.storage.local.get("counter", (result) => {
        const count = result.counter != null ? result.counter + 1 : 1;
        chrome.storage.local.set({"counter":count}, function(){});
        console.log(count);
    });
}



window.onload = function() {
    document.getElementById("clickactivity").addEventListener("click", testFunc);
    
    // Get time attributes from storage
    chrome.storage.local.get("timeMap", (result) => {
        let timeMap = result.timeMap != null ? result.timeMap : {"key":"val"};
        let data = Object.keys(timeMap);
    
        let list = document.getElementById("timeList");
        
        data.forEach((item)=>{
            let li = document.createElement("li");
            li.innerText = item;
            list.appendChild(li);
        });
    });
};