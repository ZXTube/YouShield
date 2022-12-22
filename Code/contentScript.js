(() => {
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        if (obj.type == 'NEW_VIDEO_OPENED') {
            setTimeout(manageVideo, 200);
        } else if (obj.type == 'SHORTS_OPENED') {
            manageShorts();
        } else if (obj.type == 'HOMEPAGE_OPENED') {
            setTimeout(manageHomepage, 500);
        }
    });

    if (window.location.href.includes('https://www.youtube.com/watch')) {
        manageVideo();
    } else if (window.location.href.includes('https://www.youtube.com/shorts')) {
        manageShorts();
    } else if (window.location.href == 'https://www.youtube.com/' || window.location.href.startsWith('https://www.youtube.com/?')) {
        manageHomepage();
    }

    function manageVideo() {
        for (let i = 1; i < 50; i++) {
            setTimeout(() => {
                let video_recommendations = document.getElementById('secondary');
                if (video_recommendations)
                    video_recommendations.remove();

                let endscreen = document.getElementsByClassName('html5-endscreen')[0];
                if (endscreen)
                    endscreen.remove();

                let suggestions = document.getElementsByClassName('ytp-ce-element')[0];
                if (suggestions)
                    suggestions.remove();

                let autoplay_video = document.getElementsByClassName('ytp-autonav-endscreen-countdown-overlay')[0];
                if (autoplay_video)
                    autoplay_video.remove();

                removeDangerousThings();
            }, i * 100);
        }
    }

    function manageShorts() {
        for (let i = 1; i < 10; i++) {
            setTimeout(() => {
                let otherShorts = document.getElementsByTagName('ytd-reel-video-renderer');
                for (let i = 1; i < otherShorts.length; i++) {
                    otherShorts[i].remove();
                }

                removeDangerousThings();
            }, i * 500);
        }
    }

    function manageHomepage() {
        for (let i = 1; i < 70; i++) {
            setTimeout(() => {
                let video_recommendations = document.getElementsByTagName('ytd-rich-grid-renderer');
                if (video_recommendations.length > 0 && video_recommendations[0].classList.contains('style-scope')) {
                    video_recommendations[0].classList.remove('style-scope');
                    video_recommendations[0].innerHTML = `<img src="${chrome.runtime.getURL("Resources/Homepage.png")}" style="width:80vw; position: absolute; top: 1px;">`;
                    video_recommendations[0].style = "font-family: cursive; font-size: 4vw; text-align: center; width: 80%;position: absolute; top: 10%; color: rgb(200, 200, 200)";
                }

                removeDangerousThings();
            }, i * 100);
        }
    }

    function removeDangerousThings() {
        let thingsOnBottomLeft = document.getElementsByTagName('ytd-guide-section-renderer')
        if (thingsOnBottomLeft.length > 2) {
            thingsOnBottomLeft[2].remove();
            thingsOnBottomLeft[3].remove();
        }

        let buttonsOnTopLeft = document.getElementById('sections');
        if (buttonsOnTopLeft) {
            let shortsButtonGrandparent = buttonsOnTopLeft.children[0]
            if (shortsButtonGrandparent) {
                let shortsButtonParent = shortsButtonGrandparent.children[1]
                if (shortsButtonParent.children.length > 3)
                    shortsButtonParent.children[1].remove();
            }
        }

        let notificationsButton = document.getElementsByTagName('ytd-notification-topbar-button-renderer');
        if (notificationsButton.length > 0)
            notificationsButton[0].remove();
    }
})();

// QUOTE: I hope you came here concously not subconsously, because if you came here subconsously thank your self for downloading YouShield
// QUOTE: Watch what you want not what the algorithm wants

// ERRORS: Fix youtube.com/@examplechannel/videos/ problem
