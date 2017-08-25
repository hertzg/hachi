const FastSimplexNoise = require('fast-simplex-noise').default
const noiseGen = new FastSimplexNoise({frequency: 1, max: 1, min: 0, octaves: 8})

let [executor, srcName, w, h, scale] = process.argv;
if (!w || !h) {
    console.log('Usage', executor, srcName, 'width', 'height', 'scale')
    process.exit(1)
}


let heightMap = Object.create(null)
for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
        let xScaled = x / scale
            , yScaled = y / scale
            , hScaled = noiseGen.scaled2D(xScaled, yScaled)
            , ground = heightToGround(hScaled)

        heightMap[x + ',' + y] = [ground, heightGroundToObstacle(ground), heightGroundToBuilding(ground)]
    }
}

function heightToGround(h) {
    if (h < 0.3)
        return 'deep-water'
    if (h < 0.4)
        return 'water'
    if (h < 0.5)
        return 'sand'
    if (h < 0.7)
        return 'grass'
    if (h < 0.8)
        return 'deep-grass'
    return 'gravel'
}

function heightGroundToObstacle(g) {
    if (g === 'deep-grass')
        if (Math.random() < 0.5) return randomTree()
    if (g === 'grass')
        if (Math.random() < 0.1) return randomBush()
    return null
}

function heightGroundToBuilding(g) {
    if (g === 'gravel')
        if (Math.random() < 0.5) return randomOre()
    if( g === 'grass' || g === 'deep-grass')
        if (Math.random() < 0.001) return randomBuilding()
    return null
}

function randomBush() {
    var BUSHES = ['bush', 'bushes-1', 'bushes-2']
    return BUSHES[Math.floor(Math.random() * BUSHES.length)];
}

function randomTree() {
    var trees = ['tree', 'trees-1', 'trees-2']
    return trees[Math.floor(Math.random() * trees.length)];
}

function randomOre() {
    var ores = ['gold', 'stone']
    return ores[Math.floor(Math.random() * ores.length)];
}

function randomBuilding() {
    var buildings = ['castle', 'farm', 'barn', 'camp']
    return buildings[Math.floor(Math.random() * buildings.length)];
}

console.log('%j', heightMap)