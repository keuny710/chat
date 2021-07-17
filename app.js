'use strict'

const express = require('express');
const app = express();
const path = require('path');
const flash = require('connect-flash');

const routes = require('./app/routes');
const session = require('./app/sessions');
const passport = require('./app/auth');
const ioServer = require('./app/socket');
const logger = require('./app/logger');

require('dotenv').config();
const { PORT} = process.env;
//view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});
connect();



//middlewares setup
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
// app.use(session({
//     resave: false,
//     saveUninitialized: false,
//     secret: process.env.COOKIE_SECRET,
//     cookie: {
//         httpOnly: true,
//         secure: false,
//     },
// }));
app.use(session);
app.use(passport(initialize()));
app.use(passport.session());
app.use(flash());


app.use('/', routes);

app.use((req, res, next)=>{
    res.status(404).sendFile(process.cwd()+'/app/views/404.html');
});


ioServer.listen(port);
