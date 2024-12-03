let mysql = require('mysql')

let connect = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'api_rafael_p2'
})

connect.connect(function(error){
    if(!!error){
        console.log(error)
    }else{
        console.log('Connection Success')
    }
})

module.exports = connect;