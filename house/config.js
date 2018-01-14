const config = {
    port: 8008,
    mongoConf:{
        url: 'mongodb://120.79.69.149:27017/house',
        user:'admin',
        password:'admin',
    },
    // session: {
    //     name: 'SID',
    //     secret: 'SID',
    //     cookie: {
    //         httpOnly: true,
    //         secure:   false,
    //         maxAge:   365 * 24 * 60 * 60 * 1000,
    //     }
    // }
}

module.exports = config