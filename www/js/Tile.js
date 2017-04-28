function Tile (axoCoords, type) {

    var rectCoords = AxoToRect(axoCoords)

    var screenCoords = RectToScreen(rectCoords)

    var image = document.createElementNS(svg_xmlns, 'image')
    image.setAttribute('class', 'Tile-image')
    image.setAttributeNS(xlink_xmlns, 'href', 'img/tile/' + type + '.svg')
    image.setAttribute('width', tileWidth)
    image.setAttribute('height', tileHeight)
    image.setAttribute('transform', 'translate(' + (-tileWidth * 0.5) + ', ' + (-tileHeight * 0.5) + ')')

    var g = document.createElementNS(svg_xmlns, 'g')
    g.appendChild(image)
    g.setAttribute('transform', 'translate(' + screenCoords[0] + ', ' + screenCoords[1] + ')')

    return {
        element: g,
        rectCoords: rectCoords,
        screenCoords: screenCoords,
    }

}
