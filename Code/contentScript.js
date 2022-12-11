(() => {
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        if (obj.type == 'NEW_VIDEO_OPENED') {
            setTimeout(manageVideo, 200);
        } else if (obj.type == 'SHORTS_OPENED') {
            manageShorts();
        } else if (obj.type == 'HOMEPAGE_OPENED') {
            setTimeout(manageHomepage, 1000);
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
        for (let i = 1; i < 15; i++) {
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
            }, i * 500);
        }
    }

    function manageShorts() {
        document.head.innerHTML = '<title>Nope :)</title>';
        document.body.style = 'background-color: rgb(30, 30, 30); font-family: cursive; text-align: center; color: rgb(200, 200, 200);';
        document.body.innerHTML = '<p style = "font-size: 20vw; margin: 0px; margin-top: 5vw; margin-bottom: 5vw">Nope :)</p><p style="font-size:1vw">There\'s <b>NO</b> way that I\'m going to let you fall into the shorts trap.</p>';
    }

    function manageHomepage() {
        for (let i = 1; i < 25; i++) {
            setTimeout(() => {
                let video_recommendations = document.getElementsByTagName('ytd-rich-grid-renderer')[0];
                if (video_recommendations) {
                    video_recommendations.innerHTML = 'This place is too dangerous';
                    video_recommendations.style = "font-family: cursive; font-size: 4vw; text-align: center; width: 80%;position: absolute; top: 45%; color: rgb(200, 200, 200)";
                }
            }, i * 300);
        }
    }
})();
