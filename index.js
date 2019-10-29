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
                "followupEventInput": 
                   {
                     "name":"clientehallado", 
                     "parameters":{
                        "fullName": fullName
                     }
                   }
               
                });

             }else{
               return res.json({ 
                "followupEventInput": 
                   {
                     "name":"clientenohallado", 
                     "parameters":{
                        "msgNoExisteCliente": "No existes en nuestro sistema ¿Deseas registrarte rapidamente?"
                     }
                   }
               
                });

             }
         }, errHandler);


      
      }
    }else{
      return res.json({ 
        "followupEventInput": 
           {
             "name":"welcome", 
             "parameters":{
                "msgNoExisteCliente": "Error de parametros en webhook"
             }
           }
       
        });
    }

      
 
});


restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});

var errHandler = function(err) {
  console.log(err);
}

