const FastSimplexNoise = require('fast-simplex-noise').default


function chance(percent) {
    return Math.random() < percent
}

const OBSTACLES = new Map([
    ['tree', ['tree', 'trees-1', 'trees-2']],
    ['bush', ['bush', 'bushes-1', 'bushes-2']]
])
function randomObstacle(name) {
    let variants = OBSTACLES.get(name)
    if (!variants) throw 'Unknown obstacle "' + name + '"';
    return variants[Math.floor(Math.random() * variants.length)];
}

module.exports = class GameMap {

    constructor() {

        let noiseOpts = {
            frequency: 1,
            octaves: 8,
            min: 0,
            max: 1
        }
        this.geograpySimplex = new FastSimplexNoise(noiseOpts)
        this.moistureSimplex = new FastSimplexNoise(noiseOpts)

        this.tileCache = new Map
    }


    getTileAt(x, y, scale = 100) {
        let tileKey = [x, y, scale]
            , cached = this.tileCache.get(tileKey)
        if (cached) return cached

        let tile = this.genTileAt(x, y, scale)
        this.tileCache.set(tileKey, tile)
        return tile
    }

    genTileAt(x, y, scale) {
        let xOffset = x / scale
            , yOffset = y / scale
            , z = this.geograpySimplex.scaled2D(xOffset, yOffset)
            , h = this.moistureSimplex.scaled2D(xOffset, yOffset)


        let ground = this.classifyGround(z, h)
            , obstacle = this.classifyObstacle(z, h, ground)
            , building = this.classifyBuilding(z, h, ground, obstacle)

        return [[x, y], ground, obstacle, building]
    }

    //noinspection JSMethodCanBeStatic
    classifyGround(z, h) {
        if (z < 0.3)
            return 'deep-water'
        if (z < 0.33)
            return 'water'
        if (z < 0.45)
            return 'sand'
        if (z < 0.8) {
            if (h < 0.2)
                return 'sand'
            if (h < 0.5)
                return 'grass'
            return 'deep-grass'
        }
        return 'gravel'
    }

    //noinspection JSMethodCanBeStatic
    classifyObstacle(z, h, ground) {
        if (ground === 'deep-grass' || ground === 'grass') {
            if (h > 0.8 ) return randomObstacle('tree')
            if (h > 0.7) return randomObstacle('bush')
        }
        return null
    }

    //noinspection JSMethodCanBeStatic
    classifyBuilding(z, h, ground, obstacle) {
        return null
    }
}

function randomBuilding() {
    var buildings = ['castle', 'farm', 'barn', 'camp']
    return buildings[Math.floor(Math.random() * buildings.length)];
}
