import type { PlannedEvent } from '$lib/event-utils';
import {
	addDays,
	addMonths,
	compareAsc,
	isFriday,
	isMonday,
	isSaturday,
	nextSunday,
	previousFriday,
	subDays,
	subMonths
} from 'date-fns';

export function upcomingBookings(
	bookings: Array<PlannedEvent>,
	filterOutBeforeDate: Date
): Array<PlannedEvent> {
	return bookings.filter(({ book }) => {
		// Compare the two dates and return 1 if the first date is after
		// the second, -1 if the first date is before the second or 0 if dates are equal.
		return compareAsc(book, filterOutBeforeDate) !== -1;
	});
}

export function humanDate(date: Date): string {
	return date.toLocaleDateString(undefined, {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

export function sixMonthsOutDate(firstDay: Date): Date {
	return subMonths(firstDay, 6);
}

export function sixMonthsFromNow(): Date {
	return addMonths(new Date(), 6);
}

export function isLongWeekend(holiday: Date): boolean {
	return isFriday(holiday) || isMonday(holiday);
}

export function getSuggestedHolidayEventDates(holiday: Date): {
	arrive: Date;
	depart: Date;
	book: Date;
} {
	if (isFriday(holiday)) {
		const arrive = subDays(holiday, 1);
		return {
			book: sixMonthsOutDate(arrive),
			arrive,
			depart: nextSunday(holiday)
		};
	}

	if (isMonday(holiday)) {
		const arrive = previousFriday(holiday);
		return {
			arrive,
			book: sixMonthsOutDate(arrive),
			depart: holiday
		};
	}

	const arrive = subDays(holiday, 1);
	return {
		arrive,
		book: sixMonthsOutDate(arrive),
		depart: holiday
	};
}

export function getSuggestedEventDates(arrive: Date): { arrive: Date; depart: Date; book: Date } {
	let depart: Date;

	if (isFriday(arrive) || isSaturday(arrive)) {
		depart = nextSunday(arrive);
	} else {
		depart = addDays(arrive, 1);
	}

	return {
		arrive,
		book: sixMonthsOutDate(arrive),
		depart
	};
}
