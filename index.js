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

     
      if(req.body.queryResult.parameters.OpcionWs="ConsultarCliente"){

        console.log(req.body.queryResult.parameters.Documento)

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


      if(req.body.queryResult.parameters.OpcionWs="InsertarCliente"){
        

        var ArrayDoc=req.body.queryResult.parameters.Documento;
        var docString=ArrayDoc.join('');
        console.log(docString);
        var resp= consultas.InsertarCliente(req.body.queryResult.parameters.CamapanaId,
          docString,
          req.body.queryResult.parameters.PrimerNombre,
          req.body.queryResult.parameters.SegundoNombre,
          req.body.queryResult.parameters.PrimerApellido,
          req.body.queryResult.parameters.SegundoApellido,
          req.body.queryResult.parameters.Celular,
          req.body.queryResult.parameters.Correo,
          req.body.queryResult.parameters.Direccion,
          req.body.queryResult.parameters.Genero
           );
          
        resp.then(JSON.parse, errHandler)
        .then(function(result) {
             var respuestaConsulta = result;
             console.log(respuestaConsulta);
             console.log(respuestaConsulta.InsertarClienteResult.Resultado);
             if(respuestaConsulta.InsertarClienteResult.Resultado){
               const fullName = respuestaConsulta.InsertarClienteResult.PrimerNombre+" "+
                                  respuestaConsulta.InsertarClienteResult.SegundoNombre+" "+
                                    respuestaConsulta.InsertarClienteResult.PrimerApellido+" "+
                                      respuestaConsulta.InsertarClienteResult.SegundoApellido;
                                      console.log(fullName);
                                      console.log("fullName");
                                      
              return res.json({ 
                "followupEventInput": 
                   {
                     "name":"ClienteCreado", 
                     "parameters":{
                        "fullName": fullName
                     }
                   }
               
                });

             }else{
               return res.json({ 
                "followupEventInput": 
                   {
                     "name":"ClienteNoCreado", 
                     "parameters":{
                        "msgClienteNoCreado": "No te hemos podido registrar en el sistema"
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

