function Building (axoCoords, type) {

    var rectCoords = AxoToRect(axoCoords)

    var screenCoords = RectToScreen(rectCoords)

    var image = document.createElementNS(svg_xmlns, 'image')
    image.setAttribute('class', 'Building-image')
    image.setAttributeNS(xlink_xmlns, 'href', 'img/building/' + type + '.svg')
    image.setAttribute('width', buildingWidth)
    image.setAttribute('height', buildingHeight)
    image.setAttribute('transform', 'translate(' + (-buildingWidth * 0.5) + ', ' + (-buildingHeight + tileHeight * 0.5) + ') translate(' + screenCoords[0] + ', ' + screenCoords[1] + ')')

    return {
        axoCoords: axoCoords,
        objectElement: image,
        onScreen: false,
        rectCoords: rectCoords,
        screenCoords: screenCoords,
        shadowElement: document.createElementNS(svg_xmlns, 'g'),
        size: 2,
    }

}
