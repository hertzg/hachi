function Obstacle (x, y, type) {

    var image = document.createElementNS(svg_xmlns, 'image')
    image.setAttribute('class', 'Obstacle-image')
    image.setAttributeNS(xlink_xmlns, 'href', 'img/obstacle/' + type + '.svg')
    image.setAttribute('width', obstacleWidth)
    image.setAttribute('height', obstacleHeight)
    image.setAttribute('transform', 'translate(' + (-obstacleWidth * 0.5) + ', ' + (-obstacleHeight + tileHeight * 0.5) + ')')

    var g = document.createElementNS(svg_xmlns, 'g')
    g.appendChild(image)
    g.setAttribute('transform', 'translate(' + (x * obstacleVisibleWidth * 0.5 + y * obstacleVisibleWidth * 0.5) + ', ' + (y * tileVisibleHeight * 0.5 - x * tileVisibleHeight * 0.5) + ')')

    return {
        element: g,
        zIndex: y - x,
    }

}
