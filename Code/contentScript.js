(() => {
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        if (obj.type == 'NEW_VIDEO_OPENED') {
            setTimeout(manageVideo, 200);
        } else if (obj.type == 'SHORTS_OPENED') {
            manageShorts();
        } else if (obj.type == 'HOMEPAGE_OPENED') {
            setTimeout(manageHomepage, 500);
        }

        removeDangerousThings();
    });

    if (window.location.href.includes('https://www.youtube.com/watch')) {
        manageVideo();
    } else if (window.location.href.includes('https://www.youtube.com/shorts')) {
        manageShorts();
    } else if (window.location.href == 'https://www.youtube.com/' || window.location.href.startsWith('https://www.youtube.com/?')) {
        manageHomepage();
    }

    removeDangerousThings();

    function manageVideo() {
        for (let i = 1; i < 50; i++) {
            setTimeout(() => {
                let videoRecommendations = document.getElementById('secondary-inner');
                if (videoRecommendations)
                    videoRecommendations.parentNode.remove();

                let endscreen = document.getElementsByClassName('html5-endscreen')[0];
                if (endscreen)
                    endscreen.remove();

                let suggestions = document.getElementsByClassName('ytp-ce-element')[0];
                if (suggestions)
                    suggestions.remove();

                let autoplayVideo = document.getElementsByClassName('ytp-autonav-endscreen-countdown-overlay')[0];
                if (autoplayVideo)
                    autoplayVideo.remove();
            }, i * 100);
        }
    }

    function manageShorts() {
        for (let i = 1; i < 10; i++) {
            setTimeout(() => {
                let otherShorts = document.getElementsByTagName('ytd-reel-video-renderer');
                for (let i = 1; i < otherShorts.length; i++) {
                    otherShorts[1].remove();
                }
            }, i * 500);
        }
    }

    function manageHomepage() {
        for (let i = 1; i < 70; i++) {
            setTimeout(() => {
                let videoRecommendations = document.getElementsByTagName('ytd-two-column-browse-results-renderer');
                for (let i = 0; i < videoRecommendations.length; i++) {
                    if (videoRecommendations[i].getAttribute('page-subtype') == 'home' && videoRecommendations[i].classList.contains('style-scope')) {
                        videoRecommendations[i].classList.remove('style-scope');
                        videoRecommendations[i].innerHTML = `<img src="${chrome.runtime.getURL("Resources/Homepage.png")}" style="width:80vw; position: absolute; top: 1px;">`;
                        videoRecommendations[i].style = "font-family: cursive; font-size: 4vw; text-align: center; width: 80%;position: absolute; top: 10%; color: rgb(200, 200, 200)";
                    }
                }
            }, i * 100);
        }
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
})();

// QUOTE: I hope you came here concously not subconsously, because if you came here subconsously thank your self for downloading YouShield
// QUOTE: Watch what you want not what the algorithm wants
