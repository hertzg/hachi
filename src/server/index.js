const Express = require('express')
    , BodyParser = require('body-parser')
    , GameWorld = require('./game-world')


var game = new GameWorld()

var app = Express()

app.use(Express.static('public'))
app.use(BodyParser.json())

app.get('/api/v1/init', (req, res) => {
    res.json({
        since: 0,
        map: {
            id: 1,
            width: 1000,
            height: 1000,
        }
    })
})

app.post('/api/v1/fetch', (req, res) => {
    let tiles = game.getTilesAt(req.body)
    res.json(tiles)
})

app.get('/api/v1/refresh', (req, res) => {
    res.json({
        since: 0,
        changes: []
    })
})

var srv = app.listen(8080, ()=> {
    console.log('Listening @ %j', srv.address())
})