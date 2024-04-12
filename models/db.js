var mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/wp_sn')
        .catch( (err)=>{
                console.log("Loi ket noi CSDL: ");
                console.log(err);
        });
        // mongodb://127.0.0.1:27017/
module.exports = { mongoose };