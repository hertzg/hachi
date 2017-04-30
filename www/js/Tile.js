function Tile (axoCoords, type) {

    var rectCoords = AxoToRect(axoCoords)

    var screenCoords = RectToScreen(rectCoords)

    var image = document.createElementNS(svg_xmlns, 'image')
    image.setAttribute('class', 'Tile-image')
    image.setAttributeNS(xlink_xmlns, 'href', 'img/tile/' + type + '.svg')
    image.setAttribute('width', tileWidth)
    image.setAttribute('height', tileHeight)
    image.setAttribute('transform', 'translate(' + (-tileWidth * 0.5) + ', ' + (-tileHeight * 0.5) + ') translate(' + screenCoords[0] + ', ' + screenCoords[1] + ')')

    return {
        element: image,
        onScreen: false,
        rectCoords: rectCoords,
        screenCoords: screenCoords,
    }

}
