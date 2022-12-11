(() => {
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        if (obj.type == 'NEW_VIDEO_STARTED') {
            videoOpened();
        } else if (obj.type == 'SHORTS_STARTED') {
            manageShorts();
        }
    });

    if (window.location.href.includes('https://www.youtube.com/watch')) {
        videoOpened();
    } else if (window.location.href.includes('https://www.youtube.com/shorts')) {
        manageShorts();
    }

    function videoOpened() {
    }

    function manageShorts() {
        old_document = document.innerHTML;

        document.head.innerHTML = '<title>Nope :)</title>';
        document.body.style = 'background-color: rgb(30, 30, 30); font-family: cursive; text-align: center; color: rgb(200, 200, 200);';
        document.body.innerHTML = '<p style = "font-size: 20vw; margin: 0px; margin-top: 5vw; margin-bottom: 5vw">Nope :)</p><p style="font-size:1vw">There\'s <b>NO</b> way that I\'m going to let you fall into the shorts trap.</p>';
    }
})();
