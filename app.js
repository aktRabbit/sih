

const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const logger 	   = require('morgan');
const port 	   = process.env.PORT || 3000;
const router               = require('./routes/routes');
const py               = require('./routes/playground');
app.use(bodyParser.json());
app.use(logger('dev'));


app.use('/', router);
//app.use('/',py);

app.listen(port);

console.log(`App Runs on ${port}`);
