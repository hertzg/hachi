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

    function putObstacle (x, y, type) {
        var obstacle = Obstacle(x, y, type)
        obstacles.push(obstacle)
        obstaclesMap[x + ',' + y] = obstacle
    }

    function random (array) {
        return array[Math.floor(Math.random() * array.length)]
    }

    function repaint () {

        tiles.sort(function (a, b) {
            return a.zIndex > b.zIndex ? 1 : -1
        })
        tiles.forEach(function (tile) {
            translateG.appendChild(tile.element)
        })

        obstacles.concat(buildings).sort(function (a, b) {
            return a.zIndex > b.zIndex ? 1 : -1
        }).forEach(function (obstacle) {
            translateG.appendChild(obstacle.element)
        })

    }

    function resize () {
        g.setAttribute('transform', 'translate(' + (innerWidth * 0.5) + ', ' + (innerHeight * 0.5) + ')')
    }

    var zoomDivider = 4
    var zoom = zoomDivider
    var mapSize = 8

    var trees = ['tree', 'trees-1', 'trees-2', 'bush', 'bushes-1', 'bushes-2']

    var buildings = []
    var buildingsMap = Object.create(null)
    putBuilding(-mapSize + 1, -mapSize + 1, 'castle')
    putBuilding(mapSize - 2, mapSize - 2, 'castle')
    putBuilding(mapSize - 5, mapSize - 4, 'farm')
    putBuilding(-mapSize + 5, -mapSize + 3, 'farm')
    putBuilding(-5, -1, 'tower')
    putBuilding(4, 1, 'tower')
    putBuilding(3, -5, 'stone')
    putBuilding(-3, 3, 'gold')

    var obstacles = []
    var obstaclesMap = Object.create(null)
    putObstacle(-1, -8, 'wall-vertical')
    putObstacle(-1, -7, 'wall-vertical')
    putObstacle(-1, -6, 'wall-vertical')
    putObstacle(-1, -5, 'wall-vertical')
    putObstacle(-4, -2, 'wall-horizontal')
    putObstacle(-5, -2, 'wall-horizontal')
    putObstacle(-6, -2, 'wall-horizontal')
    putObstacle(-7, -2, 'wall-horizontal')
    putObstacle(-8, -2, 'wall-horizontal')

    var tiles = []
    for (var y = -mapSize; y <= mapSize; y++) {
        for (var x = -mapSize; x <= mapSize; x++) {
            var groundType = Math.random() < 0.7 ? 'grass' : 'gravel'
            var tile = Tile(x, y, groundType)
            tiles.push(tile)
            if (buildingsMap[x + ',' + y] === undefined &&
                obstaclesMap[x + ',' + y] === undefined) {
                if (Math.random() < 0.2 && groundType === 'grass') {
                    obstacles.push(Obstacle(x, y, random(trees)))
                }
            }
        }
    }

    var translateX = 0,
        translateY = 0

    var translateG = document.createElementNS(svg_xmlns, 'g')

    var zoomG = document.createElementNS(svg_xmlns, 'g')
    zoomG.appendChild(translateG)

    var g = document.createElementNS(svg_xmlns, 'g')
    g.appendChild(zoomG)

    var svg = document.createElementNS(svg_xmlns, 'svg')
    svg.setAttribute('class', 'Main')
    svg.appendChild(g)
    svg.addEventListener('mousedown', function (e) {

        function mouseMove (e) {

            var dx = e.clientX - x,
                dy = e.clientY - y

            translateX += dx / (zoom / zoomDivider)
            translateY += dy / (zoom / zoomDivider)
            translateG.setAttribute('transform', 'translate(' + translateX + ', ' + translateY + ')')
            x = e.clientX
            y = e.clientY

            e.preventDefault()

        }

        function mouseUp () {
            removeEventListener('mousemove', mouseMove)
            removeEventListener('mouseup', mouseUp)
        }

        var x = e.clientX,
            y = e.clientY

        e.preventDefault()
        addEventListener('mousemove', mouseMove)
        addEventListener('mouseup', mouseUp)

    })

    document.body.appendChild(svg)

    repaint()

    addEventListener('wheel', function (e) {
        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return
        if (e.deltaY > 0) {
            e.preventDefault()
            if (zoom === 1) return
            zoom /= 2
            zoomG.setAttribute('transform', 'scale(' + zoom / zoomDivider + ')')
        } else if (e.deltaY < 0) {
            e.preventDefault()
            if (zoom === 16) return
            zoom *= 2
            zoomG.setAttribute('transform', 'scale(' + zoom / zoomDivider + ')')
        }
    })

    addEventListener('resize', resize)
    resize()

})()
