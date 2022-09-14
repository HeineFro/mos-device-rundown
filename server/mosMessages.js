let iconv = require('iconv-lite');

encode = (data) => {
    return iconv.encode(data, 'utf-16be');
}

autoBuffer = (mosMessage) => {

    return Buffer.from(encode(mosMessage), 'ucs-2');

}

let heartbeat = '<mos><mosID>CasparCG</mosID><ncsID>Octopus</ncsID><heartbeat><time></time></heartbeat></mos>';
let rawAck = '<mos><mosID>CasparCG</mosID><ncsID>Octopus</ncsID><roAck>ACK</roAck></mos>';

module.exports.roReq = (rundown) => { 
    let rawRoReq = '<mos><mosID>CasparCG</mosID><ncsID>Octopus</ncsID><roReq><roID>' + rundown + '</roID></roReq></mos>';
    return autoBuffer(rawRoReq);

}

module.exports.ack = autoBuffer(rawAck);
module.exports.heartbeat = autoBuffer(heartbeat);


