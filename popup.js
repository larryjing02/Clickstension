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
};