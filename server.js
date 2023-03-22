const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');

const PORT = process.env.PORT || 3500

app.use(logger)
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false}));
app.use(express.json());
app.use(cookieParser())
app.use('/', express.static(path.join(__dirname, '/public')));

app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));

app.use('/login', require('./routes/login'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));






app.use('/notes', require('./routes/api/notes'));



//404 PAGE
app.all('*', (req,res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
})



app.use(errorHandler);



app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})





