function Tile (x, y, type) {

    var image = document.createElementNS(svg_xmlns, 'image')
    image.setAttribute('class', 'Tile-image')
    image.setAttributeNS(xlink_xmlns, 'href', 'img/tile/' + type + '.svg')
    image.setAttribute('width', tileWidth)
    image.setAttribute('height', tileHeight)
    image.setAttribute('transform', 'translate(' + (-tileWidth * 0.5) + ', ' + (-tileHeight * 0.5) + ')')

    var maskPath = document.createElementNS(svg_xmlns, 'path')
    maskPath.setAttribute('class', 'Tile-mask')
    maskPath.setAttribute('d', 'M0 -20 L34.641 0 0 20 -34.641 0 Z')

    var g = document.createElementNS(svg_xmlns, 'g')
    g.appendChild(image)
    g.appendChild(maskPath)
    g.setAttribute('transform', 'translate(' + (x * tileVisibleWidth * 0.5 + y * tileVisibleWidth * 0.5) + ', ' + (y * tileVisibleHeight * 0.5 - x * tileVisibleHeight * 0.5) + ')')

    return {
        element: g,
        zIndex: y - x,
    }

}
