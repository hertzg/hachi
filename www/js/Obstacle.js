function Obstacle (x, y, type) {

    var screenX = (x + y) * tileVisibleWidth * 0.5,
        screenY = (y - x) * tileVisibleHeight * 0.5

    var objectImage = document.createElementNS(svg_xmlns, 'image')
    objectImage.setAttribute('class', 'Obstacle-image')
    objectImage.setAttributeNS(xlink_xmlns, 'href', 'img/obstacle/object/' + type + '.svg')
    objectImage.setAttribute('width', obstacleWidth)
    objectImage.setAttribute('height', obstacleHeight)
    objectImage.setAttribute('transform', 'translate(' + (-obstacleWidth * 0.5) + ', ' + (-obstacleHeight + tileHeight * 0.5) + ')')

    var objectG = document.createElementNS(svg_xmlns, 'g')
    objectG.appendChild(objectImage)
    objectG.setAttribute('transform', 'translate(' + screenX + ', ' + screenY + ')')

    var shadowImage = document.createElementNS(svg_xmlns, 'image')
    shadowImage.setAttribute('class', 'Obstacle-image')
    shadowImage.setAttributeNS(xlink_xmlns, 'href', 'img/obstacle/shadow/' + type + '.svg')
    shadowImage.setAttribute('width', obstacleWidth)
    shadowImage.setAttribute('height', obstacleHeight)
    shadowImage.setAttribute('transform', 'translate(' + (-obstacleWidth * 0.5) + ', ' + (-obstacleHeight + tileHeight * 0.5) + ')')

    var shadowG = document.createElementNS(svg_xmlns, 'g')
    shadowG.appendChild(shadowImage)
    shadowG.setAttribute('transform', 'translate(' + screenX + ', ' + screenY + ')')

    return {
        objectElement: objectG,
        shadowElement: shadowG,
        screenX: screenX,
        screenY: screenY,
        zIndex: y - x,
    }

}
