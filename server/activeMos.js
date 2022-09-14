const fs = require("fs");
const app = require('./server');

let actives = {};
getActive = () => {
    actives = {};
    fs.readdir("./public/rundowns", function (err, files) {
        if(err){ 
            __logger.info("kunne ikke læse rundowns")
            return console.log("kunne ikke læse rundowns")
            
        };
        let counter = 0;

        files.forEach(function (file) {
            let rundown = "active" + counter;
            actives[rundown] = file;
            counter++
           
    
        })
    
    
    });
    




}

setInterval(getActive, 5000);
app.app.get('/mosactive', function (req, res) {

        res.send(JSON.stringify(actives));

});


