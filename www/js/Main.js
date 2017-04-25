var svg_xmlns = 'http://www.w3.org/2000/svg',
    xlink_xmlns = 'http://www.w3.org/1999/xlink'

var tileWidth = 100,
    tileHeight = 60

var tileVisibleWidth = 69.28,
    tileVisibleHeight = 40

var obstacleWidth = tileWidth,
    obstacleHeight = 80

var obstacleVisibleWidth = 69.28,
    obstacleVisibleHeight = 40

;(function () {

    function repaint () {

        tiles.sort(function (a, b) {
            return a.zIndex > b.zIndex ? 1 : -1
        })
        tiles.forEach(function (tile) {
            zoomG.appendChild(tile.element)
        })

        obstacles.sort(function (a, b) {
            return a.zIndex > b.zIndex ? 1 : -1
        })
        obstacles.forEach(function (obstacle) {
            zoomG.appendChild(obstacle.element)
        })

    }

    function resize () {
        g.setAttribute('transform', 'translate(' + (innerWidth * 0.5) + ', ' + (innerHeight * 0.5) + ')')
    }

    var zoom = 4

    var tiles = []
    var obstacles = []
    for (var y = -3; y <= 3; y++) {
        for (var x = -3; x <= 3; x++) {
            var tile = Tile(x, y, Math.random() < 0.5 ? 'grass' : 'gravel')
            tiles.push(tile)
            if (Math.random() < 0.3) {
                obstacles.push(Obstacle(x, y, 'tree'))
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
