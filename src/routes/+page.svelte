<script lang="ts">
	import { getSuggestedEvents, humanDate, type PlannedEvent, type PlannedEvents } from '$lib';
	import { RangeSlider } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import { compareAsc } from 'date-fns';

	export let data: PageData;
	export let selectedGapInWeeks = 2;
	export let suggestedBookings: PlannedEvents;
	export let bookings = data.bookings;

	const handleSuggestionAddClick = (event: PlannedEvent) => {
		bookings = [...bookings, event].sort((a, b) => compareAsc(a.book, b.book));
	};

	$: suggestedBookings = getSuggestedEvents(bookings, selectedGapInWeeks);
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-10 text-center flex flex-col items-center">
		<h2 class="h2">Welcome to Camp Coach.</h2>
		<p>Book today for {humanDate(data.sixMonthsDate)}!</p>
		<p>Important Upcoming Booking Dates:</p>
		<div>
			<!-- Responsive Container (recommended) -->
			<div class="table-container">
				<!-- Native Table Element -->
				<table class="table table-hover">
					<thead>
						<tr>
							<th>Book Date</th>
							<th>Event</th>
							<th>Arrive</th>
							<th>Depart</th>
						</tr>
					</thead>
					<tbody>
						{#each bookings as booking}
							<tr>
								<td>{humanDate(booking.book)}</td>
								<td>{booking.name}</td>
								<td>{humanDate(booking.arrive)}</td>
								<td>{humanDate(booking.depart)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
		<h2>Additional Booking Recommendations</h2>
		<RangeSlider name="range-slider" bind:value={selectedGapInWeeks} max={8} step={1}>
			Recommender Gaps Between Trips
		</RangeSlider>
		{#each suggestedBookings as suggestion}
			<div>
				<p>Arrive: {humanDate(suggestion.arrive)}</p>
				<p>Depart: {humanDate(suggestion.depart)}</p>
				<button on:click={() => handleSuggestionAddClick(suggestion)}>Add</button>
			</div>
		{/each}
	</div>
</div>
