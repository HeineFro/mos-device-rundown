const xmlParser = require("xml2json");
const fs = require('fs');
const log = require('./log');
const interCom = require('./interCom');

var public = './public';
var roMesaages = './roMessage';
var publicRundowns = './public/rundowns';

if (!fs.existsSync(roMesaages)){
    fs.mkdirSync(roMesaages);
}

if (!fs.existsSync(public)){
    fs.mkdirSync(public);
}

if (!fs.existsSync(publicRundowns)){
    fs.mkdirSync(publicRundowns);
}

findAllByKey = (obj, keyToFind, err) => {
    try {
        return Object.entries(obj)
            .reduce((acc, [key, value]) => (key === keyToFind) ?
                acc.concat(value) :
                (typeof value === 'object') ?
                acc.concat(findAllByKey(value, keyToFind)) :
                acc, [])
    } catch {
        __logger.error(err);
    }
}


module.exports.parseMessage = (string) => {
    try { parsedString = xmlParser.toJson(string, {
        reversible: false,
        object: true,
        sanitize: true,
        trim: true
    })
    storyLine = parsedString.mos
    

    roID = findAllByKey(storyLine, 'roID');
    if(roID === null){
        console.log("no roID")
    } else{
        console.log(roID);
    }
    

    let rundownConvert = JSON.stringify(storyLine);

    if (storyLine.hasOwnProperty('roCreate') || storyLine.hasOwnProperty('roReplace')) {
 
        fs.writeFile('./public/rundowns/'+ roID[0] + '.json', rundownConvert, function (err, data) {
            if (err) {
                __logger.error(err);
               
            }
            console.log('complete')
        })
        sendAck();

        
    } if (storyLine.hasOwnProperty('roList')) {
   
        fs.writeFile('./public/rundowns/'+ roID[0] + '.json', rundownConvert, function (err, data) {
            if (err) {
                __logger.error(err);
               
            }
            console.log('complete')
        })
        sendAck();

        
    } if (storyLine.hasOwnProperty('roReadyToAir')){
      
        fs.writeFile('./roMessage/fromOctopus_' + roID[0] + '.json', rundownConvert, function (err, data) {
            if (err) {
                __logger.error(err);
               
            }
            console.log('complete')
            sendAck();
        })
    }
      if (storyLine.hasOwnProperty('roStoryReplace') || storyLine.hasOwnProperty('roStoryMove') || storyLine.hasOwnProperty('roStoryDelete')) {

            interCom.emit("roReplace", roID[0]);
                      
        } 
        if (storyLine.hasOwnProperty('roStoryInsert')) {

            interCom.emit("roReplace", roID[0]);
                
        } 

        if (storyLine.hasOwnProperty('heartbeat')) {
                 module.exports.respons = false;
                fs.writeFile('./roMessage/fromOctopus_last_hearbeat.json', rundownConvert, function (err, data) {
                    if (err) {
                        __logger.error(err);
                       
                    }
              
                sendAck();
            })
            
        }

    
    

    if (storyLine.hasOwnProperty('roDelete')) {
        sendAck();
        fs.unlink('./public/rundowns/' + roID[0] + '.json', (err) => {
            if (err) {
                __logger.error(err);
                console.log("kan ikke slette " + err);
            } else {
                console.log('slettet ' + roID[0]);                                
            }
    });
          
    }
} catch (err) {
    if (storyLine.hasOwnProperty('roStoryReplace')) {

        interCom.emit("roReplace", roID[0]);
       
        
    }   
    if (err) {
        __logger.error(err);
       
    }
}
};
