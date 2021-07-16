const session = require('express-session');
const FileStore = require('session-file-store')(session);
const db = require('../database');
const config = require('../config');

const fileStoreOptions = {};


const init = function() {
    if(process.env.NODE_ENV === 'production') {
        return session({
            resave: false,
            saveUninitialized: false,
            unset: 'destroy',
            store: new FileStore(fileStoreOptions),
            secret: config.sessionSecret,
        });
    } else {
        return session({
			secret: config.sessionSecret,
			resave: false,
			unset: 'destroy',
			saveUninitialized: true
		});
    }
}

module.exports = init();
