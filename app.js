'use strict'

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const routes = require('./app/routes');


require('dotenv').config();
const { PORT, MONGO_URI } = process.env;
const mongoose = require('mongoose');
const passport = require('passport');
const { initialize } = require('passport');
//view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');

//middlewares setup
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(session);
app.use(passport(initialize()));
app.use(passport.session());
app.use(flash());