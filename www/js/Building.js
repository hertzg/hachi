function Building (x, y, type) {

    var image = document.createElementNS(svg_xmlns, 'image')
    image.setAttribute('class', 'Building-image')
    image.setAttributeNS(xlink_xmlns, 'href', 'img/building/' + type + '.svg')
    image.setAttribute('width', buildingWidth)
    image.setAttribute('height', buildingHeight)
    image.setAttribute('transform', 'translate(' + (-buildingWidth * 0.5 + tileVisibleWidth * 0.5) + ', ' + (-buildingHeight + tileHeight * 0.5 + tileVisibleHeight * 0.5) + ')')

    var screenX = (x + y) * tileVisibleWidth * 0.5,
        screenY = (y - x) * tileVisibleHeight * 0.5

    var g = document.createElementNS(svg_xmlns, 'g')
    g.appendChild(image)
    g.setAttribute('transform', 'translate(' + screenX + ', ' + screenY + ')')

    return {
        objectElement: g,
        shadowElement: g,
        screenX: screenX,
        screenY: screenY,
        zIndex: y - x,
    }

}
