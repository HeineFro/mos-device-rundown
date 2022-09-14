# mos-device-rundown
MOS Device - Runddown
Communicates with a NRCS via mosprotocol
I could not have made this without a lot of inspiration from nrkno/sofie-mos-connection


Mos device gets active rundowns and saves them as json, and then publish them on http://host:port/mosactive so they can be downloaded.
The downloaded rundowns are saved by there rundown ID - To download, get ID from the mosactive url, and go for http://host:port/rundowns/<id>.json

oh by the way, the xml from the NRCS is converted to json

This device is ment to work with a middelware(cg-com-rundown)that filters the rundown and extracts graphic elements to by played out on CasparCG
To add graphic elements in the NRCS´s rundowns a plugins needs to run inside, but thats other story

This is only tested with Octopus.

install modules
>> npm install

setup config
>> edit config.json

{
"setup": {
	"heartbeatinterval": 30000 
},
    "host":{
        "ip" : "<0.0.0.0>",   //ip on machine running the mos device
        "portPublic" : <0000>,	//port to publish rundowns
        "lowerPort" : 12345,	//lower port, edit in NRCS
        "upperPort" : 54321	//upper port, edit in NRCS
    },

"nrcs":{
    "lower" : {
        "port": 10540,	//lower port - match port on NRCS system
        "host": "<0.0.0.0>"	//ip NCRS
    },
    "upper":{
        "port": 10541,	//upper port,  match port on NRCS system
        "host": "<0.0.0.0>" /ip NRCS
    }
}     
}

start
>>npm start



