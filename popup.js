//let API = 'http://localhost:8000/api/';
let API = 'https://dmca.beverlydrive.dev/api/';
let listenState = 'false';

function updateState()
{
    chrome.storage.sync.get(['listenState', 'drfHeader'], (items) => {
        if (items.listenState == 'true')
            document.getElementById('listen_status').innerHTML = 'Listening!';
        else
            document.getElementById('listen_status').innerHTML = 'Not listening.';

        if (items.drfHeader.length > 10)
            document.getElementById('logged_in').innerHTML = 'Logged in!';
        else
            document.getElementById('logged_in').innerHTML = 'Not logged in.';
    });
}

function getId() {
  return new Promise((yes, no) => {
    yes(document.getElementById('uname').value);
  });
}

function getPw() {
  return new Promise((yes, no) => {
    yes(document.getElementById('passwd').value);
  });
}

function getAuth() {
  getId().then((inputId) => {
    getPw().then((inputPw) => {
      chrome.runtime.sendMessage({
          method: 'POST',
          action: 'xhttp',
          url: `${API}api-token-auth/`,
          data: `username=${inputId}&password=${inputPw}`,
          drf: 'null'
      }, function(responseText) {
          if (/non_field/.test(responseText)) {
            alert('Try again. Wrong info\nPress enter');
          } else {
            chrome.storage.sync.set({
              'drfHeader': `Token ${JSON.parse(responseText).token}`,
              'listenState': 'false'
            });
            alert('Logged in. Press enter.');
          }
      });
    });
  });
}

function toggle()
{
  chrome.storage.sync.get(['listenState'], (items) => {

    if (items.listenState == 'false')
    {
      console.log('Was false')
      chrome.storage.sync.set({'listenState': 'true'});
      alert('Toggled listen state: [ On ]');
    } else if (items.listenState == 'true')
    {
      console.log('was true')
      chrome.storage.sync.set({'listenState': 'false'});
      alert('Toggled listen state: [ Off ]');
    }

    updateState();
  });
}

document.getElementById('login').addEventListener('click', getAuth);
document.getElementById('toggle').addEventListener('click', toggle);

updateState();
