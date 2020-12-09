//let API = 'http://localhost:8000/api/';
let API = 'https://dmca.beverlydrive.dev/api/';
let listenState = 'false';

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
            alert('Logged in. Key enter.');
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
  });
}

document.getElementById('login').addEventListener('click', getAuth);
document.getElementById('toggle').addEventListener('click', toggle);
