<!--
	Вид календаря
	https://qcalendar.netlify.app/examples/day-cell-width
	https://qcalendar.netlify.app/developing/qcalendarday/day-slot-day-body

	Работа с разницей в датах
	https://russianblogs.com/article/7994272970/
	https://www.cyberforum.ru/javascript-beginners/thread2545891.html
 -->
<template>
	<quasar-confirm
		v-model="isNewOrder"
		type="bg-teal"
		text="Хотите сделать новый заказ?"
		@isOk="addNewOrder"
	/>

	<div
		v-if="errorMessage.length > 0"
		class="q-pa-md q-gutter-sm text-center text-xl text-red font-bold"
	>{{ errorMessage }}</div>

	<div v-else class="q-pa-md q-gutter-sm text-center">
		<div class="text-lg">Расписание выходов</div>
		<div class="text-lg mb-4">яхта "Sofia"</div>
		<quasar-spinner v-if="isLoading" />
		<div class="subcontent" v-else>
			<div class="row justify-center">
				<div style="display: flex; max-width: 1200px; width: 100%; max-height: 500px;">
					<q-calendar-day
						ref="calendar"
						locale="ru"
						:hour24-format="true"
						:interval-minutes="30"
						:interval-count="48"
						v-model="selectedDate"
						view="day"
						:max-days="10"
						cell-width="200px"
						weekday-align="right"
						date-align="left"
						date-header="inline"
						no-active-date
						animated
						bordered
						:selected-start-end-dates="['2022-03-29 13:00', '2022-03-29 13:30']"
						@change="onChange"
						@moved="onMoved"
						@click-date="onClickDate"
						@click-time="onClickTime"
						@click-interval="onClickInterval"
						@click-head-intervals="onClickHeadIntervals"
						@click-head-day="onClickHeadDay"
					>
						<!-- <template #head-day-event="{ scope: { timestamp } }">
							<div style="display: flex; justify-content: center; flex-wrap: wrap; padding: 2px;">
								<template v-for="event in eventsMap[timestamp.date]" :key="event.id">
									<q-badge
										v-if="!event.time"
										:class="badgeClasses(event, 'header')"
										:style="badgeStyles(event, 'header')"
										style="width: 100%; cursor: pointer; height: 12px; font-size: 10px; margin: 1px;"
									>
										<div class="title q-calendar__ellipsis">
											{{ event.title }}
											<q-tooltip>{{ event.details }}</q-tooltip>
										</div>
									</q-badge>
									<q-badge
										v-else
										:class="badgeClasses(event, 'header')"
										:style="badgeStyles(event, 'header')"
										style="margin: 1px; width: 10px; max-width: 10px; height: 10px; max-height: 10px; cursor: pointer"
										@click="scrollToEvent(event)"
									>
										<q-tooltip>{{ event.time + ' - ' + event.details }}</q-tooltip>
									</q-badge>
								</template>
							</div>
						</template>-->

						<template #day-body="{ scope: { timestamp, timeStartPos, timeDurationHeight } }">
							<template v-for="event in getEvents(timestamp.date)" :key="event.id">
								<div
									v-if="event.time !== undefined"
									class="my-event"
									:class="badgeClasses(event, 'body')"
									:style="badgeStyles(event, 'body', timeStartPos, timeDurationHeight)"
								>
									<div class="title q-calendar__ellipsis text-bold">
										{{ event.title }}
										<br />
										({{ event.time + ' - ' + event.time_end }})
										<q-tooltip>Яхта забронирована {{ event.time + ' - ' + event.time_end }}</q-tooltip>
									</div>
								</div>
							</template>
						</template>
					</q-calendar-day>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
/* eslint-disable no-plusplus */

import {
	QCalendarDay,
	addToDate,
	parseTimestamp,
	isBetweenDates,
	today,
	parsed,
	parseTime
} from '@quasar/quasar-ui-qcalendar/src/index.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarDay.sass'

import { defineComponent } from 'vue'
import { api } from 'src/boot/axios'
import QuasarSpinner from 'src/components/UI/QuasarSpinner.vue'
import QuasarConfirm from 'src/components/UI/QuasarConfirm.vue'

export default defineComponent({
	name: 'WeekCellWidth',
	components: {
		QCalendarDay,
		QuasarSpinner,
		QuasarConfirm
	},
	data() {
		return {
			isNewOrder: false, // окно добавить новый заказ?
			isLoading: true,
			errorMessage: '',
			selectedDate: today(),
			events: [
				// {
				// 	id: 1,
				// 	title: 'Забронировано',
				// 	time_end: '14:30',
				// 	date: today(),
				// 	time: '01:00',
				// 	duration: 90,
				// 	bgcolor: 'red'
				// },
			]
		}
	},
	/**
	 * получаем события для календаря
	 */
	created() {
		api.get('/public-orders').then((res) => {
			this.isLoading = false
			this.events = [...res.data]
		}).catch((error) => {
			this.errorMessage = `Не удалось получить расписание. Сервер вернул ошибку: ${error}`;
			this.isLoading = false
		})
	},
	computed: {
		// convert the events into a map of lists keyed by date
		eventsMap() {
			const map = {}
			// this.events.forEach(event => (map[ event.date ] = map[ event.date ] || []).push(event))
			this.events.forEach((event) => {
				if (!map[event.date]) {
					map[event.date] = []
				}
				map[event.date].push(event)
				if (event.days) {
					let timestamp = parseTimestamp(event.date)
					let { days } = event
					do {
						timestamp = addToDate(timestamp, { day: 1 })
						if (!map[timestamp.date]) {
							map[timestamp.date] = []
						}
						map[timestamp.date].push(event)
					} while (--days > 0)
				}
			})
			return map
		}
	},
	methods: {
		// Если пользователь хочет создать новый заказ
		addNewOrder() {
			return this.$router.push('/auth/orders')
		},
		badgeClasses(event, type) {
			const isHeader = type === 'header'
			return {
				[`text-white bg-${event.bgcolor}`]: true,
				'full-width': !isHeader && (!event.side || event.side === 'full'),
				'left-side': !isHeader && event.side === 'left',
				'right-side': !isHeader && event.side === 'right',
				'rounded-border': true
			}
		},
		badgeStyles(event, type, timeStartPos = undefined, timeDurationHeight = undefined) {
			const s = {}
			if (timeStartPos && timeDurationHeight) {
				s.top = `${timeStartPos(event.time)}px`
				s.height = `${timeDurationHeight(event.duration)}px`
			}
			s['align-items'] = 'flex-start'
			return s
		},
		getEvents(dt) {
			// get all events for the specified date
			const events = this.eventsMap[dt] || []
			if (events.length === 1) {
				events[0].side = 'full'
			} else if (events.length === 2) {
				// this example does no more than 2 events per day
				// check if the two events overlap and if so, select
				// left or right side alignment to prevent overlap
				const startTime = addToDate(parsed(events[0].date), { minute: parseTime(events[0].time) })
				const endTime = addToDate(startTime, { minute: events[0].duration })
				const startTime2 = addToDate(parsed(events[1].date), { minute: parseTime(events[1].time) })
				const endTime2 = addToDate(startTime2, { minute: events[1].duration })
				if (isBetweenDates(startTime2, startTime, endTime, true) || isBetweenDates(endTime2, startTime, endTime, true)) {
					events[0].side = 'left'
					events[1].side = 'right'
				} else {
					events[0].side = 'full'
					events[1].side = 'full'
				}
			}
			return events
		},
		onToday() {
			this.$refs.calendar.moveToToday()
		},
		onPrev() {
			this.$refs.calendar.prev()
		},
		onNext() {
			this.$refs.calendar.next()
		},
		onClickTime() {
			this.isNewOrder = true
			// console.log('onClickTime', data.scope.timestamp)
		},
		onClickInterval() {
			return false
		},
		onClickHeadIntervals() {
			return false
		},
		onMoved() {
			return false
		},
		onChange() {
			return false
		},
		onClickDate() {
			return false
		},
		onClickHeadDay() {
			return false
		}
	}
})
</script>

<style lang="sass" scoped>
.my-event
	position: absolute
	font-size: 12px
	justify-content: center
	margin: 0 1px
	text-overflow: ellipsis
	overflow: hidden
	cursor: pointer
.title
	position: relative
	display: flex
	justify-content: center
	align-items: center
	height: 100%
.text-white
	color: white
.bg-blue
	background: blue
.bg-green
	background: green
.bg-orange
	background: orange
.bg-red
	background: red
.bg-teal
	background: teal
.bg-grey
	background: grey
.bg-purple
	background: purple
.full-width
	left: 0
	width: calc(100% - 2px)
.left-side
	left: 0
	width: calc(50% - 3px)
.right-side
	left: 50%
	width: calc(50% - 3px)
.rounded-border
	border-radius: 2px
</style>
