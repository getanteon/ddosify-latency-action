const core = require('@actions/core');
const axios = require('axios');


function getConcatenatedLocations(obj) {
  const concatenatedKeysAndValues = {};

  function traverse(current, path) {
    for (const key in current) {
      const value = current[key];
      const newPath = path ? `${path}.${key.split(':')[0]}` : key.split(':')[0];

      if (Array.isArray(value)) {
        value.forEach((item) => {
          const [key, val] = item.split(':');
          concatenatedKeysAndValues[`${newPath}.${key}`] = val;
        });
      } else if (typeof value === 'object') {
        traverse(value, newPath);
      } else {
        const [key, val] = value.split(':');
        concatenatedKeysAndValues[`${newPath}.${key}`] = val;
      }
    }
  }

  traverse(obj);
  return concatenatedKeysAndValues;
}

// Run on every change: npm run prepare
async function run() {

  const failIfText = core.getInput('failIf').trim(); // any>100 or NA.US.MA.BO>80
  const target = core.getInput('target')  // https://example.com
  const locationsInput = JSON.parse(core.getInput('locations'))  // ["*"]
  const apiKey = core.getInput('api_key')

  const failIfArr = failIfText.split(">")
  const failIfLocation = failIfArr[0].trim()
  const failIfLatency = parseInt(failIfArr[1].trim())
  let failedLocations = []
  response = {}
  if (failIfText !== "") {
    core.info(`\u001b[33mFail if:   ${failIfText} \x1b[0m`)
  }

  core.info(`\u001b[33mTarget:    ${target} \x1b[0m`)
  core.info(`\u001b[33mLocations: ${locationsInput} \x1b[0m`)

  try {
    const responseLocations = await axios.get(
      'https://api.ddosify.com/v1/latency/locations/',
      {
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
          "Accept-Encoding": "gzip,deflate,compress"
        }
      }
    );

    const responseTest = await axios.post(
      'https://api.ddosify.com/v1/latency/test/',
      {
        "target": target,
        "locations": locationsInput
      },
      {
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
          "Accept-Encoding": "gzip,deflate,compress"
        }
      }
    );

    const locations = getConcatenatedLocations(responseLocations.data);

    console.log(`┌────────────────────────────────────────────────────────────────────────────────────┐`);
    console.log(`| ${"Location".padEnd(20)} | ${"Location Code".padEnd(15)} | ${"Status Code".padEnd(8)} | ${"Latency (ms)".padEnd(10)} | ${"Fail If (ms)".padEnd(8)} |`);
    console.log(`├────────────────────────────────────────────────────────────────────────────────────┤`);
    for (let locKey in responseTest.data) {
      logText = ""
      response[locKey + 1] = { ...{ "location": locations[locKey] }, ...{ "location_code": locKey }, ...responseTest.data[locKey] }
      latency = responseTest.data[locKey]["latency"];
      statusCode = responseTest.data[locKey]["status_code"]
      if (statusCode === undefined) {
        statusCode = "Fail"
      }
      latency = responseTest.data[locKey]["latency"]
      if (latency === undefined) {
        latency = "Fail"
      }
      logText = `| ${locations[locKey].padEnd(20)} | ${locKey.padEnd(15)} |    ${statusCode.toString().padEnd(8)} |     ${latency.toString().padEnd(8)} |`;

      if (failIfText !== "" && ((failIfLocation === "any") || (locKey.startsWith(failIfLocation.replaceAll("*", ""))))) {
        logText += `    >${failIfLatency.toString().padEnd(8)} |`
        if (latency !== "Fail" && latency > failIfLatency) {
          failedLocations.push(`${latency},${locations[locKey]},${failIfLatency}`)
          logText = "\u001b[38;2;255;0;0m" + logText + "\x1b[0m"
        }
      }
      else {
        logText += `${"".padEnd(13)} |`
      }
      core.info(logText);
    }
    core.setOutput("result", response);
    // console.table(response);

    for (let i in failedLocations) {
      const fLoc = failedLocations[i].split(",")
      core.error(`${fLoc[1]} latency: ${fLoc[0]}ms > ${fLoc[2]}ms.`);
    }
    if (failedLocations.length > 0) {
      core.setFailed("")
    }

  } catch (error) {
    if (error.response && error.response.status === 401) {
      core.setFailed("api_key is not set. You can get is from https://app.ddosify.com");
    }
    else if (error.response && error.response.status === 403) {
      core.setFailed("api_key is not valid. You can get is from https://app.ddosify.com");
    }
    else {
      core.setFailed(error.message);
    }
  }
}

run();
