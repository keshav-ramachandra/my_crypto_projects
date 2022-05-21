const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
var session = require('express-session')
const db = require('./db')

const app = express()
const apiPort = 5000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

db.on('error', console.error.bind(console, 'MongoDB connection error:'))
app.get('/', (req, res) => {
    res.send('Hello !!')
})


app.post('/tokens/insert' , function (request, response) {

    let obj = {
        name: request.body.name,
        symbol: request.body.symbol,
        description: request.body.description,
    };



   // insert only if object does not exist
   if(obj.name != null){
        db.collection('Tokens').updateOne(
                obj,
                { $setOnInsert: obj },
                { upsert: true }
        )
   }

});

app.get('/tokens' , function (request, response){

    db.collection('Tokens').find({}).toArray(function(error, result){
       if(error) throw error;
          return response.json(result);
    })
});


app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))
