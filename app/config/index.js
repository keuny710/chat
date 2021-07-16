const init = function() {
    return {
        db: {
            
        },
        sessionSecret: process.env.sessionSecret,
    }
}

module.exports = init();