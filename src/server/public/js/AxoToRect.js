function AxoToRect (axoCoords) {
    var x = axoCoords[0]
    var y = axoCoords[1]
    return [x + y, y - x]
}
