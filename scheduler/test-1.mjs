import { bufferCount, concatMap, of, delay, filter } from 'rxjs';
import { TrackOffersScheduler } from './track-offer-scheduler.mjs';
function getData() {
	const arr = [];
	for (let i = 0; i < 20; i++) {
		arr.push(i);
	}
	return arr;
}
const trackOffersScheduler = new TrackOffersScheduler({
	getData,
});

const observable = trackOffersScheduler.execute();

console.log(`Products`);
/*observable
	.pipe(
		bufferCount(5),
		concatMap((x) => of(x).pipe(delay(100)))
	)
	.subscribe({
		next: (products) => {
			console.log(`Regular group`)
			console.log(products);
			console.log(`----------------`);
		},
		error: (e) => console.error(e),
		complete: () => console.log(`I finish transmiting data`)
	})*/

observable
	.pipe(filter(ev => ev % 2 === 0))
	.pipe(
		bufferCount(10),
		concatMap((x) => of(x).pipe(delay(100)))
	)
	.subscribe((products) => {
		console.log(`Par number`);
		console.log(products);
		console.log(`----------------`);
	});

observable
	.pipe(filter(ev => ev % 2 !== 0))
	.pipe(
		bufferCount(5),
		concatMap((x) => of(x).pipe(delay(500)))
	)
	.subscribe((products) => {
		console.log(`Odd numbers`);
		console.log(products);
		console.log(`----------------`);
	});
