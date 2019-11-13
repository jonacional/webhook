const requestWs = require("request");


exports.ConsultarCliente =   function(documento){

    return new Promise(function(resolve, reject) {
   
requestWs.post({
    "headers": { "content-type": "application/json" },
    "url": "http://apps.outsourcing.com.co:8109/WsCallBotOS.svc/ConsultarCliente",
    "body": JSON.stringify({
        "NroDocumento": documento 
    })
}, (error, response, body) => {


    if(error) {
        reject(error);
    }else{
       
        resolve(body);
    }
})
    
}); 
 
}

exports.InsertarSolicitud =   function(documento,Tipo,Motivo,Detalle){

    return new Promise(function(resolve, reject) {
   
requestWs.post({
    "headers": { "content-type": "application/json" },
    "url": "http://apps.outsourcing.com.co:8109/WsCallBotOS.svc/InsertarSolicitud",
    "body": JSON.stringify({
        "ClienteCampanaId": documento,
        "Tipo": Tipo,
        "Motivo": Motivo,
        "Detalle": Detalle
    })
}, (error, response, body) => {


    if(error) {
        reject(error);
    }else{
       
        resolve(body);
    }
})
    
}); 
 
}


exports.InsertarCliente =   function(CamapanaId,NroDocumento,PrimerNombre,SegundoNombre,PrimerApellido,SegundoApellido,Celular,Correo,Direccion,Genero){

    return new Promise(function(resolve, reject) {
   
requestWs.post({
    "headers": { "content-type": "application/json" },
    "url": "http://apps.outsourcing.com.co:8109/WsCallBotOS.svc/InsertarCliente",
    "body": JSON.stringify({
        "CamapanaId": CamapanaId ,
        "NroDocumento": NroDocumento ,
        "PrimerNombre": PrimerNombre ,
        "SegundoNombre": SegundoNombre ,
        "PrimerApellido": PrimerApellido ,
        "SegundoApellido": SegundoApellido ,
        "Celular": Celular ,
        "Correo": Correo ,
        "Direccion": Direccion ,
        "Genero": Genero 

    })
}, (error, response, body) => {


    if(error) {
        reject(error);
    }else{
         
        resolve(body);
    }
})
    
}); 
 
}