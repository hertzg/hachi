var svg_xmlns = 'http://www.w3.org/2000/svg',
    xlink_xmlns = 'http://www.w3.org/1999/xlink'

var tileWidth = 100,
    tileHeight = 60

var tileVisibleWidth = 69.28,
    tileVisibleHeight = 40

var obstacleWidth = tileWidth,
    obstacleHeight = 80

var obstaclePaddingX = 2 * obstacleWidth

var buildingWidth = 160,
    buildingHeight = 140

var initData = {}
;(function(){
    var request = new XMLHttpRequest
    request.open('get', 'api/v1/init')
    request.responseType = 'json'
    request.send()
    request.onerror = function () {
        // TODO
    }
    request.onload = function () {
        initData = request.response
        document.body.appendChild((function(){
            var el = document.createElement('script')
            el.src = 'js/Main.js'
            return el
        })())
    }
})()
