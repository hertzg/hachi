function Poll (initData, changeListener) {

    function poll () {
        setTimeout(function () {
            var request = new XMLHttpRequest
            request.open('get', 'api/v1/refresh?since=' + since)
            request.responseType = 'json'
            request.send()
            request.onload = function () {
                var response = request.response
                since = response.since
                response.changes.forEach(changeListener)
                poll()
            }
        }, 2000)
    }

    var since = initData.since
    poll()

}
