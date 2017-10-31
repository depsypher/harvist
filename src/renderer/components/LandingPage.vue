<script lang="ts">
	import Vue from 'vue';
	import Rows from './har/Rows.vue';
	import {Droppy} from './Droppy';
	import {Logs} from './app/db/Logs';
	import {Entries} from './app/db/Entries';
	import {ds} from './app/db/Datasource';
	import store from '../store';
	import Component from 'vue-class-component';
	import {Watch} from 'vue-property-decorator';

	const drop = new Droppy();

	@Component({
	    name: 'landing-page',
		components: { Rows }
	})
	export default class LandingPage extends Vue {

		httpVerbs = [];

		created () {
			store.dispatch('refreshFiles').then(() => {
				store.dispatch('select', store.state.FileStore.selected);
			});
		}

		@Watch('httpVerbs')
		onPropertyChanged(value: []) {
			const all = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'CONNECT', 'TRACE', 'PATCH'];
			const selected = all.filter((e, i) => { return value.indexOf(i) > -1; });

			store.dispatch('setHttpVerbs', selected.length == 0 ? all : selected).then(() => {
				store.dispatch('select', store.state.FileStore.selected);
			});
		}

		get files () {
			return store.state.FileStore.files
		}
		get selected () {
			return store.state.FileStore.selected
		}
		get entries () {
			return store.state.FileStore.entries
		}

		open (link: string) { shell.openExternal(link) }
		drop (e: any) {
			drop.drop(e).then((result) => {
				console.log('result', result);
				return store.dispatch('refreshFiles');
			})
			.then((files) => {
				store.dispatch('select', files.slice(-1)[0]);
			});
		}
	}
</script>

<template>
	<v-layout id="wrapper" @drop="drop">
		<v-flex>
			<v-card>
				<v-card-text>
					<div class="subheading pb-2">File: {{selected ? selected.id : null}}</div>
					<span class="subheading pb-2">Methods:</span>
					<v-btn-toggle multiple v-model="httpVerbs">
						<v-btn flat>GET</v-btn>
						<v-btn flat>POST</v-btn>
						<v-btn flat>PUT</v-btn>
						<v-btn flat>DELETE</v-btn>
						<v-btn flat>OPTIONS</v-btn>
						<v-btn flat>HEAD</v-btn>
						<v-btn flat>CONNECT</v-btn>
						<v-btn flat>TRACE</v-btn>
						<v-btn flat>PATCH</v-btn>
					</v-btn-toggle>
				</v-card-text>
			</v-card>
			<div class="left-side">
				<rows :headers="[
					{text: 'Start', sortable: false, align: 'left', value: 'start'},
					{text: 'Method', sortable: false, align: 'left', value: 'method'},
					{text: 'Url', sortable: false, align: 'left', value: 'url'},
					{text: 'Headers Size', sortable: false, align: 'left', value: 'headers'},
					{text: 'Time', sortable: false, align: 'left', value: 'time'},
					]"
				      :entries="entries"></rows>
			</div>
		</v-flex>
	</v-layout>
</template>

<style>
	@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

	body { font-family: 'Source Sans Pro', sans-serif; }

	#wrapper {
		width: calc(98vw - 32px);
		height: calc(100vh - 96px);
		overflow-x: auto;
	}

	.left-side {
		display: flex;
		flex-direction: column;
		width: calc(98vw - 32px);
		height: calc(100vh - 200px);
		overflow: auto;
	}
</style>
