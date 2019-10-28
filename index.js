"use strict";

const express = require("express");
const bodyParser = require("body-parser");

const restService = express();

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());

restService.post("/echo", function(req, res) {
  var speech ="";

  if(
    req.body.queryResult &&
    req.body.queryResult.parameters &&
    req.body.queryResult.parameters.Documento &&
    req.body.queryResult.parameters.OpcionWs){
      speech= "Opcion: "+req.body.queryResult.parameters.OpcionWs
      +" / Doc: "+req.body.queryResult.parameters.Documento;
    }else{
      speech= "Seems like some problem. Speak again."+req.body;
    }

      
  return res.json({

  "fulfillmentText": speech,
  "fulfillmentMessages": [
    {
      "text": {
        "text": [speech]
      }
    }
  ],
  "source": "<webhookpn1>"


  });
});


restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});
