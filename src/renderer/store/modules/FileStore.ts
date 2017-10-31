import * as Vuex from 'vuex';
import {Logs} from "../../components/app/db/Logs";
import {ds} from "../../components/app/db/Datasource";
import {Entries} from "../../components/app/db/Entries";

interface FileStoreState {
	files: Object[],
	selected: any | null,
	entries: Object[],
	httpVerbs: string[],
}

const state: FileStoreState = {
	files: [],
	selected: null,
	entries: [],
	httpVerbs: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'CONNECT', 'TRACE', 'PATCH'],
};

const mutations = {
	SET_FILES(state: FileStoreState, files: Object[]) {
		state.files = files;
	},
	SET_SELECTED(state: FileStoreState, selected: any) {
		state.selected = selected;
	},
	SET_ENTRIES(state: FileStoreState, entries: Object[]) {
		state.entries = entries;
	},
	SET_HTTP_VERBS(state: FileStoreState, httpVerbs: string[]) {
		state.httpVerbs = httpVerbs;
	},
};

const actions = {
	refreshFiles({commit, state}: Vuex.Store<FileStoreState>) {
		return ds.connect()
			.then((db) => {
				return new Logs(db).select();
			})
			.then(results => {
				commit('SET_FILES', results);

				if (state.selected == null && results.length > 0) {
					commit('SET_SELECTED', results[0]);
				}
				return results;
			});
	},
	select({commit}: any, selected: any) {
		if (selected === null) {
			return commit('SET_SELECTED', null);
		}
		return ds.connect()
			.then((db) => {
				const file = selected.id ? selected : selected.file;
				commit('SET_SELECTED', file);
				return new Entries(db).selectByFile(file.id, state.httpVerbs);
			})
			.then(results => {
				commit('SET_ENTRIES', results);
				return results;
			});
	},
	remove({commit}: any, selected: any) {
		return ds.connect()
			.then((db) => {
				return new Logs(db).remove(selected);
			})
			.then(results => {
				commit('SET_FILES', results);
				return results;
			});
	},
	setHttpVerbs({commit}: any, httpVerbs: any) {
		return commit('SET_HTTP_VERBS', httpVerbs);
	},
};

export default {
	state,
	mutations,
	actions
}
