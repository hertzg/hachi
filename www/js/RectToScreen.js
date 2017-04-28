function RectToScreen (rectCoords) {
    return [
        rectCoords[0] * tileVisibleWidth * 0.5,
        rectCoords[1] * tileVisibleHeight * 0.5,
    ]
}
