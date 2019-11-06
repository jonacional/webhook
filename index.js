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

     
      if(req.body.queryResult.parameters.OpcionWs=="ConsultarCliente"){

        var ArrayDoc=req.body.queryResult.parameters.Documento;
        var docString=ArrayDoc.join(''); 

        console.log("ConsultarCliente "+docString)

        var resp= consultas.ConsultarCliente(docString);
        
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
      }else if(req.body.queryResult.parameters.OpcionWs=="InsertarCliente"){
        
       
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
         
      }else   if(req.body.queryResult.parameters.OpcionWs=="ComparaDocs"){

        var ArrayDocNew=req.body.queryResult.parameters.NewDocumento;
        var newDocString=ArrayDocNew.join(''); 

        var ArrayDocOld=req.body.queryResult.parameters.Documento;
        var oldDocString=ArrayDocOld.join(''); 

        console.log("ComparaDocs -  newDocString:"+newDocString+" / oldDocString:"+oldDocString);

        if(newDocString==oldDocString){
          return res.json({ 
            "followupEventInput": 
               {
                 "name":"pedirdatoscliente", 
                 "parameters":{
                    "msgPedirDatos": "Ingresa tu primer Nombre."
                 }
               }
           
            });

        }else{
          
          return res.json({  
            "followupEventInput": 
               {
                 "name":"DocumentoInvalido", 
                 "parameters":{
                    "msgPedirDatos": "Documento no coincide con el consultado previamente, Ingresalo de nuevo o comience de nuevo escribiendo Menú o dando Click en el botón de menú"
                 }
               }
           
            });
        }

      }




      //Fin del Opciones



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

