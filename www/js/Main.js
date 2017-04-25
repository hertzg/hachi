var svg_xmlns = 'http://www.w3.org/2000/svg',
    xlink_xmlns = 'http://www.w3.org/1999/xlink'

var tileWidth = 100,
    tileHeight = 60

var tileVisibleWidth = 69.28,
    tileVisibleHeight = 40

;(function () {

    function resize () {
        g.setAttribute('transform', 'translate(' + (innerWidth * 0.5) + ', ' + (innerHeight * 0.5) + ')')
    }

    var tiles = []
    for (var y = -20; y <= 20; y++) {
        for (var x = -20; x <= 20; x++) {
            tiles.push(Tile(x, y))
        }
    }

    tiles.sort(function (a, b) {
        return a.zIndex > b.zIndex ? 1 : -1
    })

    var g = document.createElementNS(svg_xmlns, 'g')
    tiles.forEach(function (tile) {
        g.appendChild(tile.element)
    })

    var svg = document.createElementNS(svg_xmlns, 'svg')
    svg.setAttribute('class', 'Main')
    svg.appendChild(g)

    document.body.appendChild(svg)

    addEventListener('resize', resize)
    resize()

})()
