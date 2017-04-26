var svg_xmlns = 'http://www.w3.org/2000/svg',
    xlink_xmlns = 'http://www.w3.org/1999/xlink'

var tileWidth = 100,
    tileHeight = 60

var tileVisibleWidth = 69.28,
    tileVisibleHeight = 40

var obstacleWidth = tileWidth,
    obstacleHeight = 80

var buildingWidth = 160.00000,
    buildingHeight = 140

;(function () {

    function putBuilding (x, y, type) {
        var building = Building(x, y, type)
        buildings.push(building)
        buildingsMap[x + ',' + y] = building
        buildingsMap[x + ',' + (y + 1)] = building
        buildingsMap[(x + 1) + ',' + y] = building
        buildingsMap[(x + 1) + ',' + (y + 1)] = building
    }

    function repaint () {

        tiles.sort(function (a, b) {
            return a.zIndex > b.zIndex ? 1 : -1
        })
        tiles.forEach(function (tile) {
            zoomG.appendChild(tile.element)
        })

        obstacles.concat(buildings).sort(function (a, b) {
            return a.zIndex > b.zIndex ? 1 : -1
        }).forEach(function (obstacle) {
            zoomG.appendChild(obstacle.element)
        })

    }

    function resize () {
        g.setAttribute('transform', 'translate(' + (innerWidth * 0.5) + ', ' + (innerHeight * 0.5) + ')')
    }

    var zoom = 4
    var mapSize = 5

    var buildings = []
    var buildingsMap = Object.create(null)
    putBuilding(-mapSize, -mapSize, 'castle')
    putBuilding(mapSize - 1, mapSize - 1, 'castle')
    putBuilding(2, 2, 'farm')

    var tiles = []
    var obstacles = []
    for (var y = -mapSize; y <= mapSize; y++) {
        for (var x = -mapSize; x <= mapSize; x++) {
            var tile = Tile(x, y, Math.random() < 0.5 ? 'grass' : 'gravel')
            tiles.push(tile)
            if (buildingsMap[x + ',' + y] === undefined) {
                if (Math.random() < 0.1) {
                    obstacles.push(Obstacle(x, y, 'tree'))
                }
            }
        }
    }

    var zoomG = document.createElementNS(svg_xmlns, 'g')

    var g = document.createElementNS(svg_xmlns, 'g')
    g.appendChild(zoomG)

    var svg = document.createElementNS(svg_xmlns, 'svg')
    svg.setAttribute('class', 'Main')
    svg.appendChild(g)

    document.body.appendChild(svg)

    repaint()

    addEventListener('wheel', function (e) {
        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return
        if (e.deltaY > 0) {
            e.preventDefault()
            if (zoom === 1) return
            zoom /= 2
            zoomG.setAttribute('transform', 'scale(' + zoom / 4 + ')')
        } else if (e.deltaY < 0) {
            e.preventDefault()
            if (zoom === 16) return
            zoom *= 2
            zoomG.setAttribute('transform', 'scale(' + zoom / 4 + ')')
        }
    })

    addEventListener('resize', resize)
    resize()

})()
