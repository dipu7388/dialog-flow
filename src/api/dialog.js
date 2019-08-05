/* eslint-disable no-console */
'use strict';
import {http} from 'http'
// import { WebhookClient , Card , Suggestion} from "dialogflow-fulfillment";
import { functions } from "firebase-functions";

var options = {
  "method": "POST",
//  "hostname": "service.lsnetx.com",
    "hostname": "my-json-server.typicode.com",
//   "path": "add/enquery?cid=3",
"path": [
   // "add",
   // "enquery"
  "typicode",
  "demo",
  "posts",
  "1"
  ],
  'qs': {'cid': 3},
  "headers": {
    "Accept": "*/*",
    "Cache-Control": "no-cache",
    "Accept-Encoding": "gzip, deflate",
    "Referer": "*/*",
    "Connection": "keep-alive",
    "cache-control": "no-cache",
    'Content-Type': 'application/json'
  }
};
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) =>  {
  // const agent = new WebhookClient({ request, response });
  // eslint-disable-next-line no-console
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  console.log("BODY");
  const action = request.body.queryResult.action;
    response.setHeader('Content-Type', 'application/json');

    if (action != 'input.contact') {
        response.send(buildChatResponse("I'm sorry, I don't know this"+action))
        return;
    }

    const parameters = request.body.queryResult.parameters;

    let enquiryModel={};
    enquiryModel.personName= parameters['given-name'];
    enquiryModel.eamilAddress=  parameters['email'];
    enquiryModel.contactNumber= parameters['phone-number'];
    enquiryModel.enquiryType=2;
    submitEnquery(enquiryModel, response);
});



function submitEnquery(enquiryModel, cloudFnResponse) {
    console.log("Company enquery Model: " + JSON.stringify(enquiryModel));

    var req = http.request(options, function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        // eslint-disable-next-line no-console
        console.log("Received json response: " + chunk);
        chunks.push(chunk);
      });

      res.on("end", function () {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
        var chat="Your request seccessfully sent to our experts";
        cloudFnResponse.send(buildChatResponse(chat));
      });
    });

    req.write(JSON.stringify(enquiryModel));
    req.end();
}

function buildChatResponse(chat) {
    return JSON.stringify({ "speech": chat, "displayText": chat});
}
