"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const  consultas = require("./consultas");
const requestWs = require("request");

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
      console.log(req.body.queryResult.parameters.Documento)
      if(req.body.queryResult.parameters.OpcionWs="ConsultarCliente"){
        var resp= consultas.ConsultarCliente(req.body.queryResult.parameters.Documento);

        resp.then(JSON.parse, errHandler)
        .then(function(result) {
             var respuestaConsulta = result;
             console.log(respuestaConsulta);
             console.log(respuestaConsulta.ConsultarClienteResult.Resultado);
             if(respuestaConsulta.ConsultarClienteResult.Resultado){
               const fullName = respuestaConsulta.ConsultarClienteResult.PrimerNombre+" "+
                                  respuestaConsulta.ConsultarClienteResult.SegundoNombre+" "+
                                    respuestaConsulta.ConsultarClienteResult.PrimerApellido+" "+
                                      respuestaConsulta.ConsultarClienteResult.SegundoApellido;
                                      console.log(fullName);
              return res.json({ 
                "fulfillmentText": "Bienvenido "+fullName  ,
                "fulfillmentMessages": [
                  {
                    "text": {
                      "text": ["Bienvenido "+fullName ]
                    }
                  }
                ],
                "followupEventInput": [
                   {
                     "name":"clientehallado", 
                     "parameters":{
                        "fullName": fullName
                     }
                   }
                ],
                "source": "<webhookpn1>" 
                });
             }else{
              return res.json({ 
                "fulfillmentText": "No existes en nuestro sistema, ¿Deseas Registrarte?",
                "fulfillmentMessages": [
                  {
                    "text": {
                      "text": ["No existes en nuestro sistema, ¿Deseas Registrarte?"]
                    }
                  }
                ],
                "source": "<webhookpn1>" 
                });
             }
         }, errHandler);


      
      }
    }else{
      speech= "Seems like some problem. Speak again."+req.body;
    }

      
 
});


restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});

var errHandler = function(err) {
  console.log(err);
}

