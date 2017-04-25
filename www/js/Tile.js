function Tile (x, y) {

    var image = document.createElementNS(svg_xmlns, 'image')
    image.setAttributeNS(xlink_xmlns, 'href', 'img/tile/grass.svg')
    image.setAttribute('width', tileWidth)
    image.setAttribute('height', tileHeight)
    image.setAttribute('transform', 'translate(-' + (tileWidth * 0.5) + ', -' + tileHeight * 0.5 + ') translate(' + (x * tileVisibleWidth * 0.5 + y * tileVisibleWidth * 0.5) + ', ' + (y * tileVisibleHeight * 0.5 - x * tileVisibleHeight * 0.5) + ')')

    return {
        element: image,
        zIndex: y - x,
    }

}
