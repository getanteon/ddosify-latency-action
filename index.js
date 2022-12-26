const core = require('@actions/core');

// Run on every change: npm run prepare
// most @actions toolkit packages have async methods
async function run() {
  try {
    var body = JSON.stringify({
      "target": core.getInput('target'),
      "locations": core.getInput('locations')
    });

    var requestOptions = {
      method: 'POST',
      headers: {
        "X-API-KEY": core.getInput('api_key'),
        "Content-Type": "application/json"
      },
      body: body,
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
