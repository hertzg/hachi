;(function (map) {

    function axoCoordsAt (clientX, clientY) {

        var x = ((clientX - innerWidth * 0.5) / zoom - translateX) / tileVisibleWidth,
            y = ((clientY - innerHeight * 0.5) / zoom - translateY) / tileVisibleHeight

        var axoX = Math.round(x - y),
            axoY = Math.round(x + y)

        return [axoX, axoY]

    }

    function load () {

        function checkRow (x0, x1, y) {
            for (var x = x0; x <= x1; x += 2) {

                var axoCoords = RectToAxo([x, y])
                var axoKey = axoCoords[0] + ',' + axoCoords[1]

                if (Math.abs(axoCoords[0]) > mapSize ||
                    Math.abs(axoCoords[1]) > mapSize) continue

                var tile = tilesRectMap[x + ',' + y]
                if (tile !== undefined) {

                    tile.onScreen = true

                    var building = buildingsMap[axoKey]
                    if (building !== undefined) building.onScreen = true

                    var obstacle = obstaclesMap[axoKey]
                    if (obstacle !== undefined) obstacle.onScreen = true

                    continue

                }

                if (loadingTiles[axoKey] !== undefined) continue

                emptyPoints.push(axoCoords)

            }
        }

        tiles.forEach(function (tile) {
            tile.onScreen = false
        })

        obstacles.forEach(function (obstacle) {
            obstacle.onScreen = false
        })

        buildings.forEach(function (building) {
            building.onScreen = false
        })

        var topLeftCoords = AxoToRect(axoCoordsAt(-innerWidth, -innerHeight)),
            bottomRightCoords = AxoToRect(axoCoordsAt(innerWidth * 2, innerHeight * 2))

        var emptyPoints = []
        for (var y = topLeftCoords[1]; y <= bottomRightCoords[1]; y += 2) {
            checkRow(topLeftCoords[0], bottomRightCoords[0], y)
            checkRow(topLeftCoords[0] + 1, bottomRightCoords[0], y + 1)
        }

        for (var i = 0; i < tiles.length; i++) {
            var tile = tiles[i]
            if (tile.onScreen) continue
            groundG.removeChild(tile.element)
            delete tilesRectMap[tile.rectCoords[0] + ',' + tile.rectCoords[1]]
            tiles.splice(i, 1)
            i--
        }

        for (var i = 0; i < buildings.length; i++) {
            var building = buildings[i]
            if (building.onScreen) continue
            objectsG.removeChild(building.objectElement)
            shadowsG.removeChild(building.shadowElement)
            delete buildingsMap[building.axoCoords[0] + ',' + building.axoCoords[1]]
            buildings.splice(i, 1)
            i--
        }

        for (var i = 0; i < obstacles.length; i++) {
            var obstacle = obstacles[i]
            if (obstacle.onScreen) continue
            objectsG.removeChild(obstacle.objectElement)
            shadowsG.removeChild(obstacle.shadowElement)
            delete obstaclesMap[obstacle.axoCoords[0] + ',' + obstacle.axoCoords[1]]
            obstacles.splice(i, 1)
            i--
        }

        if (emptyPoints.length === 0) return

        var request = new XMLHttpRequest
        request.open('post', 'api/fetch.php?map_id=' + map.id)
        request.responseType = 'json'
        request.send(JSON.stringify(emptyPoints))
        request.onerror = function () {
            // TODO
        }
        request.onload = function () {
            emptyPoints.forEach(function (coords) {
                delete loadingTiles[coords[0] + ',' + coords[1]]
            })
            request.response.forEach(function (item) {
                putTile(item[0], item[1])
                var obstacleType = item[2]
                if (obstacleType !== null) putObstacle(item[0], obstacleType)
                var buildingType = item[3]
                if (buildingType !== null) putBuilding(item[0], buildingType)
            })
            repaint()
        }

        emptyPoints.forEach(function (coords) {
            loadingTiles[coords[0] + ',' + coords[1]] = true
        })

    }

    function putBuilding (axoCoords, type) {

        var x = axoCoords[0],
            y = axoCoords[1]

        var building = Building(axoCoords, type)
        buildings.push(building)
        buildingsMap[x + ',' + y] = building
        buildingsMap[x + ',' + (y - 1)] = building
        buildingsMap[(x + 1) + ',' + y] = building
        buildingsMap[(x + 1) + ',' + (y - 1)] = building

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
            groundG.appendChild(tile.element)
        })

        var all = obstacles.concat(buildings).sort(function (a, b) {

            var ay = a.rectCoords[1],
                by = b.rectCoords[1]

            if (ay === by) return a.size > b.size ? -1 : 1
            return ay > by ? 1 : -1

        })
        all.forEach(function (item) {
            shadowsG.appendChild(item.shadowElement)
        })
        all.forEach(function (item) {
            objectsG.appendChild(item.objectElement)
        })

    }

    function resize () {
        minZoom = innerWidth / (tileVisibleWidth * 12)
        maxZoom = innerWidth / (tileVisibleWidth * 4)
        zoom = Math.max(minZoom, Math.min(maxZoom, zoom))
        zoomG.setAttribute('transform', 'scale(' + zoom + ')')
        scheduleLoad()
        centerG.setAttribute('transform', 'translate(' + (innerWidth * 0.5) + ', ' + (innerHeight * 0.5) + ')')
    }

    function scheduleLoad () {

        if (loadTimeout !== 0) {
            loadScheduled = true
            return
        }

        loadTimeout = setTimeout(function () {

            load()

            loadTimeout = 0
            if (!loadScheduled) return
            loadScheduled = false
            scheduleLoad()

        }, 100)
        return

    }

    var minZoom, maxZoom
    var zoom = innerWidth / (tileVisibleWidth * 8)

    var mapSize = map.size

    var buildings = []
    var buildingsMap = Object.create(null)
/*
    putBuilding([mapSize - 2], mapSize - 2, 'castle')
    putBuilding([mapSize - 5], mapSize - 2, 'farm')
    putBuilding([-mapSize + 5], -mapSize, 'farm')
    putBuilding([-mapSize + 5], -mapSize + 2, 'farm')
    putBuilding([-3, -3], 'tower')
    putBuilding([4, 1], 'tower')
    putBuilding([3, -5], 'stone')
    putBuilding([-3, 3], 'gold')
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
 
    var loadingTiles = Object.create(null)

    var tiles = []
    var tilesRectMap = []

    var loadTimeout = 0,
        loadScheduled = false

    var translateX = -((mapSize - 1) * tileVisibleWidth * 0.5),
        translateY = 0

    var groundG = document.createElementNS(svg_xmlns, 'g')
    groundG.setAttribute('class', 'Main-ground')

    var shadowsG = document.createElementNS(svg_xmlns, 'g')
    shadowsG.setAttribute('class', 'Main-shadows')

    var objectsG = document.createElementNS(svg_xmlns, 'g')
    objectsG.setAttribute('class', 'Main-objects')

    var translateG = document.createElementNS(svg_xmlns, 'g')
    translateG.setAttribute('class', 'Main-translate')
    translateG.setAttribute('transform', 'translate(' + translateX + ', ' + translateY + ')')
    translateG.appendChild(groundG)
    translateG.appendChild(shadowsG)
    translateG.appendChild(objectsG)

    var zoomG = document.createElementNS(svg_xmlns, 'g')
    zoomG.setAttribute('class', 'Main-zoom')
    zoomG.appendChild(translateG)

    var centerG = document.createElementNS(svg_xmlns, 'g')
    centerG.setAttribute('class', 'Main-center')
    centerG.appendChild(zoomG)

    var svg = document.createElementNS(svg_xmlns, 'svg')
    svg.setAttribute('class', 'Main')
    svg.appendChild(centerG)
    svg.addEventListener('mousedown', function (e) {

        function mouseMove (e) {

            var dx = e.clientX - x,
                dy = e.clientY - y

            translateX += dx / zoom
            translateY += dy / zoom
            x = e.clientX
            y = e.clientY
            translateG.setAttribute('transform', 'translate(' + translateX + ', ' + translateY + ')')

            e.preventDefault()

        }

        function mouseUp () {
            scheduleLoad()
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

    scheduleLoad()

    addEventListener('wheel', function (e) {
        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return
        if (e.deltaY > 0) {
            e.preventDefault()
            zoom = Math.max(zoom / 1.1, minZoom)
            zoomG.setAttribute('transform', 'scale(' + zoom + ')')
            scheduleLoad()
        } else if (e.deltaY < 0) {
            e.preventDefault()
            zoom = Math.min(zoom * 1.1, maxZoom)
            zoomG.setAttribute('transform', 'scale(' + zoom + ')')
            scheduleLoad()
        }
    })

    addEventListener('resize', resize)
    resize()

})(map)
