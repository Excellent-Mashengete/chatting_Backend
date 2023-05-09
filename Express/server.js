const express = require('express'); 
const app = express();
const cors = require('cors');
const bodyparser = require("body-parser");
const corsOptions = require('./App/Configs/corsOptions');
const credentials = require('./App/Middlewares/credentials');
require('dotenv').config();
const port = process.env.PORT || 8080;

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());
// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());


const db = require('./App/Models/');

db.sequelize.authenticate({force: false }) //once your server is running change sync to authenticted and true to false
   .then(() => {
      console.log("Database is connected");
   }).catch((err) => {
      console.log("Failed to connect to DB: ", err);
   })

const auth = require('./App/Routes/auth');
const send = require('./App/Routes/sendmess');
const getmess  = require('./App/Routes/getmess');

app.get('/', (req, res) =>{
    res.status(200).send('Sever Initialized and Online. Ready to take OFF!');
});

app.use('/api', auth);
app.use('/api', send);
app.use('/api', getmess);


app.listen(port, () =>{
   console.log(`Server is running on port ${port}.`) 
})

