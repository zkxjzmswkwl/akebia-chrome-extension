let lastWatch;
let drfHeader;

chrome.storage.sync.get(['drfHeader'], (items) => {
    drfHeader = items.drfHeader;
});

function isWatchingVideo ()
{
    if (window.location.href.indexOf('v=') > -1)
        return true;
    else
        return false;
}

function post(vidId)
{
    chrome.runtime.sendMessage({
        method: 'POST',
        action: 'xhttp',
        url: 'http://localhost:8000/api/members/change_yt_song/',
        data: `watchId=${vidId}`,
        drf: drfHeader
    }, function (resp) {
        console.log(resp);
        lastWatch = vidId;
    });
}

function parseWatchId (location)
{
    return new Promise ((yes, no) => {
        yes (location.split('v=')[1]);
    });
}

function getWatchId()
{
    chrome.storage.sync.get(['listenState'], (items) => {
        console.log(items);
        if (items.listenState == 'true')
        {
            parseWatchId(window.location.href).then((watchId) => {
                if (watchId != lastWatch)
                {
                    post(watchId);
                } else {
                    console.log(`lastWatch: ${lastWatch}\n watchId: ${watchId}`);
                }
            });
        } else {
            console.log('User not toggled listening, not fetching any information.');
        }
    });
}


function run()
{
    setInterval(() => {
        if (isWatchingVideo())
            getWatchId();
    }, 2500);
}

console.log('Akebia extension loaded.');
run();
