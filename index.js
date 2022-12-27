const core = require('@actions/core');
const axios = require('axios');


// Run on every change: npm run prepare
async function run() {
  try {
    var body = JSON.stringify({
      "target": core.getInput('target'),
      "locations": core.getMultilineInput('locations')
    });

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
    if (error.response && error.response.status === 401){
      core.setFailed("api_key is not set. You can get is from https://app.ddosify.com");    
    }
    else if (error.response && error.response.status === 403){
      core.setFailed("api_key is not valid. You can get is from https://app.ddosify.com");    
    }
    else{
      core.setFailed(error.message);
    }
  }
}

run();
