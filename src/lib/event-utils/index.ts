import { getSuggestedEventDates, getSuggestedHolidayEventDates, humanDate } from '$lib/date-utils';
import { addWeeks, differenceInCalendarWeeks, nextFriday } from 'date-fns';

export type BaseEvent = { name: string; date: string };

export type PlannedEvent = Pick<BaseEvent, 'name'> & { arrive: Date; depart: Date; book: Date };

export type PlannedEvents = Array<PlannedEvent>;

export function parseEvent({ name, date }: BaseEvent, holiday: boolean = false): PlannedEvent {
	const eventDate = new Date(date + 'T00:00:00');

	if (holiday) {
		return {
			...getSuggestedHolidayEventDates(eventDate),
			name
		};
	}

	return {
		...getSuggestedEventDates(eventDate),
		name
	};
}

export function getSuggestedEvents(
	initialBookings: PlannedEvents,
	minWeeksApart: number
): PlannedEvents {
	const suggestions: PlannedEvents = [];

	// insert booking
	// get next booking and insert any gaps

	initialBookings.forEach((currentBooking, i) => {
		const nextBooking = initialBookings[i + 1];
		if (!nextBooking) {
			return;
		}

		const twoWeeksAfterDepart = addWeeks(nextFriday(currentBooking.depart), 2);
		const weeksBetweenBookings = differenceInCalendarWeeks(nextBooking.arrive, twoWeeksAfterDepart);

		if (weeksBetweenBookings >= minWeeksApart) {
			suggestions.push({
				name: 'Recommended',
				...getSuggestedEventDates(twoWeeksAfterDepart)
			});
		}
	});

	return suggestions;
}

export function humanReadableEvent({ name, arrive, depart, book }: PlannedEvent): {
	name: string;
	arrive: string;
	depart: string;
	book: string;
} {
	return {
		name,
		book: humanDate(book),
		arrive: humanDate(arrive),
		depart: humanDate(depart)
	};
}
