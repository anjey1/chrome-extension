
let active_tab_id = 0;

const vocabulary = [
    'Do you have time to meet next week?',
    'I have forwarded this message to the appropriate service rep.',
    'If you\'re not the right person, can you please put me in touch with whoever is?',
    'Thanks again for chatting today and I look forward to hearing from you!'
]

let autoCompleteObject = {};

//'Do you have ti' :'Do you have time to meet next week?',
//'I have forwarded this me' : 'I have forwarded this message to the appropriate service rep.',
vocabulary.map(term => {
    let newLength = term.length * 0.4
    let key = term.substring(0, newLength);
    autoCompleteObject[key] = term.substring(newLength, term.length);;
})


chrome.tabs.onActivated.addListener(tab => {
    chrome.tabs.get(tab.tabId, current_tab_info => {
        active_tab_id = tab.tabId;
        if (/^https:\/\/mail\.google/.test(current_tab_info.url)) {
            chrome.tabs.executeScript(null, { file: './client.js' });
        }
    })
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    let autoCompletedValue = checkMatch(request.message);
    chrome.tabs.sendMessage(active_tab_id, { message: autoCompletedValue })
})


function checkMatch(string) {
    if (autoCompleteObject[string]) {
        return autoCompleteObject[string];
    } else return '';

}


