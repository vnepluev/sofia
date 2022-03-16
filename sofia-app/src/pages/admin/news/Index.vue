<template>
	<div class="q-pa-md q-gutter-sm text-center">
		<div class="q-px-lg q-pb-md">
			<q-timeline color="primary">
				<br />
				<q-timeline-entry>
					<template v-slot:title class="bold">Event Title</template>
					<template v-slot:subtitle>February 22, 1986</template>

					<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
				</q-timeline-entry>

				<q-timeline-entry icon="tsunami">
					<template v-slot:title>Event Title</template>
					<template v-slot:subtitle>February 21, 1986</template>

					<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
				</q-timeline-entry>
			</q-timeline>
		</div>
	</div>
</template>

<script>
export default {
	name: 'AdminNewsPage',

}
</script>

<style lang="scss" scoped>
.news-card {
	width: 100%;
	max-width: 250px;
}
</style>
