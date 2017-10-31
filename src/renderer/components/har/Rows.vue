<template>
	<div>
		<v-data-table
				:headers="headers"
				:items="entries"
				hide-actions
				class="elevation-1"
		>
			<template slot="items" scope="props">
				<tr @click="expandRow(props.item)">
					<!--<td>{{ props.item.pageref }}</td>-->
					<td class="text-xs-left" style="white-space: nowrap;">{{ props.item.prettyTime() }}</td>
					<td class="text-xl-left">{{ props.item.request.method }}</td>
					<td class="text-xl-left">
						<div style="max-width: 50vw; overflow: auto; white-space: nowrap;">
							{{ props.item.request.url }}
						</div>
					</td>
					<td class="text-xl-right">{{ props.item.request.headersSize }}</td>
					<td class="text-xs-left">{{ props.item.time }}</td>
				</tr>
				<tr class="expand" v-show="expanded[props.item.id]">
					<td colspan="6" style="padding: 0;">
						<v-expansion-panel>
							<v-expansion-panel-content v-model="expanded[props.item.id]">
								<v-card>
									<v-card-text>
										<v-tabs light v-model="active">
											<v-tabs-bar class="grey lighten-4">
												<v-tabs-item
														v-for="tab in ['Request', 'Response']"
														:key="tab"
														:href="'#' + tab"
														ripple
												>
													{{ tab }}
												</v-tabs-item>
												<v-tabs-slider color="yellow"></v-tabs-slider>
											</v-tabs-bar>
											<v-tabs-items>
												<v-tabs-content
														v-for="tab in ['Request', 'Response']"
														:key="tab"
														:id="tab"
												>
													<v-card flat>
														<v-card-text v-if="tab == 'Request'">
															<div class="subheading">Headers:</div>
															<table v-if="requestHeaders[props.item.request.id] && requestHeaders[props.item.request.id].length > 0">
																<thead>
																	<tr>
																		<td>Name</td>
																		<td>Value</td>
																	</tr>
																</thead>
																<tbody>
																	<tr v-for="header in requestHeaders[props.item.request.id]">
																		<td>{{header.name}}</td>
																		<td>
																			<div style="max-width: 75vw; overflow: auto;">{{header.value}}</div>
																		</td>
																	</tr>
																</tbody>
															</table>
															<div class="subheading">Cookies:</div>
															<table v-if="requestCookies[props.item.request.id] && requestCookies[props.item.request.id].length > 0">
																<thead>
																	<tr>
																		<td>Name</td>
																		<td>Value</td>
																		<td>Expires</td>
																		<td>Http Only</td>
																		<td>Secure</td>
																	</tr>
																</thead>
																<tbody>
																	<tr v-for="cookie in requestCookies[props.item.request.id]">
																		<td>{{cookie.name}}</td>
																		<td>
																			<div style="max-width: 50vw; overflow: auto;">{{cookie.value}}</div>
																		</td>
																		<td>{{cookie.expires}}</td>
																		<td>{{cookie.httpOnly}}</td>
																		<td>{{cookie.secure}}</td>
																	</tr>
																</tbody>
															</table>
															<div class="subheading">Post Data Params:</div>
															<table v-if="postDataParams[props.item.request.id] && postDataParams[props.item.request.id].length > 0">
																<thead>
																	<tr>
																		<td>Name</td>
																		<td>Value</td>
																		<td>File Name</td>
																		<td>Content Type</td>
																	</tr>
																</thead>
																<tbody>
																	<tr v-for="param in postDataParams[props.item.request.id]">
																		<td>{{param.name}}</td>
																		<td>
																			<div style="max-width: 50vw; overflow: auto;">{{param.value}}</div>
																		</td>
																		<td>{{param.fileName}}</td>
																		<td>{{param.contentType}}</td>
																	</tr>
																</tbody>
															</table>
															<div class="subheading">Post Data Mime Type:</div>
															{{ props.item.request.postDataMimeType }}
															<div class="subheading">Post Data Text:</div>
															{{ props.item.request.postDataText }}
														</v-card-text>
														<v-card-text v-if="tab == 'Response'" style="width: calc(100vw - 100px);">
															<div class="subheading">Status:</div>
															<table>
																<tbody>
																	<tr>
																		<td>Status</td>
																		<td>{{props.item.response.status}} {{props.item.response.statusText}}</td>
																	</tr>
																	<tr>
																		<td>Content</td>
																		<td>
																			Content Mime Type: {{props.item.response.contentMimeType}}
																			Content Size: {{props.item.response.contentSize}}
																		</td>
																	</tr>
																	<tr>
																		<td>Info</td>
																		<td>
																			Http Version: {{props.item.response.httpVersion}}
																			Headers Size: {{props.item.response.headersSize}}
																			Body Size: {{props.item.response.bodySize}}
																			Redirect URL: {{props.item.response.redirectURL}}
																		</td>
																	</tr>
																</tbody>
															</table>

															<div class="subheading">Headers:</div>
															<table v-if="responseHeaders[props.item.response.id] && responseHeaders[props.item.response.id].length > 0">
																<thead>
																<tr>
																	<td>Name</td>
																	<td>Value</td>
																</tr>
																</thead>
																<tbody>
																<tr v-for="header in responseHeaders[props.item.response.id]">
																	<td>{{header.name}}</td>
																	<td>
																		<div style="max-width: 57vw; overflow: auto;">{{header.value}}</div>
																	</td>
																</tr>
																</tbody>
															</table>
															<div class="subheading">Cookies:</div>
															<table v-if="responseCookies[props.item.response.id] && responseCookies[props.item.response.id].length > 0">
																<thead>
																<tr>
																	<td>Name</td>
																	<td>Value</td>
																	<td>Expires</td>
																	<td>Http Only</td>
																	<td>Secure</td>
																</tr>
																</thead>
																<tbody>
																<tr v-for="cookie in responseCookies[props.item.response.id]">
																	<td>{{cookie.name}}</td>
																	<td>
																		<div style="max-width: 50vw; overflow: auto;">{{cookie.value}}</div>
																	</td>
																	<td>{{cookie.expires}}</td>
																	<td>{{cookie.httpOnly}}</td>
																	<td>{{cookie.secure}}</td>
																</tr>
																</tbody>
															</table>
															<div class="subheading">Content:</div>
															{{props.item.response.contentText}}
														</v-card-text>
													</v-card>
												</v-tabs-content>
											</v-tabs-items>
										</v-tabs>
									</v-card-text>
								</v-card>
							</v-expansion-panel-content>
						</v-expansion-panel>
					</td>
				</tr>
			</template>
		</v-data-table>
	</div>
</template>

<script lang="ts">
	import Vue from 'vue'
	import Component from 'vue-class-component'
	import {Prop} from 'vue-property-decorator'
	import {ds} from '../app/db/Datasource'
	import {Cookies} from '../app/db/Cookies'
	import {Headers} from '../app/db/Headers'
	import {Params} from '../app/db/Params'

@Component()
export default class Rows extends Vue {
	 @Prop()
	 headers: Array<any>;

	 @Prop()
	 entries: Array<any>;

	 active: Object = null;
	 expanded: Object = {};

	 postDataParams: Object = {};

	 requestHeaders: Object = {};
	 responseHeaders: Object = {};

	 requestCookies: Object = {};
	 responseCookies: Object = {};

	 expandRow (item) {
	   ds.connect()
	     .then((db) => {
	       return new Cookies(db).selectByResponseId(item.response.id, this.responseCookies)
	         .then(() => {
	           return db
	         })
	     })
	     .then((db) => {
	       return new Cookies(db).selectByRequestId(item.request.id, this.requestCookies)
	         .then(() => {
	           return db
	         })
	     })
	     .then((db) => {
	       return new Headers(db).selectByRequestId(item.request.id, this.requestHeaders)
	         .then(() => {
	           return db
	         })
	     })
	     .then((db) => {
	       return new Headers(db).selectByResponseId(item.response.id, this.responseHeaders)
	         .then(() => {
	           return db
	         })
	     })
	     .then((db) => {
	       return new Params(db).selectByRequestId(item.request.id, this.postDataParams)
	         .then(() => {
	           return db
	         })
	     })
	     .then(() => {
	       this.expanded = Object.assign({}, this.expanded, {[item.id]: !this.expanded[item.id]})
	     })
	}
}
</script>
