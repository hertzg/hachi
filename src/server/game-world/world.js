const GameMap = require('./map')


const CONST_SCALE = 100;

module.exports = class GameWorld {

    constructor() {
        this.map = new GameMap
    }

    getTilesAt(poses) {
        return poses.map(
            (pos) => this.map.getTileAt(pos[0], pos[1], CONST_SCALE)
        )
    }
}