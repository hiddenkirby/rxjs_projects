var Rx = require('rxjs/Rx');

function updateDistance(acc, i){
    if(i % 2 === 0){
        acc += 1;
    }
    return acc;
}

const ticksObservable = Rx.Observable.interval(1000).scan(updateDistance, 0);

ticksObservable.subscribe((evenTicks) => {
    console.log(`Subscriber 1 - evenTicks: ${evenTicks} fo far`);
});

ticksObservable.subscribe((evenTicks) => {
    console.log(`Subscriber 2 - evenTicks: ${evenTicks} fo far`);
});