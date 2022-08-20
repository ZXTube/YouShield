(() => {
    const promptStyle = `#visible.prompt-holder {
        z-index: 100; /* Appear on top of everything else */
        padding-top: 100px;
        position: fixed;
        display: block;
        height: 100%;
        width: 100%;
        left: 0;
        top: 0;
      
        /* Fallback color (If the browser doesn't support alpha) */
        background-color: rgb(0, 0, 0);
        background-color: rgba(0, 0, 0, 0.4);
        
        opacity: 1;
        transition: 0.5s;
      }
      #invisible.prompt-holder {
        opacity: 0;
        transition: 0.5s;
    }
    
    .prompt-content {
        border-radius: 15px;
        background-color: rgb(60, 60, 60);
        border: 1px solid rgb(255, 0, 0);
        font-family: cursive;
        text-align: center;
        padding: 20px;
        margin: auto;
        width: 40%;
      }
      
      .prompt-text {
        color: rgb(220, 220, 220);
        font-size: 20px;
        transition: 0.1s;
      }
      .prompt-text:hover {
        color: rgb(255, 0, 0);
        font-size: 20px;
        transition: 0.1s;
      }
      
      .prompt-button {
        background-color: rgb(200, 200, 200);
        display: inline-block;
        font-family: cursive;
        border-radius: 10px;
        text-align: center;
        font-weight: bold;
        cursor: pointer;
        margin: 10px;
        border: 0px;
      
        padding: 10px;
        padding-left: 20px;
        padding-right: 20px;
        
        transition: opacity 0.2s;
        transition: background-color 0.2s;
    }
      .prompt-button:hover {
          background-color: rgb(150, 150, 150);
        }
    `;
    let changedByScript;
    let annoyanceList;
    let $video;
    let ANP; // Annoyance path

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        if (obj.type == 'NEW_VIDEO_STARTED') {
            videoOpened();
        } else if (obj.type == 'REMOVE_OLD_PROMPT') {
            setTimeout(removeOldPrompt, 1000);
        }
    });

    if (window.location.href.includes('https://www.youtube.com/watch')) {
        videoOpened();
    }

    function initializeLocalStorage() {
        if (localStorage['yt-remote-device-ysnfto'] != '"{"data":"e6d4edce-dc35-4cce-8814-cf68d00b9","expiration":1688710197,"creation":1657211317}"') {
            localStorage['yt-remote-device-ysnfto'] = '"{"data":"e6d4edce-dc35-4cce-8814-cf68d00b9","expiration":1688710197,"creation":1657211317}"';
            localStorage['yt-instance-last'] = '"{"data":"0:009td2efee-dc85-4cse-1814-cft8db0b9","expiration":16543210197,"creation":153511317}"';
            chrome.storage.local.set({ 'allowedWatchTime': encode(3600) });
            chrome.storage.local.set({ 'ignoredWatchTime': encode(3600) });
            localStorage.amountOfTimeWasted = encode(0);
        }
    }

    function videoOpened() {
        initializeLocalStorage();
        removeOldPrompt();

        const checkExist = setInterval(() => {
            if (document) {
                videoHolder = document.querySelector('ytd-watch-flexy')
                if (videoHolder) {
                    $video = videoHolder.querySelector('video');
                    if ($video && !Number.isNaN($video.duration)) {
                        clearInterval(checkExist);
                        manageAds();
                    }
                }
            }
        }, 1000);
    }

    function removeOldPrompt() {
        if (document.getElementsByClassName('prompt-holder')[0] != null) {
            changedByScript = true;
            setTimeout(() => {
                changedByScript = false;
            }, 500);

            document.getElementsByClassName('prompt-holder')[0].remove();
            document.getElementsByClassName('prompt-style')[0].remove();
            console.log('old');
        }
    }

    function manageAds() {
        const waitingForAdToEnd = setInterval(() => {
            if (document.getElementsByClassName('ytp-ad-text').length == 0) {
                setTimeout(() => {
                    if (document.getElementsByClassName('ytp-ad-text').length == 0) {
                        clearInterval(waitingForAdToEnd);
                        setTimeout(manageNewVideo, 10);
                    }
                }, 10)
            }
        }, 10);
    }

    function manageNewVideo() {
        timeWasted = 0;
        let prevTime = 0;

        if ($video.duration < 60) {
            return;
        }

        $video.pause();
        $video.addEventListener('timeupdate', (event) => {
            const timePassed = event.target.currentTime - prevTime;
            if (timePassed < 4 && timePassed > 0) {
                localStorage.amountOfTimeWasted = Number(localStorage.amountOfTimeWasted) + timePassed / $video.playbackRate;
            }
            prevTime = event.target.currentTime;
        });

        manageIfNewDay();

        const hours = $video.duration / 3600;
        const minutes = (hours % 1) * 60;
        const seconds = (minutes % 1) * 60;

        annoy(hours, minutes, seconds);
    }

    function encode(number) {
        return number + 139528034;
    }

    function decode(encodedValue, bigFailValue) {
        let decodedValue = encodedValue - 139528034
        if (decodedValue >= 0) {
            return decodedValue;
        } else {
            return (bigFailValue) ? 36000 : 3600;
        }
    }

    function manageIfNewDay() {
        const date = new Date();
        const day = date.getDay();
        let month = date.getMonth().toString();

        if (month.length == 1) {
            month = '0' + month;
        }

        const lastTimeChecked = localStorage['yt-instance-last'].slice(10, 14).split(':');
        if (lastTimeChecked[0] != day || lastTimeChecked[1] != month) {
            localStorage['yt-instance-last'] = `"{"data":"${day}:${month}9td2efee-dc85-4cse-1814-cft8db0b9","expiration":16543210197,"creation":153511317}"`;
            localStorage.amountOfTimeWasted = encode(0);

            chrome.storage.local.get(['ignoredWatchTime'], (result) => {
                chrome.storage.local.set({ 'allowedWatchTime': result.ignoredWatchTime });
            });
        }
    }

    function annoy(hours, minutes, seconds) {
        let startingText;
        if (hours < 1) {
            startingText = `Are you suriously going to waste ${Math.floor(minutes)} MINUTES and ${Math.floor(seconds)} SECONDS!?!`;
        } else {
            startingText = `Are you suriously going to waste ${Math.floor(hours)} HOURS and ${Math.floor(minutes)} MINUTES!?!`;
        }

        chrome.storage.local.get(['allowedWatchTime'], (result) => {
            let tryAllowToWatch;

            if (decode(Number(localStorage.amountOfTimeWasted), true) < decode(result.allowedWatchTime, false)) {
                tryAllowToWatch = ['Make sure you are not sitting on your bed or your work desk!', 'endAnnoyance'];
            }
            else {
                tryAllowToWatch = ['no :)', 'dontAllow'];
            }

            annoyanceList = [

                startingText, ['Yes', 'No'], [

                    [`You already wasted ${(decode(Number(localStorage.amountOfTimeWasted), true) / 60).toFixed(2)} minutes`, ['I know 😔', 'Ok, fine'], [

                        tryAllowToWatch,

                        ['Ok, byee', 'dontAllow']]

                    ],

                    ['Ok, byee', 'dontAllow']

                ]

            ];

            ANP = [];
            setupPrompt();
        });
    }

    function setupPrompt() {
        removeOldPrompt();

        const promptHolder = document.createElement('div');
        promptHolder.className = 'prompt-holder';
        promptHolder.id = 'invisible';

        const promptContent = document.createElement('div');
        promptContent.className = 'prompt-content';

        const promptText = document.createElement('p');
        promptText.className = 'prompt-text';

        const promptButton0 = document.createElement('a');
        promptButton0.onclick = () => { buttonPressed(0) };
        promptButton0.className = 'prompt-button';

        const promptButton1 = document.createElement('a');
        promptButton1.onclick = () => { buttonPressed(1) };
        promptButton1.className = 'prompt-button';

        const promptButton2 = document.createElement('a');
        promptButton2.onclick = () => { buttonPressed(2) };
        promptButton2.className = 'prompt-button';

        promptContent.appendChild(promptText);
        promptContent.appendChild(promptButton0);
        promptContent.appendChild(promptButton1);
        promptContent.appendChild(promptButton2);
        promptHolder.appendChild(promptContent);
        document.body.appendChild(promptHolder);

        const promptStyleNode = document.createElement('style');
        promptStyleNode.textContent = promptStyle;
        promptStyleNode.className = 'prompt-style';
        document.head.appendChild(promptStyleNode);

        onElementRemovedOrChanged(promptHolder);
        onElementRemovedOrChanged(promptStyleNode);

        setTimeout(() => {
            enableChangedByScript();
            promptHolder.id = 'visible';
            makePrompt(annoyanceList[0], annoyanceList[1]);
        }, 100);
    }

    function onElementRemovedOrChanged(element) {
        const parentElement = element.parentElement;

        const onChanged = new MutationObserver(function (mutations) {
            if (!changedByScript) {
                sayNope();
                onChanged.disconnect();
            }
        });

        const onRemoved = new MutationObserver(function (mutations) {
            if (!parentElement.contains(element)) {
                if (!changedByScript) {
                    sayNope();
                }

                onChanged.disconnect();
                onRemoved.disconnect();
            }
        });

        onRemoved.observe(parentElement, { childList: true });
        onChanged.observe(element, { attributes: true, childList: true, subtree: true });
    }

    function sayNope() {
        enableChangedByScript();
        document.head.innerHTML = '<title>Bye 😂</title>';
        document.body.style = 'background-color: rgb(30, 30, 30); font-family: cursive; text-align: center; color: rgb(200, 200, 200);';
        document.body.innerHTML = '<p style = "font-size: 70vh; margin: 0px; margin-top: -20vh;">Nope</p><p>Did you suriously think that you can outsmart me 🤣🤣🤣</p>';
    }

    function makePrompt(text, options) {
        enableChangedByScript();
        document.getElementsByClassName('prompt-text')[0].textContent = text;
        const promptButtons = document.getElementsByClassName('prompt-button');

        if (options.length > 0) {
            promptButtons[0].style.opacity = 1;
            promptButtons[0].textContent = options[0];
            promptButtons[0].style.position = 'static';
        }
        else {
            promptButtons[0].style.opacity = 0;
            promptButtons[0].style.position = 'fixed';
        }
        if (options.length > 1) {
            promptButtons[1].style.opacity = 1;
            promptButtons[1].textContent = options[1];
            promptButtons[1].style.position = 'static';
        }
        else {
            promptButtons[1].style.opacity = 0;
            promptButtons[1].style.position = 'fixed';
        }
        if (options.length > 2) {
            promptButtons[2].style.opacity = 1;
            promptButtons[2].textContent = options[2];
            promptButtons[2].style.position = 'static';
        }
        else {
            promptButtons[2].style.opacity = 0;
            promptButtons[2].style.position = 'fixed';
        }
    }

    function buttonPressed(n) {
        let currentPos = annoyanceList[2];

        for (let i = 0; i < ANP.length; i++) {
            currentPos = currentPos[ANP[i]][2];
        }

        if (currentPos[n][2] == null) {
            if (currentPos[n][1] == 'endAnnoyance') {
                let promptHolder = document.getElementsByClassName('prompt-holder')[0]

                setTimeout(() => {
                    enableChangedByScript();
                    promptHolder.style.display = 'none';
                    document.querySelector('video').play();
                    promptHolder.style.display = 'block';
                }, 500);

                setTimeout(() => {
                    enableChangedByScript();
                    promptHolder.id = 'invisible';
                }, 2000);
            }
            else if (currentPos[n][1] == 'dontAllow') {
                setTimeout(() => {
                    enableChangedByScript();
                    document.head.innerHTML = '<title>Bye :)</title>';
                    document.body.style = 'background-color: rgb(30, 30, 30); font-family: cursive; text-align: center; color: rgb(200, 200, 200);';
                    document.body.innerHTML = '<p style = "font-size: 80vh; margin: 0px; margin-top: -20vh;">Bye</p><p>I need to do this because I can\'t get permission to close any tab for security reasons</p>';
                }, 500)
            }

            makePrompt(currentPos[n][0], []);
        }
        else {
            makePrompt(currentPos[n][0], currentPos[n][1]);
            ANP.push(n);
        }
    }

    function enableChangedByScript() {
        changedByScript = true;
        setTimeout(() => { changedByScript = false; }, 100);
    }
})();
