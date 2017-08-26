function RectToAxo (rectCoords) {
    var rx = rectCoords[0]
    var ay = (rx + rectCoords[1]) / 2
    return [rx - ay, ay]
}
