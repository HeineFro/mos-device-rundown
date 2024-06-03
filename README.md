# mos-device-rundown
MOS Device - Runddown
Communicates with a NRCS via mosprotocol

This is made with a lot of inspiration from https://github.com/nrkno/sofie-mos-connection

Mos device gets active rundowns and saves them as json, and then publish them on http://host:port/mosactive so they can be downloaded.
The downloaded rundowns are saved by there rundown ID - To download, get ID from the mosactive url, and go for http://host:port/rundowns/(roID).json

The xml from the NRCS is converted to json, and the initial <mos> tags is removed

This device is ment to work with a middelware(https://github.com/HeineFro/mos-casparcg-rundown
)that filters the rundown and extracts graphic elements to by played out on CasparCG
To add graphic elements in the NRCS´s rundowns a plugins is needed, but thats other story

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



