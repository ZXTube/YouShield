let strictnessLevels = [
    ['Failure', '2 hours and 30 minutes', 9000],
    ['Useless', '2 hours', 7200],
    ['Normal', '1 hour and 30 minutes', 5400],
    ['Useful', '1 hour', 3600],
    ['!Failure', '30 minutes', 1800]
];
let sliderValueLookupTable = {
    9000: 1,
    7200: 2,
    5400: 3,
    3600: 4,
    null: 4,
    1800: 5
};

let tomorrowSliderHandle = document.getElementsByClassName('tomorrow-slider-handle')[0];
let tomorrowHabibiText = document.getElementsByClassName('tomorrow-habibi-text')[0];
let strictnessSlider = document.getElementsByClassName('strictness-slider')[0];
let timeAllowedText = document.getElementsByClassName('time-allowed-text')[0];
let strictnessText = document.getElementsByClassName('strictness-text')[0];

let valueWhenOpened;

function encode(number) {
    return number + 139528034;
}

function decode(encodedValue) {
    let decodedValue = encodedValue - 139528034
    if (decodedValue >= 0) {
        return decodedValue;
    } else {
        return 3600;
    }
}

function setupSlider() {
    chrome.storage.local.get(['allowedWatchTime'], (result) => {
        strictnessSlider.value = sliderValueLookupTable[decode(result.allowedWatchTime)];

        chrome.storage.local.get(['ignoredWatchTime'], (result) => {
            let tomorrowValue = sliderValueLookupTable[decode(result.ignoredWatchTime)];
            tomorrowSliderHandle.style.left = (tomorrowValue - 1) * 68 + 3 + 'px';
            valueWhenOpened = strictnessSlider.value;

            strictnessText.textContent = strictnessLevels[strictnessSlider.value - 1][0];
            timeAllowedText.textContent = strictnessLevels[strictnessSlider.value - 1][1];
        });
    });
}

function makeInputListener() {
    strictnessSlider.oninput = () => {
        tomorrowSliderHandle.style.left = (strictnessSlider.value - 1) * 68 + 3 + 'px';

        let lis = strictnessLevels[strictnessSlider.value - 1];
        chrome.storage.local.set({ 'ignoredWatchTime': encode(lis[2]) });
        timeAllowedText.textContent = lis[1];
        strictnessText.textContent = lis[0];

        if (strictnessSlider.value < valueWhenOpened) {
            setTimeout(() => {
                strictnessSlider.value = valueWhenOpened;
                tomorrowHabibiText.style.display = 'block';
                setTimeout(() => { tomorrowHabibiText.style.display = 'none'; }, 500);

                lis = strictnessLevels[strictnessSlider.value - 1];

                strictnessText.textContent = lis[0];
                timeAllowedText.textContent = lis[1];
            }, 200);
        }
        else {
            chrome.storage.local.set({ 'allowedWatchTime': encode(lis[2]) });
        }
    }
}

setupSlider();
makeInputListener();
