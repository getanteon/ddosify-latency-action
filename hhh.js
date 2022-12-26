const core = require('@actions/core');
const axios = require('axios');


// Run on every change: npm run prepare
// most @actions toolkit packages have async methods
async function run() {
  try {
    var body = {
      // "target": core.getInput('target'),
      // "locations": core.getInput('locations')
      "target": "https://app.servdown.com",
      "locations": ["*"]
    };

    const response = await axios.post(
      'https://api.ddosify.com/v1/latency/test/',
      body,
      {
        headers: {
          // "X-API-KEY": core.getInput('api_key'),
          "X-API-KEY": "8e745f05-e1bd-41bf-9276-ac7689e640e6",
          "Content-Type": "application/json",
          "Accept-Encoding": "gzip,deflate,compress"
        }
      }
    ).then(function (response) {
      console.log(response.data);
      core.setOutput('result', JSON.stringify(result));
    });


  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
