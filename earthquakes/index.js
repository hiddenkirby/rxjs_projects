const quakes$ = Rx.Observable.interval(5000)
.flatMap(() => {
    return loadJSONP({
        url: QUAKE_URL,
        callbackName: "eqfeed_callback"
    }).retry(3);
})
.flatMap(result => Rx.Observable.from(result.response.features))
.distinct(quake => quake.properties.code);

quakes$.subscribe(quake => {
    const coords = quake.geometry.coordinates;
    const size = quake.properties.mag * 10000;

    L.circle([coords[1], coords[0]], size).addTo(map);
});

function loadJSONP(settings){
    const url = settings.url;
    const callbackName = settings.callbackName;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    window[callbackName] = data => {
        window[callbackName].data = data;
    };

    return Rx.Observable.create(observer => {
        const handler = e => {
            const status = e.type === "error" ? 400 : 200;
            const response = window[callbackName].data;

            if(status === 200){
                observer.next({
                    status,
                    responseType: "jsonp",
                    response,
                    originalEvent: e
                });

                //observer.complete();  // - i'm not sure why this is wrong
            }else {
                observer.error({
                    type: "error",
                    status,
                    originalEvent: e
                });
            }
        };

        script.onload = script.onreadystatechanged = script.onerror = handler;

        const head = window.document.getElementsByTagName("head")[0];
        head.insertBefore(script, head.firstChild);
    });
}

