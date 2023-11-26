(() => {
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        if (obj.type == 'NEW_VIDEO_OPENED') {
            manageVideo()
        } else if (obj.type == 'SHORTS_OPENED') {
            manageShorts();
        } else if (obj.type == 'HOMEPAGE_OPENED') {
            manageHomepage();
        } else if (obj.type == 'SEARCH_RESULTS_OPENED') {
            manageSearchResults();
        } else if (obj.type == 'SUBSCRIPTIONS_FEED_OPENED') {
            manageSubscriptionsFeed();
        }

        removeDangerousThings();
    });

    function manageVideo() {
        manageContentPage
        multipleRemoveWhenExists([
            () => { return document.getElementsByClassName('ytp-autonav-endscreen-countdown-overlay')[0] },
            () => { return document.getElementById('secondary-inner').parentNode },
            () => { return document.getElementsByClassName('html5-endscreen')[0] },
            () => { return document.getElementsByClassName('ytp-ce-element')[0] }
        ]);
    }

    function manageShorts() {
        requestAnimationFrame(check);
        function check() {
            let shorts = document.getElementsByTagName('ytd-reel-video-renderer');
            for (let i = 1; i < shorts.length; i++) shorts[i].remove();
            if (shorts.length != 1) requestAnimationFrame(check);
        }
    }

    function manageHomepage() {
        document.head.innerHTML = `<style> .youshield-button { background-color: #202020; text-align: center; padding: 6vh 7vw; border-radius: 10px; color: white; font-size: 2vw; font-family:'Courier New', Courier, monospace; margin: auto 1.5vw; cursor: pointer; box-shadow: 0px 0px 6px #202020; transition: all 0.5s ease; } .youshield-button:hover { background-color: #323232; } #search-input { box-shadow: 0px 0px 4px #202020; background-color: #202020; border-radius: 1000px; position: absolute; padding: 1vw; top: -90vh; width: 45%; transition: top 0.5s, background-color 0.3s ease; } #search-input:hover{ background-color: #252525; } #search-input[visible="true"] { top: 10vh; } </style>`;
        document.body.style = "height: 98vh; display: flex; justify-content: center; background-color: #101010;";
        document.body.innerHTML = `<form action="/results"> <div id="search-input"> <input autocapitalize="none" autocomplete="off" autocorrect="off" name="search_query" type="text" placeholder="Search" style="background-color: transparent; border: none; outline: none; font-size: 1.3vw; color: #eee; width: 100%;"> </div> </form> <div class="youshield-button" onclick="let a=document.getElementById('search-input'); a.setAttribute('visible', (a.getAttribute('visible') == 'true') ? 'false' : 'true'); a.children[0].focus()">Search</div> <div class="youshield-button" onclick="document.location.href = '/feed/subscriptions'">Consume</div>`;
    }

    function manageSearchResults() {
        manageContentPage();
        removeWhenExists(() => { return document.querySelector('.ytd-search#header') })
    }

    function manageSubscriptionsFeed() {
        manageContentPage();
        changeWhenExists(() => { return document.querySelector('[aria-label="Manage"]') }, (elem) => { elem.textContent = 'Channels' })
    }

    function manageContentPage() {
        document.querySelector('ytd-masthead').style.opacity = 0;
        changeWhenExists(() => { return document.querySelector('ytd-topbar-menu-button-renderer.ytd-masthead') }, elem => {
            let masthead = document.getElementById('masthead-container');
            masthead.style.pointerEvents = 'none';
            elem.style.margin = '1.3vw';
            elem.style.marginLeft = '93vw';
            masthead.appendChild(elem);
            document.querySelector('ytd-masthead').remove();
        });

        removeIfExists(document.getElementsByTagName('tp-yt-app-drawer')[0]);
        document.getElementsByTagName('ytd-page-manager')[0].style.margin = '5vw';

        let searchForm = document.createElement('form');
        searchForm.action = '/results';
        searchForm.innerHTML = '<div id="search-input"> <input autocapitalize="none" autocomplete="off" autocorrect="off" name="search_query" type="text" placeholder="Search" style="background-color: transparent; border: none; outline: none; font-size: 1vw; color: #eee; width: 100%;"> </div>';
        document.body.appendChild(searchForm);

        let searchStyle = document.createElement('style');
        searchStyle.innerHTML = `#search-input { box-shadow: 0px 0px 4px #202020; background-color: #202020; border-radius: 1000px; position: absolute; padding: 0.7vw; top: 1vw; left: calc(50% - 20%); width: 40%; transition: top 0.5s, background-color 0.3s ease; } #search-input:hover{ background-color: #252525; }`;
        document.head.appendChild(searchStyle);
    }

    function removeDangerousThings() {
        for (let i = 1; i < 50; i++) {
            setTimeout(() => {
                let thingsOnBottomLeft = document.getElementsByTagName('ytd-guide-section-renderer')
                if (thingsOnBottomLeft.length > 3) {
                    thingsOnBottomLeft[2].remove(); // Explore
                    thingsOnBottomLeft[2].remove(); // More from YouTube
                }

                let buttonsOnTopLeft = document.getElementById('sections');
                if (buttonsOnTopLeft) {
                    let shortsButtonGrandparent = buttonsOnTopLeft.children[0]
                    if (shortsButtonGrandparent) {
                        let shortsButtonParent = shortsButtonGrandparent.children[1]
                        if (shortsButtonParent && shortsButtonParent.children.length > 3)
                            shortsButtonParent.children[1].remove(); // Shorts button
                    }
                }

                let notificationsButton = document.getElementsByTagName('ytd-notification-topbar-button-renderer');
                if (notificationsButton.length > 0)
                    notificationsButton[0].remove(); // Notifications button
            }, i * 100);
        }
    }

    function removeIfExists(elem) {
        if (elem) elem.remove();
    }

    function removeWhenExists(findFunction) {
        changeWhenExists(findFunction, elem => elem.remove());
    }

    function changeWhenExists(findFunction, changeFunction) {
        let elem; requestAnimationFrame(check);
        function check() {
            elem = findFunction();
            if (elem != undefined) changeFunction(elem);
            else requestAnimationFrame(check);
        }
    }

    function multipleRemoveWhenExists(findFunctions) {
        requestAnimationFrame(check);
        function check() {
            for (let i = 0; i < findFunctions.length; i++) {
                const elem = findFunctions[i]();
                if (elem != undefined) elem.remove();
                else requestAnimationFrame(check);
            }
        }
    }
})();

// QUOTE: I hope you came here concously not subconsously, because if you came here subconsously thank your self for downloading YouShield
// QUOTE: Watch what you want not what the algorithm wants
