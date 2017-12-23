// import HomePage from '../../../house_web/build/index.html'

let fs = require('fs')

class Home{

    async getHomePage(ctx){

        let HomePage = fs.readFileSync('../house_web/build/index.html', 'utf8')
        ctx.body = HomePage
    }

}

export default new Home()