/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "8bd5324cb9f51ebb2aaf"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 1;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(249)(__webpack_require__.s = 249);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = vendor;

/***/ }),
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(76);

/***/ }),
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Initialize the comparator object with a compare function
 *
 * If the function is not passed, it will use the default
 * compare signs (<, > and ==)
 *
 * @param { Function } compareFn
 */
function Comparator(compareFn) {
  if (compareFn) {
    this.compare = compareFn;
  }
}

/**
 * Default implementation for the compare function
 */
Comparator.prototype.compare = function (a, b) {
  if (a === b) return 0;
  return a < b ? -1 : 1;
};

Comparator.prototype.lessThan = function (a, b) {
  return this.compare(a, b) < 0;
};

Comparator.prototype.lessThanOrEqual = function (a, b) {
  return this.lessThan(a, b) || this.equal(a, b);
};

Comparator.prototype.greaterThan = function (a, b) {
  return this.compare(a, b) > 0;
};

Comparator.prototype.greaterThanOrEqual = function (a, b) {
  return this.greaterThan(a, b) || this.equal(a, b);
};

Comparator.prototype.equal = function (a, b) {
  return this.compare(a, b) === 0;
};

/**
 * Reverse the comparison function to use the opposite logic, e.g:
 * this.compare(a, b) => 1
 * this.reverse();
 * this.compare(a, b) => -1
 */
Comparator.prototype.reverse = function () {
  var originalCompareFn = this.compare;
  this.compare = function (a, b) {
    return originalCompareFn(b, a);
  };
};

module.exports = Comparator;


/***/ }),
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var HashSet = __webpack_require__(110);

/**
 * Adjacency list representation of a graph
 * @param {bool} directed
 */
function Graph(directed) {
  this.directed = (directed === undefined ? true : !!directed);
  this.adjList = Object.create(null);
  this.vertices = new HashSet();
}

// Normalize vertex labels as strings
var _ = function (v) {
  return '' + v;
};

Graph.prototype.addVertex = function (v) {
  v = _(v);
  if (this.vertices.contains(v)) {
    throw new Error('Vertex "' + v + '" has already been added');
  }
  this.vertices.add(v);
  this.adjList[v] = Object.create(null);
};

Graph.prototype.addEdge = function (a, b, w) {
  a = _(a);
  b = _(b);
  // If no weight is assigned to the edge, 1 is the default
  w = (w === undefined ? 1 : w);

  if (!this.adjList[a]) this.addVertex(a);
  if (!this.adjList[b]) this.addVertex(b);

  // If there's already another edge with the same origin and destination
  // sum with the current one
  this.adjList[a][b] = (this.adjList[a][b] || 0) + w;

  // If the graph is not directed add the edge in both directions
  if (!this.directed) {
    this.adjList[b][a] = (this.adjList[b][a] || 0) + w;
  }
};

Graph.prototype.neighbors = function (v) {
  return Object.keys(this.adjList[_(v)]);
};

Graph.prototype.edge = function (a, b) {
  return this.adjList[_(a)][_(b)];
};

module.exports = Graph;


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var LinkedList = __webpack_require__(61);

/**
 * Queue (FIFO) using a Linked List as basis
 */
function Queue() {
  this._elements = new LinkedList();

  Object.defineProperty(this, 'length', {
    get: function () {
      return this._elements.length;
    }.bind(this)
  });
}

Queue.prototype.isEmpty = function () {
  return this._elements.isEmpty();
};

/**
 * Adds element to the end of the queue
 */
Queue.prototype.push = function (e) {
  this._elements.add(e);
};

/**
 * Pops the element in the beginning of the queue
 */
Queue.prototype.pop = function () {
  if (this.isEmpty()) {
    throw new Error('Empty queue');
  }
  var e = this._elements.get(0);
  this._elements.del(0);
  return e;
};

Queue.prototype.peek = function () {
  if (this.isEmpty()) {
    throw new Error('Empty queue');
  }

  return this._elements.get(0);
};

Queue.prototype.forEach = function (fn) {
  this._elements.forEach(fn);
};

module.exports = Queue;


/***/ }),
/* 58 */,
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



/**
 * @typedef {Object} Callbacks
 * @param {function(vertex: *, neighbor: *): boolean} allowTraversal -
 *   Determines whether DFS should traverse from the vertex to its neighbor
 *   (along the edge). By default prohibits visiting the same vertex again.
 * @param {function(vertex: *, neighbor: *)} beforeTraversal - Called before
 *   recursive DFS call.
 * @param {function(vertex: *, neighbor: *)} afterTraversal - Called after
 *   recursive DFS call.
 * @param {function(vertex: *)} enterVertex - Called when DFS enters the vertex.
 * @param {function(vertex: *)} leaveVertex - Called when DFS leaves the vertex.
 */


/**
 * Fill in missing callbacks.
 * @param {Callbacks} callbacks
 * @param {Array} seenVertices - Vertices already discovered,
 *   used by default allowTraversal implementation.
 * @return {Callbacks} The same object or new one (if null passed).
 */
var normalizeCallbacks = function (callbacks, seenVertices) {
  callbacks = callbacks || {};

  callbacks.allowTraversal = callbacks.allowTraversal || (function () {
    var seen = {};
    seenVertices.forEach(function (vertex) {
      seen[vertex] = true;
    });

    return function (vertex, neighbor) {
      // It should still be possible to redefine other callbacks,
      // so we better do all at once here.

      if (!seen[neighbor]) {
        seen[neighbor] = true;
        return true;
      }
      return false;
    };
  })();

  var noop = function () {};
  callbacks.beforeTraversal = callbacks.beforeTraversal || noop;
  callbacks.afterTraversal = callbacks.afterTraversal || noop;
  callbacks.enterVertex = callbacks.enterVertex || noop;
  callbacks.leaveVertex = callbacks.leaveVertex || noop;

  return callbacks;
};


/**
 * Run Depth-First Search from a start vertex.
 * Complexity (default implementation): O(V + E).
 *
 * @param {Graph} graph
 * @param {*} startVertex
 * @param {Callbacks} [callbacks]
 */
var depthFirstSearch = function (graph, startVertex, callbacks) {
  dfsLoop(graph, startVertex, normalizeCallbacks(callbacks, [startVertex]));
};


var dfsLoop = function dfsLoop(graph, vertex, callbacks) {
  callbacks.enterVertex(vertex);

  graph.neighbors(vertex).forEach(function (neighbor) {
    if (callbacks.allowTraversal(vertex, neighbor)) {
      callbacks.beforeTraversal(vertex, neighbor);
      dfsLoop(graph, neighbor, callbacks);
      callbacks.afterTraversal(vertex, neighbor);
    }
  });

  callbacks.leaveVertex(vertex);
};


module.exports = depthFirstSearch;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Comparator = __webpack_require__(9);

/**
 * Basic Heap structure
 */
function MinHeap(compareFn) {
  this._elements = [null];
  this._comparator = new Comparator(compareFn);

  Object.defineProperty(this, 'n', {
    get: function () {
      return this._elements.length - 1;
    }.bind(this)
  });
}

MinHeap.prototype._swap = function (a, b) {
  var tmp = this._elements[a];
  this._elements[a] = this._elements[b];
  this._elements[b] = tmp;
};

MinHeap.prototype.isEmpty = function () {
  return this.n === 0;
};

MinHeap.prototype.insert = function (e) {
  this._elements.push(e);
  this._siftUp();
};

MinHeap.prototype.extract = function () {
  var element = this._elements[1];

  // Get the one from the bottom in insert it on top
  // If this isn't already the last element
  var last = this._elements.pop();
  if (this.n) {
    this._elements[1] = last;
    this._siftDown();
  }

  return element;
};

/**
 * Sift up the last element
 * O(lg n)
 */
MinHeap.prototype._siftUp = function () {
  var i, parent;

  for (i = this.n;
      i > 1 && (parent = i >> 1) && this._comparator.greaterThan(
        this._elements[parent], this._elements[i]);
      i = parent) {
    this._swap(parent, i);
  }
};

/**
 * Sifts down the first element
 * O(lg n)
 */
MinHeap.prototype._siftDown = function (i) {
  var c;
  for (i = i || 1; (c = i << 1) <= this.n; i = c) {
    // checks which is the smaller child to compare with
    if (c + 1 <= this.n && this._comparator.lessThan(
          this._elements[c + 1], this._elements[c]))
      // use the right child if it's lower than the left one
      c++;
    if (this._comparator.lessThan(this._elements[i],
          this._elements[c]))
      break;
    this._swap(i, c);
  }
};

MinHeap.prototype.heapify = function (a) {
  if (a) {
    this._elements = a;
    this._elements.unshift(null);
  }

  for (var i = this.n >> 1; i > 0; i--) {
    this._siftDown(i);
  }
};

MinHeap.prototype.forEach = function (fn) {
  // A copy is necessary in order to perform extract(),
  // get the items in sorted order and then restore the original
  // this._elements array
  var elementsCopy = [];
  var i;

  for (i = 0; i < this._elements.length; i++) {
    elementsCopy.push(this._elements[i]);
  }

  for (i = this.n; i > 0; i--) {
    fn(this.extract());
  }

  this._elements = elementsCopy;
};

/**
 * Max Heap, keeps the highest element always on top
 *
 * To avoid code repetition, the Min Heap is used just with
 * a reverse comparator;
 */
function MaxHeap(compareFn) {

  MinHeap.call(this, compareFn);
  this._comparator.reverse();
}

MaxHeap.prototype = new MinHeap();

module.exports = {
  MinHeap: MinHeap,
  MaxHeap: MaxHeap
};


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Doubly-linked list
 */
function LinkedList() {

  this._length = 0;
  this.head = null;
  this.tail = null;

  // Read-only length property
  Object.defineProperty(this, 'length', {
    get: function () {
      return this._length;
    }.bind(this)
  });
}

/**
 * A linked list node
 */
function Node(value) {
  this.value = value;
  this.prev = null;
  this.next = null;
}

/**
 * Whether the list is empty
 *
 * @return Boolean
 */
LinkedList.prototype.isEmpty = function () {
  return this.length === 0;
};

/**
 * Adds the element to the end of the list or to the desired index
 *
 * @param { Object } n
 * @param { Number } index
 */
LinkedList.prototype.add = function (n, index) {
  if (index > this.length || index < 0) {
    throw new Error('Index out of bounds');
  }

  var node = new Node(n);

  if (index !== undefined && index < this.length) {
    var prevNode,
        nextNode;

    if (index === 0) {
      // Insert in the beginning
      nextNode = this.head;
      this.head = node;
    } else {
      nextNode = this.getNode(index);
      prevNode = nextNode.prev;
      prevNode.next = node;
      node.prev = prevNode;
    }
    nextNode.prev = node;
    node.next = nextNode;
  } else {
    // Insert at the end
    if (!this.head) this.head = node;

    if (this.tail) {
      this.tail.next = node;
      node.prev = this.tail;
    }
    this.tail = node;
  }

  this._length++;
};

/**
 * Return the value associated to the Node on the given index
 *
 * @param { Number } index
 * @return misc
 */
LinkedList.prototype.get = function (index) {
  return this.getNode(index).value;
};

/**
 * O(n) get
 *
 * @param { Number } index
 * @return Node
 */
LinkedList.prototype.getNode = function (index) {
  if (index >= this.length || index < 0) {
    throw new Error('Index out of bounds');
  }

  var node = this.head;
  for (var i = 1; i <= index; i++) {
    node = node.next;
  }

  return node;
};

/**
 * Delete the element in the indexth position
 *
 * @param { Number } index
 */
LinkedList.prototype.del = function (index) {
  if (index >= this.length || index < 0) {
    throw new Error('Index out of bounds');
  }

  this.delNode(this.getNode(index));
};

LinkedList.prototype.delNode = function (node) {
  if (node === this.tail) {
    // node is the last element
    this.tail = node.prev;
  } else {
    node.next.prev = node.prev;
  }
  if (node === this.head) {
    // node is the first element
    this.head = node.next;
  } else {
    node.prev.next = node.next;
  }

  this._length--;
};

/**
 * Performs the fn function with each element in the list
 */
LinkedList.prototype.forEach = function (fn) {
  var node = this.head;
  while (node) {
    fn(node.value);
    node = node.next;
  }
};

module.exports = LinkedList;


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var MinHeap = __webpack_require__(60).MinHeap;

/**
 * Extends the MinHeap with the only difference that
 * the heap operations are performed based on the priority of the element
 * and not on the element itself
 */
function PriorityQueue(initialItems) {

  var self = this;
  MinHeap.call(this, function (a, b) {
    return self.priority(a) < self.priority(b) ? -1 : 1;
  });

  this._priority = {};

  initialItems = initialItems || {};
  Object.keys(initialItems).forEach(function (item) {
    self.insert(item, initialItems[item]);
  });
}

PriorityQueue.prototype = new MinHeap();

PriorityQueue.prototype.insert = function (item, priority) {
  if (this._priority[item] !== undefined) {
    return this.changePriority(item, priority);
  }
  this._priority[item] = priority;
  MinHeap.prototype.insert.call(this, item);
};

PriorityQueue.prototype.extract = function (withPriority) {
  var min = MinHeap.prototype.extract.call(this);
  return withPriority ?
    min && {item: min, priority: this._priority[min]} :
    min;
};

PriorityQueue.prototype.priority = function (item) {
  return this._priority[item];
};

PriorityQueue.prototype.changePriority = function (item, priority) {
  this._priority[item] = priority;
  this.heapify();
};

module.exports = PriorityQueue;


/***/ }),
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Queue = __webpack_require__(57);


/**
 * @typedef {Object} Callbacks
 * @param {function(vertex: *, neighbor: *): boolean} allowTraversal -
 *   Determines whether BFS should traverse from the vertex to its neighbor
 *   (along the edge). By default prohibits visiting the same vertex again.
 * @param {function(vertex: *, neighbor: *)} onTraversal - Called when BFS
 *   follows the edge (and puts its head into the queue).
 * @param {function(vertex: *)} enterVertex - Called when BFS enters the vertex.
 * @param {function(vertex: *)} leaveVertex - Called when BFS leaves the vertex.
 */


/**
 * Fill in missing callbacks.
 *
 * @param {Callbacks} callbacks
 * @param {Array} seenVertices - Vertices already discovered,
 *   used by default allowTraversal implementation.
 * @return {Callbacks} The same object or new one (if null passed).
 */
var normalizeCallbacks = function (callbacks, seenVertices) {
  callbacks = callbacks || {};

  callbacks.allowTraversal = callbacks.allowTraversal || (function () {
    var seen = seenVertices.reduce(function (seen, vertex) {
      seen[vertex] = true;
      return seen;
    }, {});

    return function (vertex, neighbor) {
      if (!seen[neighbor]) {
        seen[neighbor] = true;
        return true;
      }
      else {
        return false;
      }
    };
  })();

  var noop = function () {};
  callbacks.onTraversal = callbacks.onTraversal || noop;
  callbacks.enterVertex = callbacks.enterVertex || noop;
  callbacks.leaveVertex = callbacks.leaveVertex || noop;

  return callbacks;
};


/**
 * Run Breadth-First Search from a start vertex.
 * Complexity (default implementation): O(V + E).
 *
 * @param {Graph} graph
 * @param {*} startVertex
 * @param {Callbacks} [callbacks]
 */
var breadthFirstSearch = function (graph, startVertex, callbacks) {
  var vertexQueue = new Queue();
  vertexQueue.push(startVertex);
  callbacks = normalizeCallbacks(callbacks, [startVertex]);

  var vertex;
  var enqueue = function (neighbor) {
    if (callbacks.allowTraversal(vertex, neighbor)) {
      callbacks.onTraversal(vertex, neighbor);
      vertexQueue.push(neighbor);
    }
  };

  while (!vertexQueue.isEmpty()) {
    vertex = vertexQueue.pop();
    callbacks.enterVertex(vertex);
    graph.neighbors(vertex).forEach(enqueue);
    callbacks.leaveVertex(vertex);
  }
};


module.exports = breadthFirstSearch;


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



var multiplicationOperator = function (a, b) {
  return a * b;
};


/**
 * Raise value to a positive integer power by repeated squaring.
 *
 * @param {*} base
 * @param {number} power
 * @param {function} [mul] - Multiplication function,
 *   standard multiplication operator by default.
 * @param {*} identity - Identity value, used when power == 0.
 *   If mul is not set, defaults to 1.
 * @return {*}
 */
var fastPower = function (base, power, mul, identity) {
  if (mul === undefined) {
    mul = multiplicationOperator;
    identity = 1;
  }
  if (power < 0 || Math.floor(power) !== power) {
    throw new Error('Power must be a positive integer or zero.');
  }

  // If the power is zero, identity value must be given (or set by default).
  if (!power) {
    if (identity === undefined) {
      throw new Error('The power is zero, but identity value not set.');
    }
    else {
      return identity;
    }
  }

  // Iterative form of the algorithm avoids checking the same thing twice.
  var result;
  var multiplyBy = function (value) {
    result = (result === undefined) ? value : mul(result, value);
  };
  for (var factor = base; power; power >>>= 1, factor = mul(factor, factor)) {
    if (power & 1) {
      multiplyBy(factor);
    }
  }
  return result;
};


module.exports = fastPower;


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Euclidean algorithm to calculate the Greatest Common Divisor (GCD)
 *
 * @param Number
 * @param Number
 *
 * @return Number
 */
var gcdDivisionBased = function (a, b) {
  var tmp = a;
  a = Math.max(a, b);
  b = Math.min(tmp, b);
  while (b !== 0) {
    tmp = b;
    b = a % b;
    a = tmp;
  }

  return a;
};

/**
 * Binary GCD algorithm (Stein's Algorithm)
 *
 * @link https://en.wikipedia.org/wiki/Binary_GCD_algorithm
 * This is basically a js version of the c implementation on Wikipedia
 *
 * @param Number
 * @param Number
 *
 * @return Number
 */
var gcdBinaryIterative = function (a, b) {

  // GCD(0,b) == b; GCD(a,0) == a, GCD(0,0) == 0
  if (a === 0) {
    return b;
  }

  if (b === 0) {
    return a;
  }

  var shift;
  // Let shift = log(K), where K is the greatest power of 2
  // dividing both a and b
  for (shift = 0; ((a | b) & 1) === 0; ++shift) {
    a >>= 1;
    b >>= 1;
  }

  // Remove all factors of 2 in a -- they are not common
  // Note: a is not zero, so while will terminate
  while ((a & 1) === 0) {
    a >>= 1;
  }

  var tmp;

  // From here on, a is always odd
  do {
    // Remove all factors of 2 in b -- they are not common
    // Note: b is not zero, so while will terminate
    while ((b & 1) === 0) {
      b >>= 1;
    }

    // Now a and b are both odd. Swap if necessary so a <= b,
    // then set b = b - a (which is even).
    if (a > b) {
      tmp = b;
      b = a;
      a = tmp;
    }

    b -= a;  // Here b >= a
  } while (b !== 0);

  // restore common factors of 2
  return a << shift;
};

gcdDivisionBased.binary = gcdBinaryIterative;
module.exports = gcdDivisionBased;


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Disjoint Set Forest data structure.
 * Allows fast subset merging and querying.
 * New elements lie in their own one-element subsets by default.
 *
 * @constructor
 */
function DisjointSetForest() {
  this._parents = {};
  this._ranks = {};
  this._sizes = {};
}


DisjointSetForest.prototype._introduce = function (element) {
  if (!(element in this._parents)) {
    this._parents[element] = element;
    this._ranks[element] = 0;
    this._sizes[element] = 1;
  }
};


/**
 * Check if the elements belong to the same subset.
 * Complexity: O(A^-1) (inverse Ackermann function) amortized.
 *
 * @param {...*} element
 * @return {boolean}
 */
DisjointSetForest.prototype.sameSubset = function (element) {
  this._introduce(element);
  var root = this.root(element);
  return [].slice.call(arguments, 1).every(function (element) {
    this._introduce(element);
    return this.root(element) === root;
  }.bind(this));
};


/**
 * Return the root element which represents the given element's subset.
 * The result does not depend on the choice of the element,
 *   but rather on the subset itself.
 * Complexity: O(A^-1) (inverse Ackermann function) amortized.
 *
 * @param {*} element
 * @return {*}
 */
DisjointSetForest.prototype.root = function (element) {
  this._introduce(element);
  if (this._parents[element] !== element) {
    this._parents[element] = this.root(this._parents[element]);
  }
  return this._parents[element];
};


/**
 * Return the size of the given element's subset.
 * Complexity: O(A^-1) (inverse Ackermann function) amortized.
 *
 * @param {*} element
 * @return {number}
 */
DisjointSetForest.prototype.size = function (element) {
  this._introduce(element);
  return this._sizes[this.root(element)];
};


/**
 * Merge subsets containing two (or more) given elements into one.
 * Complexity: O(A^-1) (inverse Ackermann function) amortized.
 *
 * @param {*} element1
 * @param {*} element2
 * @param {...*}
 * @return {DisjointSetForest}
 */
DisjointSetForest.prototype.merge = function merge(element1, element2) {
  if (arguments.length > 2) {
    merge.apply(this, [].slice.call(arguments, 1));
  }

  this._introduce(element1);
  this._introduce(element2);
  var root1 = this.root(element1);
  var root2 = this.root(element2);

  if (this._ranks[root1] < this._ranks[root2]) {
    this._parents[root1] = root2;
    this._sizes[root2] += this._sizes[root1];
  }
  else if (root1 !== root2) {
    this._parents[root2] = root1;
    this._sizes[root1] += this._sizes[root2];
    if (this._ranks[root1] === this._ranks[root2]) {
      this._ranks[root1] += 1;
    }
  }
  return this;
};


module.exports = DisjointSetForest;


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var LinkedList = __webpack_require__(61);

function HashTable(initialCapacity) {
  this._table = new Array(initialCapacity || 64);
  this._items = 0;

  Object.defineProperty(this, 'capacity', {
    get: function () {
      return this._table.length;
    }
  });

  Object.defineProperty(this, 'size', {
    get: function () {
      return this._items;
    }
  });
}

/**
 * (Same algorithm as Java's String.hashCode)
 * Returns a hash code for this string. The hash code for a String object is
 * computed as: s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1]
 * using int arithmetic, where s[i] is the ith character of the string,
 * n is the length of the string, and ^ indicates exponentiation.
 * (The hash value of the empty string is zero.)
 */
HashTable.prototype.hash = function (s) {
  if (typeof s !== 'string') s = JSON.stringify(s);
  var hash = 0;
  for (var i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash) + s.charCodeAt(i);
    hash &= hash; // Keep it a 32bit int
  }
  return hash;
};

HashTable.prototype.get = function (key) {
  var i = this._position(key);
  var node;
  if ((node = this._findInList(this._table[i], key))) {
    return node.value.v;
  }
};

HashTable.prototype.put = function (key, value) {
  var i = this._position(key);
  if (!this._table[i]) {
    // Hashing with chaining
    this._table[i] = new LinkedList();
  }
  var item = {k: key, v: value};

  var node = this._findInList(this._table[i], key);
  if (node) {
    // if the key already exists in the list, replace
    // by the current item
    node.value = item;
  } else {
    this._table[i].add(item);
    this._items++;

    if (this._items === this.capacity) this._increaseCapacity();
  }
};

HashTable.prototype.del = function (key) {
  var i = this._position(key);
  var node;

  if ((node = this._findInList(this._table[i], key))) {
    this._table[i].delNode(node);
    this._items--;
  }
};

HashTable.prototype._position = function (key) {
  return Math.abs(this.hash(key)) % this.capacity;
};

HashTable.prototype._findInList = function (list, key) {
  var node = list && list.head;
  while (node) {
    if (node.value.k === key) return node;
    node = node.next;
  }
};

HashTable.prototype._increaseCapacity = function () {
  var oldTable = this._table;
  this._table = new Array(2 * this.capacity);
  this._items = 0;

  for (var i = 0; i < oldTable.length; i++) {
    var node = oldTable[i] && oldTable[i].head;
    while (node) {
      this.put(node.value.k, node.value.v);
      node = node.next;
    }
  }
};

HashTable.prototype.forEach = function (fn) {
  var applyFunction = function (linkedList) {
    linkedList.forEach(function (elem) {
      fn(elem.k, elem.v);
    });
  };

  for (var i = 0; i < this._table.length; i++) {
    if (this._table[i]) {
      applyFunction(this._table[i]);
    }
  }
};

module.exports = HashTable;


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var HashTable = __webpack_require__(109);

/**
 * Typical representation of a mathematical set
 * No restriction on element types
 *   i.e. set.add(1,'a', "b", { "foo" : "bar" })
 */
var HashSet = function () {
  this._elements = new HashTable(arguments.length);
  this.add.apply(this, arguments);

  Object.defineProperty(this, 'size', {
    get: function () {
      return this._elements.size;
    }
  });
};

HashSet.prototype.add = function () {
  for (var i = 0; i < arguments.length; i++) {
    this._elements.put(arguments[i], true);
  }
  return this;
};

HashSet.prototype.remove = function () {
  for (var i = 0; i < arguments.length; i++) {
    this._elements.del(arguments[i]);
  }
  return this;
};

HashSet.prototype.contains = function (e) {
  return this._elements.get(e) !== undefined;
};

HashSet.prototype.forEach = function (fn) {
  this._elements.forEach(fn);
};

module.exports = HashSet;


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Queue = __webpack_require__(57);

/**
 * Stack (LIFO) using a Linked List as basis
 */
function Stack() {
  Queue.call(this);
}

/**
 * Use a Queue as prototype and just overwrite
 * the push method to insert at the 0 position
 * instead of the end of the queue
 */
Stack.prototype = new Queue();

/**
 * Adds element to the top of the stack
 */
Stack.prototype.push = function (e) {
  this._elements.add(e, 0);
};

module.exports = Stack;


/***/ }),
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */,
/* 130 */,
/* 131 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jquery__);

const kmp = __webpack_require__(192);
const algorithms = __webpack_require__(187);
__WEBPACK_IMPORTED_MODULE_0_jquery__(() => {
    const button = __WEBPACK_IMPORTED_MODULE_0_jquery__(`<button type='button'>run</button>`).appendTo(document.body);
    const text = "ABCDAB ABABCDABDCDAABCDABDBC ABCDABCDABDABABCDABDD";
    const pattern = "ABCDABD";
    button.click(() => {
        console.log(kmp.kmp(text, pattern));
        console.log(algorithms.String.knuthMorrisPratt(text, pattern));
        const onFindAll = indexs => {
            console.log(indexs);
        };
        new BF(text, pattern, onFindAll).search();
        new KMP(text, pattern, onFindAll).search();
    });
});
class KMP {
    constructor(text, pattern, onFind) {
        this.text = text;
        this.pattern = pattern;
        this.onFind = onFind;
        this.getNextList = (pattern) => {
            let nextList = [];
            for (let start = 0; start < pattern.length; start++) {
                let next = 0;
                let prefixStringEnd = start + 1;
                for (let tempNext = 0; tempNext < prefixStringEnd; tempNext++) {
                    const prefixString = pattern.substring(0, tempNext);
                    const suffixString = pattern.substring(prefixStringEnd - tempNext, prefixStringEnd);
                    if (prefixString === suffixString) {
                        next = tempNext;
                    }
                }
                nextList.push(next);
            }
            return nextList;
        };
    }
    search() {
        const match = (text, pattern, onMatch) => {
            const nextList = this.getNextList(pattern);
            for (let textCharIndex = 0, subTextCharIndex = 0, maxTextCharIndex = text.length - pattern.length; textCharIndex <= maxTextCharIndex;) {
                const subText = text.substr(textCharIndex, pattern.length);
                const onSuccess = () => {
                    onMatch(textCharIndex);
                    const failPatternIndex = pattern.length;
                    const next = nextList[failPatternIndex - 1];
                    textCharIndex += failPatternIndex - next;
                    subTextCharIndex = next;
                };
                const onFail = failPatternIndex => {
                    if (failPatternIndex === 0) {
                        textCharIndex++;
                        subTextCharIndex = 0;
                    }
                    else {
                        const next = nextList[failPatternIndex - 1];
                        textCharIndex += failPatternIndex - next;
                        subTextCharIndex = next;
                    }
                };
                const matchSubText = (subText, pattern, subTextCharIndex, onSuccess, onFail) => {
                    let state = true;
                    for (; subTextCharIndex < pattern.length; subTextCharIndex++) {
                        const textChar = subText.charAt(subTextCharIndex);
                        const patternChar = pattern.charAt(subTextCharIndex);
                        if (textChar !== patternChar) {
                            state = false;
                            break;
                        }
                    }
                    if (state) {
                        onSuccess();
                    }
                    else {
                        onFail(subTextCharIndex);
                    }
                };
                matchSubText(subText, pattern, subTextCharIndex, onSuccess, onFail);
            }
        };
        const findedIndexList = [];
        const onMatch = index => {
            findedIndexList.push(index);
        };
        match(this.text, this.pattern, onMatch);
        this.onFind(findedIndexList);
    }
}
class BF {
    constructor(text, pattern, onFind) {
        this.text = text;
        this.pattern = pattern;
        this.onFind = onFind;
    }
    search() {
        const match = (text, pattern, onMatch) => {
            for (let textCharIndex = 0; textCharIndex <= text.length - pattern.length;) {
                const subText = text.substr(textCharIndex, pattern.length);
                const onSuccess = () => {
                    onMatch(textCharIndex);
                    textCharIndex++;
                };
                const onFail = failPatternIndex => {
                    textCharIndex++;
                };
                const matchSubText = (subText, pattern, onSuccess, onFail) => {
                    let subTextCharIndex = 0;
                    for (subTextCharIndex = 0; subTextCharIndex < pattern.length; subTextCharIndex++) {
                        if (subText.charAt(subTextCharIndex) !== pattern.charAt(subTextCharIndex)) {
                            break;
                        }
                    }
                    if (subTextCharIndex === pattern.length) {
                        onSuccess();
                    }
                    else {
                        onFail(subTextCharIndex);
                    }
                };
                matchSubText(subText, pattern, onSuccess, onFail);
            }
        };
        const findedIndexList = [];
        const onMatch = index => {
            findedIndexList.push(index);
        };
        match(this.text, this.pattern, onMatch);
        this.onFind(findedIndexList);
    }
}


/***/ }),
/* 132 */,
/* 133 */,
/* 134 */,
/* 135 */,
/* 136 */,
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * 2D bezier-curve, https://en.wikipedia.org/wiki/B%C3%A9zier_curve
 * Usage:
 *   var b = new BezierCurve([{x: 0, y: 0}, {x: 10, y: 3}]);
 *   b.get(0.5); // {x: 5, y: 1.5}
 */

/**
 * Generates a bezier-curve from a series of points
 * @param Array array of control points ([{x: x0, y: y0}, {x: x1, y: y1}])
 */
var BezierCurve = function (points) {
  this.n = points.length;
  this.p = [];

  // The binomial coefficient
  var c = [1];
  var i, j;
  for (i = 1; i < this.n; ++i) {
    c.push(0);
    for (j = i; j >= 1; --j) {
        c[j] += c[j - 1];
    }
  }

  // the i-th control point times the coefficient
  for (i = 0; i < this.n; ++i) {
    this.p.push({x: c[i] * points[i].x, y: c[i] * points[i].y});
  }
};

/**
 * @param Number float variable from 0 to 1
 */
BezierCurve.prototype.get = function (t) {
  var res = {x: 0, y: 0};
  var i;
  var a = 1, b = 1;

  // The coefficient
  var c = [];
  for (i = 0; i < this.n; ++i) {
    c.push(a);
    a *= t;
  }

  for (i = this.n - 1; i >= 0; --i) {
    res.x += this.p[i].x * c[i] * b;
    res.y += this.p[i].y * c[i] * b;
    b *= 1 - t;
  }
  return res;
};

module.exports = BezierCurve;


/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Calculates the shortest paths in a graph to every node from the node s
 * with SPFA(Shortest Path Faster Algorithm) algorithm
 *
 * @param {Object} graph An adjacency list representing the graph
 * @param {string} start the starting node
 *
 */
function spfa(graph, s) {
  var distance = {};
  var previous = {};
  var queue = {};
  var isInQue = {};
  var cnt = {};
  var head = 0;
  var tail = 1;
  // initialize
  distance[s] = 0;
  queue[0] = s;
  isInQue[s] = true;
  cnt[s] = 1;
  graph.vertices.forEach(function (v) {
    if (v !== s) {
      distance[v] = Infinity;
      isInQue[v] = false;
      cnt[v] = 0;
    }
  });

  var currNode;
  while (head !== tail) {
    currNode = queue[head++];
    isInQue[currNode] = false;
    var neighbors = graph.neighbors(currNode);
    for (var i = 0; i < neighbors.length; i++) {
      var v = neighbors[i];
      // relaxation
      var newDistance = distance[currNode] + graph.edge(currNode, v);
      if (newDistance < distance[v]) {
        distance[v] = newDistance;
        previous[v] = currNode;
        if (!isInQue[v]) {
          queue[tail++] = v;
          isInQue[v] = true;
          cnt[v]++;
          if (cnt[v] > graph.vertices.size)
            // indicates negative-weighted cycle
            return {
              distance: {}
            };
        }
      }
    }
  }

  return {
    distance: distance,
    previous: previous
  };
}

module.exports = spfa;


/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Calculates the shortest paths in a graph to every node
 * from the node 'startNode' with Bellman-Ford's algorithm
 *
 * Worst Case Complexity: O(|V| * |E|), where |V| is the number of
 * vertices and |E| is the number of edges in the graph
 *
 * @param Object 'graph' An adjacency list representing the graph
 * @param String 'startNode' The starting node
 * @return Object the minimum distance to reach every vertice of
 *    the graph starting in 'startNode', or an empty object if there
 *    exists a Negative-Weighted Cycle in the graph
 */
var bellmanFord = function (graph, startNode) {
  var minDistance = {};
  var previousVertex = {};
  var edges = [];
  var adjacencyListSize = 0;

  // Add all the edges from the graph to the 'edges' array
  graph.vertices.forEach(function (s) {
    graph.neighbors(s).forEach(function (t) {
      edges.push({
        source: s,
        target: t,
        weight: graph.edge(s, t)
      });
    });

    minDistance[s] = Infinity;
    ++adjacencyListSize;
  });

  minDistance[startNode] = 0;

  var edgesSize = edges.length;
  var sourceDistance;
  var targetDistance;

  var iteration;
  for (iteration = 0; iteration < adjacencyListSize; ++iteration) {
    var somethingChanged = false;

    for (var j = 0; j < edgesSize; j++) {
      sourceDistance = minDistance[edges[j].source] + edges[j].weight;
      targetDistance = minDistance[edges[j].target];

      if (sourceDistance < targetDistance) {
        somethingChanged = true;
        minDistance[edges[j].target] = sourceDistance;
        previousVertex[edges[j].target] = edges[j].source;
      }
    }

    if (!somethingChanged) {
      // Early stop.
      break;
    }
  }

  // If the loop did not break early, then there is a negative-weighted cycle.
  if (iteration === adjacencyListSize) {
    // Empty 'distance' object indicates Negative-Weighted Cycle
    return {
      distance: {}
    };
  }

  return {
    distance: minDistance,
    previous: previousVertex
  };
};

module.exports = bellmanFord;


/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var breadthFirstSearch = __webpack_require__(105);


/**
 * Shortest-path algorithm based on Breadth-First Search.
 * Works solely on graphs with equal edge weights (but works fast).
 * Complexity: O(V + E).
 *
 * @param {Graph} graph
 * @param {string} source
 * @return {{distance: Object.<string, number>,
 *           previous: Object.<string, string>}}
 */
var bfsShortestPath = function (graph, source) {
  var distance = {}, previous = {};
  distance[source] = 0;

  breadthFirstSearch(graph, source, {
    onTraversal: function (vertex, neighbor) {
      distance[neighbor] = distance[vertex] + 1;
      previous[neighbor] = vertex;
    }
  });

  return {
    distance: distance,
    previous: previous
  };
};


module.exports = bfsShortestPath;


/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var PriorityQueue = __webpack_require__(62);

/**
 * Calculates the shortest paths in a graph to every node from the node s
 * with Dijkstra's algorithm
 *
 * @param {Object} graph An adjacency list representing the graph
 * @param {string} start the starting node
 *
 */
function dijkstra(graph, s) {
  var distance = {};
  var previous = {};
  var q = new PriorityQueue();
  // Initialize
  distance[s] = 0;
  graph.vertices.forEach(function (v) {
    if (v !== s) {
      distance[v] = Infinity;
    }
    q.insert(v, distance[v]);
  });

  var currNode;
  var relax = function (v) {
    var newDistance = distance[currNode] + graph.edge(currNode, v);
    if (newDistance < distance[v]) {
      distance[v] = newDistance;
      previous[v] = currNode;
      q.changePriority(v, distance[v]);
    }
  };
  while (!q.isEmpty()) {
    currNode = q.extract();
    graph.neighbors(currNode).forEach(relax);
  }
  return {
    distance: distance,
    previous: previous
  };
}

module.exports = dijkstra;


/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



var Graph = __webpack_require__(56),
    depthFirstSearch = __webpack_require__(59);


/** Examine a graph and compute pair of end vertices of the existing Euler path.
 * Return pair of undefined values if there is no specific choice of end points.
 * Return value format: {start: START, finish: FINISH}.
 *
 * @param {Graph} Graph, must be connected and contain at least one vertex.
 * @return Object
 */
var eulerEndpoints = function (graph) {
  var rank = {};
  //     start     ->  rank = +1
  // middle points ->  rank =  0
  //    finish     ->  rank = -1

  // Initialize ranks to be outdegrees of vertices.
  graph.vertices.forEach(function (vertex) {
    rank[vertex] = graph.neighbors(vertex).length;
  });

  if (graph.directed) {
    // rank = outdegree - indegree
    graph.vertices.forEach(function (vertex) {
      graph.neighbors(vertex).forEach(function (neighbor) {
        rank[neighbor] -= 1;
      });
    });
  }
  else {
    // Compute ranks from vertex degree parity values.
    var startChosen = false;
    graph.vertices.forEach(function (vertex) {
      rank[vertex] %= 2;
      if (rank[vertex]) {
        if (startChosen) {
          rank[vertex] = -1;
        }
        startChosen = true;
      }
    });
  }

  var start, finish, v;

  graph.vertices.forEach(function (vertex) {
    if (rank[vertex] === 1) {
      if (start) {
        throw new Error('Duplicate start vertex.');
      }
      start = vertex;
    } else if (rank[vertex] === -1) {
      if (finish) {
        throw new Error('Duplicate finish vertex.');
      }
      finish = vertex;
    } else if (rank[vertex]) {
      throw new Error('Unexpected vertex degree for ' + vertex);
    } else if (!v) {
      v = vertex;
    }
  });

  if (!start && !finish) {
    start = finish = v;
  }

  return {start: start,
          finish: finish};
};


/**
 * Compute Euler path (either walk or tour, depending on the graph).
 * Euler path is a trail in a graph which visits every edge exactly once.
 * The procedure works both for directed and undirected graphs,
 *   although the details differ a bit.
 * The resulting array consists of exactly |E|+1 vertices.
 *
 * @param {Graph}
 * @return Array
 */
var eulerPath = function (graph) {
  if (!graph.vertices.size) {
    return [];
  }

  var endpoints = eulerEndpoints(graph);
  var route = [endpoints.finish];

  var seen = new Graph(graph.directed);
  graph.vertices.forEach(seen.addVertex.bind(seen));

  depthFirstSearch(graph, endpoints.start, {
    allowTraversal: function (vertex, neighbor) {
      return !seen.edge(vertex, neighbor);
    },
    beforeTraversal: function (vertex, neighbor) {
      seen.addEdge(vertex, neighbor);
    },
    afterTraversal: function (vertex) {
      route.push(vertex);
    }
  });

  graph.vertices.forEach(function (vertex) {
    if (seen.neighbors(vertex).length < graph.neighbors(vertex).length) {
      throw new Error('There is no euler path for a disconnected graph.');
    }
  });
  return route.reverse();
};


module.exports = eulerPath;


/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



/**
 * Floyd-Warshall algorithm.
 * Compute all-pairs shortest paths (a path for each pair of vertices).
 * Complexity: O(V^3).
 *
 * @param {Graph} graph
 * @return {{distance, path}}
 */
var floydWarshall = function (graph) {

  // Fill in the distances with initial values:
  //   - 0 if source == destination;
  //   - edge(source, destination) if there is a direct edge;
  //   - +inf otherwise.
  var distance = Object.create(null);
  graph.vertices.forEach(function (src) {
    distance[src] = Object.create(null);
    graph.vertices.forEach(function (dest) {
      if (src === dest) {
        distance[src][dest] = 0;
      } else if (graph.edge(src, dest) !== undefined) {
        distance[src][dest] = graph.edge(src, dest);
      } else {
        distance[src][dest] = Infinity;
      }
    });
  });

  // Internal vertex with the largest index along the shortest path.
  // Needed for path reconstruction.
  var middleVertex = Object.create(null);
  graph.vertices.forEach(function (vertex) {
    middleVertex[vertex] = Object.create(null);
  });

  graph.vertices.forEach(function (middle) {
    graph.vertices.forEach(function (src) {
      graph.vertices.forEach(function (dest) {
        var dist = distance[src][middle] + distance[middle][dest];
        if (dist < distance[src][dest]) {
          distance[src][dest] = dist;
          middleVertex[src][dest] = middle;
        }
      });
    });
  });

  // Check for a negative-weighted cycle.
  graph.vertices.forEach(function (vertex) {
    if (distance[vertex][vertex] < 0) {
      // Negative-weighted cycle found.
      throw new Error('The graph contains a negative-weighted cycle!');
    }
  });

  /**
   * Reconstruct the shortest path for a given pair of end vertices.
   * Complexity: O(L), L - length of the path (number of edges).
   *
   * @param {string} srce
   * @param {string} dest
   * @return {?string[]} Null if destination is unreachable.
   */
  var path = function (src, dest) {
    if (!Number.isFinite(distance[src][dest])) {
      // dest unreachable.
      return null;
    }

    var path = [src];

    if (src !== dest) {
      (function pushInOrder(src, dest) {
        if (middleVertex[src][dest] === undefined) {
          path.push(dest);
        } else {
          var middle = middleVertex[src][dest];
          pushInOrder(src, middle);
          pushInOrder(middle, dest);
        }
      })(src, dest);
    }

    return path;
  };

  return {
    distance: distance,
    path: path
  };
};


module.exports = floydWarshall;


/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var DisjointSetForest = __webpack_require__(108),
    Graph = __webpack_require__(56);


/**
 * Kruskal's minimum spanning tree (forest) algorithm.
 * Complexity: O(E * log(V)).
 *
 * @param {Graph} graph - Undirected graph.
 * @return {Graph} Minimum spanning tree or forest
 *   (depending on whether input graph is connected itself).
 */
var kruskal = function (graph) {
  if (graph.directed) {
    throw new Error('Can\'t build MST of a directed graph.');
  }

  var connectedComponents = new DisjointSetForest();
  var mst = new Graph(false);
  graph.vertices.forEach(mst.addVertex.bind(mst));

  var edges = [];
  graph.vertices.forEach(function (vertex) {
    graph.neighbors(vertex).forEach(function (neighbor) {
      // Compared as strings, loops intentionally omitted.
      if (vertex < neighbor) {
        edges.push({
          ends: [vertex, neighbor],
          weight: graph.edge(vertex, neighbor)
        });
      }
    });
  });

  edges.sort(function (a, b) {
    return a.weight - b.weight;
  }).forEach(function (edge) {
    if (!connectedComponents.sameSubset(edge.ends[0], edge.ends[1])) {
      mst.addEdge(edge.ends[0], edge.ends[1], edge.weight);
      connectedComponents.merge(edge.ends[0], edge.ends[1]);
    }
  });

  return mst;
};


module.exports = kruskal;


/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var PriorityQueue = __webpack_require__(62),
    Graph = __webpack_require__(56);


/**
 * Prim's minimum spanning tree (forest) algorithm.
 * Complexity: O(E * log(V)).
 *
 * @param {Graph} graph - Undirected graph.
 * @return {Graph} Minimum spanning tree or forest
 *   (depending on whether input graph is connected itself).
 */
var prim = function (graph) {
  if (graph.directed) {
    throw new Error('Can\'t build MST of a directed graph.');
  }

  var mst = new Graph(false);
  var parent = Object.create(null);

  var q = new PriorityQueue();
  graph.vertices.forEach(function (vertex) {
    q.insert(vertex, Infinity);
  });

  var relax = function (vertex, neighbor) {
    var weight = graph.edge(vertex, neighbor);
    if (weight < q.priority(neighbor)) {
      q.changePriority(neighbor, weight);
      parent[neighbor] = vertex;
    }
  };

  while (!q.isEmpty()) {
    var top = q.extract(true);
    var vertex = top.item,
        weight = top.priority;

    if (parent[vertex]) {
      mst.addEdge(parent[vertex], vertex, weight);
    }
    else {
      mst.addVertex(vertex);
    }

    graph.neighbors(vertex).forEach(relax.bind(null, vertex));
  }

  return mst;
};


module.exports = prim;


/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Stack = __webpack_require__(111),
    depthFirstSearch = __webpack_require__(59);

/**
 * Sorts the edges of the DAG topologically
 *
 *  (node1) -> (node2) -> (node4)
 *     \-> (node3)^
 *
 * Meaning that:
 * - "node2" and "node3" depend on "node1"
 * - "node4" depend on node2
 * - "node2" depend on "node3"
 *
 * @param {Graph}
 * @return Stack
 */
var topologicalSort = function (graph) {
  var stack = new Stack();
  var firstHit = {};
  var time = 0;

  graph.vertices.forEach(function (node) {
    if (!firstHit[node]) {
      depthFirstSearch(graph, node, {
        allowTraversal: function (node, neighbor) {
          return !firstHit[neighbor];
        },
        enterVertex: function (node) {
          firstHit[node] = ++time;
        },
        leaveVertex: function (node) {
          stack.push(node);
        }
      });
    }
  });

  return stack;
};

module.exports = topologicalSort;


/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// cache algorithm results
var cache = {1: 1};

/**
 * Collatz Conjecture algorithm
 *
 * @param Number
 * @return Number
 */

function calculateCollatzConjecture(number) {
  if (number in cache) return cache[number];
  if (number % 2 === 0) return cache[number] = number >> 1;

  return cache[number] = number * 3 + 1;
}

/**
 * Generate Collatz Conjecture
 *
 * @param Number
 * @return Array
 */

function generateCollatzConjecture(number) {
  var collatzConjecture = [];

  do {
    number = calculateCollatzConjecture(number);
    collatzConjecture.push(number);
  } while (number !== 1);

  return collatzConjecture;
}

// export Collatz Conjecture methods
module.exports = {
  generate: generateCollatzConjecture,
  calculate: calculateCollatzConjecture,
};


/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Extended Euclidean algorithm to calculate the solve of
 *   ax + by = gcd(a, b)
 * gcd(a, b) is the greatest common divisor of integers a and b.
 *
 * @param Number
 * @param Number
 *
 * @return {Number, Number}
 */
var extEuclid = function (a, b) {
  var s = 0, oldS = 1;
  var t = 1, oldT = 0;
  var r = b, oldR = a;
  var quotient, temp;
  while (r !== 0) {
    quotient = Math.floor(oldR / r);

    temp = r;
    r = oldR - quotient * r;
    oldR = temp;

    temp = s;
    s = oldS - quotient * s;
    oldS = temp;

    temp = t;
    t = oldT - quotient * t;
    oldT = temp;
  }

  return {
    x: oldS,
    y: oldT
  };
};

module.exports = extEuclid;


/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Different implementations of the Fibonacci sequence
 */

var power = __webpack_require__(106);

/**
  * Regular fibonacci implementation following the definition:
  * Fib(0) = 0
  * Fib(1) = 1
  * Fib(n) = Fib(n-1) + Fib(n-2)
  *
  * @param Number
  * @return Number
  */
var fibExponential = function (n) {
  return n < 2 ? n : fibExponential(n - 1) + fibExponential(n - 2);
};

/**
  * O(n) in time, O(1) in space and doesn't use recursion
  *
  * @param Number
  * @return Number
  */
var fibLinear = function (n) {
  var fibNMinus2 = 0,
      fibNMinus1 = 1,
      fib = n;
  for (var i = 1; i < n; i++) {
    fib = fibNMinus1 + fibNMinus2;
    fibNMinus2 = fibNMinus1;
    fibNMinus1 = fib;
  }
  return fib;
};

/**
  * Implementation with memoization, O(n) in time, O(n) in space
  *
  * @param Number
  * @return Number
  */
var fibWithMemoization = (function () {
  var cache = [0, 1];

  var fib = function (n) {
    if (cache[n] === undefined) {
      cache[n] = fib(n - 1) + fib(n - 2);
    }
    return cache[n];
  };

  return fib;
})();

/**
  * Implementation using Binet's formula with the rounding trick.
  * O(1) in time, O(1) in space
  *
  * @param Number
  * @return Number
  */
var fibDirect = function (number) {
  var phi = (1 + Math.sqrt(5)) / 2;
  return Math.floor(Math.pow(phi, number) / Math.sqrt(5) + 0.5);
};

/**
  * Implementation based on matrix exponentiation.
  * O(log(n)) in time, O(1) in space
  *
  * @param Number
  * @return Number
  */
var fibLogarithmic = function (number) {
  // Transforms [f_1, f_0] to [f_2, f_1] and so on.
  var nextFib = [[1, 1], [1, 0]];

  var matrixMultiply = function (a, b) {
    return [[a[0][0] * b[0][0] + a[0][1] * b[1][0],
             a[0][0] * b[0][1] + a[0][1] * b[1][1]],
            [a[1][0] * b[0][0] + a[1][1] * b[1][0],
             a[1][0] * b[0][1] + a[1][1] * b[1][1]]];
  };

  var transform = power(nextFib, number, matrixMultiply, [[1, 0], [0, 1]]);

  // [f_n, f_{n-1}] = Transform * [f_0, f_{-1}] = Transform * [0, 1]
  // Hence the result is the first row of Transform multiplied by [0, 1],
  // which is the same as transform[0][1].
  return transform[0][1];
};

// Use fibLinear as the default implementation
fibLinear.exponential = fibExponential;
fibLinear.withMemoization = fibWithMemoization;
fibLinear.direct = fibDirect;
fibLinear.logarithmic = fibLogarithmic;
module.exports = fibLinear;


/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Fisher-Yates shuffles the elements in an array
 * in O(n)
 */
var fisherYates = function (a) {
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
};

module.exports = fisherYates;


/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Find the greatest difference between two numbers in a set
 * This solution has a cost of O(n)
 *
 * @param {number[]} numbers
 * @returns {number}
 */

var greatestDifference = function (numbers) {
  var index = 0;
  var largest = numbers[0];
  var length = numbers.length;
  var number;
  var smallest = numbers[0];

  for (index; index < length; index++) {
    number = numbers[index];

    if (number > largest) largest = number;
    if (number < smallest) smallest = number;
  }

  return largest - smallest;
};

module.exports = greatestDifference;


/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var gcd = __webpack_require__(107);

/**
 * Calcule the Least Common Multiple with a given Greatest Common Denominator
 * function
 *
 * @param Number
 * @param Number
 * @param Function
 *
 * @return Number
 */
var genericLCM = function (gcdFunction, a, b) {
   if (a === 0 || b === 0) {
    return 0;
  }
  a = Math.abs(a);
  b = Math.abs(b);
  return a / gcdFunction(a, b) * b;
};

/**
 * Algorithm to calculate Least Common Multiple based on Euclidean algorithm
 * calls the generic LCM function passing the division based GCD calculator
 *
 * @param Number
 * @param Number
 *
 * @return Number
 */
var lcmDivisionBased = genericLCM.bind(null, gcd);

/**
 * Algorithm to calculate Least Common Multiple based on Stein's Algorithm
 * calls the generic LCM function passing the binary interative GCD calculator
 *
 * @param Number
 * @param Number
 *
 * @return Number
 */
var lcmBinaryIterative = genericLCM.bind(null, gcd.binary);

var lcm = lcmDivisionBased;
lcm.binary = lcmBinaryIterative;
module.exports = lcm;


/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Newton's method to calculate square root
 *
 * @param Number n - the number which the square root should be calculated
 * @param Number tolerance - The error margin accepted (Default 1e-7)
 * @param Number maxIterations - The max number of iterations (Default 1e7)
 */
var sqrt = function (n, tolerance, maxIterations) {
  tolerance = tolerance || 1e-7;
  maxIterations = maxIterations || 1e7;

  var upperBound = n;
  var lowerBound = 0;

  var i = 0;
  var square, x;
  do {
    i++;
    x = (upperBound - lowerBound) / 2 + lowerBound;
    square = x * x;
    if (square < n) lowerBound = x;
    else upperBound = x;
  } while (Math.abs(square - n) > tolerance && i < maxIterations);

  // Checks if the number is a perfect square to return the exact root
  var roundX = Math.round(x);
  if (roundX * roundX === n) x = roundX;

  return x;
};

module.exports = sqrt;


/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Comparator = __webpack_require__(9);


/**
 * Narayana's algorithm computes the subsequent permutation
 *   in lexicographical order.
 * Complexity: O(n).
 *
 * @param {Array} array
 * @param {function} [compareFn] - Custom compare function.
 * @return {boolean} Boolean flag indicating whether the algorithm succeeded,
 *   true unless the input permutation is lexicographically the last one.
 */
var nextPermutation = function (array, compareFn) {
  if (!array.length) {
    return false;
  }
  var cmp = new Comparator(compareFn);

  // Find pivot and successor indices.
  var pivot = array.length - 1;
  while (pivot && cmp.greaterThanOrEqual(array[pivot - 1], array[pivot])) {
    pivot -= 1;
  }
  if (!pivot) {
    // Permutation is sorted in descending order.
    return false;
  }
  var pivotValue = array[--pivot];
  var successor = array.length - 1;
  while (cmp.lessThanOrEqual(array[successor], pivotValue)) {
    successor -= 1;
  }

  // Swap values.
  array[pivot] = array[successor];
  array[successor] = pivotValue;

  // Reverse the descending part.
  for (var left = pivot, right = array.length; ++left < --right;) {
    var temp = array[left];
    array[left] = array[right];
    array[right] = temp;
  }
  return true;
};


module.exports = nextPermutation;


/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Iterative and recursive implementations of power set
 */



/**
 * Iterative power set calculation
 */
var powerSetIterative = function (array) {

  if (array.length === 0) {
    return [];
  }

  var powerSet = [];
  var cache = [];
  var i;

  for (i = 0; i < array.length; i++) {
    cache[i] = true;
  }

  for (i = 0; i < Math.pow(2, array.length); i++) {

    powerSet.push([]);

    for (var j = 0; j < array.length; j++) {

      if (i % Math.pow(2, j) === 0) {
        cache[j] = !cache[j];
      }

      if (cache[j]) {
        powerSet[i].push(array[j]);
      }

    }
  }

  return powerSet;
};

/**
 * Recursive power set calculation
 */
var powerSetRecursive = function (array) {
  if (array.length === 0) {
    return [];
  } else if (array.length === 1) {
    return [ [], [ array[0] ] ];
  } else {
    var powerSet = [];
    var firstElem = array[0];

    array.splice(0, 1);

    powerSetRecursive(array).forEach(function (elem) {
      powerSet.push(elem);
      var withFirstElem = [ firstElem ];
      withFirstElem.push.apply(withFirstElem, elem);
      powerSet.push(withFirstElem);
    });

    return powerSet;
  }
};

// Use powerSetIterative as the default implementation
var powerSet = powerSetIterative;
powerSet.recursive = powerSetRecursive;
module.exports = powerSet;


/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
* Checks whether a number is prime using a given primality test
*
* @param Function
* @param Number
*
* @return Boolean
*/
var genericPrimalityTest = function (primalityTest, n) {
  if (n <= 1) {
    return false;
  }
  return primalityTest(n);
};

/**
* Checks whether a number is prime using the naive algorithm O(n)
*
* @param Number
*
* @return Boolean
*/
var naiveTest = function (n) {
  for (var i = 2; i < n; ++i) {
    if (n % i === 0) {
      return false;
    }
  }
  return true;
};

/**
* Checks whether a number is prime using the trial divison algorithm O(sqrt(n))
*
* @param Number
*
* @return Boolean
*/
var trialDivisionTest = function (n) {
  var sqrt = Math.sqrt(n);
  for (var i = 2; i <= sqrt; ++i) {
    if (n % i === 0) {
      return false;
    }
  }
  return true;
};

module.exports = {
  naiveTest: genericPrimalityTest.bind(null, naiveTest),
  trialDivisionTest: genericPrimalityTest.bind(null, trialDivisionTest)
};


/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



/**
 * Sample random elements from the array using reservoir algorithm.
 *
 * @param {Array} array
 * @param {number} sampleSize
 * @return {Array}
 */
var reservoirSampling = function (array, sampleSize) {
  if (sampleSize > array.length) {
    throw new Error('Sample size exceeds the total number of elements.');
  }
  var reservoir = array.slice(0, sampleSize);
  for (var i = sampleSize; i < array.length; ++i) {
    var j = Math.floor(Math.random() * (i + 1));
    if (j < sampleSize) {
      reservoir[j] = array[i];
    }
  }
  return reservoir;
};


module.exports = reservoirSampling;


/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Calculate Shannon Entropy of an array
 *
 * @param {Array} arr - An array of values.
 * @return Number
 */
var shannonEntropy = function (arr) {
  // find the frequency of each value
  var freqs = arr.reduce(function (acc, item) {
    acc[item] = acc[item] + 1 || 1;
    return acc;
  }, {});

  // find the probability of each value
  var probs = Object.keys(freqs).map(function (key) {
    return freqs[key] / arr.length;
  });

  // calulate the shannon entropy of the array
  return probs.reduce(function (e, p) {
    return e - p * Math.log(p);
  }, 0) * Math.LOG2E;
};

module.exports = shannonEntropy;


/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Queue = __webpack_require__(57);

/**
 * Breadth-first search for binary trees
 */
var bfs = function (root, callback) {
  var q = new Queue();
  q.push(root);
  var node;
  while (!q.isEmpty()) {
    node = q.pop();
    callback(node.value);
    if (node.left) q.push(node.left);
    if (node.right) q.push(node.right);
  }
};

module.exports = bfs;


/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
  * Binary Search finds elements in sorted arrays in logarithmic
  * time (O(lg n))
  *
  * @param Array
  * @param Number|String
  *
  * @return Boolean
  */
var binarySearch = function (sortedArray, element) {
  var init = 0,
      end = sortedArray.length - 1;

  while (end >= init) {
    var m = ((end - init) >> 1) + init;
    if (sortedArray[m] === element) return m;

    if (sortedArray[m] < element) init = m + 1;
    else end = m - 1;
  }

  return -1;
};

module.exports = binarySearch;


/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Depth first search for trees
 * (in order)
 */
var inOrder = function (node, callback) {
  if (node) {
    inOrder(node.left, callback);
    callback(node.value);
    inOrder(node.right, callback);
  }
};

/**
 * Pre order
 */
var preOrder = function (node, callback) {
  if (node) {
    callback(node.value);
    preOrder(node.left, callback);
    preOrder(node.right, callback);
  }
};

/**
 * Post order
 */
var postOrder = function (node, callback) {
  if (node) {
    postOrder(node.left, callback);
    postOrder(node.right, callback);
    callback(node.value);
  }
};

// Set inOrder as the default implementation
inOrder.preOrder = preOrder;
inOrder.postOrder = postOrder;
module.exports = inOrder;


/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
  *  Finds the maximum of unimodal function fn() within [left, right]
  *  To find the minimum, revert the if/else statement or revert the comparison.
  *  Time complexity: O(log(n))
  */

var ternarySearch = function (fn, left, right, precision) {
  while (Math.abs(right - left) > precision) {
    var leftThird = left + (right - left) / 3,
        rightThird = right - (right - left) / 3;

    if (fn(leftThird) < fn(rightThird))
      left = leftThird; else
      right = rightThird;
  }
  return (left + right) / 2;
};

module.exports = ternarySearch;


/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Comparator = __webpack_require__(9);

/**
 * Bubble sort algorithm O(n^2)
 */
var bubbleSort = function (a, comparatorFn) {
  var comparator = new Comparator(comparatorFn);
  var n = a.length;
  var bound = n - 1;
  var check = false;
  for (var i = 0; i < n - 1; i++) {
    var newbound = 0;
    for (var j = 0; j < bound; j++) {
      if (comparator.greaterThan(a[j], a[j + 1])) {
        var tmp = a[j];
        a[j] = a[j + 1];
        a[j + 1] = tmp;
        newbound = j;
        check = true;
      }
    }
    if (!check)
      return a;
    bound = newbound;
  }
  return a;
};

module.exports = bubbleSort;


/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Sorts an array of objects according to their 'key' property
 * Every object inside the array MUST have the 'key' property with
 * a integer value.
 *
 * Execution Time: (3 * array.length - 1)
 * Asymptotic Complexity: O(array.length + maximumKey)
 *
 * @param Array
 * @return Array
 */
var countingSort = function (array) {
  var max = maximumKey(array);
  var auxiliaryArray = [];
  var length = array.length;
  var i;

  for (i = 0; i < length; i++) {
    var position = array[i].key;

    if (auxiliaryArray[position] === undefined) {
      auxiliaryArray[position] = [];
    }

    auxiliaryArray[position].push(array[i]);
  }

  array = [];
  var pointer = 0;

  for (i = 0; i <= max; i++) {
    if (auxiliaryArray[i] !== undefined) {
      var localLength = auxiliaryArray[i].length;

      for (var j = 0; j < localLength; j++) {
        array[pointer++] = auxiliaryArray[i][j];
      }
    }
  }

  return array;
};

/**
 * Finds the maximum key from an array of objects
 *
 * Asymptotic Complexity: O(array.length)
 *
 * @param Array
 * @return Integer
 */
var maximumKey = function (array) {
  var max = array[0].key;
  var length = array.length;

  for (var i = 1; i < length; i++) {
    if (array[i].key > max) {
      max = array[i].key;
    }
  }

  return max;
};

module.exports = countingSort;


/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var MinHeap = __webpack_require__(60).MinHeap;

/**
 * Heap sort first creates a valid heap data structure. Next it
 * iteratively removes the smallest element of the heap until it's
 * empty. The time complexity of the algorithm is O(n.lg n)
 */
var heapsort = function (array, comparatorFn) {

  var minHeap = new MinHeap(comparatorFn);
  minHeap.heapify(array);

  var result = [];
  while (!minHeap.isEmpty())
    result.push(minHeap.extract());

  return result;
};

module.exports = heapsort;


/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Comparator = __webpack_require__(9);

/**
 * Insertion sort algorithm O(n + d)
 */
var insertionSort = function (vector, comparatorFn) {
  var comparator = new Comparator(comparatorFn);

  for (var i = 1, len = vector.length; i < len; i++) {
    var aux = vector[i],
      j = i;

    while (j > 0 && comparator.lessThan(aux, vector[j - 1])) {
      vector[j] = vector[j - 1];
      j--;
    }

    vector[j] = aux;
  }

  return vector;
};

module.exports = insertionSort;


/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Comparator = __webpack_require__(9);

/**
 * Merge sort
 * O(n.lgn)
 */
var mergeSortInit = function (a, compareFn) {
  var comparator = new Comparator(compareFn);

  return (function mergeSort(a) {
    if (a.length > 1) {
      var middle = a.length >> 1;
      var left = mergeSort(a.slice(0, middle));
      var right = mergeSort(a.slice(middle));
      a = merge(left, right, comparator);
    }

    return a;
  })(a);
};

var merge = function (a, b, comparator) {
  var i = 0,
      j = 0,
      result = [];

  while (i < a.length && j < b.length) {
    result.push(comparator.lessThan(a[i], b[j]) ? a[i++] : b[j++]);
  }

  // Concats the elements from the sub-array
  // that has not been included yet
  return result.concat((i < a.length ? a.slice(i) : b.slice(j)));
};

module.exports = mergeSortInit;


/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Comparator = __webpack_require__(9);

/**
 * Quicksort recursively sorts parts of the array in
 * O(n.lg n)
 */
var quicksortInit = function (array, comparatorFn) {

  var comparator = new Comparator(comparatorFn);

  return (function quicksort(array, lo, hi) {
    while (lo < hi) {
      var p = partition(array, comparator, lo, hi);
      //Chooses only the smallest partition to use recursion on and
      //tail-optimize the other. This guarantees O(log n) space in worst case.
      if (p - lo < hi - p) {
        quicksort(array, lo, p - 1);
        lo = p + 1;
      } else {
        quicksort(array, p + 1, hi);
        hi = p - 1;
      }
    }

    return array;
  })(array, 0, array.length - 1);
};

/**
 * Chooses a pivot and makes every element that is
 * lower than the pivot move to its left, and every
 * greater element moves to its right
 *
 * @return Number the positon of the pivot
 */
var partition = function (a, comparator, lo, hi) {
  // pick a random element, swap with the rightmost and
  // use it as pivot
  swap(a, Math.floor(Math.random() * (hi - lo)) + lo, hi);
  var pivot = hi;

  // dividerPosition keeps track of the position
  // where the pivot should be inserted
  var dividerPosition = lo;

  for (var i = lo; i < hi; i++) {
    if (comparator.lessThan(a[i], a[pivot])) {
      swap(a, i, dividerPosition);
      dividerPosition++;
    }
  }
  swap(a, dividerPosition, pivot);
  return dividerPosition;
};

/**
 * Swaps two elements in the array
 */
var swap = function (array, x, y) {
  var tmp = array[y];
  array[y] = array[x];
  array[x] = tmp;
};

module.exports = quicksortInit;


/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Sorts an array of objects according to their 'key' property
 * Every object inside the array MUST have the 'key' property with
 * a integer value.
 *
 * Asymptotic Complexity: O(array.length * d), where 'd' represents
 * the amount of digits in the larger key of the array
 *
 * @param Array
 * @return Array
 */
var radixSort = function (array) {
  var max = maximumKey(array);
  var digitsMax = (max === 0 ? 1 :
    1 + Math.floor(Math.log(max) / Math.log(10))); // log base 10

  for (var i = 0; i < digitsMax; i++) {
    array = auxiliaryCountingSort(array, i);
  }

  return array;
};

/**
 * Auxiliary sorting method for RadixSort
 * Sorts an array of objects according to only one digit of
 * their 'key' property. The digit to be sorted is determined
 * by the 'mod' variable
 * Every object inside the array MUST have the 'key' property with
 * a integer value.
 *
 * Execution Time: (2 * array.length + 10)
 * Asymptotic Complexity: O(array.length)
 *
 * @param Array
 * @return Array
 */
var auxiliaryCountingSort = function (array, mod) {
  var length = array.length;
  var bucket = [];
  var i;

  for (i = 0; i < 10; i++) {
    bucket[i] = [];
  }

  for (i = 0; i < length; i++) {
    var digit = parseInt((array[i].key / Math.pow(10, mod)).toFixed(mod)) % 10;
    bucket[digit].push(array[i]);
  }

  var pointer = 0;

  for (i = 0; i < 10; i++) {
    var localLength = bucket[i].length;

    for (var j = 0; j < localLength; j++) {
      array[pointer++] = bucket[i][j];
    }
  }

  return array;
};

/**
 * Finds the maximum key from an array of objects
 *
 * Asymptotic Complexity: O(array.length)
 *
 * @param Array
 * @return Integer if array non-empty
 *         Undefined otherwise
 */
var maximumKey = function (a) {
  var max;
  for (var i = 1; i < a.length; i++) {
    if (max === undefined || a[i].key > max) {
      max = a[i].key;
    }
  }
  return max;
};

module.exports = radixSort;


/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Comparator = __webpack_require__(9);
/**
 * Selection sort algorithm O(n^2)
 */
var selectionSort = function (a, comparatorFn) {
  var comparator = new Comparator(comparatorFn);
  var n = a.length;
  for (var i = 0; i < n - 1; i++) {
    var min = i;
    for (var j = i + 1; j < n; j++) {
      if (comparator.greaterThan(a[min], a[j])) {
        min = j;
      }
    }
    if (min !== i) {
      var tmp = a[i];
      a[i] = a[min];
      a[min] = tmp;
    }
  }

  return a;
};

module.exports = selectionSort;


/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Comparator = __webpack_require__(9);
/**
 * shell sort  worst:O(n lg n)  best:O(n)
 */
var shellSort = function (array, comparatorFn) {
  var comparator = new Comparator(comparatorFn),
    begin = 0,
    end = array.length - 1,
    gap = parseInt((end - begin + 1) / 2),
    i = 0, j = 0, temp = 0;

  while (gap >= 1) {
    for (i = begin + gap;i <= end;i += 1) {
      temp = array[i];
      j = i - gap;
      while (j >= begin && comparator.greaterThan(array[j], temp)) {
        array[j + gap] = array[j];
        j = j - gap;
      }
      array[j + gap] = temp;
    }
    gap = parseInt(gap / 2);
  }

  return array;
};

module.exports = shellSort;


/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Comparator = __webpack_require__(9);

/**
 * short bubble sort algorithm
 * worst: O(n^2) best: O(n)
 */

function shortBubbleSort(array, comparatorFn) {
  var comparator = new Comparator(comparatorFn);
  var length = array.length - 1;
  var i = 0;

  for (i; i < length; i++) {
    var current = array[i];
    var next = array[i+1];

    /**
     * If the current value if greater than the next:
     * - set current value to next value;
     * - and set next value to current value;
     * - then reset iterator counter to rescan for values to be sorted.
     */

    if (comparator.greaterThan(current, next)) {
      array[i+1] = current;
      array[i] = next;
      i = -1;
    }
  }

  return array;
}

module.exports = shortBubbleSort;


/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 *
 * "Hamming distance between two strings of equal length is the number of
 * positions at which the corresponding symbols are different. In another way,
 * it measures the minimum number of substitutions required to change one string
 * into the other." - https://en.wikipedia.org/wiki/Hamming_distance
 *
 */


var hamming = function (a, b) {
  if (a.length !== b.length) {
    throw new Error('Strings must be equal in length');
  }

  var dist = 0;

  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      dist++;
    }
  }

  return dist;
};

module.exports = hamming;


/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



var huffman = {};


/**
 * Maximum block size used by functions "compress", "decompress".
 *
 * @const
 */
var MAX_BLOCK_SIZE = (-1 >>> 0).toString(2).length;


/**
 * Compress 0-1 string to int32 array.
 *
 * @param {string} string
 * @return {number[]}
 */
var compress = function (string) {
  var blocks = [];
  var currentBlock = 0, currentBlockSize = 0;

  string.split('').forEach(function (char) {
    currentBlock = (currentBlock << 1) | char;
    currentBlockSize += 1;

    if (currentBlockSize === MAX_BLOCK_SIZE) {
      blocks.push(currentBlock);
      currentBlock = currentBlockSize = 0;
    }
  });

  // Append last block size to the end.
  if (currentBlockSize) {
    blocks.push(currentBlock, currentBlockSize);
  }
  else {
    blocks.push(MAX_BLOCK_SIZE);
  }

  return blocks;
};


/**
 * Decompress int32 array back to 0-1 string.
 *
 * @param {number[]} array
 * @return {string}
 */
var decompress = function (array) {
  if (!array.length) {
    return '';
  }
  else if (array.length === 1) {
    throw new Error('Compressed array must be either empty ' +
                    'or at least 2 blocks big.');
  }

  var padding = new Array(MAX_BLOCK_SIZE + 1).join(0);

  var string = array.slice(0, -2).map(function (block) {
    return (padding + (block >>> 0).toString(2)).slice(-padding.length);
  }).join('');

  // Append the last block.
  var lastBlockSize = array.slice(-1)[0];
  var lastBlock = array.slice(-2)[0];
  string += (padding + (lastBlock >>> 0).toString(2)).slice(-lastBlockSize);

  return string;
};


/**
 * Apply Huffman encoding to a string.
 *
 * @param {string} string
 * @param {boolean} [compressed=false] - Whether compress the string to bits.
 * @return {{encoding: Object.<string, string>, value: string|number[]}}
 */
huffman.encode = function (string, compressed) {
  if (!string.length) {
    return {
      encoding: {},
      value: (compressed ? [] : '')
    };
  }

  var counter = {};
  string.split('').forEach(function (char) {
    counter[char] = (counter[char] || 0) + 1;
  });

  var letters = Object.keys(counter).map(function (char) {
    return {
      char: char,
      count: counter[char]
    };
  });

  var compare = function (a, b) {
    return a.count - b.count;
  };
  var less = function (a, b) {
    return a && (b && (a.count < b.count) || !b);
  };

  letters.sort(compare);

  // Each time two least letters are merged into one, the result is pushing into
  // this buffer. Since the letters are pushing in ascending order of frequency,
  // no more sorting is ever required.
  var buffer = [];
  var lettersIndex = 0, bufferIndex = 0;

  var extractMinimum = function () {
    return less(letters[lettersIndex], buffer[bufferIndex]) ?
      letters[lettersIndex++] : buffer[bufferIndex++];
  };

  for (var numLetters = letters.length; numLetters > 1; --numLetters) {
    var a = extractMinimum(), b = extractMinimum();
    a.code = '0';
    b.code = '1';
    var union = {
      count: a.count + b.count,
      parts: [a, b]
    };
    buffer.push(union);
  }

  // At this point there is a single letter left.
  var root = extractMinimum();
  root.code = (letters.length > 1) ? '' : '0';

  // Unroll the code recursively in reverse.
  (function unroll(parent) {
    if (parent.parts) {
      var a = parent.parts[0], b = parent.parts[1];
      a.code += parent.code;
      b.code += parent.code;
      unroll(a);
      unroll(b);
    }
  })(root);

  var encoding = letters.reduce(function (acc, letter) {
    acc[letter.char] = letter.code.split('').reverse().join('');
    return acc;
  }, {});

  // Finally, apply the encoding to the given string.
  var result = string.split('').map(function (char) {
    return encoding[char];
  }).join('');

  return {
    encoding: encoding,
    value: (compressed ? compress(result) : result)
  };
};


/**
 * Decode a Huffman-encoded string or compressed number sequence.
 *
 * @param {Object.<string, string>} encoding - Maps characters to 0-1 sequences.
 * @param {string|number[]} encodedString
 * @return {string} Decoded string.
 */
huffman.decode = function (encoding, encodedString) {
  if (Array.isArray(encodedString)) {
    encodedString = decompress(encodedString);
  }

  // We can make use of the fact that encoding mapping is always one-to-one
  // and rely on the power of JS hashes instead of building hand-made FSMs.
  var letterByCode = Object.keys(encoding).reduce(function (acc, letter) {
    acc[encoding[letter]] = letter;
    return acc;
  }, {});

  var decodedLetters = [];

  var unresolved = encodedString.split('').reduce(function (code, char) {
    code += char;
    var letter = letterByCode[code];
    if (letter) {
      decodedLetters.push(letter);
      code = '';
    }
    return code;
  }, '');

  if (unresolved) {
    throw new Error('Invalid string to decode.');
  }

  return decodedLetters.join('');
};


module.exports = huffman;


/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * String Matching algorithm
 * Tries to match the given pattern inside the given text
 * If the pattern exists inside the text, it will be returned
 * the index of the begining of the pattern in the text,
 * otherwise it will be returned the length of the text
 *
 * Asymptotic Complexity: O(text.length)
 *
 * @param {Array} text of Numbers, Strings or Characters
 *     or {String}
 * @param {Array} pattern of Numbers, Strings or Characters
 *     or {String}
 * @return {Number}
 */
var knuthMorrisPratt = function (text, pattern) {
  var textLength = text.length;
  var patternLength = pattern.length;
  var m = 0;
  var i = 0;
  var table = buildTable(pattern);

  while (m + i < textLength) {
    if (pattern[i] === text[m + i]) {
      if (i === patternLength - 1) {
        return m;
      }
      ++i;
    }
    else {
      if (table[i] >= 0) {
        i = table[i];
        m = m + i - table[i];
      }
      else {
        i = 0;
        ++m;
      }
    }
  }

  return textLength;
};

/**
 * Builds the dinamic table of the given pattern
 * to record how the pattern can match it self
 *
 * Asymptotic Complexity: O(pattern.length)
 *
 * @param {Array} pattern of Numbers, Strings or Characters
 *     or {String}
 * @return {Array} of Integers
 */
var buildTable = function (pattern) {
  var length = pattern.length;
  var table = [];
  var position = 2;
  var cnd = 0;

  table[0] = -1;
  table[1] = 0;

  while (position < length) {
    if (pattern[position - 1] === pattern[cnd]) {
      ++cnd;
      table[position] = cnd;
      ++position;
    }
    else if (cnd > 0) {
      cnd = table[cnd];
    }
    else {
      table[position] = 0;
      ++position;
    }
  }

  return table;
};

module.exports = knuthMorrisPratt;


/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Calculates the edit distance between two strings
 * considering the same cost of 1 to every operation
 * (addition, deletion, substitution)
 *
 * It uses dynamic programing and creates a matrix
 * where every cell [i,j] represents the distance between
 * the substrings a[0..i] and b[0..j]
 *
 * O(a.length * b.length)
 *
 * @param String
 * @param String
 * @return Number
 */
var levenshtein = function (a, b) {
  var editDistance = [];
  var i, j;

  // Initialize the edit distance matrix. The first collumn contains
  // the values comparing the string a to an empty string b
  for (i = 0; i <= a.length; i++) {
    editDistance[i] = [];
    editDistance[i][0] = i;
  }

  // And the first line the values comparint the string b to an empty string a
  for (j = 0; j <= b.length; j++) {
    editDistance[0][j] = j;
  }
  for (i = 1; i <= a.length; i++) {
    for (j = 1; j <= b.length; j++) {
      // Finds the minimum cost for keeping the two strings equal
      editDistance[i][j] =
        Math.min(
          editDistance[i - 1][j - 1], // if we replace a[i] by b[j]
          editDistance[i - 1][j], // if we delete the char from a
          editDistance[i][j - 1] // if we add the char from b
        ) +
        (a[i - 1] !== b[j - 1] ? 1 : 0);
    }
  }

  return editDistance[a.length][b.length];
};

module.exports = levenshtein;


/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Implementation of longest common subsequence
 */



/**
 * Implementation via dynamic programming
 */
var longestCommonSubsequence = function (s1, s2) {
  // Multidimensional array for dynamic programming algorithm
  var cache = new Array(s1.length + 1);

  var i, j;

  for (i = 0; i <= s1.length; i++) {
    cache[i] = new Int32Array(s2.length + 1);
  }

  // Fill in the cache
  for (i = 1; i <= s1.length; i++) {
    for (j = 1; j <= s2.length; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        cache[i][j] = cache[i - 1][j - 1] + 1;
      } else {
        cache[i][j] = Math.max(cache[i][j - 1], cache[i - 1][j]);
      }
    }
  }

  // Build LCS from cache
  i = s1.length;
  j = s2.length;
  var lcs = '';

  while (cache[i][j] !== 0) {
    if (s1[i - 1] === s2[j - 1]) {
      lcs = s1[i - 1] + lcs;
      i--;
      j--;
    } else if (cache[i - 1][j] > cache[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return lcs;
};

module.exports = longestCommonSubsequence;


/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Implementation of longest common substring
 */



/**
 * Implementation via dynamic programming
 */
var longestCommonSubstring = function (s1, s2) {
  // Multidimensional array for dynamic programming algorithm
  var cache = new Array(s1.length + 1);

  var i, j;

  for (i = 0; i <= s1.length + 1; i++) {
    cache[i] = new Int32Array(s2.length + 1);
  }

  var lcsPosition = {};
  var lcsLength = 0;

  // Fill in the cache
  for (i = 1; i <= s1.length; i++) {
    for (j = 1; j <= s2.length; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        cache[i][j] = cache[i - 1][j - 1] + 1;
        if (cache[i][j] > lcsLength) {
          lcsPosition.i = i;
          lcsPosition.j = j;
          lcsLength = cache[i][j];
        }
      } else {
        cache[i][j] = 0;
      }
    }
  }

  var lcs = '';
  if (lcsLength) {
    lcs = s1.substring(lcsPosition.i - lcsLength, lcsPosition.i);
  }

  return lcs;
};

module.exports = longestCommonSubstring;


/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A prime number used to create
 * the hash representation of a word
 *
 * Bigger the prime number,
 * bigger the hash value
 */
var base = 997;

/**
 * Calculates String Matching between two Strings
 * Returns true if String 'b' is contained in String 'a'
 *
 * Average and Best Case Complexity: O(a.length + b.length)
 * Worst Case Complexity: O(a.length * b.length)
 *
 * @param String
 * @param String
 * @return Integer
 */
var rabinKarp = function (s, pattern) {
  if (pattern.length === 0) return 0;

  var hashPattern = hash(pattern);
  var currentSubstring = s.substring(0, pattern.length);
  var hashCurrentSubstring;

  for (var i = pattern.length; i <= s.length; i++) {
    if (hashCurrentSubstring === undefined) {
      hashCurrentSubstring = hash(currentSubstring);
    } else {
      /*
       * Re-hash
       * Recalculates the hash representation of a word so that it isn't
       * necessary to traverse the whole word again
       */
      hashCurrentSubstring -= currentSubstring.charCodeAt(0) *
        Math.pow(base, pattern.length - 1);
      hashCurrentSubstring *= base;
      hashCurrentSubstring += s.charCodeAt(i);

      currentSubstring = currentSubstring.substring(1) + s[i];
    }

    if (hashPattern === hashCurrentSubstring &&
        pattern === currentSubstring) {
      // Hack for the off-by-one when matching in the beginning of the string
      return i === pattern.length ? 0 : i - pattern.length + 1;
    }
  }

  return -1;
};

/**
 * Creates the hash representation of 'word'
 *
 * @param String
 * @return Number
 */
var hash = function (word) {
  var h = 0;

  for (var i = 0; i < word.length; i++) {
    h += word.charCodeAt(i) * Math.pow(base, word.length - i - 1);
  }

  return h;
};

module.exports = rabinKarp;


/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Data Structures
module.exports = {
  AVLTree: __webpack_require__(181),
  BST: __webpack_require__(182),
  Treap: __webpack_require__(184),
  Graph: __webpack_require__(56),
  HashTable: __webpack_require__(109),
  Heap: __webpack_require__(60),
  LinkedList: __webpack_require__(61),
  PriorityQueue: __webpack_require__(62),
  Queue: __webpack_require__(57),
  Stack: __webpack_require__(111),
  Set: __webpack_require__(110),
  DisjointSetForest: __webpack_require__(108),
  FenwickTree: __webpack_require__(183)
};


/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * AVL Tree
 */
function AVLTree() {
  this.root = null;
}

/**
 * Tree node
 */
function Node(value, left, right, parent, height) {
  this.value = value;
  this.left = left;
  this.right = right;
  this.parent = parent;
  this.height = height;
}

/**
 * Calculates the height of a node based on height
 * property of all his children.
 */
AVLTree.prototype.getNodeHeight = function (node) {
  var height = 1;
  if (node.left !== null && node.right !== null) {
    height = Math.max(node.left.height, node.right.height) + 1;
  } else if (node.left !== null) {
    height = node.left.height + 1;
  } else if (node.right !== null) {
    height = node.right.height + 1;
  }
  return height;
};

/**
 * Verifies if the given node is balanced.
 */
AVLTree.prototype.isNodeBalanced = function (node) {
  var isBalanced = true;

  if (node.left !== null && node.right !== null) {
    isBalanced = (Math.abs(node.left.height - node.right.height) <= 1);
  } else if (node.right !== null && node.left === null) {
    isBalanced = node.right.height < 2;
  } else if (node.left !== null && node.right === null) {
    isBalanced = node.left.height < 2;
  }
  return isBalanced;
};

/**
 * When a removal happens, some nodes need to be
 * restructured. Gets and return these nodes.
 */
AVLTree.prototype.getNodesToRestructureAfterRemove = function (traveledNodes) {
  // z is last traveled node - imbalance found at z
  var zIndex = traveledNodes.length - 1;
  var z = traveledNodes[zIndex];

  // y should be child of z with larger height
  // (cannot be ancestor of removed node)
  var y;
  if (z.left !== null && z.right !== null) {
    y = (z.left === y) ? z.right : z.left;
  } else if (z.left !== null && z.right === null) {
    y = z.left;
  } else if (z.right !== null && z.left === null) {
    y = z.right;
  }

  // x should be tallest child of y
  // If children same height, x should be child of y
  // that has same orientation as z to y
  var x;
  if (y.left !== null && y.right !== null) {
    if (y.left.height > y.right.height) {
      x = y.left;
    } else if (y.left.height < y.right.height) {
      x = y.right;
    } else if (y.left.height === y.right.height) {
      x = (z.left === y) ? y.left : y.right;
    }
  } else if (y.left !== null && y.right === null) {
    x = y.left;
  } else if (y.right !== null && y.left === null) {
    x = y.right;
  }
  return [x, y, z];
};

/**
 * When a insertion happens, some nodes need to be
 * restructured. Gets and return these nodes.
 */
AVLTree.prototype.getNodesToRestructureAfterInsert = function (traveledNodes) {
  // z is last traveled node - imbalance found at z
  var zIndex = traveledNodes.length - 1;
  var z = traveledNodes[zIndex];

  // y should be child of z with larger height
  // (must be ancestor of inserted node)
  // therefore, last traveled node is correct.
  var yIndex = traveledNodes.length - 2;
  var y = traveledNodes[yIndex];

  // x should be tallest child of y
  // If children same height, x should be ancestor
  // of inserted node (in traveled path)
  var x;
  if (y.left !== null && y.right !== null) {
    if (y.left.height > y.right.height) {
      x = y.left;
    } else if (y.left.height < y.right.height) {
      x = y.right;
    } else if (y.left.height === y.right.height) {
      var xIndex = traveledNodes.length - 3;
      x = traveledNodes[xIndex];
    }
  } else if (y.left !== null && y.right === null) {
    x = y.left;
  } else if (y.right !== null && y.left === null) {
    x = y.right;
  }
  return [x, y, z];
};

/**
 * Keep the height balance property by walking to
 * root and checking for invalid heights.
 */
AVLTree.prototype.keepHeightBalance = function (node, afterRemove) {
  var current = node;
  var traveledNodes = [];
  while (current !== null) {
    traveledNodes.push(current);
    current.height = this.getNodeHeight(current);
    if (!this.isNodeBalanced(current)) {
      var nodesToBeRestructured = (afterRemove) ?
        this.getNodesToRestructureAfterRemove(traveledNodes) :
        this.getNodesToRestructureAfterInsert(traveledNodes);
      this.restructure(nodesToBeRestructured);
    }
    current = current.parent;
  }
};

/**
 * Identifies and calls the appropriate pattern
 * rotator.
 */
AVLTree.prototype.restructure = function (nodesToRestructure) {
  var x = nodesToRestructure[0];
  var y = nodesToRestructure[1];
  var z = nodesToRestructure[2];

  // Determine Rotation Pattern
  if (z.right === y && y.right === x) {
    this.rightRight(x, y, z);
  } else if (z.left === y && y.left === x) {
    this.leftLeft(x, y, z);
  } else if (z.right === y && y.left === x) {
    this.rightLeft(x, y, z);
  } else if (z.left === y && y.right === x) {
    this.leftRight(x, y, z);
  }
};

/**
 * Right-right rotation pattern.
 */
AVLTree.prototype.rightRight = function (x, y, z) {
  // pass z parent to y and move y's left to z's right
  if (z.parent !== null) {
    var orientation = (z.parent.left === z) ? 'left' : 'right';
    z.parent[orientation] = y;
    y.parent = z.parent;
  } else {
    this.root = y;
    y.parent = null;
  }

  // z adopts y's left.
  z.right = y.left;
  if (z.right !== null) {
    z.right.parent = z;
  }
  // y adopts z
  y.left = z;
  z.parent = y;

  // Correct each nodes height - order matters, children first
  x.height = this.getNodeHeight(x);
  z.height = this.getNodeHeight(z);
  y.height = this.getNodeHeight(y);
};

/**
 * Left-left rotation pattern.
 */
AVLTree.prototype.leftLeft = function (x, y, z) {
  //pass z parent to y and move y's right to z's left
  if (z.parent !== null) {
    var orientation = (z.parent.left === z) ? 'left' : 'right';
    z.parent[orientation] = y;
    y.parent = z.parent;
  } else {
    this.root = y;
    y.parent = null;
  }

  z.left = y.right;
  if (z.left !== null) {
    z.left.parent = z;
  }
  //fix y right child
  y.right = z;
  z.parent = y;

  // Correct each nodes height - order matters, children first
  x.height = this.getNodeHeight(x);
  z.height = this.getNodeHeight(z);
  y.height = this.getNodeHeight(y);
};

/**
 * Right-left rotation pattern.
 */
AVLTree.prototype.rightLeft = function (x, y, z) {
  //pass z parent to x
  if (z.parent !== null) {
    var orientation = (z.parent.left === z) ? 'left' : 'right';
    z.parent[orientation] = x;
    x.parent = z.parent;
  } else {
    this.root = x;
    x.parent = null;
  }

  // Adoptions
  z.right = x.left;
  if (z.right !== null) {
    z.right.parent = z;
  }
  y.left = x.right;
  if (y.left !== null) {
    y.left.parent = y;
  }

  // Point to new children (x new parent)
  x.left = z;
  x.right = y;
  x.left.parent = x;
  x.right.parent = x;

  // Correct each nodes height - order matters, children first
  y.height = this.getNodeHeight(y);
  z.height = this.getNodeHeight(z);
  x.height = this.getNodeHeight(x);
};

/**
 * Left-right rotation pattern.
 */
AVLTree.prototype.leftRight = function (x, y, z) {
  //pass z parent to x
  if (z.parent !== null) {
    var orientation = (z.parent.left === z) ? 'left' : 'right';
    z.parent[orientation] = x;
    x.parent = z.parent;
  } else {
    this.root = x;
    x.parent = null;
  }

  // Adoptions
  z.left = x.right;
  if (z.left !== null) {
    z.left.parent = z;
  }
  y.right = x.left;
  if (y.right !== null) {
    y.right.parent = y;
  }

  // Point to new children (x new parent)
  x.right = z;
  x.left = y;
  x.left.parent = x;
  x.right.parent = x;

  // Correct each nodes height - order matters, children first
  y.height = this.getNodeHeight(y);
  z.height = this.getNodeHeight(z);
  x.height = this.getNodeHeight(x);
};

/**
 * Inserts a value as a Node of an AVL Tree.
 */
AVLTree.prototype.insert = function (value, current) {
  if (this.root === null) {
    this.root = new Node(value, null, null, null, 1);
    this.keepHeightBalance(this.root);
    return;
  }

  var insertKey;
  current = current || this.root;
  if (current.value > value) {
    insertKey = 'left';
  } else {
    insertKey = 'right';
  }

  if (!current[insertKey]) {
    current[insertKey] = new Node(value, null, null, current);
    this.keepHeightBalance(current[insertKey], false);
  } else {
    this.insert(value, current[insertKey]);
  }
};

/**
 * In-order traversal from the given node.
 */
AVLTree.prototype.inOrder = function (current, callback) {
  if (!current) {
    return;
  }
  this.inOrder(current.left, callback);
  if (typeof callback === 'function') {
    callback(current);
  }
  this.inOrder(current.right, callback);
};

/**
 * Post-order traversal from the given node.
 */
AVLTree.prototype.postOrder = function (current, callback) {
  if (!current) {
    return;
  }

  this.postOrder(current.left, callback);
  this.postOrder(current.right, callback);
  if (typeof callback === 'function') {
    callback(current);
  }
};

/**
 * Pre-order traversal from the given node.
 */
AVLTree.prototype.preOrder = function (current, callback) {
  if (!current) {
    return;
  }
  if (typeof callback === 'function') {
    callback(current);
  }
  this.preOrder(current.left, callback);
  this.preOrder(current.right, callback);
};

/**
 * Finds a node by its value.
 */
AVLTree.prototype.find = function (value) {
  return this._find(value, this.root);
};

/**
 * Finds a node by its value in the given sub-tree.
 */
AVLTree.prototype._find = function (value, current) {
  if (!current) {
    return null;
  }

  var node;
  if (current.value === value) {
    node = current;
  } else if (current.value > value) {
    node = this._find(value, current.left);
  } else if (current.value < value) {
    node = this._find(value, current.right);
  }

  return node;
};

/**
 * Replaces the given child with the new one,
 * for the given parent.
 */
AVLTree.prototype.replaceChild = function (parent, oldChild, newChild) {
  if (parent === null) {
    this.root = newChild;
    if (this.root !== null) {
      this.root.parent = null;
    }
  } else {
    if (parent.left === oldChild) {
      parent.left = newChild;
    } else {
      parent.right = newChild;
    }
    if (newChild) {
      newChild.parent = parent;
    }
  }
};

/**
 * Removes a node by its value.
 */
AVLTree.prototype.remove = function (value) {
  var node = this.find(value);
  if (!node) {
    return false;
  }

  if (node.left && node.right) {
    var min = this.findMin(node.right);
    var temp = node.value;
    node.value = min.value;
    min.value = temp;
    return this.remove(min);
  } else if (node.left) {
    this.replaceChild(node.parent, node, node.left);
    this.keepHeightBalance(node.left, true);
  } else if (node.right) {
    this.replaceChild(node.parent, node, node.right);
    this.keepHeightBalance(node.right, true);
  } else {
    this.replaceChild(node.parent, node, null);
    this.keepHeightBalance(node.parent, true);
  }
  return true;
};

/**
 * Finds the node with minimum value in the given
 * sub-tree.
 */
AVLTree.prototype._findMin = function (node, current) {
  current = current || {
    value: Infinity
  };
  if (!node) {
    return current;
  }
  if (current.value > node.value) {
    current = node;
  }
  return this._findMin(node.left, current);
};

/**
 * Finds the node with maximum value in the given
 * sub-tree.
 */
AVLTree.prototype._findMax = function (node, current) {
  current = current || {
    value: -Infinity
  };
  if (!node) {
    return current;
  }
  if (current.value < node.value) {
    current = node;
  }
  return this._findMax(node.right, current);
};

/**
 * Finds the node with minimum value in the whole tree.
 */
AVLTree.prototype.findMin = function () {
  return this._findMin(this.root);
};

/**
 * Finds the node with maximum value in the whole tree.
 */
AVLTree.prototype.findMax = function () {
  return this._findMax(this.root);
};

/**
 * Verifies if the tree is balanced.
 */
AVLTree.prototype.isTreeBalanced = function () {
  var current = this.root;

  if (!current) {
    return true;
  }
  return this._isBalanced(current._left) &&
    this._isBalanced(current._right) &&
    Math.abs(this._getNodeHeight(current._left) -
      this._getNodeHeight(current._right)) <= 1;
};

/**
 * Calculates the height of the tree based on height
 * property.
 */
AVLTree.prototype.getTreeHeight = function () {
  var current = this.root;

  if (!current) {
    return 0;
  }
  return 1 + Math.max(this.getNodeHeight(current._left),
    this._getNodeHeight(current._right));
};

module.exports = AVLTree;


/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Comparator = __webpack_require__(9);

/**
 * Binary Search Tree
 */
function BST(compareFn) {
  this.root = null;
  this._size = 0;
  /**
   * @var Comparator
   */
  this._comparator = new Comparator(compareFn);

  /**
   * Read-only property for the size of the tree
   */
  Object.defineProperty(this, 'size', {
    get: function () { return this._size; }.bind(this)
  });
}

/**
 * Tree node
 */
function Node(value, parent) {
  this.value = value;
  this.parent = parent;
  this.left = null;
  this.right = null;
}

/**
 * Insert elements to the tree respecting the BST restrictions
 */
BST.prototype.insert = function (value, parent) {
  // Set the root as the initial insertion point
  // if it has not been passed
  if (!parent) {
    if (!this.root) {
      this.root = new Node(value);
      this._size++;
      return;
    }
    parent = this.root;
  }

  var child = this._comparator.lessThan(value, parent.value) ? 'left' : 'right';
  if (parent[child]) {
    this.insert(value, parent[child]);
  } else {
    parent[child] = new Node(value, parent);
    this._size++;
  }
};

/**
 * Returns if a tree contains an element in O(lg n)
 */
BST.prototype.contains = function (e) {
  return !!this._find(e);
};

BST.prototype._find = function (e, root) {

  if (!root) {
    if (this.root) root = this.root;
    else return false;
  }

  if (root.value === e)
    return root;

  if (this._comparator.lessThan(e, root.value))
    return root.left && this._find(e, root.left);

  if (this._comparator.greaterThan(e, root.value))
    return root.right && this._find(e, root.right);
};

/**
 * Substitute two nodes
 */
BST.prototype._replaceNodeInParent = function (currNode, newNode) {
  var parent = currNode.parent;
  if (parent) {
    parent[currNode === parent.left ? 'left' : 'right'] = newNode;
    if (newNode)
      newNode.parent = parent;
  } else {
    this.root = newNode;
  }
};

/**
 * Find the minimum value in a tree
 */
BST.prototype._findMin = function (root) {
  var minNode = root;
  while (minNode.left) {
    minNode = minNode.left;
  }
  return minNode;
};

/**
 * Remove an element from the BST
 */
BST.prototype.remove = function (e) {
  var node = this._find(e);
  if (!node) {
    throw new Error('Item not found in the tree');
  }

  if (node.left && node.right) {
    /**
     * If the node to be removed has both left and right children,
     * replace the node's value by the minimum value of the right
     * sub-tree, and remove the leave containing the value
     */
    var successor = this._findMin(node.right);
    this.remove(successor.value);
    node.value = successor.value;
  } else {
    /**
     * If the node is a leaf, just make the parent point to null,
     * and if it has one child, make the parent point to this child
     * instead
     */
    this._replaceNodeInParent(node, node.left || node.right);
    this._size--;
  }
};

module.exports = BST;


/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Fenwick Tree (Binary Indexed Tree)
 *
 * The fenwick tree is a tree in the sense it represents a structure where
 * the leafs are the original array values and each parent has the sum of its
 * two children. E.g., for an array [1, 2, 3, 4], we have:
 *
 *    10
 *  3    7
 * 1 2  3 4
 *
 * But some nodes aren't really important. In fact every right child isn't
 * needed to compute the prefix sum (as its value is just the parent's value
 * minus the left child), so we can store the tree in a compact array structure
 * like this:
 *
 * 1 3 3 10
 *
 * Here we assume all the operations will be on a 1-based array for two
 * reasons: (1) the bit operations become rather easy and (2) it's better to
 * reason about the range sum (prefix(b) - prefix(a-1)) on a 1-based array.
 */
function FenwickTree(length) {
  this._elements = new Array(length + 1);
  for (var i = 0; i < this._elements.length ; i++)
    this._elements[i] = 0;
}

/**
 * Adds value to the array at specified index in O(log n)
 */
FenwickTree.prototype.adjust = function (index, value) {
  /*
    This function goes up the tree adding the value to all parent nodes.

    In the array, to know where a index is in the tree, just look at where is
    the rightmost bit. 1 is a leaf, because the rightmost bit is at position 0.
    2 (10) is 1 level above the leafs. 4 (100) is 2 levels above the leafs.

    Going up the tree means pushing the rightmost bit far to the left. We do
    this by adding only the bit itself to the index. Eventually we skip
    some levels that aren't represented in the array. E.g. starting at 3 (11),
    it's imediate parent is 11b + 1b = 100b. We started at a leaf  and skipped
    the level-1 node, because it wasn't represented in the array
    (a right child).

    Note: (index&-index) finds the rightmost bit in index.
  */
  for (; index < this._elements.length ; index += (index&-index))
    this._elements[index] += value;
};

/**
* Returns the sum of all values up to specified index in O(log n)
*/
FenwickTree.prototype.prefixSum = function (index) {
  /*
    This function goes up the tree adding the required nodes to sum the prefix.

    The key here is to sum every node that isn't in the same subtree as an
    already seen node. In practice we proceed always getting a node's uncle
    (the sibling of the node's parent). So, if we start at the index 7, we must
    go to 6 (7's uncle), then to 4 (6's uncle), then we stop, because 4 has
    no uncle.

    Binary-wise, this is the same as erasing the rightmost bit of the index.
    E.g. 7 (111) -> 6 (110) -> 4 (100).

    Note: (index&-index) finds the rightmost bit in index.
  */

  var sum = 0;
  for (; index > 0 ; index -= (index&-index))
    sum += this._elements[index];
  return sum;
};

/**
* Returns the sum of all values between two indexes in O(log n)
*/
FenwickTree.prototype.rangeSum = function (fromIndex, toIndex) {
  return this.prefixSum(toIndex) - this.prefixSum(fromIndex - 1);
};

module.exports = FenwickTree;


/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Tree node
 */
function Node(value, left, right) {
  this.value = value;
  this.children = [left, right];
  this.size = 1;
  this.height = 1;
  this.key = Math.random();
}

/**
 * Computer the number of childnodes
 */
Node.prototype.resize = function () {
  this.size = (this.children[0] ? this.children[0].size : 0) 
            + (this.children[1] ? this.children[1].size : 0) + 1;
  this.height = Math.max(this.children[0] ? this.children[0].height : 0,
  						 this.children[1] ? this.children[1].height : 0) + 1;
  return this;
};

/**
 * Zigzag rotate of tree nodes
 */
Node.prototype.rotate = function (side) {
  var temp = this.children[side];

  // Rotate
  this.children[side] = temp.children[1 - side];
  temp.children[1 - side] = this;

  this.resize();
  temp.resize();

  return temp;
};

/**
 * Treap
 */
function Treap() {
  this.root = null;
}

/**
 * Insert new value into the subtree of `node`
 */
Treap.prototype._insert = function (node, value) {
  if (node === null) {
    return new Node(value, null, null);
  }

  // Passing to childnodes and update
  var side = ~~(value > node.value);
  node.children[side] = this._insert(node.children[side], value);

  // Keep it balance
  if (node.children[side].key < node.key) {
	return node.rotate(side);
  } else {
	return node.resize();
  }
};

Treap.prototype._find = function (node, value) {
  if (node === null) {
    // Empty tree
    return false;
  }
  if (node.value === value) {
    // Found!
    return true;
  }

  // Search within childnodes
  var side = ~~(value > node.value);
  return this._find(node.children[side], value);
};

Treap.prototype._minimum = function (node) {
  if (node === null) {
    // Empty tree, returns Infinity
    return Infinity;
  }

  return Math.min(node.value, this._minimum(node.children[0]));
};

Treap.prototype._maximum = function (node) {
  if (node === null) {
    // Empty tree, returns -Infinity
    return -Infinity;
  }

  return Math.max(node.value, this._maximum(node.children[1]));
};

Treap.prototype._remove = function (node, value) {
  if (node === null) {
    // Empty node, value not found
    return null;
  }

  var side;

  if (node.value === value) {
    if (node.children[0] === null && node.children[1] === null) {
      // It's a leaf, set to null
      return null;
    }

	// Rotate to a subtree and remove it
	side = (node.children[0] === null ? 1 : 0);
	node = node.rotate(side);
  	node.children[1 - side] = this._remove(node.children[1 - side], value);
  	return node.resize();
  } else {
    side = ~~(value > node.value);
    node.children[side] = this._remove(node.children[side], value);
  	return node.resize();
  }
};

Treap.prototype.insert = function (value) {
  this.root = this._insert(this.root, value);
};

Treap.prototype.find = function (value) {
  return this._find(this.root, value);
};

Treap.prototype.minimum = function () {
  return this._minimum(this.root);
};

Treap.prototype.maximum = function () {
  return this._maximum(this.root);
};

Treap.prototype.remove = function (value) {
  this.root = this._remove(this.root, value);
};

Treap.prototype.size = function () {
  return this.root ? this.root.size : 0;
};

Treap.prototype.height = function () {
  return this.root ? this.root.height : 0;
};

module.exports = Treap;


/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Geometry algorithms
module.exports = {
  BezierCurve: __webpack_require__(137)
};


/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Graph algorithms
module.exports = {
  topologicalSort: __webpack_require__(146),
  dijkstra: __webpack_require__(141),
  SPFA: __webpack_require__(138),
  bellmanFord: __webpack_require__(139),
  eulerPath: __webpack_require__(142),
  depthFirstSearch: __webpack_require__(59),
  kruskal: __webpack_require__(144),
  breadthFirstSearch: __webpack_require__(105),
  bfsShortestPath: __webpack_require__(140),
  prim: __webpack_require__(145),
  floydWarshall: __webpack_require__(143)
};


/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var lib = {
  DataStructures: __webpack_require__(180),
  Graph: __webpack_require__(186),
  Geometry: __webpack_require__(185),
  Math: __webpack_require__(188),
  Search: __webpack_require__(189),
  Sorting: __webpack_require__(190),
  String: __webpack_require__(191)
};

module.exports = lib;


/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Math algorithms
module.exports = {
  fibonacci: __webpack_require__(149),
  fisherYates: __webpack_require__(150),
  gcd: __webpack_require__(107),
  extendedEuclidean: __webpack_require__(148),
  lcm: __webpack_require__(152),
  newtonSqrt: __webpack_require__(153),
  primalityTests: __webpack_require__(156),
  reservoirSampling: __webpack_require__(157),
  fastPower: __webpack_require__(106),
  nextPermutation: __webpack_require__(154),
  powerSet: __webpack_require__(155),
  shannonEntropy: __webpack_require__(158),
  collatzConjecture: __webpack_require__(147),
  greatestDifference: __webpack_require__(151)
};


/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Search algorithms
module.exports = {
  bfs: __webpack_require__(159),
  binarySearch: __webpack_require__(160),
  ternarySearch: __webpack_require__(162),
  dfs: __webpack_require__(161)
};


/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Sorting algorithms
module.exports = {
  bubbleSort: __webpack_require__(163),
  shortBubbleSort: __webpack_require__(172),
  countingSort: __webpack_require__(164),
  heapSort: __webpack_require__(165),
  mergeSort: __webpack_require__(167),
  quicksort: __webpack_require__(168),
  selectionSort: __webpack_require__(170),
  radixSort: __webpack_require__(169),
  insertionSort: __webpack_require__(166),
  shellSort: __webpack_require__(171)
};


/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// String algorithms
module.exports = {
  levenshtein: __webpack_require__(176),
  rabinKarp: __webpack_require__(179),
  knuthMorrisPratt: __webpack_require__(175),
  huffman: __webpack_require__(174),
  hamming: __webpack_require__(173),
  longestCommonSubsequence: __webpack_require__(
    177),
  longestCommonSubstring: __webpack_require__(
      178)
};


/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;(function() {
    var kmp_matcher = {
        kmp: function(s, p) {
            var n = s.length;
            var m = p.length;
            var prefix = kmp_matcher.calcPrefixFunction(p);
            var res = [];
            var q = 0;
            for(var i = 0; i < n; i++) {
                while(q > 0 && p[q] != s[i]) {
                    q = prefix[q - 1];
                }
                if(p[q] == s[i]) {
                    ++q;
                }
                if(q == m) {
                    res.push(i - m + 1);
                    q = prefix[q - 1];
                }
            }
            return res;
        },
        calcPrefixFunction: function(p) {
            var n = p.length;
            var prefix = [];
            var q = 0;
            prefix.push(q);
            for(var i = 1; i < n; i++) {
                while(q > 0 && p[q] != p[i]) {
                    q = prefix[q - 1];
                }
                if(p[q] == p[i]) {
                    ++q;
                }
                prefix[i] = q;
            }
            return prefix;
        },
    };
    if (true) !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return kmp_matcher; }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    else if (typeof module !== 'undefined') module.exports = kmp_matcher;
    else if (typeof self !== 'undefined') self.kmp_matcher = kmp_matcher;
    else window.kmp_matcher = kmp_matcher;
})();


/***/ }),
/* 193 */,
/* 194 */,
/* 195 */,
/* 196 */,
/* 197 */,
/* 198 */,
/* 199 */,
/* 200 */,
/* 201 */,
/* 202 */,
/* 203 */,
/* 204 */,
/* 205 */,
/* 206 */,
/* 207 */,
/* 208 */,
/* 209 */,
/* 210 */,
/* 211 */,
/* 212 */,
/* 213 */,
/* 214 */,
/* 215 */,
/* 216 */,
/* 217 */,
/* 218 */,
/* 219 */,
/* 220 */,
/* 221 */,
/* 222 */,
/* 223 */,
/* 224 */,
/* 225 */,
/* 226 */,
/* 227 */,
/* 228 */,
/* 229 */,
/* 230 */,
/* 231 */,
/* 232 */,
/* 233 */,
/* 234 */,
/* 235 */,
/* 236 */,
/* 237 */,
/* 238 */,
/* 239 */,
/* 240 */,
/* 241 */,
/* 242 */,
/* 243 */,
/* 244 */,
/* 245 */,
/* 246 */,
/* 247 */,
/* 248 */,
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(131);


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOGJkNTMyNGNiOWY1MWViYjJhYWY/ZGFmYyoiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidmVuZG9yXCI/Yjk0MCoiLCJ3ZWJwYWNrOi8vL2RlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9qcXVlcnkvZGlzdC9qcXVlcnkuanMgZnJvbSBkbGwtcmVmZXJlbmNlIHZlbmRvciIsIndlYnBhY2s6Ly8vLi9+L2FsZ29yaXRobXMvdXRpbC9jb21wYXJhdG9yLmpzIiwid2VicGFjazovLy8uL34vYWxnb3JpdGhtcy9kYXRhX3N0cnVjdHVyZXMvZ3JhcGguanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvcml0aG1zL2RhdGFfc3RydWN0dXJlcy9xdWV1ZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29yaXRobXMvYWxnb3JpdGhtcy9ncmFwaC9kZXB0aF9maXJzdF9zZWFyY2guanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvcml0aG1zL2RhdGFfc3RydWN0dXJlcy9oZWFwLmpzIiwid2VicGFjazovLy8uL34vYWxnb3JpdGhtcy9kYXRhX3N0cnVjdHVyZXMvbGlua2VkX2xpc3QuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvcml0aG1zL2RhdGFfc3RydWN0dXJlcy9wcmlvcml0eV9xdWV1ZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29yaXRobXMvYWxnb3JpdGhtcy9ncmFwaC9icmVhZHRoX2ZpcnN0X3NlYXJjaC5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29yaXRobXMvYWxnb3JpdGhtcy9tYXRoL2Zhc3RfcG93ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvcml0aG1zL2FsZ29yaXRobXMvbWF0aC9nY2QuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvcml0aG1zL2RhdGFfc3RydWN0dXJlcy9kaXNqb2ludF9zZXRfZm9yZXN0LmpzIiwid2VicGFjazovLy8uL34vYWxnb3JpdGhtcy9kYXRhX3N0cnVjdHVyZXMvaGFzaF90YWJsZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29yaXRobXMvZGF0YV9zdHJ1Y3R1cmVzL3NldC5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29yaXRobXMvZGF0YV9zdHJ1Y3R1cmVzL3N0YWNrLmpzIiwid2VicGFjazovLy8uL3NyYy9wYWdlL2ttcC9rbXAudHN4Iiwid2VicGFjazovLy8uL34vYWxnb3JpdGhtcy9hbGdvcml0aG1zL2dlb21ldHJ5L2Jlemllcl9jdXJ2ZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29yaXRobXMvYWxnb3JpdGhtcy9ncmFwaC9TUEZBLmpzIiwid2VicGFjazovLy8uL34vYWxnb3JpdGhtcy9hbGdvcml0aG1zL2dyYXBoL2JlbGxtYW5fZm9yZC5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29yaXRobXMvYWxnb3JpdGhtcy9ncmFwaC9iZnNfc2hvcnRlc3RfcGF0aC5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29yaXRobXMvYWxnb3JpdGhtcy9ncmFwaC9kaWprc3RyYS5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29yaXRobXMvYWxnb3JpdGhtcy9ncmFwaC9ldWxlcl9wYXRoLmpzIiwid2VicGFjazovLy8uL34vYWxnb3JpdGhtcy9hbGdvcml0aG1zL2dyYXBoL2Zsb3lkX3dhcnNoYWxsLmpzIiwid2VicGFjazovLy8uL34vYWxnb3JpdGhtcy9hbGdvcml0aG1zL2dyYXBoL2tydXNrYWwuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvcml0aG1zL2FsZ29yaXRobXMvZ3JhcGgvcHJpbS5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29yaXRobXMvYWxnb3JpdGhtcy9ncmFwaC90b3BvbG9naWNhbF9zb3J0LmpzIiwid2VicGFjazovLy8uL34vYWxnb3JpdGhtcy9hbGdvcml0aG1zL21hdGgvY29sbGF0el9jb25qZWN0dXJlLmpzIiwid2VicGFjazovLy8uL34vYWxnb3JpdGhtcy9hbGdvcml0aG1zL21hdGgvZXh0ZW5kZWRfZXVjbGlkZWFuLmpzIiwid2VicGFjazovLy8uL34vYWxnb3JpdGhtcy9hbGdvcml0aG1zL21hdGgvZmlib25hY2NpLmpzIiwid2VicGFjazovLy8uL34vYWxnb3JpdGhtcy9hbGdvcml0aG1zL21hdGgvZmlzaGVyX3lhdGVzLmpzIiwid2VicGFjazovLy8uL34vYWxnb3JpdGhtcy9hbGdvcml0aG1zL21hdGgvZ3JlYXRlc3RfZGlmZmVyZW5jZS5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29yaXRobXMvYWxnb3JpdGhtcy9tYXRoL2xjbS5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29yaXRobXMvYWxnb3JpdGhtcy9tYXRoL25ld3Rvbl9zcXJ0LmpzIiwid2VicGFjazovLy8uL34vYWxnb3JpdGhtcy9hbGdvcml0aG1zL21hdGgvbmV4dF9wZXJtdXRhdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29yaXRobXMvYWxnb3JpdGhtcy9tYXRoL3Bvd2VyX3NldC5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29yaXRobXMvYWxnb3JpdGhtcy9tYXRoL3ByaW1hbGl0eV90ZXN0cy5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29yaXRobXMvYWxnb3JpdGhtcy9tYXRoL3Jlc2Vydm9pcl9zYW1wbGluZy5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29yaXRobXMvYWxnb3JpdGhtcy9tYXRoL3NoYW5ub25fZW50cm9weS5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29yaXRobXMvYWxnb3JpdGhtcy9zZWFyY2gvYmZzLmpzIiwid2VicGFjazovLy8uL34vYWxnb3JpdGhtcy9hbGdvcml0aG1zL3NlYXJjaC9iaW5hcnlzZWFyY2guanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvcml0aG1zL2FsZ29yaXRobXMvc2VhcmNoL2Rmcy5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29yaXRobXMvYWxnb3JpdGhtcy9zZWFyY2gvdGVybmFyeV9zZWFyY2guanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvcml0aG1zL2FsZ29yaXRobXMvc29ydGluZy9idWJibGVfc29ydC5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29yaXRobXMvYWxnb3JpdGhtcy9zb3J0aW5nL2NvdW50aW5nX3NvcnQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvcml0aG1zL2FsZ29yaXRobXMvc29ydGluZy9oZWFwX3NvcnQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvcml0aG1zL2FsZ29yaXRobXMvc29ydGluZy9pbnNlcnRpb25fc29ydC5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29yaXRobXMvYWxnb3JpdGhtcy9zb3J0aW5nL21lcmdlX3NvcnQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvcml0aG1zL2FsZ29yaXRobXMvc29ydGluZy9xdWlja3NvcnQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvcml0aG1zL2FsZ29yaXRobXMvc29ydGluZy9yYWRpeF9zb3J0LmpzIiwid2VicGFjazovLy8uL34vYWxnb3JpdGhtcy9hbGdvcml0aG1zL3NvcnRpbmcvc2VsZWN0aW9uX3NvcnQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvcml0aG1zL2FsZ29yaXRobXMvc29ydGluZy9zaGVsbF9zb3J0LmpzIiwid2VicGFjazovLy8uL34vYWxnb3JpdGhtcy9hbGdvcml0aG1zL3NvcnRpbmcvc2hvcnRfYnViYmxlX3NvcnQuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvcml0aG1zL2FsZ29yaXRobXMvc3RyaW5nL2hhbW1pbmcuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvcml0aG1zL2FsZ29yaXRobXMvc3RyaW5nL2h1ZmZtYW4uanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvcml0aG1zL2FsZ29yaXRobXMvc3RyaW5nL2tudXRoX21vcnJpc19wcmF0dC5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29yaXRobXMvYWxnb3JpdGhtcy9zdHJpbmcvbGV2ZW5zaHRlaW4uanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvcml0aG1zL2FsZ29yaXRobXMvc3RyaW5nL2xvbmdlc3RfY29tbW9uX3N1YnNlcXVlbmNlLmpzIiwid2VicGFjazovLy8uL34vYWxnb3JpdGhtcy9hbGdvcml0aG1zL3N0cmluZy9sb25nZXN0X2NvbW1vbl9zdWJzdHJpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvcml0aG1zL2FsZ29yaXRobXMvc3RyaW5nL3JhYmluX2thcnAuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvcml0aG1zL2RhdGFfc3RydWN0dXJlcy5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29yaXRobXMvZGF0YV9zdHJ1Y3R1cmVzL2F2bF90cmVlLmpzIiwid2VicGFjazovLy8uL34vYWxnb3JpdGhtcy9kYXRhX3N0cnVjdHVyZXMvYnN0LmpzIiwid2VicGFjazovLy8uL34vYWxnb3JpdGhtcy9kYXRhX3N0cnVjdHVyZXMvZmVud2lja190cmVlLmpzIiwid2VicGFjazovLy8uL34vYWxnb3JpdGhtcy9kYXRhX3N0cnVjdHVyZXMvdHJlYXAuanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvcml0aG1zL2dlb21ldHJ5LmpzIiwid2VicGFjazovLy8uL34vYWxnb3JpdGhtcy9ncmFwaC5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29yaXRobXMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvcml0aG1zL21hdGguanMiLCJ3ZWJwYWNrOi8vLy4vfi9hbGdvcml0aG1zL3NlYXJjaC5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29yaXRobXMvc29ydGluZy5qcyIsIndlYnBhY2s6Ly8vLi9+L2FsZ29yaXRobXMvc3RyaW5nLmpzIiwid2VicGFjazovLy8uL34va21wLW1hdGNoZXIva21wLW1hdGNoZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtRUFBMkQ7QUFDM0Q7QUFDQTtBQUNBLFdBQUc7O0FBRUgsb0RBQTRDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDBDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLGVBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7Ozs7QUFJQTtBQUNBLHNEQUE4QztBQUM5QztBQUNBLG9DQUE0QjtBQUM1QixxQ0FBNkI7QUFDN0IseUNBQWlDOztBQUVqQywrQ0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsOENBQXNDO0FBQ3RDO0FBQ0E7QUFDQSxxQ0FBNkI7QUFDN0IscUNBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBb0IsZ0JBQWdCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUFvQixnQkFBZ0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxhQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHlCQUFpQiw4QkFBOEI7QUFDL0M7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKOztBQUVBLDREQUFvRDtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBLGFBQUs7QUFDTCxZQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUFtQiwyQkFBMkI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVB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O0FBRUE7QUFDQSw4Q0FBc0MsdUJBQXVCOztBQUU3RDtBQUNBOzs7Ozs7O0FDbnNCQSx3Qjs7Ozs7Ozs7O0FDQUEsOEM7Ozs7Ozs7Ozs7O0FDQUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxXQUFXO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDekRBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxXQUFXLEtBQUs7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7O0FDdkRBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7OztBQ3BE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Q0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBOzs7Ozs7OztBQzdNQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE1BQU07QUFDakIsV0FBVztBQUNYLFdBQVcsTUFBTTtBQUNqQixXQUFXO0FBQ1gsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsTUFBTTtBQUNqQixXQUFXO0FBQ1gsWUFBWSxNQUFNO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7Ozs7Ozs7QUNuRkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLGVBQWU7QUFDNUI7QUFDQTtBQUNBOztBQUVBO0FBQ0EsYUFBYSxlQUFlO0FBQzVCO0FBQ0E7QUFDQSxhQUFhLGVBQWU7QUFDNUIsZUFBZSxlQUFlO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7O0FDaERBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsYUFBYSxnQkFBZ0I7QUFDN0I7QUFDQTs7QUFFQTtBQUNBLGFBQWEsZ0JBQWdCO0FBQzdCLGVBQWUsZ0JBQWdCO0FBQy9CO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7Ozs7Ozs7QUNsREE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxhQUFhLG9CQUFvQjtBQUNqQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhLGdCQUFnQjtBQUM3QixlQUFlLGdCQUFnQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOzs7Ozs7OztBQzlDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSw4QkFBOEIsZUFBZTtBQUM3QztBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUJBQWlCLGlCQUFpQjtBQUNsQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7O0FDeEVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQ2pCQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7O0FDemdCQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLG1CQUFtQixFQUFFO0FBQzNDLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7O0FDdElBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQiw0QkFBNEI7QUFDN0M7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsUUFBUSxnQ0FBZ0M7QUFDeEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxRQUFRLFlBQVk7QUFDcEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7QUN0RkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7QUMxSkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDTEE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUNmQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7O0FDWkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUNsQkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDUkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDZEE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixPQUFPO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLE9BQU87QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsNERBQXVFLG9CQUFvQixFQUFFO0FBQUE7QUFDN0Y7QUFDQTtBQUNBO0FBQ0EsQ0FBQyIsImZpbGUiOiJqcy9rbXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHRmdW5jdGlvbiBob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHRkZWxldGUgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdO1xuIFx0fVxuIFx0dmFyIHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrID0gdGhpc1tcIndlYnBhY2tIb3RVcGRhdGVcIl07XG4gXHR0aGlzW1wid2VicGFja0hvdFVwZGF0ZVwiXSA9IFxyXG4gXHRmdW5jdGlvbiB3ZWJwYWNrSG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKTtcclxuIFx0XHRpZihwYXJlbnRIb3RVcGRhdGVDYWxsYmFjaykgcGFyZW50SG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpO1xyXG4gXHR9IDtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF07XHJcbiBcdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XHJcbiBcdFx0c2NyaXB0LnR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiO1xyXG4gXHRcdHNjcmlwdC5jaGFyc2V0ID0gXCJ1dGYtOFwiO1xyXG4gXHRcdHNjcmlwdC5zcmMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgY2h1bmtJZCArIFwiLlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzXCI7XHJcbiBcdFx0aGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZE1hbmlmZXN0KCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gXHRcdFx0aWYodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ID09PSBcInVuZGVmaW5lZFwiKVxyXG4gXHRcdFx0XHRyZXR1cm4gcmVqZWN0KG5ldyBFcnJvcihcIk5vIGJyb3dzZXIgc3VwcG9ydFwiKSk7XHJcbiBcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHR2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gXHRcdFx0XHR2YXIgcmVxdWVzdFBhdGggPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzb25cIjtcclxuIFx0XHRcdFx0cmVxdWVzdC5vcGVuKFwiR0VUXCIsIHJlcXVlc3RQYXRoLCB0cnVlKTtcclxuIFx0XHRcdFx0cmVxdWVzdC50aW1lb3V0ID0gMTAwMDA7XHJcbiBcdFx0XHRcdHJlcXVlc3Quc2VuZChudWxsKTtcclxuIFx0XHRcdH0gY2F0Y2goZXJyKSB7XHJcbiBcdFx0XHRcdHJldHVybiByZWplY3QoZXJyKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcbiBcdFx0XHRcdGlmKHJlcXVlc3QucmVhZHlTdGF0ZSAhPT0gNCkgcmV0dXJuO1xyXG4gXHRcdFx0XHRpZihyZXF1ZXN0LnN0YXR1cyA9PT0gMCkge1xyXG4gXHRcdFx0XHRcdC8vIHRpbWVvdXRcclxuIFx0XHRcdFx0XHRyZWplY3QobmV3IEVycm9yKFwiTWFuaWZlc3QgcmVxdWVzdCB0byBcIiArIHJlcXVlc3RQYXRoICsgXCIgdGltZWQgb3V0LlwiKSk7XHJcbiBcdFx0XHRcdH0gZWxzZSBpZihyZXF1ZXN0LnN0YXR1cyA9PT0gNDA0KSB7XHJcbiBcdFx0XHRcdFx0Ly8gbm8gdXBkYXRlIGF2YWlsYWJsZVxyXG4gXHRcdFx0XHRcdHJlc29sdmUoKTtcclxuIFx0XHRcdFx0fSBlbHNlIGlmKHJlcXVlc3Quc3RhdHVzICE9PSAyMDAgJiYgcmVxdWVzdC5zdGF0dXMgIT09IDMwNCkge1xyXG4gXHRcdFx0XHRcdC8vIG90aGVyIGZhaWx1cmVcclxuIFx0XHRcdFx0XHRyZWplY3QobmV3IEVycm9yKFwiTWFuaWZlc3QgcmVxdWVzdCB0byBcIiArIHJlcXVlc3RQYXRoICsgXCIgZmFpbGVkLlwiKSk7XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0Ly8gc3VjY2Vzc1xyXG4gXHRcdFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdFx0XHR2YXIgdXBkYXRlID0gSlNPTi5wYXJzZShyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XHJcbiBcdFx0XHRcdFx0fSBjYXRjaChlKSB7XHJcbiBcdFx0XHRcdFx0XHRyZWplY3QoZSk7XHJcbiBcdFx0XHRcdFx0XHRyZXR1cm47XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdHJlc29sdmUodXBkYXRlKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG5cbiBcdFxyXG4gXHRcclxuIFx0dmFyIGhvdEFwcGx5T25VcGRhdGUgPSB0cnVlO1xyXG4gXHR2YXIgaG90Q3VycmVudEhhc2ggPSBcIjhiZDUzMjRjYjlmNTFlYmIyYWFmXCI7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0dmFyIGhvdEN1cnJlbnRNb2R1bGVEYXRhID0ge307XHJcbiBcdHZhciBob3RDdXJyZW50Q2hpbGRNb2R1bGU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzID0gW107IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCA9IFtdOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR2YXIgbWUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRpZighbWUpIHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fO1xyXG4gXHRcdHZhciBmbiA9IGZ1bmN0aW9uKHJlcXVlc3QpIHtcclxuIFx0XHRcdGlmKG1lLmhvdC5hY3RpdmUpIHtcclxuIFx0XHRcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XSkge1xyXG4gXHRcdFx0XHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKSA8IDApXHJcbiBcdFx0XHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMucHVzaChtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHJlcXVlc3Q7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYobWUuY2hpbGRyZW4uaW5kZXhPZihyZXF1ZXN0KSA8IDApXHJcbiBcdFx0XHRcdFx0bWUuY2hpbGRyZW4ucHVzaChyZXF1ZXN0KTtcclxuIFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdGNvbnNvbGUud2FybihcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlcXVlc3QgKyBcIikgZnJvbSBkaXNwb3NlZCBtb2R1bGUgXCIgKyBtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW107XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhyZXF1ZXN0KTtcclxuIFx0XHR9O1xyXG4gXHRcdHZhciBPYmplY3RGYWN0b3J5ID0gZnVuY3Rpb24gT2JqZWN0RmFjdG9yeShuYW1lKSB7XHJcbiBcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXHJcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXHJcbiBcdFx0XHRcdGdldDogZnVuY3Rpb24oKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX19bbmFtZV07XHJcbiBcdFx0XHRcdH0sXHJcbiBcdFx0XHRcdHNldDogZnVuY3Rpb24odmFsdWUpIHtcclxuIFx0XHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdID0gdmFsdWU7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH07XHJcbiBcdFx0fTtcclxuIFx0XHRmb3IodmFyIG5hbWUgaW4gX193ZWJwYWNrX3JlcXVpcmVfXykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKF9fd2VicGFja19yZXF1aXJlX18sIG5hbWUpICYmIG5hbWUgIT09IFwiZVwiKSB7XHJcbiBcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmbiwgbmFtZSwgT2JqZWN0RmFjdG9yeShuYW1lKSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcdGZuLmUgPSBmdW5jdGlvbihjaHVua0lkKSB7XHJcbiBcdFx0XHRpZihob3RTdGF0dXMgPT09IFwicmVhZHlcIilcclxuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcclxuIFx0XHRcdGhvdENodW5rc0xvYWRpbmcrKztcclxuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLmUoY2h1bmtJZCkudGhlbihmaW5pc2hDaHVua0xvYWRpbmcsIGZ1bmN0aW9uKGVycikge1xyXG4gXHRcdFx0XHRmaW5pc2hDaHVua0xvYWRpbmcoKTtcclxuIFx0XHRcdFx0dGhyb3cgZXJyO1xyXG4gXHRcdFx0fSk7XHJcbiBcdFxyXG4gXHRcdFx0ZnVuY3Rpb24gZmluaXNoQ2h1bmtMb2FkaW5nKCkge1xyXG4gXHRcdFx0XHRob3RDaHVua3NMb2FkaW5nLS07XHJcbiBcdFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIpIHtcclxuIFx0XHRcdFx0XHRpZighaG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0aWYoaG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJiBob3RXYWl0aW5nRmlsZXMgPT09IDApIHtcclxuIFx0XHRcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9O1xyXG4gXHRcdHJldHVybiBmbjtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR2YXIgaG90ID0ge1xyXG4gXHRcdFx0Ly8gcHJpdmF0ZSBzdHVmZlxyXG4gXHRcdFx0X2FjY2VwdGVkRGVwZW5kZW5jaWVzOiB7fSxcclxuIFx0XHRcdF9kZWNsaW5lZERlcGVuZGVuY2llczoge30sXHJcbiBcdFx0XHRfc2VsZkFjY2VwdGVkOiBmYWxzZSxcclxuIFx0XHRcdF9zZWxmRGVjbGluZWQ6IGZhbHNlLFxyXG4gXHRcdFx0X2Rpc3Bvc2VIYW5kbGVyczogW10sXHJcbiBcdFx0XHRfbWFpbjogaG90Q3VycmVudENoaWxkTW9kdWxlICE9PSBtb2R1bGVJZCxcclxuIFx0XHJcbiBcdFx0XHQvLyBNb2R1bGUgQVBJXHJcbiBcdFx0XHRhY3RpdmU6IHRydWUsXHJcbiBcdFx0XHRhY2NlcHQ6IGZ1bmN0aW9uKGRlcCwgY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGRlcCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZBY2NlcHRlZCA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJmdW5jdGlvblwiKVxyXG4gXHRcdFx0XHRcdGhvdC5fc2VsZkFjY2VwdGVkID0gZGVwO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXHJcbiBcdFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcclxuIFx0XHRcdFx0XHRcdGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XHJcbiBcdFx0XHRcdGVsc2VcclxuIFx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcF0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGRlY2xpbmU6IGZ1bmN0aW9uKGRlcCkge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgZGVwID09PSBcInVuZGVmaW5lZFwiKVxyXG4gXHRcdFx0XHRcdGhvdC5fc2VsZkRlY2xpbmVkID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxyXG4gXHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRcdFx0XHRob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlXHJcbiBcdFx0XHRcdFx0aG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBdID0gdHJ1ZTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRkaXNwb3NlOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRhZGREaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0cmVtb3ZlRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdHZhciBpZHggPSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5pbmRleE9mKGNhbGxiYWNrKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIGhvdC5fZGlzcG9zZUhhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHJcbiBcdFx0XHQvLyBNYW5hZ2VtZW50IEFQSVxyXG4gXHRcdFx0Y2hlY2s6IGhvdENoZWNrLFxyXG4gXHRcdFx0YXBwbHk6IGhvdEFwcGx5LFxyXG4gXHRcdFx0c3RhdHVzOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdGlmKCFsKSByZXR1cm4gaG90U3RhdHVzO1xyXG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGFkZFN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcclxuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRyZW1vdmVTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdHZhciBpZHggPSBob3RTdGF0dXNIYW5kbGVycy5pbmRleE9mKGwpO1xyXG4gXHRcdFx0XHRpZihpZHggPj0gMCkgaG90U3RhdHVzSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcclxuIFx0XHRcdC8vaW5oZXJpdCBmcm9tIHByZXZpb3VzIGRpc3Bvc2UgY2FsbFxyXG4gXHRcdFx0ZGF0YTogaG90Q3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdXHJcbiBcdFx0fTtcclxuIFx0XHRob3RDdXJyZW50Q2hpbGRNb2R1bGUgPSB1bmRlZmluZWQ7XHJcbiBcdFx0cmV0dXJuIGhvdDtcclxuIFx0fVxyXG4gXHRcclxuIFx0dmFyIGhvdFN0YXR1c0hhbmRsZXJzID0gW107XHJcbiBcdHZhciBob3RTdGF0dXMgPSBcImlkbGVcIjtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdFNldFN0YXR1cyhuZXdTdGF0dXMpIHtcclxuIFx0XHRob3RTdGF0dXMgPSBuZXdTdGF0dXM7XHJcbiBcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGhvdFN0YXR1c0hhbmRsZXJzLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0aG90U3RhdHVzSGFuZGxlcnNbaV0uY2FsbChudWxsLCBuZXdTdGF0dXMpO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHQvLyB3aGlsZSBkb3dubG9hZGluZ1xyXG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzID0gMDtcclxuIFx0dmFyIGhvdENodW5rc0xvYWRpbmcgPSAwO1xyXG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90QXZhaWxhYmxlRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdERlZmVycmVkO1xyXG4gXHRcclxuIFx0Ly8gVGhlIHVwZGF0ZSBpbmZvXHJcbiBcdHZhciBob3RVcGRhdGUsIGhvdFVwZGF0ZU5ld0hhc2g7XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiB0b01vZHVsZUlkKGlkKSB7XHJcbiBcdFx0dmFyIGlzTnVtYmVyID0gKCtpZCkgKyBcIlwiID09PSBpZDtcclxuIFx0XHRyZXR1cm4gaXNOdW1iZXIgPyAraWQgOiBpZDtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q2hlY2soYXBwbHkpIHtcclxuIFx0XHRpZihob3RTdGF0dXMgIT09IFwiaWRsZVwiKSB0aHJvdyBuZXcgRXJyb3IoXCJjaGVjaygpIGlzIG9ubHkgYWxsb3dlZCBpbiBpZGxlIHN0YXR1c1wiKTtcclxuIFx0XHRob3RBcHBseU9uVXBkYXRlID0gYXBwbHk7XHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiY2hlY2tcIik7XHJcbiBcdFx0cmV0dXJuIGhvdERvd25sb2FkTWFuaWZlc3QoKS50aGVuKGZ1bmN0aW9uKHVwZGF0ZSkge1xyXG4gXHRcdFx0aWYoIXVwZGF0ZSkge1xyXG4gXHRcdFx0XHRob3RTZXRTdGF0dXMoXCJpZGxlXCIpO1xyXG4gXHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuIFx0XHRcdH1cclxuIFx0XHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcclxuIFx0XHRcdGhvdEF2YWlsYWJsZUZpbGVzTWFwID0gdXBkYXRlLmM7XHJcbiBcdFx0XHRob3RVcGRhdGVOZXdIYXNoID0gdXBkYXRlLmg7XHJcbiBcdFxyXG4gXHRcdFx0aG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcclxuIFx0XHRcdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiBcdFx0XHRcdGhvdERlZmVycmVkID0ge1xyXG4gXHRcdFx0XHRcdHJlc29sdmU6IHJlc29sdmUsXHJcbiBcdFx0XHRcdFx0cmVqZWN0OiByZWplY3RcclxuIFx0XHRcdFx0fTtcclxuIFx0XHRcdH0pO1xyXG4gXHRcdFx0aG90VXBkYXRlID0ge307XHJcbiBcdFx0XHR2YXIgY2h1bmtJZCA9IDE7XHJcbiBcdFx0XHR7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbG9uZS1ibG9ja3NcclxuIFx0XHRcdFx0LypnbG9iYWxzIGNodW5rSWQgKi9cclxuIFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRpZihob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiICYmIGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiYgaG90V2FpdGluZ0ZpbGVzID09PSAwKSB7XHJcbiBcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdHJldHVybiBwcm9taXNlO1xyXG4gXHRcdH0pO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RBZGRVcGRhdGVDaHVuayhjaHVua0lkLCBtb3JlTW9kdWxlcykgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0aWYoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdIHx8ICFob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSlcclxuIFx0XHRcdHJldHVybjtcclxuIFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IGZhbHNlO1xyXG4gXHRcdGZvcih2YXIgbW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdGhvdFVwZGF0ZVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcdGlmKC0taG90V2FpdGluZ0ZpbGVzID09PSAwICYmIGhvdENodW5rc0xvYWRpbmcgPT09IDApIHtcclxuIFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcclxuIFx0XHR9XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpIHtcclxuIFx0XHRpZighaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0pIHtcclxuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XHJcbiBcdFx0fSBlbHNlIHtcclxuIFx0XHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gdHJ1ZTtcclxuIFx0XHRcdGhvdFdhaXRpbmdGaWxlcysrO1xyXG4gXHRcdFx0aG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKTtcclxuIFx0XHR9XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdFVwZGF0ZURvd25sb2FkZWQoKSB7XHJcbiBcdFx0aG90U2V0U3RhdHVzKFwicmVhZHlcIik7XHJcbiBcdFx0dmFyIGRlZmVycmVkID0gaG90RGVmZXJyZWQ7XHJcbiBcdFx0aG90RGVmZXJyZWQgPSBudWxsO1xyXG4gXHRcdGlmKCFkZWZlcnJlZCkgcmV0dXJuO1xyXG4gXHRcdGlmKGhvdEFwcGx5T25VcGRhdGUpIHtcclxuIFx0XHRcdGhvdEFwcGx5KGhvdEFwcGx5T25VcGRhdGUpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XHJcbiBcdFx0XHRcdGRlZmVycmVkLnJlc29sdmUocmVzdWx0KTtcclxuIFx0XHRcdH0sIGZ1bmN0aW9uKGVycikge1xyXG4gXHRcdFx0XHRkZWZlcnJlZC5yZWplY3QoZXJyKTtcclxuIFx0XHRcdH0pO1xyXG4gXHRcdH0gZWxzZSB7XHJcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0XHRmb3IodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xyXG4gXHRcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaG90VXBkYXRlLCBpZCkpIHtcclxuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaCh0b01vZHVsZUlkKGlkKSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHRcdGRlZmVycmVkLnJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHR9XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdEFwcGx5KG9wdGlvbnMpIHtcclxuIFx0XHRpZihob3RTdGF0dXMgIT09IFwicmVhZHlcIikgdGhyb3cgbmV3IEVycm9yKFwiYXBwbHkoKSBpcyBvbmx5IGFsbG93ZWQgaW4gcmVhZHkgc3RhdHVzXCIpO1xyXG4gXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gXHRcclxuIFx0XHR2YXIgY2I7XHJcbiBcdFx0dmFyIGk7XHJcbiBcdFx0dmFyIGo7XHJcbiBcdFx0dmFyIG1vZHVsZTtcclxuIFx0XHR2YXIgbW9kdWxlSWQ7XHJcbiBcdFxyXG4gXHRcdGZ1bmN0aW9uIGdldEFmZmVjdGVkU3R1ZmYodXBkYXRlTW9kdWxlSWQpIHtcclxuIFx0XHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbdXBkYXRlTW9kdWxlSWRdO1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XHJcbiBcdFxyXG4gXHRcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLnNsaWNlKCkubWFwKGZ1bmN0aW9uKGlkKSB7XHJcbiBcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0Y2hhaW46IFtpZF0sXHJcbiBcdFx0XHRcdFx0aWQ6IGlkXHJcbiBcdFx0XHRcdH07XHJcbiBcdFx0XHR9KTtcclxuIFx0XHRcdHdoaWxlKHF1ZXVlLmxlbmd0aCA+IDApIHtcclxuIFx0XHRcdFx0dmFyIHF1ZXVlSXRlbSA9IHF1ZXVlLnBvcCgpO1xyXG4gXHRcdFx0XHR2YXIgbW9kdWxlSWQgPSBxdWV1ZUl0ZW0uaWQ7XHJcbiBcdFx0XHRcdHZhciBjaGFpbiA9IHF1ZXVlSXRlbS5jaGFpbjtcclxuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdGlmKCFtb2R1bGUgfHwgbW9kdWxlLmhvdC5fc2VsZkFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRpZihtb2R1bGUuaG90Ll9zZWxmRGVjbGluZWQpIHtcclxuIFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWRlY2xpbmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXHJcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcclxuIFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKG1vZHVsZS5ob3QuX21haW4pIHtcclxuIFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJ1bmFjY2VwdGVkXCIsXHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXHJcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcclxuIFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBtb2R1bGUucGFyZW50cy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdHZhciBwYXJlbnRJZCA9IG1vZHVsZS5wYXJlbnRzW2ldO1xyXG4gXHRcdFx0XHRcdHZhciBwYXJlbnQgPSBpbnN0YWxsZWRNb2R1bGVzW3BhcmVudElkXTtcclxuIFx0XHRcdFx0XHRpZighcGFyZW50KSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRpZihwYXJlbnQuaG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcclxuIFx0XHRcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGVjbGluZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcclxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRwYXJlbnRJZDogcGFyZW50SWRcclxuIFx0XHRcdFx0XHRcdH07XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKG91dGRhdGVkTW9kdWxlcy5pbmRleE9mKHBhcmVudElkKSA+PSAwKSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRpZihwYXJlbnQuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0pXHJcbiBcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSA9IFtdO1xyXG4gXHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdLCBbbW9kdWxlSWRdKTtcclxuIFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdO1xyXG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHBhcmVudElkKTtcclxuIFx0XHRcdFx0XHRxdWV1ZS5wdXNoKHtcclxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXHJcbiBcdFx0XHRcdFx0XHRpZDogcGFyZW50SWRcclxuIFx0XHRcdFx0XHR9KTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcclxuIFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdHR5cGU6IFwiYWNjZXB0ZWRcIixcclxuIFx0XHRcdFx0bW9kdWxlSWQ6IHVwZGF0ZU1vZHVsZUlkLFxyXG4gXHRcdFx0XHRvdXRkYXRlZE1vZHVsZXM6IG91dGRhdGVkTW9kdWxlcyxcclxuIFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXM6IG91dGRhdGVkRGVwZW5kZW5jaWVzXHJcbiBcdFx0XHR9O1xyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0ZnVuY3Rpb24gYWRkQWxsVG9TZXQoYSwgYikge1xyXG4gXHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGIubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0dmFyIGl0ZW0gPSBiW2ldO1xyXG4gXHRcdFx0XHRpZihhLmluZGV4T2YoaXRlbSkgPCAwKVxyXG4gXHRcdFx0XHRcdGEucHVzaChpdGVtKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIGF0IGJlZ2luIGFsbCB1cGRhdGVzIG1vZHVsZXMgYXJlIG91dGRhdGVkXHJcbiBcdFx0Ly8gdGhlIFwib3V0ZGF0ZWRcIiBzdGF0dXMgY2FuIHByb3BhZ2F0ZSB0byBwYXJlbnRzIGlmIHRoZXkgZG9uJ3QgYWNjZXB0IHRoZSBjaGlsZHJlblxyXG4gXHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xyXG4gXHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcclxuIFx0XHR2YXIgYXBwbGllZFVwZGF0ZSA9IHt9O1xyXG4gXHRcclxuIFx0XHR2YXIgd2FyblVuZXhwZWN0ZWRSZXF1aXJlID0gZnVuY3Rpb24gd2FyblVuZXhwZWN0ZWRSZXF1aXJlKCkge1xyXG4gXHRcdFx0Y29uc29sZS53YXJuKFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIpIHRvIGRpc3Bvc2VkIG1vZHVsZVwiKTtcclxuIFx0XHR9O1xyXG4gXHRcclxuIFx0XHRmb3IodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZUlkID0gdG9Nb2R1bGVJZChpZCk7XHJcbiBcdFx0XHRcdHZhciByZXN1bHQ7XHJcbiBcdFx0XHRcdGlmKGhvdFVwZGF0ZVtpZF0pIHtcclxuIFx0XHRcdFx0XHRyZXN1bHQgPSBnZXRBZmZlY3RlZFN0dWZmKG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHRyZXN1bHQgPSB7XHJcbiBcdFx0XHRcdFx0XHR0eXBlOiBcImRpc3Bvc2VkXCIsXHJcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogaWRcclxuIFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdHZhciBhYm9ydEVycm9yID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBkb0FwcGx5ID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBkb0Rpc3Bvc2UgPSBmYWxzZTtcclxuIFx0XHRcdFx0dmFyIGNoYWluSW5mbyA9IFwiXCI7XHJcbiBcdFx0XHRcdGlmKHJlc3VsdC5jaGFpbikge1xyXG4gXHRcdFx0XHRcdGNoYWluSW5mbyA9IFwiXFxuVXBkYXRlIHByb3BhZ2F0aW9uOiBcIiArIHJlc3VsdC5jaGFpbi5qb2luKFwiIC0+IFwiKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRzd2l0Y2gocmVzdWx0LnR5cGUpIHtcclxuIFx0XHRcdFx0XHRjYXNlIFwic2VsZi1kZWNsaW5lZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIG9mIHNlbGYgZGVjbGluZTogXCIgKyByZXN1bHQubW9kdWxlSWQgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcImRlY2xpbmVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXCJBYm9ydGVkIGJlY2F1c2Ugb2YgZGVjbGluZWQgZGVwZW5kZW5jeTogXCIgKyByZXN1bHQubW9kdWxlSWQgKyBcIiBpbiBcIiArIHJlc3VsdC5wYXJlbnRJZCArIGNoYWluSW5mbyk7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwidW5hY2NlcHRlZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vblVuYWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25VbmFjY2VwdGVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVVbmFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIFwiICsgbW9kdWxlSWQgKyBcIiBpcyBub3QgYWNjZXB0ZWRcIiArIGNoYWluSW5mbyk7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwiYWNjZXB0ZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25BY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkFjY2VwdGVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRkb0FwcGx5ID0gdHJ1ZTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJkaXNwb3NlZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRpc3Bvc2VkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGlzcG9zZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGRvRGlzcG9zZSA9IHRydWU7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRkZWZhdWx0OlxyXG4gXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5leGNlcHRpb24gdHlwZSBcIiArIHJlc3VsdC50eXBlKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihhYm9ydEVycm9yKSB7XHJcbiBcdFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiYWJvcnRcIik7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGFib3J0RXJyb3IpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKGRvQXBwbHkpIHtcclxuIFx0XHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IGhvdFVwZGF0ZVttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCByZXN1bHQub3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHRcdFx0XHRmb3IobW9kdWxlSWQgaW4gcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XHJcbiBcdFx0XHRcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYoIW91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSlcclxuIFx0XHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0gPSBbXTtcclxuIFx0XHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdLCByZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKTtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYoZG9EaXNwb3NlKSB7XHJcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCBbcmVzdWx0Lm1vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSB3YXJuVW5leHBlY3RlZFJlcXVpcmU7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIFN0b3JlIHNlbGYgYWNjZXB0ZWQgb3V0ZGF0ZWQgbW9kdWxlcyB0byByZXF1aXJlIHRoZW0gbGF0ZXIgYnkgdGhlIG1vZHVsZSBzeXN0ZW1cclxuIFx0XHR2YXIgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0Zm9yKGkgPSAwOyBpIDwgb3V0ZGF0ZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRtb2R1bGVJZCA9IG91dGRhdGVkTW9kdWxlc1tpXTtcclxuIFx0XHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdICYmIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkKVxyXG4gXHRcdFx0XHRvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMucHVzaCh7XHJcbiBcdFx0XHRcdFx0bW9kdWxlOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRlcnJvckhhbmRsZXI6IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkXHJcbiBcdFx0XHRcdH0pO1xyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gTm93IGluIFwiZGlzcG9zZVwiIHBoYXNlXHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiZGlzcG9zZVwiKTtcclxuIFx0XHRPYmplY3Qua2V5cyhob3RBdmFpbGFibGVGaWxlc01hcCkuZm9yRWFjaChmdW5jdGlvbihjaHVua0lkKSB7XHJcbiBcdFx0XHRpZihob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSA9PT0gZmFsc2UpIHtcclxuIFx0XHRcdFx0aG90RGlzcG9zZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH0pO1xyXG4gXHRcclxuIFx0XHR2YXIgaWR4O1xyXG4gXHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpO1xyXG4gXHRcdHdoaWxlKHF1ZXVlLmxlbmd0aCA+IDApIHtcclxuIFx0XHRcdG1vZHVsZUlkID0gcXVldWUucG9wKCk7XHJcbiBcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdGlmKCFtb2R1bGUpIGNvbnRpbnVlO1xyXG4gXHRcclxuIFx0XHRcdHZhciBkYXRhID0ge307XHJcbiBcdFxyXG4gXHRcdFx0Ly8gQ2FsbCBkaXNwb3NlIGhhbmRsZXJzXHJcbiBcdFx0XHR2YXIgZGlzcG9zZUhhbmRsZXJzID0gbW9kdWxlLmhvdC5fZGlzcG9zZUhhbmRsZXJzO1xyXG4gXHRcdFx0Zm9yKGogPSAwOyBqIDwgZGlzcG9zZUhhbmRsZXJzLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdGNiID0gZGlzcG9zZUhhbmRsZXJzW2pdO1xyXG4gXHRcdFx0XHRjYihkYXRhKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXSA9IGRhdGE7XHJcbiBcdFxyXG4gXHRcdFx0Ly8gZGlzYWJsZSBtb2R1bGUgKHRoaXMgZGlzYWJsZXMgcmVxdWlyZXMgZnJvbSB0aGlzIG1vZHVsZSlcclxuIFx0XHRcdG1vZHVsZS5ob3QuYWN0aXZlID0gZmFsc2U7XHJcbiBcdFxyXG4gXHRcdFx0Ly8gcmVtb3ZlIG1vZHVsZSBmcm9tIGNhY2hlXHJcbiBcdFx0XHRkZWxldGUgaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFxyXG4gXHRcdFx0Ly8gcmVtb3ZlIFwicGFyZW50c1wiIHJlZmVyZW5jZXMgZnJvbSBhbGwgY2hpbGRyZW5cclxuIFx0XHRcdGZvcihqID0gMDsgaiA8IG1vZHVsZS5jaGlsZHJlbi5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHR2YXIgY2hpbGQgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZS5jaGlsZHJlbltqXV07XHJcbiBcdFx0XHRcdGlmKCFjaGlsZCkgY29udGludWU7XHJcbiBcdFx0XHRcdGlkeCA9IGNoaWxkLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSB7XHJcbiBcdFx0XHRcdFx0Y2hpbGQucGFyZW50cy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gcmVtb3ZlIG91dGRhdGVkIGRlcGVuZGVuY3kgZnJvbSBtb2R1bGUgY2hpbGRyZW5cclxuIFx0XHR2YXIgZGVwZW5kZW5jeTtcclxuIFx0XHR2YXIgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXM7XHJcbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0aWYobW9kdWxlKSB7XHJcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0Zm9yKGogPSAwOyBqIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBqKyspIHtcclxuIFx0XHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tqXTtcclxuIFx0XHRcdFx0XHRcdGlkeCA9IG1vZHVsZS5jaGlsZHJlbi5pbmRleE9mKGRlcGVuZGVuY3kpO1xyXG4gXHRcdFx0XHRcdFx0aWYoaWR4ID49IDApIG1vZHVsZS5jaGlsZHJlbi5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIE5vdCBpbiBcImFwcGx5XCIgcGhhc2VcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJhcHBseVwiKTtcclxuIFx0XHJcbiBcdFx0aG90Q3VycmVudEhhc2ggPSBob3RVcGRhdGVOZXdIYXNoO1xyXG4gXHRcclxuIFx0XHQvLyBpbnNlcnQgbmV3IGNvZGVcclxuIFx0XHRmb3IobW9kdWxlSWQgaW4gYXBwbGllZFVwZGF0ZSkge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFwcGxpZWRVcGRhdGUsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGVzW21vZHVsZUlkXSA9IGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gY2FsbCBhY2NlcHQgaGFuZGxlcnNcclxuIFx0XHR2YXIgZXJyb3IgPSBudWxsO1xyXG4gXHRcdGZvcihtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHR2YXIgY2FsbGJhY2tzID0gW107XHJcbiBcdFx0XHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldO1xyXG4gXHRcdFx0XHRcdGNiID0gbW9kdWxlLmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwZW5kZW5jeV07XHJcbiBcdFx0XHRcdFx0aWYoY2FsbGJhY2tzLmluZGV4T2YoY2IpID49IDApIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdGNhbGxiYWNrcy5wdXNoKGNiKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRmb3IoaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHRjYiA9IGNhbGxiYWNrc1tpXTtcclxuIFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0Y2IobW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMpO1xyXG4gXHRcdFx0XHRcdH0gY2F0Y2goZXJyKSB7XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XHJcbiBcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJhY2NlcHQtZXJyb3JlZFwiLFxyXG4gXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0XHRkZXBlbmRlbmN5SWQ6IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldLFxyXG4gXHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJcclxuIFx0XHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIExvYWQgc2VsZiBhY2NlcHRlZCBtb2R1bGVzXHJcbiBcdFx0Zm9yKGkgPSAwOyBpIDwgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHR2YXIgaXRlbSA9IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlc1tpXTtcclxuIFx0XHRcdG1vZHVsZUlkID0gaXRlbS5tb2R1bGU7XHJcbiBcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XHJcbiBcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKTtcclxuIFx0XHRcdH0gY2F0Y2goZXJyKSB7XHJcbiBcdFx0XHRcdGlmKHR5cGVvZiBpdGVtLmVycm9ySGFuZGxlciA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiBcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JIYW5kbGVyKGVycik7XHJcbiBcdFx0XHRcdFx0fSBjYXRjaChlcnIyKSB7XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XHJcbiBcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvci1oYW5kbGVyLWVycm9yZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVycjIsXHJcbiBcdFx0XHRcdFx0XHRcdFx0b3JnaW5hbEVycm9yOiBlcnJcclxuIFx0XHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjI7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdGVycm9yID0gZXJyO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHR9KTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIGhhbmRsZSBlcnJvcnMgaW4gYWNjZXB0IGhhbmRsZXJzIGFuZCBzZWxmIGFjY2VwdGVkIG1vZHVsZSBsb2FkXHJcbiBcdFx0aWYoZXJyb3IpIHtcclxuIFx0XHRcdGhvdFNldFN0YXR1cyhcImZhaWxcIik7XHJcbiBcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcclxuIFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xyXG4gXHRcdFx0cmVzb2x2ZShvdXRkYXRlZE1vZHVsZXMpO1xyXG4gXHRcdH0pO1xyXG4gXHR9XHJcblxuIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aG90OiBob3RDcmVhdGVNb2R1bGUobW9kdWxlSWQpLFxuIFx0XHRcdHBhcmVudHM6IChob3RDdXJyZW50UGFyZW50c1RlbXAgPSBob3RDdXJyZW50UGFyZW50cywgaG90Q3VycmVudFBhcmVudHMgPSBbXSwgaG90Q3VycmVudFBhcmVudHNUZW1wKSxcbiBcdFx0XHRjaGlsZHJlbjogW11cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkpO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIF9fd2VicGFja19oYXNoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18uaCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaG90Q3VycmVudEhhc2g7IH07XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIGhvdENyZWF0ZVJlcXVpcmUoMjQ5KShfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAyNDkpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDhiZDUzMjRjYjlmNTFlYmIyYWFmIiwibW9kdWxlLmV4cG9ydHMgPSB2ZW5kb3I7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJ2ZW5kb3JcIlxuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1IDYgNyA4IDkgMTAiLCJtb2R1bGUuZXhwb3J0cyA9IChfX3dlYnBhY2tfcmVxdWlyZV9fKDApKSg3Nik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL2pxdWVyeS9kaXN0L2pxdWVyeS5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgdmVuZG9yXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMSAyIDMgNCA2IDggOSAxMCIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBJbml0aWFsaXplIHRoZSBjb21wYXJhdG9yIG9iamVjdCB3aXRoIGEgY29tcGFyZSBmdW5jdGlvblxuICpcbiAqIElmIHRoZSBmdW5jdGlvbiBpcyBub3QgcGFzc2VkLCBpdCB3aWxsIHVzZSB0aGUgZGVmYXVsdFxuICogY29tcGFyZSBzaWducyAoPCwgPiBhbmQgPT0pXG4gKlxuICogQHBhcmFtIHsgRnVuY3Rpb24gfSBjb21wYXJlRm5cbiAqL1xuZnVuY3Rpb24gQ29tcGFyYXRvcihjb21wYXJlRm4pIHtcbiAgaWYgKGNvbXBhcmVGbikge1xuICAgIHRoaXMuY29tcGFyZSA9IGNvbXBhcmVGbjtcbiAgfVxufVxuXG4vKipcbiAqIERlZmF1bHQgaW1wbGVtZW50YXRpb24gZm9yIHRoZSBjb21wYXJlIGZ1bmN0aW9uXG4gKi9cbkNvbXBhcmF0b3IucHJvdG90eXBlLmNvbXBhcmUgPSBmdW5jdGlvbiAoYSwgYikge1xuICBpZiAoYSA9PT0gYikgcmV0dXJuIDA7XG4gIHJldHVybiBhIDwgYiA/IC0xIDogMTtcbn07XG5cbkNvbXBhcmF0b3IucHJvdG90eXBlLmxlc3NUaGFuID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgcmV0dXJuIHRoaXMuY29tcGFyZShhLCBiKSA8IDA7XG59O1xuXG5Db21wYXJhdG9yLnByb3RvdHlwZS5sZXNzVGhhbk9yRXF1YWwgPSBmdW5jdGlvbiAoYSwgYikge1xuICByZXR1cm4gdGhpcy5sZXNzVGhhbihhLCBiKSB8fCB0aGlzLmVxdWFsKGEsIGIpO1xufTtcblxuQ29tcGFyYXRvci5wcm90b3R5cGUuZ3JlYXRlclRoYW4gPSBmdW5jdGlvbiAoYSwgYikge1xuICByZXR1cm4gdGhpcy5jb21wYXJlKGEsIGIpID4gMDtcbn07XG5cbkNvbXBhcmF0b3IucHJvdG90eXBlLmdyZWF0ZXJUaGFuT3JFcXVhbCA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gIHJldHVybiB0aGlzLmdyZWF0ZXJUaGFuKGEsIGIpIHx8IHRoaXMuZXF1YWwoYSwgYik7XG59O1xuXG5Db21wYXJhdG9yLnByb3RvdHlwZS5lcXVhbCA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gIHJldHVybiB0aGlzLmNvbXBhcmUoYSwgYikgPT09IDA7XG59O1xuXG4vKipcbiAqIFJldmVyc2UgdGhlIGNvbXBhcmlzb24gZnVuY3Rpb24gdG8gdXNlIHRoZSBvcHBvc2l0ZSBsb2dpYywgZS5nOlxuICogdGhpcy5jb21wYXJlKGEsIGIpID0+IDFcbiAqIHRoaXMucmV2ZXJzZSgpO1xuICogdGhpcy5jb21wYXJlKGEsIGIpID0+IC0xXG4gKi9cbkNvbXBhcmF0b3IucHJvdG90eXBlLnJldmVyc2UgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBvcmlnaW5hbENvbXBhcmVGbiA9IHRoaXMuY29tcGFyZTtcbiAgdGhpcy5jb21wYXJlID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICByZXR1cm4gb3JpZ2luYWxDb21wYXJlRm4oYiwgYSk7XG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBhcmF0b3I7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYWxnb3JpdGhtcy91dGlsL2NvbXBhcmF0b3IuanNcbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgSGFzaFNldCA9IHJlcXVpcmUoJy4vc2V0Jyk7XG5cbi8qKlxuICogQWRqYWNlbmN5IGxpc3QgcmVwcmVzZW50YXRpb24gb2YgYSBncmFwaFxuICogQHBhcmFtIHtib29sfSBkaXJlY3RlZFxuICovXG5mdW5jdGlvbiBHcmFwaChkaXJlY3RlZCkge1xuICB0aGlzLmRpcmVjdGVkID0gKGRpcmVjdGVkID09PSB1bmRlZmluZWQgPyB0cnVlIDogISFkaXJlY3RlZCk7XG4gIHRoaXMuYWRqTGlzdCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIHRoaXMudmVydGljZXMgPSBuZXcgSGFzaFNldCgpO1xufVxuXG4vLyBOb3JtYWxpemUgdmVydGV4IGxhYmVscyBhcyBzdHJpbmdzXG52YXIgXyA9IGZ1bmN0aW9uICh2KSB7XG4gIHJldHVybiAnJyArIHY7XG59O1xuXG5HcmFwaC5wcm90b3R5cGUuYWRkVmVydGV4ID0gZnVuY3Rpb24gKHYpIHtcbiAgdiA9IF8odik7XG4gIGlmICh0aGlzLnZlcnRpY2VzLmNvbnRhaW5zKHYpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdWZXJ0ZXggXCInICsgdiArICdcIiBoYXMgYWxyZWFkeSBiZWVuIGFkZGVkJyk7XG4gIH1cbiAgdGhpcy52ZXJ0aWNlcy5hZGQodik7XG4gIHRoaXMuYWRqTGlzdFt2XSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG59O1xuXG5HcmFwaC5wcm90b3R5cGUuYWRkRWRnZSA9IGZ1bmN0aW9uIChhLCBiLCB3KSB7XG4gIGEgPSBfKGEpO1xuICBiID0gXyhiKTtcbiAgLy8gSWYgbm8gd2VpZ2h0IGlzIGFzc2lnbmVkIHRvIHRoZSBlZGdlLCAxIGlzIHRoZSBkZWZhdWx0XG4gIHcgPSAodyA9PT0gdW5kZWZpbmVkID8gMSA6IHcpO1xuXG4gIGlmICghdGhpcy5hZGpMaXN0W2FdKSB0aGlzLmFkZFZlcnRleChhKTtcbiAgaWYgKCF0aGlzLmFkakxpc3RbYl0pIHRoaXMuYWRkVmVydGV4KGIpO1xuXG4gIC8vIElmIHRoZXJlJ3MgYWxyZWFkeSBhbm90aGVyIGVkZ2Ugd2l0aCB0aGUgc2FtZSBvcmlnaW4gYW5kIGRlc3RpbmF0aW9uXG4gIC8vIHN1bSB3aXRoIHRoZSBjdXJyZW50IG9uZVxuICB0aGlzLmFkakxpc3RbYV1bYl0gPSAodGhpcy5hZGpMaXN0W2FdW2JdIHx8IDApICsgdztcblxuICAvLyBJZiB0aGUgZ3JhcGggaXMgbm90IGRpcmVjdGVkIGFkZCB0aGUgZWRnZSBpbiBib3RoIGRpcmVjdGlvbnNcbiAgaWYgKCF0aGlzLmRpcmVjdGVkKSB7XG4gICAgdGhpcy5hZGpMaXN0W2JdW2FdID0gKHRoaXMuYWRqTGlzdFtiXVthXSB8fCAwKSArIHc7XG4gIH1cbn07XG5cbkdyYXBoLnByb3RvdHlwZS5uZWlnaGJvcnMgPSBmdW5jdGlvbiAodikge1xuICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5hZGpMaXN0W18odildKTtcbn07XG5cbkdyYXBoLnByb3RvdHlwZS5lZGdlID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgcmV0dXJuIHRoaXMuYWRqTGlzdFtfKGEpXVtfKGIpXTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gR3JhcGg7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYWxnb3JpdGhtcy9kYXRhX3N0cnVjdHVyZXMvZ3JhcGguanNcbi8vIG1vZHVsZSBpZCA9IDU2XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIExpbmtlZExpc3QgPSByZXF1aXJlKCcuL2xpbmtlZF9saXN0Jyk7XG5cbi8qKlxuICogUXVldWUgKEZJRk8pIHVzaW5nIGEgTGlua2VkIExpc3QgYXMgYmFzaXNcbiAqL1xuZnVuY3Rpb24gUXVldWUoKSB7XG4gIHRoaXMuX2VsZW1lbnRzID0gbmV3IExpbmtlZExpc3QoKTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2xlbmd0aCcsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9lbGVtZW50cy5sZW5ndGg7XG4gICAgfS5iaW5kKHRoaXMpXG4gIH0pO1xufVxuXG5RdWV1ZS5wcm90b3R5cGUuaXNFbXB0eSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuX2VsZW1lbnRzLmlzRW1wdHkoKTtcbn07XG5cbi8qKlxuICogQWRkcyBlbGVtZW50IHRvIHRoZSBlbmQgb2YgdGhlIHF1ZXVlXG4gKi9cblF1ZXVlLnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24gKGUpIHtcbiAgdGhpcy5fZWxlbWVudHMuYWRkKGUpO1xufTtcblxuLyoqXG4gKiBQb3BzIHRoZSBlbGVtZW50IGluIHRoZSBiZWdpbm5pbmcgb2YgdGhlIHF1ZXVlXG4gKi9cblF1ZXVlLnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLmlzRW1wdHkoKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignRW1wdHkgcXVldWUnKTtcbiAgfVxuICB2YXIgZSA9IHRoaXMuX2VsZW1lbnRzLmdldCgwKTtcbiAgdGhpcy5fZWxlbWVudHMuZGVsKDApO1xuICByZXR1cm4gZTtcbn07XG5cblF1ZXVlLnByb3RvdHlwZS5wZWVrID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5pc0VtcHR5KCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0VtcHR5IHF1ZXVlJyk7XG4gIH1cblxuICByZXR1cm4gdGhpcy5fZWxlbWVudHMuZ2V0KDApO1xufTtcblxuUXVldWUucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAoZm4pIHtcbiAgdGhpcy5fZWxlbWVudHMuZm9yRWFjaChmbik7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFF1ZXVlO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2FsZ29yaXRobXMvZGF0YV9zdHJ1Y3R1cmVzL3F1ZXVlLmpzXG4vLyBtb2R1bGUgaWQgPSA1N1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBDYWxsYmFja3NcbiAqIEBwYXJhbSB7ZnVuY3Rpb24odmVydGV4OiAqLCBuZWlnaGJvcjogKik6IGJvb2xlYW59IGFsbG93VHJhdmVyc2FsIC1cbiAqICAgRGV0ZXJtaW5lcyB3aGV0aGVyIERGUyBzaG91bGQgdHJhdmVyc2UgZnJvbSB0aGUgdmVydGV4IHRvIGl0cyBuZWlnaGJvclxuICogICAoYWxvbmcgdGhlIGVkZ2UpLiBCeSBkZWZhdWx0IHByb2hpYml0cyB2aXNpdGluZyB0aGUgc2FtZSB2ZXJ0ZXggYWdhaW4uXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKHZlcnRleDogKiwgbmVpZ2hib3I6ICopfSBiZWZvcmVUcmF2ZXJzYWwgLSBDYWxsZWQgYmVmb3JlXG4gKiAgIHJlY3Vyc2l2ZSBERlMgY2FsbC5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24odmVydGV4OiAqLCBuZWlnaGJvcjogKil9IGFmdGVyVHJhdmVyc2FsIC0gQ2FsbGVkIGFmdGVyXG4gKiAgIHJlY3Vyc2l2ZSBERlMgY2FsbC5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24odmVydGV4OiAqKX0gZW50ZXJWZXJ0ZXggLSBDYWxsZWQgd2hlbiBERlMgZW50ZXJzIHRoZSB2ZXJ0ZXguXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKHZlcnRleDogKil9IGxlYXZlVmVydGV4IC0gQ2FsbGVkIHdoZW4gREZTIGxlYXZlcyB0aGUgdmVydGV4LlxuICovXG5cblxuLyoqXG4gKiBGaWxsIGluIG1pc3NpbmcgY2FsbGJhY2tzLlxuICogQHBhcmFtIHtDYWxsYmFja3N9IGNhbGxiYWNrc1xuICogQHBhcmFtIHtBcnJheX0gc2VlblZlcnRpY2VzIC0gVmVydGljZXMgYWxyZWFkeSBkaXNjb3ZlcmVkLFxuICogICB1c2VkIGJ5IGRlZmF1bHQgYWxsb3dUcmF2ZXJzYWwgaW1wbGVtZW50YXRpb24uXG4gKiBAcmV0dXJuIHtDYWxsYmFja3N9IFRoZSBzYW1lIG9iamVjdCBvciBuZXcgb25lIChpZiBudWxsIHBhc3NlZCkuXG4gKi9cbnZhciBub3JtYWxpemVDYWxsYmFja3MgPSBmdW5jdGlvbiAoY2FsbGJhY2tzLCBzZWVuVmVydGljZXMpIHtcbiAgY2FsbGJhY2tzID0gY2FsbGJhY2tzIHx8IHt9O1xuXG4gIGNhbGxiYWNrcy5hbGxvd1RyYXZlcnNhbCA9IGNhbGxiYWNrcy5hbGxvd1RyYXZlcnNhbCB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWVuID0ge307XG4gICAgc2VlblZlcnRpY2VzLmZvckVhY2goZnVuY3Rpb24gKHZlcnRleCkge1xuICAgICAgc2Vlblt2ZXJ0ZXhdID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIHJldHVybiBmdW5jdGlvbiAodmVydGV4LCBuZWlnaGJvcikge1xuICAgICAgLy8gSXQgc2hvdWxkIHN0aWxsIGJlIHBvc3NpYmxlIHRvIHJlZGVmaW5lIG90aGVyIGNhbGxiYWNrcyxcbiAgICAgIC8vIHNvIHdlIGJldHRlciBkbyBhbGwgYXQgb25jZSBoZXJlLlxuXG4gICAgICBpZiAoIXNlZW5bbmVpZ2hib3JdKSB7XG4gICAgICAgIHNlZW5bbmVpZ2hib3JdID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgfSkoKTtcblxuICB2YXIgbm9vcCA9IGZ1bmN0aW9uICgpIHt9O1xuICBjYWxsYmFja3MuYmVmb3JlVHJhdmVyc2FsID0gY2FsbGJhY2tzLmJlZm9yZVRyYXZlcnNhbCB8fCBub29wO1xuICBjYWxsYmFja3MuYWZ0ZXJUcmF2ZXJzYWwgPSBjYWxsYmFja3MuYWZ0ZXJUcmF2ZXJzYWwgfHwgbm9vcDtcbiAgY2FsbGJhY2tzLmVudGVyVmVydGV4ID0gY2FsbGJhY2tzLmVudGVyVmVydGV4IHx8IG5vb3A7XG4gIGNhbGxiYWNrcy5sZWF2ZVZlcnRleCA9IGNhbGxiYWNrcy5sZWF2ZVZlcnRleCB8fCBub29wO1xuXG4gIHJldHVybiBjYWxsYmFja3M7XG59O1xuXG5cbi8qKlxuICogUnVuIERlcHRoLUZpcnN0IFNlYXJjaCBmcm9tIGEgc3RhcnQgdmVydGV4LlxuICogQ29tcGxleGl0eSAoZGVmYXVsdCBpbXBsZW1lbnRhdGlvbik6IE8oViArIEUpLlxuICpcbiAqIEBwYXJhbSB7R3JhcGh9IGdyYXBoXG4gKiBAcGFyYW0geyp9IHN0YXJ0VmVydGV4XG4gKiBAcGFyYW0ge0NhbGxiYWNrc30gW2NhbGxiYWNrc11cbiAqL1xudmFyIGRlcHRoRmlyc3RTZWFyY2ggPSBmdW5jdGlvbiAoZ3JhcGgsIHN0YXJ0VmVydGV4LCBjYWxsYmFja3MpIHtcbiAgZGZzTG9vcChncmFwaCwgc3RhcnRWZXJ0ZXgsIG5vcm1hbGl6ZUNhbGxiYWNrcyhjYWxsYmFja3MsIFtzdGFydFZlcnRleF0pKTtcbn07XG5cblxudmFyIGRmc0xvb3AgPSBmdW5jdGlvbiBkZnNMb29wKGdyYXBoLCB2ZXJ0ZXgsIGNhbGxiYWNrcykge1xuICBjYWxsYmFja3MuZW50ZXJWZXJ0ZXgodmVydGV4KTtcblxuICBncmFwaC5uZWlnaGJvcnModmVydGV4KS5mb3JFYWNoKGZ1bmN0aW9uIChuZWlnaGJvcikge1xuICAgIGlmIChjYWxsYmFja3MuYWxsb3dUcmF2ZXJzYWwodmVydGV4LCBuZWlnaGJvcikpIHtcbiAgICAgIGNhbGxiYWNrcy5iZWZvcmVUcmF2ZXJzYWwodmVydGV4LCBuZWlnaGJvcik7XG4gICAgICBkZnNMb29wKGdyYXBoLCBuZWlnaGJvciwgY2FsbGJhY2tzKTtcbiAgICAgIGNhbGxiYWNrcy5hZnRlclRyYXZlcnNhbCh2ZXJ0ZXgsIG5laWdoYm9yKTtcbiAgICB9XG4gIH0pO1xuXG4gIGNhbGxiYWNrcy5sZWF2ZVZlcnRleCh2ZXJ0ZXgpO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlcHRoRmlyc3RTZWFyY2g7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYWxnb3JpdGhtcy9hbGdvcml0aG1zL2dyYXBoL2RlcHRoX2ZpcnN0X3NlYXJjaC5qc1xuLy8gbW9kdWxlIGlkID0gNTlcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xudmFyIENvbXBhcmF0b3IgPSByZXF1aXJlKCcuLi91dGlsL2NvbXBhcmF0b3InKTtcblxuLyoqXG4gKiBCYXNpYyBIZWFwIHN0cnVjdHVyZVxuICovXG5mdW5jdGlvbiBNaW5IZWFwKGNvbXBhcmVGbikge1xuICB0aGlzLl9lbGVtZW50cyA9IFtudWxsXTtcbiAgdGhpcy5fY29tcGFyYXRvciA9IG5ldyBDb21wYXJhdG9yKGNvbXBhcmVGbik7XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICduJywge1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRzLmxlbmd0aCAtIDE7XG4gICAgfS5iaW5kKHRoaXMpXG4gIH0pO1xufVxuXG5NaW5IZWFwLnByb3RvdHlwZS5fc3dhcCA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gIHZhciB0bXAgPSB0aGlzLl9lbGVtZW50c1thXTtcbiAgdGhpcy5fZWxlbWVudHNbYV0gPSB0aGlzLl9lbGVtZW50c1tiXTtcbiAgdGhpcy5fZWxlbWVudHNbYl0gPSB0bXA7XG59O1xuXG5NaW5IZWFwLnByb3RvdHlwZS5pc0VtcHR5ID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5uID09PSAwO1xufTtcblxuTWluSGVhcC5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24gKGUpIHtcbiAgdGhpcy5fZWxlbWVudHMucHVzaChlKTtcbiAgdGhpcy5fc2lmdFVwKCk7XG59O1xuXG5NaW5IZWFwLnByb3RvdHlwZS5leHRyYWN0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnRzWzFdO1xuXG4gIC8vIEdldCB0aGUgb25lIGZyb20gdGhlIGJvdHRvbSBpbiBpbnNlcnQgaXQgb24gdG9wXG4gIC8vIElmIHRoaXMgaXNuJ3QgYWxyZWFkeSB0aGUgbGFzdCBlbGVtZW50XG4gIHZhciBsYXN0ID0gdGhpcy5fZWxlbWVudHMucG9wKCk7XG4gIGlmICh0aGlzLm4pIHtcbiAgICB0aGlzLl9lbGVtZW50c1sxXSA9IGxhc3Q7XG4gICAgdGhpcy5fc2lmdERvd24oKTtcbiAgfVxuXG4gIHJldHVybiBlbGVtZW50O1xufTtcblxuLyoqXG4gKiBTaWZ0IHVwIHRoZSBsYXN0IGVsZW1lbnRcbiAqIE8obGcgbilcbiAqL1xuTWluSGVhcC5wcm90b3R5cGUuX3NpZnRVcCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGksIHBhcmVudDtcblxuICBmb3IgKGkgPSB0aGlzLm47XG4gICAgICBpID4gMSAmJiAocGFyZW50ID0gaSA+PiAxKSAmJiB0aGlzLl9jb21wYXJhdG9yLmdyZWF0ZXJUaGFuKFxuICAgICAgICB0aGlzLl9lbGVtZW50c1twYXJlbnRdLCB0aGlzLl9lbGVtZW50c1tpXSk7XG4gICAgICBpID0gcGFyZW50KSB7XG4gICAgdGhpcy5fc3dhcChwYXJlbnQsIGkpO1xuICB9XG59O1xuXG4vKipcbiAqIFNpZnRzIGRvd24gdGhlIGZpcnN0IGVsZW1lbnRcbiAqIE8obGcgbilcbiAqL1xuTWluSGVhcC5wcm90b3R5cGUuX3NpZnREb3duID0gZnVuY3Rpb24gKGkpIHtcbiAgdmFyIGM7XG4gIGZvciAoaSA9IGkgfHwgMTsgKGMgPSBpIDw8IDEpIDw9IHRoaXMubjsgaSA9IGMpIHtcbiAgICAvLyBjaGVja3Mgd2hpY2ggaXMgdGhlIHNtYWxsZXIgY2hpbGQgdG8gY29tcGFyZSB3aXRoXG4gICAgaWYgKGMgKyAxIDw9IHRoaXMubiAmJiB0aGlzLl9jb21wYXJhdG9yLmxlc3NUaGFuKFxuICAgICAgICAgIHRoaXMuX2VsZW1lbnRzW2MgKyAxXSwgdGhpcy5fZWxlbWVudHNbY10pKVxuICAgICAgLy8gdXNlIHRoZSByaWdodCBjaGlsZCBpZiBpdCdzIGxvd2VyIHRoYW4gdGhlIGxlZnQgb25lXG4gICAgICBjKys7XG4gICAgaWYgKHRoaXMuX2NvbXBhcmF0b3IubGVzc1RoYW4odGhpcy5fZWxlbWVudHNbaV0sXG4gICAgICAgICAgdGhpcy5fZWxlbWVudHNbY10pKVxuICAgICAgYnJlYWs7XG4gICAgdGhpcy5fc3dhcChpLCBjKTtcbiAgfVxufTtcblxuTWluSGVhcC5wcm90b3R5cGUuaGVhcGlmeSA9IGZ1bmN0aW9uIChhKSB7XG4gIGlmIChhKSB7XG4gICAgdGhpcy5fZWxlbWVudHMgPSBhO1xuICAgIHRoaXMuX2VsZW1lbnRzLnVuc2hpZnQobnVsbCk7XG4gIH1cblxuICBmb3IgKHZhciBpID0gdGhpcy5uID4+IDE7IGkgPiAwOyBpLS0pIHtcbiAgICB0aGlzLl9zaWZ0RG93bihpKTtcbiAgfVxufTtcblxuTWluSGVhcC5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIChmbikge1xuICAvLyBBIGNvcHkgaXMgbmVjZXNzYXJ5IGluIG9yZGVyIHRvIHBlcmZvcm0gZXh0cmFjdCgpLFxuICAvLyBnZXQgdGhlIGl0ZW1zIGluIHNvcnRlZCBvcmRlciBhbmQgdGhlbiByZXN0b3JlIHRoZSBvcmlnaW5hbFxuICAvLyB0aGlzLl9lbGVtZW50cyBhcnJheVxuICB2YXIgZWxlbWVudHNDb3B5ID0gW107XG4gIHZhciBpO1xuXG4gIGZvciAoaSA9IDA7IGkgPCB0aGlzLl9lbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgIGVsZW1lbnRzQ29weS5wdXNoKHRoaXMuX2VsZW1lbnRzW2ldKTtcbiAgfVxuXG4gIGZvciAoaSA9IHRoaXMubjsgaSA+IDA7IGktLSkge1xuICAgIGZuKHRoaXMuZXh0cmFjdCgpKTtcbiAgfVxuXG4gIHRoaXMuX2VsZW1lbnRzID0gZWxlbWVudHNDb3B5O1xufTtcblxuLyoqXG4gKiBNYXggSGVhcCwga2VlcHMgdGhlIGhpZ2hlc3QgZWxlbWVudCBhbHdheXMgb24gdG9wXG4gKlxuICogVG8gYXZvaWQgY29kZSByZXBldGl0aW9uLCB0aGUgTWluIEhlYXAgaXMgdXNlZCBqdXN0IHdpdGhcbiAqIGEgcmV2ZXJzZSBjb21wYXJhdG9yO1xuICovXG5mdW5jdGlvbiBNYXhIZWFwKGNvbXBhcmVGbikge1xuXG4gIE1pbkhlYXAuY2FsbCh0aGlzLCBjb21wYXJlRm4pO1xuICB0aGlzLl9jb21wYXJhdG9yLnJldmVyc2UoKTtcbn1cblxuTWF4SGVhcC5wcm90b3R5cGUgPSBuZXcgTWluSGVhcCgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgTWluSGVhcDogTWluSGVhcCxcbiAgTWF4SGVhcDogTWF4SGVhcFxufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9hbGdvcml0aG1zL2RhdGFfc3RydWN0dXJlcy9oZWFwLmpzXG4vLyBtb2R1bGUgaWQgPSA2MFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRG91Ymx5LWxpbmtlZCBsaXN0XG4gKi9cbmZ1bmN0aW9uIExpbmtlZExpc3QoKSB7XG5cbiAgdGhpcy5fbGVuZ3RoID0gMDtcbiAgdGhpcy5oZWFkID0gbnVsbDtcbiAgdGhpcy50YWlsID0gbnVsbDtcblxuICAvLyBSZWFkLW9ubHkgbGVuZ3RoIHByb3BlcnR5XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbGVuZ3RoJywge1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2xlbmd0aDtcbiAgICB9LmJpbmQodGhpcylcbiAgfSk7XG59XG5cbi8qKlxuICogQSBsaW5rZWQgbGlzdCBub2RlXG4gKi9cbmZ1bmN0aW9uIE5vZGUodmFsdWUpIHtcbiAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICB0aGlzLnByZXYgPSBudWxsO1xuICB0aGlzLm5leHQgPSBudWxsO1xufVxuXG4vKipcbiAqIFdoZXRoZXIgdGhlIGxpc3QgaXMgZW1wdHlcbiAqXG4gKiBAcmV0dXJuIEJvb2xlYW5cbiAqL1xuTGlua2VkTGlzdC5wcm90b3R5cGUuaXNFbXB0eSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMubGVuZ3RoID09PSAwO1xufTtcblxuLyoqXG4gKiBBZGRzIHRoZSBlbGVtZW50IHRvIHRoZSBlbmQgb2YgdGhlIGxpc3Qgb3IgdG8gdGhlIGRlc2lyZWQgaW5kZXhcbiAqXG4gKiBAcGFyYW0geyBPYmplY3QgfSBuXG4gKiBAcGFyYW0geyBOdW1iZXIgfSBpbmRleFxuICovXG5MaW5rZWRMaXN0LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAobiwgaW5kZXgpIHtcbiAgaWYgKGluZGV4ID4gdGhpcy5sZW5ndGggfHwgaW5kZXggPCAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbmRleCBvdXQgb2YgYm91bmRzJyk7XG4gIH1cblxuICB2YXIgbm9kZSA9IG5ldyBOb2RlKG4pO1xuXG4gIGlmIChpbmRleCAhPT0gdW5kZWZpbmVkICYmIGluZGV4IDwgdGhpcy5sZW5ndGgpIHtcbiAgICB2YXIgcHJldk5vZGUsXG4gICAgICAgIG5leHROb2RlO1xuXG4gICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAvLyBJbnNlcnQgaW4gdGhlIGJlZ2lubmluZ1xuICAgICAgbmV4dE5vZGUgPSB0aGlzLmhlYWQ7XG4gICAgICB0aGlzLmhlYWQgPSBub2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXh0Tm9kZSA9IHRoaXMuZ2V0Tm9kZShpbmRleCk7XG4gICAgICBwcmV2Tm9kZSA9IG5leHROb2RlLnByZXY7XG4gICAgICBwcmV2Tm9kZS5uZXh0ID0gbm9kZTtcbiAgICAgIG5vZGUucHJldiA9IHByZXZOb2RlO1xuICAgIH1cbiAgICBuZXh0Tm9kZS5wcmV2ID0gbm9kZTtcbiAgICBub2RlLm5leHQgPSBuZXh0Tm9kZTtcbiAgfSBlbHNlIHtcbiAgICAvLyBJbnNlcnQgYXQgdGhlIGVuZFxuICAgIGlmICghdGhpcy5oZWFkKSB0aGlzLmhlYWQgPSBub2RlO1xuXG4gICAgaWYgKHRoaXMudGFpbCkge1xuICAgICAgdGhpcy50YWlsLm5leHQgPSBub2RlO1xuICAgICAgbm9kZS5wcmV2ID0gdGhpcy50YWlsO1xuICAgIH1cbiAgICB0aGlzLnRhaWwgPSBub2RlO1xuICB9XG5cbiAgdGhpcy5fbGVuZ3RoKys7XG59O1xuXG4vKipcbiAqIFJldHVybiB0aGUgdmFsdWUgYXNzb2NpYXRlZCB0byB0aGUgTm9kZSBvbiB0aGUgZ2l2ZW4gaW5kZXhcbiAqXG4gKiBAcGFyYW0geyBOdW1iZXIgfSBpbmRleFxuICogQHJldHVybiBtaXNjXG4gKi9cbkxpbmtlZExpc3QucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChpbmRleCkge1xuICByZXR1cm4gdGhpcy5nZXROb2RlKGluZGV4KS52YWx1ZTtcbn07XG5cbi8qKlxuICogTyhuKSBnZXRcbiAqXG4gKiBAcGFyYW0geyBOdW1iZXIgfSBpbmRleFxuICogQHJldHVybiBOb2RlXG4gKi9cbkxpbmtlZExpc3QucHJvdG90eXBlLmdldE5vZGUgPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgaWYgKGluZGV4ID49IHRoaXMubGVuZ3RoIHx8IGluZGV4IDwgMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW5kZXggb3V0IG9mIGJvdW5kcycpO1xuICB9XG5cbiAgdmFyIG5vZGUgPSB0aGlzLmhlYWQ7XG4gIGZvciAodmFyIGkgPSAxOyBpIDw9IGluZGV4OyBpKyspIHtcbiAgICBub2RlID0gbm9kZS5uZXh0O1xuICB9XG5cbiAgcmV0dXJuIG5vZGU7XG59O1xuXG4vKipcbiAqIERlbGV0ZSB0aGUgZWxlbWVudCBpbiB0aGUgaW5kZXh0aCBwb3NpdGlvblxuICpcbiAqIEBwYXJhbSB7IE51bWJlciB9IGluZGV4XG4gKi9cbkxpbmtlZExpc3QucHJvdG90eXBlLmRlbCA9IGZ1bmN0aW9uIChpbmRleCkge1xuICBpZiAoaW5kZXggPj0gdGhpcy5sZW5ndGggfHwgaW5kZXggPCAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbmRleCBvdXQgb2YgYm91bmRzJyk7XG4gIH1cblxuICB0aGlzLmRlbE5vZGUodGhpcy5nZXROb2RlKGluZGV4KSk7XG59O1xuXG5MaW5rZWRMaXN0LnByb3RvdHlwZS5kZWxOb2RlID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgaWYgKG5vZGUgPT09IHRoaXMudGFpbCkge1xuICAgIC8vIG5vZGUgaXMgdGhlIGxhc3QgZWxlbWVudFxuICAgIHRoaXMudGFpbCA9IG5vZGUucHJldjtcbiAgfSBlbHNlIHtcbiAgICBub2RlLm5leHQucHJldiA9IG5vZGUucHJldjtcbiAgfVxuICBpZiAobm9kZSA9PT0gdGhpcy5oZWFkKSB7XG4gICAgLy8gbm9kZSBpcyB0aGUgZmlyc3QgZWxlbWVudFxuICAgIHRoaXMuaGVhZCA9IG5vZGUubmV4dDtcbiAgfSBlbHNlIHtcbiAgICBub2RlLnByZXYubmV4dCA9IG5vZGUubmV4dDtcbiAgfVxuXG4gIHRoaXMuX2xlbmd0aC0tO1xufTtcblxuLyoqXG4gKiBQZXJmb3JtcyB0aGUgZm4gZnVuY3Rpb24gd2l0aCBlYWNoIGVsZW1lbnQgaW4gdGhlIGxpc3RcbiAqL1xuTGlua2VkTGlzdC5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIChmbikge1xuICB2YXIgbm9kZSA9IHRoaXMuaGVhZDtcbiAgd2hpbGUgKG5vZGUpIHtcbiAgICBmbihub2RlLnZhbHVlKTtcbiAgICBub2RlID0gbm9kZS5uZXh0O1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExpbmtlZExpc3Q7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYWxnb3JpdGhtcy9kYXRhX3N0cnVjdHVyZXMvbGlua2VkX2xpc3QuanNcbi8vIG1vZHVsZSBpZCA9IDYxXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIE1pbkhlYXAgPSByZXF1aXJlKCcuL2hlYXAnKS5NaW5IZWFwO1xuXG4vKipcbiAqIEV4dGVuZHMgdGhlIE1pbkhlYXAgd2l0aCB0aGUgb25seSBkaWZmZXJlbmNlIHRoYXRcbiAqIHRoZSBoZWFwIG9wZXJhdGlvbnMgYXJlIHBlcmZvcm1lZCBiYXNlZCBvbiB0aGUgcHJpb3JpdHkgb2YgdGhlIGVsZW1lbnRcbiAqIGFuZCBub3Qgb24gdGhlIGVsZW1lbnQgaXRzZWxmXG4gKi9cbmZ1bmN0aW9uIFByaW9yaXR5UXVldWUoaW5pdGlhbEl0ZW1zKSB7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBNaW5IZWFwLmNhbGwodGhpcywgZnVuY3Rpb24gKGEsIGIpIHtcbiAgICByZXR1cm4gc2VsZi5wcmlvcml0eShhKSA8IHNlbGYucHJpb3JpdHkoYikgPyAtMSA6IDE7XG4gIH0pO1xuXG4gIHRoaXMuX3ByaW9yaXR5ID0ge307XG5cbiAgaW5pdGlhbEl0ZW1zID0gaW5pdGlhbEl0ZW1zIHx8IHt9O1xuICBPYmplY3Qua2V5cyhpbml0aWFsSXRlbXMpLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICBzZWxmLmluc2VydChpdGVtLCBpbml0aWFsSXRlbXNbaXRlbV0pO1xuICB9KTtcbn1cblxuUHJpb3JpdHlRdWV1ZS5wcm90b3R5cGUgPSBuZXcgTWluSGVhcCgpO1xuXG5Qcmlvcml0eVF1ZXVlLnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbiAoaXRlbSwgcHJpb3JpdHkpIHtcbiAgaWYgKHRoaXMuX3ByaW9yaXR5W2l0ZW1dICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gdGhpcy5jaGFuZ2VQcmlvcml0eShpdGVtLCBwcmlvcml0eSk7XG4gIH1cbiAgdGhpcy5fcHJpb3JpdHlbaXRlbV0gPSBwcmlvcml0eTtcbiAgTWluSGVhcC5wcm90b3R5cGUuaW5zZXJ0LmNhbGwodGhpcywgaXRlbSk7XG59O1xuXG5Qcmlvcml0eVF1ZXVlLnByb3RvdHlwZS5leHRyYWN0ID0gZnVuY3Rpb24gKHdpdGhQcmlvcml0eSkge1xuICB2YXIgbWluID0gTWluSGVhcC5wcm90b3R5cGUuZXh0cmFjdC5jYWxsKHRoaXMpO1xuICByZXR1cm4gd2l0aFByaW9yaXR5ID9cbiAgICBtaW4gJiYge2l0ZW06IG1pbiwgcHJpb3JpdHk6IHRoaXMuX3ByaW9yaXR5W21pbl19IDpcbiAgICBtaW47XG59O1xuXG5Qcmlvcml0eVF1ZXVlLnByb3RvdHlwZS5wcmlvcml0eSA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHJldHVybiB0aGlzLl9wcmlvcml0eVtpdGVtXTtcbn07XG5cblByaW9yaXR5UXVldWUucHJvdG90eXBlLmNoYW5nZVByaW9yaXR5ID0gZnVuY3Rpb24gKGl0ZW0sIHByaW9yaXR5KSB7XG4gIHRoaXMuX3ByaW9yaXR5W2l0ZW1dID0gcHJpb3JpdHk7XG4gIHRoaXMuaGVhcGlmeSgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcmlvcml0eVF1ZXVlO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2FsZ29yaXRobXMvZGF0YV9zdHJ1Y3R1cmVzL3ByaW9yaXR5X3F1ZXVlLmpzXG4vLyBtb2R1bGUgaWQgPSA2MlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciBRdWV1ZSA9IHJlcXVpcmUoJy4uLy4uL2RhdGFfc3RydWN0dXJlcy9xdWV1ZScpO1xuXG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gQ2FsbGJhY2tzXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKHZlcnRleDogKiwgbmVpZ2hib3I6ICopOiBib29sZWFufSBhbGxvd1RyYXZlcnNhbCAtXG4gKiAgIERldGVybWluZXMgd2hldGhlciBCRlMgc2hvdWxkIHRyYXZlcnNlIGZyb20gdGhlIHZlcnRleCB0byBpdHMgbmVpZ2hib3JcbiAqICAgKGFsb25nIHRoZSBlZGdlKS4gQnkgZGVmYXVsdCBwcm9oaWJpdHMgdmlzaXRpbmcgdGhlIHNhbWUgdmVydGV4IGFnYWluLlxuICogQHBhcmFtIHtmdW5jdGlvbih2ZXJ0ZXg6ICosIG5laWdoYm9yOiAqKX0gb25UcmF2ZXJzYWwgLSBDYWxsZWQgd2hlbiBCRlNcbiAqICAgZm9sbG93cyB0aGUgZWRnZSAoYW5kIHB1dHMgaXRzIGhlYWQgaW50byB0aGUgcXVldWUpLlxuICogQHBhcmFtIHtmdW5jdGlvbih2ZXJ0ZXg6ICopfSBlbnRlclZlcnRleCAtIENhbGxlZCB3aGVuIEJGUyBlbnRlcnMgdGhlIHZlcnRleC5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24odmVydGV4OiAqKX0gbGVhdmVWZXJ0ZXggLSBDYWxsZWQgd2hlbiBCRlMgbGVhdmVzIHRoZSB2ZXJ0ZXguXG4gKi9cblxuXG4vKipcbiAqIEZpbGwgaW4gbWlzc2luZyBjYWxsYmFja3MuXG4gKlxuICogQHBhcmFtIHtDYWxsYmFja3N9IGNhbGxiYWNrc1xuICogQHBhcmFtIHtBcnJheX0gc2VlblZlcnRpY2VzIC0gVmVydGljZXMgYWxyZWFkeSBkaXNjb3ZlcmVkLFxuICogICB1c2VkIGJ5IGRlZmF1bHQgYWxsb3dUcmF2ZXJzYWwgaW1wbGVtZW50YXRpb24uXG4gKiBAcmV0dXJuIHtDYWxsYmFja3N9IFRoZSBzYW1lIG9iamVjdCBvciBuZXcgb25lIChpZiBudWxsIHBhc3NlZCkuXG4gKi9cbnZhciBub3JtYWxpemVDYWxsYmFja3MgPSBmdW5jdGlvbiAoY2FsbGJhY2tzLCBzZWVuVmVydGljZXMpIHtcbiAgY2FsbGJhY2tzID0gY2FsbGJhY2tzIHx8IHt9O1xuXG4gIGNhbGxiYWNrcy5hbGxvd1RyYXZlcnNhbCA9IGNhbGxiYWNrcy5hbGxvd1RyYXZlcnNhbCB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWVuID0gc2VlblZlcnRpY2VzLnJlZHVjZShmdW5jdGlvbiAoc2VlbiwgdmVydGV4KSB7XG4gICAgICBzZWVuW3ZlcnRleF0gPSB0cnVlO1xuICAgICAgcmV0dXJuIHNlZW47XG4gICAgfSwge30pO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh2ZXJ0ZXgsIG5laWdoYm9yKSB7XG4gICAgICBpZiAoIXNlZW5bbmVpZ2hib3JdKSB7XG4gICAgICAgIHNlZW5bbmVpZ2hib3JdID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH07XG4gIH0pKCk7XG5cbiAgdmFyIG5vb3AgPSBmdW5jdGlvbiAoKSB7fTtcbiAgY2FsbGJhY2tzLm9uVHJhdmVyc2FsID0gY2FsbGJhY2tzLm9uVHJhdmVyc2FsIHx8IG5vb3A7XG4gIGNhbGxiYWNrcy5lbnRlclZlcnRleCA9IGNhbGxiYWNrcy5lbnRlclZlcnRleCB8fCBub29wO1xuICBjYWxsYmFja3MubGVhdmVWZXJ0ZXggPSBjYWxsYmFja3MubGVhdmVWZXJ0ZXggfHwgbm9vcDtcblxuICByZXR1cm4gY2FsbGJhY2tzO1xufTtcblxuXG4vKipcbiAqIFJ1biBCcmVhZHRoLUZpcnN0IFNlYXJjaCBmcm9tIGEgc3RhcnQgdmVydGV4LlxuICogQ29tcGxleGl0eSAoZGVmYXVsdCBpbXBsZW1lbnRhdGlvbik6IE8oViArIEUpLlxuICpcbiAqIEBwYXJhbSB7R3JhcGh9IGdyYXBoXG4gKiBAcGFyYW0geyp9IHN0YXJ0VmVydGV4XG4gKiBAcGFyYW0ge0NhbGxiYWNrc30gW2NhbGxiYWNrc11cbiAqL1xudmFyIGJyZWFkdGhGaXJzdFNlYXJjaCA9IGZ1bmN0aW9uIChncmFwaCwgc3RhcnRWZXJ0ZXgsIGNhbGxiYWNrcykge1xuICB2YXIgdmVydGV4UXVldWUgPSBuZXcgUXVldWUoKTtcbiAgdmVydGV4UXVldWUucHVzaChzdGFydFZlcnRleCk7XG4gIGNhbGxiYWNrcyA9IG5vcm1hbGl6ZUNhbGxiYWNrcyhjYWxsYmFja3MsIFtzdGFydFZlcnRleF0pO1xuXG4gIHZhciB2ZXJ0ZXg7XG4gIHZhciBlbnF1ZXVlID0gZnVuY3Rpb24gKG5laWdoYm9yKSB7XG4gICAgaWYgKGNhbGxiYWNrcy5hbGxvd1RyYXZlcnNhbCh2ZXJ0ZXgsIG5laWdoYm9yKSkge1xuICAgICAgY2FsbGJhY2tzLm9uVHJhdmVyc2FsKHZlcnRleCwgbmVpZ2hib3IpO1xuICAgICAgdmVydGV4UXVldWUucHVzaChuZWlnaGJvcik7XG4gICAgfVxuICB9O1xuXG4gIHdoaWxlICghdmVydGV4UXVldWUuaXNFbXB0eSgpKSB7XG4gICAgdmVydGV4ID0gdmVydGV4UXVldWUucG9wKCk7XG4gICAgY2FsbGJhY2tzLmVudGVyVmVydGV4KHZlcnRleCk7XG4gICAgZ3JhcGgubmVpZ2hib3JzKHZlcnRleCkuZm9yRWFjaChlbnF1ZXVlKTtcbiAgICBjYWxsYmFja3MubGVhdmVWZXJ0ZXgodmVydGV4KTtcbiAgfVxufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGJyZWFkdGhGaXJzdFNlYXJjaDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9hbGdvcml0aG1zL2FsZ29yaXRobXMvZ3JhcGgvYnJlYWR0aF9maXJzdF9zZWFyY2guanNcbi8vIG1vZHVsZSBpZCA9IDEwNVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cblxudmFyIG11bHRpcGxpY2F0aW9uT3BlcmF0b3IgPSBmdW5jdGlvbiAoYSwgYikge1xuICByZXR1cm4gYSAqIGI7XG59O1xuXG5cbi8qKlxuICogUmFpc2UgdmFsdWUgdG8gYSBwb3NpdGl2ZSBpbnRlZ2VyIHBvd2VyIGJ5IHJlcGVhdGVkIHNxdWFyaW5nLlxuICpcbiAqIEBwYXJhbSB7Kn0gYmFzZVxuICogQHBhcmFtIHtudW1iZXJ9IHBvd2VyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbbXVsXSAtIE11bHRpcGxpY2F0aW9uIGZ1bmN0aW9uLFxuICogICBzdGFuZGFyZCBtdWx0aXBsaWNhdGlvbiBvcGVyYXRvciBieSBkZWZhdWx0LlxuICogQHBhcmFtIHsqfSBpZGVudGl0eSAtIElkZW50aXR5IHZhbHVlLCB1c2VkIHdoZW4gcG93ZXIgPT0gMC5cbiAqICAgSWYgbXVsIGlzIG5vdCBzZXQsIGRlZmF1bHRzIHRvIDEuXG4gKiBAcmV0dXJuIHsqfVxuICovXG52YXIgZmFzdFBvd2VyID0gZnVuY3Rpb24gKGJhc2UsIHBvd2VyLCBtdWwsIGlkZW50aXR5KSB7XG4gIGlmIChtdWwgPT09IHVuZGVmaW5lZCkge1xuICAgIG11bCA9IG11bHRpcGxpY2F0aW9uT3BlcmF0b3I7XG4gICAgaWRlbnRpdHkgPSAxO1xuICB9XG4gIGlmIChwb3dlciA8IDAgfHwgTWF0aC5mbG9vcihwb3dlcikgIT09IHBvd2VyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdQb3dlciBtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlciBvciB6ZXJvLicpO1xuICB9XG5cbiAgLy8gSWYgdGhlIHBvd2VyIGlzIHplcm8sIGlkZW50aXR5IHZhbHVlIG11c3QgYmUgZ2l2ZW4gKG9yIHNldCBieSBkZWZhdWx0KS5cbiAgaWYgKCFwb3dlcikge1xuICAgIGlmIChpZGVudGl0eSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBwb3dlciBpcyB6ZXJvLCBidXQgaWRlbnRpdHkgdmFsdWUgbm90IHNldC4nKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gaWRlbnRpdHk7XG4gICAgfVxuICB9XG5cbiAgLy8gSXRlcmF0aXZlIGZvcm0gb2YgdGhlIGFsZ29yaXRobSBhdm9pZHMgY2hlY2tpbmcgdGhlIHNhbWUgdGhpbmcgdHdpY2UuXG4gIHZhciByZXN1bHQ7XG4gIHZhciBtdWx0aXBseUJ5ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmVzdWx0ID0gKHJlc3VsdCA9PT0gdW5kZWZpbmVkKSA/IHZhbHVlIDogbXVsKHJlc3VsdCwgdmFsdWUpO1xuICB9O1xuICBmb3IgKHZhciBmYWN0b3IgPSBiYXNlOyBwb3dlcjsgcG93ZXIgPj4+PSAxLCBmYWN0b3IgPSBtdWwoZmFjdG9yLCBmYWN0b3IpKSB7XG4gICAgaWYgKHBvd2VyICYgMSkge1xuICAgICAgbXVsdGlwbHlCeShmYWN0b3IpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZhc3RQb3dlcjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9hbGdvcml0aG1zL2FsZ29yaXRobXMvbWF0aC9mYXN0X3Bvd2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAxMDZcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEV1Y2xpZGVhbiBhbGdvcml0aG0gdG8gY2FsY3VsYXRlIHRoZSBHcmVhdGVzdCBDb21tb24gRGl2aXNvciAoR0NEKVxuICpcbiAqIEBwYXJhbSBOdW1iZXJcbiAqIEBwYXJhbSBOdW1iZXJcbiAqXG4gKiBAcmV0dXJuIE51bWJlclxuICovXG52YXIgZ2NkRGl2aXNpb25CYXNlZCA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gIHZhciB0bXAgPSBhO1xuICBhID0gTWF0aC5tYXgoYSwgYik7XG4gIGIgPSBNYXRoLm1pbih0bXAsIGIpO1xuICB3aGlsZSAoYiAhPT0gMCkge1xuICAgIHRtcCA9IGI7XG4gICAgYiA9IGEgJSBiO1xuICAgIGEgPSB0bXA7XG4gIH1cblxuICByZXR1cm4gYTtcbn07XG5cbi8qKlxuICogQmluYXJ5IEdDRCBhbGdvcml0aG0gKFN0ZWluJ3MgQWxnb3JpdGhtKVxuICpcbiAqIEBsaW5rIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0JpbmFyeV9HQ0RfYWxnb3JpdGhtXG4gKiBUaGlzIGlzIGJhc2ljYWxseSBhIGpzIHZlcnNpb24gb2YgdGhlIGMgaW1wbGVtZW50YXRpb24gb24gV2lraXBlZGlhXG4gKlxuICogQHBhcmFtIE51bWJlclxuICogQHBhcmFtIE51bWJlclxuICpcbiAqIEByZXR1cm4gTnVtYmVyXG4gKi9cbnZhciBnY2RCaW5hcnlJdGVyYXRpdmUgPSBmdW5jdGlvbiAoYSwgYikge1xuXG4gIC8vIEdDRCgwLGIpID09IGI7IEdDRChhLDApID09IGEsIEdDRCgwLDApID09IDBcbiAgaWYgKGEgPT09IDApIHtcbiAgICByZXR1cm4gYjtcbiAgfVxuXG4gIGlmIChiID09PSAwKSB7XG4gICAgcmV0dXJuIGE7XG4gIH1cblxuICB2YXIgc2hpZnQ7XG4gIC8vIExldCBzaGlmdCA9IGxvZyhLKSwgd2hlcmUgSyBpcyB0aGUgZ3JlYXRlc3QgcG93ZXIgb2YgMlxuICAvLyBkaXZpZGluZyBib3RoIGEgYW5kIGJcbiAgZm9yIChzaGlmdCA9IDA7ICgoYSB8IGIpICYgMSkgPT09IDA7ICsrc2hpZnQpIHtcbiAgICBhID4+PSAxO1xuICAgIGIgPj49IDE7XG4gIH1cblxuICAvLyBSZW1vdmUgYWxsIGZhY3RvcnMgb2YgMiBpbiBhIC0tIHRoZXkgYXJlIG5vdCBjb21tb25cbiAgLy8gTm90ZTogYSBpcyBub3QgemVybywgc28gd2hpbGUgd2lsbCB0ZXJtaW5hdGVcbiAgd2hpbGUgKChhICYgMSkgPT09IDApIHtcbiAgICBhID4+PSAxO1xuICB9XG5cbiAgdmFyIHRtcDtcblxuICAvLyBGcm9tIGhlcmUgb24sIGEgaXMgYWx3YXlzIG9kZFxuICBkbyB7XG4gICAgLy8gUmVtb3ZlIGFsbCBmYWN0b3JzIG9mIDIgaW4gYiAtLSB0aGV5IGFyZSBub3QgY29tbW9uXG4gICAgLy8gTm90ZTogYiBpcyBub3QgemVybywgc28gd2hpbGUgd2lsbCB0ZXJtaW5hdGVcbiAgICB3aGlsZSAoKGIgJiAxKSA9PT0gMCkge1xuICAgICAgYiA+Pj0gMTtcbiAgICB9XG5cbiAgICAvLyBOb3cgYSBhbmQgYiBhcmUgYm90aCBvZGQuIFN3YXAgaWYgbmVjZXNzYXJ5IHNvIGEgPD0gYixcbiAgICAvLyB0aGVuIHNldCBiID0gYiAtIGEgKHdoaWNoIGlzIGV2ZW4pLlxuICAgIGlmIChhID4gYikge1xuICAgICAgdG1wID0gYjtcbiAgICAgIGIgPSBhO1xuICAgICAgYSA9IHRtcDtcbiAgICB9XG5cbiAgICBiIC09IGE7ICAvLyBIZXJlIGIgPj0gYVxuICB9IHdoaWxlIChiICE9PSAwKTtcblxuICAvLyByZXN0b3JlIGNvbW1vbiBmYWN0b3JzIG9mIDJcbiAgcmV0dXJuIGEgPDwgc2hpZnQ7XG59O1xuXG5nY2REaXZpc2lvbkJhc2VkLmJpbmFyeSA9IGdjZEJpbmFyeUl0ZXJhdGl2ZTtcbm1vZHVsZS5leHBvcnRzID0gZ2NkRGl2aXNpb25CYXNlZDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9hbGdvcml0aG1zL2FsZ29yaXRobXMvbWF0aC9nY2QuanNcbi8vIG1vZHVsZSBpZCA9IDEwN1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRGlzam9pbnQgU2V0IEZvcmVzdCBkYXRhIHN0cnVjdHVyZS5cbiAqIEFsbG93cyBmYXN0IHN1YnNldCBtZXJnaW5nIGFuZCBxdWVyeWluZy5cbiAqIE5ldyBlbGVtZW50cyBsaWUgaW4gdGhlaXIgb3duIG9uZS1lbGVtZW50IHN1YnNldHMgYnkgZGVmYXVsdC5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gRGlzam9pbnRTZXRGb3Jlc3QoKSB7XG4gIHRoaXMuX3BhcmVudHMgPSB7fTtcbiAgdGhpcy5fcmFua3MgPSB7fTtcbiAgdGhpcy5fc2l6ZXMgPSB7fTtcbn1cblxuXG5EaXNqb2ludFNldEZvcmVzdC5wcm90b3R5cGUuX2ludHJvZHVjZSA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gIGlmICghKGVsZW1lbnQgaW4gdGhpcy5fcGFyZW50cykpIHtcbiAgICB0aGlzLl9wYXJlbnRzW2VsZW1lbnRdID0gZWxlbWVudDtcbiAgICB0aGlzLl9yYW5rc1tlbGVtZW50XSA9IDA7XG4gICAgdGhpcy5fc2l6ZXNbZWxlbWVudF0gPSAxO1xuICB9XG59O1xuXG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIGVsZW1lbnRzIGJlbG9uZyB0byB0aGUgc2FtZSBzdWJzZXQuXG4gKiBDb21wbGV4aXR5OiBPKEFeLTEpIChpbnZlcnNlIEFja2VybWFubiBmdW5jdGlvbikgYW1vcnRpemVkLlxuICpcbiAqIEBwYXJhbSB7Li4uKn0gZWxlbWVudFxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuRGlzam9pbnRTZXRGb3Jlc3QucHJvdG90eXBlLnNhbWVTdWJzZXQgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICB0aGlzLl9pbnRyb2R1Y2UoZWxlbWVudCk7XG4gIHZhciByb290ID0gdGhpcy5yb290KGVsZW1lbnQpO1xuICByZXR1cm4gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLmV2ZXJ5KGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgdGhpcy5faW50cm9kdWNlKGVsZW1lbnQpO1xuICAgIHJldHVybiB0aGlzLnJvb3QoZWxlbWVudCkgPT09IHJvb3Q7XG4gIH0uYmluZCh0aGlzKSk7XG59O1xuXG5cbi8qKlxuICogUmV0dXJuIHRoZSByb290IGVsZW1lbnQgd2hpY2ggcmVwcmVzZW50cyB0aGUgZ2l2ZW4gZWxlbWVudCdzIHN1YnNldC5cbiAqIFRoZSByZXN1bHQgZG9lcyBub3QgZGVwZW5kIG9uIHRoZSBjaG9pY2Ugb2YgdGhlIGVsZW1lbnQsXG4gKiAgIGJ1dCByYXRoZXIgb24gdGhlIHN1YnNldCBpdHNlbGYuXG4gKiBDb21wbGV4aXR5OiBPKEFeLTEpIChpbnZlcnNlIEFja2VybWFubiBmdW5jdGlvbikgYW1vcnRpemVkLlxuICpcbiAqIEBwYXJhbSB7Kn0gZWxlbWVudFxuICogQHJldHVybiB7Kn1cbiAqL1xuRGlzam9pbnRTZXRGb3Jlc3QucHJvdG90eXBlLnJvb3QgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICB0aGlzLl9pbnRyb2R1Y2UoZWxlbWVudCk7XG4gIGlmICh0aGlzLl9wYXJlbnRzW2VsZW1lbnRdICE9PSBlbGVtZW50KSB7XG4gICAgdGhpcy5fcGFyZW50c1tlbGVtZW50XSA9IHRoaXMucm9vdCh0aGlzLl9wYXJlbnRzW2VsZW1lbnRdKTtcbiAgfVxuICByZXR1cm4gdGhpcy5fcGFyZW50c1tlbGVtZW50XTtcbn07XG5cblxuLyoqXG4gKiBSZXR1cm4gdGhlIHNpemUgb2YgdGhlIGdpdmVuIGVsZW1lbnQncyBzdWJzZXQuXG4gKiBDb21wbGV4aXR5OiBPKEFeLTEpIChpbnZlcnNlIEFja2VybWFubiBmdW5jdGlvbikgYW1vcnRpemVkLlxuICpcbiAqIEBwYXJhbSB7Kn0gZWxlbWVudFxuICogQHJldHVybiB7bnVtYmVyfVxuICovXG5EaXNqb2ludFNldEZvcmVzdC5wcm90b3R5cGUuc2l6ZSA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gIHRoaXMuX2ludHJvZHVjZShlbGVtZW50KTtcbiAgcmV0dXJuIHRoaXMuX3NpemVzW3RoaXMucm9vdChlbGVtZW50KV07XG59O1xuXG5cbi8qKlxuICogTWVyZ2Ugc3Vic2V0cyBjb250YWluaW5nIHR3byAob3IgbW9yZSkgZ2l2ZW4gZWxlbWVudHMgaW50byBvbmUuXG4gKiBDb21wbGV4aXR5OiBPKEFeLTEpIChpbnZlcnNlIEFja2VybWFubiBmdW5jdGlvbikgYW1vcnRpemVkLlxuICpcbiAqIEBwYXJhbSB7Kn0gZWxlbWVudDFcbiAqIEBwYXJhbSB7Kn0gZWxlbWVudDJcbiAqIEBwYXJhbSB7Li4uKn1cbiAqIEByZXR1cm4ge0Rpc2pvaW50U2V0Rm9yZXN0fVxuICovXG5EaXNqb2ludFNldEZvcmVzdC5wcm90b3R5cGUubWVyZ2UgPSBmdW5jdGlvbiBtZXJnZShlbGVtZW50MSwgZWxlbWVudDIpIHtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAyKSB7XG4gICAgbWVyZ2UuYXBwbHkodGhpcywgW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgfVxuXG4gIHRoaXMuX2ludHJvZHVjZShlbGVtZW50MSk7XG4gIHRoaXMuX2ludHJvZHVjZShlbGVtZW50Mik7XG4gIHZhciByb290MSA9IHRoaXMucm9vdChlbGVtZW50MSk7XG4gIHZhciByb290MiA9IHRoaXMucm9vdChlbGVtZW50Mik7XG5cbiAgaWYgKHRoaXMuX3JhbmtzW3Jvb3QxXSA8IHRoaXMuX3JhbmtzW3Jvb3QyXSkge1xuICAgIHRoaXMuX3BhcmVudHNbcm9vdDFdID0gcm9vdDI7XG4gICAgdGhpcy5fc2l6ZXNbcm9vdDJdICs9IHRoaXMuX3NpemVzW3Jvb3QxXTtcbiAgfVxuICBlbHNlIGlmIChyb290MSAhPT0gcm9vdDIpIHtcbiAgICB0aGlzLl9wYXJlbnRzW3Jvb3QyXSA9IHJvb3QxO1xuICAgIHRoaXMuX3NpemVzW3Jvb3QxXSArPSB0aGlzLl9zaXplc1tyb290Ml07XG4gICAgaWYgKHRoaXMuX3JhbmtzW3Jvb3QxXSA9PT0gdGhpcy5fcmFua3Nbcm9vdDJdKSB7XG4gICAgICB0aGlzLl9yYW5rc1tyb290MV0gKz0gMTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gRGlzam9pbnRTZXRGb3Jlc3Q7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYWxnb3JpdGhtcy9kYXRhX3N0cnVjdHVyZXMvZGlzam9pbnRfc2V0X2ZvcmVzdC5qc1xuLy8gbW9kdWxlIGlkID0gMTA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIExpbmtlZExpc3QgPSByZXF1aXJlKCcuL2xpbmtlZF9saXN0Jyk7XG5cbmZ1bmN0aW9uIEhhc2hUYWJsZShpbml0aWFsQ2FwYWNpdHkpIHtcbiAgdGhpcy5fdGFibGUgPSBuZXcgQXJyYXkoaW5pdGlhbENhcGFjaXR5IHx8IDY0KTtcbiAgdGhpcy5faXRlbXMgPSAwO1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnY2FwYWNpdHknLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fdGFibGUubGVuZ3RoO1xuICAgIH1cbiAgfSk7XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdzaXplJywge1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2l0ZW1zO1xuICAgIH1cbiAgfSk7XG59XG5cbi8qKlxuICogKFNhbWUgYWxnb3JpdGhtIGFzIEphdmEncyBTdHJpbmcuaGFzaENvZGUpXG4gKiBSZXR1cm5zIGEgaGFzaCBjb2RlIGZvciB0aGlzIHN0cmluZy4gVGhlIGhhc2ggY29kZSBmb3IgYSBTdHJpbmcgb2JqZWN0IGlzXG4gKiBjb21wdXRlZCBhczogc1swXSozMV4obi0xKSArIHNbMV0qMzFeKG4tMikgKyAuLi4gKyBzW24tMV1cbiAqIHVzaW5nIGludCBhcml0aG1ldGljLCB3aGVyZSBzW2ldIGlzIHRoZSBpdGggY2hhcmFjdGVyIG9mIHRoZSBzdHJpbmcsXG4gKiBuIGlzIHRoZSBsZW5ndGggb2YgdGhlIHN0cmluZywgYW5kIF4gaW5kaWNhdGVzIGV4cG9uZW50aWF0aW9uLlxuICogKFRoZSBoYXNoIHZhbHVlIG9mIHRoZSBlbXB0eSBzdHJpbmcgaXMgemVyby4pXG4gKi9cbkhhc2hUYWJsZS5wcm90b3R5cGUuaGFzaCA9IGZ1bmN0aW9uIChzKSB7XG4gIGlmICh0eXBlb2YgcyAhPT0gJ3N0cmluZycpIHMgPSBKU09OLnN0cmluZ2lmeShzKTtcbiAgdmFyIGhhc2ggPSAwO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHMubGVuZ3RoOyBpKyspIHtcbiAgICBoYXNoID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBzLmNoYXJDb2RlQXQoaSk7XG4gICAgaGFzaCAmPSBoYXNoOyAvLyBLZWVwIGl0IGEgMzJiaXQgaW50XG4gIH1cbiAgcmV0dXJuIGhhc2g7XG59O1xuXG5IYXNoVGFibGUucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgdmFyIGkgPSB0aGlzLl9wb3NpdGlvbihrZXkpO1xuICB2YXIgbm9kZTtcbiAgaWYgKChub2RlID0gdGhpcy5fZmluZEluTGlzdCh0aGlzLl90YWJsZVtpXSwga2V5KSkpIHtcbiAgICByZXR1cm4gbm9kZS52YWx1ZS52O1xuICB9XG59O1xuXG5IYXNoVGFibGUucHJvdG90eXBlLnB1dCA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHZhciBpID0gdGhpcy5fcG9zaXRpb24oa2V5KTtcbiAgaWYgKCF0aGlzLl90YWJsZVtpXSkge1xuICAgIC8vIEhhc2hpbmcgd2l0aCBjaGFpbmluZ1xuICAgIHRoaXMuX3RhYmxlW2ldID0gbmV3IExpbmtlZExpc3QoKTtcbiAgfVxuICB2YXIgaXRlbSA9IHtrOiBrZXksIHY6IHZhbHVlfTtcblxuICB2YXIgbm9kZSA9IHRoaXMuX2ZpbmRJbkxpc3QodGhpcy5fdGFibGVbaV0sIGtleSk7XG4gIGlmIChub2RlKSB7XG4gICAgLy8gaWYgdGhlIGtleSBhbHJlYWR5IGV4aXN0cyBpbiB0aGUgbGlzdCwgcmVwbGFjZVxuICAgIC8vIGJ5IHRoZSBjdXJyZW50IGl0ZW1cbiAgICBub2RlLnZhbHVlID0gaXRlbTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLl90YWJsZVtpXS5hZGQoaXRlbSk7XG4gICAgdGhpcy5faXRlbXMrKztcblxuICAgIGlmICh0aGlzLl9pdGVtcyA9PT0gdGhpcy5jYXBhY2l0eSkgdGhpcy5faW5jcmVhc2VDYXBhY2l0eSgpO1xuICB9XG59O1xuXG5IYXNoVGFibGUucHJvdG90eXBlLmRlbCA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgdmFyIGkgPSB0aGlzLl9wb3NpdGlvbihrZXkpO1xuICB2YXIgbm9kZTtcblxuICBpZiAoKG5vZGUgPSB0aGlzLl9maW5kSW5MaXN0KHRoaXMuX3RhYmxlW2ldLCBrZXkpKSkge1xuICAgIHRoaXMuX3RhYmxlW2ldLmRlbE5vZGUobm9kZSk7XG4gICAgdGhpcy5faXRlbXMtLTtcbiAgfVxufTtcblxuSGFzaFRhYmxlLnByb3RvdHlwZS5fcG9zaXRpb24gPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiBNYXRoLmFicyh0aGlzLmhhc2goa2V5KSkgJSB0aGlzLmNhcGFjaXR5O1xufTtcblxuSGFzaFRhYmxlLnByb3RvdHlwZS5fZmluZEluTGlzdCA9IGZ1bmN0aW9uIChsaXN0LCBrZXkpIHtcbiAgdmFyIG5vZGUgPSBsaXN0ICYmIGxpc3QuaGVhZDtcbiAgd2hpbGUgKG5vZGUpIHtcbiAgICBpZiAobm9kZS52YWx1ZS5rID09PSBrZXkpIHJldHVybiBub2RlO1xuICAgIG5vZGUgPSBub2RlLm5leHQ7XG4gIH1cbn07XG5cbkhhc2hUYWJsZS5wcm90b3R5cGUuX2luY3JlYXNlQ2FwYWNpdHkgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBvbGRUYWJsZSA9IHRoaXMuX3RhYmxlO1xuICB0aGlzLl90YWJsZSA9IG5ldyBBcnJheSgyICogdGhpcy5jYXBhY2l0eSk7XG4gIHRoaXMuX2l0ZW1zID0gMDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IG9sZFRhYmxlLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG5vZGUgPSBvbGRUYWJsZVtpXSAmJiBvbGRUYWJsZVtpXS5oZWFkO1xuICAgIHdoaWxlIChub2RlKSB7XG4gICAgICB0aGlzLnB1dChub2RlLnZhbHVlLmssIG5vZGUudmFsdWUudik7XG4gICAgICBub2RlID0gbm9kZS5uZXh0O1xuICAgIH1cbiAgfVxufTtcblxuSGFzaFRhYmxlLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gKGZuKSB7XG4gIHZhciBhcHBseUZ1bmN0aW9uID0gZnVuY3Rpb24gKGxpbmtlZExpc3QpIHtcbiAgICBsaW5rZWRMaXN0LmZvckVhY2goZnVuY3Rpb24gKGVsZW0pIHtcbiAgICAgIGZuKGVsZW0uaywgZWxlbS52KTtcbiAgICB9KTtcbiAgfTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX3RhYmxlLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHRoaXMuX3RhYmxlW2ldKSB7XG4gICAgICBhcHBseUZ1bmN0aW9uKHRoaXMuX3RhYmxlW2ldKTtcbiAgICB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSGFzaFRhYmxlO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2FsZ29yaXRobXMvZGF0YV9zdHJ1Y3R1cmVzL2hhc2hfdGFibGUuanNcbi8vIG1vZHVsZSBpZCA9IDEwOVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciBIYXNoVGFibGUgPSByZXF1aXJlKCcuL2hhc2hfdGFibGUnKTtcblxuLyoqXG4gKiBUeXBpY2FsIHJlcHJlc2VudGF0aW9uIG9mIGEgbWF0aGVtYXRpY2FsIHNldFxuICogTm8gcmVzdHJpY3Rpb24gb24gZWxlbWVudCB0eXBlc1xuICogICBpLmUuIHNldC5hZGQoMSwnYScsIFwiYlwiLCB7IFwiZm9vXCIgOiBcImJhclwiIH0pXG4gKi9cbnZhciBIYXNoU2V0ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLl9lbGVtZW50cyA9IG5ldyBIYXNoVGFibGUoYXJndW1lbnRzLmxlbmd0aCk7XG4gIHRoaXMuYWRkLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdzaXplJywge1xuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRzLnNpemU7XG4gICAgfVxuICB9KTtcbn07XG5cbkhhc2hTZXQucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uICgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICB0aGlzLl9lbGVtZW50cy5wdXQoYXJndW1lbnRzW2ldLCB0cnVlKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbkhhc2hTZXQucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICB0aGlzLl9lbGVtZW50cy5kZWwoYXJndW1lbnRzW2ldKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbkhhc2hTZXQucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gKGUpIHtcbiAgcmV0dXJuIHRoaXMuX2VsZW1lbnRzLmdldChlKSAhPT0gdW5kZWZpbmVkO1xufTtcblxuSGFzaFNldC5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIChmbikge1xuICB0aGlzLl9lbGVtZW50cy5mb3JFYWNoKGZuKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSGFzaFNldDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9hbGdvcml0aG1zL2RhdGFfc3RydWN0dXJlcy9zZXQuanNcbi8vIG1vZHVsZSBpZCA9IDExMFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciBRdWV1ZSA9IHJlcXVpcmUoJy4vcXVldWUnKTtcblxuLyoqXG4gKiBTdGFjayAoTElGTykgdXNpbmcgYSBMaW5rZWQgTGlzdCBhcyBiYXNpc1xuICovXG5mdW5jdGlvbiBTdGFjaygpIHtcbiAgUXVldWUuY2FsbCh0aGlzKTtcbn1cblxuLyoqXG4gKiBVc2UgYSBRdWV1ZSBhcyBwcm90b3R5cGUgYW5kIGp1c3Qgb3ZlcndyaXRlXG4gKiB0aGUgcHVzaCBtZXRob2QgdG8gaW5zZXJ0IGF0IHRoZSAwIHBvc2l0aW9uXG4gKiBpbnN0ZWFkIG9mIHRoZSBlbmQgb2YgdGhlIHF1ZXVlXG4gKi9cblN0YWNrLnByb3RvdHlwZSA9IG5ldyBRdWV1ZSgpO1xuXG4vKipcbiAqIEFkZHMgZWxlbWVudCB0byB0aGUgdG9wIG9mIHRoZSBzdGFja1xuICovXG5TdGFjay5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uIChlKSB7XG4gIHRoaXMuX2VsZW1lbnRzLmFkZChlLCAwKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU3RhY2s7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYWxnb3JpdGhtcy9kYXRhX3N0cnVjdHVyZXMvc3RhY2suanNcbi8vIG1vZHVsZSBpZCA9IDExMVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJpbXBvcnQgKiBhcyAkIGZyb20gXCJqcXVlcnlcIjtcbmltcG9ydCB7IENhbGwsIENhbGwxLCBDYWxsMyB9IGZyb20gXCIuLi8uLi9zaGFyZWQvbGliL2luZGV4XCI7XG5pbXBvcnQgKiBhcyBfIGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCAqIGFzIG1hdGggZnJvbSBcIm1hdGhqc1wiO1xuY29uc3Qga21wID0gcmVxdWlyZShcImttcC1tYXRjaGVyXCIpO1xuY29uc3QgYWxnb3JpdGhtcyA9IHJlcXVpcmUoXCJhbGdvcml0aG1zXCIpO1xuJCgoKSA9PiB7XG5cdGNvbnN0IGJ1dHRvbiA9ICQoYDxidXR0b24gdHlwZT0nYnV0dG9uJz5ydW48L2J1dHRvbj5gKS5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTtcblx0Y29uc3QgdGV4dCA9IFwiQUJDREFCIEFCQUJDREFCRENEQUFCQ0RBQkRCQyBBQkNEQUJDREFCREFCQUJDREFCRERcIjtcblx0Y29uc3QgcGF0dGVybiA9IFwiQUJDREFCRFwiO1xuXHRidXR0b24uY2xpY2soKCkgPT4ge1xuXHRcdGNvbnNvbGUubG9nKGttcC5rbXAodGV4dCwgcGF0dGVybikpO1xuXHRcdGNvbnNvbGUubG9nKGFsZ29yaXRobXMuU3RyaW5nLmtudXRoTW9ycmlzUHJhdHQodGV4dCwgcGF0dGVybikpO1xuXHRcdGNvbnN0IG9uRmluZEFsbCA9IGluZGV4cyA9PiB7XG5cdFx0XHRjb25zb2xlLmxvZyhpbmRleHMpO1xuXHRcdH07XG5cdFx0bmV3IEJGKHRleHQsIHBhdHRlcm4sIG9uRmluZEFsbCkuc2VhcmNoKCk7XG5cdFx0bmV3IEtNUCh0ZXh0LCBwYXR0ZXJuLCBvbkZpbmRBbGwpLnNlYXJjaCgpO1xuXHR9KTtcbn0pO1xuXG5jbGFzcyBLTVAge1xuXHRjb25zdHJ1Y3Rvcihwcml2YXRlIHRleHQ6IHN0cmluZywgcHJpdmF0ZSBwYXR0ZXJuOiBzdHJpbmcsIHByaXZhdGUgb25GaW5kOiBDYWxsMTxudW1iZXJbXT4pIHt9XG5cdGdldE5leHRMaXN0ID0gKHBhdHRlcm46IHN0cmluZyk6IG51bWJlcltdID0+IHtcblx0XHRsZXQgbmV4dExpc3Q6IG51bWJlcltdID0gW107XG5cdFx0Zm9yIChsZXQgc3RhcnQgPSAwOyBzdGFydCA8IHBhdHRlcm4ubGVuZ3RoOyBzdGFydCsrKSB7XG5cdFx0XHRsZXQgbmV4dCA9IDA7XG5cdFx0XHRsZXQgcHJlZml4U3RyaW5nRW5kID0gc3RhcnQgKyAxO1xuXHRcdFx0Zm9yIChsZXQgdGVtcE5leHQgPSAwOyB0ZW1wTmV4dCA8IHByZWZpeFN0cmluZ0VuZDsgdGVtcE5leHQrKykge1xuXHRcdFx0XHRjb25zdCBwcmVmaXhTdHJpbmcgPSBwYXR0ZXJuLnN1YnN0cmluZygwLCB0ZW1wTmV4dCk7XG5cdFx0XHRcdGNvbnN0IHN1ZmZpeFN0cmluZyA9IHBhdHRlcm4uc3Vic3RyaW5nKHByZWZpeFN0cmluZ0VuZCAtIHRlbXBOZXh0LCBwcmVmaXhTdHJpbmdFbmQpO1xuXHRcdFx0XHRpZiAocHJlZml4U3RyaW5nID09PSBzdWZmaXhTdHJpbmcpIHtcblx0XHRcdFx0XHRuZXh0ID0gdGVtcE5leHQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdG5leHRMaXN0LnB1c2gobmV4dCk7XG5cdFx0fVxuXHRcdHJldHVybiBuZXh0TGlzdDtcblx0fTtcblx0c2VhcmNoKCkge1xuXHRcdGNvbnN0IG1hdGNoID0gKHRleHQ6IHN0cmluZywgcGF0dGVybjogc3RyaW5nLCBvbk1hdGNoOiBDYWxsMTxudW1iZXI+KSA9PiB7XG5cdFx0XHRjb25zdCBuZXh0TGlzdDogbnVtYmVyW10gPSB0aGlzLmdldE5leHRMaXN0KHBhdHRlcm4pO1xuXHRcdFx0Zm9yIChcblx0XHRcdFx0bGV0IHRleHRDaGFySW5kZXggPSAwLCBzdWJUZXh0Q2hhckluZGV4ID0gMCwgbWF4VGV4dENoYXJJbmRleCA9IHRleHQubGVuZ3RoIC0gcGF0dGVybi5sZW5ndGg7XG5cdFx0XHRcdHRleHRDaGFySW5kZXggPD0gbWF4VGV4dENoYXJJbmRleDtcblxuXHRcdFx0KSB7XG5cdFx0XHRcdGNvbnN0IHN1YlRleHQgPSB0ZXh0LnN1YnN0cih0ZXh0Q2hhckluZGV4LCBwYXR0ZXJuLmxlbmd0aCk7XG5cdFx0XHRcdGNvbnN0IG9uU3VjY2VzcyA9ICgpID0+IHtcblx0XHRcdFx0XHRvbk1hdGNoKHRleHRDaGFySW5kZXgpO1xuXHRcdFx0XHRcdGNvbnN0IGZhaWxQYXR0ZXJuSW5kZXggPSBwYXR0ZXJuLmxlbmd0aDtcblx0XHRcdFx0XHRjb25zdCBuZXh0ID0gbmV4dExpc3RbZmFpbFBhdHRlcm5JbmRleCAtIDFdO1xuXHRcdFx0XHRcdHRleHRDaGFySW5kZXggKz0gZmFpbFBhdHRlcm5JbmRleCAtIG5leHQ7XG5cdFx0XHRcdFx0c3ViVGV4dENoYXJJbmRleCA9IG5leHQ7XG5cdFx0XHRcdH07XG5cdFx0XHRcdGNvbnN0IG9uRmFpbCA9IGZhaWxQYXR0ZXJuSW5kZXggPT4ge1xuXHRcdFx0XHRcdGlmIChmYWlsUGF0dGVybkluZGV4ID09PSAwKSB7XG5cdFx0XHRcdFx0XHR0ZXh0Q2hhckluZGV4Kys7XG5cdFx0XHRcdFx0XHRzdWJUZXh0Q2hhckluZGV4ID0gMDtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0Y29uc3QgbmV4dCA9IG5leHRMaXN0W2ZhaWxQYXR0ZXJuSW5kZXggLSAxXTtcblx0XHRcdFx0XHRcdHRleHRDaGFySW5kZXggKz0gZmFpbFBhdHRlcm5JbmRleCAtIG5leHQ7XG5cdFx0XHRcdFx0XHRzdWJUZXh0Q2hhckluZGV4ID0gbmV4dDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHRcdGNvbnN0IG1hdGNoU3ViVGV4dCA9IChcblx0XHRcdFx0XHRzdWJUZXh0OiBzdHJpbmcsXG5cdFx0XHRcdFx0cGF0dGVybjogc3RyaW5nLFxuXHRcdFx0XHRcdHN1YlRleHRDaGFySW5kZXg6IG51bWJlcixcblx0XHRcdFx0XHRvblN1Y2Nlc3MsXG5cdFx0XHRcdFx0b25GYWlsXG5cdFx0XHRcdCkgPT4ge1xuXHRcdFx0XHRcdGxldCBzdGF0ZSA9IHRydWU7XG5cdFx0XHRcdFx0Zm9yICg7IHN1YlRleHRDaGFySW5kZXggPCBwYXR0ZXJuLmxlbmd0aDsgc3ViVGV4dENoYXJJbmRleCsrKSB7XG5cdFx0XHRcdFx0XHRjb25zdCB0ZXh0Q2hhciA9IHN1YlRleHQuY2hhckF0KHN1YlRleHRDaGFySW5kZXgpO1xuXHRcdFx0XHRcdFx0Y29uc3QgcGF0dGVybkNoYXIgPSBwYXR0ZXJuLmNoYXJBdChzdWJUZXh0Q2hhckluZGV4KTtcblx0XHRcdFx0XHRcdGlmICh0ZXh0Q2hhciAhPT0gcGF0dGVybkNoYXIpIHtcblx0XHRcdFx0XHRcdFx0c3RhdGUgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChzdGF0ZSkge1xuXHRcdFx0XHRcdFx0b25TdWNjZXNzKCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG9uRmFpbChzdWJUZXh0Q2hhckluZGV4KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cdFx0XHRcdG1hdGNoU3ViVGV4dChzdWJUZXh0LCBwYXR0ZXJuLCBzdWJUZXh0Q2hhckluZGV4LCBvblN1Y2Nlc3MsIG9uRmFpbCk7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRjb25zdCBmaW5kZWRJbmRleExpc3Q6IG51bWJlcltdID0gW107XG5cdFx0Y29uc3Qgb25NYXRjaCA9IGluZGV4ID0+IHtcblx0XHRcdGZpbmRlZEluZGV4TGlzdC5wdXNoKGluZGV4KTtcblx0XHR9O1xuXHRcdG1hdGNoKHRoaXMudGV4dCwgdGhpcy5wYXR0ZXJuLCBvbk1hdGNoKTtcblx0XHR0aGlzLm9uRmluZChmaW5kZWRJbmRleExpc3QpO1xuXHR9XG59XG5cbmNsYXNzIEJGIHtcblx0Y29uc3RydWN0b3IocHJpdmF0ZSB0ZXh0OiBzdHJpbmcsIHByaXZhdGUgcGF0dGVybjogc3RyaW5nLCBwcml2YXRlIG9uRmluZDogQ2FsbDE8bnVtYmVyW10+KSB7fVxuXG5cdHNlYXJjaCgpIHtcblx0XHRjb25zdCBtYXRjaCA9ICh0ZXh0OiBzdHJpbmcsIHBhdHRlcm46IHN0cmluZywgb25NYXRjaDogQ2FsbDE8bnVtYmVyPikgPT4ge1xuXHRcdFx0Zm9yIChsZXQgdGV4dENoYXJJbmRleCA9IDA7IHRleHRDaGFySW5kZXggPD0gdGV4dC5sZW5ndGggLSBwYXR0ZXJuLmxlbmd0aDsgKSB7XG5cdFx0XHRcdGNvbnN0IHN1YlRleHQgPSB0ZXh0LnN1YnN0cih0ZXh0Q2hhckluZGV4LCBwYXR0ZXJuLmxlbmd0aCk7XG5cdFx0XHRcdGNvbnN0IG9uU3VjY2VzcyA9ICgpID0+IHtcblx0XHRcdFx0XHRvbk1hdGNoKHRleHRDaGFySW5kZXgpO1xuXHRcdFx0XHRcdHRleHRDaGFySW5kZXgrKztcblx0XHRcdFx0fTtcblx0XHRcdFx0Y29uc3Qgb25GYWlsID0gZmFpbFBhdHRlcm5JbmRleCA9PiB7XG5cdFx0XHRcdFx0dGV4dENoYXJJbmRleCsrO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHRjb25zdCBtYXRjaFN1YlRleHQgPSAoc3ViVGV4dDogc3RyaW5nLCBwYXR0ZXJuOiBzdHJpbmcsIG9uU3VjY2Vzcywgb25GYWlsKSA9PiB7XG5cdFx0XHRcdFx0bGV0IHN1YlRleHRDaGFySW5kZXggPSAwO1xuXHRcdFx0XHRcdGZvciAoc3ViVGV4dENoYXJJbmRleCA9IDA7IHN1YlRleHRDaGFySW5kZXggPCBwYXR0ZXJuLmxlbmd0aDsgc3ViVGV4dENoYXJJbmRleCsrKSB7XG5cdFx0XHRcdFx0XHRpZiAoc3ViVGV4dC5jaGFyQXQoc3ViVGV4dENoYXJJbmRleCkgIT09IHBhdHRlcm4uY2hhckF0KHN1YlRleHRDaGFySW5kZXgpKSB7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZiAoc3ViVGV4dENoYXJJbmRleCA9PT0gcGF0dGVybi5sZW5ndGgpIHtcblx0XHRcdFx0XHRcdG9uU3VjY2VzcygpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRvbkZhaWwoc3ViVGV4dENoYXJJbmRleCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRtYXRjaFN1YlRleHQoc3ViVGV4dCwgcGF0dGVybiwgb25TdWNjZXNzLCBvbkZhaWwpO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0Y29uc3QgZmluZGVkSW5kZXhMaXN0OiBudW1iZXJbXSA9IFtdO1xuXHRcdGNvbnN0IG9uTWF0Y2ggPSBpbmRleCA9PiB7XG5cdFx0XHRmaW5kZWRJbmRleExpc3QucHVzaChpbmRleCk7XG5cdFx0fTtcblx0XHRtYXRjaCh0aGlzLnRleHQsIHRoaXMucGF0dGVybiwgb25NYXRjaCk7XG5cdFx0dGhpcy5vbkZpbmQoZmluZGVkSW5kZXhMaXN0KTtcblx0fVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3BhZ2Uva21wL2ttcC50c3giLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogMkQgYmV6aWVyLWN1cnZlLCBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9CJUMzJUE5emllcl9jdXJ2ZVxuICogVXNhZ2U6XG4gKiAgIHZhciBiID0gbmV3IEJlemllckN1cnZlKFt7eDogMCwgeTogMH0sIHt4OiAxMCwgeTogM31dKTtcbiAqICAgYi5nZXQoMC41KTsgLy8ge3g6IDUsIHk6IDEuNX1cbiAqL1xuXG4vKipcbiAqIEdlbmVyYXRlcyBhIGJlemllci1jdXJ2ZSBmcm9tIGEgc2VyaWVzIG9mIHBvaW50c1xuICogQHBhcmFtIEFycmF5IGFycmF5IG9mIGNvbnRyb2wgcG9pbnRzIChbe3g6IHgwLCB5OiB5MH0sIHt4OiB4MSwgeTogeTF9XSlcbiAqL1xudmFyIEJlemllckN1cnZlID0gZnVuY3Rpb24gKHBvaW50cykge1xuICB0aGlzLm4gPSBwb2ludHMubGVuZ3RoO1xuICB0aGlzLnAgPSBbXTtcblxuICAvLyBUaGUgYmlub21pYWwgY29lZmZpY2llbnRcbiAgdmFyIGMgPSBbMV07XG4gIHZhciBpLCBqO1xuICBmb3IgKGkgPSAxOyBpIDwgdGhpcy5uOyArK2kpIHtcbiAgICBjLnB1c2goMCk7XG4gICAgZm9yIChqID0gaTsgaiA+PSAxOyAtLWopIHtcbiAgICAgICAgY1tqXSArPSBjW2ogLSAxXTtcbiAgICB9XG4gIH1cblxuICAvLyB0aGUgaS10aCBjb250cm9sIHBvaW50IHRpbWVzIHRoZSBjb2VmZmljaWVudFxuICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5uOyArK2kpIHtcbiAgICB0aGlzLnAucHVzaCh7eDogY1tpXSAqIHBvaW50c1tpXS54LCB5OiBjW2ldICogcG9pbnRzW2ldLnl9KTtcbiAgfVxufTtcblxuLyoqXG4gKiBAcGFyYW0gTnVtYmVyIGZsb2F0IHZhcmlhYmxlIGZyb20gMCB0byAxXG4gKi9cbkJlemllckN1cnZlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAodCkge1xuICB2YXIgcmVzID0ge3g6IDAsIHk6IDB9O1xuICB2YXIgaTtcbiAgdmFyIGEgPSAxLCBiID0gMTtcblxuICAvLyBUaGUgY29lZmZpY2llbnRcbiAgdmFyIGMgPSBbXTtcbiAgZm9yIChpID0gMDsgaSA8IHRoaXMubjsgKytpKSB7XG4gICAgYy5wdXNoKGEpO1xuICAgIGEgKj0gdDtcbiAgfVxuXG4gIGZvciAoaSA9IHRoaXMubiAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgcmVzLnggKz0gdGhpcy5wW2ldLnggKiBjW2ldICogYjtcbiAgICByZXMueSArPSB0aGlzLnBbaV0ueSAqIGNbaV0gKiBiO1xuICAgIGIgKj0gMSAtIHQ7XG4gIH1cbiAgcmV0dXJuIHJlcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQmV6aWVyQ3VydmU7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYWxnb3JpdGhtcy9hbGdvcml0aG1zL2dlb21ldHJ5L2Jlemllcl9jdXJ2ZS5qc1xuLy8gbW9kdWxlIGlkID0gMTM3XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBzaG9ydGVzdCBwYXRocyBpbiBhIGdyYXBoIHRvIGV2ZXJ5IG5vZGUgZnJvbSB0aGUgbm9kZSBzXG4gKiB3aXRoIFNQRkEoU2hvcnRlc3QgUGF0aCBGYXN0ZXIgQWxnb3JpdGhtKSBhbGdvcml0aG1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZ3JhcGggQW4gYWRqYWNlbmN5IGxpc3QgcmVwcmVzZW50aW5nIHRoZSBncmFwaFxuICogQHBhcmFtIHtzdHJpbmd9IHN0YXJ0IHRoZSBzdGFydGluZyBub2RlXG4gKlxuICovXG5mdW5jdGlvbiBzcGZhKGdyYXBoLCBzKSB7XG4gIHZhciBkaXN0YW5jZSA9IHt9O1xuICB2YXIgcHJldmlvdXMgPSB7fTtcbiAgdmFyIHF1ZXVlID0ge307XG4gIHZhciBpc0luUXVlID0ge307XG4gIHZhciBjbnQgPSB7fTtcbiAgdmFyIGhlYWQgPSAwO1xuICB2YXIgdGFpbCA9IDE7XG4gIC8vIGluaXRpYWxpemVcbiAgZGlzdGFuY2Vbc10gPSAwO1xuICBxdWV1ZVswXSA9IHM7XG4gIGlzSW5RdWVbc10gPSB0cnVlO1xuICBjbnRbc10gPSAxO1xuICBncmFwaC52ZXJ0aWNlcy5mb3JFYWNoKGZ1bmN0aW9uICh2KSB7XG4gICAgaWYgKHYgIT09IHMpIHtcbiAgICAgIGRpc3RhbmNlW3ZdID0gSW5maW5pdHk7XG4gICAgICBpc0luUXVlW3ZdID0gZmFsc2U7XG4gICAgICBjbnRbdl0gPSAwO1xuICAgIH1cbiAgfSk7XG5cbiAgdmFyIGN1cnJOb2RlO1xuICB3aGlsZSAoaGVhZCAhPT0gdGFpbCkge1xuICAgIGN1cnJOb2RlID0gcXVldWVbaGVhZCsrXTtcbiAgICBpc0luUXVlW2N1cnJOb2RlXSA9IGZhbHNlO1xuICAgIHZhciBuZWlnaGJvcnMgPSBncmFwaC5uZWlnaGJvcnMoY3Vyck5vZGUpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmVpZ2hib3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdiA9IG5laWdoYm9yc1tpXTtcbiAgICAgIC8vIHJlbGF4YXRpb25cbiAgICAgIHZhciBuZXdEaXN0YW5jZSA9IGRpc3RhbmNlW2N1cnJOb2RlXSArIGdyYXBoLmVkZ2UoY3Vyck5vZGUsIHYpO1xuICAgICAgaWYgKG5ld0Rpc3RhbmNlIDwgZGlzdGFuY2Vbdl0pIHtcbiAgICAgICAgZGlzdGFuY2Vbdl0gPSBuZXdEaXN0YW5jZTtcbiAgICAgICAgcHJldmlvdXNbdl0gPSBjdXJyTm9kZTtcbiAgICAgICAgaWYgKCFpc0luUXVlW3ZdKSB7XG4gICAgICAgICAgcXVldWVbdGFpbCsrXSA9IHY7XG4gICAgICAgICAgaXNJblF1ZVt2XSA9IHRydWU7XG4gICAgICAgICAgY250W3ZdKys7XG4gICAgICAgICAgaWYgKGNudFt2XSA+IGdyYXBoLnZlcnRpY2VzLnNpemUpXG4gICAgICAgICAgICAvLyBpbmRpY2F0ZXMgbmVnYXRpdmUtd2VpZ2h0ZWQgY3ljbGVcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIGRpc3RhbmNlOiB7fVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZGlzdGFuY2U6IGRpc3RhbmNlLFxuICAgIHByZXZpb3VzOiBwcmV2aW91c1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNwZmE7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYWxnb3JpdGhtcy9hbGdvcml0aG1zL2dyYXBoL1NQRkEuanNcbi8vIG1vZHVsZSBpZCA9IDEzOFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgc2hvcnRlc3QgcGF0aHMgaW4gYSBncmFwaCB0byBldmVyeSBub2RlXG4gKiBmcm9tIHRoZSBub2RlICdzdGFydE5vZGUnIHdpdGggQmVsbG1hbi1Gb3JkJ3MgYWxnb3JpdGhtXG4gKlxuICogV29yc3QgQ2FzZSBDb21wbGV4aXR5OiBPKHxWfCAqIHxFfCksIHdoZXJlIHxWfCBpcyB0aGUgbnVtYmVyIG9mXG4gKiB2ZXJ0aWNlcyBhbmQgfEV8IGlzIHRoZSBudW1iZXIgb2YgZWRnZXMgaW4gdGhlIGdyYXBoXG4gKlxuICogQHBhcmFtIE9iamVjdCAnZ3JhcGgnIEFuIGFkamFjZW5jeSBsaXN0IHJlcHJlc2VudGluZyB0aGUgZ3JhcGhcbiAqIEBwYXJhbSBTdHJpbmcgJ3N0YXJ0Tm9kZScgVGhlIHN0YXJ0aW5nIG5vZGVcbiAqIEByZXR1cm4gT2JqZWN0IHRoZSBtaW5pbXVtIGRpc3RhbmNlIHRvIHJlYWNoIGV2ZXJ5IHZlcnRpY2Ugb2ZcbiAqICAgIHRoZSBncmFwaCBzdGFydGluZyBpbiAnc3RhcnROb2RlJywgb3IgYW4gZW1wdHkgb2JqZWN0IGlmIHRoZXJlXG4gKiAgICBleGlzdHMgYSBOZWdhdGl2ZS1XZWlnaHRlZCBDeWNsZSBpbiB0aGUgZ3JhcGhcbiAqL1xudmFyIGJlbGxtYW5Gb3JkID0gZnVuY3Rpb24gKGdyYXBoLCBzdGFydE5vZGUpIHtcbiAgdmFyIG1pbkRpc3RhbmNlID0ge307XG4gIHZhciBwcmV2aW91c1ZlcnRleCA9IHt9O1xuICB2YXIgZWRnZXMgPSBbXTtcbiAgdmFyIGFkamFjZW5jeUxpc3RTaXplID0gMDtcblxuICAvLyBBZGQgYWxsIHRoZSBlZGdlcyBmcm9tIHRoZSBncmFwaCB0byB0aGUgJ2VkZ2VzJyBhcnJheVxuICBncmFwaC52ZXJ0aWNlcy5mb3JFYWNoKGZ1bmN0aW9uIChzKSB7XG4gICAgZ3JhcGgubmVpZ2hib3JzKHMpLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgIGVkZ2VzLnB1c2goe1xuICAgICAgICBzb3VyY2U6IHMsXG4gICAgICAgIHRhcmdldDogdCxcbiAgICAgICAgd2VpZ2h0OiBncmFwaC5lZGdlKHMsIHQpXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIG1pbkRpc3RhbmNlW3NdID0gSW5maW5pdHk7XG4gICAgKythZGphY2VuY3lMaXN0U2l6ZTtcbiAgfSk7XG5cbiAgbWluRGlzdGFuY2Vbc3RhcnROb2RlXSA9IDA7XG5cbiAgdmFyIGVkZ2VzU2l6ZSA9IGVkZ2VzLmxlbmd0aDtcbiAgdmFyIHNvdXJjZURpc3RhbmNlO1xuICB2YXIgdGFyZ2V0RGlzdGFuY2U7XG5cbiAgdmFyIGl0ZXJhdGlvbjtcbiAgZm9yIChpdGVyYXRpb24gPSAwOyBpdGVyYXRpb24gPCBhZGphY2VuY3lMaXN0U2l6ZTsgKytpdGVyYXRpb24pIHtcbiAgICB2YXIgc29tZXRoaW5nQ2hhbmdlZCA9IGZhbHNlO1xuXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBlZGdlc1NpemU7IGorKykge1xuICAgICAgc291cmNlRGlzdGFuY2UgPSBtaW5EaXN0YW5jZVtlZGdlc1tqXS5zb3VyY2VdICsgZWRnZXNbal0ud2VpZ2h0O1xuICAgICAgdGFyZ2V0RGlzdGFuY2UgPSBtaW5EaXN0YW5jZVtlZGdlc1tqXS50YXJnZXRdO1xuXG4gICAgICBpZiAoc291cmNlRGlzdGFuY2UgPCB0YXJnZXREaXN0YW5jZSkge1xuICAgICAgICBzb21ldGhpbmdDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgbWluRGlzdGFuY2VbZWRnZXNbal0udGFyZ2V0XSA9IHNvdXJjZURpc3RhbmNlO1xuICAgICAgICBwcmV2aW91c1ZlcnRleFtlZGdlc1tqXS50YXJnZXRdID0gZWRnZXNbal0uc291cmNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghc29tZXRoaW5nQ2hhbmdlZCkge1xuICAgICAgLy8gRWFybHkgc3RvcC5cbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8vIElmIHRoZSBsb29wIGRpZCBub3QgYnJlYWsgZWFybHksIHRoZW4gdGhlcmUgaXMgYSBuZWdhdGl2ZS13ZWlnaHRlZCBjeWNsZS5cbiAgaWYgKGl0ZXJhdGlvbiA9PT0gYWRqYWNlbmN5TGlzdFNpemUpIHtcbiAgICAvLyBFbXB0eSAnZGlzdGFuY2UnIG9iamVjdCBpbmRpY2F0ZXMgTmVnYXRpdmUtV2VpZ2h0ZWQgQ3ljbGVcbiAgICByZXR1cm4ge1xuICAgICAgZGlzdGFuY2U6IHt9XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZGlzdGFuY2U6IG1pbkRpc3RhbmNlLFxuICAgIHByZXZpb3VzOiBwcmV2aW91c1ZlcnRleFxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBiZWxsbWFuRm9yZDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9hbGdvcml0aG1zL2FsZ29yaXRobXMvZ3JhcGgvYmVsbG1hbl9mb3JkLmpzXG4vLyBtb2R1bGUgaWQgPSAxMzlcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYnJlYWR0aEZpcnN0U2VhcmNoID0gcmVxdWlyZSgnLi9icmVhZHRoX2ZpcnN0X3NlYXJjaCcpO1xuXG5cbi8qKlxuICogU2hvcnRlc3QtcGF0aCBhbGdvcml0aG0gYmFzZWQgb24gQnJlYWR0aC1GaXJzdCBTZWFyY2guXG4gKiBXb3JrcyBzb2xlbHkgb24gZ3JhcGhzIHdpdGggZXF1YWwgZWRnZSB3ZWlnaHRzIChidXQgd29ya3MgZmFzdCkuXG4gKiBDb21wbGV4aXR5OiBPKFYgKyBFKS5cbiAqXG4gKiBAcGFyYW0ge0dyYXBofSBncmFwaFxuICogQHBhcmFtIHtzdHJpbmd9IHNvdXJjZVxuICogQHJldHVybiB7e2Rpc3RhbmNlOiBPYmplY3QuPHN0cmluZywgbnVtYmVyPixcbiAqICAgICAgICAgICBwcmV2aW91czogT2JqZWN0LjxzdHJpbmcsIHN0cmluZz59fVxuICovXG52YXIgYmZzU2hvcnRlc3RQYXRoID0gZnVuY3Rpb24gKGdyYXBoLCBzb3VyY2UpIHtcbiAgdmFyIGRpc3RhbmNlID0ge30sIHByZXZpb3VzID0ge307XG4gIGRpc3RhbmNlW3NvdXJjZV0gPSAwO1xuXG4gIGJyZWFkdGhGaXJzdFNlYXJjaChncmFwaCwgc291cmNlLCB7XG4gICAgb25UcmF2ZXJzYWw6IGZ1bmN0aW9uICh2ZXJ0ZXgsIG5laWdoYm9yKSB7XG4gICAgICBkaXN0YW5jZVtuZWlnaGJvcl0gPSBkaXN0YW5jZVt2ZXJ0ZXhdICsgMTtcbiAgICAgIHByZXZpb3VzW25laWdoYm9yXSA9IHZlcnRleDtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgZGlzdGFuY2U6IGRpc3RhbmNlLFxuICAgIHByZXZpb3VzOiBwcmV2aW91c1xuICB9O1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGJmc1Nob3J0ZXN0UGF0aDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9hbGdvcml0aG1zL2FsZ29yaXRobXMvZ3JhcGgvYmZzX3Nob3J0ZXN0X3BhdGguanNcbi8vIG1vZHVsZSBpZCA9IDE0MFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciBQcmlvcml0eVF1ZXVlID0gcmVxdWlyZSgnLi4vLi4vZGF0YV9zdHJ1Y3R1cmVzL3ByaW9yaXR5X3F1ZXVlJyk7XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgc2hvcnRlc3QgcGF0aHMgaW4gYSBncmFwaCB0byBldmVyeSBub2RlIGZyb20gdGhlIG5vZGUgc1xuICogd2l0aCBEaWprc3RyYSdzIGFsZ29yaXRobVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBncmFwaCBBbiBhZGphY2VuY3kgbGlzdCByZXByZXNlbnRpbmcgdGhlIGdyYXBoXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RhcnQgdGhlIHN0YXJ0aW5nIG5vZGVcbiAqXG4gKi9cbmZ1bmN0aW9uIGRpamtzdHJhKGdyYXBoLCBzKSB7XG4gIHZhciBkaXN0YW5jZSA9IHt9O1xuICB2YXIgcHJldmlvdXMgPSB7fTtcbiAgdmFyIHEgPSBuZXcgUHJpb3JpdHlRdWV1ZSgpO1xuICAvLyBJbml0aWFsaXplXG4gIGRpc3RhbmNlW3NdID0gMDtcbiAgZ3JhcGgudmVydGljZXMuZm9yRWFjaChmdW5jdGlvbiAodikge1xuICAgIGlmICh2ICE9PSBzKSB7XG4gICAgICBkaXN0YW5jZVt2XSA9IEluZmluaXR5O1xuICAgIH1cbiAgICBxLmluc2VydCh2LCBkaXN0YW5jZVt2XSk7XG4gIH0pO1xuXG4gIHZhciBjdXJyTm9kZTtcbiAgdmFyIHJlbGF4ID0gZnVuY3Rpb24gKHYpIHtcbiAgICB2YXIgbmV3RGlzdGFuY2UgPSBkaXN0YW5jZVtjdXJyTm9kZV0gKyBncmFwaC5lZGdlKGN1cnJOb2RlLCB2KTtcbiAgICBpZiAobmV3RGlzdGFuY2UgPCBkaXN0YW5jZVt2XSkge1xuICAgICAgZGlzdGFuY2Vbdl0gPSBuZXdEaXN0YW5jZTtcbiAgICAgIHByZXZpb3VzW3ZdID0gY3Vyck5vZGU7XG4gICAgICBxLmNoYW5nZVByaW9yaXR5KHYsIGRpc3RhbmNlW3ZdKTtcbiAgICB9XG4gIH07XG4gIHdoaWxlICghcS5pc0VtcHR5KCkpIHtcbiAgICBjdXJyTm9kZSA9IHEuZXh0cmFjdCgpO1xuICAgIGdyYXBoLm5laWdoYm9ycyhjdXJyTm9kZSkuZm9yRWFjaChyZWxheCk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBkaXN0YW5jZTogZGlzdGFuY2UsXG4gICAgcHJldmlvdXM6IHByZXZpb3VzXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGlqa3N0cmE7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYWxnb3JpdGhtcy9hbGdvcml0aG1zL2dyYXBoL2RpamtzdHJhLmpzXG4vLyBtb2R1bGUgaWQgPSAxNDFcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbnZhciBHcmFwaCA9IHJlcXVpcmUoJy4uLy4uL2RhdGFfc3RydWN0dXJlcy9ncmFwaCcpLFxuICAgIGRlcHRoRmlyc3RTZWFyY2ggPSByZXF1aXJlKCcuLi8uLi9hbGdvcml0aG1zL2dyYXBoL2RlcHRoX2ZpcnN0X3NlYXJjaCcpO1xuXG5cbi8qKiBFeGFtaW5lIGEgZ3JhcGggYW5kIGNvbXB1dGUgcGFpciBvZiBlbmQgdmVydGljZXMgb2YgdGhlIGV4aXN0aW5nIEV1bGVyIHBhdGguXG4gKiBSZXR1cm4gcGFpciBvZiB1bmRlZmluZWQgdmFsdWVzIGlmIHRoZXJlIGlzIG5vIHNwZWNpZmljIGNob2ljZSBvZiBlbmQgcG9pbnRzLlxuICogUmV0dXJuIHZhbHVlIGZvcm1hdDoge3N0YXJ0OiBTVEFSVCwgZmluaXNoOiBGSU5JU0h9LlxuICpcbiAqIEBwYXJhbSB7R3JhcGh9IEdyYXBoLCBtdXN0IGJlIGNvbm5lY3RlZCBhbmQgY29udGFpbiBhdCBsZWFzdCBvbmUgdmVydGV4LlxuICogQHJldHVybiBPYmplY3RcbiAqL1xudmFyIGV1bGVyRW5kcG9pbnRzID0gZnVuY3Rpb24gKGdyYXBoKSB7XG4gIHZhciByYW5rID0ge307XG4gIC8vICAgICBzdGFydCAgICAgLT4gIHJhbmsgPSArMVxuICAvLyBtaWRkbGUgcG9pbnRzIC0+ICByYW5rID0gIDBcbiAgLy8gICAgZmluaXNoICAgICAtPiAgcmFuayA9IC0xXG5cbiAgLy8gSW5pdGlhbGl6ZSByYW5rcyB0byBiZSBvdXRkZWdyZWVzIG9mIHZlcnRpY2VzLlxuICBncmFwaC52ZXJ0aWNlcy5mb3JFYWNoKGZ1bmN0aW9uICh2ZXJ0ZXgpIHtcbiAgICByYW5rW3ZlcnRleF0gPSBncmFwaC5uZWlnaGJvcnModmVydGV4KS5sZW5ndGg7XG4gIH0pO1xuXG4gIGlmIChncmFwaC5kaXJlY3RlZCkge1xuICAgIC8vIHJhbmsgPSBvdXRkZWdyZWUgLSBpbmRlZ3JlZVxuICAgIGdyYXBoLnZlcnRpY2VzLmZvckVhY2goZnVuY3Rpb24gKHZlcnRleCkge1xuICAgICAgZ3JhcGgubmVpZ2hib3JzKHZlcnRleCkuZm9yRWFjaChmdW5jdGlvbiAobmVpZ2hib3IpIHtcbiAgICAgICAgcmFua1tuZWlnaGJvcl0gLT0gMTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIGVsc2Uge1xuICAgIC8vIENvbXB1dGUgcmFua3MgZnJvbSB2ZXJ0ZXggZGVncmVlIHBhcml0eSB2YWx1ZXMuXG4gICAgdmFyIHN0YXJ0Q2hvc2VuID0gZmFsc2U7XG4gICAgZ3JhcGgudmVydGljZXMuZm9yRWFjaChmdW5jdGlvbiAodmVydGV4KSB7XG4gICAgICByYW5rW3ZlcnRleF0gJT0gMjtcbiAgICAgIGlmIChyYW5rW3ZlcnRleF0pIHtcbiAgICAgICAgaWYgKHN0YXJ0Q2hvc2VuKSB7XG4gICAgICAgICAgcmFua1t2ZXJ0ZXhdID0gLTE7XG4gICAgICAgIH1cbiAgICAgICAgc3RhcnRDaG9zZW4gPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdmFyIHN0YXJ0LCBmaW5pc2gsIHY7XG5cbiAgZ3JhcGgudmVydGljZXMuZm9yRWFjaChmdW5jdGlvbiAodmVydGV4KSB7XG4gICAgaWYgKHJhbmtbdmVydGV4XSA9PT0gMSkge1xuICAgICAgaWYgKHN0YXJ0KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRHVwbGljYXRlIHN0YXJ0IHZlcnRleC4nKTtcbiAgICAgIH1cbiAgICAgIHN0YXJ0ID0gdmVydGV4O1xuICAgIH0gZWxzZSBpZiAocmFua1t2ZXJ0ZXhdID09PSAtMSkge1xuICAgICAgaWYgKGZpbmlzaCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0R1cGxpY2F0ZSBmaW5pc2ggdmVydGV4LicpO1xuICAgICAgfVxuICAgICAgZmluaXNoID0gdmVydGV4O1xuICAgIH0gZWxzZSBpZiAocmFua1t2ZXJ0ZXhdKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuZXhwZWN0ZWQgdmVydGV4IGRlZ3JlZSBmb3IgJyArIHZlcnRleCk7XG4gICAgfSBlbHNlIGlmICghdikge1xuICAgICAgdiA9IHZlcnRleDtcbiAgICB9XG4gIH0pO1xuXG4gIGlmICghc3RhcnQgJiYgIWZpbmlzaCkge1xuICAgIHN0YXJ0ID0gZmluaXNoID0gdjtcbiAgfVxuXG4gIHJldHVybiB7c3RhcnQ6IHN0YXJ0LFxuICAgICAgICAgIGZpbmlzaDogZmluaXNofTtcbn07XG5cblxuLyoqXG4gKiBDb21wdXRlIEV1bGVyIHBhdGggKGVpdGhlciB3YWxrIG9yIHRvdXIsIGRlcGVuZGluZyBvbiB0aGUgZ3JhcGgpLlxuICogRXVsZXIgcGF0aCBpcyBhIHRyYWlsIGluIGEgZ3JhcGggd2hpY2ggdmlzaXRzIGV2ZXJ5IGVkZ2UgZXhhY3RseSBvbmNlLlxuICogVGhlIHByb2NlZHVyZSB3b3JrcyBib3RoIGZvciBkaXJlY3RlZCBhbmQgdW5kaXJlY3RlZCBncmFwaHMsXG4gKiAgIGFsdGhvdWdoIHRoZSBkZXRhaWxzIGRpZmZlciBhIGJpdC5cbiAqIFRoZSByZXN1bHRpbmcgYXJyYXkgY29uc2lzdHMgb2YgZXhhY3RseSB8RXwrMSB2ZXJ0aWNlcy5cbiAqXG4gKiBAcGFyYW0ge0dyYXBofVxuICogQHJldHVybiBBcnJheVxuICovXG52YXIgZXVsZXJQYXRoID0gZnVuY3Rpb24gKGdyYXBoKSB7XG4gIGlmICghZ3JhcGgudmVydGljZXMuc2l6ZSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHZhciBlbmRwb2ludHMgPSBldWxlckVuZHBvaW50cyhncmFwaCk7XG4gIHZhciByb3V0ZSA9IFtlbmRwb2ludHMuZmluaXNoXTtcblxuICB2YXIgc2VlbiA9IG5ldyBHcmFwaChncmFwaC5kaXJlY3RlZCk7XG4gIGdyYXBoLnZlcnRpY2VzLmZvckVhY2goc2Vlbi5hZGRWZXJ0ZXguYmluZChzZWVuKSk7XG5cbiAgZGVwdGhGaXJzdFNlYXJjaChncmFwaCwgZW5kcG9pbnRzLnN0YXJ0LCB7XG4gICAgYWxsb3dUcmF2ZXJzYWw6IGZ1bmN0aW9uICh2ZXJ0ZXgsIG5laWdoYm9yKSB7XG4gICAgICByZXR1cm4gIXNlZW4uZWRnZSh2ZXJ0ZXgsIG5laWdoYm9yKTtcbiAgICB9LFxuICAgIGJlZm9yZVRyYXZlcnNhbDogZnVuY3Rpb24gKHZlcnRleCwgbmVpZ2hib3IpIHtcbiAgICAgIHNlZW4uYWRkRWRnZSh2ZXJ0ZXgsIG5laWdoYm9yKTtcbiAgICB9LFxuICAgIGFmdGVyVHJhdmVyc2FsOiBmdW5jdGlvbiAodmVydGV4KSB7XG4gICAgICByb3V0ZS5wdXNoKHZlcnRleCk7XG4gICAgfVxuICB9KTtcblxuICBncmFwaC52ZXJ0aWNlcy5mb3JFYWNoKGZ1bmN0aW9uICh2ZXJ0ZXgpIHtcbiAgICBpZiAoc2Vlbi5uZWlnaGJvcnModmVydGV4KS5sZW5ndGggPCBncmFwaC5uZWlnaGJvcnModmVydGV4KS5sZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGhlcmUgaXMgbm8gZXVsZXIgcGF0aCBmb3IgYSBkaXNjb25uZWN0ZWQgZ3JhcGguJyk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJvdXRlLnJldmVyc2UoKTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBldWxlclBhdGg7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYWxnb3JpdGhtcy9hbGdvcml0aG1zL2dyYXBoL2V1bGVyX3BhdGguanNcbi8vIG1vZHVsZSBpZCA9IDE0MlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cblxuLyoqXG4gKiBGbG95ZC1XYXJzaGFsbCBhbGdvcml0aG0uXG4gKiBDb21wdXRlIGFsbC1wYWlycyBzaG9ydGVzdCBwYXRocyAoYSBwYXRoIGZvciBlYWNoIHBhaXIgb2YgdmVydGljZXMpLlxuICogQ29tcGxleGl0eTogTyhWXjMpLlxuICpcbiAqIEBwYXJhbSB7R3JhcGh9IGdyYXBoXG4gKiBAcmV0dXJuIHt7ZGlzdGFuY2UsIHBhdGh9fVxuICovXG52YXIgZmxveWRXYXJzaGFsbCA9IGZ1bmN0aW9uIChncmFwaCkge1xuXG4gIC8vIEZpbGwgaW4gdGhlIGRpc3RhbmNlcyB3aXRoIGluaXRpYWwgdmFsdWVzOlxuICAvLyAgIC0gMCBpZiBzb3VyY2UgPT0gZGVzdGluYXRpb247XG4gIC8vICAgLSBlZGdlKHNvdXJjZSwgZGVzdGluYXRpb24pIGlmIHRoZXJlIGlzIGEgZGlyZWN0IGVkZ2U7XG4gIC8vICAgLSAraW5mIG90aGVyd2lzZS5cbiAgdmFyIGRpc3RhbmNlID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgZ3JhcGgudmVydGljZXMuZm9yRWFjaChmdW5jdGlvbiAoc3JjKSB7XG4gICAgZGlzdGFuY2Vbc3JjXSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgZ3JhcGgudmVydGljZXMuZm9yRWFjaChmdW5jdGlvbiAoZGVzdCkge1xuICAgICAgaWYgKHNyYyA9PT0gZGVzdCkge1xuICAgICAgICBkaXN0YW5jZVtzcmNdW2Rlc3RdID0gMDtcbiAgICAgIH0gZWxzZSBpZiAoZ3JhcGguZWRnZShzcmMsIGRlc3QpICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZGlzdGFuY2Vbc3JjXVtkZXN0XSA9IGdyYXBoLmVkZ2Uoc3JjLCBkZXN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRpc3RhbmNlW3NyY11bZGVzdF0gPSBJbmZpbml0eTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gSW50ZXJuYWwgdmVydGV4IHdpdGggdGhlIGxhcmdlc3QgaW5kZXggYWxvbmcgdGhlIHNob3J0ZXN0IHBhdGguXG4gIC8vIE5lZWRlZCBmb3IgcGF0aCByZWNvbnN0cnVjdGlvbi5cbiAgdmFyIG1pZGRsZVZlcnRleCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIGdyYXBoLnZlcnRpY2VzLmZvckVhY2goZnVuY3Rpb24gKHZlcnRleCkge1xuICAgIG1pZGRsZVZlcnRleFt2ZXJ0ZXhdID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgfSk7XG5cbiAgZ3JhcGgudmVydGljZXMuZm9yRWFjaChmdW5jdGlvbiAobWlkZGxlKSB7XG4gICAgZ3JhcGgudmVydGljZXMuZm9yRWFjaChmdW5jdGlvbiAoc3JjKSB7XG4gICAgICBncmFwaC52ZXJ0aWNlcy5mb3JFYWNoKGZ1bmN0aW9uIChkZXN0KSB7XG4gICAgICAgIHZhciBkaXN0ID0gZGlzdGFuY2Vbc3JjXVttaWRkbGVdICsgZGlzdGFuY2VbbWlkZGxlXVtkZXN0XTtcbiAgICAgICAgaWYgKGRpc3QgPCBkaXN0YW5jZVtzcmNdW2Rlc3RdKSB7XG4gICAgICAgICAgZGlzdGFuY2Vbc3JjXVtkZXN0XSA9IGRpc3Q7XG4gICAgICAgICAgbWlkZGxlVmVydGV4W3NyY11bZGVzdF0gPSBtaWRkbGU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICAvLyBDaGVjayBmb3IgYSBuZWdhdGl2ZS13ZWlnaHRlZCBjeWNsZS5cbiAgZ3JhcGgudmVydGljZXMuZm9yRWFjaChmdW5jdGlvbiAodmVydGV4KSB7XG4gICAgaWYgKGRpc3RhbmNlW3ZlcnRleF1bdmVydGV4XSA8IDApIHtcbiAgICAgIC8vIE5lZ2F0aXZlLXdlaWdodGVkIGN5Y2xlIGZvdW5kLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgZ3JhcGggY29udGFpbnMgYSBuZWdhdGl2ZS13ZWlnaHRlZCBjeWNsZSEnKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8qKlxuICAgKiBSZWNvbnN0cnVjdCB0aGUgc2hvcnRlc3QgcGF0aCBmb3IgYSBnaXZlbiBwYWlyIG9mIGVuZCB2ZXJ0aWNlcy5cbiAgICogQ29tcGxleGl0eTogTyhMKSwgTCAtIGxlbmd0aCBvZiB0aGUgcGF0aCAobnVtYmVyIG9mIGVkZ2VzKS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNyY2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IGRlc3RcbiAgICogQHJldHVybiB7P3N0cmluZ1tdfSBOdWxsIGlmIGRlc3RpbmF0aW9uIGlzIHVucmVhY2hhYmxlLlxuICAgKi9cbiAgdmFyIHBhdGggPSBmdW5jdGlvbiAoc3JjLCBkZXN0KSB7XG4gICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUoZGlzdGFuY2Vbc3JjXVtkZXN0XSkpIHtcbiAgICAgIC8vIGRlc3QgdW5yZWFjaGFibGUuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB2YXIgcGF0aCA9IFtzcmNdO1xuXG4gICAgaWYgKHNyYyAhPT0gZGVzdCkge1xuICAgICAgKGZ1bmN0aW9uIHB1c2hJbk9yZGVyKHNyYywgZGVzdCkge1xuICAgICAgICBpZiAobWlkZGxlVmVydGV4W3NyY11bZGVzdF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHBhdGgucHVzaChkZXN0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgbWlkZGxlID0gbWlkZGxlVmVydGV4W3NyY11bZGVzdF07XG4gICAgICAgICAgcHVzaEluT3JkZXIoc3JjLCBtaWRkbGUpO1xuICAgICAgICAgIHB1c2hJbk9yZGVyKG1pZGRsZSwgZGVzdCk7XG4gICAgICAgIH1cbiAgICAgIH0pKHNyYywgZGVzdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhdGg7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBkaXN0YW5jZTogZGlzdGFuY2UsXG4gICAgcGF0aDogcGF0aFxuICB9O1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGZsb3lkV2Fyc2hhbGw7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYWxnb3JpdGhtcy9hbGdvcml0aG1zL2dyYXBoL2Zsb3lkX3dhcnNoYWxsLmpzXG4vLyBtb2R1bGUgaWQgPSAxNDNcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgRGlzam9pbnRTZXRGb3Jlc3QgPSByZXF1aXJlKCcuLi8uLi9kYXRhX3N0cnVjdHVyZXMvZGlzam9pbnRfc2V0X2ZvcmVzdCcpLFxuICAgIEdyYXBoID0gcmVxdWlyZSgnLi4vLi4vZGF0YV9zdHJ1Y3R1cmVzL2dyYXBoJyk7XG5cblxuLyoqXG4gKiBLcnVza2FsJ3MgbWluaW11bSBzcGFubmluZyB0cmVlIChmb3Jlc3QpIGFsZ29yaXRobS5cbiAqIENvbXBsZXhpdHk6IE8oRSAqIGxvZyhWKSkuXG4gKlxuICogQHBhcmFtIHtHcmFwaH0gZ3JhcGggLSBVbmRpcmVjdGVkIGdyYXBoLlxuICogQHJldHVybiB7R3JhcGh9IE1pbmltdW0gc3Bhbm5pbmcgdHJlZSBvciBmb3Jlc3RcbiAqICAgKGRlcGVuZGluZyBvbiB3aGV0aGVyIGlucHV0IGdyYXBoIGlzIGNvbm5lY3RlZCBpdHNlbGYpLlxuICovXG52YXIga3J1c2thbCA9IGZ1bmN0aW9uIChncmFwaCkge1xuICBpZiAoZ3JhcGguZGlyZWN0ZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhblxcJ3QgYnVpbGQgTVNUIG9mIGEgZGlyZWN0ZWQgZ3JhcGguJyk7XG4gIH1cblxuICB2YXIgY29ubmVjdGVkQ29tcG9uZW50cyA9IG5ldyBEaXNqb2ludFNldEZvcmVzdCgpO1xuICB2YXIgbXN0ID0gbmV3IEdyYXBoKGZhbHNlKTtcbiAgZ3JhcGgudmVydGljZXMuZm9yRWFjaChtc3QuYWRkVmVydGV4LmJpbmQobXN0KSk7XG5cbiAgdmFyIGVkZ2VzID0gW107XG4gIGdyYXBoLnZlcnRpY2VzLmZvckVhY2goZnVuY3Rpb24gKHZlcnRleCkge1xuICAgIGdyYXBoLm5laWdoYm9ycyh2ZXJ0ZXgpLmZvckVhY2goZnVuY3Rpb24gKG5laWdoYm9yKSB7XG4gICAgICAvLyBDb21wYXJlZCBhcyBzdHJpbmdzLCBsb29wcyBpbnRlbnRpb25hbGx5IG9taXR0ZWQuXG4gICAgICBpZiAodmVydGV4IDwgbmVpZ2hib3IpIHtcbiAgICAgICAgZWRnZXMucHVzaCh7XG4gICAgICAgICAgZW5kczogW3ZlcnRleCwgbmVpZ2hib3JdLFxuICAgICAgICAgIHdlaWdodDogZ3JhcGguZWRnZSh2ZXJ0ZXgsIG5laWdoYm9yKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgZWRnZXMuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgIHJldHVybiBhLndlaWdodCAtIGIud2VpZ2h0O1xuICB9KS5mb3JFYWNoKGZ1bmN0aW9uIChlZGdlKSB7XG4gICAgaWYgKCFjb25uZWN0ZWRDb21wb25lbnRzLnNhbWVTdWJzZXQoZWRnZS5lbmRzWzBdLCBlZGdlLmVuZHNbMV0pKSB7XG4gICAgICBtc3QuYWRkRWRnZShlZGdlLmVuZHNbMF0sIGVkZ2UuZW5kc1sxXSwgZWRnZS53ZWlnaHQpO1xuICAgICAgY29ubmVjdGVkQ29tcG9uZW50cy5tZXJnZShlZGdlLmVuZHNbMF0sIGVkZ2UuZW5kc1sxXSk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gbXN0O1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGtydXNrYWw7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYWxnb3JpdGhtcy9hbGdvcml0aG1zL2dyYXBoL2tydXNrYWwuanNcbi8vIG1vZHVsZSBpZCA9IDE0NFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciBQcmlvcml0eVF1ZXVlID0gcmVxdWlyZSgnLi4vLi4vZGF0YV9zdHJ1Y3R1cmVzL3ByaW9yaXR5X3F1ZXVlJyksXG4gICAgR3JhcGggPSByZXF1aXJlKCcuLi8uLi9kYXRhX3N0cnVjdHVyZXMvZ3JhcGgnKTtcblxuXG4vKipcbiAqIFByaW0ncyBtaW5pbXVtIHNwYW5uaW5nIHRyZWUgKGZvcmVzdCkgYWxnb3JpdGhtLlxuICogQ29tcGxleGl0eTogTyhFICogbG9nKFYpKS5cbiAqXG4gKiBAcGFyYW0ge0dyYXBofSBncmFwaCAtIFVuZGlyZWN0ZWQgZ3JhcGguXG4gKiBAcmV0dXJuIHtHcmFwaH0gTWluaW11bSBzcGFubmluZyB0cmVlIG9yIGZvcmVzdFxuICogICAoZGVwZW5kaW5nIG9uIHdoZXRoZXIgaW5wdXQgZ3JhcGggaXMgY29ubmVjdGVkIGl0c2VsZikuXG4gKi9cbnZhciBwcmltID0gZnVuY3Rpb24gKGdyYXBoKSB7XG4gIGlmIChncmFwaC5kaXJlY3RlZCkge1xuICAgIHRocm93IG5ldyBFcnJvcignQ2FuXFwndCBidWlsZCBNU1Qgb2YgYSBkaXJlY3RlZCBncmFwaC4nKTtcbiAgfVxuXG4gIHZhciBtc3QgPSBuZXcgR3JhcGgoZmFsc2UpO1xuICB2YXIgcGFyZW50ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuICB2YXIgcSA9IG5ldyBQcmlvcml0eVF1ZXVlKCk7XG4gIGdyYXBoLnZlcnRpY2VzLmZvckVhY2goZnVuY3Rpb24gKHZlcnRleCkge1xuICAgIHEuaW5zZXJ0KHZlcnRleCwgSW5maW5pdHkpO1xuICB9KTtcblxuICB2YXIgcmVsYXggPSBmdW5jdGlvbiAodmVydGV4LCBuZWlnaGJvcikge1xuICAgIHZhciB3ZWlnaHQgPSBncmFwaC5lZGdlKHZlcnRleCwgbmVpZ2hib3IpO1xuICAgIGlmICh3ZWlnaHQgPCBxLnByaW9yaXR5KG5laWdoYm9yKSkge1xuICAgICAgcS5jaGFuZ2VQcmlvcml0eShuZWlnaGJvciwgd2VpZ2h0KTtcbiAgICAgIHBhcmVudFtuZWlnaGJvcl0gPSB2ZXJ0ZXg7XG4gICAgfVxuICB9O1xuXG4gIHdoaWxlICghcS5pc0VtcHR5KCkpIHtcbiAgICB2YXIgdG9wID0gcS5leHRyYWN0KHRydWUpO1xuICAgIHZhciB2ZXJ0ZXggPSB0b3AuaXRlbSxcbiAgICAgICAgd2VpZ2h0ID0gdG9wLnByaW9yaXR5O1xuXG4gICAgaWYgKHBhcmVudFt2ZXJ0ZXhdKSB7XG4gICAgICBtc3QuYWRkRWRnZShwYXJlbnRbdmVydGV4XSwgdmVydGV4LCB3ZWlnaHQpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIG1zdC5hZGRWZXJ0ZXgodmVydGV4KTtcbiAgICB9XG5cbiAgICBncmFwaC5uZWlnaGJvcnModmVydGV4KS5mb3JFYWNoKHJlbGF4LmJpbmQobnVsbCwgdmVydGV4KSk7XG4gIH1cblxuICByZXR1cm4gbXN0O1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IHByaW07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYWxnb3JpdGhtcy9hbGdvcml0aG1zL2dyYXBoL3ByaW0uanNcbi8vIG1vZHVsZSBpZCA9IDE0NVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciBTdGFjayA9IHJlcXVpcmUoJy4uLy4uL2RhdGFfc3RydWN0dXJlcy9zdGFjaycpLFxuICAgIGRlcHRoRmlyc3RTZWFyY2ggPSByZXF1aXJlKCcuLi8uLi9hbGdvcml0aG1zL2dyYXBoL2RlcHRoX2ZpcnN0X3NlYXJjaCcpO1xuXG4vKipcbiAqIFNvcnRzIHRoZSBlZGdlcyBvZiB0aGUgREFHIHRvcG9sb2dpY2FsbHlcbiAqXG4gKiAgKG5vZGUxKSAtPiAobm9kZTIpIC0+IChub2RlNClcbiAqICAgICBcXC0+IChub2RlMyleXG4gKlxuICogTWVhbmluZyB0aGF0OlxuICogLSBcIm5vZGUyXCIgYW5kIFwibm9kZTNcIiBkZXBlbmQgb24gXCJub2RlMVwiXG4gKiAtIFwibm9kZTRcIiBkZXBlbmQgb24gbm9kZTJcbiAqIC0gXCJub2RlMlwiIGRlcGVuZCBvbiBcIm5vZGUzXCJcbiAqXG4gKiBAcGFyYW0ge0dyYXBofVxuICogQHJldHVybiBTdGFja1xuICovXG52YXIgdG9wb2xvZ2ljYWxTb3J0ID0gZnVuY3Rpb24gKGdyYXBoKSB7XG4gIHZhciBzdGFjayA9IG5ldyBTdGFjaygpO1xuICB2YXIgZmlyc3RIaXQgPSB7fTtcbiAgdmFyIHRpbWUgPSAwO1xuXG4gIGdyYXBoLnZlcnRpY2VzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICBpZiAoIWZpcnN0SGl0W25vZGVdKSB7XG4gICAgICBkZXB0aEZpcnN0U2VhcmNoKGdyYXBoLCBub2RlLCB7XG4gICAgICAgIGFsbG93VHJhdmVyc2FsOiBmdW5jdGlvbiAobm9kZSwgbmVpZ2hib3IpIHtcbiAgICAgICAgICByZXR1cm4gIWZpcnN0SGl0W25laWdoYm9yXTtcbiAgICAgICAgfSxcbiAgICAgICAgZW50ZXJWZXJ0ZXg6IGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgZmlyc3RIaXRbbm9kZV0gPSArK3RpbWU7XG4gICAgICAgIH0sXG4gICAgICAgIGxlYXZlVmVydGV4OiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgIHN0YWNrLnB1c2gobm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHN0YWNrO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB0b3BvbG9naWNhbFNvcnQ7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYWxnb3JpdGhtcy9hbGdvcml0aG1zL2dyYXBoL3RvcG9sb2dpY2FsX3NvcnQuanNcbi8vIG1vZHVsZSBpZCA9IDE0NlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbi8vIGNhY2hlIGFsZ29yaXRobSByZXN1bHRzXG52YXIgY2FjaGUgPSB7MTogMX07XG5cbi8qKlxuICogQ29sbGF0eiBDb25qZWN0dXJlIGFsZ29yaXRobVxuICpcbiAqIEBwYXJhbSBOdW1iZXJcbiAqIEByZXR1cm4gTnVtYmVyXG4gKi9cblxuZnVuY3Rpb24gY2FsY3VsYXRlQ29sbGF0ekNvbmplY3R1cmUobnVtYmVyKSB7XG4gIGlmIChudW1iZXIgaW4gY2FjaGUpIHJldHVybiBjYWNoZVtudW1iZXJdO1xuICBpZiAobnVtYmVyICUgMiA9PT0gMCkgcmV0dXJuIGNhY2hlW251bWJlcl0gPSBudW1iZXIgPj4gMTtcblxuICByZXR1cm4gY2FjaGVbbnVtYmVyXSA9IG51bWJlciAqIDMgKyAxO1xufVxuXG4vKipcbiAqIEdlbmVyYXRlIENvbGxhdHogQ29uamVjdHVyZVxuICpcbiAqIEBwYXJhbSBOdW1iZXJcbiAqIEByZXR1cm4gQXJyYXlcbiAqL1xuXG5mdW5jdGlvbiBnZW5lcmF0ZUNvbGxhdHpDb25qZWN0dXJlKG51bWJlcikge1xuICB2YXIgY29sbGF0ekNvbmplY3R1cmUgPSBbXTtcblxuICBkbyB7XG4gICAgbnVtYmVyID0gY2FsY3VsYXRlQ29sbGF0ekNvbmplY3R1cmUobnVtYmVyKTtcbiAgICBjb2xsYXR6Q29uamVjdHVyZS5wdXNoKG51bWJlcik7XG4gIH0gd2hpbGUgKG51bWJlciAhPT0gMSk7XG5cbiAgcmV0dXJuIGNvbGxhdHpDb25qZWN0dXJlO1xufVxuXG4vLyBleHBvcnQgQ29sbGF0eiBDb25qZWN0dXJlIG1ldGhvZHNcbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZW5lcmF0ZTogZ2VuZXJhdGVDb2xsYXR6Q29uamVjdHVyZSxcbiAgY2FsY3VsYXRlOiBjYWxjdWxhdGVDb2xsYXR6Q29uamVjdHVyZSxcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYWxnb3JpdGhtcy9hbGdvcml0aG1zL21hdGgvY29sbGF0el9jb25qZWN0dXJlLmpzXG4vLyBtb2R1bGUgaWQgPSAxNDdcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEV4dGVuZGVkIEV1Y2xpZGVhbiBhbGdvcml0aG0gdG8gY2FsY3VsYXRlIHRoZSBzb2x2ZSBvZlxuICogICBheCArIGJ5ID0gZ2NkKGEsIGIpXG4gKiBnY2QoYSwgYikgaXMgdGhlIGdyZWF0ZXN0IGNvbW1vbiBkaXZpc29yIG9mIGludGVnZXJzIGEgYW5kIGIuXG4gKlxuICogQHBhcmFtIE51bWJlclxuICogQHBhcmFtIE51bWJlclxuICpcbiAqIEByZXR1cm4ge051bWJlciwgTnVtYmVyfVxuICovXG52YXIgZXh0RXVjbGlkID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgdmFyIHMgPSAwLCBvbGRTID0gMTtcbiAgdmFyIHQgPSAxLCBvbGRUID0gMDtcbiAgdmFyIHIgPSBiLCBvbGRSID0gYTtcbiAgdmFyIHF1b3RpZW50LCB0ZW1wO1xuICB3aGlsZSAociAhPT0gMCkge1xuICAgIHF1b3RpZW50ID0gTWF0aC5mbG9vcihvbGRSIC8gcik7XG5cbiAgICB0ZW1wID0gcjtcbiAgICByID0gb2xkUiAtIHF1b3RpZW50ICogcjtcbiAgICBvbGRSID0gdGVtcDtcblxuICAgIHRlbXAgPSBzO1xuICAgIHMgPSBvbGRTIC0gcXVvdGllbnQgKiBzO1xuICAgIG9sZFMgPSB0ZW1wO1xuXG4gICAgdGVtcCA9IHQ7XG4gICAgdCA9IG9sZFQgLSBxdW90aWVudCAqIHQ7XG4gICAgb2xkVCA9IHRlbXA7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHg6IG9sZFMsXG4gICAgeTogb2xkVFxuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHRFdWNsaWQ7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYWxnb3JpdGhtcy9hbGdvcml0aG1zL21hdGgvZXh0ZW5kZWRfZXVjbGlkZWFuLmpzXG4vLyBtb2R1bGUgaWQgPSAxNDhcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIERpZmZlcmVudCBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIEZpYm9uYWNjaSBzZXF1ZW5jZVxuICovXG5cbnZhciBwb3dlciA9IHJlcXVpcmUoJy4vZmFzdF9wb3dlcicpO1xuXG4vKipcbiAgKiBSZWd1bGFyIGZpYm9uYWNjaSBpbXBsZW1lbnRhdGlvbiBmb2xsb3dpbmcgdGhlIGRlZmluaXRpb246XG4gICogRmliKDApID0gMFxuICAqIEZpYigxKSA9IDFcbiAgKiBGaWIobikgPSBGaWIobi0xKSArIEZpYihuLTIpXG4gICpcbiAgKiBAcGFyYW0gTnVtYmVyXG4gICogQHJldHVybiBOdW1iZXJcbiAgKi9cbnZhciBmaWJFeHBvbmVudGlhbCA9IGZ1bmN0aW9uIChuKSB7XG4gIHJldHVybiBuIDwgMiA/IG4gOiBmaWJFeHBvbmVudGlhbChuIC0gMSkgKyBmaWJFeHBvbmVudGlhbChuIC0gMik7XG59O1xuXG4vKipcbiAgKiBPKG4pIGluIHRpbWUsIE8oMSkgaW4gc3BhY2UgYW5kIGRvZXNuJ3QgdXNlIHJlY3Vyc2lvblxuICAqXG4gICogQHBhcmFtIE51bWJlclxuICAqIEByZXR1cm4gTnVtYmVyXG4gICovXG52YXIgZmliTGluZWFyID0gZnVuY3Rpb24gKG4pIHtcbiAgdmFyIGZpYk5NaW51czIgPSAwLFxuICAgICAgZmliTk1pbnVzMSA9IDEsXG4gICAgICBmaWIgPSBuO1xuICBmb3IgKHZhciBpID0gMTsgaSA8IG47IGkrKykge1xuICAgIGZpYiA9IGZpYk5NaW51czEgKyBmaWJOTWludXMyO1xuICAgIGZpYk5NaW51czIgPSBmaWJOTWludXMxO1xuICAgIGZpYk5NaW51czEgPSBmaWI7XG4gIH1cbiAgcmV0dXJuIGZpYjtcbn07XG5cbi8qKlxuICAqIEltcGxlbWVudGF0aW9uIHdpdGggbWVtb2l6YXRpb24sIE8obikgaW4gdGltZSwgTyhuKSBpbiBzcGFjZVxuICAqXG4gICogQHBhcmFtIE51bWJlclxuICAqIEByZXR1cm4gTnVtYmVyXG4gICovXG52YXIgZmliV2l0aE1lbW9pemF0aW9uID0gKGZ1bmN0aW9uICgpIHtcbiAgdmFyIGNhY2hlID0gWzAsIDFdO1xuXG4gIHZhciBmaWIgPSBmdW5jdGlvbiAobikge1xuICAgIGlmIChjYWNoZVtuXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjYWNoZVtuXSA9IGZpYihuIC0gMSkgKyBmaWIobiAtIDIpO1xuICAgIH1cbiAgICByZXR1cm4gY2FjaGVbbl07XG4gIH07XG5cbiAgcmV0dXJuIGZpYjtcbn0pKCk7XG5cbi8qKlxuICAqIEltcGxlbWVudGF0aW9uIHVzaW5nIEJpbmV0J3MgZm9ybXVsYSB3aXRoIHRoZSByb3VuZGluZyB0cmljay5cbiAgKiBPKDEpIGluIHRpbWUsIE8oMSkgaW4gc3BhY2VcbiAgKlxuICAqIEBwYXJhbSBOdW1iZXJcbiAgKiBAcmV0dXJuIE51bWJlclxuICAqL1xudmFyIGZpYkRpcmVjdCA9IGZ1bmN0aW9uIChudW1iZXIpIHtcbiAgdmFyIHBoaSA9ICgxICsgTWF0aC5zcXJ0KDUpKSAvIDI7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucG93KHBoaSwgbnVtYmVyKSAvIE1hdGguc3FydCg1KSArIDAuNSk7XG59O1xuXG4vKipcbiAgKiBJbXBsZW1lbnRhdGlvbiBiYXNlZCBvbiBtYXRyaXggZXhwb25lbnRpYXRpb24uXG4gICogTyhsb2cobikpIGluIHRpbWUsIE8oMSkgaW4gc3BhY2VcbiAgKlxuICAqIEBwYXJhbSBOdW1iZXJcbiAgKiBAcmV0dXJuIE51bWJlclxuICAqL1xudmFyIGZpYkxvZ2FyaXRobWljID0gZnVuY3Rpb24gKG51bWJlcikge1xuICAvLyBUcmFuc2Zvcm1zIFtmXzEsIGZfMF0gdG8gW2ZfMiwgZl8xXSBhbmQgc28gb24uXG4gIHZhciBuZXh0RmliID0gW1sxLCAxXSwgWzEsIDBdXTtcblxuICB2YXIgbWF0cml4TXVsdGlwbHkgPSBmdW5jdGlvbiAoYSwgYikge1xuICAgIHJldHVybiBbW2FbMF1bMF0gKiBiWzBdWzBdICsgYVswXVsxXSAqIGJbMV1bMF0sXG4gICAgICAgICAgICAgYVswXVswXSAqIGJbMF1bMV0gKyBhWzBdWzFdICogYlsxXVsxXV0sXG4gICAgICAgICAgICBbYVsxXVswXSAqIGJbMF1bMF0gKyBhWzFdWzFdICogYlsxXVswXSxcbiAgICAgICAgICAgICBhWzFdWzBdICogYlswXVsxXSArIGFbMV1bMV0gKiBiWzFdWzFdXV07XG4gIH07XG5cbiAgdmFyIHRyYW5zZm9ybSA9IHBvd2VyKG5leHRGaWIsIG51bWJlciwgbWF0cml4TXVsdGlwbHksIFtbMSwgMF0sIFswLCAxXV0pO1xuXG4gIC8vIFtmX24sIGZfe24tMX1dID0gVHJhbnNmb3JtICogW2ZfMCwgZl97LTF9XSA9IFRyYW5zZm9ybSAqIFswLCAxXVxuICAvLyBIZW5jZSB0aGUgcmVzdWx0IGlzIHRoZSBmaXJzdCByb3cgb2YgVHJhbnNmb3JtIG11bHRpcGxpZWQgYnkgWzAsIDFdLFxuICAvLyB3aGljaCBpcyB0aGUgc2FtZSBhcyB0cmFuc2Zvcm1bMF1bMV0uXG4gIHJldHVybiB0cmFuc2Zvcm1bMF1bMV07XG59O1xuXG4vLyBVc2UgZmliTGluZWFyIGFzIHRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uXG5maWJMaW5lYXIuZXhwb25lbnRpYWwgPSBmaWJFeHBvbmVudGlhbDtcbmZpYkxpbmVhci53aXRoTWVtb2l6YXRpb24gPSBmaWJXaXRoTWVtb2l6YXRpb247XG5maWJMaW5lYXIuZGlyZWN0ID0gZmliRGlyZWN0O1xuZmliTGluZWFyLmxvZ2FyaXRobWljID0gZmliTG9nYXJpdGhtaWM7XG5tb2R1bGUuZXhwb3J0cyA9IGZpYkxpbmVhcjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9hbGdvcml0aG1zL2FsZ29yaXRobXMvbWF0aC9maWJvbmFjY2kuanNcbi8vIG1vZHVsZSBpZCA9IDE0OVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRmlzaGVyLVlhdGVzIHNodWZmbGVzIHRoZSBlbGVtZW50cyBpbiBhbiBhcnJheVxuICogaW4gTyhuKVxuICovXG52YXIgZmlzaGVyWWF0ZXMgPSBmdW5jdGlvbiAoYSkge1xuICBmb3IgKHZhciBpID0gYS5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XG4gICAgdmFyIGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcbiAgICB2YXIgdG1wID0gYVtpXTtcbiAgICBhW2ldID0gYVtqXTtcbiAgICBhW2pdID0gdG1wO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZpc2hlcllhdGVzO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2FsZ29yaXRobXMvYWxnb3JpdGhtcy9tYXRoL2Zpc2hlcl95YXRlcy5qc1xuLy8gbW9kdWxlIGlkID0gMTUwXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBGaW5kIHRoZSBncmVhdGVzdCBkaWZmZXJlbmNlIGJldHdlZW4gdHdvIG51bWJlcnMgaW4gYSBzZXRcbiAqIFRoaXMgc29sdXRpb24gaGFzIGEgY29zdCBvZiBPKG4pXG4gKlxuICogQHBhcmFtIHtudW1iZXJbXX0gbnVtYmVyc1xuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuXG52YXIgZ3JlYXRlc3REaWZmZXJlbmNlID0gZnVuY3Rpb24gKG51bWJlcnMpIHtcbiAgdmFyIGluZGV4ID0gMDtcbiAgdmFyIGxhcmdlc3QgPSBudW1iZXJzWzBdO1xuICB2YXIgbGVuZ3RoID0gbnVtYmVycy5sZW5ndGg7XG4gIHZhciBudW1iZXI7XG4gIHZhciBzbWFsbGVzdCA9IG51bWJlcnNbMF07XG5cbiAgZm9yIChpbmRleDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICBudW1iZXIgPSBudW1iZXJzW2luZGV4XTtcblxuICAgIGlmIChudW1iZXIgPiBsYXJnZXN0KSBsYXJnZXN0ID0gbnVtYmVyO1xuICAgIGlmIChudW1iZXIgPCBzbWFsbGVzdCkgc21hbGxlc3QgPSBudW1iZXI7XG4gIH1cblxuICByZXR1cm4gbGFyZ2VzdCAtIHNtYWxsZXN0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBncmVhdGVzdERpZmZlcmVuY2U7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYWxnb3JpdGhtcy9hbGdvcml0aG1zL21hdGgvZ3JlYXRlc3RfZGlmZmVyZW5jZS5qc1xuLy8gbW9kdWxlIGlkID0gMTUxXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdjZCA9IHJlcXVpcmUoJy4vZ2NkLmpzJyk7XG5cbi8qKlxuICogQ2FsY3VsZSB0aGUgTGVhc3QgQ29tbW9uIE11bHRpcGxlIHdpdGggYSBnaXZlbiBHcmVhdGVzdCBDb21tb24gRGVub21pbmF0b3JcbiAqIGZ1bmN0aW9uXG4gKlxuICogQHBhcmFtIE51bWJlclxuICogQHBhcmFtIE51bWJlclxuICogQHBhcmFtIEZ1bmN0aW9uXG4gKlxuICogQHJldHVybiBOdW1iZXJcbiAqL1xudmFyIGdlbmVyaWNMQ00gPSBmdW5jdGlvbiAoZ2NkRnVuY3Rpb24sIGEsIGIpIHtcbiAgIGlmIChhID09PSAwIHx8IGIgPT09IDApIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuICBhID0gTWF0aC5hYnMoYSk7XG4gIGIgPSBNYXRoLmFicyhiKTtcbiAgcmV0dXJuIGEgLyBnY2RGdW5jdGlvbihhLCBiKSAqIGI7XG59O1xuXG4vKipcbiAqIEFsZ29yaXRobSB0byBjYWxjdWxhdGUgTGVhc3QgQ29tbW9uIE11bHRpcGxlIGJhc2VkIG9uIEV1Y2xpZGVhbiBhbGdvcml0aG1cbiAqIGNhbGxzIHRoZSBnZW5lcmljIExDTSBmdW5jdGlvbiBwYXNzaW5nIHRoZSBkaXZpc2lvbiBiYXNlZCBHQ0QgY2FsY3VsYXRvclxuICpcbiAqIEBwYXJhbSBOdW1iZXJcbiAqIEBwYXJhbSBOdW1iZXJcbiAqXG4gKiBAcmV0dXJuIE51bWJlclxuICovXG52YXIgbGNtRGl2aXNpb25CYXNlZCA9IGdlbmVyaWNMQ00uYmluZChudWxsLCBnY2QpO1xuXG4vKipcbiAqIEFsZ29yaXRobSB0byBjYWxjdWxhdGUgTGVhc3QgQ29tbW9uIE11bHRpcGxlIGJhc2VkIG9uIFN0ZWluJ3MgQWxnb3JpdGhtXG4gKiBjYWxscyB0aGUgZ2VuZXJpYyBMQ00gZnVuY3Rpb24gcGFzc2luZyB0aGUgYmluYXJ5IGludGVyYXRpdmUgR0NEIGNhbGN1bGF0b3JcbiAqXG4gKiBAcGFyYW0gTnVtYmVyXG4gKiBAcGFyYW0gTnVtYmVyXG4gKlxuICogQHJldHVybiBOdW1iZXJcbiAqL1xudmFyIGxjbUJpbmFyeUl0ZXJhdGl2ZSA9IGdlbmVyaWNMQ00uYmluZChudWxsLCBnY2QuYmluYXJ5KTtcblxudmFyIGxjbSA9IGxjbURpdmlzaW9uQmFzZWQ7XG5sY20uYmluYXJ5ID0gbGNtQmluYXJ5SXRlcmF0aXZlO1xubW9kdWxlLmV4cG9ydHMgPSBsY207XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYWxnb3JpdGhtcy9hbGdvcml0aG1zL21hdGgvbGNtLmpzXG4vLyBtb2R1bGUgaWQgPSAxNTJcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIE5ld3RvbidzIG1ldGhvZCB0byBjYWxjdWxhdGUgc3F1YXJlIHJvb3RcbiAqXG4gKiBAcGFyYW0gTnVtYmVyIG4gLSB0aGUgbnVtYmVyIHdoaWNoIHRoZSBzcXVhcmUgcm9vdCBzaG91bGQgYmUgY2FsY3VsYXRlZFxuICogQHBhcmFtIE51bWJlciB0b2xlcmFuY2UgLSBUaGUgZXJyb3IgbWFyZ2luIGFjY2VwdGVkIChEZWZhdWx0IDFlLTcpXG4gKiBAcGFyYW0gTnVtYmVyIG1heEl0ZXJhdGlvbnMgLSBUaGUgbWF4IG51bWJlciBvZiBpdGVyYXRpb25zIChEZWZhdWx0IDFlNylcbiAqL1xudmFyIHNxcnQgPSBmdW5jdGlvbiAobiwgdG9sZXJhbmNlLCBtYXhJdGVyYXRpb25zKSB7XG4gIHRvbGVyYW5jZSA9IHRvbGVyYW5jZSB8fCAxZS03O1xuICBtYXhJdGVyYXRpb25zID0gbWF4SXRlcmF0aW9ucyB8fCAxZTc7XG5cbiAgdmFyIHVwcGVyQm91bmQgPSBuO1xuICB2YXIgbG93ZXJCb3VuZCA9IDA7XG5cbiAgdmFyIGkgPSAwO1xuICB2YXIgc3F1YXJlLCB4O1xuICBkbyB7XG4gICAgaSsrO1xuICAgIHggPSAodXBwZXJCb3VuZCAtIGxvd2VyQm91bmQpIC8gMiArIGxvd2VyQm91bmQ7XG4gICAgc3F1YXJlID0geCAqIHg7XG4gICAgaWYgKHNxdWFyZSA8IG4pIGxvd2VyQm91bmQgPSB4O1xuICAgIGVsc2UgdXBwZXJCb3VuZCA9IHg7XG4gIH0gd2hpbGUgKE1hdGguYWJzKHNxdWFyZSAtIG4pID4gdG9sZXJhbmNlICYmIGkgPCBtYXhJdGVyYXRpb25zKTtcblxuICAvLyBDaGVja3MgaWYgdGhlIG51bWJlciBpcyBhIHBlcmZlY3Qgc3F1YXJlIHRvIHJldHVybiB0aGUgZXhhY3Qgcm9vdFxuICB2YXIgcm91bmRYID0gTWF0aC5yb3VuZCh4KTtcbiAgaWYgKHJvdW5kWCAqIHJvdW5kWCA9PT0gbikgeCA9IHJvdW5kWDtcblxuICByZXR1cm4geDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gc3FydDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9hbGdvcml0aG1zL2FsZ29yaXRobXMvbWF0aC9uZXd0b25fc3FydC5qc1xuLy8gbW9kdWxlIGlkID0gMTUzXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxudmFyIENvbXBhcmF0b3IgPSByZXF1aXJlKCcuLi8uLi91dGlsL2NvbXBhcmF0b3InKTtcblxuXG4vKipcbiAqIE5hcmF5YW5hJ3MgYWxnb3JpdGhtIGNvbXB1dGVzIHRoZSBzdWJzZXF1ZW50IHBlcm11dGF0aW9uXG4gKiAgIGluIGxleGljb2dyYXBoaWNhbCBvcmRlci5cbiAqIENvbXBsZXhpdHk6IE8obikuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gYXJyYXlcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtjb21wYXJlRm5dIC0gQ3VzdG9tIGNvbXBhcmUgZnVuY3Rpb24uXG4gKiBAcmV0dXJuIHtib29sZWFufSBCb29sZWFuIGZsYWcgaW5kaWNhdGluZyB3aGV0aGVyIHRoZSBhbGdvcml0aG0gc3VjY2VlZGVkLFxuICogICB0cnVlIHVubGVzcyB0aGUgaW5wdXQgcGVybXV0YXRpb24gaXMgbGV4aWNvZ3JhcGhpY2FsbHkgdGhlIGxhc3Qgb25lLlxuICovXG52YXIgbmV4dFBlcm11dGF0aW9uID0gZnVuY3Rpb24gKGFycmF5LCBjb21wYXJlRm4pIHtcbiAgaWYgKCFhcnJheS5sZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIGNtcCA9IG5ldyBDb21wYXJhdG9yKGNvbXBhcmVGbik7XG5cbiAgLy8gRmluZCBwaXZvdCBhbmQgc3VjY2Vzc29yIGluZGljZXMuXG4gIHZhciBwaXZvdCA9IGFycmF5Lmxlbmd0aCAtIDE7XG4gIHdoaWxlIChwaXZvdCAmJiBjbXAuZ3JlYXRlclRoYW5PckVxdWFsKGFycmF5W3Bpdm90IC0gMV0sIGFycmF5W3Bpdm90XSkpIHtcbiAgICBwaXZvdCAtPSAxO1xuICB9XG4gIGlmICghcGl2b3QpIHtcbiAgICAvLyBQZXJtdXRhdGlvbiBpcyBzb3J0ZWQgaW4gZGVzY2VuZGluZyBvcmRlci5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHBpdm90VmFsdWUgPSBhcnJheVstLXBpdm90XTtcbiAgdmFyIHN1Y2Nlc3NvciA9IGFycmF5Lmxlbmd0aCAtIDE7XG4gIHdoaWxlIChjbXAubGVzc1RoYW5PckVxdWFsKGFycmF5W3N1Y2Nlc3Nvcl0sIHBpdm90VmFsdWUpKSB7XG4gICAgc3VjY2Vzc29yIC09IDE7XG4gIH1cblxuICAvLyBTd2FwIHZhbHVlcy5cbiAgYXJyYXlbcGl2b3RdID0gYXJyYXlbc3VjY2Vzc29yXTtcbiAgYXJyYXlbc3VjY2Vzc29yXSA9IHBpdm90VmFsdWU7XG5cbiAgLy8gUmV2ZXJzZSB0aGUgZGVzY2VuZGluZyBwYXJ0LlxuICBmb3IgKHZhciBsZWZ0ID0gcGl2b3QsIHJpZ2h0ID0gYXJyYXkubGVuZ3RoOyArK2xlZnQgPCAtLXJpZ2h0Oykge1xuICAgIHZhciB0ZW1wID0gYXJyYXlbbGVmdF07XG4gICAgYXJyYXlbbGVmdF0gPSBhcnJheVtyaWdodF07XG4gICAgYXJyYXlbcmlnaHRdID0gdGVtcDtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBuZXh0UGVybXV0YXRpb247XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYWxnb3JpdGhtcy9hbGdvcml0aG1zL21hdGgvbmV4dF9wZXJtdXRhdGlvbi5qc1xuLy8gbW9kdWxlIGlkID0gMTU0XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qKlxuICogSXRlcmF0aXZlIGFuZCByZWN1cnNpdmUgaW1wbGVtZW50YXRpb25zIG9mIHBvd2VyIHNldFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBJdGVyYXRpdmUgcG93ZXIgc2V0IGNhbGN1bGF0aW9uXG4gKi9cbnZhciBwb3dlclNldEl0ZXJhdGl2ZSA9IGZ1bmN0aW9uIChhcnJheSkge1xuXG4gIGlmIChhcnJheS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICB2YXIgcG93ZXJTZXQgPSBbXTtcbiAgdmFyIGNhY2hlID0gW107XG4gIHZhciBpO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgIGNhY2hlW2ldID0gdHJ1ZTtcbiAgfVxuXG4gIGZvciAoaSA9IDA7IGkgPCBNYXRoLnBvdygyLCBhcnJheS5sZW5ndGgpOyBpKyspIHtcblxuICAgIHBvd2VyU2V0LnB1c2goW10pO1xuXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBhcnJheS5sZW5ndGg7IGorKykge1xuXG4gICAgICBpZiAoaSAlIE1hdGgucG93KDIsIGopID09PSAwKSB7XG4gICAgICAgIGNhY2hlW2pdID0gIWNhY2hlW2pdO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2FjaGVbal0pIHtcbiAgICAgICAgcG93ZXJTZXRbaV0ucHVzaChhcnJheVtqXSk7XG4gICAgICB9XG5cbiAgICB9XG4gIH1cblxuICByZXR1cm4gcG93ZXJTZXQ7XG59O1xuXG4vKipcbiAqIFJlY3Vyc2l2ZSBwb3dlciBzZXQgY2FsY3VsYXRpb25cbiAqL1xudmFyIHBvd2VyU2V0UmVjdXJzaXZlID0gZnVuY3Rpb24gKGFycmF5KSB7XG4gIGlmIChhcnJheS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gW107XG4gIH0gZWxzZSBpZiAoYXJyYXkubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIFsgW10sIFsgYXJyYXlbMF0gXSBdO1xuICB9IGVsc2Uge1xuICAgIHZhciBwb3dlclNldCA9IFtdO1xuICAgIHZhciBmaXJzdEVsZW0gPSBhcnJheVswXTtcblxuICAgIGFycmF5LnNwbGljZSgwLCAxKTtcblxuICAgIHBvd2VyU2V0UmVjdXJzaXZlKGFycmF5KS5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtKSB7XG4gICAgICBwb3dlclNldC5wdXNoKGVsZW0pO1xuICAgICAgdmFyIHdpdGhGaXJzdEVsZW0gPSBbIGZpcnN0RWxlbSBdO1xuICAgICAgd2l0aEZpcnN0RWxlbS5wdXNoLmFwcGx5KHdpdGhGaXJzdEVsZW0sIGVsZW0pO1xuICAgICAgcG93ZXJTZXQucHVzaCh3aXRoRmlyc3RFbGVtKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBwb3dlclNldDtcbiAgfVxufTtcblxuLy8gVXNlIHBvd2VyU2V0SXRlcmF0aXZlIGFzIHRoZSBkZWZhdWx0IGltcGxlbWVudGF0aW9uXG52YXIgcG93ZXJTZXQgPSBwb3dlclNldEl0ZXJhdGl2ZTtcbnBvd2VyU2V0LnJlY3Vyc2l2ZSA9IHBvd2VyU2V0UmVjdXJzaXZlO1xubW9kdWxlLmV4cG9ydHMgPSBwb3dlclNldDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9hbGdvcml0aG1zL2FsZ29yaXRobXMvbWF0aC9wb3dlcl9zZXQuanNcbi8vIG1vZHVsZSBpZCA9IDE1NVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuKiBDaGVja3Mgd2hldGhlciBhIG51bWJlciBpcyBwcmltZSB1c2luZyBhIGdpdmVuIHByaW1hbGl0eSB0ZXN0XG4qXG4qIEBwYXJhbSBGdW5jdGlvblxuKiBAcGFyYW0gTnVtYmVyXG4qXG4qIEByZXR1cm4gQm9vbGVhblxuKi9cbnZhciBnZW5lcmljUHJpbWFsaXR5VGVzdCA9IGZ1bmN0aW9uIChwcmltYWxpdHlUZXN0LCBuKSB7XG4gIGlmIChuIDw9IDEpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHByaW1hbGl0eVRlc3Qobik7XG59O1xuXG4vKipcbiogQ2hlY2tzIHdoZXRoZXIgYSBudW1iZXIgaXMgcHJpbWUgdXNpbmcgdGhlIG5haXZlIGFsZ29yaXRobSBPKG4pXG4qXG4qIEBwYXJhbSBOdW1iZXJcbipcbiogQHJldHVybiBCb29sZWFuXG4qL1xudmFyIG5haXZlVGVzdCA9IGZ1bmN0aW9uIChuKSB7XG4gIGZvciAodmFyIGkgPSAyOyBpIDwgbjsgKytpKSB7XG4gICAgaWYgKG4gJSBpID09PSAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufTtcblxuLyoqXG4qIENoZWNrcyB3aGV0aGVyIGEgbnVtYmVyIGlzIHByaW1lIHVzaW5nIHRoZSB0cmlhbCBkaXZpc29uIGFsZ29yaXRobSBPKHNxcnQobikpXG4qXG4qIEBwYXJhbSBOdW1iZXJcbipcbiogQHJldHVybiBCb29sZWFuXG4qL1xudmFyIHRyaWFsRGl2aXNpb25UZXN0ID0gZnVuY3Rpb24gKG4pIHtcbiAgdmFyIHNxcnQgPSBNYXRoLnNxcnQobik7XG4gIGZvciAodmFyIGkgPSAyOyBpIDw9IHNxcnQ7ICsraSkge1xuICAgIGlmIChuICUgaSA9PT0gMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBuYWl2ZVRlc3Q6IGdlbmVyaWNQcmltYWxpdHlUZXN0LmJpbmQobnVsbCwgbmFpdmVUZXN0KSxcbiAgdHJpYWxEaXZpc2lvblRlc3Q6IGdlbmVyaWNQcmltYWxpdHlUZXN0LmJpbmQobnVsbCwgdHJpYWxEaXZpc2lvblRlc3QpXG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2FsZ29yaXRobXMvYWxnb3JpdGhtcy9tYXRoL3ByaW1hbGl0eV90ZXN0cy5qc1xuLy8gbW9kdWxlIGlkID0gMTU2XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuXG4vKipcbiAqIFNhbXBsZSByYW5kb20gZWxlbWVudHMgZnJvbSB0aGUgYXJyYXkgdXNpbmcgcmVzZXJ2b2lyIGFsZ29yaXRobS5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheVxuICogQHBhcmFtIHtudW1iZXJ9IHNhbXBsZVNpemVcbiAqIEByZXR1cm4ge0FycmF5fVxuICovXG52YXIgcmVzZXJ2b2lyU2FtcGxpbmcgPSBmdW5jdGlvbiAoYXJyYXksIHNhbXBsZVNpemUpIHtcbiAgaWYgKHNhbXBsZVNpemUgPiBhcnJheS5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1NhbXBsZSBzaXplIGV4Y2VlZHMgdGhlIHRvdGFsIG51bWJlciBvZiBlbGVtZW50cy4nKTtcbiAgfVxuICB2YXIgcmVzZXJ2b2lyID0gYXJyYXkuc2xpY2UoMCwgc2FtcGxlU2l6ZSk7XG4gIGZvciAodmFyIGkgPSBzYW1wbGVTaXplOyBpIDwgYXJyYXkubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xuICAgIGlmIChqIDwgc2FtcGxlU2l6ZSkge1xuICAgICAgcmVzZXJ2b2lyW2pdID0gYXJyYXlbaV07XG4gICAgfVxuICB9XG4gIHJldHVybiByZXNlcnZvaXI7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gcmVzZXJ2b2lyU2FtcGxpbmc7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYWxnb3JpdGhtcy9hbGdvcml0aG1zL21hdGgvcmVzZXJ2b2lyX3NhbXBsaW5nLmpzXG4vLyBtb2R1bGUgaWQgPSAxNTdcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENhbGN1bGF0ZSBTaGFubm9uIEVudHJvcHkgb2YgYW4gYXJyYXlcbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcnIgLSBBbiBhcnJheSBvZiB2YWx1ZXMuXG4gKiBAcmV0dXJuIE51bWJlclxuICovXG52YXIgc2hhbm5vbkVudHJvcHkgPSBmdW5jdGlvbiAoYXJyKSB7XG4gIC8vIGZpbmQgdGhlIGZyZXF1ZW5jeSBvZiBlYWNoIHZhbHVlXG4gIHZhciBmcmVxcyA9IGFyci5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgaXRlbSkge1xuICAgIGFjY1tpdGVtXSA9IGFjY1tpdGVtXSArIDEgfHwgMTtcbiAgICByZXR1cm4gYWNjO1xuICB9LCB7fSk7XG5cbiAgLy8gZmluZCB0aGUgcHJvYmFiaWxpdHkgb2YgZWFjaCB2YWx1ZVxuICB2YXIgcHJvYnMgPSBPYmplY3Qua2V5cyhmcmVxcykubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gZnJlcXNba2V5XSAvIGFyci5sZW5ndGg7XG4gIH0pO1xuXG4gIC8vIGNhbHVsYXRlIHRoZSBzaGFubm9uIGVudHJvcHkgb2YgdGhlIGFycmF5XG4gIHJldHVybiBwcm9icy5yZWR1Y2UoZnVuY3Rpb24gKGUsIHApIHtcbiAgICByZXR1cm4gZSAtIHAgKiBNYXRoLmxvZyhwKTtcbiAgfSwgMCkgKiBNYXRoLkxPRzJFO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBzaGFubm9uRW50cm9weTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9hbGdvcml0aG1zL2FsZ29yaXRobXMvbWF0aC9zaGFubm9uX2VudHJvcHkuanNcbi8vIG1vZHVsZSBpZCA9IDE1OFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG52YXIgUXVldWUgPSByZXF1aXJlKCcuLi8uLi9kYXRhX3N0cnVjdHVyZXMvcXVldWUuanMnKTtcblxuLyoqXG4gKiBCcmVhZHRoLWZpcnN0IHNlYXJjaCBmb3IgYmluYXJ5IHRyZWVzXG4gKi9cbnZhciBiZnMgPSBmdW5jdGlvbiAocm9vdCwgY2FsbGJhY2spIHtcbiAgdmFyIHEgPSBuZXcgUXVldWUoKTtcbiAgcS5wdXNoKHJvb3QpO1xuICB2YXIgbm9kZTtcbiAgd2hpbGUgKCFxLmlzRW1wdHkoKSkge1xuICAgIG5vZGUgPSBxLnBvcCgpO1xuICAgIGNhbGxiYWNrKG5vZGUudmFsdWUpO1xuICAgIGlmIChub2RlLmxlZnQpIHEucHVzaChub2RlLmxlZnQpO1xuICAgIGlmIChub2RlLnJpZ2h0KSBxLnB1c2gobm9kZS5yaWdodCk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYmZzO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2FsZ29yaXRobXMvYWxnb3JpdGhtcy9zZWFyY2gvYmZzLmpzXG4vLyBtb2R1bGUgaWQgPSAxNTlcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAgKiBCaW5hcnkgU2VhcmNoIGZpbmRzIGVsZW1lbnRzIGluIHNvcnRlZCBhcnJheXMgaW4gbG9nYXJpdGhtaWNcbiAgKiB0aW1lIChPKGxnIG4pKVxuICAqXG4gICogQHBhcmFtIEFycmF5XG4gICogQHBhcmFtIE51bWJlcnxTdHJpbmdcbiAgKlxuICAqIEByZXR1cm4gQm9vbGVhblxuICAqL1xudmFyIGJpbmFyeVNlYXJjaCA9IGZ1bmN0aW9uIChzb3J0ZWRBcnJheSwgZWxlbWVudCkge1xuICB2YXIgaW5pdCA9IDAsXG4gICAgICBlbmQgPSBzb3J0ZWRBcnJheS5sZW5ndGggLSAxO1xuXG4gIHdoaWxlIChlbmQgPj0gaW5pdCkge1xuICAgIHZhciBtID0gKChlbmQgLSBpbml0KSA+PiAxKSArIGluaXQ7XG4gICAgaWYgKHNvcnRlZEFycmF5W21dID09PSBlbGVtZW50KSByZXR1cm4gbTtcblxuICAgIGlmIChzb3J0ZWRBcnJheVttXSA8IGVsZW1lbnQpIGluaXQgPSBtICsgMTtcbiAgICBlbHNlIGVuZCA9IG0gLSAxO1xuICB9XG5cbiAgcmV0dXJuIC0xO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBiaW5hcnlTZWFyY2g7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYWxnb3JpdGhtcy9hbGdvcml0aG1zL3NlYXJjaC9iaW5hcnlzZWFyY2guanNcbi8vIG1vZHVsZSBpZCA9IDE2MFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRGVwdGggZmlyc3Qgc2VhcmNoIGZvciB0cmVlc1xuICogKGluIG9yZGVyKVxuICovXG52YXIgaW5PcmRlciA9IGZ1bmN0aW9uIChub2RlLCBjYWxsYmFjaykge1xuICBpZiAobm9kZSkge1xuICAgIGluT3JkZXIobm9kZS5sZWZ0LCBjYWxsYmFjayk7XG4gICAgY2FsbGJhY2sobm9kZS52YWx1ZSk7XG4gICAgaW5PcmRlcihub2RlLnJpZ2h0LCBjYWxsYmFjayk7XG4gIH1cbn07XG5cbi8qKlxuICogUHJlIG9yZGVyXG4gKi9cbnZhciBwcmVPcmRlciA9IGZ1bmN0aW9uIChub2RlLCBjYWxsYmFjaykge1xuICBpZiAobm9kZSkge1xuICAgIGNhbGxiYWNrKG5vZGUudmFsdWUpO1xuICAgIHByZU9yZGVyKG5vZGUubGVmdCwgY2FsbGJhY2spO1xuICAgIHByZU9yZGVyKG5vZGUucmlnaHQsIGNhbGxiYWNrKTtcbiAgfVxufTtcblxuLyoqXG4gKiBQb3N0IG9yZGVyXG4gKi9cbnZhciBwb3N0T3JkZXIgPSBmdW5jdGlvbiAobm9kZSwgY2FsbGJhY2spIHtcbiAgaWYgKG5vZGUpIHtcbiAgICBwb3N0T3JkZXIobm9kZS5sZWZ0LCBjYWxsYmFjayk7XG4gICAgcG9zdE9yZGVyKG5vZGUucmlnaHQsIGNhbGxiYWNrKTtcbiAgICBjYWxsYmFjayhub2RlLnZhbHVlKTtcbiAgfVxufTtcblxuLy8gU2V0IGluT3JkZXIgYXMgdGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb25cbmluT3JkZXIucHJlT3JkZXIgPSBwcmVPcmRlcjtcbmluT3JkZXIucG9zdE9yZGVyID0gcG9zdE9yZGVyO1xubW9kdWxlLmV4cG9ydHMgPSBpbk9yZGVyO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2FsZ29yaXRobXMvYWxnb3JpdGhtcy9zZWFyY2gvZGZzLmpzXG4vLyBtb2R1bGUgaWQgPSAxNjFcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAgKiAgRmluZHMgdGhlIG1heGltdW0gb2YgdW5pbW9kYWwgZnVuY3Rpb24gZm4oKSB3aXRoaW4gW2xlZnQsIHJpZ2h0XVxuICAqICBUbyBmaW5kIHRoZSBtaW5pbXVtLCByZXZlcnQgdGhlIGlmL2Vsc2Ugc3RhdGVtZW50IG9yIHJldmVydCB0aGUgY29tcGFyaXNvbi5cbiAgKiAgVGltZSBjb21wbGV4aXR5OiBPKGxvZyhuKSlcbiAgKi9cblxudmFyIHRlcm5hcnlTZWFyY2ggPSBmdW5jdGlvbiAoZm4sIGxlZnQsIHJpZ2h0LCBwcmVjaXNpb24pIHtcbiAgd2hpbGUgKE1hdGguYWJzKHJpZ2h0IC0gbGVmdCkgPiBwcmVjaXNpb24pIHtcbiAgICB2YXIgbGVmdFRoaXJkID0gbGVmdCArIChyaWdodCAtIGxlZnQpIC8gMyxcbiAgICAgICAgcmlnaHRUaGlyZCA9IHJpZ2h0IC0gKHJpZ2h0IC0gbGVmdCkgLyAzO1xuXG4gICAgaWYgKGZuKGxlZnRUaGlyZCkgPCBmbihyaWdodFRoaXJkKSlcbiAgICAgIGxlZnQgPSBsZWZ0VGhpcmQ7IGVsc2VcbiAgICAgIHJpZ2h0ID0gcmlnaHRUaGlyZDtcbiAgfVxuICByZXR1cm4gKGxlZnQgKyByaWdodCkgLyAyO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB0ZXJuYXJ5U2VhcmNoO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2FsZ29yaXRobXMvYWxnb3JpdGhtcy9zZWFyY2gvdGVybmFyeV9zZWFyY2guanNcbi8vIG1vZHVsZSBpZCA9IDE2MlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG52YXIgQ29tcGFyYXRvciA9IHJlcXVpcmUoJy4uLy4uL3V0aWwvY29tcGFyYXRvcicpO1xuXG4vKipcbiAqIEJ1YmJsZSBzb3J0IGFsZ29yaXRobSBPKG5eMilcbiAqL1xudmFyIGJ1YmJsZVNvcnQgPSBmdW5jdGlvbiAoYSwgY29tcGFyYXRvckZuKSB7XG4gIHZhciBjb21wYXJhdG9yID0gbmV3IENvbXBhcmF0b3IoY29tcGFyYXRvckZuKTtcbiAgdmFyIG4gPSBhLmxlbmd0aDtcbiAgdmFyIGJvdW5kID0gbiAtIDE7XG4gIHZhciBjaGVjayA9IGZhbHNlO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG4gLSAxOyBpKyspIHtcbiAgICB2YXIgbmV3Ym91bmQgPSAwO1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgYm91bmQ7IGorKykge1xuICAgICAgaWYgKGNvbXBhcmF0b3IuZ3JlYXRlclRoYW4oYVtqXSwgYVtqICsgMV0pKSB7XG4gICAgICAgIHZhciB0bXAgPSBhW2pdO1xuICAgICAgICBhW2pdID0gYVtqICsgMV07XG4gICAgICAgIGFbaiArIDFdID0gdG1wO1xuICAgICAgICBuZXdib3VuZCA9IGo7XG4gICAgICAgIGNoZWNrID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFjaGVjaylcbiAgICAgIHJldHVybiBhO1xuICAgIGJvdW5kID0gbmV3Ym91bmQ7XG4gIH1cbiAgcmV0dXJuIGE7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJ1YmJsZVNvcnQ7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYWxnb3JpdGhtcy9hbGdvcml0aG1zL3NvcnRpbmcvYnViYmxlX3NvcnQuanNcbi8vIG1vZHVsZSBpZCA9IDE2M1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogU29ydHMgYW4gYXJyYXkgb2Ygb2JqZWN0cyBhY2NvcmRpbmcgdG8gdGhlaXIgJ2tleScgcHJvcGVydHlcbiAqIEV2ZXJ5IG9iamVjdCBpbnNpZGUgdGhlIGFycmF5IE1VU1QgaGF2ZSB0aGUgJ2tleScgcHJvcGVydHkgd2l0aFxuICogYSBpbnRlZ2VyIHZhbHVlLlxuICpcbiAqIEV4ZWN1dGlvbiBUaW1lOiAoMyAqIGFycmF5Lmxlbmd0aCAtIDEpXG4gKiBBc3ltcHRvdGljIENvbXBsZXhpdHk6IE8oYXJyYXkubGVuZ3RoICsgbWF4aW11bUtleSlcbiAqXG4gKiBAcGFyYW0gQXJyYXlcbiAqIEByZXR1cm4gQXJyYXlcbiAqL1xudmFyIGNvdW50aW5nU29ydCA9IGZ1bmN0aW9uIChhcnJheSkge1xuICB2YXIgbWF4ID0gbWF4aW11bUtleShhcnJheSk7XG4gIHZhciBhdXhpbGlhcnlBcnJheSA9IFtdO1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICB2YXIgaTtcblxuICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgcG9zaXRpb24gPSBhcnJheVtpXS5rZXk7XG5cbiAgICBpZiAoYXV4aWxpYXJ5QXJyYXlbcG9zaXRpb25dID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGF1eGlsaWFyeUFycmF5W3Bvc2l0aW9uXSA9IFtdO1xuICAgIH1cblxuICAgIGF1eGlsaWFyeUFycmF5W3Bvc2l0aW9uXS5wdXNoKGFycmF5W2ldKTtcbiAgfVxuXG4gIGFycmF5ID0gW107XG4gIHZhciBwb2ludGVyID0gMDtcblxuICBmb3IgKGkgPSAwOyBpIDw9IG1heDsgaSsrKSB7XG4gICAgaWYgKGF1eGlsaWFyeUFycmF5W2ldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciBsb2NhbExlbmd0aCA9IGF1eGlsaWFyeUFycmF5W2ldLmxlbmd0aDtcblxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBsb2NhbExlbmd0aDsgaisrKSB7XG4gICAgICAgIGFycmF5W3BvaW50ZXIrK10gPSBhdXhpbGlhcnlBcnJheVtpXVtqXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gYXJyYXk7XG59O1xuXG4vKipcbiAqIEZpbmRzIHRoZSBtYXhpbXVtIGtleSBmcm9tIGFuIGFycmF5IG9mIG9iamVjdHNcbiAqXG4gKiBBc3ltcHRvdGljIENvbXBsZXhpdHk6IE8oYXJyYXkubGVuZ3RoKVxuICpcbiAqIEBwYXJhbSBBcnJheVxuICogQHJldHVybiBJbnRlZ2VyXG4gKi9cbnZhciBtYXhpbXVtS2V5ID0gZnVuY3Rpb24gKGFycmF5KSB7XG4gIHZhciBtYXggPSBhcnJheVswXS5rZXk7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmIChhcnJheVtpXS5rZXkgPiBtYXgpIHtcbiAgICAgIG1heCA9IGFycmF5W2ldLmtleTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbWF4O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb3VudGluZ1NvcnQ7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYWxnb3JpdGhtcy9hbGdvcml0aG1zL3NvcnRpbmcvY291bnRpbmdfc29ydC5qc1xuLy8gbW9kdWxlIGlkID0gMTY0XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcbnZhciBNaW5IZWFwID0gcmVxdWlyZSgnLi4vLi4vZGF0YV9zdHJ1Y3R1cmVzL2hlYXAnKS5NaW5IZWFwO1xuXG4vKipcbiAqIEhlYXAgc29ydCBmaXJzdCBjcmVhdGVzIGEgdmFsaWQgaGVhcCBkYXRhIHN0cnVjdHVyZS4gTmV4dCBpdFxuICogaXRlcmF0aXZlbHkgcmVtb3ZlcyB0aGUgc21hbGxlc3QgZWxlbWVudCBvZiB0aGUgaGVhcCB1bnRpbCBpdCdzXG4gKiBlbXB0eS4gVGhlIHRpbWUgY29tcGxleGl0eSBvZiB0aGUgYWxnb3JpdGhtIGlzIE8obi5sZyBuKVxuICovXG52YXIgaGVhcHNvcnQgPSBmdW5jdGlvbiAoYXJyYXksIGNvbXBhcmF0b3JGbikge1xuXG4gIHZhciBtaW5IZWFwID0gbmV3IE1pbkhlYXAoY29tcGFyYXRvckZuKTtcbiAgbWluSGVhcC5oZWFwaWZ5KGFycmF5KTtcblxuICB2YXIgcmVzdWx0ID0gW107XG4gIHdoaWxlICghbWluSGVhcC5pc0VtcHR5KCkpXG4gICAgcmVzdWx0LnB1c2gobWluSGVhcC5leHRyYWN0KCkpO1xuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGhlYXBzb3J0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2FsZ29yaXRobXMvYWxnb3JpdGhtcy9zb3J0aW5nL2hlYXBfc29ydC5qc1xuLy8gbW9kdWxlIGlkID0gMTY1XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcbnZhciBDb21wYXJhdG9yID0gcmVxdWlyZSgnLi4vLi4vdXRpbC9jb21wYXJhdG9yJyk7XG5cbi8qKlxuICogSW5zZXJ0aW9uIHNvcnQgYWxnb3JpdGhtIE8obiArIGQpXG4gKi9cbnZhciBpbnNlcnRpb25Tb3J0ID0gZnVuY3Rpb24gKHZlY3RvciwgY29tcGFyYXRvckZuKSB7XG4gIHZhciBjb21wYXJhdG9yID0gbmV3IENvbXBhcmF0b3IoY29tcGFyYXRvckZuKTtcblxuICBmb3IgKHZhciBpID0gMSwgbGVuID0gdmVjdG9yLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgdmFyIGF1eCA9IHZlY3RvcltpXSxcbiAgICAgIGogPSBpO1xuXG4gICAgd2hpbGUgKGogPiAwICYmIGNvbXBhcmF0b3IubGVzc1RoYW4oYXV4LCB2ZWN0b3JbaiAtIDFdKSkge1xuICAgICAgdmVjdG9yW2pdID0gdmVjdG9yW2ogLSAxXTtcbiAgICAgIGotLTtcbiAgICB9XG5cbiAgICB2ZWN0b3Jbal0gPSBhdXg7XG4gIH1cblxuICByZXR1cm4gdmVjdG9yO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRpb25Tb3J0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2FsZ29yaXRobXMvYWxnb3JpdGhtcy9zb3J0aW5nL2luc2VydGlvbl9zb3J0LmpzXG4vLyBtb2R1bGUgaWQgPSAxNjZcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xudmFyIENvbXBhcmF0b3IgPSByZXF1aXJlKCcuLi8uLi91dGlsL2NvbXBhcmF0b3InKTtcblxuLyoqXG4gKiBNZXJnZSBzb3J0XG4gKiBPKG4ubGduKVxuICovXG52YXIgbWVyZ2VTb3J0SW5pdCA9IGZ1bmN0aW9uIChhLCBjb21wYXJlRm4pIHtcbiAgdmFyIGNvbXBhcmF0b3IgPSBuZXcgQ29tcGFyYXRvcihjb21wYXJlRm4pO1xuXG4gIHJldHVybiAoZnVuY3Rpb24gbWVyZ2VTb3J0KGEpIHtcbiAgICBpZiAoYS5sZW5ndGggPiAxKSB7XG4gICAgICB2YXIgbWlkZGxlID0gYS5sZW5ndGggPj4gMTtcbiAgICAgIHZhciBsZWZ0ID0gbWVyZ2VTb3J0KGEuc2xpY2UoMCwgbWlkZGxlKSk7XG4gICAgICB2YXIgcmlnaHQgPSBtZXJnZVNvcnQoYS5zbGljZShtaWRkbGUpKTtcbiAgICAgIGEgPSBtZXJnZShsZWZ0LCByaWdodCwgY29tcGFyYXRvcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGE7XG4gIH0pKGEpO1xufTtcblxudmFyIG1lcmdlID0gZnVuY3Rpb24gKGEsIGIsIGNvbXBhcmF0b3IpIHtcbiAgdmFyIGkgPSAwLFxuICAgICAgaiA9IDAsXG4gICAgICByZXN1bHQgPSBbXTtcblxuICB3aGlsZSAoaSA8IGEubGVuZ3RoICYmIGogPCBiLmxlbmd0aCkge1xuICAgIHJlc3VsdC5wdXNoKGNvbXBhcmF0b3IubGVzc1RoYW4oYVtpXSwgYltqXSkgPyBhW2krK10gOiBiW2orK10pO1xuICB9XG5cbiAgLy8gQ29uY2F0cyB0aGUgZWxlbWVudHMgZnJvbSB0aGUgc3ViLWFycmF5XG4gIC8vIHRoYXQgaGFzIG5vdCBiZWVuIGluY2x1ZGVkIHlldFxuICByZXR1cm4gcmVzdWx0LmNvbmNhdCgoaSA8IGEubGVuZ3RoID8gYS5zbGljZShpKSA6IGIuc2xpY2UoaikpKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbWVyZ2VTb3J0SW5pdDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9hbGdvcml0aG1zL2FsZ29yaXRobXMvc29ydGluZy9tZXJnZV9zb3J0LmpzXG4vLyBtb2R1bGUgaWQgPSAxNjdcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xudmFyIENvbXBhcmF0b3IgPSByZXF1aXJlKCcuLi8uLi91dGlsL2NvbXBhcmF0b3InKTtcblxuLyoqXG4gKiBRdWlja3NvcnQgcmVjdXJzaXZlbHkgc29ydHMgcGFydHMgb2YgdGhlIGFycmF5IGluXG4gKiBPKG4ubGcgbilcbiAqL1xudmFyIHF1aWNrc29ydEluaXQgPSBmdW5jdGlvbiAoYXJyYXksIGNvbXBhcmF0b3JGbikge1xuXG4gIHZhciBjb21wYXJhdG9yID0gbmV3IENvbXBhcmF0b3IoY29tcGFyYXRvckZuKTtcblxuICByZXR1cm4gKGZ1bmN0aW9uIHF1aWNrc29ydChhcnJheSwgbG8sIGhpKSB7XG4gICAgd2hpbGUgKGxvIDwgaGkpIHtcbiAgICAgIHZhciBwID0gcGFydGl0aW9uKGFycmF5LCBjb21wYXJhdG9yLCBsbywgaGkpO1xuICAgICAgLy9DaG9vc2VzIG9ubHkgdGhlIHNtYWxsZXN0IHBhcnRpdGlvbiB0byB1c2UgcmVjdXJzaW9uIG9uIGFuZFxuICAgICAgLy90YWlsLW9wdGltaXplIHRoZSBvdGhlci4gVGhpcyBndWFyYW50ZWVzIE8obG9nIG4pIHNwYWNlIGluIHdvcnN0IGNhc2UuXG4gICAgICBpZiAocCAtIGxvIDwgaGkgLSBwKSB7XG4gICAgICAgIHF1aWNrc29ydChhcnJheSwgbG8sIHAgLSAxKTtcbiAgICAgICAgbG8gPSBwICsgMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHF1aWNrc29ydChhcnJheSwgcCArIDEsIGhpKTtcbiAgICAgICAgaGkgPSBwIC0gMTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYXJyYXk7XG4gIH0pKGFycmF5LCAwLCBhcnJheS5sZW5ndGggLSAxKTtcbn07XG5cbi8qKlxuICogQ2hvb3NlcyBhIHBpdm90IGFuZCBtYWtlcyBldmVyeSBlbGVtZW50IHRoYXQgaXNcbiAqIGxvd2VyIHRoYW4gdGhlIHBpdm90IG1vdmUgdG8gaXRzIGxlZnQsIGFuZCBldmVyeVxuICogZ3JlYXRlciBlbGVtZW50IG1vdmVzIHRvIGl0cyByaWdodFxuICpcbiAqIEByZXR1cm4gTnVtYmVyIHRoZSBwb3NpdG9uIG9mIHRoZSBwaXZvdFxuICovXG52YXIgcGFydGl0aW9uID0gZnVuY3Rpb24gKGEsIGNvbXBhcmF0b3IsIGxvLCBoaSkge1xuICAvLyBwaWNrIGEgcmFuZG9tIGVsZW1lbnQsIHN3YXAgd2l0aCB0aGUgcmlnaHRtb3N0IGFuZFxuICAvLyB1c2UgaXQgYXMgcGl2b3RcbiAgc3dhcChhLCBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaGkgLSBsbykpICsgbG8sIGhpKTtcbiAgdmFyIHBpdm90ID0gaGk7XG5cbiAgLy8gZGl2aWRlclBvc2l0aW9uIGtlZXBzIHRyYWNrIG9mIHRoZSBwb3NpdGlvblxuICAvLyB3aGVyZSB0aGUgcGl2b3Qgc2hvdWxkIGJlIGluc2VydGVkXG4gIHZhciBkaXZpZGVyUG9zaXRpb24gPSBsbztcblxuICBmb3IgKHZhciBpID0gbG87IGkgPCBoaTsgaSsrKSB7XG4gICAgaWYgKGNvbXBhcmF0b3IubGVzc1RoYW4oYVtpXSwgYVtwaXZvdF0pKSB7XG4gICAgICBzd2FwKGEsIGksIGRpdmlkZXJQb3NpdGlvbik7XG4gICAgICBkaXZpZGVyUG9zaXRpb24rKztcbiAgICB9XG4gIH1cbiAgc3dhcChhLCBkaXZpZGVyUG9zaXRpb24sIHBpdm90KTtcbiAgcmV0dXJuIGRpdmlkZXJQb3NpdGlvbjtcbn07XG5cbi8qKlxuICogU3dhcHMgdHdvIGVsZW1lbnRzIGluIHRoZSBhcnJheVxuICovXG52YXIgc3dhcCA9IGZ1bmN0aW9uIChhcnJheSwgeCwgeSkge1xuICB2YXIgdG1wID0gYXJyYXlbeV07XG4gIGFycmF5W3ldID0gYXJyYXlbeF07XG4gIGFycmF5W3hdID0gdG1wO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBxdWlja3NvcnRJbml0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2FsZ29yaXRobXMvYWxnb3JpdGhtcy9zb3J0aW5nL3F1aWNrc29ydC5qc1xuLy8gbW9kdWxlIGlkID0gMTY4XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBTb3J0cyBhbiBhcnJheSBvZiBvYmplY3RzIGFjY29yZGluZyB0byB0aGVpciAna2V5JyBwcm9wZXJ0eVxuICogRXZlcnkgb2JqZWN0IGluc2lkZSB0aGUgYXJyYXkgTVVTVCBoYXZlIHRoZSAna2V5JyBwcm9wZXJ0eSB3aXRoXG4gKiBhIGludGVnZXIgdmFsdWUuXG4gKlxuICogQXN5bXB0b3RpYyBDb21wbGV4aXR5OiBPKGFycmF5Lmxlbmd0aCAqIGQpLCB3aGVyZSAnZCcgcmVwcmVzZW50c1xuICogdGhlIGFtb3VudCBvZiBkaWdpdHMgaW4gdGhlIGxhcmdlciBrZXkgb2YgdGhlIGFycmF5XG4gKlxuICogQHBhcmFtIEFycmF5XG4gKiBAcmV0dXJuIEFycmF5XG4gKi9cbnZhciByYWRpeFNvcnQgPSBmdW5jdGlvbiAoYXJyYXkpIHtcbiAgdmFyIG1heCA9IG1heGltdW1LZXkoYXJyYXkpO1xuICB2YXIgZGlnaXRzTWF4ID0gKG1heCA9PT0gMCA/IDEgOlxuICAgIDEgKyBNYXRoLmZsb29yKE1hdGgubG9nKG1heCkgLyBNYXRoLmxvZygxMCkpKTsgLy8gbG9nIGJhc2UgMTBcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGRpZ2l0c01heDsgaSsrKSB7XG4gICAgYXJyYXkgPSBhdXhpbGlhcnlDb3VudGluZ1NvcnQoYXJyYXksIGkpO1xuICB9XG5cbiAgcmV0dXJuIGFycmF5O1xufTtcblxuLyoqXG4gKiBBdXhpbGlhcnkgc29ydGluZyBtZXRob2QgZm9yIFJhZGl4U29ydFxuICogU29ydHMgYW4gYXJyYXkgb2Ygb2JqZWN0cyBhY2NvcmRpbmcgdG8gb25seSBvbmUgZGlnaXQgb2ZcbiAqIHRoZWlyICdrZXknIHByb3BlcnR5LiBUaGUgZGlnaXQgdG8gYmUgc29ydGVkIGlzIGRldGVybWluZWRcbiAqIGJ5IHRoZSAnbW9kJyB2YXJpYWJsZVxuICogRXZlcnkgb2JqZWN0IGluc2lkZSB0aGUgYXJyYXkgTVVTVCBoYXZlIHRoZSAna2V5JyBwcm9wZXJ0eSB3aXRoXG4gKiBhIGludGVnZXIgdmFsdWUuXG4gKlxuICogRXhlY3V0aW9uIFRpbWU6ICgyICogYXJyYXkubGVuZ3RoICsgMTApXG4gKiBBc3ltcHRvdGljIENvbXBsZXhpdHk6IE8oYXJyYXkubGVuZ3RoKVxuICpcbiAqIEBwYXJhbSBBcnJheVxuICogQHJldHVybiBBcnJheVxuICovXG52YXIgYXV4aWxpYXJ5Q291bnRpbmdTb3J0ID0gZnVuY3Rpb24gKGFycmF5LCBtb2QpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgdmFyIGJ1Y2tldCA9IFtdO1xuICB2YXIgaTtcblxuICBmb3IgKGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgIGJ1Y2tldFtpXSA9IFtdO1xuICB9XG5cbiAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGRpZ2l0ID0gcGFyc2VJbnQoKGFycmF5W2ldLmtleSAvIE1hdGgucG93KDEwLCBtb2QpKS50b0ZpeGVkKG1vZCkpICUgMTA7XG4gICAgYnVja2V0W2RpZ2l0XS5wdXNoKGFycmF5W2ldKTtcbiAgfVxuXG4gIHZhciBwb2ludGVyID0gMDtcblxuICBmb3IgKGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgIHZhciBsb2NhbExlbmd0aCA9IGJ1Y2tldFtpXS5sZW5ndGg7XG5cbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IGxvY2FsTGVuZ3RoOyBqKyspIHtcbiAgICAgIGFycmF5W3BvaW50ZXIrK10gPSBidWNrZXRbaV1bal07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGFycmF5O1xufTtcblxuLyoqXG4gKiBGaW5kcyB0aGUgbWF4aW11bSBrZXkgZnJvbSBhbiBhcnJheSBvZiBvYmplY3RzXG4gKlxuICogQXN5bXB0b3RpYyBDb21wbGV4aXR5OiBPKGFycmF5Lmxlbmd0aClcbiAqXG4gKiBAcGFyYW0gQXJyYXlcbiAqIEByZXR1cm4gSW50ZWdlciBpZiBhcnJheSBub24tZW1wdHlcbiAqICAgICAgICAgVW5kZWZpbmVkIG90aGVyd2lzZVxuICovXG52YXIgbWF4aW11bUtleSA9IGZ1bmN0aW9uIChhKSB7XG4gIHZhciBtYXg7XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChtYXggPT09IHVuZGVmaW5lZCB8fCBhW2ldLmtleSA+IG1heCkge1xuICAgICAgbWF4ID0gYVtpXS5rZXk7XG4gICAgfVxuICB9XG4gIHJldHVybiBtYXg7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJhZGl4U29ydDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9hbGdvcml0aG1zL2FsZ29yaXRobXMvc29ydGluZy9yYWRpeF9zb3J0LmpzXG4vLyBtb2R1bGUgaWQgPSAxNjlcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xudmFyIENvbXBhcmF0b3IgPSByZXF1aXJlKCcuLi8uLi91dGlsL2NvbXBhcmF0b3InKTtcbi8qKlxuICogU2VsZWN0aW9uIHNvcnQgYWxnb3JpdGhtIE8obl4yKVxuICovXG52YXIgc2VsZWN0aW9uU29ydCA9IGZ1bmN0aW9uIChhLCBjb21wYXJhdG9yRm4pIHtcbiAgdmFyIGNvbXBhcmF0b3IgPSBuZXcgQ29tcGFyYXRvcihjb21wYXJhdG9yRm4pO1xuICB2YXIgbiA9IGEubGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG4gLSAxOyBpKyspIHtcbiAgICB2YXIgbWluID0gaTtcbiAgICBmb3IgKHZhciBqID0gaSArIDE7IGogPCBuOyBqKyspIHtcbiAgICAgIGlmIChjb21wYXJhdG9yLmdyZWF0ZXJUaGFuKGFbbWluXSwgYVtqXSkpIHtcbiAgICAgICAgbWluID0gajtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG1pbiAhPT0gaSkge1xuICAgICAgdmFyIHRtcCA9IGFbaV07XG4gICAgICBhW2ldID0gYVttaW5dO1xuICAgICAgYVttaW5dID0gdG1wO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBzZWxlY3Rpb25Tb3J0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2FsZ29yaXRobXMvYWxnb3JpdGhtcy9zb3J0aW5nL3NlbGVjdGlvbl9zb3J0LmpzXG4vLyBtb2R1bGUgaWQgPSAxNzBcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xudmFyIENvbXBhcmF0b3IgPSByZXF1aXJlKCcuLi8uLi91dGlsL2NvbXBhcmF0b3InKTtcbi8qKlxuICogc2hlbGwgc29ydCAgd29yc3Q6TyhuIGxnIG4pICBiZXN0Ok8obilcbiAqL1xudmFyIHNoZWxsU29ydCA9IGZ1bmN0aW9uIChhcnJheSwgY29tcGFyYXRvckZuKSB7XG4gIHZhciBjb21wYXJhdG9yID0gbmV3IENvbXBhcmF0b3IoY29tcGFyYXRvckZuKSxcbiAgICBiZWdpbiA9IDAsXG4gICAgZW5kID0gYXJyYXkubGVuZ3RoIC0gMSxcbiAgICBnYXAgPSBwYXJzZUludCgoZW5kIC0gYmVnaW4gKyAxKSAvIDIpLFxuICAgIGkgPSAwLCBqID0gMCwgdGVtcCA9IDA7XG5cbiAgd2hpbGUgKGdhcCA+PSAxKSB7XG4gICAgZm9yIChpID0gYmVnaW4gKyBnYXA7aSA8PSBlbmQ7aSArPSAxKSB7XG4gICAgICB0ZW1wID0gYXJyYXlbaV07XG4gICAgICBqID0gaSAtIGdhcDtcbiAgICAgIHdoaWxlIChqID49IGJlZ2luICYmIGNvbXBhcmF0b3IuZ3JlYXRlclRoYW4oYXJyYXlbal0sIHRlbXApKSB7XG4gICAgICAgIGFycmF5W2ogKyBnYXBdID0gYXJyYXlbal07XG4gICAgICAgIGogPSBqIC0gZ2FwO1xuICAgICAgfVxuICAgICAgYXJyYXlbaiArIGdhcF0gPSB0ZW1wO1xuICAgIH1cbiAgICBnYXAgPSBwYXJzZUludChnYXAgLyAyKTtcbiAgfVxuXG4gIHJldHVybiBhcnJheTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gc2hlbGxTb3J0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2FsZ29yaXRobXMvYWxnb3JpdGhtcy9zb3J0aW5nL3NoZWxsX3NvcnQuanNcbi8vIG1vZHVsZSBpZCA9IDE3MVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciBDb21wYXJhdG9yID0gcmVxdWlyZSgnLi4vLi4vdXRpbC9jb21wYXJhdG9yJyk7XG5cbi8qKlxuICogc2hvcnQgYnViYmxlIHNvcnQgYWxnb3JpdGhtXG4gKiB3b3JzdDogTyhuXjIpIGJlc3Q6IE8obilcbiAqL1xuXG5mdW5jdGlvbiBzaG9ydEJ1YmJsZVNvcnQoYXJyYXksIGNvbXBhcmF0b3JGbikge1xuICB2YXIgY29tcGFyYXRvciA9IG5ldyBDb21wYXJhdG9yKGNvbXBhcmF0b3JGbik7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGggLSAxO1xuICB2YXIgaSA9IDA7XG5cbiAgZm9yIChpOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgY3VycmVudCA9IGFycmF5W2ldO1xuICAgIHZhciBuZXh0ID0gYXJyYXlbaSsxXTtcblxuICAgIC8qKlxuICAgICAqIElmIHRoZSBjdXJyZW50IHZhbHVlIGlmIGdyZWF0ZXIgdGhhbiB0aGUgbmV4dDpcbiAgICAgKiAtIHNldCBjdXJyZW50IHZhbHVlIHRvIG5leHQgdmFsdWU7XG4gICAgICogLSBhbmQgc2V0IG5leHQgdmFsdWUgdG8gY3VycmVudCB2YWx1ZTtcbiAgICAgKiAtIHRoZW4gcmVzZXQgaXRlcmF0b3IgY291bnRlciB0byByZXNjYW4gZm9yIHZhbHVlcyB0byBiZSBzb3J0ZWQuXG4gICAgICovXG5cbiAgICBpZiAoY29tcGFyYXRvci5ncmVhdGVyVGhhbihjdXJyZW50LCBuZXh0KSkge1xuICAgICAgYXJyYXlbaSsxXSA9IGN1cnJlbnQ7XG4gICAgICBhcnJheVtpXSA9IG5leHQ7XG4gICAgICBpID0gLTE7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3J0QnViYmxlU29ydDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9hbGdvcml0aG1zL2FsZ29yaXRobXMvc29ydGluZy9zaG9ydF9idWJibGVfc29ydC5qc1xuLy8gbW9kdWxlIGlkID0gMTcyXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qKlxuICpcbiAqIFwiSGFtbWluZyBkaXN0YW5jZSBiZXR3ZWVuIHR3byBzdHJpbmdzIG9mIGVxdWFsIGxlbmd0aCBpcyB0aGUgbnVtYmVyIG9mXG4gKiBwb3NpdGlvbnMgYXQgd2hpY2ggdGhlIGNvcnJlc3BvbmRpbmcgc3ltYm9scyBhcmUgZGlmZmVyZW50LiBJbiBhbm90aGVyIHdheSxcbiAqIGl0IG1lYXN1cmVzIHRoZSBtaW5pbXVtIG51bWJlciBvZiBzdWJzdGl0dXRpb25zIHJlcXVpcmVkIHRvIGNoYW5nZSBvbmUgc3RyaW5nXG4gKiBpbnRvIHRoZSBvdGhlci5cIiAtIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0hhbW1pbmdfZGlzdGFuY2VcbiAqXG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIGhhbW1pbmcgPSBmdW5jdGlvbiAoYSwgYikge1xuICBpZiAoYS5sZW5ndGggIT09IGIubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdTdHJpbmdzIG11c3QgYmUgZXF1YWwgaW4gbGVuZ3RoJyk7XG4gIH1cblxuICB2YXIgZGlzdCA9IDA7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGFbaV0gIT09IGJbaV0pIHtcbiAgICAgIGRpc3QrKztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZGlzdDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaGFtbWluZztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9hbGdvcml0aG1zL2FsZ29yaXRobXMvc3RyaW5nL2hhbW1pbmcuanNcbi8vIG1vZHVsZSBpZCA9IDE3M1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cblxudmFyIGh1ZmZtYW4gPSB7fTtcblxuXG4vKipcbiAqIE1heGltdW0gYmxvY2sgc2l6ZSB1c2VkIGJ5IGZ1bmN0aW9ucyBcImNvbXByZXNzXCIsIFwiZGVjb21wcmVzc1wiLlxuICpcbiAqIEBjb25zdFxuICovXG52YXIgTUFYX0JMT0NLX1NJWkUgPSAoLTEgPj4+IDApLnRvU3RyaW5nKDIpLmxlbmd0aDtcblxuXG4vKipcbiAqIENvbXByZXNzIDAtMSBzdHJpbmcgdG8gaW50MzIgYXJyYXkuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZ1xuICogQHJldHVybiB7bnVtYmVyW119XG4gKi9cbnZhciBjb21wcmVzcyA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgdmFyIGJsb2NrcyA9IFtdO1xuICB2YXIgY3VycmVudEJsb2NrID0gMCwgY3VycmVudEJsb2NrU2l6ZSA9IDA7XG5cbiAgc3RyaW5nLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChjaGFyKSB7XG4gICAgY3VycmVudEJsb2NrID0gKGN1cnJlbnRCbG9jayA8PCAxKSB8IGNoYXI7XG4gICAgY3VycmVudEJsb2NrU2l6ZSArPSAxO1xuXG4gICAgaWYgKGN1cnJlbnRCbG9ja1NpemUgPT09IE1BWF9CTE9DS19TSVpFKSB7XG4gICAgICBibG9ja3MucHVzaChjdXJyZW50QmxvY2spO1xuICAgICAgY3VycmVudEJsb2NrID0gY3VycmVudEJsb2NrU2l6ZSA9IDA7XG4gICAgfVxuICB9KTtcblxuICAvLyBBcHBlbmQgbGFzdCBibG9jayBzaXplIHRvIHRoZSBlbmQuXG4gIGlmIChjdXJyZW50QmxvY2tTaXplKSB7XG4gICAgYmxvY2tzLnB1c2goY3VycmVudEJsb2NrLCBjdXJyZW50QmxvY2tTaXplKTtcbiAgfVxuICBlbHNlIHtcbiAgICBibG9ja3MucHVzaChNQVhfQkxPQ0tfU0laRSk7XG4gIH1cblxuICByZXR1cm4gYmxvY2tzO1xufTtcblxuXG4vKipcbiAqIERlY29tcHJlc3MgaW50MzIgYXJyYXkgYmFjayB0byAwLTEgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyW119IGFycmF5XG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbnZhciBkZWNvbXByZXNzID0gZnVuY3Rpb24gKGFycmF5KSB7XG4gIGlmICghYXJyYXkubGVuZ3RoKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIGVsc2UgaWYgKGFycmF5Lmxlbmd0aCA9PT0gMSkge1xuICAgIHRocm93IG5ldyBFcnJvcignQ29tcHJlc3NlZCBhcnJheSBtdXN0IGJlIGVpdGhlciBlbXB0eSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ29yIGF0IGxlYXN0IDIgYmxvY2tzIGJpZy4nKTtcbiAgfVxuXG4gIHZhciBwYWRkaW5nID0gbmV3IEFycmF5KE1BWF9CTE9DS19TSVpFICsgMSkuam9pbigwKTtcblxuICB2YXIgc3RyaW5nID0gYXJyYXkuc2xpY2UoMCwgLTIpLm1hcChmdW5jdGlvbiAoYmxvY2spIHtcbiAgICByZXR1cm4gKHBhZGRpbmcgKyAoYmxvY2sgPj4+IDApLnRvU3RyaW5nKDIpKS5zbGljZSgtcGFkZGluZy5sZW5ndGgpO1xuICB9KS5qb2luKCcnKTtcblxuICAvLyBBcHBlbmQgdGhlIGxhc3QgYmxvY2suXG4gIHZhciBsYXN0QmxvY2tTaXplID0gYXJyYXkuc2xpY2UoLTEpWzBdO1xuICB2YXIgbGFzdEJsb2NrID0gYXJyYXkuc2xpY2UoLTIpWzBdO1xuICBzdHJpbmcgKz0gKHBhZGRpbmcgKyAobGFzdEJsb2NrID4+PiAwKS50b1N0cmluZygyKSkuc2xpY2UoLWxhc3RCbG9ja1NpemUpO1xuXG4gIHJldHVybiBzdHJpbmc7XG59O1xuXG5cbi8qKlxuICogQXBwbHkgSHVmZm1hbiBlbmNvZGluZyB0byBhIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtjb21wcmVzc2VkPWZhbHNlXSAtIFdoZXRoZXIgY29tcHJlc3MgdGhlIHN0cmluZyB0byBiaXRzLlxuICogQHJldHVybiB7e2VuY29kaW5nOiBPYmplY3QuPHN0cmluZywgc3RyaW5nPiwgdmFsdWU6IHN0cmluZ3xudW1iZXJbXX19XG4gKi9cbmh1ZmZtYW4uZW5jb2RlID0gZnVuY3Rpb24gKHN0cmluZywgY29tcHJlc3NlZCkge1xuICBpZiAoIXN0cmluZy5sZW5ndGgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZW5jb2Rpbmc6IHt9LFxuICAgICAgdmFsdWU6IChjb21wcmVzc2VkID8gW10gOiAnJylcbiAgICB9O1xuICB9XG5cbiAgdmFyIGNvdW50ZXIgPSB7fTtcbiAgc3RyaW5nLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChjaGFyKSB7XG4gICAgY291bnRlcltjaGFyXSA9IChjb3VudGVyW2NoYXJdIHx8IDApICsgMTtcbiAgfSk7XG5cbiAgdmFyIGxldHRlcnMgPSBPYmplY3Qua2V5cyhjb3VudGVyKS5tYXAoZnVuY3Rpb24gKGNoYXIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY2hhcjogY2hhcixcbiAgICAgIGNvdW50OiBjb3VudGVyW2NoYXJdXG4gICAgfTtcbiAgfSk7XG5cbiAgdmFyIGNvbXBhcmUgPSBmdW5jdGlvbiAoYSwgYikge1xuICAgIHJldHVybiBhLmNvdW50IC0gYi5jb3VudDtcbiAgfTtcbiAgdmFyIGxlc3MgPSBmdW5jdGlvbiAoYSwgYikge1xuICAgIHJldHVybiBhICYmIChiICYmIChhLmNvdW50IDwgYi5jb3VudCkgfHwgIWIpO1xuICB9O1xuXG4gIGxldHRlcnMuc29ydChjb21wYXJlKTtcblxuICAvLyBFYWNoIHRpbWUgdHdvIGxlYXN0IGxldHRlcnMgYXJlIG1lcmdlZCBpbnRvIG9uZSwgdGhlIHJlc3VsdCBpcyBwdXNoaW5nIGludG9cbiAgLy8gdGhpcyBidWZmZXIuIFNpbmNlIHRoZSBsZXR0ZXJzIGFyZSBwdXNoaW5nIGluIGFzY2VuZGluZyBvcmRlciBvZiBmcmVxdWVuY3ksXG4gIC8vIG5vIG1vcmUgc29ydGluZyBpcyBldmVyIHJlcXVpcmVkLlxuICB2YXIgYnVmZmVyID0gW107XG4gIHZhciBsZXR0ZXJzSW5kZXggPSAwLCBidWZmZXJJbmRleCA9IDA7XG5cbiAgdmFyIGV4dHJhY3RNaW5pbXVtID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBsZXNzKGxldHRlcnNbbGV0dGVyc0luZGV4XSwgYnVmZmVyW2J1ZmZlckluZGV4XSkgP1xuICAgICAgbGV0dGVyc1tsZXR0ZXJzSW5kZXgrK10gOiBidWZmZXJbYnVmZmVySW5kZXgrK107XG4gIH07XG5cbiAgZm9yICh2YXIgbnVtTGV0dGVycyA9IGxldHRlcnMubGVuZ3RoOyBudW1MZXR0ZXJzID4gMTsgLS1udW1MZXR0ZXJzKSB7XG4gICAgdmFyIGEgPSBleHRyYWN0TWluaW11bSgpLCBiID0gZXh0cmFjdE1pbmltdW0oKTtcbiAgICBhLmNvZGUgPSAnMCc7XG4gICAgYi5jb2RlID0gJzEnO1xuICAgIHZhciB1bmlvbiA9IHtcbiAgICAgIGNvdW50OiBhLmNvdW50ICsgYi5jb3VudCxcbiAgICAgIHBhcnRzOiBbYSwgYl1cbiAgICB9O1xuICAgIGJ1ZmZlci5wdXNoKHVuaW9uKTtcbiAgfVxuXG4gIC8vIEF0IHRoaXMgcG9pbnQgdGhlcmUgaXMgYSBzaW5nbGUgbGV0dGVyIGxlZnQuXG4gIHZhciByb290ID0gZXh0cmFjdE1pbmltdW0oKTtcbiAgcm9vdC5jb2RlID0gKGxldHRlcnMubGVuZ3RoID4gMSkgPyAnJyA6ICcwJztcblxuICAvLyBVbnJvbGwgdGhlIGNvZGUgcmVjdXJzaXZlbHkgaW4gcmV2ZXJzZS5cbiAgKGZ1bmN0aW9uIHVucm9sbChwYXJlbnQpIHtcbiAgICBpZiAocGFyZW50LnBhcnRzKSB7XG4gICAgICB2YXIgYSA9IHBhcmVudC5wYXJ0c1swXSwgYiA9IHBhcmVudC5wYXJ0c1sxXTtcbiAgICAgIGEuY29kZSArPSBwYXJlbnQuY29kZTtcbiAgICAgIGIuY29kZSArPSBwYXJlbnQuY29kZTtcbiAgICAgIHVucm9sbChhKTtcbiAgICAgIHVucm9sbChiKTtcbiAgICB9XG4gIH0pKHJvb3QpO1xuXG4gIHZhciBlbmNvZGluZyA9IGxldHRlcnMucmVkdWNlKGZ1bmN0aW9uIChhY2MsIGxldHRlcikge1xuICAgIGFjY1tsZXR0ZXIuY2hhcl0gPSBsZXR0ZXIuY29kZS5zcGxpdCgnJykucmV2ZXJzZSgpLmpvaW4oJycpO1xuICAgIHJldHVybiBhY2M7XG4gIH0sIHt9KTtcblxuICAvLyBGaW5hbGx5LCBhcHBseSB0aGUgZW5jb2RpbmcgdG8gdGhlIGdpdmVuIHN0cmluZy5cbiAgdmFyIHJlc3VsdCA9IHN0cmluZy5zcGxpdCgnJykubWFwKGZ1bmN0aW9uIChjaGFyKSB7XG4gICAgcmV0dXJuIGVuY29kaW5nW2NoYXJdO1xuICB9KS5qb2luKCcnKTtcblxuICByZXR1cm4ge1xuICAgIGVuY29kaW5nOiBlbmNvZGluZyxcbiAgICB2YWx1ZTogKGNvbXByZXNzZWQgPyBjb21wcmVzcyhyZXN1bHQpIDogcmVzdWx0KVxuICB9O1xufTtcblxuXG4vKipcbiAqIERlY29kZSBhIEh1ZmZtYW4tZW5jb2RlZCBzdHJpbmcgb3IgY29tcHJlc3NlZCBudW1iZXIgc2VxdWVuY2UuXG4gKlxuICogQHBhcmFtIHtPYmplY3QuPHN0cmluZywgc3RyaW5nPn0gZW5jb2RpbmcgLSBNYXBzIGNoYXJhY3RlcnMgdG8gMC0xIHNlcXVlbmNlcy5cbiAqIEBwYXJhbSB7c3RyaW5nfG51bWJlcltdfSBlbmNvZGVkU3RyaW5nXG4gKiBAcmV0dXJuIHtzdHJpbmd9IERlY29kZWQgc3RyaW5nLlxuICovXG5odWZmbWFuLmRlY29kZSA9IGZ1bmN0aW9uIChlbmNvZGluZywgZW5jb2RlZFN0cmluZykge1xuICBpZiAoQXJyYXkuaXNBcnJheShlbmNvZGVkU3RyaW5nKSkge1xuICAgIGVuY29kZWRTdHJpbmcgPSBkZWNvbXByZXNzKGVuY29kZWRTdHJpbmcpO1xuICB9XG5cbiAgLy8gV2UgY2FuIG1ha2UgdXNlIG9mIHRoZSBmYWN0IHRoYXQgZW5jb2RpbmcgbWFwcGluZyBpcyBhbHdheXMgb25lLXRvLW9uZVxuICAvLyBhbmQgcmVseSBvbiB0aGUgcG93ZXIgb2YgSlMgaGFzaGVzIGluc3RlYWQgb2YgYnVpbGRpbmcgaGFuZC1tYWRlIEZTTXMuXG4gIHZhciBsZXR0ZXJCeUNvZGUgPSBPYmplY3Qua2V5cyhlbmNvZGluZykucmVkdWNlKGZ1bmN0aW9uIChhY2MsIGxldHRlcikge1xuICAgIGFjY1tlbmNvZGluZ1tsZXR0ZXJdXSA9IGxldHRlcjtcbiAgICByZXR1cm4gYWNjO1xuICB9LCB7fSk7XG5cbiAgdmFyIGRlY29kZWRMZXR0ZXJzID0gW107XG5cbiAgdmFyIHVucmVzb2x2ZWQgPSBlbmNvZGVkU3RyaW5nLnNwbGl0KCcnKS5yZWR1Y2UoZnVuY3Rpb24gKGNvZGUsIGNoYXIpIHtcbiAgICBjb2RlICs9IGNoYXI7XG4gICAgdmFyIGxldHRlciA9IGxldHRlckJ5Q29kZVtjb2RlXTtcbiAgICBpZiAobGV0dGVyKSB7XG4gICAgICBkZWNvZGVkTGV0dGVycy5wdXNoKGxldHRlcik7XG4gICAgICBjb2RlID0gJyc7XG4gICAgfVxuICAgIHJldHVybiBjb2RlO1xuICB9LCAnJyk7XG5cbiAgaWYgKHVucmVzb2x2ZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nIHRvIGRlY29kZS4nKTtcbiAgfVxuXG4gIHJldHVybiBkZWNvZGVkTGV0dGVycy5qb2luKCcnKTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBodWZmbWFuO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2FsZ29yaXRobXMvYWxnb3JpdGhtcy9zdHJpbmcvaHVmZm1hbi5qc1xuLy8gbW9kdWxlIGlkID0gMTc0XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBTdHJpbmcgTWF0Y2hpbmcgYWxnb3JpdGhtXG4gKiBUcmllcyB0byBtYXRjaCB0aGUgZ2l2ZW4gcGF0dGVybiBpbnNpZGUgdGhlIGdpdmVuIHRleHRcbiAqIElmIHRoZSBwYXR0ZXJuIGV4aXN0cyBpbnNpZGUgdGhlIHRleHQsIGl0IHdpbGwgYmUgcmV0dXJuZWRcbiAqIHRoZSBpbmRleCBvZiB0aGUgYmVnaW5pbmcgb2YgdGhlIHBhdHRlcm4gaW4gdGhlIHRleHQsXG4gKiBvdGhlcndpc2UgaXQgd2lsbCBiZSByZXR1cm5lZCB0aGUgbGVuZ3RoIG9mIHRoZSB0ZXh0XG4gKlxuICogQXN5bXB0b3RpYyBDb21wbGV4aXR5OiBPKHRleHQubGVuZ3RoKVxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IHRleHQgb2YgTnVtYmVycywgU3RyaW5ncyBvciBDaGFyYWN0ZXJzXG4gKiAgICAgb3Ige1N0cmluZ31cbiAqIEBwYXJhbSB7QXJyYXl9IHBhdHRlcm4gb2YgTnVtYmVycywgU3RyaW5ncyBvciBDaGFyYWN0ZXJzXG4gKiAgICAgb3Ige1N0cmluZ31cbiAqIEByZXR1cm4ge051bWJlcn1cbiAqL1xudmFyIGtudXRoTW9ycmlzUHJhdHQgPSBmdW5jdGlvbiAodGV4dCwgcGF0dGVybikge1xuICB2YXIgdGV4dExlbmd0aCA9IHRleHQubGVuZ3RoO1xuICB2YXIgcGF0dGVybkxlbmd0aCA9IHBhdHRlcm4ubGVuZ3RoO1xuICB2YXIgbSA9IDA7XG4gIHZhciBpID0gMDtcbiAgdmFyIHRhYmxlID0gYnVpbGRUYWJsZShwYXR0ZXJuKTtcblxuICB3aGlsZSAobSArIGkgPCB0ZXh0TGVuZ3RoKSB7XG4gICAgaWYgKHBhdHRlcm5baV0gPT09IHRleHRbbSArIGldKSB7XG4gICAgICBpZiAoaSA9PT0gcGF0dGVybkxlbmd0aCAtIDEpIHtcbiAgICAgICAgcmV0dXJuIG07XG4gICAgICB9XG4gICAgICArK2k7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaWYgKHRhYmxlW2ldID49IDApIHtcbiAgICAgICAgaSA9IHRhYmxlW2ldO1xuICAgICAgICBtID0gbSArIGkgLSB0YWJsZVtpXTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBpID0gMDtcbiAgICAgICAgKyttO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0ZXh0TGVuZ3RoO1xufTtcblxuLyoqXG4gKiBCdWlsZHMgdGhlIGRpbmFtaWMgdGFibGUgb2YgdGhlIGdpdmVuIHBhdHRlcm5cbiAqIHRvIHJlY29yZCBob3cgdGhlIHBhdHRlcm4gY2FuIG1hdGNoIGl0IHNlbGZcbiAqXG4gKiBBc3ltcHRvdGljIENvbXBsZXhpdHk6IE8ocGF0dGVybi5sZW5ndGgpXG4gKlxuICogQHBhcmFtIHtBcnJheX0gcGF0dGVybiBvZiBOdW1iZXJzLCBTdHJpbmdzIG9yIENoYXJhY3RlcnNcbiAqICAgICBvciB7U3RyaW5nfVxuICogQHJldHVybiB7QXJyYXl9IG9mIEludGVnZXJzXG4gKi9cbnZhciBidWlsZFRhYmxlID0gZnVuY3Rpb24gKHBhdHRlcm4pIHtcbiAgdmFyIGxlbmd0aCA9IHBhdHRlcm4ubGVuZ3RoO1xuICB2YXIgdGFibGUgPSBbXTtcbiAgdmFyIHBvc2l0aW9uID0gMjtcbiAgdmFyIGNuZCA9IDA7XG5cbiAgdGFibGVbMF0gPSAtMTtcbiAgdGFibGVbMV0gPSAwO1xuXG4gIHdoaWxlIChwb3NpdGlvbiA8IGxlbmd0aCkge1xuICAgIGlmIChwYXR0ZXJuW3Bvc2l0aW9uIC0gMV0gPT09IHBhdHRlcm5bY25kXSkge1xuICAgICAgKytjbmQ7XG4gICAgICB0YWJsZVtwb3NpdGlvbl0gPSBjbmQ7XG4gICAgICArK3Bvc2l0aW9uO1xuICAgIH1cbiAgICBlbHNlIGlmIChjbmQgPiAwKSB7XG4gICAgICBjbmQgPSB0YWJsZVtjbmRdO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRhYmxlW3Bvc2l0aW9uXSA9IDA7XG4gICAgICArK3Bvc2l0aW9uO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0YWJsZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ga251dGhNb3JyaXNQcmF0dDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9hbGdvcml0aG1zL2FsZ29yaXRobXMvc3RyaW5nL2tudXRoX21vcnJpc19wcmF0dC5qc1xuLy8gbW9kdWxlIGlkID0gMTc1XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBlZGl0IGRpc3RhbmNlIGJldHdlZW4gdHdvIHN0cmluZ3NcbiAqIGNvbnNpZGVyaW5nIHRoZSBzYW1lIGNvc3Qgb2YgMSB0byBldmVyeSBvcGVyYXRpb25cbiAqIChhZGRpdGlvbiwgZGVsZXRpb24sIHN1YnN0aXR1dGlvbilcbiAqXG4gKiBJdCB1c2VzIGR5bmFtaWMgcHJvZ3JhbWluZyBhbmQgY3JlYXRlcyBhIG1hdHJpeFxuICogd2hlcmUgZXZlcnkgY2VsbCBbaSxqXSByZXByZXNlbnRzIHRoZSBkaXN0YW5jZSBiZXR3ZWVuXG4gKiB0aGUgc3Vic3RyaW5ncyBhWzAuLmldIGFuZCBiWzAuLmpdXG4gKlxuICogTyhhLmxlbmd0aCAqIGIubGVuZ3RoKVxuICpcbiAqIEBwYXJhbSBTdHJpbmdcbiAqIEBwYXJhbSBTdHJpbmdcbiAqIEByZXR1cm4gTnVtYmVyXG4gKi9cbnZhciBsZXZlbnNodGVpbiA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gIHZhciBlZGl0RGlzdGFuY2UgPSBbXTtcbiAgdmFyIGksIGo7XG5cbiAgLy8gSW5pdGlhbGl6ZSB0aGUgZWRpdCBkaXN0YW5jZSBtYXRyaXguIFRoZSBmaXJzdCBjb2xsdW1uIGNvbnRhaW5zXG4gIC8vIHRoZSB2YWx1ZXMgY29tcGFyaW5nIHRoZSBzdHJpbmcgYSB0byBhbiBlbXB0eSBzdHJpbmcgYlxuICBmb3IgKGkgPSAwOyBpIDw9IGEubGVuZ3RoOyBpKyspIHtcbiAgICBlZGl0RGlzdGFuY2VbaV0gPSBbXTtcbiAgICBlZGl0RGlzdGFuY2VbaV1bMF0gPSBpO1xuICB9XG5cbiAgLy8gQW5kIHRoZSBmaXJzdCBsaW5lIHRoZSB2YWx1ZXMgY29tcGFyaW50IHRoZSBzdHJpbmcgYiB0byBhbiBlbXB0eSBzdHJpbmcgYVxuICBmb3IgKGogPSAwOyBqIDw9IGIubGVuZ3RoOyBqKyspIHtcbiAgICBlZGl0RGlzdGFuY2VbMF1bal0gPSBqO1xuICB9XG4gIGZvciAoaSA9IDE7IGkgPD0gYS5sZW5ndGg7IGkrKykge1xuICAgIGZvciAoaiA9IDE7IGogPD0gYi5sZW5ndGg7IGorKykge1xuICAgICAgLy8gRmluZHMgdGhlIG1pbmltdW0gY29zdCBmb3Iga2VlcGluZyB0aGUgdHdvIHN0cmluZ3MgZXF1YWxcbiAgICAgIGVkaXREaXN0YW5jZVtpXVtqXSA9XG4gICAgICAgIE1hdGgubWluKFxuICAgICAgICAgIGVkaXREaXN0YW5jZVtpIC0gMV1baiAtIDFdLCAvLyBpZiB3ZSByZXBsYWNlIGFbaV0gYnkgYltqXVxuICAgICAgICAgIGVkaXREaXN0YW5jZVtpIC0gMV1bal0sIC8vIGlmIHdlIGRlbGV0ZSB0aGUgY2hhciBmcm9tIGFcbiAgICAgICAgICBlZGl0RGlzdGFuY2VbaV1baiAtIDFdIC8vIGlmIHdlIGFkZCB0aGUgY2hhciBmcm9tIGJcbiAgICAgICAgKSArXG4gICAgICAgIChhW2kgLSAxXSAhPT0gYltqIC0gMV0gPyAxIDogMCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGVkaXREaXN0YW5jZVthLmxlbmd0aF1bYi5sZW5ndGhdO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBsZXZlbnNodGVpbjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9hbGdvcml0aG1zL2FsZ29yaXRobXMvc3RyaW5nL2xldmVuc2h0ZWluLmpzXG4vLyBtb2R1bGUgaWQgPSAxNzZcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLyoqXG4gKiBJbXBsZW1lbnRhdGlvbiBvZiBsb25nZXN0IGNvbW1vbiBzdWJzZXF1ZW5jZVxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBJbXBsZW1lbnRhdGlvbiB2aWEgZHluYW1pYyBwcm9ncmFtbWluZ1xuICovXG52YXIgbG9uZ2VzdENvbW1vblN1YnNlcXVlbmNlID0gZnVuY3Rpb24gKHMxLCBzMikge1xuICAvLyBNdWx0aWRpbWVuc2lvbmFsIGFycmF5IGZvciBkeW5hbWljIHByb2dyYW1taW5nIGFsZ29yaXRobVxuICB2YXIgY2FjaGUgPSBuZXcgQXJyYXkoczEubGVuZ3RoICsgMSk7XG5cbiAgdmFyIGksIGo7XG5cbiAgZm9yIChpID0gMDsgaSA8PSBzMS5sZW5ndGg7IGkrKykge1xuICAgIGNhY2hlW2ldID0gbmV3IEludDMyQXJyYXkoczIubGVuZ3RoICsgMSk7XG4gIH1cblxuICAvLyBGaWxsIGluIHRoZSBjYWNoZVxuICBmb3IgKGkgPSAxOyBpIDw9IHMxLmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChqID0gMTsgaiA8PSBzMi5sZW5ndGg7IGorKykge1xuICAgICAgaWYgKHMxW2kgLSAxXSA9PT0gczJbaiAtIDFdKSB7XG4gICAgICAgIGNhY2hlW2ldW2pdID0gY2FjaGVbaSAtIDFdW2ogLSAxXSArIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWNoZVtpXVtqXSA9IE1hdGgubWF4KGNhY2hlW2ldW2ogLSAxXSwgY2FjaGVbaSAtIDFdW2pdKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBCdWlsZCBMQ1MgZnJvbSBjYWNoZVxuICBpID0gczEubGVuZ3RoO1xuICBqID0gczIubGVuZ3RoO1xuICB2YXIgbGNzID0gJyc7XG5cbiAgd2hpbGUgKGNhY2hlW2ldW2pdICE9PSAwKSB7XG4gICAgaWYgKHMxW2kgLSAxXSA9PT0gczJbaiAtIDFdKSB7XG4gICAgICBsY3MgPSBzMVtpIC0gMV0gKyBsY3M7XG4gICAgICBpLS07XG4gICAgICBqLS07XG4gICAgfSBlbHNlIGlmIChjYWNoZVtpIC0gMV1bal0gPiBjYWNoZVtpXVtqIC0gMV0pIHtcbiAgICAgIGktLTtcbiAgICB9IGVsc2Uge1xuICAgICAgai0tO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBsY3M7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGxvbmdlc3RDb21tb25TdWJzZXF1ZW5jZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9hbGdvcml0aG1zL2FsZ29yaXRobXMvc3RyaW5nL2xvbmdlc3RfY29tbW9uX3N1YnNlcXVlbmNlLmpzXG4vLyBtb2R1bGUgaWQgPSAxNzdcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLyoqXG4gKiBJbXBsZW1lbnRhdGlvbiBvZiBsb25nZXN0IGNvbW1vbiBzdWJzdHJpbmdcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogSW1wbGVtZW50YXRpb24gdmlhIGR5bmFtaWMgcHJvZ3JhbW1pbmdcbiAqL1xudmFyIGxvbmdlc3RDb21tb25TdWJzdHJpbmcgPSBmdW5jdGlvbiAoczEsIHMyKSB7XG4gIC8vIE11bHRpZGltZW5zaW9uYWwgYXJyYXkgZm9yIGR5bmFtaWMgcHJvZ3JhbW1pbmcgYWxnb3JpdGhtXG4gIHZhciBjYWNoZSA9IG5ldyBBcnJheShzMS5sZW5ndGggKyAxKTtcblxuICB2YXIgaSwgajtcblxuICBmb3IgKGkgPSAwOyBpIDw9IHMxLmxlbmd0aCArIDE7IGkrKykge1xuICAgIGNhY2hlW2ldID0gbmV3IEludDMyQXJyYXkoczIubGVuZ3RoICsgMSk7XG4gIH1cblxuICB2YXIgbGNzUG9zaXRpb24gPSB7fTtcbiAgdmFyIGxjc0xlbmd0aCA9IDA7XG5cbiAgLy8gRmlsbCBpbiB0aGUgY2FjaGVcbiAgZm9yIChpID0gMTsgaSA8PSBzMS5sZW5ndGg7IGkrKykge1xuICAgIGZvciAoaiA9IDE7IGogPD0gczIubGVuZ3RoOyBqKyspIHtcbiAgICAgIGlmIChzMVtpIC0gMV0gPT09IHMyW2ogLSAxXSkge1xuICAgICAgICBjYWNoZVtpXVtqXSA9IGNhY2hlW2kgLSAxXVtqIC0gMV0gKyAxO1xuICAgICAgICBpZiAoY2FjaGVbaV1bal0gPiBsY3NMZW5ndGgpIHtcbiAgICAgICAgICBsY3NQb3NpdGlvbi5pID0gaTtcbiAgICAgICAgICBsY3NQb3NpdGlvbi5qID0gajtcbiAgICAgICAgICBsY3NMZW5ndGggPSBjYWNoZVtpXVtqXTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FjaGVbaV1bal0gPSAwO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHZhciBsY3MgPSAnJztcbiAgaWYgKGxjc0xlbmd0aCkge1xuICAgIGxjcyA9IHMxLnN1YnN0cmluZyhsY3NQb3NpdGlvbi5pIC0gbGNzTGVuZ3RoLCBsY3NQb3NpdGlvbi5pKTtcbiAgfVxuXG4gIHJldHVybiBsY3M7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGxvbmdlc3RDb21tb25TdWJzdHJpbmc7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYWxnb3JpdGhtcy9hbGdvcml0aG1zL3N0cmluZy9sb25nZXN0X2NvbW1vbl9zdWJzdHJpbmcuanNcbi8vIG1vZHVsZSBpZCA9IDE3OFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQSBwcmltZSBudW1iZXIgdXNlZCB0byBjcmVhdGVcbiAqIHRoZSBoYXNoIHJlcHJlc2VudGF0aW9uIG9mIGEgd29yZFxuICpcbiAqIEJpZ2dlciB0aGUgcHJpbWUgbnVtYmVyLFxuICogYmlnZ2VyIHRoZSBoYXNoIHZhbHVlXG4gKi9cbnZhciBiYXNlID0gOTk3O1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgU3RyaW5nIE1hdGNoaW5nIGJldHdlZW4gdHdvIFN0cmluZ3NcbiAqIFJldHVybnMgdHJ1ZSBpZiBTdHJpbmcgJ2InIGlzIGNvbnRhaW5lZCBpbiBTdHJpbmcgJ2EnXG4gKlxuICogQXZlcmFnZSBhbmQgQmVzdCBDYXNlIENvbXBsZXhpdHk6IE8oYS5sZW5ndGggKyBiLmxlbmd0aClcbiAqIFdvcnN0IENhc2UgQ29tcGxleGl0eTogTyhhLmxlbmd0aCAqIGIubGVuZ3RoKVxuICpcbiAqIEBwYXJhbSBTdHJpbmdcbiAqIEBwYXJhbSBTdHJpbmdcbiAqIEByZXR1cm4gSW50ZWdlclxuICovXG52YXIgcmFiaW5LYXJwID0gZnVuY3Rpb24gKHMsIHBhdHRlcm4pIHtcbiAgaWYgKHBhdHRlcm4ubGVuZ3RoID09PSAwKSByZXR1cm4gMDtcblxuICB2YXIgaGFzaFBhdHRlcm4gPSBoYXNoKHBhdHRlcm4pO1xuICB2YXIgY3VycmVudFN1YnN0cmluZyA9IHMuc3Vic3RyaW5nKDAsIHBhdHRlcm4ubGVuZ3RoKTtcbiAgdmFyIGhhc2hDdXJyZW50U3Vic3RyaW5nO1xuXG4gIGZvciAodmFyIGkgPSBwYXR0ZXJuLmxlbmd0aDsgaSA8PSBzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKGhhc2hDdXJyZW50U3Vic3RyaW5nID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGhhc2hDdXJyZW50U3Vic3RyaW5nID0gaGFzaChjdXJyZW50U3Vic3RyaW5nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLypcbiAgICAgICAqIFJlLWhhc2hcbiAgICAgICAqIFJlY2FsY3VsYXRlcyB0aGUgaGFzaCByZXByZXNlbnRhdGlvbiBvZiBhIHdvcmQgc28gdGhhdCBpdCBpc24ndFxuICAgICAgICogbmVjZXNzYXJ5IHRvIHRyYXZlcnNlIHRoZSB3aG9sZSB3b3JkIGFnYWluXG4gICAgICAgKi9cbiAgICAgIGhhc2hDdXJyZW50U3Vic3RyaW5nIC09IGN1cnJlbnRTdWJzdHJpbmcuY2hhckNvZGVBdCgwKSAqXG4gICAgICAgIE1hdGgucG93KGJhc2UsIHBhdHRlcm4ubGVuZ3RoIC0gMSk7XG4gICAgICBoYXNoQ3VycmVudFN1YnN0cmluZyAqPSBiYXNlO1xuICAgICAgaGFzaEN1cnJlbnRTdWJzdHJpbmcgKz0gcy5jaGFyQ29kZUF0KGkpO1xuXG4gICAgICBjdXJyZW50U3Vic3RyaW5nID0gY3VycmVudFN1YnN0cmluZy5zdWJzdHJpbmcoMSkgKyBzW2ldO1xuICAgIH1cblxuICAgIGlmIChoYXNoUGF0dGVybiA9PT0gaGFzaEN1cnJlbnRTdWJzdHJpbmcgJiZcbiAgICAgICAgcGF0dGVybiA9PT0gY3VycmVudFN1YnN0cmluZykge1xuICAgICAgLy8gSGFjayBmb3IgdGhlIG9mZi1ieS1vbmUgd2hlbiBtYXRjaGluZyBpbiB0aGUgYmVnaW5uaW5nIG9mIHRoZSBzdHJpbmdcbiAgICAgIHJldHVybiBpID09PSBwYXR0ZXJuLmxlbmd0aCA/IDAgOiBpIC0gcGF0dGVybi5sZW5ndGggKyAxO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAtMTtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyB0aGUgaGFzaCByZXByZXNlbnRhdGlvbiBvZiAnd29yZCdcbiAqXG4gKiBAcGFyYW0gU3RyaW5nXG4gKiBAcmV0dXJuIE51bWJlclxuICovXG52YXIgaGFzaCA9IGZ1bmN0aW9uICh3b3JkKSB7XG4gIHZhciBoID0gMDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHdvcmQubGVuZ3RoOyBpKyspIHtcbiAgICBoICs9IHdvcmQuY2hhckNvZGVBdChpKSAqIE1hdGgucG93KGJhc2UsIHdvcmQubGVuZ3RoIC0gaSAtIDEpO1xuICB9XG5cbiAgcmV0dXJuIGg7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJhYmluS2FycDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9hbGdvcml0aG1zL2FsZ29yaXRobXMvc3RyaW5nL3JhYmluX2thcnAuanNcbi8vIG1vZHVsZSBpZCA9IDE3OVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbi8vIERhdGEgU3RydWN0dXJlc1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIEFWTFRyZWU6IHJlcXVpcmUoJy4vZGF0YV9zdHJ1Y3R1cmVzL2F2bF90cmVlJyksXG4gIEJTVDogcmVxdWlyZSgnLi9kYXRhX3N0cnVjdHVyZXMvYnN0JyksXG4gIFRyZWFwOiByZXF1aXJlKCcuL2RhdGFfc3RydWN0dXJlcy90cmVhcCcpLFxuICBHcmFwaDogcmVxdWlyZSgnLi9kYXRhX3N0cnVjdHVyZXMvZ3JhcGgnKSxcbiAgSGFzaFRhYmxlOiByZXF1aXJlKCcuL2RhdGFfc3RydWN0dXJlcy9oYXNoX3RhYmxlJyksXG4gIEhlYXA6IHJlcXVpcmUoJy4vZGF0YV9zdHJ1Y3R1cmVzL2hlYXAnKSxcbiAgTGlua2VkTGlzdDogcmVxdWlyZSgnLi9kYXRhX3N0cnVjdHVyZXMvbGlua2VkX2xpc3QnKSxcbiAgUHJpb3JpdHlRdWV1ZTogcmVxdWlyZSgnLi9kYXRhX3N0cnVjdHVyZXMvcHJpb3JpdHlfcXVldWUnKSxcbiAgUXVldWU6IHJlcXVpcmUoJy4vZGF0YV9zdHJ1Y3R1cmVzL3F1ZXVlJyksXG4gIFN0YWNrOiByZXF1aXJlKCcuL2RhdGFfc3RydWN0dXJlcy9zdGFjaycpLFxuICBTZXQ6IHJlcXVpcmUoJy4vZGF0YV9zdHJ1Y3R1cmVzL3NldCcpLFxuICBEaXNqb2ludFNldEZvcmVzdDogcmVxdWlyZSgnLi9kYXRhX3N0cnVjdHVyZXMvZGlzam9pbnRfc2V0X2ZvcmVzdCcpLFxuICBGZW53aWNrVHJlZTogcmVxdWlyZSgnLi9kYXRhX3N0cnVjdHVyZXMvZmVud2lja190cmVlJylcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYWxnb3JpdGhtcy9kYXRhX3N0cnVjdHVyZXMuanNcbi8vIG1vZHVsZSBpZCA9IDE4MFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQVZMIFRyZWVcbiAqL1xuZnVuY3Rpb24gQVZMVHJlZSgpIHtcbiAgdGhpcy5yb290ID0gbnVsbDtcbn1cblxuLyoqXG4gKiBUcmVlIG5vZGVcbiAqL1xuZnVuY3Rpb24gTm9kZSh2YWx1ZSwgbGVmdCwgcmlnaHQsIHBhcmVudCwgaGVpZ2h0KSB7XG4gIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgdGhpcy5yaWdodCA9IHJpZ2h0O1xuICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgaGVpZ2h0IG9mIGEgbm9kZSBiYXNlZCBvbiBoZWlnaHRcbiAqIHByb3BlcnR5IG9mIGFsbCBoaXMgY2hpbGRyZW4uXG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLmdldE5vZGVIZWlnaHQgPSBmdW5jdGlvbiAobm9kZSkge1xuICB2YXIgaGVpZ2h0ID0gMTtcbiAgaWYgKG5vZGUubGVmdCAhPT0gbnVsbCAmJiBub2RlLnJpZ2h0ICE9PSBudWxsKSB7XG4gICAgaGVpZ2h0ID0gTWF0aC5tYXgobm9kZS5sZWZ0LmhlaWdodCwgbm9kZS5yaWdodC5oZWlnaHQpICsgMTtcbiAgfSBlbHNlIGlmIChub2RlLmxlZnQgIT09IG51bGwpIHtcbiAgICBoZWlnaHQgPSBub2RlLmxlZnQuaGVpZ2h0ICsgMTtcbiAgfSBlbHNlIGlmIChub2RlLnJpZ2h0ICE9PSBudWxsKSB7XG4gICAgaGVpZ2h0ID0gbm9kZS5yaWdodC5oZWlnaHQgKyAxO1xuICB9XG4gIHJldHVybiBoZWlnaHQ7XG59O1xuXG4vKipcbiAqIFZlcmlmaWVzIGlmIHRoZSBnaXZlbiBub2RlIGlzIGJhbGFuY2VkLlxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5pc05vZGVCYWxhbmNlZCA9IGZ1bmN0aW9uIChub2RlKSB7XG4gIHZhciBpc0JhbGFuY2VkID0gdHJ1ZTtcblxuICBpZiAobm9kZS5sZWZ0ICE9PSBudWxsICYmIG5vZGUucmlnaHQgIT09IG51bGwpIHtcbiAgICBpc0JhbGFuY2VkID0gKE1hdGguYWJzKG5vZGUubGVmdC5oZWlnaHQgLSBub2RlLnJpZ2h0LmhlaWdodCkgPD0gMSk7XG4gIH0gZWxzZSBpZiAobm9kZS5yaWdodCAhPT0gbnVsbCAmJiBub2RlLmxlZnQgPT09IG51bGwpIHtcbiAgICBpc0JhbGFuY2VkID0gbm9kZS5yaWdodC5oZWlnaHQgPCAyO1xuICB9IGVsc2UgaWYgKG5vZGUubGVmdCAhPT0gbnVsbCAmJiBub2RlLnJpZ2h0ID09PSBudWxsKSB7XG4gICAgaXNCYWxhbmNlZCA9IG5vZGUubGVmdC5oZWlnaHQgPCAyO1xuICB9XG4gIHJldHVybiBpc0JhbGFuY2VkO1xufTtcblxuLyoqXG4gKiBXaGVuIGEgcmVtb3ZhbCBoYXBwZW5zLCBzb21lIG5vZGVzIG5lZWQgdG8gYmVcbiAqIHJlc3RydWN0dXJlZC4gR2V0cyBhbmQgcmV0dXJuIHRoZXNlIG5vZGVzLlxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5nZXROb2Rlc1RvUmVzdHJ1Y3R1cmVBZnRlclJlbW92ZSA9IGZ1bmN0aW9uICh0cmF2ZWxlZE5vZGVzKSB7XG4gIC8vIHogaXMgbGFzdCB0cmF2ZWxlZCBub2RlIC0gaW1iYWxhbmNlIGZvdW5kIGF0IHpcbiAgdmFyIHpJbmRleCA9IHRyYXZlbGVkTm9kZXMubGVuZ3RoIC0gMTtcbiAgdmFyIHogPSB0cmF2ZWxlZE5vZGVzW3pJbmRleF07XG5cbiAgLy8geSBzaG91bGQgYmUgY2hpbGQgb2YgeiB3aXRoIGxhcmdlciBoZWlnaHRcbiAgLy8gKGNhbm5vdCBiZSBhbmNlc3RvciBvZiByZW1vdmVkIG5vZGUpXG4gIHZhciB5O1xuICBpZiAoei5sZWZ0ICE9PSBudWxsICYmIHoucmlnaHQgIT09IG51bGwpIHtcbiAgICB5ID0gKHoubGVmdCA9PT0geSkgPyB6LnJpZ2h0IDogei5sZWZ0O1xuICB9IGVsc2UgaWYgKHoubGVmdCAhPT0gbnVsbCAmJiB6LnJpZ2h0ID09PSBudWxsKSB7XG4gICAgeSA9IHoubGVmdDtcbiAgfSBlbHNlIGlmICh6LnJpZ2h0ICE9PSBudWxsICYmIHoubGVmdCA9PT0gbnVsbCkge1xuICAgIHkgPSB6LnJpZ2h0O1xuICB9XG5cbiAgLy8geCBzaG91bGQgYmUgdGFsbGVzdCBjaGlsZCBvZiB5XG4gIC8vIElmIGNoaWxkcmVuIHNhbWUgaGVpZ2h0LCB4IHNob3VsZCBiZSBjaGlsZCBvZiB5XG4gIC8vIHRoYXQgaGFzIHNhbWUgb3JpZW50YXRpb24gYXMgeiB0byB5XG4gIHZhciB4O1xuICBpZiAoeS5sZWZ0ICE9PSBudWxsICYmIHkucmlnaHQgIT09IG51bGwpIHtcbiAgICBpZiAoeS5sZWZ0LmhlaWdodCA+IHkucmlnaHQuaGVpZ2h0KSB7XG4gICAgICB4ID0geS5sZWZ0O1xuICAgIH0gZWxzZSBpZiAoeS5sZWZ0LmhlaWdodCA8IHkucmlnaHQuaGVpZ2h0KSB7XG4gICAgICB4ID0geS5yaWdodDtcbiAgICB9IGVsc2UgaWYgKHkubGVmdC5oZWlnaHQgPT09IHkucmlnaHQuaGVpZ2h0KSB7XG4gICAgICB4ID0gKHoubGVmdCA9PT0geSkgPyB5LmxlZnQgOiB5LnJpZ2h0O1xuICAgIH1cbiAgfSBlbHNlIGlmICh5LmxlZnQgIT09IG51bGwgJiYgeS5yaWdodCA9PT0gbnVsbCkge1xuICAgIHggPSB5LmxlZnQ7XG4gIH0gZWxzZSBpZiAoeS5yaWdodCAhPT0gbnVsbCAmJiB5LmxlZnQgPT09IG51bGwpIHtcbiAgICB4ID0geS5yaWdodDtcbiAgfVxuICByZXR1cm4gW3gsIHksIHpdO1xufTtcblxuLyoqXG4gKiBXaGVuIGEgaW5zZXJ0aW9uIGhhcHBlbnMsIHNvbWUgbm9kZXMgbmVlZCB0byBiZVxuICogcmVzdHJ1Y3R1cmVkLiBHZXRzIGFuZCByZXR1cm4gdGhlc2Ugbm9kZXMuXG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLmdldE5vZGVzVG9SZXN0cnVjdHVyZUFmdGVySW5zZXJ0ID0gZnVuY3Rpb24gKHRyYXZlbGVkTm9kZXMpIHtcbiAgLy8geiBpcyBsYXN0IHRyYXZlbGVkIG5vZGUgLSBpbWJhbGFuY2UgZm91bmQgYXQgelxuICB2YXIgekluZGV4ID0gdHJhdmVsZWROb2Rlcy5sZW5ndGggLSAxO1xuICB2YXIgeiA9IHRyYXZlbGVkTm9kZXNbekluZGV4XTtcblxuICAvLyB5IHNob3VsZCBiZSBjaGlsZCBvZiB6IHdpdGggbGFyZ2VyIGhlaWdodFxuICAvLyAobXVzdCBiZSBhbmNlc3RvciBvZiBpbnNlcnRlZCBub2RlKVxuICAvLyB0aGVyZWZvcmUsIGxhc3QgdHJhdmVsZWQgbm9kZSBpcyBjb3JyZWN0LlxuICB2YXIgeUluZGV4ID0gdHJhdmVsZWROb2Rlcy5sZW5ndGggLSAyO1xuICB2YXIgeSA9IHRyYXZlbGVkTm9kZXNbeUluZGV4XTtcblxuICAvLyB4IHNob3VsZCBiZSB0YWxsZXN0IGNoaWxkIG9mIHlcbiAgLy8gSWYgY2hpbGRyZW4gc2FtZSBoZWlnaHQsIHggc2hvdWxkIGJlIGFuY2VzdG9yXG4gIC8vIG9mIGluc2VydGVkIG5vZGUgKGluIHRyYXZlbGVkIHBhdGgpXG4gIHZhciB4O1xuICBpZiAoeS5sZWZ0ICE9PSBudWxsICYmIHkucmlnaHQgIT09IG51bGwpIHtcbiAgICBpZiAoeS5sZWZ0LmhlaWdodCA+IHkucmlnaHQuaGVpZ2h0KSB7XG4gICAgICB4ID0geS5sZWZ0O1xuICAgIH0gZWxzZSBpZiAoeS5sZWZ0LmhlaWdodCA8IHkucmlnaHQuaGVpZ2h0KSB7XG4gICAgICB4ID0geS5yaWdodDtcbiAgICB9IGVsc2UgaWYgKHkubGVmdC5oZWlnaHQgPT09IHkucmlnaHQuaGVpZ2h0KSB7XG4gICAgICB2YXIgeEluZGV4ID0gdHJhdmVsZWROb2Rlcy5sZW5ndGggLSAzO1xuICAgICAgeCA9IHRyYXZlbGVkTm9kZXNbeEluZGV4XTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoeS5sZWZ0ICE9PSBudWxsICYmIHkucmlnaHQgPT09IG51bGwpIHtcbiAgICB4ID0geS5sZWZ0O1xuICB9IGVsc2UgaWYgKHkucmlnaHQgIT09IG51bGwgJiYgeS5sZWZ0ID09PSBudWxsKSB7XG4gICAgeCA9IHkucmlnaHQ7XG4gIH1cbiAgcmV0dXJuIFt4LCB5LCB6XTtcbn07XG5cbi8qKlxuICogS2VlcCB0aGUgaGVpZ2h0IGJhbGFuY2UgcHJvcGVydHkgYnkgd2Fsa2luZyB0b1xuICogcm9vdCBhbmQgY2hlY2tpbmcgZm9yIGludmFsaWQgaGVpZ2h0cy5cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUua2VlcEhlaWdodEJhbGFuY2UgPSBmdW5jdGlvbiAobm9kZSwgYWZ0ZXJSZW1vdmUpIHtcbiAgdmFyIGN1cnJlbnQgPSBub2RlO1xuICB2YXIgdHJhdmVsZWROb2RlcyA9IFtdO1xuICB3aGlsZSAoY3VycmVudCAhPT0gbnVsbCkge1xuICAgIHRyYXZlbGVkTm9kZXMucHVzaChjdXJyZW50KTtcbiAgICBjdXJyZW50LmhlaWdodCA9IHRoaXMuZ2V0Tm9kZUhlaWdodChjdXJyZW50KTtcbiAgICBpZiAoIXRoaXMuaXNOb2RlQmFsYW5jZWQoY3VycmVudCkpIHtcbiAgICAgIHZhciBub2Rlc1RvQmVSZXN0cnVjdHVyZWQgPSAoYWZ0ZXJSZW1vdmUpID9cbiAgICAgICAgdGhpcy5nZXROb2Rlc1RvUmVzdHJ1Y3R1cmVBZnRlclJlbW92ZSh0cmF2ZWxlZE5vZGVzKSA6XG4gICAgICAgIHRoaXMuZ2V0Tm9kZXNUb1Jlc3RydWN0dXJlQWZ0ZXJJbnNlcnQodHJhdmVsZWROb2Rlcyk7XG4gICAgICB0aGlzLnJlc3RydWN0dXJlKG5vZGVzVG9CZVJlc3RydWN0dXJlZCk7XG4gICAgfVxuICAgIGN1cnJlbnQgPSBjdXJyZW50LnBhcmVudDtcbiAgfVxufTtcblxuLyoqXG4gKiBJZGVudGlmaWVzIGFuZCBjYWxscyB0aGUgYXBwcm9wcmlhdGUgcGF0dGVyblxuICogcm90YXRvci5cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUucmVzdHJ1Y3R1cmUgPSBmdW5jdGlvbiAobm9kZXNUb1Jlc3RydWN0dXJlKSB7XG4gIHZhciB4ID0gbm9kZXNUb1Jlc3RydWN0dXJlWzBdO1xuICB2YXIgeSA9IG5vZGVzVG9SZXN0cnVjdHVyZVsxXTtcbiAgdmFyIHogPSBub2Rlc1RvUmVzdHJ1Y3R1cmVbMl07XG5cbiAgLy8gRGV0ZXJtaW5lIFJvdGF0aW9uIFBhdHRlcm5cbiAgaWYgKHoucmlnaHQgPT09IHkgJiYgeS5yaWdodCA9PT0geCkge1xuICAgIHRoaXMucmlnaHRSaWdodCh4LCB5LCB6KTtcbiAgfSBlbHNlIGlmICh6LmxlZnQgPT09IHkgJiYgeS5sZWZ0ID09PSB4KSB7XG4gICAgdGhpcy5sZWZ0TGVmdCh4LCB5LCB6KTtcbiAgfSBlbHNlIGlmICh6LnJpZ2h0ID09PSB5ICYmIHkubGVmdCA9PT0geCkge1xuICAgIHRoaXMucmlnaHRMZWZ0KHgsIHksIHopO1xuICB9IGVsc2UgaWYgKHoubGVmdCA9PT0geSAmJiB5LnJpZ2h0ID09PSB4KSB7XG4gICAgdGhpcy5sZWZ0UmlnaHQoeCwgeSwgeik7XG4gIH1cbn07XG5cbi8qKlxuICogUmlnaHQtcmlnaHQgcm90YXRpb24gcGF0dGVybi5cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUucmlnaHRSaWdodCA9IGZ1bmN0aW9uICh4LCB5LCB6KSB7XG4gIC8vIHBhc3MgeiBwYXJlbnQgdG8geSBhbmQgbW92ZSB5J3MgbGVmdCB0byB6J3MgcmlnaHRcbiAgaWYgKHoucGFyZW50ICE9PSBudWxsKSB7XG4gICAgdmFyIG9yaWVudGF0aW9uID0gKHoucGFyZW50LmxlZnQgPT09IHopID8gJ2xlZnQnIDogJ3JpZ2h0JztcbiAgICB6LnBhcmVudFtvcmllbnRhdGlvbl0gPSB5O1xuICAgIHkucGFyZW50ID0gei5wYXJlbnQ7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5yb290ID0geTtcbiAgICB5LnBhcmVudCA9IG51bGw7XG4gIH1cblxuICAvLyB6IGFkb3B0cyB5J3MgbGVmdC5cbiAgei5yaWdodCA9IHkubGVmdDtcbiAgaWYgKHoucmlnaHQgIT09IG51bGwpIHtcbiAgICB6LnJpZ2h0LnBhcmVudCA9IHo7XG4gIH1cbiAgLy8geSBhZG9wdHMgelxuICB5LmxlZnQgPSB6O1xuICB6LnBhcmVudCA9IHk7XG5cbiAgLy8gQ29ycmVjdCBlYWNoIG5vZGVzIGhlaWdodCAtIG9yZGVyIG1hdHRlcnMsIGNoaWxkcmVuIGZpcnN0XG4gIHguaGVpZ2h0ID0gdGhpcy5nZXROb2RlSGVpZ2h0KHgpO1xuICB6LmhlaWdodCA9IHRoaXMuZ2V0Tm9kZUhlaWdodCh6KTtcbiAgeS5oZWlnaHQgPSB0aGlzLmdldE5vZGVIZWlnaHQoeSk7XG59O1xuXG4vKipcbiAqIExlZnQtbGVmdCByb3RhdGlvbiBwYXR0ZXJuLlxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5sZWZ0TGVmdCA9IGZ1bmN0aW9uICh4LCB5LCB6KSB7XG4gIC8vcGFzcyB6IHBhcmVudCB0byB5IGFuZCBtb3ZlIHkncyByaWdodCB0byB6J3MgbGVmdFxuICBpZiAoei5wYXJlbnQgIT09IG51bGwpIHtcbiAgICB2YXIgb3JpZW50YXRpb24gPSAoei5wYXJlbnQubGVmdCA9PT0geikgPyAnbGVmdCcgOiAncmlnaHQnO1xuICAgIHoucGFyZW50W29yaWVudGF0aW9uXSA9IHk7XG4gICAgeS5wYXJlbnQgPSB6LnBhcmVudDtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnJvb3QgPSB5O1xuICAgIHkucGFyZW50ID0gbnVsbDtcbiAgfVxuXG4gIHoubGVmdCA9IHkucmlnaHQ7XG4gIGlmICh6LmxlZnQgIT09IG51bGwpIHtcbiAgICB6LmxlZnQucGFyZW50ID0gejtcbiAgfVxuICAvL2ZpeCB5IHJpZ2h0IGNoaWxkXG4gIHkucmlnaHQgPSB6O1xuICB6LnBhcmVudCA9IHk7XG5cbiAgLy8gQ29ycmVjdCBlYWNoIG5vZGVzIGhlaWdodCAtIG9yZGVyIG1hdHRlcnMsIGNoaWxkcmVuIGZpcnN0XG4gIHguaGVpZ2h0ID0gdGhpcy5nZXROb2RlSGVpZ2h0KHgpO1xuICB6LmhlaWdodCA9IHRoaXMuZ2V0Tm9kZUhlaWdodCh6KTtcbiAgeS5oZWlnaHQgPSB0aGlzLmdldE5vZGVIZWlnaHQoeSk7XG59O1xuXG4vKipcbiAqIFJpZ2h0LWxlZnQgcm90YXRpb24gcGF0dGVybi5cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUucmlnaHRMZWZ0ID0gZnVuY3Rpb24gKHgsIHksIHopIHtcbiAgLy9wYXNzIHogcGFyZW50IHRvIHhcbiAgaWYgKHoucGFyZW50ICE9PSBudWxsKSB7XG4gICAgdmFyIG9yaWVudGF0aW9uID0gKHoucGFyZW50LmxlZnQgPT09IHopID8gJ2xlZnQnIDogJ3JpZ2h0JztcbiAgICB6LnBhcmVudFtvcmllbnRhdGlvbl0gPSB4O1xuICAgIHgucGFyZW50ID0gei5wYXJlbnQ7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5yb290ID0geDtcbiAgICB4LnBhcmVudCA9IG51bGw7XG4gIH1cblxuICAvLyBBZG9wdGlvbnNcbiAgei5yaWdodCA9IHgubGVmdDtcbiAgaWYgKHoucmlnaHQgIT09IG51bGwpIHtcbiAgICB6LnJpZ2h0LnBhcmVudCA9IHo7XG4gIH1cbiAgeS5sZWZ0ID0geC5yaWdodDtcbiAgaWYgKHkubGVmdCAhPT0gbnVsbCkge1xuICAgIHkubGVmdC5wYXJlbnQgPSB5O1xuICB9XG5cbiAgLy8gUG9pbnQgdG8gbmV3IGNoaWxkcmVuICh4IG5ldyBwYXJlbnQpXG4gIHgubGVmdCA9IHo7XG4gIHgucmlnaHQgPSB5O1xuICB4LmxlZnQucGFyZW50ID0geDtcbiAgeC5yaWdodC5wYXJlbnQgPSB4O1xuXG4gIC8vIENvcnJlY3QgZWFjaCBub2RlcyBoZWlnaHQgLSBvcmRlciBtYXR0ZXJzLCBjaGlsZHJlbiBmaXJzdFxuICB5LmhlaWdodCA9IHRoaXMuZ2V0Tm9kZUhlaWdodCh5KTtcbiAgei5oZWlnaHQgPSB0aGlzLmdldE5vZGVIZWlnaHQoeik7XG4gIHguaGVpZ2h0ID0gdGhpcy5nZXROb2RlSGVpZ2h0KHgpO1xufTtcblxuLyoqXG4gKiBMZWZ0LXJpZ2h0IHJvdGF0aW9uIHBhdHRlcm4uXG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLmxlZnRSaWdodCA9IGZ1bmN0aW9uICh4LCB5LCB6KSB7XG4gIC8vcGFzcyB6IHBhcmVudCB0byB4XG4gIGlmICh6LnBhcmVudCAhPT0gbnVsbCkge1xuICAgIHZhciBvcmllbnRhdGlvbiA9ICh6LnBhcmVudC5sZWZ0ID09PSB6KSA/ICdsZWZ0JyA6ICdyaWdodCc7XG4gICAgei5wYXJlbnRbb3JpZW50YXRpb25dID0geDtcbiAgICB4LnBhcmVudCA9IHoucGFyZW50O1xuICB9IGVsc2Uge1xuICAgIHRoaXMucm9vdCA9IHg7XG4gICAgeC5wYXJlbnQgPSBudWxsO1xuICB9XG5cbiAgLy8gQWRvcHRpb25zXG4gIHoubGVmdCA9IHgucmlnaHQ7XG4gIGlmICh6LmxlZnQgIT09IG51bGwpIHtcbiAgICB6LmxlZnQucGFyZW50ID0gejtcbiAgfVxuICB5LnJpZ2h0ID0geC5sZWZ0O1xuICBpZiAoeS5yaWdodCAhPT0gbnVsbCkge1xuICAgIHkucmlnaHQucGFyZW50ID0geTtcbiAgfVxuXG4gIC8vIFBvaW50IHRvIG5ldyBjaGlsZHJlbiAoeCBuZXcgcGFyZW50KVxuICB4LnJpZ2h0ID0gejtcbiAgeC5sZWZ0ID0geTtcbiAgeC5sZWZ0LnBhcmVudCA9IHg7XG4gIHgucmlnaHQucGFyZW50ID0geDtcblxuICAvLyBDb3JyZWN0IGVhY2ggbm9kZXMgaGVpZ2h0IC0gb3JkZXIgbWF0dGVycywgY2hpbGRyZW4gZmlyc3RcbiAgeS5oZWlnaHQgPSB0aGlzLmdldE5vZGVIZWlnaHQoeSk7XG4gIHouaGVpZ2h0ID0gdGhpcy5nZXROb2RlSGVpZ2h0KHopO1xuICB4LmhlaWdodCA9IHRoaXMuZ2V0Tm9kZUhlaWdodCh4KTtcbn07XG5cbi8qKlxuICogSW5zZXJ0cyBhIHZhbHVlIGFzIGEgTm9kZSBvZiBhbiBBVkwgVHJlZS5cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24gKHZhbHVlLCBjdXJyZW50KSB7XG4gIGlmICh0aGlzLnJvb3QgPT09IG51bGwpIHtcbiAgICB0aGlzLnJvb3QgPSBuZXcgTm9kZSh2YWx1ZSwgbnVsbCwgbnVsbCwgbnVsbCwgMSk7XG4gICAgdGhpcy5rZWVwSGVpZ2h0QmFsYW5jZSh0aGlzLnJvb3QpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciBpbnNlcnRLZXk7XG4gIGN1cnJlbnQgPSBjdXJyZW50IHx8IHRoaXMucm9vdDtcbiAgaWYgKGN1cnJlbnQudmFsdWUgPiB2YWx1ZSkge1xuICAgIGluc2VydEtleSA9ICdsZWZ0JztcbiAgfSBlbHNlIHtcbiAgICBpbnNlcnRLZXkgPSAncmlnaHQnO1xuICB9XG5cbiAgaWYgKCFjdXJyZW50W2luc2VydEtleV0pIHtcbiAgICBjdXJyZW50W2luc2VydEtleV0gPSBuZXcgTm9kZSh2YWx1ZSwgbnVsbCwgbnVsbCwgY3VycmVudCk7XG4gICAgdGhpcy5rZWVwSGVpZ2h0QmFsYW5jZShjdXJyZW50W2luc2VydEtleV0sIGZhbHNlKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmluc2VydCh2YWx1ZSwgY3VycmVudFtpbnNlcnRLZXldKTtcbiAgfVxufTtcblxuLyoqXG4gKiBJbi1vcmRlciB0cmF2ZXJzYWwgZnJvbSB0aGUgZ2l2ZW4gbm9kZS5cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUuaW5PcmRlciA9IGZ1bmN0aW9uIChjdXJyZW50LCBjYWxsYmFjaykge1xuICBpZiAoIWN1cnJlbnQpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdGhpcy5pbk9yZGVyKGN1cnJlbnQubGVmdCwgY2FsbGJhY2spO1xuICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2soY3VycmVudCk7XG4gIH1cbiAgdGhpcy5pbk9yZGVyKGN1cnJlbnQucmlnaHQsIGNhbGxiYWNrKTtcbn07XG5cbi8qKlxuICogUG9zdC1vcmRlciB0cmF2ZXJzYWwgZnJvbSB0aGUgZ2l2ZW4gbm9kZS5cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUucG9zdE9yZGVyID0gZnVuY3Rpb24gKGN1cnJlbnQsIGNhbGxiYWNrKSB7XG4gIGlmICghY3VycmVudCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRoaXMucG9zdE9yZGVyKGN1cnJlbnQubGVmdCwgY2FsbGJhY2spO1xuICB0aGlzLnBvc3RPcmRlcihjdXJyZW50LnJpZ2h0LCBjYWxsYmFjayk7XG4gIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjYWxsYmFjayhjdXJyZW50KTtcbiAgfVxufTtcblxuLyoqXG4gKiBQcmUtb3JkZXIgdHJhdmVyc2FsIGZyb20gdGhlIGdpdmVuIG5vZGUuXG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLnByZU9yZGVyID0gZnVuY3Rpb24gKGN1cnJlbnQsIGNhbGxiYWNrKSB7XG4gIGlmICghY3VycmVudCkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2soY3VycmVudCk7XG4gIH1cbiAgdGhpcy5wcmVPcmRlcihjdXJyZW50LmxlZnQsIGNhbGxiYWNrKTtcbiAgdGhpcy5wcmVPcmRlcihjdXJyZW50LnJpZ2h0LCBjYWxsYmFjayk7XG59O1xuXG4vKipcbiAqIEZpbmRzIGEgbm9kZSBieSBpdHMgdmFsdWUuXG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLmZpbmQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIHRoaXMuX2ZpbmQodmFsdWUsIHRoaXMucm9vdCk7XG59O1xuXG4vKipcbiAqIEZpbmRzIGEgbm9kZSBieSBpdHMgdmFsdWUgaW4gdGhlIGdpdmVuIHN1Yi10cmVlLlxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5fZmluZCA9IGZ1bmN0aW9uICh2YWx1ZSwgY3VycmVudCkge1xuICBpZiAoIWN1cnJlbnQpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZhciBub2RlO1xuICBpZiAoY3VycmVudC52YWx1ZSA9PT0gdmFsdWUpIHtcbiAgICBub2RlID0gY3VycmVudDtcbiAgfSBlbHNlIGlmIChjdXJyZW50LnZhbHVlID4gdmFsdWUpIHtcbiAgICBub2RlID0gdGhpcy5fZmluZCh2YWx1ZSwgY3VycmVudC5sZWZ0KTtcbiAgfSBlbHNlIGlmIChjdXJyZW50LnZhbHVlIDwgdmFsdWUpIHtcbiAgICBub2RlID0gdGhpcy5fZmluZCh2YWx1ZSwgY3VycmVudC5yaWdodCk7XG4gIH1cblxuICByZXR1cm4gbm9kZTtcbn07XG5cbi8qKlxuICogUmVwbGFjZXMgdGhlIGdpdmVuIGNoaWxkIHdpdGggdGhlIG5ldyBvbmUsXG4gKiBmb3IgdGhlIGdpdmVuIHBhcmVudC5cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUucmVwbGFjZUNoaWxkID0gZnVuY3Rpb24gKHBhcmVudCwgb2xkQ2hpbGQsIG5ld0NoaWxkKSB7XG4gIGlmIChwYXJlbnQgPT09IG51bGwpIHtcbiAgICB0aGlzLnJvb3QgPSBuZXdDaGlsZDtcbiAgICBpZiAodGhpcy5yb290ICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnJvb3QucGFyZW50ID0gbnVsbDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKHBhcmVudC5sZWZ0ID09PSBvbGRDaGlsZCkge1xuICAgICAgcGFyZW50LmxlZnQgPSBuZXdDaGlsZDtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyZW50LnJpZ2h0ID0gbmV3Q2hpbGQ7XG4gICAgfVxuICAgIGlmIChuZXdDaGlsZCkge1xuICAgICAgbmV3Q2hpbGQucGFyZW50ID0gcGFyZW50O1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBSZW1vdmVzIGEgbm9kZSBieSBpdHMgdmFsdWUuXG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICB2YXIgbm9kZSA9IHRoaXMuZmluZCh2YWx1ZSk7XG4gIGlmICghbm9kZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChub2RlLmxlZnQgJiYgbm9kZS5yaWdodCkge1xuICAgIHZhciBtaW4gPSB0aGlzLmZpbmRNaW4obm9kZS5yaWdodCk7XG4gICAgdmFyIHRlbXAgPSBub2RlLnZhbHVlO1xuICAgIG5vZGUudmFsdWUgPSBtaW4udmFsdWU7XG4gICAgbWluLnZhbHVlID0gdGVtcDtcbiAgICByZXR1cm4gdGhpcy5yZW1vdmUobWluKTtcbiAgfSBlbHNlIGlmIChub2RlLmxlZnQpIHtcbiAgICB0aGlzLnJlcGxhY2VDaGlsZChub2RlLnBhcmVudCwgbm9kZSwgbm9kZS5sZWZ0KTtcbiAgICB0aGlzLmtlZXBIZWlnaHRCYWxhbmNlKG5vZGUubGVmdCwgdHJ1ZSk7XG4gIH0gZWxzZSBpZiAobm9kZS5yaWdodCkge1xuICAgIHRoaXMucmVwbGFjZUNoaWxkKG5vZGUucGFyZW50LCBub2RlLCBub2RlLnJpZ2h0KTtcbiAgICB0aGlzLmtlZXBIZWlnaHRCYWxhbmNlKG5vZGUucmlnaHQsIHRydWUpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMucmVwbGFjZUNoaWxkKG5vZGUucGFyZW50LCBub2RlLCBudWxsKTtcbiAgICB0aGlzLmtlZXBIZWlnaHRCYWxhbmNlKG5vZGUucGFyZW50LCB0cnVlKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbi8qKlxuICogRmluZHMgdGhlIG5vZGUgd2l0aCBtaW5pbXVtIHZhbHVlIGluIHRoZSBnaXZlblxuICogc3ViLXRyZWUuXG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLl9maW5kTWluID0gZnVuY3Rpb24gKG5vZGUsIGN1cnJlbnQpIHtcbiAgY3VycmVudCA9IGN1cnJlbnQgfHwge1xuICAgIHZhbHVlOiBJbmZpbml0eVxuICB9O1xuICBpZiAoIW5vZGUpIHtcbiAgICByZXR1cm4gY3VycmVudDtcbiAgfVxuICBpZiAoY3VycmVudC52YWx1ZSA+IG5vZGUudmFsdWUpIHtcbiAgICBjdXJyZW50ID0gbm9kZTtcbiAgfVxuICByZXR1cm4gdGhpcy5fZmluZE1pbihub2RlLmxlZnQsIGN1cnJlbnQpO1xufTtcblxuLyoqXG4gKiBGaW5kcyB0aGUgbm9kZSB3aXRoIG1heGltdW0gdmFsdWUgaW4gdGhlIGdpdmVuXG4gKiBzdWItdHJlZS5cbiAqL1xuQVZMVHJlZS5wcm90b3R5cGUuX2ZpbmRNYXggPSBmdW5jdGlvbiAobm9kZSwgY3VycmVudCkge1xuICBjdXJyZW50ID0gY3VycmVudCB8fCB7XG4gICAgdmFsdWU6IC1JbmZpbml0eVxuICB9O1xuICBpZiAoIW5vZGUpIHtcbiAgICByZXR1cm4gY3VycmVudDtcbiAgfVxuICBpZiAoY3VycmVudC52YWx1ZSA8IG5vZGUudmFsdWUpIHtcbiAgICBjdXJyZW50ID0gbm9kZTtcbiAgfVxuICByZXR1cm4gdGhpcy5fZmluZE1heChub2RlLnJpZ2h0LCBjdXJyZW50KTtcbn07XG5cbi8qKlxuICogRmluZHMgdGhlIG5vZGUgd2l0aCBtaW5pbXVtIHZhbHVlIGluIHRoZSB3aG9sZSB0cmVlLlxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5maW5kTWluID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5fZmluZE1pbih0aGlzLnJvb3QpO1xufTtcblxuLyoqXG4gKiBGaW5kcyB0aGUgbm9kZSB3aXRoIG1heGltdW0gdmFsdWUgaW4gdGhlIHdob2xlIHRyZWUuXG4gKi9cbkFWTFRyZWUucHJvdG90eXBlLmZpbmRNYXggPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLl9maW5kTWF4KHRoaXMucm9vdCk7XG59O1xuXG4vKipcbiAqIFZlcmlmaWVzIGlmIHRoZSB0cmVlIGlzIGJhbGFuY2VkLlxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5pc1RyZWVCYWxhbmNlZCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGN1cnJlbnQgPSB0aGlzLnJvb3Q7XG5cbiAgaWYgKCFjdXJyZW50KSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIHRoaXMuX2lzQmFsYW5jZWQoY3VycmVudC5fbGVmdCkgJiZcbiAgICB0aGlzLl9pc0JhbGFuY2VkKGN1cnJlbnQuX3JpZ2h0KSAmJlxuICAgIE1hdGguYWJzKHRoaXMuX2dldE5vZGVIZWlnaHQoY3VycmVudC5fbGVmdCkgLVxuICAgICAgdGhpcy5fZ2V0Tm9kZUhlaWdodChjdXJyZW50Ll9yaWdodCkpIDw9IDE7XG59O1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIGhlaWdodCBvZiB0aGUgdHJlZSBiYXNlZCBvbiBoZWlnaHRcbiAqIHByb3BlcnR5LlxuICovXG5BVkxUcmVlLnByb3RvdHlwZS5nZXRUcmVlSGVpZ2h0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgY3VycmVudCA9IHRoaXMucm9vdDtcblxuICBpZiAoIWN1cnJlbnQpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuICByZXR1cm4gMSArIE1hdGgubWF4KHRoaXMuZ2V0Tm9kZUhlaWdodChjdXJyZW50Ll9sZWZ0KSxcbiAgICB0aGlzLl9nZXROb2RlSGVpZ2h0KGN1cnJlbnQuX3JpZ2h0KSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFWTFRyZWU7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYWxnb3JpdGhtcy9kYXRhX3N0cnVjdHVyZXMvYXZsX3RyZWUuanNcbi8vIG1vZHVsZSBpZCA9IDE4MVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG52YXIgQ29tcGFyYXRvciA9IHJlcXVpcmUoJy4uL3V0aWwvY29tcGFyYXRvcicpO1xuXG4vKipcbiAqIEJpbmFyeSBTZWFyY2ggVHJlZVxuICovXG5mdW5jdGlvbiBCU1QoY29tcGFyZUZuKSB7XG4gIHRoaXMucm9vdCA9IG51bGw7XG4gIHRoaXMuX3NpemUgPSAwO1xuICAvKipcbiAgICogQHZhciBDb21wYXJhdG9yXG4gICAqL1xuICB0aGlzLl9jb21wYXJhdG9yID0gbmV3IENvbXBhcmF0b3IoY29tcGFyZUZuKTtcblxuICAvKipcbiAgICogUmVhZC1vbmx5IHByb3BlcnR5IGZvciB0aGUgc2l6ZSBvZiB0aGUgdHJlZVxuICAgKi9cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdzaXplJywge1xuICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5fc2l6ZTsgfS5iaW5kKHRoaXMpXG4gIH0pO1xufVxuXG4vKipcbiAqIFRyZWUgbm9kZVxuICovXG5mdW5jdGlvbiBOb2RlKHZhbHVlLCBwYXJlbnQpIHtcbiAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgdGhpcy5sZWZ0ID0gbnVsbDtcbiAgdGhpcy5yaWdodCA9IG51bGw7XG59XG5cbi8qKlxuICogSW5zZXJ0IGVsZW1lbnRzIHRvIHRoZSB0cmVlIHJlc3BlY3RpbmcgdGhlIEJTVCByZXN0cmljdGlvbnNcbiAqL1xuQlNULnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbiAodmFsdWUsIHBhcmVudCkge1xuICAvLyBTZXQgdGhlIHJvb3QgYXMgdGhlIGluaXRpYWwgaW5zZXJ0aW9uIHBvaW50XG4gIC8vIGlmIGl0IGhhcyBub3QgYmVlbiBwYXNzZWRcbiAgaWYgKCFwYXJlbnQpIHtcbiAgICBpZiAoIXRoaXMucm9vdCkge1xuICAgICAgdGhpcy5yb290ID0gbmV3IE5vZGUodmFsdWUpO1xuICAgICAgdGhpcy5fc2l6ZSsrO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBwYXJlbnQgPSB0aGlzLnJvb3Q7XG4gIH1cblxuICB2YXIgY2hpbGQgPSB0aGlzLl9jb21wYXJhdG9yLmxlc3NUaGFuKHZhbHVlLCBwYXJlbnQudmFsdWUpID8gJ2xlZnQnIDogJ3JpZ2h0JztcbiAgaWYgKHBhcmVudFtjaGlsZF0pIHtcbiAgICB0aGlzLmluc2VydCh2YWx1ZSwgcGFyZW50W2NoaWxkXSk7XG4gIH0gZWxzZSB7XG4gICAgcGFyZW50W2NoaWxkXSA9IG5ldyBOb2RlKHZhbHVlLCBwYXJlbnQpO1xuICAgIHRoaXMuX3NpemUrKztcbiAgfVxufTtcblxuLyoqXG4gKiBSZXR1cm5zIGlmIGEgdHJlZSBjb250YWlucyBhbiBlbGVtZW50IGluIE8obGcgbilcbiAqL1xuQlNULnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uIChlKSB7XG4gIHJldHVybiAhIXRoaXMuX2ZpbmQoZSk7XG59O1xuXG5CU1QucHJvdG90eXBlLl9maW5kID0gZnVuY3Rpb24gKGUsIHJvb3QpIHtcblxuICBpZiAoIXJvb3QpIHtcbiAgICBpZiAodGhpcy5yb290KSByb290ID0gdGhpcy5yb290O1xuICAgIGVsc2UgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHJvb3QudmFsdWUgPT09IGUpXG4gICAgcmV0dXJuIHJvb3Q7XG5cbiAgaWYgKHRoaXMuX2NvbXBhcmF0b3IubGVzc1RoYW4oZSwgcm9vdC52YWx1ZSkpXG4gICAgcmV0dXJuIHJvb3QubGVmdCAmJiB0aGlzLl9maW5kKGUsIHJvb3QubGVmdCk7XG5cbiAgaWYgKHRoaXMuX2NvbXBhcmF0b3IuZ3JlYXRlclRoYW4oZSwgcm9vdC52YWx1ZSkpXG4gICAgcmV0dXJuIHJvb3QucmlnaHQgJiYgdGhpcy5fZmluZChlLCByb290LnJpZ2h0KTtcbn07XG5cbi8qKlxuICogU3Vic3RpdHV0ZSB0d28gbm9kZXNcbiAqL1xuQlNULnByb3RvdHlwZS5fcmVwbGFjZU5vZGVJblBhcmVudCA9IGZ1bmN0aW9uIChjdXJyTm9kZSwgbmV3Tm9kZSkge1xuICB2YXIgcGFyZW50ID0gY3Vyck5vZGUucGFyZW50O1xuICBpZiAocGFyZW50KSB7XG4gICAgcGFyZW50W2N1cnJOb2RlID09PSBwYXJlbnQubGVmdCA/ICdsZWZ0JyA6ICdyaWdodCddID0gbmV3Tm9kZTtcbiAgICBpZiAobmV3Tm9kZSlcbiAgICAgIG5ld05vZGUucGFyZW50ID0gcGFyZW50O1xuICB9IGVsc2Uge1xuICAgIHRoaXMucm9vdCA9IG5ld05vZGU7XG4gIH1cbn07XG5cbi8qKlxuICogRmluZCB0aGUgbWluaW11bSB2YWx1ZSBpbiBhIHRyZWVcbiAqL1xuQlNULnByb3RvdHlwZS5fZmluZE1pbiA9IGZ1bmN0aW9uIChyb290KSB7XG4gIHZhciBtaW5Ob2RlID0gcm9vdDtcbiAgd2hpbGUgKG1pbk5vZGUubGVmdCkge1xuICAgIG1pbk5vZGUgPSBtaW5Ob2RlLmxlZnQ7XG4gIH1cbiAgcmV0dXJuIG1pbk5vZGU7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhbiBlbGVtZW50IGZyb20gdGhlIEJTVFxuICovXG5CU1QucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChlKSB7XG4gIHZhciBub2RlID0gdGhpcy5fZmluZChlKTtcbiAgaWYgKCFub2RlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJdGVtIG5vdCBmb3VuZCBpbiB0aGUgdHJlZScpO1xuICB9XG5cbiAgaWYgKG5vZGUubGVmdCAmJiBub2RlLnJpZ2h0KSB7XG4gICAgLyoqXG4gICAgICogSWYgdGhlIG5vZGUgdG8gYmUgcmVtb3ZlZCBoYXMgYm90aCBsZWZ0IGFuZCByaWdodCBjaGlsZHJlbixcbiAgICAgKiByZXBsYWNlIHRoZSBub2RlJ3MgdmFsdWUgYnkgdGhlIG1pbmltdW0gdmFsdWUgb2YgdGhlIHJpZ2h0XG4gICAgICogc3ViLXRyZWUsIGFuZCByZW1vdmUgdGhlIGxlYXZlIGNvbnRhaW5pbmcgdGhlIHZhbHVlXG4gICAgICovXG4gICAgdmFyIHN1Y2Nlc3NvciA9IHRoaXMuX2ZpbmRNaW4obm9kZS5yaWdodCk7XG4gICAgdGhpcy5yZW1vdmUoc3VjY2Vzc29yLnZhbHVlKTtcbiAgICBub2RlLnZhbHVlID0gc3VjY2Vzc29yLnZhbHVlO1xuICB9IGVsc2Uge1xuICAgIC8qKlxuICAgICAqIElmIHRoZSBub2RlIGlzIGEgbGVhZiwganVzdCBtYWtlIHRoZSBwYXJlbnQgcG9pbnQgdG8gbnVsbCxcbiAgICAgKiBhbmQgaWYgaXQgaGFzIG9uZSBjaGlsZCwgbWFrZSB0aGUgcGFyZW50IHBvaW50IHRvIHRoaXMgY2hpbGRcbiAgICAgKiBpbnN0ZWFkXG4gICAgICovXG4gICAgdGhpcy5fcmVwbGFjZU5vZGVJblBhcmVudChub2RlLCBub2RlLmxlZnQgfHwgbm9kZS5yaWdodCk7XG4gICAgdGhpcy5fc2l6ZS0tO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJTVDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9hbGdvcml0aG1zL2RhdGFfc3RydWN0dXJlcy9ic3QuanNcbi8vIG1vZHVsZSBpZCA9IDE4MlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRmVud2ljayBUcmVlIChCaW5hcnkgSW5kZXhlZCBUcmVlKVxuICpcbiAqIFRoZSBmZW53aWNrIHRyZWUgaXMgYSB0cmVlIGluIHRoZSBzZW5zZSBpdCByZXByZXNlbnRzIGEgc3RydWN0dXJlIHdoZXJlXG4gKiB0aGUgbGVhZnMgYXJlIHRoZSBvcmlnaW5hbCBhcnJheSB2YWx1ZXMgYW5kIGVhY2ggcGFyZW50IGhhcyB0aGUgc3VtIG9mIGl0c1xuICogdHdvIGNoaWxkcmVuLiBFLmcuLCBmb3IgYW4gYXJyYXkgWzEsIDIsIDMsIDRdLCB3ZSBoYXZlOlxuICpcbiAqICAgIDEwXG4gKiAgMyAgICA3XG4gKiAxIDIgIDMgNFxuICpcbiAqIEJ1dCBzb21lIG5vZGVzIGFyZW4ndCByZWFsbHkgaW1wb3J0YW50LiBJbiBmYWN0IGV2ZXJ5IHJpZ2h0IGNoaWxkIGlzbid0XG4gKiBuZWVkZWQgdG8gY29tcHV0ZSB0aGUgcHJlZml4IHN1bSAoYXMgaXRzIHZhbHVlIGlzIGp1c3QgdGhlIHBhcmVudCdzIHZhbHVlXG4gKiBtaW51cyB0aGUgbGVmdCBjaGlsZCksIHNvIHdlIGNhbiBzdG9yZSB0aGUgdHJlZSBpbiBhIGNvbXBhY3QgYXJyYXkgc3RydWN0dXJlXG4gKiBsaWtlIHRoaXM6XG4gKlxuICogMSAzIDMgMTBcbiAqXG4gKiBIZXJlIHdlIGFzc3VtZSBhbGwgdGhlIG9wZXJhdGlvbnMgd2lsbCBiZSBvbiBhIDEtYmFzZWQgYXJyYXkgZm9yIHR3b1xuICogcmVhc29uczogKDEpIHRoZSBiaXQgb3BlcmF0aW9ucyBiZWNvbWUgcmF0aGVyIGVhc3kgYW5kICgyKSBpdCdzIGJldHRlciB0b1xuICogcmVhc29uIGFib3V0IHRoZSByYW5nZSBzdW0gKHByZWZpeChiKSAtIHByZWZpeChhLTEpKSBvbiBhIDEtYmFzZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIEZlbndpY2tUcmVlKGxlbmd0aCkge1xuICB0aGlzLl9lbGVtZW50cyA9IG5ldyBBcnJheShsZW5ndGggKyAxKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9lbGVtZW50cy5sZW5ndGggOyBpKyspXG4gICAgdGhpcy5fZWxlbWVudHNbaV0gPSAwO1xufVxuXG4vKipcbiAqIEFkZHMgdmFsdWUgdG8gdGhlIGFycmF5IGF0IHNwZWNpZmllZCBpbmRleCBpbiBPKGxvZyBuKVxuICovXG5GZW53aWNrVHJlZS5wcm90b3R5cGUuYWRqdXN0ID0gZnVuY3Rpb24gKGluZGV4LCB2YWx1ZSkge1xuICAvKlxuICAgIFRoaXMgZnVuY3Rpb24gZ29lcyB1cCB0aGUgdHJlZSBhZGRpbmcgdGhlIHZhbHVlIHRvIGFsbCBwYXJlbnQgbm9kZXMuXG5cbiAgICBJbiB0aGUgYXJyYXksIHRvIGtub3cgd2hlcmUgYSBpbmRleCBpcyBpbiB0aGUgdHJlZSwganVzdCBsb29rIGF0IHdoZXJlIGlzXG4gICAgdGhlIHJpZ2h0bW9zdCBiaXQuIDEgaXMgYSBsZWFmLCBiZWNhdXNlIHRoZSByaWdodG1vc3QgYml0IGlzIGF0IHBvc2l0aW9uIDAuXG4gICAgMiAoMTApIGlzIDEgbGV2ZWwgYWJvdmUgdGhlIGxlYWZzLiA0ICgxMDApIGlzIDIgbGV2ZWxzIGFib3ZlIHRoZSBsZWFmcy5cblxuICAgIEdvaW5nIHVwIHRoZSB0cmVlIG1lYW5zIHB1c2hpbmcgdGhlIHJpZ2h0bW9zdCBiaXQgZmFyIHRvIHRoZSBsZWZ0LiBXZSBkb1xuICAgIHRoaXMgYnkgYWRkaW5nIG9ubHkgdGhlIGJpdCBpdHNlbGYgdG8gdGhlIGluZGV4LiBFdmVudHVhbGx5IHdlIHNraXBcbiAgICBzb21lIGxldmVscyB0aGF0IGFyZW4ndCByZXByZXNlbnRlZCBpbiB0aGUgYXJyYXkuIEUuZy4gc3RhcnRpbmcgYXQgMyAoMTEpLFxuICAgIGl0J3MgaW1lZGlhdGUgcGFyZW50IGlzIDExYiArIDFiID0gMTAwYi4gV2Ugc3RhcnRlZCBhdCBhIGxlYWYgIGFuZCBza2lwcGVkXG4gICAgdGhlIGxldmVsLTEgbm9kZSwgYmVjYXVzZSBpdCB3YXNuJ3QgcmVwcmVzZW50ZWQgaW4gdGhlIGFycmF5XG4gICAgKGEgcmlnaHQgY2hpbGQpLlxuXG4gICAgTm90ZTogKGluZGV4Ji1pbmRleCkgZmluZHMgdGhlIHJpZ2h0bW9zdCBiaXQgaW4gaW5kZXguXG4gICovXG4gIGZvciAoOyBpbmRleCA8IHRoaXMuX2VsZW1lbnRzLmxlbmd0aCA7IGluZGV4ICs9IChpbmRleCYtaW5kZXgpKVxuICAgIHRoaXMuX2VsZW1lbnRzW2luZGV4XSArPSB2YWx1ZTtcbn07XG5cbi8qKlxuKiBSZXR1cm5zIHRoZSBzdW0gb2YgYWxsIHZhbHVlcyB1cCB0byBzcGVjaWZpZWQgaW5kZXggaW4gTyhsb2cgbilcbiovXG5GZW53aWNrVHJlZS5wcm90b3R5cGUucHJlZml4U3VtID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gIC8qXG4gICAgVGhpcyBmdW5jdGlvbiBnb2VzIHVwIHRoZSB0cmVlIGFkZGluZyB0aGUgcmVxdWlyZWQgbm9kZXMgdG8gc3VtIHRoZSBwcmVmaXguXG5cbiAgICBUaGUga2V5IGhlcmUgaXMgdG8gc3VtIGV2ZXJ5IG5vZGUgdGhhdCBpc24ndCBpbiB0aGUgc2FtZSBzdWJ0cmVlIGFzIGFuXG4gICAgYWxyZWFkeSBzZWVuIG5vZGUuIEluIHByYWN0aWNlIHdlIHByb2NlZWQgYWx3YXlzIGdldHRpbmcgYSBub2RlJ3MgdW5jbGVcbiAgICAodGhlIHNpYmxpbmcgb2YgdGhlIG5vZGUncyBwYXJlbnQpLiBTbywgaWYgd2Ugc3RhcnQgYXQgdGhlIGluZGV4IDcsIHdlIG11c3RcbiAgICBnbyB0byA2ICg3J3MgdW5jbGUpLCB0aGVuIHRvIDQgKDYncyB1bmNsZSksIHRoZW4gd2Ugc3RvcCwgYmVjYXVzZSA0IGhhc1xuICAgIG5vIHVuY2xlLlxuXG4gICAgQmluYXJ5LXdpc2UsIHRoaXMgaXMgdGhlIHNhbWUgYXMgZXJhc2luZyB0aGUgcmlnaHRtb3N0IGJpdCBvZiB0aGUgaW5kZXguXG4gICAgRS5nLiA3ICgxMTEpIC0+IDYgKDExMCkgLT4gNCAoMTAwKS5cblxuICAgIE5vdGU6IChpbmRleCYtaW5kZXgpIGZpbmRzIHRoZSByaWdodG1vc3QgYml0IGluIGluZGV4LlxuICAqL1xuXG4gIHZhciBzdW0gPSAwO1xuICBmb3IgKDsgaW5kZXggPiAwIDsgaW5kZXggLT0gKGluZGV4Ji1pbmRleCkpXG4gICAgc3VtICs9IHRoaXMuX2VsZW1lbnRzW2luZGV4XTtcbiAgcmV0dXJuIHN1bTtcbn07XG5cbi8qKlxuKiBSZXR1cm5zIHRoZSBzdW0gb2YgYWxsIHZhbHVlcyBiZXR3ZWVuIHR3byBpbmRleGVzIGluIE8obG9nIG4pXG4qL1xuRmVud2lja1RyZWUucHJvdG90eXBlLnJhbmdlU3VtID0gZnVuY3Rpb24gKGZyb21JbmRleCwgdG9JbmRleCkge1xuICByZXR1cm4gdGhpcy5wcmVmaXhTdW0odG9JbmRleCkgLSB0aGlzLnByZWZpeFN1bShmcm9tSW5kZXggLSAxKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRmVud2lja1RyZWU7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYWxnb3JpdGhtcy9kYXRhX3N0cnVjdHVyZXMvZmVud2lja190cmVlLmpzXG4vLyBtb2R1bGUgaWQgPSAxODNcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFRyZWUgbm9kZVxuICovXG5mdW5jdGlvbiBOb2RlKHZhbHVlLCBsZWZ0LCByaWdodCkge1xuICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gIHRoaXMuY2hpbGRyZW4gPSBbbGVmdCwgcmlnaHRdO1xuICB0aGlzLnNpemUgPSAxO1xuICB0aGlzLmhlaWdodCA9IDE7XG4gIHRoaXMua2V5ID0gTWF0aC5yYW5kb20oKTtcbn1cblxuLyoqXG4gKiBDb21wdXRlciB0aGUgbnVtYmVyIG9mIGNoaWxkbm9kZXNcbiAqL1xuTm9kZS5wcm90b3R5cGUucmVzaXplID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLnNpemUgPSAodGhpcy5jaGlsZHJlblswXSA/IHRoaXMuY2hpbGRyZW5bMF0uc2l6ZSA6IDApIFxuICAgICAgICAgICAgKyAodGhpcy5jaGlsZHJlblsxXSA/IHRoaXMuY2hpbGRyZW5bMV0uc2l6ZSA6IDApICsgMTtcbiAgdGhpcy5oZWlnaHQgPSBNYXRoLm1heCh0aGlzLmNoaWxkcmVuWzBdID8gdGhpcy5jaGlsZHJlblswXS5oZWlnaHQgOiAwLFxuICBcdFx0XHRcdFx0XHQgdGhpcy5jaGlsZHJlblsxXSA/IHRoaXMuY2hpbGRyZW5bMV0uaGVpZ2h0IDogMCkgKyAxO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogWmlnemFnIHJvdGF0ZSBvZiB0cmVlIG5vZGVzXG4gKi9cbk5vZGUucHJvdG90eXBlLnJvdGF0ZSA9IGZ1bmN0aW9uIChzaWRlKSB7XG4gIHZhciB0ZW1wID0gdGhpcy5jaGlsZHJlbltzaWRlXTtcblxuICAvLyBSb3RhdGVcbiAgdGhpcy5jaGlsZHJlbltzaWRlXSA9IHRlbXAuY2hpbGRyZW5bMSAtIHNpZGVdO1xuICB0ZW1wLmNoaWxkcmVuWzEgLSBzaWRlXSA9IHRoaXM7XG5cbiAgdGhpcy5yZXNpemUoKTtcbiAgdGVtcC5yZXNpemUoKTtcblxuICByZXR1cm4gdGVtcDtcbn07XG5cbi8qKlxuICogVHJlYXBcbiAqL1xuZnVuY3Rpb24gVHJlYXAoKSB7XG4gIHRoaXMucm9vdCA9IG51bGw7XG59XG5cbi8qKlxuICogSW5zZXJ0IG5ldyB2YWx1ZSBpbnRvIHRoZSBzdWJ0cmVlIG9mIGBub2RlYFxuICovXG5UcmVhcC5wcm90b3R5cGUuX2luc2VydCA9IGZ1bmN0aW9uIChub2RlLCB2YWx1ZSkge1xuICBpZiAobm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBuZXcgTm9kZSh2YWx1ZSwgbnVsbCwgbnVsbCk7XG4gIH1cblxuICAvLyBQYXNzaW5nIHRvIGNoaWxkbm9kZXMgYW5kIHVwZGF0ZVxuICB2YXIgc2lkZSA9IH5+KHZhbHVlID4gbm9kZS52YWx1ZSk7XG4gIG5vZGUuY2hpbGRyZW5bc2lkZV0gPSB0aGlzLl9pbnNlcnQobm9kZS5jaGlsZHJlbltzaWRlXSwgdmFsdWUpO1xuXG4gIC8vIEtlZXAgaXQgYmFsYW5jZVxuICBpZiAobm9kZS5jaGlsZHJlbltzaWRlXS5rZXkgPCBub2RlLmtleSkge1xuXHRyZXR1cm4gbm9kZS5yb3RhdGUoc2lkZSk7XG4gIH0gZWxzZSB7XG5cdHJldHVybiBub2RlLnJlc2l6ZSgpO1xuICB9XG59O1xuXG5UcmVhcC5wcm90b3R5cGUuX2ZpbmQgPSBmdW5jdGlvbiAobm9kZSwgdmFsdWUpIHtcbiAgaWYgKG5vZGUgPT09IG51bGwpIHtcbiAgICAvLyBFbXB0eSB0cmVlXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChub2RlLnZhbHVlID09PSB2YWx1ZSkge1xuICAgIC8vIEZvdW5kIVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gU2VhcmNoIHdpdGhpbiBjaGlsZG5vZGVzXG4gIHZhciBzaWRlID0gfn4odmFsdWUgPiBub2RlLnZhbHVlKTtcbiAgcmV0dXJuIHRoaXMuX2ZpbmQobm9kZS5jaGlsZHJlbltzaWRlXSwgdmFsdWUpO1xufTtcblxuVHJlYXAucHJvdG90eXBlLl9taW5pbXVtID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgaWYgKG5vZGUgPT09IG51bGwpIHtcbiAgICAvLyBFbXB0eSB0cmVlLCByZXR1cm5zIEluZmluaXR5XG4gICAgcmV0dXJuIEluZmluaXR5O1xuICB9XG5cbiAgcmV0dXJuIE1hdGgubWluKG5vZGUudmFsdWUsIHRoaXMuX21pbmltdW0obm9kZS5jaGlsZHJlblswXSkpO1xufTtcblxuVHJlYXAucHJvdG90eXBlLl9tYXhpbXVtID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgaWYgKG5vZGUgPT09IG51bGwpIHtcbiAgICAvLyBFbXB0eSB0cmVlLCByZXR1cm5zIC1JbmZpbml0eVxuICAgIHJldHVybiAtSW5maW5pdHk7XG4gIH1cblxuICByZXR1cm4gTWF0aC5tYXgobm9kZS52YWx1ZSwgdGhpcy5fbWF4aW11bShub2RlLmNoaWxkcmVuWzFdKSk7XG59O1xuXG5UcmVhcC5wcm90b3R5cGUuX3JlbW92ZSA9IGZ1bmN0aW9uIChub2RlLCB2YWx1ZSkge1xuICBpZiAobm9kZSA9PT0gbnVsbCkge1xuICAgIC8vIEVtcHR5IG5vZGUsIHZhbHVlIG5vdCBmb3VuZFxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmFyIHNpZGU7XG5cbiAgaWYgKG5vZGUudmFsdWUgPT09IHZhbHVlKSB7XG4gICAgaWYgKG5vZGUuY2hpbGRyZW5bMF0gPT09IG51bGwgJiYgbm9kZS5jaGlsZHJlblsxXSA9PT0gbnVsbCkge1xuICAgICAgLy8gSXQncyBhIGxlYWYsIHNldCB0byBudWxsXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cblx0Ly8gUm90YXRlIHRvIGEgc3VidHJlZSBhbmQgcmVtb3ZlIGl0XG5cdHNpZGUgPSAobm9kZS5jaGlsZHJlblswXSA9PT0gbnVsbCA/IDEgOiAwKTtcblx0bm9kZSA9IG5vZGUucm90YXRlKHNpZGUpO1xuICBcdG5vZGUuY2hpbGRyZW5bMSAtIHNpZGVdID0gdGhpcy5fcmVtb3ZlKG5vZGUuY2hpbGRyZW5bMSAtIHNpZGVdLCB2YWx1ZSk7XG4gIFx0cmV0dXJuIG5vZGUucmVzaXplKCk7XG4gIH0gZWxzZSB7XG4gICAgc2lkZSA9IH5+KHZhbHVlID4gbm9kZS52YWx1ZSk7XG4gICAgbm9kZS5jaGlsZHJlbltzaWRlXSA9IHRoaXMuX3JlbW92ZShub2RlLmNoaWxkcmVuW3NpZGVdLCB2YWx1ZSk7XG4gIFx0cmV0dXJuIG5vZGUucmVzaXplKCk7XG4gIH1cbn07XG5cblRyZWFwLnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgdGhpcy5yb290ID0gdGhpcy5faW5zZXJ0KHRoaXMucm9vdCwgdmFsdWUpO1xufTtcblxuVHJlYXAucHJvdG90eXBlLmZpbmQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIHRoaXMuX2ZpbmQodGhpcy5yb290LCB2YWx1ZSk7XG59O1xuXG5UcmVhcC5wcm90b3R5cGUubWluaW11bSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuX21pbmltdW0odGhpcy5yb290KTtcbn07XG5cblRyZWFwLnByb3RvdHlwZS5tYXhpbXVtID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5fbWF4aW11bSh0aGlzLnJvb3QpO1xufTtcblxuVHJlYXAucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICB0aGlzLnJvb3QgPSB0aGlzLl9yZW1vdmUodGhpcy5yb290LCB2YWx1ZSk7XG59O1xuXG5UcmVhcC5wcm90b3R5cGUuc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMucm9vdCA/IHRoaXMucm9vdC5zaXplIDogMDtcbn07XG5cblRyZWFwLnByb3RvdHlwZS5oZWlnaHQgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLnJvb3QgPyB0aGlzLnJvb3QuaGVpZ2h0IDogMDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVHJlYXA7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYWxnb3JpdGhtcy9kYXRhX3N0cnVjdHVyZXMvdHJlYXAuanNcbi8vIG1vZHVsZSBpZCA9IDE4NFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbi8vIEdlb21ldHJ5IGFsZ29yaXRobXNcbm1vZHVsZS5leHBvcnRzID0ge1xuICBCZXppZXJDdXJ2ZTogcmVxdWlyZSgnLi9hbGdvcml0aG1zL2dlb21ldHJ5L2Jlemllcl9jdXJ2ZScpXG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2FsZ29yaXRobXMvZ2VvbWV0cnkuanNcbi8vIG1vZHVsZSBpZCA9IDE4NVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbi8vIEdyYXBoIGFsZ29yaXRobXNcbm1vZHVsZS5leHBvcnRzID0ge1xuICB0b3BvbG9naWNhbFNvcnQ6IHJlcXVpcmUoJy4vYWxnb3JpdGhtcy9ncmFwaC90b3BvbG9naWNhbF9zb3J0JyksXG4gIGRpamtzdHJhOiByZXF1aXJlKCcuL2FsZ29yaXRobXMvZ3JhcGgvZGlqa3N0cmEnKSxcbiAgU1BGQTogcmVxdWlyZSgnLi9hbGdvcml0aG1zL2dyYXBoL1NQRkEnKSxcbiAgYmVsbG1hbkZvcmQ6IHJlcXVpcmUoJy4vYWxnb3JpdGhtcy9ncmFwaC9iZWxsbWFuX2ZvcmQnKSxcbiAgZXVsZXJQYXRoOiByZXF1aXJlKCcuL2FsZ29yaXRobXMvZ3JhcGgvZXVsZXJfcGF0aCcpLFxuICBkZXB0aEZpcnN0U2VhcmNoOiByZXF1aXJlKCcuL2FsZ29yaXRobXMvZ3JhcGgvZGVwdGhfZmlyc3Rfc2VhcmNoJyksXG4gIGtydXNrYWw6IHJlcXVpcmUoJy4vYWxnb3JpdGhtcy9ncmFwaC9rcnVza2FsJyksXG4gIGJyZWFkdGhGaXJzdFNlYXJjaDogcmVxdWlyZSgnLi9hbGdvcml0aG1zL2dyYXBoL2JyZWFkdGhfZmlyc3Rfc2VhcmNoJyksXG4gIGJmc1Nob3J0ZXN0UGF0aDogcmVxdWlyZSgnLi9hbGdvcml0aG1zL2dyYXBoL2Jmc19zaG9ydGVzdF9wYXRoJyksXG4gIHByaW06IHJlcXVpcmUoJy4vYWxnb3JpdGhtcy9ncmFwaC9wcmltJyksXG4gIGZsb3lkV2Fyc2hhbGw6IHJlcXVpcmUoJy4vYWxnb3JpdGhtcy9ncmFwaC9mbG95ZF93YXJzaGFsbCcpXG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2FsZ29yaXRobXMvZ3JhcGguanNcbi8vIG1vZHVsZSBpZCA9IDE4NlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIndXNlIHN0cmljdCc7XG5cbnZhciBsaWIgPSB7XG4gIERhdGFTdHJ1Y3R1cmVzOiByZXF1aXJlKCcuL2RhdGFfc3RydWN0dXJlcycpLFxuICBHcmFwaDogcmVxdWlyZSgnLi9ncmFwaCcpLFxuICBHZW9tZXRyeTogcmVxdWlyZSgnLi9nZW9tZXRyeScpLFxuICBNYXRoOiByZXF1aXJlKCcuL21hdGgnKSxcbiAgU2VhcmNoOiByZXF1aXJlKCcuL3NlYXJjaCcpLFxuICBTb3J0aW5nOiByZXF1aXJlKCcuL3NvcnRpbmcnKSxcbiAgU3RyaW5nOiByZXF1aXJlKCcuL3N0cmluZycpXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGxpYjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9hbGdvcml0aG1zL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAxODdcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBNYXRoIGFsZ29yaXRobXNcbm1vZHVsZS5leHBvcnRzID0ge1xuICBmaWJvbmFjY2k6IHJlcXVpcmUoJy4vYWxnb3JpdGhtcy9tYXRoL2ZpYm9uYWNjaScpLFxuICBmaXNoZXJZYXRlczogcmVxdWlyZSgnLi9hbGdvcml0aG1zL21hdGgvZmlzaGVyX3lhdGVzJyksXG4gIGdjZDogcmVxdWlyZSgnLi9hbGdvcml0aG1zL21hdGgvZ2NkJyksXG4gIGV4dGVuZGVkRXVjbGlkZWFuOiByZXF1aXJlKCcuL2FsZ29yaXRobXMvbWF0aC9leHRlbmRlZF9ldWNsaWRlYW4nKSxcbiAgbGNtOiByZXF1aXJlKCcuL2FsZ29yaXRobXMvbWF0aC9sY20nKSxcbiAgbmV3dG9uU3FydDogcmVxdWlyZSgnLi9hbGdvcml0aG1zL21hdGgvbmV3dG9uX3NxcnQnKSxcbiAgcHJpbWFsaXR5VGVzdHM6IHJlcXVpcmUoJy4vYWxnb3JpdGhtcy9tYXRoL3ByaW1hbGl0eV90ZXN0cycpLFxuICByZXNlcnZvaXJTYW1wbGluZzogcmVxdWlyZSgnLi9hbGdvcml0aG1zL21hdGgvcmVzZXJ2b2lyX3NhbXBsaW5nJyksXG4gIGZhc3RQb3dlcjogcmVxdWlyZSgnLi9hbGdvcml0aG1zL21hdGgvZmFzdF9wb3dlcicpLFxuICBuZXh0UGVybXV0YXRpb246IHJlcXVpcmUoJy4vYWxnb3JpdGhtcy9tYXRoL25leHRfcGVybXV0YXRpb24nKSxcbiAgcG93ZXJTZXQ6IHJlcXVpcmUoJy4vYWxnb3JpdGhtcy9tYXRoL3Bvd2VyX3NldCcpLFxuICBzaGFubm9uRW50cm9weTogcmVxdWlyZSgnLi9hbGdvcml0aG1zL21hdGgvc2hhbm5vbl9lbnRyb3B5JyksXG4gIGNvbGxhdHpDb25qZWN0dXJlOiByZXF1aXJlKCcuL2FsZ29yaXRobXMvbWF0aC9jb2xsYXR6X2NvbmplY3R1cmUnKSxcbiAgZ3JlYXRlc3REaWZmZXJlbmNlOiByZXF1aXJlKCcuL2FsZ29yaXRobXMvbWF0aC9ncmVhdGVzdF9kaWZmZXJlbmNlJylcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYWxnb3JpdGhtcy9tYXRoLmpzXG4vLyBtb2R1bGUgaWQgPSAxODhcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBTZWFyY2ggYWxnb3JpdGhtc1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGJmczogcmVxdWlyZSgnLi9hbGdvcml0aG1zL3NlYXJjaC9iZnMnKSxcbiAgYmluYXJ5U2VhcmNoOiByZXF1aXJlKCcuL2FsZ29yaXRobXMvc2VhcmNoL2JpbmFyeXNlYXJjaCcpLFxuICB0ZXJuYXJ5U2VhcmNoOiByZXF1aXJlKCcuL2FsZ29yaXRobXMvc2VhcmNoL3Rlcm5hcnlfc2VhcmNoJyksXG4gIGRmczogcmVxdWlyZSgnLi9hbGdvcml0aG1zL3NlYXJjaC9kZnMnKVxufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9hbGdvcml0aG1zL3NlYXJjaC5qc1xuLy8gbW9kdWxlIGlkID0gMTg5XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuLy8gU29ydGluZyBhbGdvcml0aG1zXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYnViYmxlU29ydDogcmVxdWlyZSgnLi9hbGdvcml0aG1zL3NvcnRpbmcvYnViYmxlX3NvcnQnKSxcbiAgc2hvcnRCdWJibGVTb3J0OiByZXF1aXJlKCcuL2FsZ29yaXRobXMvc29ydGluZy9zaG9ydF9idWJibGVfc29ydCcpLFxuICBjb3VudGluZ1NvcnQ6IHJlcXVpcmUoJy4vYWxnb3JpdGhtcy9zb3J0aW5nL2NvdW50aW5nX3NvcnQnKSxcbiAgaGVhcFNvcnQ6IHJlcXVpcmUoJy4vYWxnb3JpdGhtcy9zb3J0aW5nL2hlYXBfc29ydCcpLFxuICBtZXJnZVNvcnQ6IHJlcXVpcmUoJy4vYWxnb3JpdGhtcy9zb3J0aW5nL21lcmdlX3NvcnQnKSxcbiAgcXVpY2tzb3J0OiByZXF1aXJlKCcuL2FsZ29yaXRobXMvc29ydGluZy9xdWlja3NvcnQnKSxcbiAgc2VsZWN0aW9uU29ydDogcmVxdWlyZSgnLi9hbGdvcml0aG1zL3NvcnRpbmcvc2VsZWN0aW9uX3NvcnQnKSxcbiAgcmFkaXhTb3J0OiByZXF1aXJlKCcuL2FsZ29yaXRobXMvc29ydGluZy9yYWRpeF9zb3J0JyksXG4gIGluc2VydGlvblNvcnQ6IHJlcXVpcmUoJy4vYWxnb3JpdGhtcy9zb3J0aW5nL2luc2VydGlvbl9zb3J0JyksXG4gIHNoZWxsU29ydDogcmVxdWlyZSgnLi9hbGdvcml0aG1zL3NvcnRpbmcvc2hlbGxfc29ydCcpXG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2FsZ29yaXRobXMvc29ydGluZy5qc1xuLy8gbW9kdWxlIGlkID0gMTkwXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIid1c2Ugc3RyaWN0JztcblxuLy8gU3RyaW5nIGFsZ29yaXRobXNcbm1vZHVsZS5leHBvcnRzID0ge1xuICBsZXZlbnNodGVpbjogcmVxdWlyZSgnLi9hbGdvcml0aG1zL3N0cmluZy9sZXZlbnNodGVpbicpLFxuICByYWJpbkthcnA6IHJlcXVpcmUoJy4vYWxnb3JpdGhtcy9zdHJpbmcvcmFiaW5fa2FycCcpLFxuICBrbnV0aE1vcnJpc1ByYXR0OiByZXF1aXJlKCcuL2FsZ29yaXRobXMvc3RyaW5nL2tudXRoX21vcnJpc19wcmF0dCcpLFxuICBodWZmbWFuOiByZXF1aXJlKCcuL2FsZ29yaXRobXMvc3RyaW5nL2h1ZmZtYW4nKSxcbiAgaGFtbWluZzogcmVxdWlyZSgnLi9hbGdvcml0aG1zL3N0cmluZy9oYW1taW5nJyksXG4gIGxvbmdlc3RDb21tb25TdWJzZXF1ZW5jZTogcmVxdWlyZShcbiAgICAnLi9hbGdvcml0aG1zL3N0cmluZy9sb25nZXN0X2NvbW1vbl9zdWJzZXF1ZW5jZScpLFxuICBsb25nZXN0Q29tbW9uU3Vic3RyaW5nOiByZXF1aXJlKFxuICAgICAgJy4vYWxnb3JpdGhtcy9zdHJpbmcvbG9uZ2VzdF9jb21tb25fc3Vic3RyaW5nJylcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vYWxnb3JpdGhtcy9zdHJpbmcuanNcbi8vIG1vZHVsZSBpZCA9IDE5MVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGttcF9tYXRjaGVyID0ge1xuICAgICAgICBrbXA6IGZ1bmN0aW9uKHMsIHApIHtcbiAgICAgICAgICAgIHZhciBuID0gcy5sZW5ndGg7XG4gICAgICAgICAgICB2YXIgbSA9IHAubGVuZ3RoO1xuICAgICAgICAgICAgdmFyIHByZWZpeCA9IGttcF9tYXRjaGVyLmNhbGNQcmVmaXhGdW5jdGlvbihwKTtcbiAgICAgICAgICAgIHZhciByZXMgPSBbXTtcbiAgICAgICAgICAgIHZhciBxID0gMDtcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgICAgICB3aGlsZShxID4gMCAmJiBwW3FdICE9IHNbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgcSA9IHByZWZpeFtxIC0gMV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKHBbcV0gPT0gc1tpXSkge1xuICAgICAgICAgICAgICAgICAgICArK3E7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKHEgPT0gbSkge1xuICAgICAgICAgICAgICAgICAgICByZXMucHVzaChpIC0gbSArIDEpO1xuICAgICAgICAgICAgICAgICAgICBxID0gcHJlZml4W3EgLSAxXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICB9LFxuICAgICAgICBjYWxjUHJlZml4RnVuY3Rpb246IGZ1bmN0aW9uKHApIHtcbiAgICAgICAgICAgIHZhciBuID0gcC5sZW5ndGg7XG4gICAgICAgICAgICB2YXIgcHJlZml4ID0gW107XG4gICAgICAgICAgICB2YXIgcSA9IDA7XG4gICAgICAgICAgICBwcmVmaXgucHVzaChxKTtcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDE7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgICAgICB3aGlsZShxID4gMCAmJiBwW3FdICE9IHBbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgcSA9IHByZWZpeFtxIC0gMV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKHBbcV0gPT0gcFtpXSkge1xuICAgICAgICAgICAgICAgICAgICArK3E7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHByZWZpeFtpXSA9IHE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcHJlZml4O1xuICAgICAgICB9LFxuICAgIH07XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkgZGVmaW5lKGZ1bmN0aW9uKCkgeyByZXR1cm4ga21wX21hdGNoZXI7IH0pO1xuICAgIGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSBtb2R1bGUuZXhwb3J0cyA9IGttcF9tYXRjaGVyO1xuICAgIGVsc2UgaWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykgc2VsZi5rbXBfbWF0Y2hlciA9IGttcF9tYXRjaGVyO1xuICAgIGVsc2Ugd2luZG93LmttcF9tYXRjaGVyID0ga21wX21hdGNoZXI7XG59KSgpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2ttcC1tYXRjaGVyL2ttcC1tYXRjaGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAxOTJcbi8vIG1vZHVsZSBjaHVua3MgPSAxIl0sInNvdXJjZVJvb3QiOiIifQ==