var pc
var result = null
document.querySelector('#startChecking').addEventListener(
  'click',
  function () {
    document.querySelector('#result').innerText = 'Checking...'
      var configuration = {
        iceServers: [
          {
            urls: [
              'turn:' + document.querySelector('#turnName').value + ':' + document.querySelector('#portNumber').value 
            ],
            username: document.querySelector('#userName').value,
            credential: document.querySelector('#password').value
          }
        ]
      }
      pc = new RTCPeerConnection(configuration)
      pc.createDataChannel("foo")
      pc.addEventListener('icecandidate', e => onIceCandidate(e))
      pc.createOffer().then(offer => pc.setLocalDescription(offer))
  }
)

function onIceCandidate (e) {
  if (!e.candidate) {
    if (result === null) {
      document.querySelector('#result').innerText = 'X ERR'
      result = false
    }
    return
  }
  var data = parseCandidate(e.candidate.candidate)
  console.log(data)
  if (data.type === 'relay') {
    document.querySelector('#result').innerText = 'V OK'
    result = true
  }
}

function parseCandidate(line) {
  var parts;
  if (line.indexOf('a=candidate:') === 0) {
    parts = line.substring(12).split(' ');
  } else {
    parts = line.substring(10).split(' ');
  }

  var candidate = {
    foundation: parts[0],
    component: parts[1],
    protocol: parts[2].toLowerCase(),
    priority: parseInt(parts[3], 10),
    ip: parts[4],
    port: parseInt(parts[5], 10),
    type: parts[7]
  };

  for (var i = 8; i < parts.length; i += 2) {
    switch (parts[i]) {
      case 'raddr':
        candidate.relatedAddress = parts[i + 1];
        break;
      case 'rport':
        candidate.relatedPort = parseInt(parts[i + 1], 10);
        break;
      case 'tcptype':
        candidate.tcpType = parts[i + 1];
        break;
      default:
        break;
    }
  }
  return candidate;
};
