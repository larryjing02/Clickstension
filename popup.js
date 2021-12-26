function scriptInject() {
    chrome.tabs.query({active:true, currentWindow:true}, tabs => {
        chrome.scripting.executeScript({target: {tabID: tabs[0].id}, files: ['command_script.js']})
    })
}

document.getElementById('clickactivity').addEventListener('click', injectTheScript)