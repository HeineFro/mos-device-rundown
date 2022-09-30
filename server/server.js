const config = require("../config.json");
const express = require('express');

module.exports.app = app = require('express')();
const cors = require('cors');
const log = require('./log'); //loader log der har alt til 
const xmlParser = require("xml2json");
//events emitter mellem moduler
const interCom = require('./interCom');
const mostalk = require('./mosMessages');
const xml = require('./xmlparser');
const active = require('./activeMos');
const fs = require('fs');
const net = require("net"); // import net
let iconv = require('iconv-lite');


app.use(cors()); //tillader cross-origin etc.
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json()); //.json())
//starter server op - plugin
var server = app.listen(config.host.portPublic, config.host.ip, function () {
    var host = server.address().address
    var port = server.address().port
    __logger.info("MOS Device running", host, port);
})

app.use(express.static('public')); //public er rod folderen for GUI

app.get('/', function (req, res) {
    res.send('http://' + config.host.ip + ':' + config.host.portPublic + '/mosactive');
})

let respons = false;
afterCutOff = null;

console.log("main system ok")
test = () => {
    console.log('test')
    if(!octopusLower.readable){
        octopusLower = net.connect(config.nrcs.lower, () => {
            __logger.info("client connected Octopus lower");
            clearInterval(afterCutOff)
            // octopusLower.write(mostalk.heartbeat);
        });

    } else {
        __logger.info('octoLower')
    }

    if(!octopusUpper.readable){
        octopusUpper = net.connect(config.nrcs.upper, () => {
            __logger.info("client connected Octopus upper");
            // octopusUpper.write(mostalk.heartbeat);
        
        });

    } else {
        __logger.info('octoUpper')
    }
}



let octopusLower = net.connect(config.nrcs.lower, () => {
    __logger.info("client connected Octopus lower");

    // octopusLower.write(mostalk.heartbeat);
});

let octopusUpper = net.connect(config.nrcs.upper, () => {
    __logger.info("client connected Octopus upper");
    // octopusUpper.write(mostalk.heartbeat);

});

octopusLower.on('data', data => {
    //console.log(data);
    console.log("besked fra octopus lower på client");
    console.log(data.toString());

})

octopusUpper.on('data', data => {
    //console.log(data);
    console.log("besked fra octopus upper på client");
    console.log(data.toString());
})



octopusUpper.on('close', function () {
    console.log('client on upper closed');
});

octopusUpper.on('error', function (err) {
    console.error('Connection Octopus Upper client error: ' + err);
    console.error(new Error().stack);
    
});

octopusLower.on('close', function () {
    console.log('client on Lower closed');
});

octopusLower.on('error', function (err) {
    console.error('Connection Octopus Lower client error: ' + err);
    console.error(new Error().stack);
    afterCutOff = setInterval(test, 5000)
});





let xmlStore;

heart = () => {

    octopusLower.write(mostalk.heartbeat);
    octopusUpper.write(mostalk.heartbeat);

    respons = false;
}
heart()
setInterval(heart, config.setup.heartbeatinterval);

let serverMosLower = net.createServer(connectionMosLower => {
    setInterval(function () {
        //respons = xml.respons
        //console.log(respons)
        
    
            connectionMosLower.write(mostalk.heartbeat);
            console.log('heartbeat lower respons - mosdevice server');
        
      
    }, 10000);
    console.log("Incoming mosdevice Lower");
    connectionMosLower.on("data", data => {
        xmlStore = data.toString();
        console.log('modtaget mosdevice lower: ' + xmlStore);
    });

    connectionMosLower.on("close", data => {

        __logger.info("Octopus Lower closed connection on mosdevice");
        //reconnect upper
    });

    connectionMosLower.on('error', function (err) {
            
        __logger.error('mosdevice lower error: ' + err );
        post += date + '<br>' + err + '<br>'
        //__logger.error(new Error().stack);
    });



});




let serverMosUpper = net.createServer(connectionMosUpper => {
 

    setInterval(function () {
        //respons = xml.respons
        //console.log(respons)
        
        if (!respons) {
            connectionMosUpper.write(mostalk.heartbeat);
            console.log('heartbeat respons upper - mosdevice server');
            respons = true;
        }
    }, 10000);
    // run all of this when a client connects
    //console.log("octopus upper connected");

    interCom.on('roReplace', (message) => {

        connectionMosUpper.write(mostalk.roReq(message));
        console.log('Rundown req ' + roID[0])

    });

    connectionMosUpper.on("data", data => {
        //console.log(data.toString());
   
        console.log("data fra octopus til mosdevice upper")
        sendAck = () => {
            console.log('ack sendt')
            connectionMosUpper.write(mostalk.ack);
        }

        const messageString = iconv.decode(data, 'utf16-be').trim()
        const firstMatch = '<mos>'
        const first = messageString.substr(0, firstMatch.length)
        const lastMatch = '</mos>'
        const last = messageString.substr(-lastMatch.length)

        if (first === firstMatch && last === lastMatch) {
            console.log("complete")
            xml.parseMessage(messageString);


        } else if (last === lastMatch) {
            console.log("last part")
            newt = connectionMosUpper.chunks + messageString
            xml.parseMessage(newt);

        } else if (first === firstMatch) {
            console.log("part 1 waiting")
            connectionMosUpper.chunks = messageString

        } else {
            console.log("part 2")

            connectionMosUpper.chunks += messageString
        };
    });

    connectionMosUpper.on("close", data => {

        __logger.info("Octopus Upper Closed connection");
        //reconnect upper
    });


    connectionMosUpper.on('error', function (err) {
        let date = new Date()
        __logger.error('Socket error: ' + err );
        post += date + '<br>' + err + '<br>'
       
        __logger.error(new Error().stack);
    });





});

serverMosUpper.listen(config.host.upperPort, config.host.ip, () => {
    __logger.info("waiting for a connection on upper");
});

serverMosLower.listen(config.host.lowerPort, config.host.ip, () => {
    __logger.info("waiting for a connection on lower");
});

let post;

process.on('uncaughtException', function (err) {
let date = new Date()
    __logger.error("uncaught exception" + err)
    post += date + '<br>' + err + '<br>'
    // console.log(err);


});

app.get('/error', function (req, res) {

    res.send(post);

});
app.post('/test', function (req, res) {
    console.log("test request")
    console.log(req.body.system)
    if (req.body.restart) {
        console.log("yes")
    }


    // res.send(res.body)
})

