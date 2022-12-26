const core = require('@actions/core');


// most @actions toolkit packages have async methods
async function run() {
  try {
    var ddosifyHeaders = new Headers();
    ddosifyHeaders.append("X-API-KEY", core.getInput('api_key'));
    ddosifyHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "target": core.getInput('target'),
      "locations": core.getInput('locations')
    });

    var requestOptions = {
      method: 'POST',
      headers: ddosifyHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("https://api.ddosify.com/v1/latency/test/", requestOptions)
      .then(response => response.text())
      .then(result => core.setOutput('result', JSON.stringify(result)))

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
