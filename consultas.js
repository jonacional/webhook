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