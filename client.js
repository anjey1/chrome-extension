console.log('client ground');

var element = document.querySelectorAll('table .editable')[0];
var autocompleteText = '';

if (window.location.hostname === 'mail.google.com') {

    // TODO: add listner to multiple inputs

    element.removeEventListener('DOMSubtreeModified', myFunction, false);

    element.addEventListener('DOMSubtreeModified', myFunction, false);

    function myFunction(e) {
        //console.log(element.innerText);
        chrome.runtime.sendMessage({ message: element.innerText })
    }

    // checks if there is something to autocomplete
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

        element.removeEventListener('DOMSubtreeModified', myFunction, false);

        this.removeAutocomplete(document.getElementsByClassName('autocomp'))

        if (request.message) {

            let spanElement = document.createElement('span');
            spanElement.innerHTML = request.message
            spanElement.className = 'autocomp'
            spanElement.style.cssText = `
            position: absolute;
            opacity: 0.5;
            font: small/ 1.5 Arial,Helvetica,sans-serif;
            top: 10px;`
            spanElement.style.left = request.message.length * 4 + 'px';
            element.parentNode.appendChild(spanElement);

            autocompleteText = request.message;

        } else {
            this.removeAutocomplete(document.getElementsByClassName('autocomp'))
        }

        element.addEventListener('DOMSubtreeModified', myFunction, false);

    })

    // removes auto complete span
    function removeAutocomplete(autoCompElement) {
        if (autoCompElement.length > 0) {
            autoCompElement[0].parentNode.removeChild(autoCompElement[0])
        }
    }


    element.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            removeAutocomplete(document.getElementsByClassName('autocomp')[0])
            element.innerText += autocompleteText;
        }
    });

}

