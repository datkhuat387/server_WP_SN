var mongoose = require('mongoose')

mongoose.connect('mongodb+srv://datkhuat387:datkhuat387@cluster0.zyk7rmp.mongodb.net/wp_sn?retryWrites=true&w=majority&appName=Cluster0')
        .catch( (err)=>{
                console.log("Loi ket noi CSDL: ");
                console.log(err);
        });
        // mongodb://127.0.0.1:27017/
        // mongodb://127.0.0.1:27017/wp_sn
module.exports = { mongoose };