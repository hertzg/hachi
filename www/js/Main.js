var svg_xmlns = 'http://www.w3.org/2000/svg',
    xlink_xmlns = 'http://www.w3.org/1999/xlink'

var tileWidth = 100,
    tileHeight = 60

var tileVisibleWidth = 69.28,
    tileVisibleHeight = 40

var obstacleWidth = tileWidth,
    obstacleHeight = 80

var obstaclePaddingX = 2 * obstacleWidth

var buildingWidth = 160,
    buildingHeight = 140

;(function () {

    function cleanAll () {

        if (cleanTimeout !== 0) {
            cleanScheduled = true
            return
        }

        cleanTimeout = setTimeout(function () {
            cleanBuildings()
            cleanObstacles()
            cleanTiles()
            cleanTimeout = 0
            if (!cleanScheduled) return
            cleanScheduled = false
            cleanAll()
        }, 50)
        return

    }

    function cleanBuildings () {
        for (var i = 0; i < buildings.length; i++) {

            var building = buildings[i]

            var x = building.screenX + translateX,
                y = building.screenY + translateY

            if (x * zoom < -innerWidth * 0.5 - buildingWidth * zoom ||
                x * zoom > innerWidth * 0.5 + buildingWidth * zoom ||
                y * zoom < -innerHeight * 0.5 - buildingHeight * zoom ||
                y * zoom > innerHeight * 0.5 + buildingHeight * zoom) {

                building.element.setAttribute('visibility', 'hidden')

            } else {
                building.element.setAttribute('visibility', 'visible')
            }

        }
    }

    function cleanObstacles () {
        for (var i = 0; i < obstacles.length; i++) {

            var obstacle = obstacles[i]

            var x = obstacle.screenX + translateX,
                y = obstacle.screenY + translateY

            if (x * zoom < -innerWidth * 0.5 - obstacleWidth * zoom ||
                x * zoom > innerWidth * 0.5 + obstacleWidth * zoom ||
                y * zoom < -innerHeight * 0.5 - obstacleHeight * zoom ||
                y * zoom > innerHeight * 0.5 + obstacleHeight * zoom) {

                obstacle.element.setAttribute('visibility', 'hidden')

            } else {
                obstacle.element.setAttribute('visibility', 'visible')
            }

        }
    }

    function cleanTiles () {
        for (var i = 0; i < tiles.length; i++) {

            var tile = tiles[i]

            var x = tile.screenX + translateX,
                y = tile.screenY + translateY

            if (x * zoom < -innerWidth * 0.5 - tileWidth * zoom ||
                x * zoom > innerWidth * 0.5 + tileWidth * zoom ||
                y * zoom < -innerHeight * 0.5 - tileHeight * zoom ||
                y * zoom > innerHeight * 0.5 + tileHeight * zoom) {

                tile.element.setAttribute('visibility', 'hidden')

            } else {
                tile.element.setAttribute('visibility', 'visible')
            }

        }
    }

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
        cleanAll()
        g.setAttribute('transform', 'translate(' + (innerWidth * 0.5) + ', ' + (innerHeight * 0.5) + ')')
    }

    var zoom = 1
    var mapSize = 8

    var trees = ['tree', 'trees-1', 'trees-2', 'bush', 'bushes-1', 'bushes-2']

    var buildings = []
    var buildingsMap = Object.create(null)
    putBuilding(-mapSize + 1, -mapSize + 1, 'castle')
    putBuilding(mapSize - 2, mapSize - 2, 'castle')
    putBuilding(mapSize - 5, mapSize - 2, 'farm')
    putBuilding(-mapSize + 5, -mapSize, 'farm')
    putBuilding(-mapSize + 5, -mapSize + 2, 'farm')
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
    putObstacle(2, 8, 'wall-vertical')
    putObstacle(2, 7, 'wall-vertical')
    putObstacle(2, 6, 'wall-vertical')
    putObstacle(2, 5, 'wall-vertical')
    putObstacle(2, 4, 'wall-vertical')
    putObstacle(2, 3, 'wall-top-right')
    putObstacle(3, 3, 'wall-horizontal')
    putObstacle(5, 3, 'wall-horizontal')
    putObstacle(6, 3, 'wall-horizontal')
    putObstacle(7, 3, 'wall-horizontal')
    putObstacle(8, 3, 'wall-horizontal')

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

    var cleanTimeout = 0,
        cleanScheduled = false

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

            translateX += dx / zoom
            translateY += dy / zoom
            x = e.clientX
            y = e.clientY
            translateG.setAttribute('transform', 'translate(' + translateX + ', ' + translateY + ')')
            cleanAll()

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
    cleanAll()

    addEventListener('wheel', function (e) {
        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return
        if (e.deltaY > 0) {
            e.preventDefault()
            zoom = Math.max(zoom * 0.5, 0.25)
            zoomG.setAttribute('transform', 'scale(' + zoom + ')')
            cleanAll()
        } else if (e.deltaY < 0) {
            e.preventDefault()
            zoom = Math.min(zoom * 2, 4)
            zoomG.setAttribute('transform', 'scale(' + zoom + ')')
            cleanAll()
        }
    })

    addEventListener('resize', resize)
    resize()

})()
