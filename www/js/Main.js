function axoCoordsToRectCoords (axoCoords) {

    var x = axoCoords[0],
        y = axoCoords[1]

    return [x + y, y - x]

}

function rectCoordsToAxoCoords (rectCoords) {
    var rx = rectCoords[0]
    var ay = (rx + rectCoords[1]) / 2
    return [rx - ay, ay]
}

function rectCoordsToScreenCoords (rectCoords) {
    return [
        rectCoords[0] * tileVisibleWidth * 0.5,
        rectCoords[1] * tileVisibleHeight * 0.5,
    ]
}

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

    function axoCoordsAt (clientX, clientY) {

        var x = ((clientX - innerWidth * 0.5) / zoom - translateX) / tileVisibleWidth,
            y = ((clientY - innerHeight * 0.5) / zoom - translateY) / tileVisibleHeight

        var axoX = Math.round(x - y),
            axoY = Math.round(x + y)

        return [axoX, axoY]

    }

    function cleanAll () {

        if (cleanTimeout !== 0) {
            cleanScheduled = true
            return
        }

        cleanTimeout = setTimeout(function () {

            cleanBuildings()
            cleanObstacles()
            cleanTiles()
            loadEmpty()

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

            var x = building.screenCoords[0] + translateX,
                y = building.screenCoords[1] + translateY

            if (x * zoom < -innerWidth * 0.5 - buildingWidth * zoom ||
                x * zoom > innerWidth * 0.5 + buildingWidth * zoom ||
                y * zoom < -innerHeight * 0.5 - buildingHeight * zoom ||
                y * zoom > innerHeight * 0.5 + buildingHeight * zoom) {

                translateG.removeChild(building.shadowElement)
                delete buildingsMap[building.axoCoords[0] + ',' + building.axoCoords[1]]
                buildings.splice(i, 1)
                i--

            }

        }
    }

    function cleanObstacles () {
        for (var i = 0; i < obstacles.length; i++) {

            var obstacle = obstacles[i]

            var x = obstacle.screenCoords[0] + translateX,
                y = obstacle.screenCoords[1] + translateY

            if (x * zoom < -innerWidth * 0.5 - obstacleWidth * zoom ||
                x * zoom > innerWidth * 0.5 + obstacleWidth * zoom ||
                y * zoom < -innerHeight * 0.5 - obstacleHeight * zoom ||
                y * zoom > innerHeight * 0.5 + obstacleHeight * zoom) {

                translateG.removeChild(obstacle.objectElement)
                translateG.removeChild(obstacle.shadowElement)
                delete obstaclesMap[obstacle.axoCoords[0] + ',' + obstacle.axoCoords[1]]
                obstacles.splice(i, 1)
                i--

            }

        }
    }

    function cleanTiles () {
        for (var i = 0; i < tiles.length; i++) {

            var tile = tiles[i]

            var x = tile.screenCoords[0] + translateX,
                y = tile.screenCoords[1] + translateY

            if (x * zoom < -innerWidth * 0.5 - tileWidth * zoom ||
                x * zoom > innerWidth * 0.5 + tileWidth * zoom ||
                y * zoom < -innerHeight * 0.5 - tileHeight * zoom ||
                y * zoom > innerHeight * 0.5 + tileHeight * zoom) {

                translateG.removeChild(tile.element)
                delete tilesRectMap[tile.rectCoords[0] + ',' + tile.rectCoords[1]]
                tiles.splice(i, 1)
                i--

            }

        }
    }

    function loadEmpty () {

        function checkRow (x0, x1, y) {
            for (var x = x0; x <= x1; x += 2) {
                if (tilesRectMap[x + ',' + y] !== undefined) continue
                var axoCoords = rectCoordsToAxoCoords([x, y])
                if (Math.abs(axoCoords[0]) > mapSize ||
                    Math.abs(axoCoords[1]) > mapSize) continue
                emptyPoints.push(axoCoords)
            }
        }

        var topLeftCoords = axoCoordsToRectCoords(axoCoordsAt(-tileVisibleWidth * zoom, -tileVisibleHeight * zoom)),
            bottomRightCoords = axoCoordsToRectCoords(axoCoordsAt(innerWidth + tileVisibleWidth * zoom, innerHeight + tileVisibleHeight * zoom))

        var emptyPoints = []
        for (var y = topLeftCoords[1]; y <= bottomRightCoords[1]; y += 2) {
            checkRow(topLeftCoords[0], bottomRightCoords[0], y)
            checkRow(topLeftCoords[0] + 1, bottomRightCoords[0], y + 1)
        }

        emptyPoints.forEach(function (point) {
            putTile(point, 'grass')
        })
        repaint()

    }

    function putBuilding (x, y, type) {
        var building = Building([x, y], type)
        buildings.push(building)
        buildingsMap[x + ',' + y] = building
        buildingsMap[x + ',' + (y + 1)] = building
        buildingsMap[(x + 1) + ',' + y] = building
        buildingsMap[(x + 1) + ',' + (y + 1)] = building
    }

    function putObstacle (axoCoords, type) {
        var obstacle = Obstacle(axoCoords, type)
        obstacles.push(obstacle)
        obstaclesMap[axoCoords[0] + ',' + axoCoords[1]] = obstacle
    }

    function putTile (axoCoords, type) {
        var tile = Tile(axoCoords, type)
        tiles.push(tile)
        tilesRectMap[tile.rectCoords[0] + ',' + tile.rectCoords[1]] = tile
    }

    function random (array) {
        return array[Math.floor(Math.random() * array.length)]
    }

    function repaint () {

        tiles.sort(function (a, b) {
            return a.rectCoords[1] > b.rectCoords[1] ? 1 : -1
        })
        tiles.forEach(function (tile) {
            translateG.appendChild(tile.element)
        })

        var all = obstacles.concat(buildings).sort(function (a, b) {
            return a.rectCoords[1] > b.rectCoords[1] ? 1 : -1
        })
        all.forEach(function (item) {
            translateG.appendChild(item.shadowElement)
        })
        all.forEach(function (item) {
            translateG.appendChild(item.objectElement)
        })

    }

    function resize () {
        cleanAll()
        g.setAttribute('transform', 'translate(' + (innerWidth * 0.5) + ', ' + (innerHeight * 0.5) + ')')
    }

    var zoom = 1
    var mapSize = 8

    var buildings = []
    var buildingsMap = Object.create(null)
/*
    putBuilding(-mapSize + 1, -mapSize + 1, 'castle')
    putBuilding(mapSize - 2, mapSize - 2, 'castle')
    putBuilding(mapSize - 5, mapSize - 2, 'farm')
    putBuilding(-mapSize + 5, -mapSize, 'farm')
    putBuilding(-mapSize + 5, -mapSize + 2, 'farm')
    putBuilding(-3, -3, 'tower')
    putBuilding(4, 1, 'tower')
    putBuilding(3, -5, 'stone')
    putBuilding(-3, 3, 'gold')
*/

    var obstacles = []
    var obstaclesMap = Object.create(null)
/*
    putObstacle([-1, -8], 'wall-vertical')
    putObstacle([-1, -7], 'wall-vertical')
    putObstacle([-1, -6], 'wall-vertical')
    putObstacle([-1, -5], 'wall-vertical')
    putObstacle([-1, -4], 'wall-vertical')
    putObstacle([-1, -3], 'wall-vertical')
    putObstacle([-1, -2], 'wall-vertical')
    putObstacle([-1, -1], 'wall-top-left')
    putObstacle([-2, -1], 'wall-horizontal')
    putObstacle([-3, -1], 'wall-horizontal')
    putObstacle([-4, -1], 'wall-top-right')
    putObstacle([-4, -2], 'wall-bottom-left')
    putObstacle([-5, -2], 'wall-horizontal')
    putObstacle([-6, -2], 'wall-horizontal')
    putObstacle([-7, -2], 'wall-horizontal')
    putObstacle([-8, -2], 'wall-horizontal')
    putObstacle([2, 8], 'wall-vertical')
    putObstacle([2, 7], 'wall-vertical')
    putObstacle([2, 6], 'wall-vertical')
    putObstacle([2, 5], 'wall-vertical')
    putObstacle([2, 4], 'wall-vertical')
    putObstacle([2, 3], 'wall-bottom-right')
    putObstacle([3, 3], 'wall-horizontal')
    putObstacle([5, 3], 'wall-horizontal')
    putObstacle([6, 3], 'wall-horizontal')
    putObstacle([7, 3], 'wall-horizontal')
    putObstacle([8, 3], 'wall-horizontal')
*/
 
    var tiles = []
    var tilesRectMap = []

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
            zoom = Math.max(zoom / 1.1, 0.25)
            zoomG.setAttribute('transform', 'scale(' + zoom + ')')
            cleanAll()
        } else if (e.deltaY < 0) {
            e.preventDefault()
            zoom = Math.min(zoom * 1.1, 4)
            zoomG.setAttribute('transform', 'scale(' + zoom + ')')
            cleanAll()
        }
    })

    addEventListener('resize', resize)
    resize()

})()
