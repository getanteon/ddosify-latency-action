const core = require('@actions/core');
const axios = require('axios');


// Run on every change: npm run prepare
async function run() {
  try {
    var body = {
      "target": core.getInput('target'),
      "locations": core.getInput('locations')
    };

    const response = await axios.post(
      'https://api.ddosify.com/v1/latency/test/',
      body,
      {
        headers: {
          "X-API-KEY": core.getInput('api_key'),
          "Content-Type": "application/json",
          "Accept-Encoding": "gzip,deflate,compress"
        }
      }
    ).then(function (response) {
      console.log(response.data);
      core.setOutput('result', JSON.stringify(result));
    });

  } catch (error) {
    core.setFailed(error.message, error.body);
  }
}

run();
