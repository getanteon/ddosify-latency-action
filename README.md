<h1 align="center">
    <img src="https://raw.githubusercontent.com/ddosify/ddosify/master/assets/ddosify-logo-db.svg#gh-dark-mode-only" alt="Ddosify logo dark" width="336px" /><br />
    <img src="https://raw.githubusercontent.com/ddosify/ddosify/master/assets/ddosify-logo-wb.svg#gh-light-mode-only" alt="Ddosify logo light" width="336px" /><br />
    Ddosify Latency Testing Action
</h1>

Ddosify's Latency Observation Action allows you to measure your latency of the endpoint from 60+ cities around the world. 
With this action, you can track the performance of your endpoints over time and ensure that they are meeting your desired latency targets. Whether you are running a web application, a mobile backend, or any other type of service, this action can help you monitor the latency for the best user experience.

Using this action is simple - just add it to your workflow and configure the request details. You can specify the `Target URL`, `Locations` and `Fail If` scenarios to fail the pipeline based on latencies. This action uses Ddosify [Latency Testing API](https://docs.ddosify.com/cloud/api/latency-testing-api) under the hood. 

⚠️ This action uses [Ddosify Cloud API Key](https://app.ddosify.com) that you can store in [Github Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets).


## Inputs

| input     | required | default | example               | description                                                                                                                                                                                          |
|-----------|----------|---------|-----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| api_key   | true     |         |                       | Ddosify Cloud API Key. Available in https://app.ddosify.com. Account Settings. You can store Ddosify API key in [Github Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets).|
| target    | true     |         | `"https://ddosify.com"` | Target URL or IP address for your endpoint                                                                                                                                                           |
| locations | false    | `'["*"]'` | `'["NA.*"]'`            | Locations where the requests will sent from. The example gets the latencies from all the available cities from North America (NA) Continent. Examples: [locations](#locations)  |
| failIf    | false    |         | `"EU.*>100"`            | Fail the pipeline if the locations latency is greater than the specified milliseconds (ms)latency. Valid Examples: `"any>100"`, `"NA.US.MA.BO>50"`, `"NA.*>80"`                                            |


## Usage

Once every `1 hour`, this action gets the latencies of the target url (`"https://app.servdown.com"`) all over the world and will fail if any of Europe (EU) city's latency is greater than 100ms. 

💡 You can store [Ddosify Cloud API Key](https://app.ddosify.com) in [Github Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets).



```yaml
name: "Ddosify Latency Testing"

on:
  schedule:
    - cron:  '0 * * * *'  # Every one hour. The shortest interval is once every 5 minutes

jobs:
  latency-test:
    runs-on: ubuntu-latest

    steps:
    - name: Ddosify Latency Test
      uses: ddosify/ddosify-latency-action@v1
      with:
        api_key: ${{ secrets.DDOSIFY_API_KEY }}   # Store DDOSIFY_API_KEY as secret
        target: "https://app.servdown.com"        # Target Endpoint for latency testing
        locations: '["*"]'                        # (optional) All the cities
        failIf: "EU.*>100"                        # (optional) If any of Europe (EU) city's latency is greater than 100ms, fail the pipeline 

```

## Input Examples

### locations

You can get the location name and codes from [example output](#example-output).

| Example              | Description                                           |
|----------------------|-------------------------------------------------------|
| `'["*"]'`            | All over the world (60+ cities)                       |
| `'["NA.*"]'`         | All the available cities from North America (NA) Continent |
| `'["EU.DE.*"]'`      | All the available cities from Germany                 |
| `'["EU.GB.ENG.LO"]'` | From London                                           |

### failIf

| Example              | Description                                           |
|----------------------|-------------------------------------------------------|
| `"any>100"`          | Fail if any of the locations is greater than 100ms latency |
| `"EU.*>80"`          | Fail if any of the locations from Europe (EU) Continent is greater than 80ms latency |
| `"NA.US.TX.*>120"`   | Fail if any of the locations from Texas is greater than 120ms latency         |
| `"NA.US.TX.DA>120"`   | Fail if Dallas is greater than 120ms latency  |


## Example Output

```
Fail if:   EU.*>100 
Target:    https://app.servdown.com 
Locations: * 
┌────────────────────────────────────────────────────────────────────────────────────┐
| Location             | Location Code   | Status Code | Latency (ms) | Fail If (ms) |
├────────────────────────────────────────────────────────────────────────────────────┤
| Las Vegas            | NA.US.NV.LV     |    200      |     196      |              |
| Oslo                 | EU.NO.OS        |    200      |     63       |    >100      |
| Boston               | NA.US.MA.BO     |    200      |     126      |              |
| Seoul                | AS.KR.SE        |    200      |     288      |              |
| Istanbul             | AS.TR.IS        |    200      |     56       |              |
| Cape Town            | AF.ZA.WC.CT     |    200      |     169      |              |
| San Antonio          | NA.US.TX.SA     |    200      |     138      |              |
| Denver               | NA.US.CO.DE     |    200      |     154      |              |
| Hamburg              | EU.DE.HA.HA     |    200      |     28       |    >100      |
| Chicago              | NA.US.IL.CH     |    200      |     116      |              |
| Hyderabad            | AS.IN.TG.HY     |    200      |     145      |              |
| Salt Lake City       | NA.US.UT.SLC    |    200      |     139      |              |
| Amsterdam            | EU.NL.NH.AM     |    200      |     31       |    >100      |
| Hong Kong            | AS.CN.HCW.HK    |    200      |     205      |              |
| Minneapolis          | NA.US.MN.MI     |    200      |     117      |              |
| Sao Paulo            | SA.BR.SA        |    200      |     231      |              |
| Denizli              | AS.TR.DE        |    200      |     81       |              |
| Sydney               | OC.AU.NSW.SY    |    200      |     313      |              |
| Dublin               | EU.IE.L.DU      |    200      |     35       |    >100      |
| New Delhi            | AS.IN.DL.ND     |    200      |     272      |              |
| Lappeenranta         | EU.FI.SK.LA     |    200      |     55       |    >100      |
| Stockholm            | EU.SE.ST        |    200      |     32       |    >100      |
| Des Moines           | NA.US.IA.DM     |    200      |     127      |              |
| Los Angeles          | NA.US.CA.LA     |    200      |     184      |              |
| Montreal             | NA.CA.QC.MO     |    200      |     114      |              |
| Pune                 | AS.IN.MH.PU     |    200      |     139      |              |
| Houston              | NA.US.TX.HO     |    200      |     131      |              |
| Johannesburg         | AF.ZA.GP.JO     |    200      |     189      |              |
| Miami                | NA.US.FL.MI     |    200      |     158      |              |
| New York             | NA.US.NJ.NY     |    200      |     96       |              |
| Dallas               | NA.US.TX.DA     |    200      |     162      |              |
| Melbourne            | OC.AU.VIC.ME    |    200      |     310      |              |
| Philadelphia         | NA.US.PA.PH     |    200      |     102      |              |
| Quincy               | NA.US.WA.QU     |    200      |     163      |              |
| Toronto              | NA.CA.ON.TO     |    200      |     114      |              |
| Frankfurt            | EU.DE.HE.FR     |    200      |     21       |    >100      |
| Milan                | EU.IT.25.MI     |    200      |     44       |    >100      |
| Taipei               | AS.TW.TP        |    200      |     268      |              |
| Warsaw               | EU.PL.MZ.WA     |    200      |     28       |    >100      |
| Ankara               | AS.TR.AN        |    200      |     62       |              |
| Mumbai               | AS.IN.MH.MU     |    200      |     145      |              |
| North Charleston     | NA.US.SC.NC     |    200      |     112      |              |
| Doha                 | AS.QA.DA.DO     |    200      |     132      |              |
| Seattle              | NA.US.WA.SE     |    200      |     160      |              |
| Atlanta              | NA.US.GA.AT     |    200      |     118      |              |
| Paris                | EU.FR.IDF.PA    |    200      |     64       |    >100      |
| Ashburn              | NA.US.VA.AS     |    200      |     97       |              |
| London               | EU.GB.ENG.LO    |    200      |     34       |    >100      |
| Kansas City          | NA.US.MO.KC     |    200      |     127      |              |
| Jakarta              | AS.ID.JK        |    200      |     275      |              |
| Tel Aviv             | AS.IL.TA        |    200      |     88       |              |
| Phoenix              | NA.US.AZ.PH     |    200      |     191      |              |
| Manama               | AS.BH.MA        |    200      |     127      |              |
| Madrid               | EU.ES.MA        |    200      |     53       |    >100      |
| Osaka                | AS.JP.OS        |    200      |     243      |              |
| Izmir                | AS.TR.IZ        |    200      |     61       |              |
| Dublin               | NA.US.OH.DU     |    200      |     106      |              |
| Tokyo                | AS.JP.TO        |    200      |     270      |              |
| Portland             | NA.US.OR.PO     |    200      |     178      |              |
| Dubai                | AS.AE.DU        |    200      |     131      |              |
| Singapore            | AS.SG.01.SI     |    200      |     167      |              |
| Santiago             | SA.CL.RM.SA     |    200      |     215      |              |
| Zurich               | EU.CH.ZH        |    200      |     26       |    >100      |
| San Jose             | NA.US.CA.SJ     |    200      |     174      |              |
```

## Communication

You can join our [Discord Server](https://discord.gg/9KdnrSUZQg) for issues, feature requests, feedbacks or anything else. 

## License

Licensed under the MIT: https://github.com/ddosify/ddosify-latency-action/blob/master/LICENSE
