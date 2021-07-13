const Mongoose = require('mongoose');
const dotenv = require('dotenv');


const {MONGO_ID, MONGO_PASSWORD, MONGO_DB, NODE_ENV} = process.env;
const mongo_url = `mongodb://${MONGO_ID}:${MONGO_PASSWORD}@localhost:27017/${MONGO_DB}`;

// const connect = ()=>{
//     if (NODE_ENV !== 'production') {
//         Mongoose.set('debug', true);
//     }
//     Mongoose.connect(mongo_url,{
//         useNewUrlParser: true,
//         useCreateIndex: true,

//     }, (err, db)=>{
//         if (err) {
//             console.log('몽고DB 연결 실패', err);
//             console.log('DB 정보', db);
//         } else {
//             console.log('몽고DB 연결 성공');
//             console.log('DB 정보', db);
//         }
//     });
// };


Mongoose.connect(mongo_url, {useNewUrlParser:true}, (err, db)=>{
    if (err) {
        console.log('몽고DB 연결 실패', err);
        console.log('DB 정보', db);
    } else {
        console.log('몽고DB 연결 성공');
        console.log('DB 정보', db);
    }
});

Mongoose.connection.on('error', (err)=>{
    console('몽고 DB 에러발생', err);
});

Mongoose.connection.on('disconnected', ()=>{
    console.error('몽고디비 disconnected. 연결이 끊겼습니다. 연결을 재시도합니다.');
    connect();
});

module.exports = {Mongoose,
    models: {
        user: require('./schemas/user.js'),
        room: require('./schemas/room.js')
    }
};