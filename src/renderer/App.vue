<template>
	<div id="app">
		<v-app id="nav" toolbar>
			<v-navigation-drawer persistent floating light overflow v-model="drawer">
				<v-list dense class="pt-0">
					<v-list-group v-for="item in items" :value="item.active" v-bind:key="item.title">
						<v-list-tile slot="item" @click="">
							<v-list-tile-action>
								<v-icon>{{ item.icon }}</v-icon>
							</v-list-tile-action>
							<v-list-tile-content>
								<v-list-tile-title>{{ item.title }}</v-list-tile-title>
							</v-list-tile-content>
							<v-list-tile-action v-if="item.items">
								<v-icon>keyboard_arrow_down</v-icon>
							</v-list-tile-action>
						</v-list-tile>
						<v-list-tile v-for="subItem in item.items" v-bind:key="subItem.title">
							<v-list-tile-content>
								<v-list-tile-title @click="select(subItem)">{{ subItem.title }}</v-list-tile-title>
							</v-list-tile-content>
							<v-list-tile-action>
								<v-btn icon ripple @click="remove(subItem)">
									<v-icon color="grey lighten-1" style="font-size: 14px;">close</v-icon>
								</v-btn>
							</v-list-tile-action>
						</v-list-tile>
					</v-list-group>
				</v-list>
			</v-navigation-drawer>
			<v-toolbar class="green" dark>
				<v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
				<v-toolbar-title>Harvist</v-toolbar-title>
			</v-toolbar>
			<main>
				<v-container fluid>
					<router-view></router-view>
				</v-container>
			</main>
		</v-app>
	</div>
</template>

<script lang="ts">
	import Vue, { ComponentOptions } from 'vue';
	import store from './store';

	export default {
        name: 'harvist',
		created() {
			store.dispatch('refreshFiles');
		},
		data() {
			return {
				drawer: false,
			}
		},
		computed: {
        	items: () => {
		        const files = store.state.FileStore.files.map(file => {
			        return {
			        	title: file.id.slice(file.id.lastIndexOf('/') + 1),
				        file: file,
			        };
		        });

		        return [
			        {
				        title: 'Files',
				        icon: 'dashboard',
				        active: true,
				        items: files
			        },
			        {
				        title: 'About', icon: 'question_answer'
			        }
		        ];
	        }
		},
		methods: {
        	select(item) {
        		store.dispatch('select', item, item.file);
        		this.drawer = false;
	        },
        	remove(item) {
        		store.dispatch('remove', item.file)
			        .then(() => {
				        store.dispatch('select', null);
			        })
				    .then(() => {
			            store.dispatch('refreshFiles');
		            })
			        .then(() => {
				        store.dispatch('select', store.state.FileStore.selected);
			        });
	        }
		}
	} as ComponentOptions<Vue>
</script>

<style>
	/* CSS */
</style>
