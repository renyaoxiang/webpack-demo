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
/******/ 			var chunkId = 4;
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
/******/ 	return hotCreateRequire(245)(__webpack_require__.s = 245);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

module.exports = vendor;

/***/ }),

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(77);

/***/ }),

/***/ 100:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export arrayif */
/* unused harmony export lazy */
/* unused harmony export lazyValue */
class Pair {
    constructor(first, second) {
        this.first = first;
        this.second = second;
    }
}
/* harmony export (immutable) */ __webpack_exports__["b"] = Pair;

function arrayif(obj = []) {
    if (Array.isArray(obj)) {
        return [...obj];
    }
    else {
        return [obj];
    }
}
function lazy(val) {
    if (typeof val === "function") {
        return val();
    }
    else {
        return () => val;
    }
}
class Lock {
    constructor(_lock = false, before, after) {
        this._lock = _lock;
        this.before = before;
        this.after = after;
    }
    static of() {
        return new Lock();
    }
    get isLock() {
        return this._lock;
    }
    get isFree() {
        return !this._lock;
    }
    start(before) {
        this.checkFree();
        if (this.before) {
            this.before();
        }
        if (before) {
            before();
        }
        this._lock = true;
    }
    end(after) {
        this.checkLocking();
        this._lock = false;
        if (after) {
            after();
        }
        if (this.after) {
            this.after();
        }
    }
    atom(action, before, after) {
        this.start(before);
        action();
        this.end(after);
        return this;
    }
    checkLocking() {
        if (!this._lock) {
            throw new Exception("object locked");
        }
    }
    checkFree() {
        if (this._lock) {
            throw new Exception("object locked");
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["c"] = Lock;

/**
 * 同步方法中随便使用
 * 异步方法中如果不关心结果的前置处理，只关心结果的后置处理，可以使用该类，
 */
class Store {
    constructor() {
        this._state = false;
        this._data = null;
    }
    set data(result) {
        this._state = true;
        this._data = result;
    }
    get state() {
        return this._state;
    }
    get data() {
        return this._data;
    }
    reset() {
        this._state = false;
        this._data = null;
        return this;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Store;

class StandardStore {
    constructor() {
        this._isStandard = false;
        this._store = new Store();
    }
    state() {
        return this._store.state;
    }
    isStandard() {
        this.checkReadable();
        return this._isStandard;
    }
    setData(data) {
        this._isStandard = false;
        this._store.data = data;
        return this;
    }
    setError(error) {
        this._isStandard = true;
        this._store.data = error;
        return this;
    }
    getData() {
        this.checkReadable();
        return !this._isStandard ? this._store.data : null;
    }
    getError() {
        this.checkReadable();
        return this._isStandard ? this._store.data : null;
    }
    checkReadable() {
        if (!this._store.state) {
            throw new Error("result does not set");
        }
    }
    reset() {
        this._store.reset();
    }
}
/* unused harmony export StandardStore */

class StatePromise {
    constructor() {
        this._finished = false;
        this._lock = new Lock();
        this._promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }
    get isFinished() {
        return this._finished;
    }
    action(action) {
        this.checkWriteable();
        if (this._lock.isLock) {
            this._lock.atom(() => {
                action((data) => {
                    this.resolve(data);
                }, (error) => {
                    this.reject(error);
                });
            });
        }
    }
    reject(error) {
        this.checkWriteable();
        this._finished = true;
        this._reject(error);
    }
    resolve(data) {
        this.checkWriteable();
        this._finished = true;
        this._resolve(data);
    }
    get promise() {
        return this._promise;
    }
    checkWriteable() {
        if (this._finished) {
            throw new Exception("result has been setted");
        }
    }
}
/* unused harmony export StatePromise */

class StatesPromise {
    constructor() {
        this._finished = false;
        this._store = new StandardStore();
        this._promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }
    isFinished() {
        return this._finished;
    }
    resolveData(data) {
        this.checkWriteable();
        this._store.setData(data);
        return this;
    }
    rejectData(error) {
        this.checkWriteable();
        this._store.setError(error);
        return this;
    }
    reject() {
        this.checkWriteable();
        this._reject(this._store.getError());
    }
    resolve() {
        this.checkWriteable();
        this._resolve(this._store.getData());
    }
    checkWriteable() {
        if (this._finished) {
            throw new Exception("result has been setted");
        }
    }
    get promise() {
        return this._promise;
    }
}
/* unused harmony export StatesPromise */

class Exception extends Error {
    constructor(message, code) {
        super(message);
        this.code = -1;
        if (Number.isFinite(code)) {
            this.code = code;
        }
    }
}
/* unused harmony export Exception */

function lazyValue(value) {
    if (typeof value === "function") {
        return value();
    }
    else {
        return value;
    }
}


/***/ }),

/***/ 127:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_table__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_table___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_table__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shared_lib_functions__ = __webpack_require__(100);




__WEBPACK_IMPORTED_MODULE_0_jquery__(() => {
    const wall = [Position.of(3, 0), Position.of(3, 1), Position.of(3, 2), Position.of(3, 3)];
    const width = 5;
    const height = 5;
    const grid = new Grid(width, height);
    grid.forEach(box => {
        wall.forEach(it => {
            if (it.equals(box.getPostion())) {
                box.isEmpty = false;
            }
        });
    });
    grid.print();
    const startPosition = Position.of(2, 0);
    // const endPosition = Position.of(4, 0);
    const onFinish = (path) => {
        if (path !== null) {
            grid.print(path);
        }
        else {
            console.log("not find");
        }
    };
    const start = grid.getBox(startPosition);
    const box3 = grid.getBox(Position.of(2, 3));
    onFinish(start.getPath(box3));
});
class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.shortestPathStore = new __WEBPACK_IMPORTED_MODULE_3__shared_lib_functions__["a" /* Store */]();
        this.boxList = [];
        this.boxList = new Array(width * height);
        for (let h = 0; h < height; h++) {
            for (let w = 0; w < width; w++) {
                this.boxList[h * width + w] = new Box(w, h, this);
            }
        }
    }
    reset() {
        this.shortestPathStore.reset();
        this.boxList.forEach(it => it.reset());
    }
    setShortestPath(path = []) {
        this.shortestPathStore.data = path;
    }
    getShortestPathStore() {
        return this.shortestPathStore;
    }
    compare(o1, o2, dist) {
        const p0 = dist.getPostion();
        const p1 = o1.getPostion();
        const p2 = o2.getPostion();
        return (Math.pow(p0.w - p1.w, 2) + Math.pow(p0.h - p1.h, 2) - Math.pow(p0.w - p2.w, 2) - Math.pow(p0.h - p2.h, 2));
    }
    forEach(callback) {
        this.boxList.forEach(callback);
    }
    print(path = []) {
        path = path || [];
        const data = __WEBPACK_IMPORTED_MODULE_1_lodash__["chunk"](this.boxList.map(it => {
            if (path.includes(it)) {
                return path.indexOf(it);
            }
            else if (!it.isEmpty) {
                return "|";
            }
            else {
                const position = it.getPostion();
                return path.length === 0 ? `${position.w}${position.h}` : " ";
            }
        }), this.width);
        console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_table__["table"])(data));
    }
    printPath(path = []) {
        path = path || [];
        const tableData = path.map(it => {
            const p = it.getPostion();
            return `${p.w}${p.h}`;
        });
        if (tableData.length > 0) {
            console.log(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_table__["table"])([tableData]));
        }
    }
    getBox(position) {
        const index = position.h * this.width + position.w;
        return this.boxList[index];
    }
}
class Box {
    constructor(w, h, grid, isEmpty = true) {
        this.w = w;
        this.h = h;
        this.grid = grid;
        this.isEmpty = isEmpty;
        this.pathCache = new __WEBPACK_IMPORTED_MODULE_3__shared_lib_functions__["a" /* Store */]();
        this.lock = new __WEBPACK_IMPORTED_MODULE_3__shared_lib_functions__["c" /* Lock */]();
        this.prePath = [];
    }
    reset() {
        this.pathCache = new __WEBPACK_IMPORTED_MODULE_3__shared_lib_functions__["a" /* Store */]();
        this.lock = new __WEBPACK_IMPORTED_MODULE_3__shared_lib_functions__["c" /* Lock */]();
        this.prePath = [];
    }
    updatePath(path) {
        this.pathCache.data = path;
    }
    searchPath(dist) {
        const result = new __WEBPACK_IMPORTED_MODULE_3__shared_lib_functions__["a" /* Store */]();
        if (this.equals(dist)) {
            result.data = [this];
            this.updateShortestPath([...this.prePath, this]);
        }
        else {
            const neighbours = this.getNeighbours();
            const sortedNeighbour = this.evaluateAndSortNeighbours(dist, neighbours);
            const neighbourPaths = sortedNeighbour.map(it => {
                it.prePath = [...this.prePath];
                return it.getPath(dist);
            });
            const shortestPath = neighbourPaths.reduce(this.getShorterPath, null);
            if (shortestPath === null) {
                result.data = null;
            }
            else {
                result.data = [this, ...shortestPath];
                this.updateShortestPath([...this.prePath, this, ...shortestPath]);
            }
        }
        return result.data;
    }
    getShorterPath(o1, o2) {
        if (o1 === null || o2 === null) {
            return o1 || o2;
        }
        else {
            return o1.length < o2.length ? o1 : o2;
        }
    }
    updateShortestPath(path) {
        const store = this.grid.getShortestPathStore();
        let shortestPath = store.data;
        if (!store.state) {
            shortestPath = path;
        }
        else {
            if (shortestPath === null || path === null) {
                shortestPath = shortestPath || path;
            }
            else {
                shortestPath = path.length < shortestPath.length ? path : shortestPath;
            }
        }
        shortestPath.forEach(it => it.updatePath(path.slice(path.indexOf(it))));
        store.data = shortestPath;
    }
    evaluateAndSortNeighbours(dist, neighbours) {
        return [...neighbours].sort((o1, o2) => this.grid.compare(o1, o2, dist));
    }
    getPath(dist) {
        if (!this.pathCache.state || this.pathCache.data !== null) {
            this.lock.atom(() => {
                if (this.shouldTry()) {
                    this.pathCache.data = this.searchPath(dist);
                }
                else {
                    this.pathCache.data = null;
                }
            });
        }
        return this.pathCache.data;
    }
    shouldTry() {
        const shortestPathStore = this.grid.getShortestPathStore();
        return !shortestPathStore.state || this.prePath.length < shortestPathStore.data.length;
    }
    getPostion() {
        return Position.of(this.w, this.h);
    }
    getNeighbours() {
        return this.getNeighbourPosition(this.getPostion())
            .map(it => this.grid.getBox(it))
            .filter(it => it.isEmpty)
            .filter(it => it.lock.isFree);
    }
    getNeighbourPosition(position) {
        const subPosition1 = [position.w - 1, position.w + 1].map(it => new Position(it, position.h));
        const subPosition2 = [position.h - 1, position.h + 1].map(it => new Position(position.w, it));
        const subPosition3 = [position.w - 1, position.w + 1].map(it => new Position(it, position.h + 1));
        const subPosition4 = [position.w - 1, position.w + 1].map(it => new Position(it, position.h - 1));
        return __WEBPACK_IMPORTED_MODULE_1_lodash__["flatMap"]([subPosition1, subPosition2, subPosition3, subPosition4]).filter(it => {
            return it.w >= 0 && it.h >= 0 && it.w < this.grid.width && it.h < this.grid.height;
        });
    }
    equals(other) {
        return other != null && this.getPostion().equals(other.getPostion());
    }
}
class Position {
    constructor(w, h) {
        this.w = w;
        this.h = h;
    }
    toString() {
        return JSON.stringify({
            w: this.w,
            h: this.h
        });
    }
    equals(position) {
        return this.w === position.w && this.h === position.h;
    }
    static of(x, y) {
        return new Position(x, y);
    }
}


/***/ }),

/***/ 2:
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(48);

/***/ }),

/***/ 20:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

/* eslint-disable sort-keys */

/**
 * @typedef border
 * @property {string} topBody
 * @property {string} topJoin
 * @property {string} topLeft
 * @property {string} topRight
 * @property {string} bottomBody
 * @property {string} bottomJoin
 * @property {string} bottomLeft
 * @property {string} bottomRight
 * @property {string} bodyLeft
 * @property {string} bodyRight
 * @property {string} bodyJoin
 * @property {string} joinBody
 * @property {string} joinLeft
 * @property {string} joinRight
 * @property {string} joinJoin
 */

/**
 * @param {string} name
 * @returns {border}
 */
exports.default = name => {
  if (name === 'honeywell') {
    return {
      topBody: '═',
      topJoin: '╤',
      topLeft: '╔',
      topRight: '╗',

      bottomBody: '═',
      bottomJoin: '╧',
      bottomLeft: '╚',
      bottomRight: '╝',

      bodyLeft: '║',
      bodyRight: '║',
      bodyJoin: '│',

      joinBody: '─',
      joinLeft: '╟',
      joinRight: '╢',
      joinJoin: '┼'
    };
  }

  if (name === 'norc') {
    return {
      topBody: '─',
      topJoin: '┬',
      topLeft: '┌',
      topRight: '┐',

      bottomBody: '─',
      bottomJoin: '┴',
      bottomLeft: '└',
      bottomRight: '┘',

      bodyLeft: '│',
      bodyRight: '│',
      bodyJoin: '│',

      joinBody: '─',
      joinLeft: '├',
      joinRight: '┤',
      joinJoin: '┼'
    };
  }

  if (name === 'ramac') {
    return {
      topBody: '-',
      topJoin: '+',
      topLeft: '+',
      topRight: '+',

      bottomBody: '-',
      bottomJoin: '+',
      bottomLeft: '+',
      bottomRight: '+',

      bodyLeft: '|',
      bodyRight: '|',
      bodyJoin: '|',

      joinBody: '-',
      joinLeft: '|',
      joinRight: '|',
      joinJoin: '|'
    };
  }

  if (name === 'void') {
    return {
      topBody: '',
      topJoin: '',
      topLeft: '',
      topRight: '',

      bottomBody: '',
      bottomJoin: '',
      bottomLeft: '',
      bottomRight: '',

      bodyLeft: '',
      bodyRight: '',
      bodyJoin: '',

      joinBody: '',
      joinLeft: '',
      joinRight: '',
      joinJoin: ''
    };
  }

  throw new Error('Unknown border template "' + name + '".');
};

/***/ }),

/***/ 245:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(127);


/***/ }),

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(0))(76);

/***/ }),

/***/ 41:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const isFullwidthCodePoint = __webpack_require__(83);

const ESCAPES = [
	'\u001B',
	'\u009B'
];

const END_CODE = 39;
const ASTRAL_REGEX = /[\uD800-\uDBFF][\uDC00-\uDFFF]/;

const ESCAPE_CODES = new Map([
	[0, 0],
	[1, 22],
	[2, 22],
	[3, 23],
	[4, 24],
	[7, 27],
	[8, 28],
	[9, 29],
	[30, 39],
	[31, 39],
	[32, 39],
	[33, 39],
	[34, 39],
	[35, 39],
	[36, 39],
	[37, 39],
	[90, 39],
	[40, 49],
	[41, 49],
	[42, 49],
	[43, 49],
	[44, 49],
	[45, 49],
	[46, 49],
	[47, 49]
]);

const wrapAnsi = code => `${ESCAPES[0]}[${code}m`;

module.exports = (str, begin, end) => {
	const arr = Array.from(str.normalize());

	end = typeof end === 'number' ? end : arr.length;

	let insideEscape = false;
	let escapeCode;
	let visible = 0;
	let output = '';

	for (const item of arr.entries()) {
		const i = item[0];
		const x = item[1];

		let leftEscape = false;

		if (ESCAPES.indexOf(x) !== -1) {
			insideEscape = true;
			const code = /\d[^m]*/.exec(str.slice(i, i + 4));
			escapeCode = code === END_CODE ? null : code;
		} else if (insideEscape && x === 'm') {
			insideEscape = false;
			leftEscape = true;
		}

		if (!insideEscape && !leftEscape) {
			++visible;
		}

		if (!ASTRAL_REGEX.test(x) && isFullwidthCodePoint(x.codePointAt())) {
			++visible;
		}

		if (visible > begin && visible <= end) {
			output += x;
		} else if (visible === begin && !insideEscape && escapeCode !== undefined && escapeCode !== END_CODE) {
			output += wrapAnsi(escapeCode);
		} else if (visible >= end) {
			if (escapeCode !== undefined) {
				output += wrapAnsi(ESCAPE_CODES.get(parseInt(escapeCode, 10)) || END_CODE);
			}
			break;
		}
	}

	return output;
};


/***/ }),

/***/ 45:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringWidth = __webpack_require__(6);

var _stringWidth2 = _interopRequireDefault(_stringWidth);

var _alignString = __webpack_require__(85);

var _alignString2 = _interopRequireDefault(_alignString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {table~row[]} rows
 * @param {Object} config
 * @returns {table~row[]}
 */
exports.default = (rows, config) => {
  return rows.map(cells => {
    return cells.map((value, index1) => {
      const column = config.columns[index1];

      if ((0, _stringWidth2.default)(value) === column.width) {
        return value;
      } else {
        return (0, _alignString2.default)(value, column.width, column.alignment);
      }
    });
  });
};

/***/ }),

/***/ 46:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringWidth = __webpack_require__(6);

var _stringWidth2 = _interopRequireDefault(_stringWidth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Calculates width of each cell contents.
 *
 * @param {string[]} cells
 * @returns {number[]}
 */
exports.default = cells => {
  return cells.map(value => {
    return (0, _stringWidth2.default)(value);
  });
};

/***/ }),

/***/ 47:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

var _calculateCellHeight = __webpack_require__(86);

var _calculateCellHeight2 = _interopRequireDefault(_calculateCellHeight);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Calculates the vertical row span index.
 *
 * @param {Array[]} rows
 * @param {Object} config
 * @returns {number[]}
 */
exports.default = (rows, config) => {
  const tableWidth = rows[0].length;

  const rowSpanIndex = [];

  _lodash2.default.forEach(rows, cells => {
    const cellHeightIndex = _lodash2.default.fill(Array(tableWidth), 1);

    _lodash2.default.forEach(cells, (value, index1) => {
      if (!_lodash2.default.isNumber(config.columns[index1].width)) {
        throw new TypeError('column[index].width must be a number.');
      }

      if (!_lodash2.default.isBoolean(config.columns[index1].wrapWord)) {
        throw new TypeError('column[index].wrapWord must be a boolean.');
      }

      cellHeightIndex[index1] = (0, _calculateCellHeight2.default)(value, config.columns[index1].width, config.columns[index1].wrapWord);
    });

    rowSpanIndex.push(_lodash2.default.max(cellHeightIndex));
  });

  return rowSpanIndex;
};

/***/ }),

/***/ 48:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawBorderTop = exports.drawBorderJoin = exports.drawBorderBottom = exports.drawBorder = undefined;

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef drawBorder~parts
 * @property {string} left
 * @property {string} right
 * @property {string} body
 * @property {string} join
 */

/**
 * @param {number[]} columnSizeIndex
 * @param {drawBorder~parts} parts
 * @returns {string}
 */
const drawBorder = (columnSizeIndex, parts) => {
  const columns = _lodash2.default.map(columnSizeIndex, size => {
    return _lodash2.default.repeat(parts.body, size);
  }).join(parts.join);

  return parts.left + columns + parts.right + '\n';
};

/**
 * @typedef drawBorderTop~parts
 * @property {string} topLeft
 * @property {string} topRight
 * @property {string} topBody
 * @property {string} topJoin
 */

/**
 * @param {number[]} columnSizeIndex
 * @param {drawBorderTop~parts} parts
 * @returns {string}
 */
const drawBorderTop = (columnSizeIndex, parts) => {
  return drawBorder(columnSizeIndex, {
    body: parts.topBody,
    join: parts.topJoin,
    left: parts.topLeft,
    right: parts.topRight
  });
};

/**
 * @typedef drawBorderJoin~parts
 * @property {string} joinLeft
 * @property {string} joinRight
 * @property {string} joinBody
 * @property {string} joinJoin
 */

/**
 * @param {number[]} columnSizeIndex
 * @param {drawBorderJoin~parts} parts
 * @returns {string}
 */
const drawBorderJoin = (columnSizeIndex, parts) => {
  return drawBorder(columnSizeIndex, {
    body: parts.joinBody,
    join: parts.joinJoin,
    left: parts.joinLeft,
    right: parts.joinRight
  });
};

/**
 * @typedef drawBorderBottom~parts
 * @property {string} topLeft
 * @property {string} topRight
 * @property {string} topBody
 * @property {string} topJoin
 */

/**
 * @param {number[]} columnSizeIndex
 * @param {drawBorderBottom~parts} parts
 * @returns {string}
 */
const drawBorderBottom = (columnSizeIndex, parts) => {
  return drawBorder(columnSizeIndex, {
    body: parts.bottomBody,
    join: parts.bottomJoin,
    left: parts.bottomLeft,
    right: parts.bottomRight
  });
};

exports.drawBorder = drawBorder;
exports.drawBorderBottom = drawBorderBottom;
exports.drawBorderJoin = drawBorderJoin;
exports.drawBorderTop = drawBorderTop;

/***/ }),

/***/ 49:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * @typedef {Object} drawRow~border
 * @property {string} bodyLeft
 * @property {string} bodyRight
 * @property {string} bodyJoin
 */

/**
 * @param {number[]} columns
 * @param {drawRow~border} border
 * @returns {string}
 */
exports.default = (columns, border) => {
  return border.bodyLeft + columns.join(border.bodyJoin) + border.bodyRight + '\n';
};

/***/ }),

/***/ 50:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

var _wrapString = __webpack_require__(95);

var _wrapString2 = _interopRequireDefault(_wrapString);

var _wrapWord = __webpack_require__(55);

var _wrapWord2 = _interopRequireDefault(_wrapWord);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {Array} unmappedRows
 * @param {number[]} rowHeightIndex
 * @param {Object} config
 * @returns {Array}
 */
exports.default = (unmappedRows, rowHeightIndex, config) => {
  const tableWidth = unmappedRows[0].length;

  const mappedRows = unmappedRows.map((cells, index0) => {
    const rowHeight = _lodash2.default.times(rowHeightIndex[index0], () => {
      return _lodash2.default.fill(Array(tableWidth), '');
    });

    // rowHeight
    //     [{row index within rowSaw; index2}]
    //     [{cell index within a virtual row; index1}]

    _lodash2.default.forEach(cells, (value, index1) => {
      let chunkedValue;

      if (config.columns[index1].wrapWord) {
        chunkedValue = (0, _wrapWord2.default)(value, config.columns[index1].width);
      } else {
        chunkedValue = (0, _wrapString2.default)(value, config.columns[index1].width);
      }

      _lodash2.default.forEach(chunkedValue, (part, index2) => {
        rowHeight[index2][index1] = part;
      });
    });

    return rowHeight;
  });

  return _lodash2.default.flatten(mappedRows);
};

/***/ }),

/***/ 51:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {table~row[]} rows
 * @param {Object} config
 * @returns {table~row[]}
 */
exports.default = (rows, config) => {
  return _lodash2.default.map(rows, cells => {
    return _lodash2.default.map(cells, (value, index1) => {
      const column = config.columns[index1];

      return _lodash2.default.repeat(' ', column.paddingLeft) + value + _lodash2.default.repeat(' ', column.paddingRight);
    });
  });
};

/***/ }),

/***/ 52:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Casts all cell values to a string.
 *
 * @param {table~row[]} rows
 * @returns {table~row[]}
 */
exports.default = rows => {
  return rows.map(cells => {
    return cells.map(String);
  });
};

/***/ }),

/***/ 53:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @todo Make it work with ASCII content.
 * @param {table~row[]} rows
 * @param {Object} config
 * @returns {table~row[]}
 */
exports.default = (rows, config) => {
  return _lodash2.default.map(rows, cells => {
    return _lodash2.default.map(cells, (content, index) => {
      return _lodash2.default.truncate(content, {
        length: config.columns[index].truncate
      });
    });
  });
};

/***/ }),

/***/ 54:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var equal = __webpack_require__(96);
var validate = (function() {
  var pattern0 = new RegExp('^[0-9]+$');
  var refVal = [];
  var refVal1 = (function() {
    var pattern0 = new RegExp('^[0-9]+$');
    return function validate(data, dataPath, parentData, parentDataProperty, rootData) {
      'use strict';
      var vErrors = null;
      var errors = 0;
      if (rootData === undefined) rootData = data;
      if ((data && typeof data === "object" && !Array.isArray(data))) {
        var errs__0 = errors;
        var valid1 = true;
        for (var key0 in data) {
          var isAdditional0 = !(false || validate.schema.properties[key0]);
          if (isAdditional0) {
            valid1 = false;
            var err = {
              keyword: 'additionalProperties',
              dataPath: (dataPath || '') + "",
              schemaPath: '#/additionalProperties',
              params: {
                additionalProperty: '' + key0 + ''
              },
              message: 'should NOT have additional properties'
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
        }
        if (data.topBody !== undefined) {
          var errs_1 = errors;
          if (!refVal2(data.topBody, (dataPath || '') + '.topBody', data, 'topBody', rootData)) {
            if (vErrors === null) vErrors = refVal2.errors;
            else vErrors = vErrors.concat(refVal2.errors);
            errors = vErrors.length;
          }
          var valid1 = errors === errs_1;
        }
        if (data.topJoin !== undefined) {
          var errs_1 = errors;
          if (!refVal[2](data.topJoin, (dataPath || '') + '.topJoin', data, 'topJoin', rootData)) {
            if (vErrors === null) vErrors = refVal[2].errors;
            else vErrors = vErrors.concat(refVal[2].errors);
            errors = vErrors.length;
          }
          var valid1 = errors === errs_1;
        }
        if (data.topLeft !== undefined) {
          var errs_1 = errors;
          if (!refVal[2](data.topLeft, (dataPath || '') + '.topLeft', data, 'topLeft', rootData)) {
            if (vErrors === null) vErrors = refVal[2].errors;
            else vErrors = vErrors.concat(refVal[2].errors);
            errors = vErrors.length;
          }
          var valid1 = errors === errs_1;
        }
        if (data.topRight !== undefined) {
          var errs_1 = errors;
          if (!refVal[2](data.topRight, (dataPath || '') + '.topRight', data, 'topRight', rootData)) {
            if (vErrors === null) vErrors = refVal[2].errors;
            else vErrors = vErrors.concat(refVal[2].errors);
            errors = vErrors.length;
          }
          var valid1 = errors === errs_1;
        }
        if (data.bottomBody !== undefined) {
          var errs_1 = errors;
          if (!refVal[2](data.bottomBody, (dataPath || '') + '.bottomBody', data, 'bottomBody', rootData)) {
            if (vErrors === null) vErrors = refVal[2].errors;
            else vErrors = vErrors.concat(refVal[2].errors);
            errors = vErrors.length;
          }
          var valid1 = errors === errs_1;
        }
        if (data.bottomJoin !== undefined) {
          var errs_1 = errors;
          if (!refVal[2](data.bottomJoin, (dataPath || '') + '.bottomJoin', data, 'bottomJoin', rootData)) {
            if (vErrors === null) vErrors = refVal[2].errors;
            else vErrors = vErrors.concat(refVal[2].errors);
            errors = vErrors.length;
          }
          var valid1 = errors === errs_1;
        }
        if (data.bottomLeft !== undefined) {
          var errs_1 = errors;
          if (!refVal[2](data.bottomLeft, (dataPath || '') + '.bottomLeft', data, 'bottomLeft', rootData)) {
            if (vErrors === null) vErrors = refVal[2].errors;
            else vErrors = vErrors.concat(refVal[2].errors);
            errors = vErrors.length;
          }
          var valid1 = errors === errs_1;
        }
        if (data.bottomRight !== undefined) {
          var errs_1 = errors;
          if (!refVal[2](data.bottomRight, (dataPath || '') + '.bottomRight', data, 'bottomRight', rootData)) {
            if (vErrors === null) vErrors = refVal[2].errors;
            else vErrors = vErrors.concat(refVal[2].errors);
            errors = vErrors.length;
          }
          var valid1 = errors === errs_1;
        }
        if (data.bodyLeft !== undefined) {
          var errs_1 = errors;
          if (!refVal[2](data.bodyLeft, (dataPath || '') + '.bodyLeft', data, 'bodyLeft', rootData)) {
            if (vErrors === null) vErrors = refVal[2].errors;
            else vErrors = vErrors.concat(refVal[2].errors);
            errors = vErrors.length;
          }
          var valid1 = errors === errs_1;
        }
        if (data.bodyRight !== undefined) {
          var errs_1 = errors;
          if (!refVal[2](data.bodyRight, (dataPath || '') + '.bodyRight', data, 'bodyRight', rootData)) {
            if (vErrors === null) vErrors = refVal[2].errors;
            else vErrors = vErrors.concat(refVal[2].errors);
            errors = vErrors.length;
          }
          var valid1 = errors === errs_1;
        }
        if (data.bodyJoin !== undefined) {
          var errs_1 = errors;
          if (!refVal[2](data.bodyJoin, (dataPath || '') + '.bodyJoin', data, 'bodyJoin', rootData)) {
            if (vErrors === null) vErrors = refVal[2].errors;
            else vErrors = vErrors.concat(refVal[2].errors);
            errors = vErrors.length;
          }
          var valid1 = errors === errs_1;
        }
        if (data.joinBody !== undefined) {
          var errs_1 = errors;
          if (!refVal[2](data.joinBody, (dataPath || '') + '.joinBody', data, 'joinBody', rootData)) {
            if (vErrors === null) vErrors = refVal[2].errors;
            else vErrors = vErrors.concat(refVal[2].errors);
            errors = vErrors.length;
          }
          var valid1 = errors === errs_1;
        }
        if (data.joinLeft !== undefined) {
          var errs_1 = errors;
          if (!refVal[2](data.joinLeft, (dataPath || '') + '.joinLeft', data, 'joinLeft', rootData)) {
            if (vErrors === null) vErrors = refVal[2].errors;
            else vErrors = vErrors.concat(refVal[2].errors);
            errors = vErrors.length;
          }
          var valid1 = errors === errs_1;
        }
        if (data.joinRight !== undefined) {
          var errs_1 = errors;
          if (!refVal[2](data.joinRight, (dataPath || '') + '.joinRight', data, 'joinRight', rootData)) {
            if (vErrors === null) vErrors = refVal[2].errors;
            else vErrors = vErrors.concat(refVal[2].errors);
            errors = vErrors.length;
          }
          var valid1 = errors === errs_1;
        }
        if (data.joinJoin !== undefined) {
          var errs_1 = errors;
          if (!refVal[2](data.joinJoin, (dataPath || '') + '.joinJoin', data, 'joinJoin', rootData)) {
            if (vErrors === null) vErrors = refVal[2].errors;
            else vErrors = vErrors.concat(refVal[2].errors);
            errors = vErrors.length;
          }
          var valid1 = errors === errs_1;
        }
      } else {
        var err = {
          keyword: 'type',
          dataPath: (dataPath || '') + "",
          schemaPath: '#/type',
          params: {
            type: 'object'
          },
          message: 'should be object'
        };
        if (vErrors === null) vErrors = [err];
        else vErrors.push(err);
        errors++;
      }
      validate.errors = vErrors;
      return errors === 0;
    };
  })();
  refVal1.schema = {
    "type": "object",
    "properties": {
      "topBody": {
        "$ref": "#/definitions/border"
      },
      "topJoin": {
        "$ref": "#/definitions/border"
      },
      "topLeft": {
        "$ref": "#/definitions/border"
      },
      "topRight": {
        "$ref": "#/definitions/border"
      },
      "bottomBody": {
        "$ref": "#/definitions/border"
      },
      "bottomJoin": {
        "$ref": "#/definitions/border"
      },
      "bottomLeft": {
        "$ref": "#/definitions/border"
      },
      "bottomRight": {
        "$ref": "#/definitions/border"
      },
      "bodyLeft": {
        "$ref": "#/definitions/border"
      },
      "bodyRight": {
        "$ref": "#/definitions/border"
      },
      "bodyJoin": {
        "$ref": "#/definitions/border"
      },
      "joinBody": {
        "$ref": "#/definitions/border"
      },
      "joinLeft": {
        "$ref": "#/definitions/border"
      },
      "joinRight": {
        "$ref": "#/definitions/border"
      },
      "joinJoin": {
        "$ref": "#/definitions/border"
      }
    },
    "additionalProperties": false
  };
  refVal1.errors = null;
  refVal[1] = refVal1;
  var refVal2 = (function() {
    var pattern0 = new RegExp('^[0-9]+$');
    return function validate(data, dataPath, parentData, parentDataProperty, rootData) {
      'use strict';
      var vErrors = null;
      var errors = 0;
      if (typeof data !== "string") {
        var err = {
          keyword: 'type',
          dataPath: (dataPath || '') + "",
          schemaPath: '#/type',
          params: {
            type: 'string'
          },
          message: 'should be string'
        };
        if (vErrors === null) vErrors = [err];
        else vErrors.push(err);
        errors++;
      }
      validate.errors = vErrors;
      return errors === 0;
    };
  })();
  refVal2.schema = {
    "type": "string"
  };
  refVal2.errors = null;
  refVal[2] = refVal2;
  var refVal3 = (function() {
    var pattern0 = new RegExp('^[0-9]+$');
    return function validate(data, dataPath, parentData, parentDataProperty, rootData) {
      'use strict';
      var vErrors = null;
      var errors = 0;
      if (rootData === undefined) rootData = data;
      if ((data && typeof data === "object" && !Array.isArray(data))) {
        var errs__0 = errors;
        var valid1 = true;
        for (var key0 in data) {
          var isAdditional0 = !(false || pattern0.test(key0));
          if (isAdditional0) {
            valid1 = false;
            var err = {
              keyword: 'additionalProperties',
              dataPath: (dataPath || '') + "",
              schemaPath: '#/additionalProperties',
              params: {
                additionalProperty: '' + key0 + ''
              },
              message: 'should NOT have additional properties'
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
        }
        for (var key0 in data) {
          if (pattern0.test(key0)) {
            var errs_1 = errors;
            if (!refVal4(data[key0], (dataPath || '') + '[\'' + key0 + '\']', data, key0, rootData)) {
              if (vErrors === null) vErrors = refVal4.errors;
              else vErrors = vErrors.concat(refVal4.errors);
              errors = vErrors.length;
            }
            var valid1 = errors === errs_1;
          }
        }
      } else {
        var err = {
          keyword: 'type',
          dataPath: (dataPath || '') + "",
          schemaPath: '#/type',
          params: {
            type: 'object'
          },
          message: 'should be object'
        };
        if (vErrors === null) vErrors = [err];
        else vErrors.push(err);
        errors++;
      }
      validate.errors = vErrors;
      return errors === 0;
    };
  })();
  refVal3.schema = {
    "type": "object",
    "patternProperties": {
      "^[0-9]+$": {
        "$ref": "#/definitions/column"
      }
    },
    "additionalProperties": false
  };
  refVal3.errors = null;
  refVal[3] = refVal3;
  var refVal4 = (function() {
    var pattern0 = new RegExp('^[0-9]+$');
    return function validate(data, dataPath, parentData, parentDataProperty, rootData) {
      'use strict';
      var vErrors = null;
      var errors = 0;
      if ((data && typeof data === "object" && !Array.isArray(data))) {
        var errs__0 = errors;
        var valid1 = true;
        for (var key0 in data) {
          var isAdditional0 = !(false || validate.schema.properties[key0]);
          if (isAdditional0) {
            valid1 = false;
            var err = {
              keyword: 'additionalProperties',
              dataPath: (dataPath || '') + "",
              schemaPath: '#/additionalProperties',
              params: {
                additionalProperty: '' + key0 + ''
              },
              message: 'should NOT have additional properties'
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
        }
        var data1 = data.alignment;
        if (data1 !== undefined) {
          var errs_1 = errors;
          if (typeof data1 !== "string") {
            var err = {
              keyword: 'type',
              dataPath: (dataPath || '') + '.alignment',
              schemaPath: '#/properties/alignment/type',
              params: {
                type: 'string'
              },
              message: 'should be string'
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          var schema1 = validate.schema.properties.alignment.enum;
          var valid1;
          valid1 = false;
          for (var i1 = 0; i1 < schema1.length; i1++)
            if (equal(data1, schema1[i1])) {
              valid1 = true;
              break;
            }
          if (!valid1) {
            var err = {
              keyword: 'enum',
              dataPath: (dataPath || '') + '.alignment',
              schemaPath: '#/properties/alignment/enum',
              params: {
                allowedValues: schema1
              },
              message: 'should be equal to one of the allowed values'
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          var valid1 = errors === errs_1;
        }
        if (data.width !== undefined) {
          var errs_1 = errors;
          if (typeof data.width !== "number") {
            var err = {
              keyword: 'type',
              dataPath: (dataPath || '') + '.width',
              schemaPath: '#/properties/width/type',
              params: {
                type: 'number'
              },
              message: 'should be number'
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          var valid1 = errors === errs_1;
        }
        if (data.wrapWord !== undefined) {
          var errs_1 = errors;
          if (typeof data.wrapWord !== "boolean") {
            var err = {
              keyword: 'type',
              dataPath: (dataPath || '') + '.wrapWord',
              schemaPath: '#/properties/wrapWord/type',
              params: {
                type: 'boolean'
              },
              message: 'should be boolean'
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          var valid1 = errors === errs_1;
        }
        if (data.truncate !== undefined) {
          var errs_1 = errors;
          if (typeof data.truncate !== "number") {
            var err = {
              keyword: 'type',
              dataPath: (dataPath || '') + '.truncate',
              schemaPath: '#/properties/truncate/type',
              params: {
                type: 'number'
              },
              message: 'should be number'
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          var valid1 = errors === errs_1;
        }
        if (data.paddingLeft !== undefined) {
          var errs_1 = errors;
          if (typeof data.paddingLeft !== "number") {
            var err = {
              keyword: 'type',
              dataPath: (dataPath || '') + '.paddingLeft',
              schemaPath: '#/properties/paddingLeft/type',
              params: {
                type: 'number'
              },
              message: 'should be number'
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          var valid1 = errors === errs_1;
        }
        if (data.paddingRight !== undefined) {
          var errs_1 = errors;
          if (typeof data.paddingRight !== "number") {
            var err = {
              keyword: 'type',
              dataPath: (dataPath || '') + '.paddingRight',
              schemaPath: '#/properties/paddingRight/type',
              params: {
                type: 'number'
              },
              message: 'should be number'
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          }
          var valid1 = errors === errs_1;
        }
      } else {
        var err = {
          keyword: 'type',
          dataPath: (dataPath || '') + "",
          schemaPath: '#/type',
          params: {
            type: 'object'
          },
          message: 'should be object'
        };
        if (vErrors === null) vErrors = [err];
        else vErrors.push(err);
        errors++;
      }
      validate.errors = vErrors;
      return errors === 0;
    };
  })();
  refVal4.schema = {
    "type": "object",
    "properties": {
      "alignment": {
        "type": "string",
        "enum": ["left", "right", "center"]
      },
      "width": {
        "type": "number"
      },
      "wrapWord": {
        "type": "boolean"
      },
      "truncate": {
        "type": "number"
      },
      "paddingLeft": {
        "type": "number"
      },
      "paddingRight": {
        "type": "number"
      }
    },
    "additionalProperties": false
  };
  refVal4.errors = null;
  refVal[4] = refVal4;
  return function validate(data, dataPath, parentData, parentDataProperty, rootData) {
    'use strict'; /*# sourceURL=config.json */
    var vErrors = null;
    var errors = 0;
    if (rootData === undefined) rootData = data;
    if ((data && typeof data === "object" && !Array.isArray(data))) {
      var errs__0 = errors;
      var valid1 = true;
      for (var key0 in data) {
        var isAdditional0 = !(false || key0 == 'border' || key0 == 'columns' || key0 == 'columnDefault' || key0 == 'drawHorizontalLine');
        if (isAdditional0) {
          valid1 = false;
          var err = {
            keyword: 'additionalProperties',
            dataPath: (dataPath || '') + "",
            schemaPath: '#/additionalProperties',
            params: {
              additionalProperty: '' + key0 + ''
            },
            message: 'should NOT have additional properties'
          };
          if (vErrors === null) vErrors = [err];
          else vErrors.push(err);
          errors++;
        }
      }
      if (data.border !== undefined) {
        var errs_1 = errors;
        if (!refVal1(data.border, (dataPath || '') + '.border', data, 'border', rootData)) {
          if (vErrors === null) vErrors = refVal1.errors;
          else vErrors = vErrors.concat(refVal1.errors);
          errors = vErrors.length;
        }
        var valid1 = errors === errs_1;
      }
      if (data.columns !== undefined) {
        var errs_1 = errors;
        if (!refVal3(data.columns, (dataPath || '') + '.columns', data, 'columns', rootData)) {
          if (vErrors === null) vErrors = refVal3.errors;
          else vErrors = vErrors.concat(refVal3.errors);
          errors = vErrors.length;
        }
        var valid1 = errors === errs_1;
      }
      if (data.columnDefault !== undefined) {
        var errs_1 = errors;
        if (!refVal[4](data.columnDefault, (dataPath || '') + '.columnDefault', data, 'columnDefault', rootData)) {
          if (vErrors === null) vErrors = refVal[4].errors;
          else vErrors = vErrors.concat(refVal[4].errors);
          errors = vErrors.length;
        }
        var valid1 = errors === errs_1;
      }
      if (data.drawHorizontalLine !== undefined) {
        var errs_1 = errors;
        var errs__1 = errors;
        var valid1;
        valid1 = typeof data.drawHorizontalLine == "function";
        if (!valid1) {
          if (errs__1 == errors) {
            var err = {
              keyword: 'typeof',
              dataPath: (dataPath || '') + '.drawHorizontalLine',
              schemaPath: '#/properties/drawHorizontalLine/typeof',
              params: {
                keyword: 'typeof'
              },
              message: 'should pass "typeof" keyword validation'
            };
            if (vErrors === null) vErrors = [err];
            else vErrors.push(err);
            errors++;
          } else {
            for (var i1 = errs__1; i1 < errors; i1++) {
              var ruleErr1 = vErrors[i1];
              if (ruleErr1.dataPath === undefined) ruleErr1.dataPath = (dataPath || '') + '.drawHorizontalLine';
              if (ruleErr1.schemaPath === undefined) {
                ruleErr1.schemaPath = "#/properties/drawHorizontalLine/typeof";
              }
            }
          }
        }
        var valid1 = errors === errs_1;
      }
    } else {
      var err = {
        keyword: 'type',
        dataPath: (dataPath || '') + "",
        schemaPath: '#/type',
        params: {
          type: 'object'
        },
        message: 'should be object'
      };
      if (vErrors === null) vErrors = [err];
      else vErrors.push(err);
      errors++;
    }
    validate.errors = vErrors;
    return errors === 0;
  };
})();
validate.schema = {
  "$id": "config.json",
  "$schema": "http://json-schema.org/draft-06/schema#",
  "type": "object",
  "properties": {
    "border": {
      "$ref": "#/definitions/borders"
    },
    "columns": {
      "$ref": "#/definitions/columns"
    },
    "columnDefault": {
      "$ref": "#/definitions/column"
    },
    "drawHorizontalLine": {
      "typeof": "function"
    }
  },
  "additionalProperties": false,
  "definitions": {
    "columns": {
      "type": "object",
      "patternProperties": {
        "^[0-9]+$": {
          "$ref": "#/definitions/column"
        }
      },
      "additionalProperties": false
    },
    "column": {
      "type": "object",
      "properties": {
        "alignment": {
          "type": "string",
          "enum": ["left", "right", "center"]
        },
        "width": {
          "type": "number"
        },
        "wrapWord": {
          "type": "boolean"
        },
        "truncate": {
          "type": "number"
        },
        "paddingLeft": {
          "type": "number"
        },
        "paddingRight": {
          "type": "number"
        }
      },
      "additionalProperties": false
    },
    "borders": {
      "type": "object",
      "properties": {
        "topBody": {
          "$ref": "#/definitions/border"
        },
        "topJoin": {
          "$ref": "#/definitions/border"
        },
        "topLeft": {
          "$ref": "#/definitions/border"
        },
        "topRight": {
          "$ref": "#/definitions/border"
        },
        "bottomBody": {
          "$ref": "#/definitions/border"
        },
        "bottomJoin": {
          "$ref": "#/definitions/border"
        },
        "bottomLeft": {
          "$ref": "#/definitions/border"
        },
        "bottomRight": {
          "$ref": "#/definitions/border"
        },
        "bodyLeft": {
          "$ref": "#/definitions/border"
        },
        "bodyRight": {
          "$ref": "#/definitions/border"
        },
        "bodyJoin": {
          "$ref": "#/definitions/border"
        },
        "joinBody": {
          "$ref": "#/definitions/border"
        },
        "joinLeft": {
          "$ref": "#/definitions/border"
        },
        "joinRight": {
          "$ref": "#/definitions/border"
        },
        "joinJoin": {
          "$ref": "#/definitions/border"
        }
      },
      "additionalProperties": false
    },
    "border": {
      "type": "string"
    }
  }
};
validate.errors = null;
module.exports = validate;

/***/ }),

/***/ 55:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

var _sliceAnsi = __webpack_require__(41);

var _sliceAnsi2 = _interopRequireDefault(_sliceAnsi);

var _stringWidth = __webpack_require__(6);

var _stringWidth2 = _interopRequireDefault(_stringWidth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {string} input
 * @param {number} size
 * @returns {Array}
 */
exports.default = (input, size) => {
  let subject;

  subject = input;

  const chunks = [];

  // https://regex101.com/r/gY5kZ1/1
  const re = new RegExp('(^.{1,' + size + '}(\\s+|$))|(^.{1,' + (size - 1) + '}(\\\\|/|_|\\.|,|;|-))');

  do {
    let chunk;

    chunk = subject.match(re);

    if (chunk) {
      chunk = chunk[0];

      subject = (0, _sliceAnsi2.default)(subject, (0, _stringWidth2.default)(chunk));

      chunk = _lodash2.default.trim(chunk);
    } else {
      chunk = (0, _sliceAnsi2.default)(subject, 0, size);
      subject = (0, _sliceAnsi2.default)(subject, size);
    }

    chunks.push(chunk);
  } while ((0, _stringWidth2.default)(subject));

  return chunks;
};

/***/ }),

/***/ 6:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const stripAnsi = __webpack_require__(99);
const isFullwidthCodePoint = __webpack_require__(98);

module.exports = str => {
	if (typeof str !== 'string' || str.length === 0) {
		return 0;
	}

	str = stripAnsi(str);

	let width = 0;

	for (let i = 0; i < str.length; i++) {
		const code = str.codePointAt(i);

		// Ignore control characters
		if (code <= 0x1F || (code >= 0x7F && code <= 0x9F)) {
			continue;
		}

		// Ignore combining characters
		if (code >= 0x300 && code <= 0x36F) {
			continue;
		}

		// Surrogates
		if (code > 0xFFFF) {
			i++;
		}

		width += isFullwidthCodePoint(code) ? 2 : 1;
	}

	return width;
};


/***/ }),

/***/ 65:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function equal(a, b) {
  if (a === b) return true;

  var arrA = Array.isArray(a)
    , arrB = Array.isArray(b)
    , i;

  if (arrA && arrB) {
    if (a.length != b.length) return false;
    for (i = 0; i < a.length; i++)
      if (!equal(a[i], b[i])) return false;
    return true;
  }

  if (arrA != arrB) return false;

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    var keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length) return false;

    var dateA = a instanceof Date
      , dateB = b instanceof Date;
    if (dateA && dateB) return a.getTime() == b.getTime();
    if (dateA != dateB) return false;

    var regexpA = a instanceof RegExp
      , regexpB = b instanceof RegExp;
    if (regexpA && regexpB) return a.toString() == b.toString();
    if (regexpA != regexpB) return false;

    for (i = 0; i < keys.length; i++)
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = 0; i < keys.length; i++)
      if(!equal(a[keys[i]], b[keys[i]])) return false;

    return true;
  }

  return false;
};


/***/ }),

/***/ 83:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* eslint-disable yoda */
module.exports = x => {
	if (Number.isNaN(x)) {
		return false;
	}

	// code points are derived from:
	// http://www.unix.org/Public/UNIDATA/EastAsianWidth.txt
	if (
		x >= 0x1100 && (
			x <= 0x115f ||  // Hangul Jamo
			x === 0x2329 || // LEFT-POINTING ANGLE BRACKET
			x === 0x232a || // RIGHT-POINTING ANGLE BRACKET
			// CJK Radicals Supplement .. Enclosed CJK Letters and Months
			(0x2e80 <= x && x <= 0x3247 && x !== 0x303f) ||
			// Enclosed CJK Letters and Months .. CJK Unified Ideographs Extension A
			(0x3250 <= x && x <= 0x4dbf) ||
			// CJK Unified Ideographs .. Yi Radicals
			(0x4e00 <= x && x <= 0xa4c6) ||
			// Hangul Jamo Extended-A
			(0xa960 <= x && x <= 0xa97c) ||
			// Hangul Syllables
			(0xac00 <= x && x <= 0xd7a3) ||
			// CJK Compatibility Ideographs
			(0xf900 <= x && x <= 0xfaff) ||
			// Vertical Forms
			(0xfe10 <= x && x <= 0xfe19) ||
			// CJK Compatibility Forms .. Small Form Variants
			(0xfe30 <= x && x <= 0xfe6b) ||
			// Halfwidth and Fullwidth Forms
			(0xff01 <= x && x <= 0xff60) ||
			(0xffe0 <= x && x <= 0xffe6) ||
			// Kana Supplement
			(0x1b000 <= x && x <= 0x1b001) ||
			// Enclosed Ideographic Supplement
			(0x1f200 <= x && x <= 0x1f251) ||
			// CJK Unified Ideographs Extension B .. Tertiary Ideographic Plane
			(0x20000 <= x && x <= 0x3fffd)
		)
	) {
		return true;
	}

	return false;
};


/***/ }),

/***/ 85:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

var _stringWidth = __webpack_require__(6);

var _stringWidth2 = _interopRequireDefault(_stringWidth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const alignments = ['left', 'right', 'center'];

/**
 * @param {string} subject
 * @param {number} width
 * @returns {string}
 */
const alignLeft = (subject, width) => {
  return subject + _lodash2.default.repeat(' ', width);
};

/**
 * @param {string} subject
 * @param {number} width
 * @returns {string}
 */
const alignRight = (subject, width) => {
  return _lodash2.default.repeat(' ', width) + subject;
};

/**
 * @param {string} subject
 * @param {number} width
 * @returns {string}
 */
const alignCenter = (subject, width) => {
  let halfWidth;

  halfWidth = width / 2;

  if (halfWidth % 2 === 0) {
    return _lodash2.default.repeat(' ', halfWidth) + subject + _lodash2.default.repeat(' ', halfWidth);
  } else {
    halfWidth = _lodash2.default.floor(halfWidth);

    return _lodash2.default.repeat(' ', halfWidth) + subject + _lodash2.default.repeat(' ', halfWidth + 1);
  }
};

/**
 * Pads a string to the left and/or right to position the subject
 * text in a desired alignment within a container.
 *
 * @param {string} subject
 * @param {number} containerWidth
 * @param {string} alignment One of the valid options (left, right, center).
 * @returns {string}
 */

exports.default = (subject, containerWidth, alignment) => {
  if (!_lodash2.default.isString(subject)) {
    throw new TypeError('Subject parameter value must be a string.');
  }

  if (!_lodash2.default.isNumber(containerWidth)) {
    throw new TypeError('Container width parameter value must be a number.');
  }

  const subjectWidth = (0, _stringWidth2.default)(subject);

  if (subjectWidth > containerWidth) {
    // console.log('subjectWidth', subjectWidth, 'containerWidth', containerWidth, 'subject', subject);

    throw new Error('Subject parameter value width cannot be greater than the container width.');
  }

  if (!_lodash2.default.isString(alignment)) {
    throw new TypeError('Alignment parameter value must be a string.');
  }

  if (alignments.indexOf(alignment) === -1) {
    throw new Error('Alignment parameter value must be a known alignment parameter value (left, right, center).');
  }

  if (subjectWidth === 0) {
    return _lodash2.default.repeat(' ', containerWidth);
  }

  const availableWidth = containerWidth - subjectWidth;

  if (alignment === 'left') {
    return alignLeft(subject, availableWidth);
  }

  if (alignment === 'right') {
    return alignRight(subject, availableWidth);
  }

  return alignCenter(subject, availableWidth);
};

/***/ }),

/***/ 86:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

var _stringWidth = __webpack_require__(6);

var _stringWidth2 = _interopRequireDefault(_stringWidth);

var _wrapWord = __webpack_require__(55);

var _wrapWord2 = _interopRequireDefault(_wrapWord);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {string} value
 * @param {number} columnWidth
 * @param {boolean} useWrapWord
 * @returns {number}
 */
exports.default = function (value, columnWidth) {
  let useWrapWord = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (!_lodash2.default.isString(value)) {
    throw new TypeError('Value must be a string.');
  }

  if (!_lodash2.default.isInteger(columnWidth)) {
    throw new TypeError('Column width must be an integer.');
  }

  if (columnWidth < 1) {
    throw new Error('Column width must be greater than 0.');
  }

  if (useWrapWord) {
    return (0, _wrapWord2.default)(value, columnWidth).length;
  }

  return _lodash2.default.ceil((0, _stringWidth2.default)(value) / columnWidth);
};

/***/ }),

/***/ 87:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

var _calculateCellWidthIndex = __webpack_require__(46);

var _calculateCellWidthIndex2 = _interopRequireDefault(_calculateCellWidthIndex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Produces an array of values that describe the largest value length (width) in every column.
 *
 * @param {Array[]} rows
 * @returns {number[]}
 */
exports.default = rows => {
  if (!rows[0]) {
    throw new Error('Dataset must have at least one row.');
  }

  const columns = _lodash2.default.fill(Array(rows[0].length), 0);

  _lodash2.default.forEach(rows, row => {
    const columnWidthIndex = (0, _calculateCellWidthIndex2.default)(row);

    _lodash2.default.forEach(columnWidthIndex, (valueWidth, index0) => {
      if (columns[index0] < valueWidth) {
        columns[index0] = valueWidth;
      }
    });
  });

  return columns;
};

/***/ }),

/***/ 88:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

var _makeStreamConfig = __webpack_require__(92);

var _makeStreamConfig2 = _interopRequireDefault(_makeStreamConfig);

var _drawRow = __webpack_require__(49);

var _drawRow2 = _interopRequireDefault(_drawRow);

var _drawBorder = __webpack_require__(48);

var _stringifyTableData = __webpack_require__(52);

var _stringifyTableData2 = _interopRequireDefault(_stringifyTableData);

var _truncateTableData = __webpack_require__(53);

var _truncateTableData2 = _interopRequireDefault(_truncateTableData);

var _mapDataUsingRowHeightIndex = __webpack_require__(50);

var _mapDataUsingRowHeightIndex2 = _interopRequireDefault(_mapDataUsingRowHeightIndex);

var _alignTableData = __webpack_require__(45);

var _alignTableData2 = _interopRequireDefault(_alignTableData);

var _padTableData = __webpack_require__(51);

var _padTableData2 = _interopRequireDefault(_padTableData);

var _calculateRowHeightIndex = __webpack_require__(47);

var _calculateRowHeightIndex2 = _interopRequireDefault(_calculateRowHeightIndex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {Array} data
 * @param {Object} config
 * @returns {Array}
 */
const prepareData = (data, config) => {
  let rows;

  rows = (0, _stringifyTableData2.default)(data);

  rows = (0, _truncateTableData2.default)(data, config);

  const rowHeightIndex = (0, _calculateRowHeightIndex2.default)(rows, config);

  rows = (0, _mapDataUsingRowHeightIndex2.default)(rows, rowHeightIndex, config);
  rows = (0, _alignTableData2.default)(rows, config);
  rows = (0, _padTableData2.default)(rows, config);

  return rows;
};

/**
 * @param {string[]} row
 * @param {number[]} columnWidthIndex
 * @param {Object} config
 * @returns {undefined}
 */
const create = (row, columnWidthIndex, config) => {
  const rows = prepareData([row], config);

  const body = _lodash2.default.map(rows, literalRow => {
    return (0, _drawRow2.default)(literalRow, config.border);
  }).join('');

  let output;

  output = '';

  output += (0, _drawBorder.drawBorderTop)(columnWidthIndex, config.border);
  output += body;
  output += (0, _drawBorder.drawBorderBottom)(columnWidthIndex, config.border);

  output = _lodash2.default.trimEnd(output);

  process.stdout.write(output);
};

/**
 * @param {string[]} row
 * @param {number[]} columnWidthIndex
 * @param {Object} config
 * @returns {undefined}
 */
const append = (row, columnWidthIndex, config) => {
  const rows = prepareData([row], config);

  const body = _lodash2.default.map(rows, literalRow => {
    return (0, _drawRow2.default)(literalRow, config.border);
  }).join('');

  let output;

  output = '\r\u001B[K';

  output += (0, _drawBorder.drawBorderJoin)(columnWidthIndex, config.border);
  output += body;
  output += (0, _drawBorder.drawBorderBottom)(columnWidthIndex, config.border);

  output = _lodash2.default.trimEnd(output);

  process.stdout.write(output);
};

/**
 * @param {Object} userConfig
 * @returns {Object}
 */

exports.default = function () {
  let userConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  const config = (0, _makeStreamConfig2.default)(userConfig);

  const columnWidthIndex = _lodash2.default.mapValues(config.columns, column => {
    return column.width + column.paddingLeft + column.paddingRight;
  });

  let empty;

  empty = true;

  return {
    /**
     * @param {string[]} row
     * @returns {undefined}
     */
    write: row => {
      if (row.length !== config.columnCount) {
        throw new Error('Row cell count does not match the config.columnCount.');
      }

      if (empty) {
        empty = false;

        return create(row, columnWidthIndex, config);
      } else {
        return append(row, columnWidthIndex, config);
      }
    }
  };
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ }),

/***/ 89:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

var _drawBorder = __webpack_require__(48);

var _drawRow = __webpack_require__(49);

var _drawRow2 = _interopRequireDefault(_drawRow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {Array} rows
 * @param {Object} border
 * @param {Array} columnSizeIndex
 * @param {Array} rowSpanIndex
 * @param {Function} drawHorizontalLine
 * @returns {string}
 */
exports.default = (rows, border, columnSizeIndex, rowSpanIndex, drawHorizontalLine) => {
  let output;
  let realRowIndex;
  let rowHeight;

  const rowCount = rows.length;

  realRowIndex = 0;

  output = '';

  if (drawHorizontalLine(realRowIndex, rowCount)) {
    output += (0, _drawBorder.drawBorderTop)(columnSizeIndex, border);
  }

  _lodash2.default.forEach(rows, (row, index0) => {
    output += (0, _drawRow2.default)(row, border);

    if (!rowHeight) {
      rowHeight = rowSpanIndex[realRowIndex];

      realRowIndex++;
    }

    rowHeight--;

    if (rowHeight === 0 && index0 !== rowCount - 1 && drawHorizontalLine(realRowIndex, rowCount)) {
      output += (0, _drawBorder.drawBorderJoin)(columnSizeIndex, border);
    }
  });

  if (drawHorizontalLine(realRowIndex, rowCount)) {
    output += (0, _drawBorder.drawBorderBottom)(columnSizeIndex, border);
  }

  return output;
};

/***/ }),

/***/ 90:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBorderCharacters = exports.createStream = exports.table = undefined;

var _table = __webpack_require__(93);

var _table2 = _interopRequireDefault(_table);

var _createStream = __webpack_require__(88);

var _createStream2 = _interopRequireDefault(_createStream);

var _getBorderCharacters = __webpack_require__(20);

var _getBorderCharacters2 = _interopRequireDefault(_getBorderCharacters);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.table = _table2.default;
exports.createStream = _createStream2.default;
exports.getBorderCharacters = _getBorderCharacters2.default;

/***/ }),

/***/ 91:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

var _getBorderCharacters = __webpack_require__(20);

var _getBorderCharacters2 = _interopRequireDefault(_getBorderCharacters);

var _validateConfig = __webpack_require__(54);

var _validateConfig2 = _interopRequireDefault(_validateConfig);

var _calculateMaximumColumnWidthIndex = __webpack_require__(87);

var _calculateMaximumColumnWidthIndex2 = _interopRequireDefault(_calculateMaximumColumnWidthIndex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Merges user provided border characters with the default border ("honeywell") characters.
 *
 * @param {Object} border
 * @returns {Object}
 */
const makeBorder = function makeBorder() {
  let border = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return Object.assign({}, (0, _getBorderCharacters2.default)('honeywell'), border);
};

/**
 * Creates a configuration for every column using default
 * values for the missing configuration properties.
 *
 * @param {Array[]} rows
 * @param {Object} columns
 * @param {Object} columnDefault
 * @returns {Object}
 */
const makeColumns = function makeColumns(rows) {
  let columns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let columnDefault = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  const maximumColumnWidthIndex = (0, _calculateMaximumColumnWidthIndex2.default)(rows);

  _lodash2.default.times(rows[0].length, index => {
    if (_lodash2.default.isUndefined(columns[index])) {
      columns[index] = {};
    }

    columns[index] = _lodash2.default.assign({
      alignment: 'left',
      paddingLeft: 1,
      paddingRight: 1,
      truncate: Infinity,
      width: maximumColumnWidthIndex[index],
      wrapWord: false
    }, columnDefault, columns[index]);
  });

  return columns;
};

/**
 * Makes a new configuration object out of the userConfig object
 * using default values for the missing configuration properties.
 *
 * @param {Array[]} rows
 * @param {Object} userConfig
 * @returns {Object}
 */

exports.default = function (rows) {
  let userConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  (0, _validateConfig2.default)('config.json', userConfig);

  const config = _lodash2.default.cloneDeep(userConfig);

  config.border = makeBorder(config.border);
  config.columns = makeColumns(rows, config.columns, config.columnDefault);

  if (!config.drawHorizontalLine) {
    /**
         * @returns {boolean}
         */
    config.drawHorizontalLine = () => {
      return true;
    };
  }

  return config;
};

/***/ }),

/***/ 92:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

var _getBorderCharacters = __webpack_require__(20);

var _getBorderCharacters2 = _interopRequireDefault(_getBorderCharacters);

var _validateConfig = __webpack_require__(54);

var _validateConfig2 = _interopRequireDefault(_validateConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Merges user provided border characters with the default border ("honeywell") characters.
 *
 * @param {Object} border
 * @returns {Object}
 */
const makeBorder = function makeBorder() {
  let border = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return Object.assign({}, (0, _getBorderCharacters2.default)('honeywell'), border);
};

/**
 * Creates a configuration for every column using default
 * values for the missing configuration properties.
 *
 * @param {number} columnCount
 * @param {Object} columns
 * @param {Object} columnDefault
 * @returns {Object}
 */
const makeColumns = function makeColumns(columnCount) {
  let columns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let columnDefault = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  _lodash2.default.times(columnCount, index => {
    if (_lodash2.default.isUndefined(columns[index])) {
      columns[index] = {};
    }

    columns[index] = Object.assign({
      alignment: 'left',
      paddingLeft: 1,
      paddingRight: 1,
      truncate: Infinity,
      wrapWord: false
    }, columnDefault, columns[index]);
  });

  return columns;
};

/**
 * @typedef {Object} columnConfig
 * @property {string} alignment
 * @property {number} width
 * @property {number} truncate
 * @property {number} paddingLeft
 * @property {number} paddingRight
 */

/**
 * @typedef {Object} streamConfig
 * @property {columnConfig} columnDefault
 * @property {Object} border
 * @property {columnConfig[]}
 * @property {number} columnCount Number of columns in the table (required).
 */

/**
 * Makes a new configuration object out of the userConfig object
 * using default values for the missing configuration properties.
 *
 * @param {streamConfig} userConfig
 * @returns {Object}
 */

exports.default = function () {
  let userConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  (0, _validateConfig2.default)('streamConfig.json', userConfig);

  const config = _lodash2.default.cloneDeep(userConfig);

  if (!config.columnDefault || !config.columnDefault.width) {
    throw new Error('Must provide config.columnDefault.width when creating a stream.');
  }

  if (!config.columnCount) {
    throw new Error('Must provide config.columnCount.');
  }

  config.border = makeBorder(config.border);
  config.columns = makeColumns(config.columnCount, config.columns, config.columnDefault);

  return config;
};

/***/ }),

/***/ 93:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _drawTable = __webpack_require__(89);

var _drawTable2 = _interopRequireDefault(_drawTable);

var _calculateCellWidthIndex = __webpack_require__(46);

var _calculateCellWidthIndex2 = _interopRequireDefault(_calculateCellWidthIndex);

var _makeConfig = __webpack_require__(91);

var _makeConfig2 = _interopRequireDefault(_makeConfig);

var _calculateRowHeightIndex = __webpack_require__(47);

var _calculateRowHeightIndex2 = _interopRequireDefault(_calculateRowHeightIndex);

var _mapDataUsingRowHeightIndex = __webpack_require__(50);

var _mapDataUsingRowHeightIndex2 = _interopRequireDefault(_mapDataUsingRowHeightIndex);

var _alignTableData = __webpack_require__(45);

var _alignTableData2 = _interopRequireDefault(_alignTableData);

var _padTableData = __webpack_require__(51);

var _padTableData2 = _interopRequireDefault(_padTableData);

var _validateTableData = __webpack_require__(94);

var _validateTableData2 = _interopRequireDefault(_validateTableData);

var _stringifyTableData = __webpack_require__(52);

var _stringifyTableData2 = _interopRequireDefault(_stringifyTableData);

var _truncateTableData = __webpack_require__(53);

var _truncateTableData2 = _interopRequireDefault(_truncateTableData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {string} table~cell
 */

/**
 * @typedef {table~cell[]} table~row
 */

/**
 * @typedef {Object} table~columns
 * @property {string} alignment Cell content alignment (enum: left, center, right) (default: left).
 * @property {number} width Column width (default: auto).
 * @property {number} truncate Number of characters are which the content will be truncated (default: Infinity).
 * @property {number} paddingLeft Cell content padding width left (default: 1).
 * @property {number} paddingRight Cell content padding width right (default: 1).
 */

/**
 * @typedef {Object} table~border
 * @property {string} topBody
 * @property {string} topJoin
 * @property {string} topLeft
 * @property {string} topRight
 * @property {string} bottomBody
 * @property {string} bottomJoin
 * @property {string} bottomLeft
 * @property {string} bottomRight
 * @property {string} bodyLeft
 * @property {string} bodyRight
 * @property {string} bodyJoin
 * @property {string} joinBody
 * @property {string} joinLeft
 * @property {string} joinRight
 * @property {string} joinJoin
 */

/**
 * Used to tell whether to draw a horizontal line.
 * This callback is called for each non-content line of the table.
 * The default behavior is to always return true.
 *
 * @typedef {Function} drawHorizontalLine
 * @param {number} index
 * @param {number} size
 * @returns {boolean}
 */

/**
 * @typedef {Object} table~config
 * @property {table~border} border
 * @property {table~columns[]} columns Column specific configuration.
 * @property {table~columns} columnDefault Default values for all columns. Column specific settings overwrite the default values.
 * @property {table~drawHorizontalLine} drawHorizontalLine
 */

/**
 * Generates a text table.
 *
 * @param {table~row[]} data
 * @param {table~config} userConfig
 * @returns {string}
 */
exports.default = function (data) {
  let userConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  let rows;

  (0, _validateTableData2.default)(data);

  rows = (0, _stringifyTableData2.default)(data);

  const config = (0, _makeConfig2.default)(rows, userConfig);

  rows = (0, _truncateTableData2.default)(data, config);

  const rowHeightIndex = (0, _calculateRowHeightIndex2.default)(rows, config);

  rows = (0, _mapDataUsingRowHeightIndex2.default)(rows, rowHeightIndex, config);
  rows = (0, _alignTableData2.default)(rows, config);
  rows = (0, _padTableData2.default)(rows, config);

  const cellWidthIndex = (0, _calculateCellWidthIndex2.default)(rows[0]);

  return (0, _drawTable2.default)(rows, config.border, cellWidthIndex, rowHeightIndex, config.drawHorizontalLine);
};

/***/ }),

/***/ 94:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * @typedef {string} cell
 */

/**
 * @typedef {cell[]} validateData~column
 */

/**
 * @param {column[]} rows
 * @returns {undefined}
 */
exports.default = rows => {
  if (!Array.isArray(rows)) {
    throw new TypeError('Table data must be an array.');
  }

  if (rows.length === 0) {
    throw new Error('Table must define at least one row.');
  }

  if (rows[0].length === 0) {
    throw new Error('Table must define at least one column.');
  }

  const columnNumber = rows[0].length;

  for (const cells of rows) {
    if (!Array.isArray(cells)) {
      throw new TypeError('Table row data must be an array.');
    }

    if (cells.length !== columnNumber) {
      throw new Error('Table must have a consistent number of cells.');
    }

    // @todo Make an exception for newline characters.
    // @see https://github.com/gajus/table/issues/9
    for (const cell of cells) {
      if (/[\u0001-\u001A]/.test(cell)) {
        throw new Error('Table data must not contain control characters.');
      }
    }
  }
};

/***/ }),

/***/ 95:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = __webpack_require__(1);

var _lodash2 = _interopRequireDefault(_lodash);

var _sliceAnsi = __webpack_require__(41);

var _sliceAnsi2 = _interopRequireDefault(_sliceAnsi);

var _stringWidth = __webpack_require__(6);

var _stringWidth2 = _interopRequireDefault(_stringWidth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creates an array of strings split into groups the length of size.
 * This function works with strings that contain ASCII characters.
 *
 * wrapText is different from would-be "chunk" implementation
 * in that whitespace characters that occur on a chunk size limit are trimmed.
 *
 * @param {string} subject
 * @param {number} size
 * @returns {Array}
 */
exports.default = (subject, size) => {
  let subjectSlice;

  subjectSlice = subject;

  const chunks = [];

  do {
    chunks.push((0, _sliceAnsi2.default)(subjectSlice, 0, size));

    subjectSlice = _lodash2.default.trim((0, _sliceAnsi2.default)(subjectSlice, size));
  } while ((0, _stringWidth2.default)(subjectSlice));

  return chunks;
};

/***/ }),

/***/ 96:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(65);


/***/ }),

/***/ 97:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = () => {
	const pattern = [
		'[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[a-zA-Z\\d]*)*)?\\u0007)',
		'(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))'
	].join('|');

	return new RegExp(pattern, 'g');
};


/***/ }),

/***/ 98:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* eslint-disable yoda */
module.exports = x => {
	if (Number.isNaN(x)) {
		return false;
	}

	// code points are derived from:
	// http://www.unix.org/Public/UNIDATA/EastAsianWidth.txt
	if (
		x >= 0x1100 && (
			x <= 0x115f ||  // Hangul Jamo
			x === 0x2329 || // LEFT-POINTING ANGLE BRACKET
			x === 0x232a || // RIGHT-POINTING ANGLE BRACKET
			// CJK Radicals Supplement .. Enclosed CJK Letters and Months
			(0x2e80 <= x && x <= 0x3247 && x !== 0x303f) ||
			// Enclosed CJK Letters and Months .. CJK Unified Ideographs Extension A
			(0x3250 <= x && x <= 0x4dbf) ||
			// CJK Unified Ideographs .. Yi Radicals
			(0x4e00 <= x && x <= 0xa4c6) ||
			// Hangul Jamo Extended-A
			(0xa960 <= x && x <= 0xa97c) ||
			// Hangul Syllables
			(0xac00 <= x && x <= 0xd7a3) ||
			// CJK Compatibility Ideographs
			(0xf900 <= x && x <= 0xfaff) ||
			// Vertical Forms
			(0xfe10 <= x && x <= 0xfe19) ||
			// CJK Compatibility Forms .. Small Form Variants
			(0xfe30 <= x && x <= 0xfe6b) ||
			// Halfwidth and Fullwidth Forms
			(0xff01 <= x && x <= 0xff60) ||
			(0xffe0 <= x && x <= 0xffe6) ||
			// Kana Supplement
			(0x1b000 <= x && x <= 0x1b001) ||
			// Enclosed Ideographic Supplement
			(0x1f200 <= x && x <= 0x1f251) ||
			// CJK Unified Ideographs Extension B .. Tertiary Ideographic Plane
			(0x20000 <= x && x <= 0x3fffd)
		)
	) {
		return true;
	}

	return false;
};


/***/ }),

/***/ 99:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const ansiRegex = __webpack_require__(97);

module.exports = input => typeof input === 'string' ? input.replace(ansiRegex(), '') : input;


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOGJkNTMyNGNiOWY1MWViYjJhYWY/ZGFmYyoqKioiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidmVuZG9yXCI/Yjk0MCoqKioiLCJ3ZWJwYWNrOi8vL2RlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvbG9kYXNoLmpzIGZyb20gZGxsLXJlZmVyZW5jZSB2ZW5kb3I/MzdiZCIsIndlYnBhY2s6Ly8vLi9zcmMvc2hhcmVkL2xpYi9mdW5jdGlvbnMudHM/ZDA1YiIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZS9hc3Rhci9hc3Rhci50c3giLCJ3ZWJwYWNrOi8vL2RlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMgZnJvbSBkbGwtcmVmZXJlbmNlIHZlbmRvcj80MWQ4KioiLCJ3ZWJwYWNrOi8vLy4vfi90YWJsZS9kaXN0L2dldEJvcmRlckNoYXJhY3RlcnMuanM/NmQ4ZiIsIndlYnBhY2s6Ly8vZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL2pxdWVyeS9kaXN0L2pxdWVyeS5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgdmVuZG9yPzY1OGMqKiIsIndlYnBhY2s6Ly8vLi9+L3NsaWNlLWFuc2kvaW5kZXguanM/NjJhMiIsIndlYnBhY2s6Ly8vLi9+L3RhYmxlL2Rpc3QvYWxpZ25UYWJsZURhdGEuanM/OTg2OCIsIndlYnBhY2s6Ly8vLi9+L3RhYmxlL2Rpc3QvY2FsY3VsYXRlQ2VsbFdpZHRoSW5kZXguanM/MTYxMyIsIndlYnBhY2s6Ly8vLi9+L3RhYmxlL2Rpc3QvY2FsY3VsYXRlUm93SGVpZ2h0SW5kZXguanM/NDQ3OSIsIndlYnBhY2s6Ly8vLi9+L3RhYmxlL2Rpc3QvZHJhd0JvcmRlci5qcz9hNDc3Iiwid2VicGFjazovLy8uL34vdGFibGUvZGlzdC9kcmF3Um93LmpzPzFiYjgiLCJ3ZWJwYWNrOi8vLy4vfi90YWJsZS9kaXN0L21hcERhdGFVc2luZ1Jvd0hlaWdodEluZGV4LmpzP2IwNmMiLCJ3ZWJwYWNrOi8vLy4vfi90YWJsZS9kaXN0L3BhZFRhYmxlRGF0YS5qcz9hZTI3Iiwid2VicGFjazovLy8uL34vdGFibGUvZGlzdC9zdHJpbmdpZnlUYWJsZURhdGEuanM/ZmRiZiIsIndlYnBhY2s6Ly8vLi9+L3RhYmxlL2Rpc3QvdHJ1bmNhdGVUYWJsZURhdGEuanM/ZTA2ZCIsIndlYnBhY2s6Ly8vLi9+L3RhYmxlL2Rpc3QvdmFsaWRhdGVDb25maWcuanM/M2Q1YiIsIndlYnBhY2s6Ly8vLi9+L3RhYmxlL2Rpc3Qvd3JhcFdvcmQuanM/ZjQxMCIsIndlYnBhY2s6Ly8vLi9+L3RhYmxlL34vc3RyaW5nLXdpZHRoL2luZGV4LmpzPzhjYTgiLCJ3ZWJwYWNrOi8vLy4vfi9mYXN0LWRlZXAtZXF1YWwvaW5kZXguanM/MWQwOCIsIndlYnBhY2s6Ly8vLi9+L3NsaWNlLWFuc2kvfi9pcy1mdWxsd2lkdGgtY29kZS1wb2ludC9pbmRleC5qcz9lZDIwIiwid2VicGFjazovLy8uL34vdGFibGUvZGlzdC9hbGlnblN0cmluZy5qcz9jNDRmIiwid2VicGFjazovLy8uL34vdGFibGUvZGlzdC9jYWxjdWxhdGVDZWxsSGVpZ2h0LmpzPzgzMmIiLCJ3ZWJwYWNrOi8vLy4vfi90YWJsZS9kaXN0L2NhbGN1bGF0ZU1heGltdW1Db2x1bW5XaWR0aEluZGV4LmpzP2Y5NTciLCJ3ZWJwYWNrOi8vLy4vfi90YWJsZS9kaXN0L2NyZWF0ZVN0cmVhbS5qcz9jZjk5Iiwid2VicGFjazovLy8uL34vdGFibGUvZGlzdC9kcmF3VGFibGUuanM/NzA3MCIsIndlYnBhY2s6Ly8vLi9+L3RhYmxlL2Rpc3QvaW5kZXguanM/NWNiYyIsIndlYnBhY2s6Ly8vLi9+L3RhYmxlL2Rpc3QvbWFrZUNvbmZpZy5qcz83NmQzIiwid2VicGFjazovLy8uL34vdGFibGUvZGlzdC9tYWtlU3RyZWFtQ29uZmlnLmpzPzM1NDAiLCJ3ZWJwYWNrOi8vLy4vfi90YWJsZS9kaXN0L3RhYmxlLmpzP2FkNjAiLCJ3ZWJwYWNrOi8vLy4vfi90YWJsZS9kaXN0L3ZhbGlkYXRlVGFibGVEYXRhLmpzPzhmOWUiLCJ3ZWJwYWNrOi8vLy4vfi90YWJsZS9kaXN0L3dyYXBTdHJpbmcuanM/NTEwMyIsIndlYnBhY2s6Ly8vLi9+L3RhYmxlL34vYWp2L2xpYi9jb21waWxlL2VxdWFsLmpzPzllN2EiLCJ3ZWJwYWNrOi8vLy4vfi90YWJsZS9+L2Fuc2ktcmVnZXgvaW5kZXguanM/NTA5MyIsIndlYnBhY2s6Ly8vLi9+L3RhYmxlL34vaXMtZnVsbHdpZHRoLWNvZGUtcG9pbnQvaW5kZXguanM/MDJiNCIsIndlYnBhY2s6Ly8vLi9+L3RhYmxlL34vc3RyaXAtYW5zaS9pbmRleC5qcz8yMjViIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUVBQTJEO0FBQzNEO0FBQ0E7QUFDQSxXQUFHOztBQUVILG9EQUE0QztBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwwQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxlQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKOzs7O0FBSUE7QUFDQSxzREFBOEM7QUFDOUM7QUFDQSxvQ0FBNEI7QUFDNUIscUNBQTZCO0FBQzdCLHlDQUFpQzs7QUFFakMsK0NBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDhDQUFzQztBQUN0QztBQUNBO0FBQ0EscUNBQTZCO0FBQzdCLHFDQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQW9CLGdCQUFnQjtBQUNwQztBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBb0IsZ0JBQWdCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsYUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxhQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx5QkFBaUIsOEJBQThCO0FBQy9DO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjs7QUFFQSw0REFBb0Q7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQSxhQUFLO0FBQ0wsWUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBbUIsMkJBQTJCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDBCQUFrQixjQUFjO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHFCQUFhLDRCQUE0QjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxzQkFBYyw0QkFBNEI7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esc0JBQWMsNEJBQTRCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUFnQix1Q0FBdUM7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBZSx1Q0FBdUM7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUFlLHNCQUFzQjtBQUNyQztBQUNBO0FBQ0E7QUFDQSxlQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxQkFBYSx3Q0FBd0M7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxlQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0EsOENBQXNDLHVCQUF1Qjs7QUFFN0Q7QUFDQTs7Ozs7Ozs7QUNuc0JBLHdCOzs7Ozs7O0FDQUEsOEM7Ozs7Ozs7Ozs7O0FDWU07SUFDTCxZQUFtQixLQUFTLEVBQVMsTUFBVTtRQUE1QixVQUFLLEdBQUwsS0FBSyxDQUFJO1FBQVMsV0FBTSxHQUFOLE1BQU0sQ0FBSTtJQUFHLENBQUM7Q0FDbkQ7QUFBQTtBQUFBO0FBV0ssaUJBQWtCLE1BQVcsRUFBRTtJQUNwQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QixNQUFNLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQ2pCLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNQLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2QsQ0FBQztBQUNGLENBQUM7QUFDSyxjQUFlLEdBQVE7SUFDNUIsRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQztRQUMvQixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDUCxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUM7SUFDbEIsQ0FBQztBQUNGLENBQUM7QUFFSztJQUNMLFlBQW9CLFFBQWlCLEtBQUssRUFBVSxNQUFhLEVBQVUsS0FBWTtRQUFuRSxVQUFLLEdBQUwsS0FBSyxDQUFpQjtRQUFVLFdBQU0sR0FBTixNQUFNLENBQU87UUFBVSxVQUFLLEdBQUwsS0FBSyxDQUFPO0lBQUcsQ0FBQztJQUNwRixNQUFNLENBQUMsRUFBRTtRQUNmLE1BQU0sQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFDRCxJQUFJLE1BQU07UUFDVCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNuQixDQUFDO0lBQ0QsSUFBSSxNQUFNO1FBQ1QsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNwQixDQUFDO0lBQ0QsS0FBSyxDQUFDLE1BQWE7UUFDbEIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2pCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNmLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ1osTUFBTSxFQUFFLENBQUM7UUFDVixDQUFDO1FBQ0QsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7SUFDbkIsQ0FBQztJQUNELEdBQUcsQ0FBQyxLQUFZO1FBQ2YsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDWCxLQUFLLEVBQUUsQ0FBQztRQUNULENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNoQixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDZCxDQUFDO0lBQ0YsQ0FBQztJQUNELElBQUksQ0FBQyxNQUFZLEVBQUUsTUFBYSxFQUFFLEtBQVk7UUFDN0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuQixNQUFNLEVBQUUsQ0FBQztRQUNULElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEIsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNiLENBQUM7SUFDTyxZQUFZO1FBQ25CLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDakIsTUFBTSxJQUFJLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUN0QyxDQUFDO0lBQ0YsQ0FBQztJQUNPLFNBQVM7UUFDaEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDaEIsTUFBTSxJQUFJLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUN0QyxDQUFDO0lBQ0YsQ0FBQztDQUNEO0FBQUE7QUFBQTtBQUVEOzs7R0FHRztBQUNHO0lBQU47UUFDUyxXQUFNLEdBQVksS0FBSyxDQUFDO1FBQ3hCLFVBQUssR0FBTSxJQUFJLENBQUM7SUFpQnpCLENBQUM7SUFmQSxJQUFJLElBQUksQ0FBQyxNQUFTO1FBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO0lBQ3JCLENBQUM7SUFDRCxJQUFJLEtBQUs7UUFDUixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNwQixDQUFDO0lBQ0QsSUFBSSxJQUFJO1FBQ1AsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDbkIsQ0FBQztJQUNELEtBQUs7UUFDSixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNwQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2IsQ0FBQztDQUNEO0FBQUE7QUFBQTtBQUNLO0lBQU47UUFDUyxnQkFBVyxHQUFZLEtBQUssQ0FBQztRQUM3QixXQUFNLEdBQW1CLElBQUksS0FBSyxFQUFXLENBQUM7SUFtQ3ZELENBQUM7SUFqQ0EsS0FBSztRQUNKLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUMxQixDQUFDO0lBQ0QsVUFBVTtRQUNULElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNyQixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUN6QixDQUFDO0lBQ0QsT0FBTyxDQUFDLElBQU87UUFDZCxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUN6QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNiLENBQUM7SUFDRCxRQUFRLENBQUMsS0FBVTtRQUNsQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7UUFDekIsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNiLENBQUM7SUFDRCxPQUFPO1FBQ04sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3JCLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ3BELENBQUM7SUFDRCxRQUFRO1FBQ1AsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNuRCxDQUFDO0lBQ08sYUFBYTtRQUNwQixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN4QixNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7UUFDeEMsQ0FBQztJQUNGLENBQUM7SUFDRCxLQUFLO1FBQ0osSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNyQixDQUFDO0NBQ0Q7QUFBQTtBQUFBO0FBQ0s7SUFNTDtRQUxRLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFJM0IsVUFBSyxHQUFTLElBQUksSUFBSSxFQUFFLENBQUM7UUFFaEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLE9BQU8sQ0FBSSxDQUFDLE9BQU8sRUFBRSxNQUFNO1lBQzlDLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUNELElBQUksVUFBVTtRQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3ZCLENBQUM7SUFDRCxNQUFNLENBQUMsTUFBbUM7UUFDekMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3RCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUN2QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztnQkFDZixNQUFNLENBQ0wsQ0FBQyxJQUFRO29CQUNSLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3BCLENBQUMsRUFDRCxDQUFDLEtBQVc7b0JBQ1gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDcEIsQ0FBQyxDQUNELENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNKLENBQUM7SUFDRixDQUFDO0lBQ0QsTUFBTSxDQUFDLEtBQVc7UUFDakIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUNELE9BQU8sQ0FBQyxJQUFRO1FBQ2YsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUNELElBQUksT0FBTztRQUNWLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3RCLENBQUM7SUFDTyxjQUFjO1FBQ3JCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLE1BQU0sSUFBSSxTQUFTLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUMvQyxDQUFDO0lBQ0YsQ0FBQztDQUNEO0FBQUE7QUFBQTtBQUVLO0lBTUw7UUFMUSxjQUFTLEdBQVksS0FBSyxDQUFDO1FBSTNCLFdBQU0sR0FBcUIsSUFBSSxhQUFhLEVBQUssQ0FBQztRQUV6RCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksT0FBTyxDQUFJLENBQUMsT0FBTyxFQUFFLE1BQU07WUFDOUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7WUFDeEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBQ0QsVUFBVTtRQUNULE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3ZCLENBQUM7SUFDRCxXQUFXLENBQUMsSUFBTztRQUNsQixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNiLENBQUM7SUFDRCxVQUFVLENBQUMsS0FBVztRQUNyQixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUIsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNiLENBQUM7SUFDRCxNQUFNO1FBQ0wsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFDRCxPQUFPO1FBQ04sSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFDTyxjQUFjO1FBQ3JCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLE1BQU0sSUFBSSxTQUFTLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUMvQyxDQUFDO0lBQ0YsQ0FBQztJQUNELElBQUksT0FBTztRQUNWLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3RCLENBQUM7Q0FDRDtBQUFBO0FBQUE7QUFDSyxlQUFpQixTQUFRLEtBQUs7SUFFbkMsWUFBWSxPQUFnQixFQUFFLElBQWE7UUFDMUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRlIsU0FBSSxHQUFXLENBQUMsQ0FBQyxDQUFDO1FBR3pCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLENBQUM7SUFDRixDQUFDO0NBQ0Q7QUFBQTtBQUFBO0FBRUssbUJBQXVCLEtBQWlCO0lBQzdDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDakMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNQLE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDZCxDQUFDO0FBQ0YsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuUTJCO0FBQ0E7QUFDRTtBQUNrQztBQUVoRSxvQ0FBQyxDQUFDO0lBQ0QsTUFBTSxJQUFJLEdBQWUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RHLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQztJQUNoQixNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDakIsTUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3JDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRztRQUNmLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNkLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxHQUFHLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztZQUNyQixDQUFDO1FBQ0YsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztJQUNILElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUViLE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3hDLHlDQUF5QztJQUV6QyxNQUFNLFFBQVEsR0FBaUIsQ0FBQyxJQUFXO1FBQzFDLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ25CLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN6QixDQUFDO0lBQ0YsQ0FBQyxDQUFDO0lBQ0YsTUFBTSxLQUFLLEdBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUM5QyxNQUFNLElBQUksR0FBUSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakQsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUMvQixDQUFDLENBQUMsQ0FBQztBQUVIO0lBR0MsWUFBNEIsS0FBYSxFQUFrQixNQUFjO1FBQTdDLFVBQUssR0FBTCxLQUFLLENBQVE7UUFBa0IsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUZqRSxzQkFBaUIsR0FBaUIsSUFBSSxvRUFBSyxFQUFTLENBQUM7UUFDckQsWUFBTyxHQUFVLEVBQUUsQ0FBQztRQUUzQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQztRQUN6QyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ2pDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ2hDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ25ELENBQUM7UUFDRixDQUFDO0lBQ0YsQ0FBQztJQUNELEtBQUs7UUFDSixJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFDRCxlQUFlLENBQUMsT0FBYyxFQUFFO1FBQy9CLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ3BDLENBQUM7SUFDRCxvQkFBb0I7UUFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztJQUMvQixDQUFDO0lBRUQsT0FBTyxDQUFDLEVBQU8sRUFBRSxFQUFPLEVBQUUsSUFBUztRQUNsQyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDN0IsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzNCLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUMzQixNQUFNLENBQUMsQ0FDTixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FDekcsQ0FBQztJQUNILENBQUM7SUFFRCxPQUFPLENBQUMsUUFBNEI7UUFDbkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUNELEtBQUssQ0FBQyxPQUFjLEVBQUU7UUFDckIsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDbEIsTUFBTSxJQUFJLEdBQUcsNkNBQU8sQ0FDbkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNsQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDekIsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixNQUFNLENBQUMsR0FBRyxDQUFDO1lBQ1osQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNQLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDakMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDO1lBQy9ELENBQUM7UUFDRixDQUFDLENBQUMsRUFDRixJQUFJLENBQUMsS0FBSyxDQUNWLENBQUM7UUFDRixPQUFPLENBQUMsR0FBRyxDQUFDLG1FQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBQ0QsU0FBUyxDQUFDLE9BQWMsRUFBRTtRQUN6QixJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUNsQixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDNUIsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQzFCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDO1FBQ0gsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFCLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUVBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQyxDQUFDO0lBQ0YsQ0FBQztJQUNELE1BQU0sQ0FBQyxRQUFrQjtRQUN4QixNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNuRCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1QixDQUFDO0NBQ0Q7QUFFRDtJQUlDLFlBQ2lCLENBQVMsRUFDVCxDQUFTLEVBQ1QsSUFBVSxFQUNuQixVQUFtQixJQUFJO1FBSGQsTUFBQyxHQUFELENBQUMsQ0FBUTtRQUNULE1BQUMsR0FBRCxDQUFDLENBQVE7UUFDVCxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQ25CLFlBQU8sR0FBUCxPQUFPLENBQWdCO1FBUHZCLGNBQVMsR0FBaUIsSUFBSSxvRUFBSyxFQUFTLENBQUM7UUFDN0MsU0FBSSxHQUFTLElBQUksbUVBQUksRUFBRSxDQUFDO1FBQ3hCLFlBQU8sR0FBVSxFQUFFLENBQUM7SUFNekIsQ0FBQztJQUNKLEtBQUs7UUFDSixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksb0VBQUssRUFBUyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxtRUFBSSxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUNELFVBQVUsQ0FBQyxJQUFXO1FBQ3JCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUM1QixDQUFDO0lBQ08sVUFBVSxDQUFDLElBQVM7UUFDM0IsTUFBTSxNQUFNLEdBQUcsSUFBSSxvRUFBSyxFQUFTLENBQUM7UUFDbEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkIsTUFBTSxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3JCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2xELENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNQLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUN4QyxNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMseUJBQXlCLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ3pFLE1BQU0sY0FBYyxHQUFHLGVBQWUsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDNUMsRUFBRSxDQUFDLE9BQU8sR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUMvQixNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN6QixDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sWUFBWSxHQUFHLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN0RSxFQUFFLENBQUMsQ0FBQyxZQUFZLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDM0IsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFDcEIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNQLE1BQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxZQUFZLENBQUMsQ0FBQztnQkFDdEMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDbkUsQ0FBQztRQUNGLENBQUM7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNwQixDQUFDO0lBQ08sY0FBYyxDQUFDLEVBQVMsRUFBRSxFQUFTO1FBQzFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxJQUFJLElBQUksRUFBRSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDaEMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUM7UUFDakIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ1AsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLE1BQU0sR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ3hDLENBQUM7SUFDRixDQUFDO0lBRU8sa0JBQWtCLENBQUMsSUFBVztRQUNyQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDL0MsSUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztRQUM5QixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLFlBQVksR0FBRyxJQUFJLENBQUM7UUFDckIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ1AsRUFBRSxDQUFDLENBQUMsWUFBWSxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDNUMsWUFBWSxHQUFHLFlBQVksSUFBSSxJQUFJLENBQUM7WUFDckMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNQLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQyxNQUFNLEdBQUcsSUFBSSxHQUFHLFlBQVksQ0FBQztZQUN4RSxDQUFDO1FBQ0YsQ0FBQztRQUNELFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hFLEtBQUssQ0FBQyxJQUFJLEdBQUcsWUFBWSxDQUFDO0lBQzNCLENBQUM7SUFDRCx5QkFBeUIsQ0FBQyxJQUFTLEVBQUUsVUFBaUI7UUFDckQsTUFBTSxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBQ0QsT0FBTyxDQUFDLElBQVM7UUFDaEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzNELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUNkLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ3RCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzdDLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ1AsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO2dCQUM1QixDQUFDO1lBQ0YsQ0FBQyxDQUFDLENBQUM7UUFDSixDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO0lBQzVCLENBQUM7SUFDRCxTQUFTO1FBQ1IsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDM0QsTUFBTSxDQUFDLENBQUMsaUJBQWlCLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLGlCQUFpQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDeEYsQ0FBQztJQUNELFVBQVU7UUFDVCxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBQ0QsYUFBYTtRQUNaLE1BQU0sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO2FBQ2pELEdBQUcsQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDL0IsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDO2FBQ3hCLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBQ08sb0JBQW9CLENBQUMsUUFBa0I7UUFDOUMsTUFBTSxZQUFZLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksSUFBSSxRQUFRLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlGLE1BQU0sWUFBWSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM5RixNQUFNLFlBQVksR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxJQUFJLFFBQVEsQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xHLE1BQU0sWUFBWSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLElBQUksUUFBUSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEcsTUFBTSxDQUFDLCtDQUFTLENBQUMsQ0FBQyxZQUFZLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ25GLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDcEYsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBQ00sTUFBTSxDQUFDLEtBQVU7UUFDdkIsTUFBTSxDQUFDLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztJQUN0RSxDQUFDO0NBQ0Q7QUFFRDtJQUNDLFlBQTRCLENBQVMsRUFBa0IsQ0FBUztRQUFwQyxNQUFDLEdBQUQsQ0FBQyxDQUFRO1FBQWtCLE1BQUMsR0FBRCxDQUFDLENBQVE7SUFBRyxDQUFDO0lBQzdELFFBQVE7UUFDZCxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUNyQixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDVCxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDVCxDQUFDLENBQUM7SUFDSixDQUFDO0lBQ00sTUFBTSxDQUFDLFFBQWtCO1FBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFDTSxNQUFNLENBQUMsRUFBRSxDQUFDLENBQVMsRUFBRSxDQUFTO1FBQ3BDLE1BQU0sQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDM0IsQ0FBQztDQUNEOzs7Ozs7OztBQzVORCw4Qzs7Ozs7Ozs7QUNBQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBO0FBQ0EsY0FBYyxPQUFPO0FBQ3JCLGNBQWMsT0FBTztBQUNyQixjQUFjLE9BQU87QUFDckIsY0FBYyxPQUFPO0FBQ3JCLGNBQWMsT0FBTztBQUNyQixjQUFjLE9BQU87QUFDckIsY0FBYyxPQUFPO0FBQ3JCLGNBQWMsT0FBTztBQUNyQixjQUFjLE9BQU87QUFDckIsY0FBYyxPQUFPO0FBQ3JCLGNBQWMsT0FBTztBQUNyQixjQUFjLE9BQU87QUFDckIsY0FBYyxPQUFPO0FBQ3JCLGNBQWMsT0FBTztBQUNyQixjQUFjLE9BQU87QUFDckI7O0FBRUE7QUFDQSxXQUFXLE9BQU87QUFDbEIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEU7Ozs7Ozs7Ozs7Ozs7OztBQzdIQSw4Qzs7Ozs7Ozs7QUNBQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDRCQUE0QixXQUFXLEdBQUcsS0FBSzs7QUFFL0M7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7O0FDdkZBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOztBQUVBOztBQUVBOztBQUVBOztBQUVBLHNDQUFzQyx1Q0FBdUMsZ0JBQWdCOztBQUU3RjtBQUNBLFdBQVcsWUFBWTtBQUN2QixXQUFXLE9BQU87QUFDbEIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSCxFOzs7Ozs7OztBQ2pDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7QUFFQTs7QUFFQSxzQ0FBc0MsdUNBQXVDLGdCQUFnQjs7QUFFN0Y7QUFDQTtBQUNBO0FBQ0EsV0FBVyxTQUFTO0FBQ3BCLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxFOzs7Ozs7OztBQ3RCQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQSxzQ0FBc0MsdUNBQXVDLGdCQUFnQjs7QUFFN0Y7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsT0FBTztBQUNsQixhQUFhO0FBQ2I7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLEdBQUc7O0FBRUg7QUFDQSxFOzs7Ozs7OztBQy9DQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQztBQUNEOztBQUVBOztBQUVBOztBQUVBLHNDQUFzQyx1Q0FBdUMsZ0JBQWdCOztBQUU3RjtBQUNBO0FBQ0EsY0FBYyxPQUFPO0FBQ3JCLGNBQWMsT0FBTztBQUNyQixjQUFjLE9BQU87QUFDckIsY0FBYyxPQUFPO0FBQ3JCOztBQUVBO0FBQ0EsV0FBVyxTQUFTO0FBQ3BCLFdBQVcsaUJBQWlCO0FBQzVCLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYyxPQUFPO0FBQ3JCLGNBQWMsT0FBTztBQUNyQixjQUFjLE9BQU87QUFDckIsY0FBYyxPQUFPO0FBQ3JCOztBQUVBO0FBQ0EsV0FBVyxTQUFTO0FBQ3BCLFdBQVcsb0JBQW9CO0FBQy9CLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0EsY0FBYyxPQUFPO0FBQ3JCLGNBQWMsT0FBTztBQUNyQixjQUFjLE9BQU87QUFDckIsY0FBYyxPQUFPO0FBQ3JCOztBQUVBO0FBQ0EsV0FBVyxTQUFTO0FBQ3BCLFdBQVcscUJBQXFCO0FBQ2hDLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0EsY0FBYyxPQUFPO0FBQ3JCLGNBQWMsT0FBTztBQUNyQixjQUFjLE9BQU87QUFDckIsY0FBYyxPQUFPO0FBQ3JCOztBQUVBO0FBQ0EsV0FBVyxTQUFTO0FBQ3BCLFdBQVcsdUJBQXVCO0FBQ2xDLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxzQzs7Ozs7Ozs7QUN2R0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQSxhQUFhLE9BQU87QUFDcEIsY0FBYyxPQUFPO0FBQ3JCLGNBQWMsT0FBTztBQUNyQixjQUFjLE9BQU87QUFDckI7O0FBRUE7QUFDQSxXQUFXLFNBQVM7QUFDcEIsV0FBVyxlQUFlO0FBQzFCLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxFOzs7Ozs7OztBQ3BCQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQSxzQ0FBc0MsdUNBQXVDLGdCQUFnQjs7QUFFN0Y7QUFDQSxXQUFXLE1BQU07QUFDakIsV0FBVyxTQUFTO0FBQ3BCLFdBQVcsT0FBTztBQUNsQixhQUFhO0FBQ2I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxhQUFhLHdCQUF3QixRQUFRO0FBQzdDLGFBQWEsZ0NBQWdDLFFBQVE7O0FBRXJEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSzs7QUFFTDtBQUNBLEdBQUc7O0FBRUg7QUFDQSxFOzs7Ozs7OztBQ3hEQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7QUFFQTs7QUFFQSxzQ0FBc0MsdUNBQXVDLGdCQUFnQjs7QUFFN0Y7QUFDQSxXQUFXLFlBQVk7QUFDdkIsV0FBVyxPQUFPO0FBQ2xCLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSCxFOzs7Ozs7OztBQ3pCQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxXQUFXLFlBQVk7QUFDdkIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILEU7Ozs7Ozs7O0FDaEJBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOztBQUVBOztBQUVBLHNDQUFzQyx1Q0FBdUMsZ0JBQWdCOztBQUU3RjtBQUNBO0FBQ0EsV0FBVyxZQUFZO0FBQ3ZCLFdBQVcsT0FBTztBQUNsQixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTCxHQUFHO0FBQ0gsRTs7Ozs7Ozs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLHFCQUFxQjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYLGtDQUFrQyxhQUFhO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCOzs7Ozs7OztBQ2h2QkE7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUEsc0NBQXNDLHVDQUF1QyxnQkFBZ0I7O0FBRTdGO0FBQ0EsV0FBVyxP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O0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRTs7Ozs7Ozs7QUNsREE7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUEsc0NBQXNDLHVDQUF1QyxnQkFBZ0I7O0FBRTdGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsT0FBTztBQUNsQixhQUFhO0FBQ2I7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0EsRTs7Ozs7Ozs7QUM3Q0E7O0FBRUE7Ozs7Ozs7OztBQ0ZBOztBQUVBO0FBQ0E7QUFDQSw0QkFBNEIsNEJBQTRCO0FBQ3hELGFBQWEsSUFBSSxJQUFJLElBQUksSUFBSTtBQUM3Qjs7QUFFQTtBQUNBOzs7Ozs7Ozs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7OztBQzdDQTtBQUNBOztBQUVBIiwiZmlsZSI6ImpzL2FzdGFyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0ZnVuY3Rpb24gaG90RGlzcG9zZUNodW5rKGNodW5rSWQpIHtcbiBcdFx0ZGVsZXRlIGluc3RhbGxlZENodW5rc1tjaHVua0lkXTtcbiBcdH1cbiBcdHZhciBwYXJlbnRIb3RVcGRhdGVDYWxsYmFjayA9IHRoaXNbXCJ3ZWJwYWNrSG90VXBkYXRlXCJdO1xuIFx0dGhpc1tcIndlYnBhY2tIb3RVcGRhdGVcIl0gPSBcclxuIFx0ZnVuY3Rpb24gd2VicGFja0hvdFVwZGF0ZUNhbGxiYWNrKGNodW5rSWQsIG1vcmVNb2R1bGVzKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHRob3RBZGRVcGRhdGVDaHVuayhjaHVua0lkLCBtb3JlTW9kdWxlcyk7XHJcbiBcdFx0aWYocGFyZW50SG90VXBkYXRlQ2FsbGJhY2spIHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrKGNodW5rSWQsIG1vcmVNb2R1bGVzKTtcclxuIFx0fSA7XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdO1xyXG4gXHRcdHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xyXG4gXHRcdHNjcmlwdC50eXBlID0gXCJ0ZXh0L2phdmFzY3JpcHRcIjtcclxuIFx0XHRzY3JpcHQuY2hhcnNldCA9IFwidXRmLThcIjtcclxuIFx0XHRzY3JpcHQuc3JjID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGNodW5rSWQgKyBcIi5cIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc1wiO1xyXG4gXHRcdGhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRNYW5pZmVzdCgpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuIFx0XHRcdGlmKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0cmV0dXJuIHJlamVjdChuZXcgRXJyb3IoXCJObyBicm93c2VyIHN1cHBvcnRcIikpO1xyXG4gXHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0dmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuIFx0XHRcdFx0dmFyIHJlcXVlc3RQYXRoID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc29uXCI7XHJcbiBcdFx0XHRcdHJlcXVlc3Qub3BlbihcIkdFVFwiLCByZXF1ZXN0UGF0aCwgdHJ1ZSk7XHJcbiBcdFx0XHRcdHJlcXVlc3QudGltZW91dCA9IDEwMDAwO1xyXG4gXHRcdFx0XHRyZXF1ZXN0LnNlbmQobnVsbCk7XHJcbiBcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRyZXR1cm4gcmVqZWN0KGVycik7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4gXHRcdFx0XHRpZihyZXF1ZXN0LnJlYWR5U3RhdGUgIT09IDQpIHJldHVybjtcclxuIFx0XHRcdFx0aWYocmVxdWVzdC5zdGF0dXMgPT09IDApIHtcclxuIFx0XHRcdFx0XHQvLyB0aW1lb3V0XHJcbiBcdFx0XHRcdFx0cmVqZWN0KG5ldyBFcnJvcihcIk1hbmlmZXN0IHJlcXVlc3QgdG8gXCIgKyByZXF1ZXN0UGF0aCArIFwiIHRpbWVkIG91dC5cIikpO1xyXG4gXHRcdFx0XHR9IGVsc2UgaWYocmVxdWVzdC5zdGF0dXMgPT09IDQwNCkge1xyXG4gXHRcdFx0XHRcdC8vIG5vIHVwZGF0ZSBhdmFpbGFibGVcclxuIFx0XHRcdFx0XHRyZXNvbHZlKCk7XHJcbiBcdFx0XHRcdH0gZWxzZSBpZihyZXF1ZXN0LnN0YXR1cyAhPT0gMjAwICYmIHJlcXVlc3Quc3RhdHVzICE9PSAzMDQpIHtcclxuIFx0XHRcdFx0XHQvLyBvdGhlciBmYWlsdXJlXHJcbiBcdFx0XHRcdFx0cmVqZWN0KG5ldyBFcnJvcihcIk1hbmlmZXN0IHJlcXVlc3QgdG8gXCIgKyByZXF1ZXN0UGF0aCArIFwiIGZhaWxlZC5cIikpO1xyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdC8vIHN1Y2Nlc3NcclxuIFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0dmFyIHVwZGF0ZSA9IEpTT04ucGFyc2UocmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG4gXHRcdFx0XHRcdH0gY2F0Y2goZSkge1xyXG4gXHRcdFx0XHRcdFx0cmVqZWN0KGUpO1xyXG4gXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRyZXNvbHZlKHVwZGF0ZSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH07XHJcbiBcdFx0fSk7XHJcbiBcdH1cclxuXG4gXHRcclxuIFx0XHJcbiBcdHZhciBob3RBcHBseU9uVXBkYXRlID0gdHJ1ZTtcclxuIFx0dmFyIGhvdEN1cnJlbnRIYXNoID0gXCI4YmQ1MzI0Y2I5ZjUxZWJiMmFhZlwiOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RDdXJyZW50TW9kdWxlRGF0YSA9IHt9O1xyXG4gXHR2YXIgaG90Q3VycmVudENoaWxkTW9kdWxlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RDdXJyZW50UGFyZW50cyA9IFtdOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RDdXJyZW50UGFyZW50c1RlbXAgPSBbXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIG1lID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0aWYoIW1lKSByZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXztcclxuIFx0XHR2YXIgZm4gPSBmdW5jdGlvbihyZXF1ZXN0KSB7XHJcbiBcdFx0XHRpZihtZS5ob3QuYWN0aXZlKSB7XHJcbiBcdFx0XHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0pIHtcclxuIFx0XHRcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCkgPCAwKVxyXG4gXHRcdFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLnB1c2gobW9kdWxlSWQpO1xyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0XHRob3RDdXJyZW50Q2hpbGRNb2R1bGUgPSByZXF1ZXN0O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKG1lLmNoaWxkcmVuLmluZGV4T2YocmVxdWVzdCkgPCAwKVxyXG4gXHRcdFx0XHRcdG1lLmNoaWxkcmVuLnB1c2gocmVxdWVzdCk7XHJcbiBcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRjb25zb2xlLndhcm4oXCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgKyByZXF1ZXN0ICsgXCIpIGZyb20gZGlzcG9zZWQgbW9kdWxlIFwiICsgbW9kdWxlSWQpO1xyXG4gXHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFtdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18ocmVxdWVzdCk7XHJcbiBcdFx0fTtcclxuIFx0XHR2YXIgT2JqZWN0RmFjdG9yeSA9IGZ1bmN0aW9uIE9iamVjdEZhY3RvcnkobmFtZSkge1xyXG4gXHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxyXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxyXG4gXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xyXG4gXHRcdFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdO1xyXG4gXHRcdFx0XHR9LFxyXG4gXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiBcdFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXSA9IHZhbHVlO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9O1xyXG4gXHRcdH07XHJcbiBcdFx0Zm9yKHZhciBuYW1lIGluIF9fd2VicGFja19yZXF1aXJlX18pIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChfX3dlYnBhY2tfcmVxdWlyZV9fLCBuYW1lKSAmJiBuYW1lICE9PSBcImVcIikge1xyXG4gXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sIG5hbWUsIE9iamVjdEZhY3RvcnkobmFtZSkpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHRmbi5lID0gZnVuY3Rpb24oY2h1bmtJZCkge1xyXG4gXHRcdFx0aWYoaG90U3RhdHVzID09PSBcInJlYWR5XCIpXHJcbiBcdFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XHJcbiBcdFx0XHRob3RDaHVua3NMb2FkaW5nKys7XHJcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5lKGNodW5rSWQpLnRoZW4oZmluaXNoQ2h1bmtMb2FkaW5nLCBmdW5jdGlvbihlcnIpIHtcclxuIFx0XHRcdFx0ZmluaXNoQ2h1bmtMb2FkaW5nKCk7XHJcbiBcdFx0XHRcdHRocm93IGVycjtcclxuIFx0XHRcdH0pO1xyXG4gXHRcclxuIFx0XHRcdGZ1bmN0aW9uIGZpbmlzaENodW5rTG9hZGluZygpIHtcclxuIFx0XHRcdFx0aG90Q2h1bmtzTG9hZGluZy0tO1xyXG4gXHRcdFx0XHRpZihob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiKSB7XHJcbiBcdFx0XHRcdFx0aWYoIWhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSkge1xyXG4gXHRcdFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiYgaG90V2FpdGluZ0ZpbGVzID09PSAwKSB7XHJcbiBcdFx0XHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fTtcclxuIFx0XHRyZXR1cm4gZm47XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIGhvdCA9IHtcclxuIFx0XHRcdC8vIHByaXZhdGUgc3R1ZmZcclxuIFx0XHRcdF9hY2NlcHRlZERlcGVuZGVuY2llczoge30sXHJcbiBcdFx0XHRfZGVjbGluZWREZXBlbmRlbmNpZXM6IHt9LFxyXG4gXHRcdFx0X3NlbGZBY2NlcHRlZDogZmFsc2UsXHJcbiBcdFx0XHRfc2VsZkRlY2xpbmVkOiBmYWxzZSxcclxuIFx0XHRcdF9kaXNwb3NlSGFuZGxlcnM6IFtdLFxyXG4gXHRcdFx0X21haW46IGhvdEN1cnJlbnRDaGlsZE1vZHVsZSAhPT0gbW9kdWxlSWQsXHJcbiBcdFxyXG4gXHRcdFx0Ly8gTW9kdWxlIEFQSVxyXG4gXHRcdFx0YWN0aXZlOiB0cnVlLFxyXG4gXHRcdFx0YWNjZXB0OiBmdW5jdGlvbihkZXAsIGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGlmKHR5cGVvZiBkZXAgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmQWNjZXB0ZWQgPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwiZnVuY3Rpb25cIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZBY2NlcHRlZCA9IGRlcDtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxyXG4gXHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xyXG4gXHRcdFx0XHRlbHNlXHJcbiBcdFx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBdID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRkZWNsaW5lOiBmdW5jdGlvbihkZXApIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGRlcCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZEZWNsaW5lZCA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcclxuIFx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0XHRcdFx0aG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBbaV1dID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZVxyXG4gXHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwXSA9IHRydWU7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0ZGlzcG9zZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0YWRkRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdHJlbW92ZURpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90Ll9kaXNwb3NlSGFuZGxlcnMuaW5kZXhPZihjYWxsYmFjayk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdH0sXHJcbiBcdFxyXG4gXHRcdFx0Ly8gTWFuYWdlbWVudCBBUElcclxuIFx0XHRcdGNoZWNrOiBob3RDaGVjayxcclxuIFx0XHRcdGFwcGx5OiBob3RBcHBseSxcclxuIFx0XHRcdHN0YXR1czogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHRpZighbCkgcmV0dXJuIGhvdFN0YXR1cztcclxuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRhZGRTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0cmVtb3ZlU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90U3RhdHVzSGFuZGxlcnMuaW5kZXhPZihsKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIGhvdFN0YXR1c0hhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHJcbiBcdFx0XHQvL2luaGVyaXQgZnJvbSBwcmV2aW91cyBkaXNwb3NlIGNhbGxcclxuIFx0XHRcdGRhdGE6IGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXVxyXG4gXHRcdH07XHJcbiBcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gdW5kZWZpbmVkO1xyXG4gXHRcdHJldHVybiBob3Q7XHJcbiBcdH1cclxuIFx0XHJcbiBcdHZhciBob3RTdGF0dXNIYW5kbGVycyA9IFtdO1xyXG4gXHR2YXIgaG90U3RhdHVzID0gXCJpZGxlXCI7XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RTZXRTdGF0dXMobmV3U3RhdHVzKSB7XHJcbiBcdFx0aG90U3RhdHVzID0gbmV3U3RhdHVzO1xyXG4gXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBob3RTdGF0dXNIYW5kbGVycy5sZW5ndGg7IGkrKylcclxuIFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzW2ldLmNhbGwobnVsbCwgbmV3U3RhdHVzKTtcclxuIFx0fVxyXG4gXHRcclxuIFx0Ly8gd2hpbGUgZG93bmxvYWRpbmdcclxuIFx0dmFyIGhvdFdhaXRpbmdGaWxlcyA9IDA7XHJcbiBcdHZhciBob3RDaHVua3NMb2FkaW5nID0gMDtcclxuIFx0dmFyIGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdEF2YWlsYWJsZUZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3REZWZlcnJlZDtcclxuIFx0XHJcbiBcdC8vIFRoZSB1cGRhdGUgaW5mb1xyXG4gXHR2YXIgaG90VXBkYXRlLCBob3RVcGRhdGVOZXdIYXNoO1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gdG9Nb2R1bGVJZChpZCkge1xyXG4gXHRcdHZhciBpc051bWJlciA9ICgraWQpICsgXCJcIiA9PT0gaWQ7XHJcbiBcdFx0cmV0dXJuIGlzTnVtYmVyID8gK2lkIDogaWQ7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENoZWNrKGFwcGx5KSB7XHJcbiBcdFx0aWYoaG90U3RhdHVzICE9PSBcImlkbGVcIikgdGhyb3cgbmV3IEVycm9yKFwiY2hlY2soKSBpcyBvbmx5IGFsbG93ZWQgaW4gaWRsZSBzdGF0dXNcIik7XHJcbiBcdFx0aG90QXBwbHlPblVwZGF0ZSA9IGFwcGx5O1xyXG4gXHRcdGhvdFNldFN0YXR1cyhcImNoZWNrXCIpO1xyXG4gXHRcdHJldHVybiBob3REb3dubG9hZE1hbmlmZXN0KCkudGhlbihmdW5jdGlvbih1cGRhdGUpIHtcclxuIFx0XHRcdGlmKCF1cGRhdGUpIHtcclxuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcclxuIFx0XHRcdFx0cmV0dXJuIG51bGw7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwID0ge307XHJcbiBcdFx0XHRob3RBdmFpbGFibGVGaWxlc01hcCA9IHVwZGF0ZS5jO1xyXG4gXHRcdFx0aG90VXBkYXRlTmV3SGFzaCA9IHVwZGF0ZS5oO1xyXG4gXHRcclxuIFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XHJcbiBcdFx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gXHRcdFx0XHRob3REZWZlcnJlZCA9IHtcclxuIFx0XHRcdFx0XHRyZXNvbHZlOiByZXNvbHZlLFxyXG4gXHRcdFx0XHRcdHJlamVjdDogcmVqZWN0XHJcbiBcdFx0XHRcdH07XHJcbiBcdFx0XHR9KTtcclxuIFx0XHRcdGhvdFVwZGF0ZSA9IHt9O1xyXG4gXHRcdFx0dmFyIGNodW5rSWQgPSA0O1xyXG4gXHRcdFx0eyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWxvbmUtYmxvY2tzXHJcbiBcdFx0XHRcdC8qZ2xvYmFscyBjaHVua0lkICovXHJcbiBcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0aWYoaG90U3RhdHVzID09PSBcInByZXBhcmVcIiAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xyXG4gXHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXR1cm4gcHJvbWlzZTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdGlmKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSB8fCAhaG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0pXHJcbiBcdFx0XHRyZXR1cm47XHJcbiBcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSBmYWxzZTtcclxuIFx0XHRmb3IodmFyIG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRob3RVcGRhdGVbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHRpZigtLWhvdFdhaXRpbmdGaWxlcyA9PT0gMCAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwKSB7XHJcbiBcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKSB7XHJcbiBcdFx0aWYoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdKSB7XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xyXG4gXHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXMrKztcclxuIFx0XHRcdGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RVcGRhdGVEb3dubG9hZGVkKCkge1xyXG4gXHRcdGhvdFNldFN0YXR1cyhcInJlYWR5XCIpO1xyXG4gXHRcdHZhciBkZWZlcnJlZCA9IGhvdERlZmVycmVkO1xyXG4gXHRcdGhvdERlZmVycmVkID0gbnVsbDtcclxuIFx0XHRpZighZGVmZXJyZWQpIHJldHVybjtcclxuIFx0XHRpZihob3RBcHBseU9uVXBkYXRlKSB7XHJcbiBcdFx0XHRob3RBcHBseShob3RBcHBseU9uVXBkYXRlKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xyXG4gXHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XHJcbiBcdFx0XHR9LCBmdW5jdGlvbihlcnIpIHtcclxuIFx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KGVycik7XHJcbiBcdFx0XHR9KTtcclxuIFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XHJcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2godG9Nb2R1bGVJZChpZCkpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RBcHBseShvcHRpb25zKSB7XHJcbiBcdFx0aWYoaG90U3RhdHVzICE9PSBcInJlYWR5XCIpIHRocm93IG5ldyBFcnJvcihcImFwcGx5KCkgaXMgb25seSBhbGxvd2VkIGluIHJlYWR5IHN0YXR1c1wiKTtcclxuIFx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuIFx0XHJcbiBcdFx0dmFyIGNiO1xyXG4gXHRcdHZhciBpO1xyXG4gXHRcdHZhciBqO1xyXG4gXHRcdHZhciBtb2R1bGU7XHJcbiBcdFx0dmFyIG1vZHVsZUlkO1xyXG4gXHRcclxuIFx0XHRmdW5jdGlvbiBnZXRBZmZlY3RlZFN0dWZmKHVwZGF0ZU1vZHVsZUlkKSB7XHJcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW3VwZGF0ZU1vZHVsZUlkXTtcclxuIFx0XHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpLm1hcChmdW5jdGlvbihpZCkge1xyXG4gXHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdGNoYWluOiBbaWRdLFxyXG4gXHRcdFx0XHRcdGlkOiBpZFxyXG4gXHRcdFx0XHR9O1xyXG4gXHRcdFx0fSk7XHJcbiBcdFx0XHR3aGlsZShxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiBcdFx0XHRcdHZhciBxdWV1ZUl0ZW0gPSBxdWV1ZS5wb3AoKTtcclxuIFx0XHRcdFx0dmFyIG1vZHVsZUlkID0gcXVldWVJdGVtLmlkO1xyXG4gXHRcdFx0XHR2YXIgY2hhaW4gPSBxdWV1ZUl0ZW0uY2hhaW47XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRpZighbW9kdWxlIHx8IG1vZHVsZS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0aWYobW9kdWxlLmhvdC5fc2VsZkRlY2xpbmVkKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1kZWNsaW5lZFwiLFxyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihtb2R1bGUuaG90Ll9tYWluKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwidW5hY2NlcHRlZFwiLFxyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbW9kdWxlLnBhcmVudHMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHR2YXIgcGFyZW50SWQgPSBtb2R1bGUucGFyZW50c1tpXTtcclxuIFx0XHRcdFx0XHR2YXIgcGFyZW50ID0gaW5zdGFsbGVkTW9kdWxlc1twYXJlbnRJZF07XHJcbiBcdFx0XHRcdFx0aWYoIXBhcmVudCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0aWYocGFyZW50LmhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRlY2xpbmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0cGFyZW50SWQ6IHBhcmVudElkXHJcbiBcdFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRpZihvdXRkYXRlZE1vZHVsZXMuaW5kZXhPZihwYXJlbnRJZCkgPj0gMCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0aWYocGFyZW50LmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRpZighb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdKVxyXG4gXHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0gPSBbXTtcclxuIFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSwgW21vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXTtcclxuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaChwYXJlbnRJZCk7XHJcbiBcdFx0XHRcdFx0cXVldWUucHVzaCh7XHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxyXG4gXHRcdFx0XHRcdFx0aWQ6IHBhcmVudElkXHJcbiBcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHJcbiBcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHR0eXBlOiBcImFjY2VwdGVkXCIsXHJcbiBcdFx0XHRcdG1vZHVsZUlkOiB1cGRhdGVNb2R1bGVJZCxcclxuIFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzOiBvdXRkYXRlZE1vZHVsZXMsXHJcbiBcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzOiBvdXRkYXRlZERlcGVuZGVuY2llc1xyXG4gXHRcdFx0fTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGZ1bmN0aW9uIGFkZEFsbFRvU2V0KGEsIGIpIHtcclxuIFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBiLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdHZhciBpdGVtID0gYltpXTtcclxuIFx0XHRcdFx0aWYoYS5pbmRleE9mKGl0ZW0pIDwgMClcclxuIFx0XHRcdFx0XHRhLnB1c2goaXRlbSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBhdCBiZWdpbiBhbGwgdXBkYXRlcyBtb2R1bGVzIGFyZSBvdXRkYXRlZFxyXG4gXHRcdC8vIHRoZSBcIm91dGRhdGVkXCIgc3RhdHVzIGNhbiBwcm9wYWdhdGUgdG8gcGFyZW50cyBpZiB0aGV5IGRvbid0IGFjY2VwdCB0aGUgY2hpbGRyZW5cclxuIFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcclxuIFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0dmFyIGFwcGxpZWRVcGRhdGUgPSB7fTtcclxuIFx0XHJcbiBcdFx0dmFyIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSA9IGZ1bmN0aW9uIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSgpIHtcclxuIFx0XHRcdGNvbnNvbGUud2FybihcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlc3VsdC5tb2R1bGVJZCArIFwiKSB0byBkaXNwb3NlZCBtb2R1bGVcIik7XHJcbiBcdFx0fTtcclxuIFx0XHJcbiBcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGVJZCA9IHRvTW9kdWxlSWQoaWQpO1xyXG4gXHRcdFx0XHR2YXIgcmVzdWx0O1xyXG4gXHRcdFx0XHRpZihob3RVcGRhdGVbaWRdKSB7XHJcbiBcdFx0XHRcdFx0cmVzdWx0ID0gZ2V0QWZmZWN0ZWRTdHVmZihtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0cmVzdWx0ID0ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJkaXNwb3NlZFwiLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IGlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR2YXIgYWJvcnRFcnJvciA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgZG9BcHBseSA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgZG9EaXNwb3NlID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBjaGFpbkluZm8gPSBcIlwiO1xyXG4gXHRcdFx0XHRpZihyZXN1bHQuY2hhaW4pIHtcclxuIFx0XHRcdFx0XHRjaGFpbkluZm8gPSBcIlxcblVwZGF0ZSBwcm9wYWdhdGlvbjogXCIgKyByZXN1bHQuY2hhaW4uam9pbihcIiAtPiBcIik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0c3dpdGNoKHJlc3VsdC50eXBlKSB7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcInNlbGYtZGVjbGluZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBvZiBzZWxmIGRlY2xpbmU6IFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgY2hhaW5JbmZvKTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJkZWNsaW5lZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIG9mIGRlY2xpbmVkIGRlcGVuZGVuY3k6IFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIgaW4gXCIgKyByZXN1bHQucGFyZW50SWQgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcInVuYWNjZXB0ZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25VbmFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uVW5hY2NlcHRlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlVW5hY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBcIiArIG1vZHVsZUlkICsgXCIgaXMgbm90IGFjY2VwdGVkXCIgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcImFjY2VwdGVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uQWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25BY2NlcHRlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0ZG9BcHBseSA9IHRydWU7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwiZGlzcG9zZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EaXNwb3NlZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRpc3Bvc2VkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRkb0Rpc3Bvc2UgPSB0cnVlO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0ZGVmYXVsdDpcclxuIFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVuZXhjZXB0aW9uIHR5cGUgXCIgKyByZXN1bHQudHlwZSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYoYWJvcnRFcnJvcikge1xyXG4gXHRcdFx0XHRcdGhvdFNldFN0YXR1cyhcImFib3J0XCIpO1xyXG4gXHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChhYm9ydEVycm9yKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihkb0FwcGx5KSB7XHJcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSBob3RVcGRhdGVbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgcmVzdWx0Lm91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0XHRcdFx0Zm9yKG1vZHVsZUlkIGluIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0XHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pXHJcbiBcdFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdID0gW107XHJcbiBcdFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSwgcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKGRvRGlzcG9zZSkge1xyXG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgW3Jlc3VsdC5tb2R1bGVJZF0pO1xyXG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBTdG9yZSBzZWxmIGFjY2VwdGVkIG91dGRhdGVkIG1vZHVsZXMgdG8gcmVxdWlyZSB0aGVtIGxhdGVyIGJ5IHRoZSBtb2R1bGUgc3lzdGVtXHJcbiBcdFx0dmFyIG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdGZvcihpID0gMDsgaSA8IG91dGRhdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBvdXRkYXRlZE1vZHVsZXNbaV07XHJcbiBcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSAmJiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0b3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLnB1c2goe1xyXG4gXHRcdFx0XHRcdG1vZHVsZTogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZFxyXG4gXHRcdFx0XHR9KTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIE5vdyBpbiBcImRpc3Bvc2VcIiBwaGFzZVxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImRpc3Bvc2VcIik7XHJcbiBcdFx0T2JqZWN0LmtleXMoaG90QXZhaWxhYmxlRmlsZXNNYXApLmZvckVhY2goZnVuY3Rpb24oY2h1bmtJZCkge1xyXG4gXHRcdFx0aWYoaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gPT09IGZhbHNlKSB7XHJcbiBcdFx0XHRcdGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9KTtcclxuIFx0XHJcbiBcdFx0dmFyIGlkeDtcclxuIFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKTtcclxuIFx0XHR3aGlsZShxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiBcdFx0XHRtb2R1bGVJZCA9IHF1ZXVlLnBvcCgpO1xyXG4gXHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRpZighbW9kdWxlKSBjb250aW51ZTtcclxuIFx0XHJcbiBcdFx0XHR2YXIgZGF0YSA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdC8vIENhbGwgZGlzcG9zZSBoYW5kbGVyc1xyXG4gXHRcdFx0dmFyIGRpc3Bvc2VIYW5kbGVycyA9IG1vZHVsZS5ob3QuX2Rpc3Bvc2VIYW5kbGVycztcclxuIFx0XHRcdGZvcihqID0gMDsgaiA8IGRpc3Bvc2VIYW5kbGVycy5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHRjYiA9IGRpc3Bvc2VIYW5kbGVyc1tqXTtcclxuIFx0XHRcdFx0Y2IoZGF0YSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF0gPSBkYXRhO1xyXG4gXHRcclxuIFx0XHRcdC8vIGRpc2FibGUgbW9kdWxlICh0aGlzIGRpc2FibGVzIHJlcXVpcmVzIGZyb20gdGhpcyBtb2R1bGUpXHJcbiBcdFx0XHRtb2R1bGUuaG90LmFjdGl2ZSA9IGZhbHNlO1xyXG4gXHRcclxuIFx0XHRcdC8vIHJlbW92ZSBtb2R1bGUgZnJvbSBjYWNoZVxyXG4gXHRcdFx0ZGVsZXRlIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcclxuIFx0XHRcdC8vIHJlbW92ZSBcInBhcmVudHNcIiByZWZlcmVuY2VzIGZyb20gYWxsIGNoaWxkcmVuXHJcbiBcdFx0XHRmb3IoaiA9IDA7IGogPCBtb2R1bGUuY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcclxuIFx0XHRcdFx0dmFyIGNoaWxkID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGUuY2hpbGRyZW5bal1dO1xyXG4gXHRcdFx0XHRpZighY2hpbGQpIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRpZHggPSBjaGlsZC5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpO1xyXG4gXHRcdFx0XHRpZihpZHggPj0gMCkge1xyXG4gXHRcdFx0XHRcdGNoaWxkLnBhcmVudHMuc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIHJlbW92ZSBvdXRkYXRlZCBkZXBlbmRlbmN5IGZyb20gbW9kdWxlIGNoaWxkcmVuXHJcbiBcdFx0dmFyIGRlcGVuZGVuY3k7XHJcbiBcdFx0dmFyIG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzO1xyXG4gXHRcdGZvcihtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdGlmKG1vZHVsZSkge1xyXG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGZvcihqID0gMDsgaiA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbal07XHJcbiBcdFx0XHRcdFx0XHRpZHggPSBtb2R1bGUuY2hpbGRyZW4uaW5kZXhPZihkZXBlbmRlbmN5KTtcclxuIFx0XHRcdFx0XHRcdGlmKGlkeCA+PSAwKSBtb2R1bGUuY2hpbGRyZW4uc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBOb3QgaW4gXCJhcHBseVwiIHBoYXNlXHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiYXBwbHlcIik7XHJcbiBcdFxyXG4gXHRcdGhvdEN1cnJlbnRIYXNoID0gaG90VXBkYXRlTmV3SGFzaDtcclxuIFx0XHJcbiBcdFx0Ly8gaW5zZXJ0IG5ldyBjb2RlXHJcbiBcdFx0Zm9yKG1vZHVsZUlkIGluIGFwcGxpZWRVcGRhdGUpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcHBsaWVkVXBkYXRlLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBhcHBsaWVkVXBkYXRlW21vZHVsZUlkXTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIGNhbGwgYWNjZXB0IGhhbmRsZXJzXHJcbiBcdFx0dmFyIGVycm9yID0gbnVsbDtcclxuIFx0XHRmb3IobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0dmFyIGNhbGxiYWNrcyA9IFtdO1xyXG4gXHRcdFx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXTtcclxuIFx0XHRcdFx0XHRjYiA9IG1vZHVsZS5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcGVuZGVuY3ldO1xyXG4gXHRcdFx0XHRcdGlmKGNhbGxiYWNrcy5pbmRleE9mKGNiKSA+PSAwKSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRjYWxsYmFja3MucHVzaChjYik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0Zm9yKGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdFx0Y2IgPSBjYWxsYmFja3NbaV07XHJcbiBcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdGNiKG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzKTtcclxuIFx0XHRcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiYWNjZXB0LWVycm9yZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZGVwZW5kZW5jeUlkOiBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXSxcclxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBMb2FkIHNlbGYgYWNjZXB0ZWQgbW9kdWxlc1xyXG4gXHRcdGZvcihpID0gMDsgaSA8IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0dmFyIGl0ZW0gPSBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXNbaV07XHJcbiBcdFx0XHRtb2R1bGVJZCA9IGl0ZW0ubW9kdWxlO1xyXG4gXHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xyXG4gXHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCk7XHJcbiBcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgaXRlbS5lcnJvckhhbmRsZXIgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gXHRcdFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdFx0XHRpdGVtLmVycm9ySGFuZGxlcihlcnIpO1xyXG4gXHRcdFx0XHRcdH0gY2F0Y2goZXJyMikge1xyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3ItaGFuZGxlci1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnIyLFxyXG4gXHRcdFx0XHRcdFx0XHRcdG9yZ2luYWxFcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnIyO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBoYW5kbGUgZXJyb3JzIGluIGFjY2VwdCBoYW5kbGVycyBhbmQgc2VsZiBhY2NlcHRlZCBtb2R1bGUgbG9hZFxyXG4gXHRcdGlmKGVycm9yKSB7XHJcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJmYWlsXCIpO1xyXG4gXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XHJcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcclxuIFx0XHRcdHJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGhvdDogaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSxcbiBcdFx0XHRwYXJlbnRzOiAoaG90Q3VycmVudFBhcmVudHNUZW1wID0gaG90Q3VycmVudFBhcmVudHMsIGhvdEN1cnJlbnRQYXJlbnRzID0gW10sIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCksXG4gXHRcdFx0Y2hpbGRyZW46IFtdXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBfX3dlYnBhY2tfaGFzaF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhvdEN1cnJlbnRIYXNoOyB9O1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBob3RDcmVhdGVSZXF1aXJlKDI0NSkoX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMjQ1KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA4YmQ1MzI0Y2I5ZjUxZWJiMmFhZiIsIm1vZHVsZS5leHBvcnRzID0gdmVuZG9yO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwidmVuZG9yXCJcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSA2IDcgOCA5IDEwIiwibW9kdWxlLmV4cG9ydHMgPSAoX193ZWJwYWNrX3JlcXVpcmVfXygwKSkoNzcpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGRlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvbG9kYXNoLmpzIGZyb20gZGxsLXJlZmVyZW5jZSB2ZW5kb3Jcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAzIDQgOCIsImV4cG9ydCBpbnRlcmZhY2UgQ2FsbCB7XG5cdCgpOiB2b2lkO1xufVxuZXhwb3J0IGludGVyZmFjZSBDYWxsMTxBPiB7XG5cdChhcmc6IEEpOiB2b2lkO1xufVxuZXhwb3J0IGludGVyZmFjZSBDYWxsMjxBMSwgQTI+IHtcblx0KGFyZzE6IEExLCBhcmcyOiBBMik6IHZvaWQ7XG59XG5leHBvcnQgaW50ZXJmYWNlIENhbGwzPEExLCBBMiwgQTM+IHtcblx0KGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMpOiB2b2lkO1xufVxuZXhwb3J0IGNsYXNzIFBhaXI8VDEsIFQyPiB7XG5cdGNvbnN0cnVjdG9yKHB1YmxpYyBmaXJzdDogVDEsIHB1YmxpYyBzZWNvbmQ6IFQyKSB7fVxufVxuZXhwb3J0IGludGVyZmFjZSBGdW4wPFQ+IHtcblx0KCk6IFQ7XG59XG5leHBvcnQgaW50ZXJmYWNlIEZ1bjE8QSwgVD4ge1xuXHQoYXJnOiBBKTogVDtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgRnVuMjxBMSwgQTIsIFQ+IHtcblx0KGFyZzE6IEExLCBhcmcyOiBBMik6IFQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcnJheWlmKG9iajogYW55ID0gW10pOiBhbnlbXSB7XG5cdGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcblx0XHRyZXR1cm4gWy4uLm9ial07XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIFtvYmpdO1xuXHR9XG59XG5leHBvcnQgZnVuY3Rpb24gbGF6eSh2YWw6IGFueSk6ICgpID0+IGFueSB7XG5cdGlmICh0eXBlb2YgdmFsID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRyZXR1cm4gdmFsKCk7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuICgpID0+IHZhbDtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgTG9jayB7XG5cdGNvbnN0cnVjdG9yKHByaXZhdGUgX2xvY2s6IGJvb2xlYW4gPSBmYWxzZSwgcHJpdmF0ZSBiZWZvcmU/OiBDYWxsLCBwcml2YXRlIGFmdGVyPzogQ2FsbCkge31cblx0cHVibGljIHN0YXRpYyBvZigpOiBMb2NrIHtcblx0XHRyZXR1cm4gbmV3IExvY2soKTtcblx0fVxuXHRnZXQgaXNMb2NrKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0aGlzLl9sb2NrO1xuXHR9XG5cdGdldCBpc0ZyZWUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuICF0aGlzLl9sb2NrO1xuXHR9XG5cdHN0YXJ0KGJlZm9yZT86IENhbGwpOiB2b2lkIHtcblx0XHR0aGlzLmNoZWNrRnJlZSgpO1xuXHRcdGlmICh0aGlzLmJlZm9yZSkge1xuXHRcdFx0dGhpcy5iZWZvcmUoKTtcblx0XHR9XG5cdFx0aWYgKGJlZm9yZSkge1xuXHRcdFx0YmVmb3JlKCk7XG5cdFx0fVxuXHRcdHRoaXMuX2xvY2sgPSB0cnVlO1xuXHR9XG5cdGVuZChhZnRlcj86IENhbGwpOiB2b2lkIHtcblx0XHR0aGlzLmNoZWNrTG9ja2luZygpO1xuXHRcdHRoaXMuX2xvY2sgPSBmYWxzZTtcblx0XHRpZiAoYWZ0ZXIpIHtcblx0XHRcdGFmdGVyKCk7XG5cdFx0fVxuXHRcdGlmICh0aGlzLmFmdGVyKSB7XG5cdFx0XHR0aGlzLmFmdGVyKCk7XG5cdFx0fVxuXHR9XG5cdGF0b20oYWN0aW9uOiBDYWxsLCBiZWZvcmU/OiBDYWxsLCBhZnRlcj86IENhbGwpOiBMb2NrIHtcblx0XHR0aGlzLnN0YXJ0KGJlZm9yZSk7XG5cdFx0YWN0aW9uKCk7XG5cdFx0dGhpcy5lbmQoYWZ0ZXIpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cdHByaXZhdGUgY2hlY2tMb2NraW5nKCk6IHZvaWQge1xuXHRcdGlmICghdGhpcy5fbG9jaykge1xuXHRcdFx0dGhyb3cgbmV3IEV4Y2VwdGlvbihcIm9iamVjdCBsb2NrZWRcIik7XG5cdFx0fVxuXHR9XG5cdHByaXZhdGUgY2hlY2tGcmVlKCk6IHZvaWQge1xuXHRcdGlmICh0aGlzLl9sb2NrKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXhjZXB0aW9uKFwib2JqZWN0IGxvY2tlZFwiKTtcblx0XHR9XG5cdH1cbn1cblxuLyoqXG4gKiDlkIzmraXmlrnms5XkuK3pmo/kvr/kvb/nlKhcbiAqIOW8guatpeaWueazleS4reWmguaenOS4jeWFs+W/g+e7k+aenOeahOWJjee9ruWkhOeQhu+8jOWPquWFs+W/g+e7k+aenOeahOWQjue9ruWkhOeQhu+8jOWPr+S7peS9v+eUqOivpeexu++8jFxuICovXG5leHBvcnQgY2xhc3MgU3RvcmU8VD4ge1xuXHRwcml2YXRlIF9zdGF0ZTogYm9vbGVhbiA9IGZhbHNlO1xuXHRwcml2YXRlIF9kYXRhOiBUID0gbnVsbDtcblxuXHRzZXQgZGF0YShyZXN1bHQ6IFQpIHtcblx0XHR0aGlzLl9zdGF0ZSA9IHRydWU7XG5cdFx0dGhpcy5fZGF0YSA9IHJlc3VsdDtcblx0fVxuXHRnZXQgc3RhdGUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMuX3N0YXRlO1xuXHR9XG5cdGdldCBkYXRhKCk6IFQge1xuXHRcdHJldHVybiB0aGlzLl9kYXRhO1xuXHR9XG5cdHJlc2V0KCk6IHRoaXMge1xuXHRcdHRoaXMuX3N0YXRlID0gZmFsc2U7XG5cdFx0dGhpcy5fZGF0YSA9IG51bGw7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn1cbmV4cG9ydCBjbGFzcyBTdGFuZGFyZFN0b3JlPFQ+IHtcblx0cHJpdmF0ZSBfaXNTdGFuZGFyZDogYm9vbGVhbiA9IGZhbHNlO1xuXHRwcml2YXRlIF9zdG9yZTogU3RvcmU8VCB8IGFueT4gPSBuZXcgU3RvcmU8VCB8IGFueT4oKTtcblxuXHRzdGF0ZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5fc3RvcmUuc3RhdGU7XG5cdH1cblx0aXNTdGFuZGFyZCgpOiBib29sZWFuIHtcblx0XHR0aGlzLmNoZWNrUmVhZGFibGUoKTtcblx0XHRyZXR1cm4gdGhpcy5faXNTdGFuZGFyZDtcblx0fVxuXHRzZXREYXRhKGRhdGE6IFQpOiB0aGlzIHtcblx0XHR0aGlzLl9pc1N0YW5kYXJkID0gZmFsc2U7XG5cdFx0dGhpcy5fc3RvcmUuZGF0YSA9IGRhdGE7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0c2V0RXJyb3IoZXJyb3I6IGFueSk6IHRoaXMge1xuXHRcdHRoaXMuX2lzU3RhbmRhcmQgPSB0cnVlO1xuXHRcdHRoaXMuX3N0b3JlLmRhdGEgPSBlcnJvcjtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXHRnZXREYXRhKCk6IFQge1xuXHRcdHRoaXMuY2hlY2tSZWFkYWJsZSgpO1xuXHRcdHJldHVybiAhdGhpcy5faXNTdGFuZGFyZCA/IHRoaXMuX3N0b3JlLmRhdGEgOiBudWxsO1xuXHR9XG5cdGdldEVycm9yKCkge1xuXHRcdHRoaXMuY2hlY2tSZWFkYWJsZSgpO1xuXHRcdHJldHVybiB0aGlzLl9pc1N0YW5kYXJkID8gdGhpcy5fc3RvcmUuZGF0YSA6IG51bGw7XG5cdH1cblx0cHJpdmF0ZSBjaGVja1JlYWRhYmxlKCkge1xuXHRcdGlmICghdGhpcy5fc3RvcmUuc3RhdGUpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcInJlc3VsdCBkb2VzIG5vdCBzZXRcIik7XG5cdFx0fVxuXHR9XG5cdHJlc2V0KCkge1xuXHRcdHRoaXMuX3N0b3JlLnJlc2V0KCk7XG5cdH1cbn1cbmV4cG9ydCBjbGFzcyBTdGF0ZVByb21pc2U8VD4ge1xuXHRwcml2YXRlIF9maW5pc2hlZDogYm9vbGVhbiA9IGZhbHNlO1xuXHRwcml2YXRlIF9yZXNvbHZlOiBDYWxsMTxUPjtcblx0cHJpdmF0ZSBfcmVqZWN0OiBDYWxsMTxhbnk+O1xuXHRwcml2YXRlIF9wcm9taXNlOiBQcm9taXNlPFQ+O1xuXHRwcml2YXRlIF9sb2NrOiBMb2NrID0gbmV3IExvY2soKTtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5fcHJvbWlzZSA9IG5ldyBQcm9taXNlPFQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdHRoaXMuX3Jlc29sdmUgPSByZXNvbHZlO1xuXHRcdFx0dGhpcy5fcmVqZWN0ID0gcmVqZWN0O1xuXHRcdH0pO1xuXHR9XG5cdGdldCBpc0ZpbmlzaGVkKCkge1xuXHRcdHJldHVybiB0aGlzLl9maW5pc2hlZDtcblx0fVxuXHRhY3Rpb24oYWN0aW9uOiBDYWxsMjxDYWxsMTxUPiwgQ2FsbDE8YW55Pj4pIHtcblx0XHR0aGlzLmNoZWNrV3JpdGVhYmxlKCk7XG5cdFx0aWYgKHRoaXMuX2xvY2suaXNMb2NrKSB7XG5cdFx0XHR0aGlzLl9sb2NrLmF0b20oKCkgPT4ge1xuXHRcdFx0XHRhY3Rpb24oXG5cdFx0XHRcdFx0KGRhdGE/OiBUKSA9PiB7XG5cdFx0XHRcdFx0XHR0aGlzLnJlc29sdmUoZGF0YSk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQoZXJyb3I/OiBhbnkpID0+IHtcblx0XHRcdFx0XHRcdHRoaXMucmVqZWN0KGVycm9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblx0cmVqZWN0KGVycm9yPzogYW55KSB7XG5cdFx0dGhpcy5jaGVja1dyaXRlYWJsZSgpO1xuXHRcdHRoaXMuX2ZpbmlzaGVkID0gdHJ1ZTtcblx0XHR0aGlzLl9yZWplY3QoZXJyb3IpO1xuXHR9XG5cdHJlc29sdmUoZGF0YT86IFQpIHtcblx0XHR0aGlzLmNoZWNrV3JpdGVhYmxlKCk7XG5cdFx0dGhpcy5fZmluaXNoZWQgPSB0cnVlO1xuXHRcdHRoaXMuX3Jlc29sdmUoZGF0YSk7XG5cdH1cblx0Z2V0IHByb21pc2UoKTogUHJvbWlzZTxUPiB7XG5cdFx0cmV0dXJuIHRoaXMuX3Byb21pc2U7XG5cdH1cblx0cHJpdmF0ZSBjaGVja1dyaXRlYWJsZSgpIHtcblx0XHRpZiAodGhpcy5fZmluaXNoZWQpIHtcblx0XHRcdHRocm93IG5ldyBFeGNlcHRpb24oXCJyZXN1bHQgaGFzIGJlZW4gc2V0dGVkXCIpO1xuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgY2xhc3MgU3RhdGVzUHJvbWlzZTxUPiB7XG5cdHByaXZhdGUgX2ZpbmlzaGVkOiBib29sZWFuID0gZmFsc2U7XG5cdHByaXZhdGUgX3Jlc29sdmU6IENhbGwxPFQ+O1xuXHRwcml2YXRlIF9yZWplY3Q6IENhbGwxPGFueT47XG5cdHByaXZhdGUgX3Byb21pc2U6IFByb21pc2U8VD47XG5cdHByaXZhdGUgX3N0b3JlOiBTdGFuZGFyZFN0b3JlPFQ+ID0gbmV3IFN0YW5kYXJkU3RvcmU8VD4oKTtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5fcHJvbWlzZSA9IG5ldyBQcm9taXNlPFQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdHRoaXMuX3Jlc29sdmUgPSByZXNvbHZlO1xuXHRcdFx0dGhpcy5fcmVqZWN0ID0gcmVqZWN0O1xuXHRcdH0pO1xuXHR9XG5cdGlzRmluaXNoZWQoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX2ZpbmlzaGVkO1xuXHR9XG5cdHJlc29sdmVEYXRhKGRhdGE6IFQpOiB0aGlzIHtcblx0XHR0aGlzLmNoZWNrV3JpdGVhYmxlKCk7XG5cdFx0dGhpcy5fc3RvcmUuc2V0RGF0YShkYXRhKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXHRyZWplY3REYXRhKGVycm9yPzogYW55KTogdGhpcyB7XG5cdFx0dGhpcy5jaGVja1dyaXRlYWJsZSgpO1xuXHRcdHRoaXMuX3N0b3JlLnNldEVycm9yKGVycm9yKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXHRyZWplY3QoKSB7XG5cdFx0dGhpcy5jaGVja1dyaXRlYWJsZSgpO1xuXHRcdHRoaXMuX3JlamVjdCh0aGlzLl9zdG9yZS5nZXRFcnJvcigpKTtcblx0fVxuXHRyZXNvbHZlKCkge1xuXHRcdHRoaXMuY2hlY2tXcml0ZWFibGUoKTtcblx0XHR0aGlzLl9yZXNvbHZlKHRoaXMuX3N0b3JlLmdldERhdGEoKSk7XG5cdH1cblx0cHJpdmF0ZSBjaGVja1dyaXRlYWJsZSgpIHtcblx0XHRpZiAodGhpcy5fZmluaXNoZWQpIHtcblx0XHRcdHRocm93IG5ldyBFeGNlcHRpb24oXCJyZXN1bHQgaGFzIGJlZW4gc2V0dGVkXCIpO1xuXHRcdH1cblx0fVxuXHRnZXQgcHJvbWlzZSgpOiBQcm9taXNlPFQ+IHtcblx0XHRyZXR1cm4gdGhpcy5fcHJvbWlzZTtcblx0fVxufVxuZXhwb3J0IGNsYXNzIEV4Y2VwdGlvbiBleHRlbmRzIEVycm9yIHtcblx0cHJpdmF0ZSBjb2RlOiBudW1iZXIgPSAtMTtcblx0Y29uc3RydWN0b3IobWVzc2FnZT86IHN0cmluZywgY29kZT86IG51bWJlcikge1xuXHRcdHN1cGVyKG1lc3NhZ2UpO1xuXHRcdGlmIChOdW1iZXIuaXNGaW5pdGUoY29kZSkpIHtcblx0XHRcdHRoaXMuY29kZSA9IGNvZGU7XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsYXp5VmFsdWU8VD4odmFsdWU6IENhbGwgfCBhbnkpOiBUIHtcblx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0cmV0dXJuIHZhbHVlKCk7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2hhcmVkL2xpYi9mdW5jdGlvbnMudHMiLCJpbXBvcnQgKiBhcyAkIGZyb20gXCJqcXVlcnlcIjtcbmltcG9ydCAqIGFzIF8gZnJvbSBcImxvZGFzaFwiO1xuaW1wb3J0IHsgdGFibGUgfSBmcm9tIFwidGFibGVcIjtcbmltcG9ydCB7IENhbGwxLCBTdG9yZSwgTG9jayB9IGZyb20gXCIuLi8uLi9zaGFyZWQvbGliL2Z1bmN0aW9uc1wiO1xuXG4kKCgpID0+IHtcblx0Y29uc3Qgd2FsbDogUG9zaXRpb25bXSA9IFtQb3NpdGlvbi5vZigzLCAwKSwgUG9zaXRpb24ub2YoMywgMSksIFBvc2l0aW9uLm9mKDMsIDIpLCBQb3NpdGlvbi5vZigzLCAzKV07XG5cdGNvbnN0IHdpZHRoID0gNTtcblx0Y29uc3QgaGVpZ2h0ID0gNTtcblx0Y29uc3QgZ3JpZCA9IG5ldyBHcmlkKHdpZHRoLCBoZWlnaHQpO1xuXHRncmlkLmZvckVhY2goYm94ID0+IHtcblx0XHR3YWxsLmZvckVhY2goaXQgPT4ge1xuXHRcdFx0aWYgKGl0LmVxdWFscyhib3guZ2V0UG9zdGlvbigpKSkge1xuXHRcdFx0XHRib3guaXNFbXB0eSA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KTtcblx0Z3JpZC5wcmludCgpO1xuXG5cdGNvbnN0IHN0YXJ0UG9zaXRpb24gPSBQb3NpdGlvbi5vZigyLCAwKTtcblx0Ly8gY29uc3QgZW5kUG9zaXRpb24gPSBQb3NpdGlvbi5vZig0LCAwKTtcblxuXHRjb25zdCBvbkZpbmlzaDogQ2FsbDE8Qm94W10+ID0gKHBhdGg6IEJveFtdKSA9PiB7XG5cdFx0aWYgKHBhdGggIT09IG51bGwpIHtcblx0XHRcdGdyaWQucHJpbnQocGF0aCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnNvbGUubG9nKFwibm90IGZpbmRcIik7XG5cdFx0fVxuXHR9O1xuXHRjb25zdCBzdGFydDogQm94ID0gZ3JpZC5nZXRCb3goc3RhcnRQb3NpdGlvbik7XG5cdGNvbnN0IGJveDM6IEJveCA9IGdyaWQuZ2V0Qm94KFBvc2l0aW9uLm9mKDIsIDMpKTtcblx0b25GaW5pc2goc3RhcnQuZ2V0UGF0aChib3gzKSk7XG59KTtcblxuY2xhc3MgR3JpZCB7XG5cdHByaXZhdGUgc2hvcnRlc3RQYXRoU3RvcmU6IFN0b3JlPEJveFtdPiA9IG5ldyBTdG9yZTxCb3hbXT4oKTtcblx0cHJpdmF0ZSBib3hMaXN0OiBCb3hbXSA9IFtdO1xuXHRjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgd2lkdGg6IG51bWJlciwgcHVibGljIHJlYWRvbmx5IGhlaWdodDogbnVtYmVyKSB7XG5cdFx0dGhpcy5ib3hMaXN0ID0gbmV3IEFycmF5KHdpZHRoICogaGVpZ2h0KTtcblx0XHRmb3IgKGxldCBoID0gMDsgaCA8IGhlaWdodDsgaCsrKSB7XG5cdFx0XHRmb3IgKGxldCB3ID0gMDsgdyA8IHdpZHRoOyB3KyspIHtcblx0XHRcdFx0dGhpcy5ib3hMaXN0W2ggKiB3aWR0aCArIHddID0gbmV3IEJveCh3LCBoLCB0aGlzKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmVzZXQoKSB7XG5cdFx0dGhpcy5zaG9ydGVzdFBhdGhTdG9yZS5yZXNldCgpO1xuXHRcdHRoaXMuYm94TGlzdC5mb3JFYWNoKGl0ID0+IGl0LnJlc2V0KCkpO1xuXHR9XG5cdHNldFNob3J0ZXN0UGF0aChwYXRoOiBCb3hbXSA9IFtdKTogdm9pZCB7XG5cdFx0dGhpcy5zaG9ydGVzdFBhdGhTdG9yZS5kYXRhID0gcGF0aDtcblx0fVxuXHRnZXRTaG9ydGVzdFBhdGhTdG9yZSgpOiBTdG9yZTxCb3hbXT4ge1xuXHRcdHJldHVybiB0aGlzLnNob3J0ZXN0UGF0aFN0b3JlO1xuXHR9XG5cblx0Y29tcGFyZShvMTogQm94LCBvMjogQm94LCBkaXN0OiBCb3gpOiBudW1iZXIge1xuXHRcdGNvbnN0IHAwID0gZGlzdC5nZXRQb3N0aW9uKCk7XG5cdFx0Y29uc3QgcDEgPSBvMS5nZXRQb3N0aW9uKCk7XG5cdFx0Y29uc3QgcDIgPSBvMi5nZXRQb3N0aW9uKCk7XG5cdFx0cmV0dXJuIChcblx0XHRcdE1hdGgucG93KHAwLncgLSBwMS53LCAyKSArIE1hdGgucG93KHAwLmggLSBwMS5oLCAyKSAtIE1hdGgucG93KHAwLncgLSBwMi53LCAyKSAtIE1hdGgucG93KHAwLmggLSBwMi5oLCAyKVxuXHRcdCk7XG5cdH1cblxuXHRmb3JFYWNoKGNhbGxiYWNrOiAoYm94OiBCb3gpID0+IHZvaWQpIHtcblx0XHR0aGlzLmJveExpc3QuZm9yRWFjaChjYWxsYmFjayk7XG5cdH1cblx0cHJpbnQocGF0aDogQm94W10gPSBbXSkge1xuXHRcdHBhdGggPSBwYXRoIHx8IFtdO1xuXHRcdGNvbnN0IGRhdGEgPSBfLmNodW5rKFxuXHRcdFx0dGhpcy5ib3hMaXN0Lm1hcChpdCA9PiB7XG5cdFx0XHRcdGlmIChwYXRoLmluY2x1ZGVzKGl0KSkge1xuXHRcdFx0XHRcdHJldHVybiBwYXRoLmluZGV4T2YoaXQpO1xuXHRcdFx0XHR9IGVsc2UgaWYgKCFpdC5pc0VtcHR5KSB7XG5cdFx0XHRcdFx0cmV0dXJuIFwifFwiO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnN0IHBvc2l0aW9uID0gaXQuZ2V0UG9zdGlvbigpO1xuXHRcdFx0XHRcdHJldHVybiBwYXRoLmxlbmd0aCA9PT0gMCA/IGAke3Bvc2l0aW9uLnd9JHtwb3NpdGlvbi5ofWAgOiBcIiBcIjtcblx0XHRcdFx0fVxuXHRcdFx0fSksXG5cdFx0XHR0aGlzLndpZHRoXG5cdFx0KTtcblx0XHRjb25zb2xlLmxvZyh0YWJsZShkYXRhKSk7XG5cdH1cblx0cHJpbnRQYXRoKHBhdGg6IEJveFtdID0gW10pIHtcblx0XHRwYXRoID0gcGF0aCB8fCBbXTtcblx0XHRjb25zdCB0YWJsZURhdGEgPSBwYXRoLm1hcChpdCA9PiB7XG5cdFx0XHRjb25zdCBwID0gaXQuZ2V0UG9zdGlvbigpO1xuXHRcdFx0cmV0dXJuIGAke3Aud30ke3AuaH1gO1xuXHRcdH0pO1xuXHRcdGlmICh0YWJsZURhdGEubGVuZ3RoID4gMCkge1xuXHRcdFx0Y29uc29sZS5sb2codGFibGUoW3RhYmxlRGF0YV0pKTtcblx0XHR9XG5cdH1cblx0Z2V0Qm94KHBvc2l0aW9uOiBQb3NpdGlvbikge1xuXHRcdGNvbnN0IGluZGV4ID0gcG9zaXRpb24uaCAqIHRoaXMud2lkdGggKyBwb3NpdGlvbi53O1xuXHRcdHJldHVybiB0aGlzLmJveExpc3RbaW5kZXhdO1xuXHR9XG59XG5cbmNsYXNzIEJveCB7XG5cdHByaXZhdGUgcGF0aENhY2hlOiBTdG9yZTxCb3hbXT4gPSBuZXcgU3RvcmU8Qm94W10+KCk7XG5cdHByaXZhdGUgbG9jazogTG9jayA9IG5ldyBMb2NrKCk7XG5cdHByaXZhdGUgcHJlUGF0aDogQm94W10gPSBbXTtcblx0Y29uc3RydWN0b3IoXG5cdFx0cHVibGljIHJlYWRvbmx5IHc6IG51bWJlcixcblx0XHRwdWJsaWMgcmVhZG9ubHkgaDogbnVtYmVyLFxuXHRcdHB1YmxpYyByZWFkb25seSBncmlkOiBHcmlkLFxuXHRcdHB1YmxpYyBpc0VtcHR5OiBib29sZWFuID0gdHJ1ZVxuXHQpIHt9XG5cdHJlc2V0KCkge1xuXHRcdHRoaXMucGF0aENhY2hlID0gbmV3IFN0b3JlPEJveFtdPigpO1xuXHRcdHRoaXMubG9jayA9IG5ldyBMb2NrKCk7XG5cdFx0dGhpcy5wcmVQYXRoID0gW107XG5cdH1cblx0dXBkYXRlUGF0aChwYXRoOiBCb3hbXSkge1xuXHRcdHRoaXMucGF0aENhY2hlLmRhdGEgPSBwYXRoO1xuXHR9XG5cdHByaXZhdGUgc2VhcmNoUGF0aChkaXN0OiBCb3gpOiBCb3hbXSB7XG5cdFx0Y29uc3QgcmVzdWx0ID0gbmV3IFN0b3JlPEJveFtdPigpO1xuXHRcdGlmICh0aGlzLmVxdWFscyhkaXN0KSkge1xuXHRcdFx0cmVzdWx0LmRhdGEgPSBbdGhpc107XG5cdFx0XHR0aGlzLnVwZGF0ZVNob3J0ZXN0UGF0aChbLi4udGhpcy5wcmVQYXRoLCB0aGlzXSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNvbnN0IG5laWdoYm91cnMgPSB0aGlzLmdldE5laWdoYm91cnMoKTtcblx0XHRcdGNvbnN0IHNvcnRlZE5laWdoYm91ciA9IHRoaXMuZXZhbHVhdGVBbmRTb3J0TmVpZ2hib3VycyhkaXN0LCBuZWlnaGJvdXJzKTtcblx0XHRcdGNvbnN0IG5laWdoYm91clBhdGhzID0gc29ydGVkTmVpZ2hib3VyLm1hcChpdCA9PiB7XG5cdFx0XHRcdGl0LnByZVBhdGggPSBbLi4udGhpcy5wcmVQYXRoXTtcblx0XHRcdFx0cmV0dXJuIGl0LmdldFBhdGgoZGlzdCk7XG5cdFx0XHR9KTtcblx0XHRcdGNvbnN0IHNob3J0ZXN0UGF0aCA9IG5laWdoYm91clBhdGhzLnJlZHVjZSh0aGlzLmdldFNob3J0ZXJQYXRoLCBudWxsKTtcblx0XHRcdGlmIChzaG9ydGVzdFBhdGggPT09IG51bGwpIHtcblx0XHRcdFx0cmVzdWx0LmRhdGEgPSBudWxsO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmVzdWx0LmRhdGEgPSBbdGhpcywgLi4uc2hvcnRlc3RQYXRoXTtcblx0XHRcdFx0dGhpcy51cGRhdGVTaG9ydGVzdFBhdGgoWy4uLnRoaXMucHJlUGF0aCwgdGhpcywgLi4uc2hvcnRlc3RQYXRoXSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiByZXN1bHQuZGF0YTtcblx0fVxuXHRwcml2YXRlIGdldFNob3J0ZXJQYXRoKG8xOiBCb3hbXSwgbzI6IEJveFtdKTogYW55IHtcblx0XHRpZiAobzEgPT09IG51bGwgfHwgbzIgPT09IG51bGwpIHtcblx0XHRcdHJldHVybiBvMSB8fCBvMjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIG8xLmxlbmd0aCA8IG8yLmxlbmd0aCA/IG8xIDogbzI7XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSB1cGRhdGVTaG9ydGVzdFBhdGgocGF0aDogQm94W10pOiB2b2lkIHtcblx0XHRjb25zdCBzdG9yZSA9IHRoaXMuZ3JpZC5nZXRTaG9ydGVzdFBhdGhTdG9yZSgpO1xuXHRcdGxldCBzaG9ydGVzdFBhdGggPSBzdG9yZS5kYXRhO1xuXHRcdGlmICghc3RvcmUuc3RhdGUpIHtcblx0XHRcdHNob3J0ZXN0UGF0aCA9IHBhdGg7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChzaG9ydGVzdFBhdGggPT09IG51bGwgfHwgcGF0aCA9PT0gbnVsbCkge1xuXHRcdFx0XHRzaG9ydGVzdFBhdGggPSBzaG9ydGVzdFBhdGggfHwgcGF0aDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNob3J0ZXN0UGF0aCA9IHBhdGgubGVuZ3RoIDwgc2hvcnRlc3RQYXRoLmxlbmd0aCA/IHBhdGggOiBzaG9ydGVzdFBhdGg7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHNob3J0ZXN0UGF0aC5mb3JFYWNoKGl0ID0+IGl0LnVwZGF0ZVBhdGgocGF0aC5zbGljZShwYXRoLmluZGV4T2YoaXQpKSkpO1xuXHRcdHN0b3JlLmRhdGEgPSBzaG9ydGVzdFBhdGg7XG5cdH1cblx0ZXZhbHVhdGVBbmRTb3J0TmVpZ2hib3VycyhkaXN0OiBCb3gsIG5laWdoYm91cnM6IEJveFtdKTogQm94W10ge1xuXHRcdHJldHVybiBbLi4ubmVpZ2hib3Vyc10uc29ydCgobzEsIG8yKSA9PiB0aGlzLmdyaWQuY29tcGFyZShvMSwgbzIsIGRpc3QpKTtcblx0fVxuXHRnZXRQYXRoKGRpc3Q6IEJveCk6IEJveFtdIHtcblx0XHRpZiAoIXRoaXMucGF0aENhY2hlLnN0YXRlIHx8IHRoaXMucGF0aENhY2hlLmRhdGEgIT09IG51bGwpIHtcblx0XHRcdHRoaXMubG9jay5hdG9tKCgpID0+IHtcblx0XHRcdFx0aWYgKHRoaXMuc2hvdWxkVHJ5KCkpIHtcblx0XHRcdFx0XHR0aGlzLnBhdGhDYWNoZS5kYXRhID0gdGhpcy5zZWFyY2hQYXRoKGRpc3QpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRoaXMucGF0aENhY2hlLmRhdGEgPSBudWxsO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMucGF0aENhY2hlLmRhdGE7XG5cdH1cblx0c2hvdWxkVHJ5KCk6IGJvb2xlYW4ge1xuXHRcdGNvbnN0IHNob3J0ZXN0UGF0aFN0b3JlID0gdGhpcy5ncmlkLmdldFNob3J0ZXN0UGF0aFN0b3JlKCk7XG5cdFx0cmV0dXJuICFzaG9ydGVzdFBhdGhTdG9yZS5zdGF0ZSB8fCB0aGlzLnByZVBhdGgubGVuZ3RoIDwgc2hvcnRlc3RQYXRoU3RvcmUuZGF0YS5sZW5ndGg7XG5cdH1cblx0Z2V0UG9zdGlvbigpIHtcblx0XHRyZXR1cm4gUG9zaXRpb24ub2YodGhpcy53LCB0aGlzLmgpO1xuXHR9XG5cdGdldE5laWdoYm91cnMoKSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0TmVpZ2hib3VyUG9zaXRpb24odGhpcy5nZXRQb3N0aW9uKCkpXG5cdFx0XHQubWFwKGl0ID0+IHRoaXMuZ3JpZC5nZXRCb3goaXQpKVxuXHRcdFx0LmZpbHRlcihpdCA9PiBpdC5pc0VtcHR5KVxuXHRcdFx0LmZpbHRlcihpdCA9PiBpdC5sb2NrLmlzRnJlZSk7XG5cdH1cblx0cHJpdmF0ZSBnZXROZWlnaGJvdXJQb3NpdGlvbihwb3NpdGlvbjogUG9zaXRpb24pOiBQb3NpdGlvbltdIHtcblx0XHRjb25zdCBzdWJQb3NpdGlvbjEgPSBbcG9zaXRpb24udyAtIDEsIHBvc2l0aW9uLncgKyAxXS5tYXAoaXQgPT4gbmV3IFBvc2l0aW9uKGl0LCBwb3NpdGlvbi5oKSk7XG5cdFx0Y29uc3Qgc3ViUG9zaXRpb24yID0gW3Bvc2l0aW9uLmggLSAxLCBwb3NpdGlvbi5oICsgMV0ubWFwKGl0ID0+IG5ldyBQb3NpdGlvbihwb3NpdGlvbi53LCBpdCkpO1xuXHRcdGNvbnN0IHN1YlBvc2l0aW9uMyA9IFtwb3NpdGlvbi53IC0gMSwgcG9zaXRpb24udyArIDFdLm1hcChpdCA9PiBuZXcgUG9zaXRpb24oaXQsIHBvc2l0aW9uLmggKyAxKSk7XG5cdFx0Y29uc3Qgc3ViUG9zaXRpb240ID0gW3Bvc2l0aW9uLncgLSAxLCBwb3NpdGlvbi53ICsgMV0ubWFwKGl0ID0+IG5ldyBQb3NpdGlvbihpdCwgcG9zaXRpb24uaCAtIDEpKTtcblx0XHRyZXR1cm4gXy5mbGF0TWFwKFtzdWJQb3NpdGlvbjEsIHN1YlBvc2l0aW9uMiwgc3ViUG9zaXRpb24zLCBzdWJQb3NpdGlvbjRdKS5maWx0ZXIoaXQgPT4ge1xuXHRcdFx0cmV0dXJuIGl0LncgPj0gMCAmJiBpdC5oID49IDAgJiYgaXQudyA8IHRoaXMuZ3JpZC53aWR0aCAmJiBpdC5oIDwgdGhpcy5ncmlkLmhlaWdodDtcblx0XHR9KTtcblx0fVxuXHRwdWJsaWMgZXF1YWxzKG90aGVyOiBCb3gpIHtcblx0XHRyZXR1cm4gb3RoZXIgIT0gbnVsbCAmJiB0aGlzLmdldFBvc3Rpb24oKS5lcXVhbHMob3RoZXIuZ2V0UG9zdGlvbigpKTtcblx0fVxufVxuXG5jbGFzcyBQb3NpdGlvbiB7XG5cdGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSB3OiBudW1iZXIsIHB1YmxpYyByZWFkb25seSBoOiBudW1iZXIpIHt9XG5cdHB1YmxpYyB0b1N0cmluZygpIHtcblx0XHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkoe1xuXHRcdFx0dzogdGhpcy53LFxuXHRcdFx0aDogdGhpcy5oXG5cdFx0fSk7XG5cdH1cblx0cHVibGljIGVxdWFscyhwb3NpdGlvbjogUG9zaXRpb24pIHtcblx0XHRyZXR1cm4gdGhpcy53ID09PSBwb3NpdGlvbi53ICYmIHRoaXMuaCA9PT0gcG9zaXRpb24uaDtcblx0fVxuXHRwdWJsaWMgc3RhdGljIG9mKHg6IG51bWJlciwgeTogbnVtYmVyKTogUG9zaXRpb24ge1xuXHRcdHJldHVybiBuZXcgUG9zaXRpb24oeCwgeSk7XG5cdH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9wYWdlL2FzdGFyL2FzdGFyLnRzeCIsIm1vZHVsZS5leHBvcnRzID0gKF9fd2VicGFja19yZXF1aXJlX18oMCkpKDQ4KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBkZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIGZyb20gZGxsLXJlZmVyZW5jZSB2ZW5kb3Jcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDIgMyA0IDUiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbi8qIGVzbGludC1kaXNhYmxlIHNvcnQta2V5cyAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIGJvcmRlclxuICogQHByb3BlcnR5IHtzdHJpbmd9IHRvcEJvZHlcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0b3BKb2luXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdG9wTGVmdFxuICogQHByb3BlcnR5IHtzdHJpbmd9IHRvcFJpZ2h0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gYm90dG9tQm9keVxuICogQHByb3BlcnR5IHtzdHJpbmd9IGJvdHRvbUpvaW5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBib3R0b21MZWZ0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gYm90dG9tUmlnaHRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBib2R5TGVmdFxuICogQHByb3BlcnR5IHtzdHJpbmd9IGJvZHlSaWdodFxuICogQHByb3BlcnR5IHtzdHJpbmd9IGJvZHlKb2luXG4gKiBAcHJvcGVydHkge3N0cmluZ30gam9pbkJvZHlcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBqb2luTGVmdFxuICogQHByb3BlcnR5IHtzdHJpbmd9IGpvaW5SaWdodFxuICogQHByb3BlcnR5IHtzdHJpbmd9IGpvaW5Kb2luXG4gKi9cblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICogQHJldHVybnMge2JvcmRlcn1cbiAqL1xuZXhwb3J0cy5kZWZhdWx0ID0gbmFtZSA9PiB7XG4gIGlmIChuYW1lID09PSAnaG9uZXl3ZWxsJykge1xuICAgIHJldHVybiB7XG4gICAgICB0b3BCb2R5OiAn4pWQJyxcbiAgICAgIHRvcEpvaW46ICfilaQnLFxuICAgICAgdG9wTGVmdDogJ+KVlCcsXG4gICAgICB0b3BSaWdodDogJ+KVlycsXG5cbiAgICAgIGJvdHRvbUJvZHk6ICfilZAnLFxuICAgICAgYm90dG9tSm9pbjogJ+KVpycsXG4gICAgICBib3R0b21MZWZ0OiAn4pWaJyxcbiAgICAgIGJvdHRvbVJpZ2h0OiAn4pWdJyxcblxuICAgICAgYm9keUxlZnQ6ICfilZEnLFxuICAgICAgYm9keVJpZ2h0OiAn4pWRJyxcbiAgICAgIGJvZHlKb2luOiAn4pSCJyxcblxuICAgICAgam9pbkJvZHk6ICfilIAnLFxuICAgICAgam9pbkxlZnQ6ICfilZ8nLFxuICAgICAgam9pblJpZ2h0OiAn4pWiJyxcbiAgICAgIGpvaW5Kb2luOiAn4pS8J1xuICAgIH07XG4gIH1cblxuICBpZiAobmFtZSA9PT0gJ25vcmMnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRvcEJvZHk6ICfilIAnLFxuICAgICAgdG9wSm9pbjogJ+KUrCcsXG4gICAgICB0b3BMZWZ0OiAn4pSMJyxcbiAgICAgIHRvcFJpZ2h0OiAn4pSQJyxcblxuICAgICAgYm90dG9tQm9keTogJ+KUgCcsXG4gICAgICBib3R0b21Kb2luOiAn4pS0JyxcbiAgICAgIGJvdHRvbUxlZnQ6ICfilJQnLFxuICAgICAgYm90dG9tUmlnaHQ6ICfilJgnLFxuXG4gICAgICBib2R5TGVmdDogJ+KUgicsXG4gICAgICBib2R5UmlnaHQ6ICfilIInLFxuICAgICAgYm9keUpvaW46ICfilIInLFxuXG4gICAgICBqb2luQm9keTogJ+KUgCcsXG4gICAgICBqb2luTGVmdDogJ+KUnCcsXG4gICAgICBqb2luUmlnaHQ6ICfilKQnLFxuICAgICAgam9pbkpvaW46ICfilLwnXG4gICAgfTtcbiAgfVxuXG4gIGlmIChuYW1lID09PSAncmFtYWMnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRvcEJvZHk6ICctJyxcbiAgICAgIHRvcEpvaW46ICcrJyxcbiAgICAgIHRvcExlZnQ6ICcrJyxcbiAgICAgIHRvcFJpZ2h0OiAnKycsXG5cbiAgICAgIGJvdHRvbUJvZHk6ICctJyxcbiAgICAgIGJvdHRvbUpvaW46ICcrJyxcbiAgICAgIGJvdHRvbUxlZnQ6ICcrJyxcbiAgICAgIGJvdHRvbVJpZ2h0OiAnKycsXG5cbiAgICAgIGJvZHlMZWZ0OiAnfCcsXG4gICAgICBib2R5UmlnaHQ6ICd8JyxcbiAgICAgIGJvZHlKb2luOiAnfCcsXG5cbiAgICAgIGpvaW5Cb2R5OiAnLScsXG4gICAgICBqb2luTGVmdDogJ3wnLFxuICAgICAgam9pblJpZ2h0OiAnfCcsXG4gICAgICBqb2luSm9pbjogJ3wnXG4gICAgfTtcbiAgfVxuXG4gIGlmIChuYW1lID09PSAndm9pZCcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdG9wQm9keTogJycsXG4gICAgICB0b3BKb2luOiAnJyxcbiAgICAgIHRvcExlZnQ6ICcnLFxuICAgICAgdG9wUmlnaHQ6ICcnLFxuXG4gICAgICBib3R0b21Cb2R5OiAnJyxcbiAgICAgIGJvdHRvbUpvaW46ICcnLFxuICAgICAgYm90dG9tTGVmdDogJycsXG4gICAgICBib3R0b21SaWdodDogJycsXG5cbiAgICAgIGJvZHlMZWZ0OiAnJyxcbiAgICAgIGJvZHlSaWdodDogJycsXG4gICAgICBib2R5Sm9pbjogJycsXG5cbiAgICAgIGpvaW5Cb2R5OiAnJyxcbiAgICAgIGpvaW5MZWZ0OiAnJyxcbiAgICAgIGpvaW5SaWdodDogJycsXG4gICAgICBqb2luSm9pbjogJydcbiAgICB9O1xuICB9XG5cbiAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGJvcmRlciB0ZW1wbGF0ZSBcIicgKyBuYW1lICsgJ1wiLicpO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vdGFibGUvZGlzdC9nZXRCb3JkZXJDaGFyYWN0ZXJzLmpzXG4vLyBtb2R1bGUgaWQgPSAyMFxuLy8gbW9kdWxlIGNodW5rcyA9IDMgNCIsIm1vZHVsZS5leHBvcnRzID0gKF9fd2VicGFja19yZXF1aXJlX18oMCkpKDc2KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBkZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvanF1ZXJ5L2Rpc3QvanF1ZXJ5LmpzIGZyb20gZGxsLXJlZmVyZW5jZSB2ZW5kb3Jcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAxIDIgMyA0IDYgOCA5IDEwIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgaXNGdWxsd2lkdGhDb2RlUG9pbnQgPSByZXF1aXJlKCdpcy1mdWxsd2lkdGgtY29kZS1wb2ludCcpO1xuXG5jb25zdCBFU0NBUEVTID0gW1xuXHQnXFx1MDAxQicsXG5cdCdcXHUwMDlCJ1xuXTtcblxuY29uc3QgRU5EX0NPREUgPSAzOTtcbmNvbnN0IEFTVFJBTF9SRUdFWCA9IC9bXFx1RDgwMC1cXHVEQkZGXVtcXHVEQzAwLVxcdURGRkZdLztcblxuY29uc3QgRVNDQVBFX0NPREVTID0gbmV3IE1hcChbXG5cdFswLCAwXSxcblx0WzEsIDIyXSxcblx0WzIsIDIyXSxcblx0WzMsIDIzXSxcblx0WzQsIDI0XSxcblx0WzcsIDI3XSxcblx0WzgsIDI4XSxcblx0WzksIDI5XSxcblx0WzMwLCAzOV0sXG5cdFszMSwgMzldLFxuXHRbMzIsIDM5XSxcblx0WzMzLCAzOV0sXG5cdFszNCwgMzldLFxuXHRbMzUsIDM5XSxcblx0WzM2LCAzOV0sXG5cdFszNywgMzldLFxuXHRbOTAsIDM5XSxcblx0WzQwLCA0OV0sXG5cdFs0MSwgNDldLFxuXHRbNDIsIDQ5XSxcblx0WzQzLCA0OV0sXG5cdFs0NCwgNDldLFxuXHRbNDUsIDQ5XSxcblx0WzQ2LCA0OV0sXG5cdFs0NywgNDldXG5dKTtcblxuY29uc3Qgd3JhcEFuc2kgPSBjb2RlID0+IGAke0VTQ0FQRVNbMF19WyR7Y29kZX1tYDtcblxubW9kdWxlLmV4cG9ydHMgPSAoc3RyLCBiZWdpbiwgZW5kKSA9PiB7XG5cdGNvbnN0IGFyciA9IEFycmF5LmZyb20oc3RyLm5vcm1hbGl6ZSgpKTtcblxuXHRlbmQgPSB0eXBlb2YgZW5kID09PSAnbnVtYmVyJyA/IGVuZCA6IGFyci5sZW5ndGg7XG5cblx0bGV0IGluc2lkZUVzY2FwZSA9IGZhbHNlO1xuXHRsZXQgZXNjYXBlQ29kZTtcblx0bGV0IHZpc2libGUgPSAwO1xuXHRsZXQgb3V0cHV0ID0gJyc7XG5cblx0Zm9yIChjb25zdCBpdGVtIG9mIGFyci5lbnRyaWVzKCkpIHtcblx0XHRjb25zdCBpID0gaXRlbVswXTtcblx0XHRjb25zdCB4ID0gaXRlbVsxXTtcblxuXHRcdGxldCBsZWZ0RXNjYXBlID0gZmFsc2U7XG5cblx0XHRpZiAoRVNDQVBFUy5pbmRleE9mKHgpICE9PSAtMSkge1xuXHRcdFx0aW5zaWRlRXNjYXBlID0gdHJ1ZTtcblx0XHRcdGNvbnN0IGNvZGUgPSAvXFxkW15tXSovLmV4ZWMoc3RyLnNsaWNlKGksIGkgKyA0KSk7XG5cdFx0XHRlc2NhcGVDb2RlID0gY29kZSA9PT0gRU5EX0NPREUgPyBudWxsIDogY29kZTtcblx0XHR9IGVsc2UgaWYgKGluc2lkZUVzY2FwZSAmJiB4ID09PSAnbScpIHtcblx0XHRcdGluc2lkZUVzY2FwZSA9IGZhbHNlO1xuXHRcdFx0bGVmdEVzY2FwZSA9IHRydWU7XG5cdFx0fVxuXG5cdFx0aWYgKCFpbnNpZGVFc2NhcGUgJiYgIWxlZnRFc2NhcGUpIHtcblx0XHRcdCsrdmlzaWJsZTtcblx0XHR9XG5cblx0XHRpZiAoIUFTVFJBTF9SRUdFWC50ZXN0KHgpICYmIGlzRnVsbHdpZHRoQ29kZVBvaW50KHguY29kZVBvaW50QXQoKSkpIHtcblx0XHRcdCsrdmlzaWJsZTtcblx0XHR9XG5cblx0XHRpZiAodmlzaWJsZSA+IGJlZ2luICYmIHZpc2libGUgPD0gZW5kKSB7XG5cdFx0XHRvdXRwdXQgKz0geDtcblx0XHR9IGVsc2UgaWYgKHZpc2libGUgPT09IGJlZ2luICYmICFpbnNpZGVFc2NhcGUgJiYgZXNjYXBlQ29kZSAhPT0gdW5kZWZpbmVkICYmIGVzY2FwZUNvZGUgIT09IEVORF9DT0RFKSB7XG5cdFx0XHRvdXRwdXQgKz0gd3JhcEFuc2koZXNjYXBlQ29kZSk7XG5cdFx0fSBlbHNlIGlmICh2aXNpYmxlID49IGVuZCkge1xuXHRcdFx0aWYgKGVzY2FwZUNvZGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRvdXRwdXQgKz0gd3JhcEFuc2koRVNDQVBFX0NPREVTLmdldChwYXJzZUludChlc2NhcGVDb2RlLCAxMCkpIHx8IEVORF9DT0RFKTtcblx0XHRcdH1cblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBvdXRwdXQ7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3NsaWNlLWFuc2kvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDQxXG4vLyBtb2R1bGUgY2h1bmtzID0gMyA0IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX3N0cmluZ1dpZHRoID0gcmVxdWlyZSgnc3RyaW5nLXdpZHRoJyk7XG5cbnZhciBfc3RyaW5nV2lkdGgyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RyaW5nV2lkdGgpO1xuXG52YXIgX2FsaWduU3RyaW5nID0gcmVxdWlyZSgnLi9hbGlnblN0cmluZycpO1xuXG52YXIgX2FsaWduU3RyaW5nMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2FsaWduU3RyaW5nKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuLyoqXG4gKiBAcGFyYW0ge3RhYmxlfnJvd1tdfSByb3dzXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXG4gKiBAcmV0dXJucyB7dGFibGV+cm93W119XG4gKi9cbmV4cG9ydHMuZGVmYXVsdCA9IChyb3dzLCBjb25maWcpID0+IHtcbiAgcmV0dXJuIHJvd3MubWFwKGNlbGxzID0+IHtcbiAgICByZXR1cm4gY2VsbHMubWFwKCh2YWx1ZSwgaW5kZXgxKSA9PiB7XG4gICAgICBjb25zdCBjb2x1bW4gPSBjb25maWcuY29sdW1uc1tpbmRleDFdO1xuXG4gICAgICBpZiAoKDAsIF9zdHJpbmdXaWR0aDIuZGVmYXVsdCkodmFsdWUpID09PSBjb2x1bW4ud2lkdGgpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuICgwLCBfYWxpZ25TdHJpbmcyLmRlZmF1bHQpKHZhbHVlLCBjb2x1bW4ud2lkdGgsIGNvbHVtbi5hbGlnbm1lbnQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3RhYmxlL2Rpc3QvYWxpZ25UYWJsZURhdGEuanNcbi8vIG1vZHVsZSBpZCA9IDQ1XG4vLyBtb2R1bGUgY2h1bmtzID0gMyA0IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX3N0cmluZ1dpZHRoID0gcmVxdWlyZSgnc3RyaW5nLXdpZHRoJyk7XG5cbnZhciBfc3RyaW5nV2lkdGgyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RyaW5nV2lkdGgpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG4vKipcbiAqIENhbGN1bGF0ZXMgd2lkdGggb2YgZWFjaCBjZWxsIGNvbnRlbnRzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nW119IGNlbGxzXG4gKiBAcmV0dXJucyB7bnVtYmVyW119XG4gKi9cbmV4cG9ydHMuZGVmYXVsdCA9IGNlbGxzID0+IHtcbiAgcmV0dXJuIGNlbGxzLm1hcCh2YWx1ZSA9PiB7XG4gICAgcmV0dXJuICgwLCBfc3RyaW5nV2lkdGgyLmRlZmF1bHQpKHZhbHVlKTtcbiAgfSk7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi90YWJsZS9kaXN0L2NhbGN1bGF0ZUNlbGxXaWR0aEluZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA0NlxuLy8gbW9kdWxlIGNodW5rcyA9IDMgNCIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9sb2Rhc2ggPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxudmFyIF9sb2Rhc2gyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbG9kYXNoKTtcblxudmFyIF9jYWxjdWxhdGVDZWxsSGVpZ2h0ID0gcmVxdWlyZSgnLi9jYWxjdWxhdGVDZWxsSGVpZ2h0Jyk7XG5cbnZhciBfY2FsY3VsYXRlQ2VsbEhlaWdodDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jYWxjdWxhdGVDZWxsSGVpZ2h0KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSB2ZXJ0aWNhbCByb3cgc3BhbiBpbmRleC5cbiAqXG4gKiBAcGFyYW0ge0FycmF5W119IHJvd3NcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcbiAqIEByZXR1cm5zIHtudW1iZXJbXX1cbiAqL1xuZXhwb3J0cy5kZWZhdWx0ID0gKHJvd3MsIGNvbmZpZykgPT4ge1xuICBjb25zdCB0YWJsZVdpZHRoID0gcm93c1swXS5sZW5ndGg7XG5cbiAgY29uc3Qgcm93U3BhbkluZGV4ID0gW107XG5cbiAgX2xvZGFzaDIuZGVmYXVsdC5mb3JFYWNoKHJvd3MsIGNlbGxzID0+IHtcbiAgICBjb25zdCBjZWxsSGVpZ2h0SW5kZXggPSBfbG9kYXNoMi5kZWZhdWx0LmZpbGwoQXJyYXkodGFibGVXaWR0aCksIDEpO1xuXG4gICAgX2xvZGFzaDIuZGVmYXVsdC5mb3JFYWNoKGNlbGxzLCAodmFsdWUsIGluZGV4MSkgPT4ge1xuICAgICAgaWYgKCFfbG9kYXNoMi5kZWZhdWx0LmlzTnVtYmVyKGNvbmZpZy5jb2x1bW5zW2luZGV4MV0ud2lkdGgpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2NvbHVtbltpbmRleF0ud2lkdGggbXVzdCBiZSBhIG51bWJlci4nKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFfbG9kYXNoMi5kZWZhdWx0LmlzQm9vbGVhbihjb25maWcuY29sdW1uc1tpbmRleDFdLndyYXBXb3JkKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdjb2x1bW5baW5kZXhdLndyYXBXb3JkIG11c3QgYmUgYSBib29sZWFuLicpO1xuICAgICAgfVxuXG4gICAgICBjZWxsSGVpZ2h0SW5kZXhbaW5kZXgxXSA9ICgwLCBfY2FsY3VsYXRlQ2VsbEhlaWdodDIuZGVmYXVsdCkodmFsdWUsIGNvbmZpZy5jb2x1bW5zW2luZGV4MV0ud2lkdGgsIGNvbmZpZy5jb2x1bW5zW2luZGV4MV0ud3JhcFdvcmQpO1xuICAgIH0pO1xuXG4gICAgcm93U3BhbkluZGV4LnB1c2goX2xvZGFzaDIuZGVmYXVsdC5tYXgoY2VsbEhlaWdodEluZGV4KSk7XG4gIH0pO1xuXG4gIHJldHVybiByb3dTcGFuSW5kZXg7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi90YWJsZS9kaXN0L2NhbGN1bGF0ZVJvd0hlaWdodEluZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA0N1xuLy8gbW9kdWxlIGNodW5rcyA9IDMgNCIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZHJhd0JvcmRlclRvcCA9IGV4cG9ydHMuZHJhd0JvcmRlckpvaW4gPSBleHBvcnRzLmRyYXdCb3JkZXJCb3R0b20gPSBleHBvcnRzLmRyYXdCb3JkZXIgPSB1bmRlZmluZWQ7XG5cbnZhciBfbG9kYXNoID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbnZhciBfbG9kYXNoMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2xvZGFzaCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbi8qKlxuICogQHR5cGVkZWYgZHJhd0JvcmRlcn5wYXJ0c1xuICogQHByb3BlcnR5IHtzdHJpbmd9IGxlZnRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSByaWdodFxuICogQHByb3BlcnR5IHtzdHJpbmd9IGJvZHlcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBqb2luXG4gKi9cblxuLyoqXG4gKiBAcGFyYW0ge251bWJlcltdfSBjb2x1bW5TaXplSW5kZXhcbiAqIEBwYXJhbSB7ZHJhd0JvcmRlcn5wYXJ0c30gcGFydHNcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmNvbnN0IGRyYXdCb3JkZXIgPSAoY29sdW1uU2l6ZUluZGV4LCBwYXJ0cykgPT4ge1xuICBjb25zdCBjb2x1bW5zID0gX2xvZGFzaDIuZGVmYXVsdC5tYXAoY29sdW1uU2l6ZUluZGV4LCBzaXplID0+IHtcbiAgICByZXR1cm4gX2xvZGFzaDIuZGVmYXVsdC5yZXBlYXQocGFydHMuYm9keSwgc2l6ZSk7XG4gIH0pLmpvaW4ocGFydHMuam9pbik7XG5cbiAgcmV0dXJuIHBhcnRzLmxlZnQgKyBjb2x1bW5zICsgcGFydHMucmlnaHQgKyAnXFxuJztcbn07XG5cbi8qKlxuICogQHR5cGVkZWYgZHJhd0JvcmRlclRvcH5wYXJ0c1xuICogQHByb3BlcnR5IHtzdHJpbmd9IHRvcExlZnRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0b3BSaWdodFxuICogQHByb3BlcnR5IHtzdHJpbmd9IHRvcEJvZHlcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0b3BKb2luXG4gKi9cblxuLyoqXG4gKiBAcGFyYW0ge251bWJlcltdfSBjb2x1bW5TaXplSW5kZXhcbiAqIEBwYXJhbSB7ZHJhd0JvcmRlclRvcH5wYXJ0c30gcGFydHNcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmNvbnN0IGRyYXdCb3JkZXJUb3AgPSAoY29sdW1uU2l6ZUluZGV4LCBwYXJ0cykgPT4ge1xuICByZXR1cm4gZHJhd0JvcmRlcihjb2x1bW5TaXplSW5kZXgsIHtcbiAgICBib2R5OiBwYXJ0cy50b3BCb2R5LFxuICAgIGpvaW46IHBhcnRzLnRvcEpvaW4sXG4gICAgbGVmdDogcGFydHMudG9wTGVmdCxcbiAgICByaWdodDogcGFydHMudG9wUmlnaHRcbiAgfSk7XG59O1xuXG4vKipcbiAqIEB0eXBlZGVmIGRyYXdCb3JkZXJKb2lufnBhcnRzXG4gKiBAcHJvcGVydHkge3N0cmluZ30gam9pbkxlZnRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBqb2luUmlnaHRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBqb2luQm9keVxuICogQHByb3BlcnR5IHtzdHJpbmd9IGpvaW5Kb2luXG4gKi9cblxuLyoqXG4gKiBAcGFyYW0ge251bWJlcltdfSBjb2x1bW5TaXplSW5kZXhcbiAqIEBwYXJhbSB7ZHJhd0JvcmRlckpvaW5+cGFydHN9IHBhcnRzXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5jb25zdCBkcmF3Qm9yZGVySm9pbiA9IChjb2x1bW5TaXplSW5kZXgsIHBhcnRzKSA9PiB7XG4gIHJldHVybiBkcmF3Qm9yZGVyKGNvbHVtblNpemVJbmRleCwge1xuICAgIGJvZHk6IHBhcnRzLmpvaW5Cb2R5LFxuICAgIGpvaW46IHBhcnRzLmpvaW5Kb2luLFxuICAgIGxlZnQ6IHBhcnRzLmpvaW5MZWZ0LFxuICAgIHJpZ2h0OiBwYXJ0cy5qb2luUmlnaHRcbiAgfSk7XG59O1xuXG4vKipcbiAqIEB0eXBlZGVmIGRyYXdCb3JkZXJCb3R0b21+cGFydHNcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0b3BMZWZ0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gdG9wUmlnaHRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0b3BCb2R5XG4gKiBAcHJvcGVydHkge3N0cmluZ30gdG9wSm9pblxuICovXG5cbi8qKlxuICogQHBhcmFtIHtudW1iZXJbXX0gY29sdW1uU2l6ZUluZGV4XG4gKiBAcGFyYW0ge2RyYXdCb3JkZXJCb3R0b21+cGFydHN9IHBhcnRzXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5jb25zdCBkcmF3Qm9yZGVyQm90dG9tID0gKGNvbHVtblNpemVJbmRleCwgcGFydHMpID0+IHtcbiAgcmV0dXJuIGRyYXdCb3JkZXIoY29sdW1uU2l6ZUluZGV4LCB7XG4gICAgYm9keTogcGFydHMuYm90dG9tQm9keSxcbiAgICBqb2luOiBwYXJ0cy5ib3R0b21Kb2luLFxuICAgIGxlZnQ6IHBhcnRzLmJvdHRvbUxlZnQsXG4gICAgcmlnaHQ6IHBhcnRzLmJvdHRvbVJpZ2h0XG4gIH0pO1xufTtcblxuZXhwb3J0cy5kcmF3Qm9yZGVyID0gZHJhd0JvcmRlcjtcbmV4cG9ydHMuZHJhd0JvcmRlckJvdHRvbSA9IGRyYXdCb3JkZXJCb3R0b207XG5leHBvcnRzLmRyYXdCb3JkZXJKb2luID0gZHJhd0JvcmRlckpvaW47XG5leHBvcnRzLmRyYXdCb3JkZXJUb3AgPSBkcmF3Qm9yZGVyVG9wO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi90YWJsZS9kaXN0L2RyYXdCb3JkZXIuanNcbi8vIG1vZHVsZSBpZCA9IDQ4XG4vLyBtb2R1bGUgY2h1bmtzID0gMyA0IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IGRyYXdSb3d+Ym9yZGVyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gYm9keUxlZnRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBib2R5UmlnaHRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBib2R5Sm9pblxuICovXG5cbi8qKlxuICogQHBhcmFtIHtudW1iZXJbXX0gY29sdW1uc1xuICogQHBhcmFtIHtkcmF3Um93fmJvcmRlcn0gYm9yZGVyXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5leHBvcnRzLmRlZmF1bHQgPSAoY29sdW1ucywgYm9yZGVyKSA9PiB7XG4gIHJldHVybiBib3JkZXIuYm9keUxlZnQgKyBjb2x1bW5zLmpvaW4oYm9yZGVyLmJvZHlKb2luKSArIGJvcmRlci5ib2R5UmlnaHQgKyAnXFxuJztcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3RhYmxlL2Rpc3QvZHJhd1Jvdy5qc1xuLy8gbW9kdWxlIGlkID0gNDlcbi8vIG1vZHVsZSBjaHVua3MgPSAzIDQiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfbG9kYXNoID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbnZhciBfbG9kYXNoMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2xvZGFzaCk7XG5cbnZhciBfd3JhcFN0cmluZyA9IHJlcXVpcmUoJy4vd3JhcFN0cmluZycpO1xuXG52YXIgX3dyYXBTdHJpbmcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfd3JhcFN0cmluZyk7XG5cbnZhciBfd3JhcFdvcmQgPSByZXF1aXJlKCcuL3dyYXBXb3JkJyk7XG5cbnZhciBfd3JhcFdvcmQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfd3JhcFdvcmQpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG4vKipcbiAqIEBwYXJhbSB7QXJyYXl9IHVubWFwcGVkUm93c1xuICogQHBhcmFtIHtudW1iZXJbXX0gcm93SGVpZ2h0SW5kZXhcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcbiAqIEByZXR1cm5zIHtBcnJheX1cbiAqL1xuZXhwb3J0cy5kZWZhdWx0ID0gKHVubWFwcGVkUm93cywgcm93SGVpZ2h0SW5kZXgsIGNvbmZpZykgPT4ge1xuICBjb25zdCB0YWJsZVdpZHRoID0gdW5tYXBwZWRSb3dzWzBdLmxlbmd0aDtcblxuICBjb25zdCBtYXBwZWRSb3dzID0gdW5tYXBwZWRSb3dzLm1hcCgoY2VsbHMsIGluZGV4MCkgPT4ge1xuICAgIGNvbnN0IHJvd0hlaWdodCA9IF9sb2Rhc2gyLmRlZmF1bHQudGltZXMocm93SGVpZ2h0SW5kZXhbaW5kZXgwXSwgKCkgPT4ge1xuICAgICAgcmV0dXJuIF9sb2Rhc2gyLmRlZmF1bHQuZmlsbChBcnJheSh0YWJsZVdpZHRoKSwgJycpO1xuICAgIH0pO1xuXG4gICAgLy8gcm93SGVpZ2h0XG4gICAgLy8gICAgIFt7cm93IGluZGV4IHdpdGhpbiByb3dTYXc7IGluZGV4Mn1dXG4gICAgLy8gICAgIFt7Y2VsbCBpbmRleCB3aXRoaW4gYSB2aXJ0dWFsIHJvdzsgaW5kZXgxfV1cblxuICAgIF9sb2Rhc2gyLmRlZmF1bHQuZm9yRWFjaChjZWxscywgKHZhbHVlLCBpbmRleDEpID0+IHtcbiAgICAgIGxldCBjaHVua2VkVmFsdWU7XG5cbiAgICAgIGlmIChjb25maWcuY29sdW1uc1tpbmRleDFdLndyYXBXb3JkKSB7XG4gICAgICAgIGNodW5rZWRWYWx1ZSA9ICgwLCBfd3JhcFdvcmQyLmRlZmF1bHQpKHZhbHVlLCBjb25maWcuY29sdW1uc1tpbmRleDFdLndpZHRoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNodW5rZWRWYWx1ZSA9ICgwLCBfd3JhcFN0cmluZzIuZGVmYXVsdCkodmFsdWUsIGNvbmZpZy5jb2x1bW5zW2luZGV4MV0ud2lkdGgpO1xuICAgICAgfVxuXG4gICAgICBfbG9kYXNoMi5kZWZhdWx0LmZvckVhY2goY2h1bmtlZFZhbHVlLCAocGFydCwgaW5kZXgyKSA9PiB7XG4gICAgICAgIHJvd0hlaWdodFtpbmRleDJdW2luZGV4MV0gPSBwYXJ0O1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcm93SGVpZ2h0O1xuICB9KTtcblxuICByZXR1cm4gX2xvZGFzaDIuZGVmYXVsdC5mbGF0dGVuKG1hcHBlZFJvd3MpO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vdGFibGUvZGlzdC9tYXBEYXRhVXNpbmdSb3dIZWlnaHRJbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gNTBcbi8vIG1vZHVsZSBjaHVua3MgPSAzIDQiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfbG9kYXNoID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbnZhciBfbG9kYXNoMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2xvZGFzaCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbi8qKlxuICogQHBhcmFtIHt0YWJsZX5yb3dbXX0gcm93c1xuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xuICogQHJldHVybnMge3RhYmxlfnJvd1tdfVxuICovXG5leHBvcnRzLmRlZmF1bHQgPSAocm93cywgY29uZmlnKSA9PiB7XG4gIHJldHVybiBfbG9kYXNoMi5kZWZhdWx0Lm1hcChyb3dzLCBjZWxscyA9PiB7XG4gICAgcmV0dXJuIF9sb2Rhc2gyLmRlZmF1bHQubWFwKGNlbGxzLCAodmFsdWUsIGluZGV4MSkgPT4ge1xuICAgICAgY29uc3QgY29sdW1uID0gY29uZmlnLmNvbHVtbnNbaW5kZXgxXTtcblxuICAgICAgcmV0dXJuIF9sb2Rhc2gyLmRlZmF1bHQucmVwZWF0KCcgJywgY29sdW1uLnBhZGRpbmdMZWZ0KSArIHZhbHVlICsgX2xvZGFzaDIuZGVmYXVsdC5yZXBlYXQoJyAnLCBjb2x1bW4ucGFkZGluZ1JpZ2h0KTtcbiAgICB9KTtcbiAgfSk7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi90YWJsZS9kaXN0L3BhZFRhYmxlRGF0YS5qc1xuLy8gbW9kdWxlIGlkID0gNTFcbi8vIG1vZHVsZSBjaHVua3MgPSAzIDQiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxuLyoqXG4gKiBDYXN0cyBhbGwgY2VsbCB2YWx1ZXMgdG8gYSBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHt0YWJsZX5yb3dbXX0gcm93c1xuICogQHJldHVybnMge3RhYmxlfnJvd1tdfVxuICovXG5leHBvcnRzLmRlZmF1bHQgPSByb3dzID0+IHtcbiAgcmV0dXJuIHJvd3MubWFwKGNlbGxzID0+IHtcbiAgICByZXR1cm4gY2VsbHMubWFwKFN0cmluZyk7XG4gIH0pO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vdGFibGUvZGlzdC9zdHJpbmdpZnlUYWJsZURhdGEuanNcbi8vIG1vZHVsZSBpZCA9IDUyXG4vLyBtb2R1bGUgY2h1bmtzID0gMyA0IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2xvZGFzaCA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG52YXIgX2xvZGFzaDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9sb2Rhc2gpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG4vKipcbiAqIEB0b2RvIE1ha2UgaXQgd29yayB3aXRoIEFTQ0lJIGNvbnRlbnQuXG4gKiBAcGFyYW0ge3RhYmxlfnJvd1tdfSByb3dzXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXG4gKiBAcmV0dXJucyB7dGFibGV+cm93W119XG4gKi9cbmV4cG9ydHMuZGVmYXVsdCA9IChyb3dzLCBjb25maWcpID0+IHtcbiAgcmV0dXJuIF9sb2Rhc2gyLmRlZmF1bHQubWFwKHJvd3MsIGNlbGxzID0+IHtcbiAgICByZXR1cm4gX2xvZGFzaDIuZGVmYXVsdC5tYXAoY2VsbHMsIChjb250ZW50LCBpbmRleCkgPT4ge1xuICAgICAgcmV0dXJuIF9sb2Rhc2gyLmRlZmF1bHQudHJ1bmNhdGUoY29udGVudCwge1xuICAgICAgICBsZW5ndGg6IGNvbmZpZy5jb2x1bW5zW2luZGV4XS50cnVuY2F0ZVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vdGFibGUvZGlzdC90cnVuY2F0ZVRhYmxlRGF0YS5qc1xuLy8gbW9kdWxlIGlkID0gNTNcbi8vIG1vZHVsZSBjaHVua3MgPSAzIDQiLCIndXNlIHN0cmljdCc7XG52YXIgZXF1YWwgPSByZXF1aXJlKCdhanYvbGliL2NvbXBpbGUvZXF1YWwnKTtcbnZhciB2YWxpZGF0ZSA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHBhdHRlcm4wID0gbmV3IFJlZ0V4cCgnXlswLTldKyQnKTtcbiAgdmFyIHJlZlZhbCA9IFtdO1xuICB2YXIgcmVmVmFsMSA9IChmdW5jdGlvbigpIHtcbiAgICB2YXIgcGF0dGVybjAgPSBuZXcgUmVnRXhwKCdeWzAtOV0rJCcpO1xuICAgIHJldHVybiBmdW5jdGlvbiB2YWxpZGF0ZShkYXRhLCBkYXRhUGF0aCwgcGFyZW50RGF0YSwgcGFyZW50RGF0YVByb3BlcnR5LCByb290RGF0YSkge1xuICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgdmFyIHZFcnJvcnMgPSBudWxsO1xuICAgICAgdmFyIGVycm9ycyA9IDA7XG4gICAgICBpZiAocm9vdERhdGEgPT09IHVuZGVmaW5lZCkgcm9vdERhdGEgPSBkYXRhO1xuICAgICAgaWYgKChkYXRhICYmIHR5cGVvZiBkYXRhID09PSBcIm9iamVjdFwiICYmICFBcnJheS5pc0FycmF5KGRhdGEpKSkge1xuICAgICAgICB2YXIgZXJyc19fMCA9IGVycm9ycztcbiAgICAgICAgdmFyIHZhbGlkMSA9IHRydWU7XG4gICAgICAgIGZvciAodmFyIGtleTAgaW4gZGF0YSkge1xuICAgICAgICAgIHZhciBpc0FkZGl0aW9uYWwwID0gIShmYWxzZSB8fCB2YWxpZGF0ZS5zY2hlbWEucHJvcGVydGllc1trZXkwXSk7XG4gICAgICAgICAgaWYgKGlzQWRkaXRpb25hbDApIHtcbiAgICAgICAgICAgIHZhbGlkMSA9IGZhbHNlO1xuICAgICAgICAgICAgdmFyIGVyciA9IHtcbiAgICAgICAgICAgICAga2V5d29yZDogJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJyxcbiAgICAgICAgICAgICAgZGF0YVBhdGg6IChkYXRhUGF0aCB8fCAnJykgKyBcIlwiLFxuICAgICAgICAgICAgICBzY2hlbWFQYXRoOiAnIy9hZGRpdGlvbmFsUHJvcGVydGllcycsXG4gICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxQcm9wZXJ0eTogJycgKyBrZXkwICsgJydcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgbWVzc2FnZTogJ3Nob3VsZCBOT1QgaGF2ZSBhZGRpdGlvbmFsIHByb3BlcnRpZXMnXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTtcbiAgICAgICAgICAgIGVsc2UgdkVycm9ycy5wdXNoKGVycik7XG4gICAgICAgICAgICBlcnJvcnMrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGEudG9wQm9keSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdmFyIGVycnNfMSA9IGVycm9ycztcbiAgICAgICAgICBpZiAoIXJlZlZhbDIoZGF0YS50b3BCb2R5LCAoZGF0YVBhdGggfHwgJycpICsgJy50b3BCb2R5JywgZGF0YSwgJ3RvcEJvZHknLCByb290RGF0YSkpIHtcbiAgICAgICAgICAgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gcmVmVmFsMi5lcnJvcnM7XG4gICAgICAgICAgICBlbHNlIHZFcnJvcnMgPSB2RXJyb3JzLmNvbmNhdChyZWZWYWwyLmVycm9ycyk7XG4gICAgICAgICAgICBlcnJvcnMgPSB2RXJyb3JzLmxlbmd0aDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHZhbGlkMSA9IGVycm9ycyA9PT0gZXJyc18xO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhLnRvcEpvaW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHZhciBlcnJzXzEgPSBlcnJvcnM7XG4gICAgICAgICAgaWYgKCFyZWZWYWxbMl0oZGF0YS50b3BKb2luLCAoZGF0YVBhdGggfHwgJycpICsgJy50b3BKb2luJywgZGF0YSwgJ3RvcEpvaW4nLCByb290RGF0YSkpIHtcbiAgICAgICAgICAgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gcmVmVmFsWzJdLmVycm9ycztcbiAgICAgICAgICAgIGVsc2UgdkVycm9ycyA9IHZFcnJvcnMuY29uY2F0KHJlZlZhbFsyXS5lcnJvcnMpO1xuICAgICAgICAgICAgZXJyb3JzID0gdkVycm9ycy5sZW5ndGg7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB2YWxpZDEgPSBlcnJvcnMgPT09IGVycnNfMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YS50b3BMZWZ0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB2YXIgZXJyc18xID0gZXJyb3JzO1xuICAgICAgICAgIGlmICghcmVmVmFsWzJdKGRhdGEudG9wTGVmdCwgKGRhdGFQYXRoIHx8ICcnKSArICcudG9wTGVmdCcsIGRhdGEsICd0b3BMZWZ0Jywgcm9vdERhdGEpKSB7XG4gICAgICAgICAgICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IHJlZlZhbFsyXS5lcnJvcnM7XG4gICAgICAgICAgICBlbHNlIHZFcnJvcnMgPSB2RXJyb3JzLmNvbmNhdChyZWZWYWxbMl0uZXJyb3JzKTtcbiAgICAgICAgICAgIGVycm9ycyA9IHZFcnJvcnMubGVuZ3RoO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgdmFsaWQxID0gZXJyb3JzID09PSBlcnJzXzE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGEudG9wUmlnaHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHZhciBlcnJzXzEgPSBlcnJvcnM7XG4gICAgICAgICAgaWYgKCFyZWZWYWxbMl0oZGF0YS50b3BSaWdodCwgKGRhdGFQYXRoIHx8ICcnKSArICcudG9wUmlnaHQnLCBkYXRhLCAndG9wUmlnaHQnLCByb290RGF0YSkpIHtcbiAgICAgICAgICAgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gcmVmVmFsWzJdLmVycm9ycztcbiAgICAgICAgICAgIGVsc2UgdkVycm9ycyA9IHZFcnJvcnMuY29uY2F0KHJlZlZhbFsyXS5lcnJvcnMpO1xuICAgICAgICAgICAgZXJyb3JzID0gdkVycm9ycy5sZW5ndGg7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB2YWxpZDEgPSBlcnJvcnMgPT09IGVycnNfMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YS5ib3R0b21Cb2R5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB2YXIgZXJyc18xID0gZXJyb3JzO1xuICAgICAgICAgIGlmICghcmVmVmFsWzJdKGRhdGEuYm90dG9tQm9keSwgKGRhdGFQYXRoIHx8ICcnKSArICcuYm90dG9tQm9keScsIGRhdGEsICdib3R0b21Cb2R5Jywgcm9vdERhdGEpKSB7XG4gICAgICAgICAgICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IHJlZlZhbFsyXS5lcnJvcnM7XG4gICAgICAgICAgICBlbHNlIHZFcnJvcnMgPSB2RXJyb3JzLmNvbmNhdChyZWZWYWxbMl0uZXJyb3JzKTtcbiAgICAgICAgICAgIGVycm9ycyA9IHZFcnJvcnMubGVuZ3RoO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgdmFsaWQxID0gZXJyb3JzID09PSBlcnJzXzE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGEuYm90dG9tSm9pbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdmFyIGVycnNfMSA9IGVycm9ycztcbiAgICAgICAgICBpZiAoIXJlZlZhbFsyXShkYXRhLmJvdHRvbUpvaW4sIChkYXRhUGF0aCB8fCAnJykgKyAnLmJvdHRvbUpvaW4nLCBkYXRhLCAnYm90dG9tSm9pbicsIHJvb3REYXRhKSkge1xuICAgICAgICAgICAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSByZWZWYWxbMl0uZXJyb3JzO1xuICAgICAgICAgICAgZWxzZSB2RXJyb3JzID0gdkVycm9ycy5jb25jYXQocmVmVmFsWzJdLmVycm9ycyk7XG4gICAgICAgICAgICBlcnJvcnMgPSB2RXJyb3JzLmxlbmd0aDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHZhbGlkMSA9IGVycm9ycyA9PT0gZXJyc18xO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhLmJvdHRvbUxlZnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHZhciBlcnJzXzEgPSBlcnJvcnM7XG4gICAgICAgICAgaWYgKCFyZWZWYWxbMl0oZGF0YS5ib3R0b21MZWZ0LCAoZGF0YVBhdGggfHwgJycpICsgJy5ib3R0b21MZWZ0JywgZGF0YSwgJ2JvdHRvbUxlZnQnLCByb290RGF0YSkpIHtcbiAgICAgICAgICAgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gcmVmVmFsWzJdLmVycm9ycztcbiAgICAgICAgICAgIGVsc2UgdkVycm9ycyA9IHZFcnJvcnMuY29uY2F0KHJlZlZhbFsyXS5lcnJvcnMpO1xuICAgICAgICAgICAgZXJyb3JzID0gdkVycm9ycy5sZW5ndGg7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB2YWxpZDEgPSBlcnJvcnMgPT09IGVycnNfMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YS5ib3R0b21SaWdodCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdmFyIGVycnNfMSA9IGVycm9ycztcbiAgICAgICAgICBpZiAoIXJlZlZhbFsyXShkYXRhLmJvdHRvbVJpZ2h0LCAoZGF0YVBhdGggfHwgJycpICsgJy5ib3R0b21SaWdodCcsIGRhdGEsICdib3R0b21SaWdodCcsIHJvb3REYXRhKSkge1xuICAgICAgICAgICAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSByZWZWYWxbMl0uZXJyb3JzO1xuICAgICAgICAgICAgZWxzZSB2RXJyb3JzID0gdkVycm9ycy5jb25jYXQocmVmVmFsWzJdLmVycm9ycyk7XG4gICAgICAgICAgICBlcnJvcnMgPSB2RXJyb3JzLmxlbmd0aDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHZhbGlkMSA9IGVycm9ycyA9PT0gZXJyc18xO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhLmJvZHlMZWZ0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB2YXIgZXJyc18xID0gZXJyb3JzO1xuICAgICAgICAgIGlmICghcmVmVmFsWzJdKGRhdGEuYm9keUxlZnQsIChkYXRhUGF0aCB8fCAnJykgKyAnLmJvZHlMZWZ0JywgZGF0YSwgJ2JvZHlMZWZ0Jywgcm9vdERhdGEpKSB7XG4gICAgICAgICAgICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IHJlZlZhbFsyXS5lcnJvcnM7XG4gICAgICAgICAgICBlbHNlIHZFcnJvcnMgPSB2RXJyb3JzLmNvbmNhdChyZWZWYWxbMl0uZXJyb3JzKTtcbiAgICAgICAgICAgIGVycm9ycyA9IHZFcnJvcnMubGVuZ3RoO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgdmFsaWQxID0gZXJyb3JzID09PSBlcnJzXzE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGEuYm9keVJpZ2h0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB2YXIgZXJyc18xID0gZXJyb3JzO1xuICAgICAgICAgIGlmICghcmVmVmFsWzJdKGRhdGEuYm9keVJpZ2h0LCAoZGF0YVBhdGggfHwgJycpICsgJy5ib2R5UmlnaHQnLCBkYXRhLCAnYm9keVJpZ2h0Jywgcm9vdERhdGEpKSB7XG4gICAgICAgICAgICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IHJlZlZhbFsyXS5lcnJvcnM7XG4gICAgICAgICAgICBlbHNlIHZFcnJvcnMgPSB2RXJyb3JzLmNvbmNhdChyZWZWYWxbMl0uZXJyb3JzKTtcbiAgICAgICAgICAgIGVycm9ycyA9IHZFcnJvcnMubGVuZ3RoO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgdmFsaWQxID0gZXJyb3JzID09PSBlcnJzXzE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGEuYm9keUpvaW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHZhciBlcnJzXzEgPSBlcnJvcnM7XG4gICAgICAgICAgaWYgKCFyZWZWYWxbMl0oZGF0YS5ib2R5Sm9pbiwgKGRhdGFQYXRoIHx8ICcnKSArICcuYm9keUpvaW4nLCBkYXRhLCAnYm9keUpvaW4nLCByb290RGF0YSkpIHtcbiAgICAgICAgICAgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gcmVmVmFsWzJdLmVycm9ycztcbiAgICAgICAgICAgIGVsc2UgdkVycm9ycyA9IHZFcnJvcnMuY29uY2F0KHJlZlZhbFsyXS5lcnJvcnMpO1xuICAgICAgICAgICAgZXJyb3JzID0gdkVycm9ycy5sZW5ndGg7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB2YWxpZDEgPSBlcnJvcnMgPT09IGVycnNfMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YS5qb2luQm9keSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdmFyIGVycnNfMSA9IGVycm9ycztcbiAgICAgICAgICBpZiAoIXJlZlZhbFsyXShkYXRhLmpvaW5Cb2R5LCAoZGF0YVBhdGggfHwgJycpICsgJy5qb2luQm9keScsIGRhdGEsICdqb2luQm9keScsIHJvb3REYXRhKSkge1xuICAgICAgICAgICAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSByZWZWYWxbMl0uZXJyb3JzO1xuICAgICAgICAgICAgZWxzZSB2RXJyb3JzID0gdkVycm9ycy5jb25jYXQocmVmVmFsWzJdLmVycm9ycyk7XG4gICAgICAgICAgICBlcnJvcnMgPSB2RXJyb3JzLmxlbmd0aDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHZhbGlkMSA9IGVycm9ycyA9PT0gZXJyc18xO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhLmpvaW5MZWZ0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB2YXIgZXJyc18xID0gZXJyb3JzO1xuICAgICAgICAgIGlmICghcmVmVmFsWzJdKGRhdGEuam9pbkxlZnQsIChkYXRhUGF0aCB8fCAnJykgKyAnLmpvaW5MZWZ0JywgZGF0YSwgJ2pvaW5MZWZ0Jywgcm9vdERhdGEpKSB7XG4gICAgICAgICAgICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IHJlZlZhbFsyXS5lcnJvcnM7XG4gICAgICAgICAgICBlbHNlIHZFcnJvcnMgPSB2RXJyb3JzLmNvbmNhdChyZWZWYWxbMl0uZXJyb3JzKTtcbiAgICAgICAgICAgIGVycm9ycyA9IHZFcnJvcnMubGVuZ3RoO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgdmFsaWQxID0gZXJyb3JzID09PSBlcnJzXzE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGEuam9pblJpZ2h0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB2YXIgZXJyc18xID0gZXJyb3JzO1xuICAgICAgICAgIGlmICghcmVmVmFsWzJdKGRhdGEuam9pblJpZ2h0LCAoZGF0YVBhdGggfHwgJycpICsgJy5qb2luUmlnaHQnLCBkYXRhLCAnam9pblJpZ2h0Jywgcm9vdERhdGEpKSB7XG4gICAgICAgICAgICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IHJlZlZhbFsyXS5lcnJvcnM7XG4gICAgICAgICAgICBlbHNlIHZFcnJvcnMgPSB2RXJyb3JzLmNvbmNhdChyZWZWYWxbMl0uZXJyb3JzKTtcbiAgICAgICAgICAgIGVycm9ycyA9IHZFcnJvcnMubGVuZ3RoO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgdmFsaWQxID0gZXJyb3JzID09PSBlcnJzXzE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGEuam9pbkpvaW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHZhciBlcnJzXzEgPSBlcnJvcnM7XG4gICAgICAgICAgaWYgKCFyZWZWYWxbMl0oZGF0YS5qb2luSm9pbiwgKGRhdGFQYXRoIHx8ICcnKSArICcuam9pbkpvaW4nLCBkYXRhLCAnam9pbkpvaW4nLCByb290RGF0YSkpIHtcbiAgICAgICAgICAgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gcmVmVmFsWzJdLmVycm9ycztcbiAgICAgICAgICAgIGVsc2UgdkVycm9ycyA9IHZFcnJvcnMuY29uY2F0KHJlZlZhbFsyXS5lcnJvcnMpO1xuICAgICAgICAgICAgZXJyb3JzID0gdkVycm9ycy5sZW5ndGg7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB2YWxpZDEgPSBlcnJvcnMgPT09IGVycnNfMTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGVyciA9IHtcbiAgICAgICAgICBrZXl3b3JkOiAndHlwZScsXG4gICAgICAgICAgZGF0YVBhdGg6IChkYXRhUGF0aCB8fCAnJykgKyBcIlwiLFxuICAgICAgICAgIHNjaGVtYVBhdGg6ICcjL3R5cGUnLFxuICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCdcbiAgICAgICAgICB9LFxuICAgICAgICAgIG1lc3NhZ2U6ICdzaG91bGQgYmUgb2JqZWN0J1xuICAgICAgICB9O1xuICAgICAgICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdO1xuICAgICAgICBlbHNlIHZFcnJvcnMucHVzaChlcnIpO1xuICAgICAgICBlcnJvcnMrKztcbiAgICAgIH1cbiAgICAgIHZhbGlkYXRlLmVycm9ycyA9IHZFcnJvcnM7XG4gICAgICByZXR1cm4gZXJyb3JzID09PSAwO1xuICAgIH07XG4gIH0pKCk7XG4gIHJlZlZhbDEuc2NoZW1hID0ge1xuICAgIFwidHlwZVwiOiBcIm9iamVjdFwiLFxuICAgIFwicHJvcGVydGllc1wiOiB7XG4gICAgICBcInRvcEJvZHlcIjoge1xuICAgICAgICBcIiRyZWZcIjogXCIjL2RlZmluaXRpb25zL2JvcmRlclwiXG4gICAgICB9LFxuICAgICAgXCJ0b3BKb2luXCI6IHtcbiAgICAgICAgXCIkcmVmXCI6IFwiIy9kZWZpbml0aW9ucy9ib3JkZXJcIlxuICAgICAgfSxcbiAgICAgIFwidG9wTGVmdFwiOiB7XG4gICAgICAgIFwiJHJlZlwiOiBcIiMvZGVmaW5pdGlvbnMvYm9yZGVyXCJcbiAgICAgIH0sXG4gICAgICBcInRvcFJpZ2h0XCI6IHtcbiAgICAgICAgXCIkcmVmXCI6IFwiIy9kZWZpbml0aW9ucy9ib3JkZXJcIlxuICAgICAgfSxcbiAgICAgIFwiYm90dG9tQm9keVwiOiB7XG4gICAgICAgIFwiJHJlZlwiOiBcIiMvZGVmaW5pdGlvbnMvYm9yZGVyXCJcbiAgICAgIH0sXG4gICAgICBcImJvdHRvbUpvaW5cIjoge1xuICAgICAgICBcIiRyZWZcIjogXCIjL2RlZmluaXRpb25zL2JvcmRlclwiXG4gICAgICB9LFxuICAgICAgXCJib3R0b21MZWZ0XCI6IHtcbiAgICAgICAgXCIkcmVmXCI6IFwiIy9kZWZpbml0aW9ucy9ib3JkZXJcIlxuICAgICAgfSxcbiAgICAgIFwiYm90dG9tUmlnaHRcIjoge1xuICAgICAgICBcIiRyZWZcIjogXCIjL2RlZmluaXRpb25zL2JvcmRlclwiXG4gICAgICB9LFxuICAgICAgXCJib2R5TGVmdFwiOiB7XG4gICAgICAgIFwiJHJlZlwiOiBcIiMvZGVmaW5pdGlvbnMvYm9yZGVyXCJcbiAgICAgIH0sXG4gICAgICBcImJvZHlSaWdodFwiOiB7XG4gICAgICAgIFwiJHJlZlwiOiBcIiMvZGVmaW5pdGlvbnMvYm9yZGVyXCJcbiAgICAgIH0sXG4gICAgICBcImJvZHlKb2luXCI6IHtcbiAgICAgICAgXCIkcmVmXCI6IFwiIy9kZWZpbml0aW9ucy9ib3JkZXJcIlxuICAgICAgfSxcbiAgICAgIFwiam9pbkJvZHlcIjoge1xuICAgICAgICBcIiRyZWZcIjogXCIjL2RlZmluaXRpb25zL2JvcmRlclwiXG4gICAgICB9LFxuICAgICAgXCJqb2luTGVmdFwiOiB7XG4gICAgICAgIFwiJHJlZlwiOiBcIiMvZGVmaW5pdGlvbnMvYm9yZGVyXCJcbiAgICAgIH0sXG4gICAgICBcImpvaW5SaWdodFwiOiB7XG4gICAgICAgIFwiJHJlZlwiOiBcIiMvZGVmaW5pdGlvbnMvYm9yZGVyXCJcbiAgICAgIH0sXG4gICAgICBcImpvaW5Kb2luXCI6IHtcbiAgICAgICAgXCIkcmVmXCI6IFwiIy9kZWZpbml0aW9ucy9ib3JkZXJcIlxuICAgICAgfVxuICAgIH0sXG4gICAgXCJhZGRpdGlvbmFsUHJvcGVydGllc1wiOiBmYWxzZVxuICB9O1xuICByZWZWYWwxLmVycm9ycyA9IG51bGw7XG4gIHJlZlZhbFsxXSA9IHJlZlZhbDE7XG4gIHZhciByZWZWYWwyID0gKGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXR0ZXJuMCA9IG5ldyBSZWdFeHAoJ15bMC05XSskJyk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIHZhbGlkYXRlKGRhdGEsIGRhdGFQYXRoLCBwYXJlbnREYXRhLCBwYXJlbnREYXRhUHJvcGVydHksIHJvb3REYXRhKSB7XG4gICAgICAndXNlIHN0cmljdCc7XG4gICAgICB2YXIgdkVycm9ycyA9IG51bGw7XG4gICAgICB2YXIgZXJyb3JzID0gMDtcbiAgICAgIGlmICh0eXBlb2YgZGF0YSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICB2YXIgZXJyID0ge1xuICAgICAgICAgIGtleXdvcmQ6ICd0eXBlJyxcbiAgICAgICAgICBkYXRhUGF0aDogKGRhdGFQYXRoIHx8ICcnKSArIFwiXCIsXG4gICAgICAgICAgc2NoZW1hUGF0aDogJyMvdHlwZScsXG4gICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgbWVzc2FnZTogJ3Nob3VsZCBiZSBzdHJpbmcnXG4gICAgICAgIH07XG4gICAgICAgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gW2Vycl07XG4gICAgICAgIGVsc2UgdkVycm9ycy5wdXNoKGVycik7XG4gICAgICAgIGVycm9ycysrO1xuICAgICAgfVxuICAgICAgdmFsaWRhdGUuZXJyb3JzID0gdkVycm9ycztcbiAgICAgIHJldHVybiBlcnJvcnMgPT09IDA7XG4gICAgfTtcbiAgfSkoKTtcbiAgcmVmVmFsMi5zY2hlbWEgPSB7XG4gICAgXCJ0eXBlXCI6IFwic3RyaW5nXCJcbiAgfTtcbiAgcmVmVmFsMi5lcnJvcnMgPSBudWxsO1xuICByZWZWYWxbMl0gPSByZWZWYWwyO1xuICB2YXIgcmVmVmFsMyA9IChmdW5jdGlvbigpIHtcbiAgICB2YXIgcGF0dGVybjAgPSBuZXcgUmVnRXhwKCdeWzAtOV0rJCcpO1xuICAgIHJldHVybiBmdW5jdGlvbiB2YWxpZGF0ZShkYXRhLCBkYXRhUGF0aCwgcGFyZW50RGF0YSwgcGFyZW50RGF0YVByb3BlcnR5LCByb290RGF0YSkge1xuICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgdmFyIHZFcnJvcnMgPSBudWxsO1xuICAgICAgdmFyIGVycm9ycyA9IDA7XG4gICAgICBpZiAocm9vdERhdGEgPT09IHVuZGVmaW5lZCkgcm9vdERhdGEgPSBkYXRhO1xuICAgICAgaWYgKChkYXRhICYmIHR5cGVvZiBkYXRhID09PSBcIm9iamVjdFwiICYmICFBcnJheS5pc0FycmF5KGRhdGEpKSkge1xuICAgICAgICB2YXIgZXJyc19fMCA9IGVycm9ycztcbiAgICAgICAgdmFyIHZhbGlkMSA9IHRydWU7XG4gICAgICAgIGZvciAodmFyIGtleTAgaW4gZGF0YSkge1xuICAgICAgICAgIHZhciBpc0FkZGl0aW9uYWwwID0gIShmYWxzZSB8fCBwYXR0ZXJuMC50ZXN0KGtleTApKTtcbiAgICAgICAgICBpZiAoaXNBZGRpdGlvbmFsMCkge1xuICAgICAgICAgICAgdmFsaWQxID0gZmFsc2U7XG4gICAgICAgICAgICB2YXIgZXJyID0ge1xuICAgICAgICAgICAgICBrZXl3b3JkOiAnYWRkaXRpb25hbFByb3BlcnRpZXMnLFxuICAgICAgICAgICAgICBkYXRhUGF0aDogKGRhdGFQYXRoIHx8ICcnKSArIFwiXCIsXG4gICAgICAgICAgICAgIHNjaGVtYVBhdGg6ICcjL2FkZGl0aW9uYWxQcm9wZXJ0aWVzJyxcbiAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgYWRkaXRpb25hbFByb3BlcnR5OiAnJyArIGtleTAgKyAnJ1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBtZXNzYWdlOiAnc2hvdWxkIE5PVCBoYXZlIGFkZGl0aW9uYWwgcHJvcGVydGllcydcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdO1xuICAgICAgICAgICAgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTtcbiAgICAgICAgICAgIGVycm9ycysrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBrZXkwIGluIGRhdGEpIHtcbiAgICAgICAgICBpZiAocGF0dGVybjAudGVzdChrZXkwKSkge1xuICAgICAgICAgICAgdmFyIGVycnNfMSA9IGVycm9ycztcbiAgICAgICAgICAgIGlmICghcmVmVmFsNChkYXRhW2tleTBdLCAoZGF0YVBhdGggfHwgJycpICsgJ1tcXCcnICsga2V5MCArICdcXCddJywgZGF0YSwga2V5MCwgcm9vdERhdGEpKSB7XG4gICAgICAgICAgICAgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gcmVmVmFsNC5lcnJvcnM7XG4gICAgICAgICAgICAgIGVsc2UgdkVycm9ycyA9IHZFcnJvcnMuY29uY2F0KHJlZlZhbDQuZXJyb3JzKTtcbiAgICAgICAgICAgICAgZXJyb3JzID0gdkVycm9ycy5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdmFsaWQxID0gZXJyb3JzID09PSBlcnJzXzE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZXJyID0ge1xuICAgICAgICAgIGtleXdvcmQ6ICd0eXBlJyxcbiAgICAgICAgICBkYXRhUGF0aDogKGRhdGFQYXRoIHx8ICcnKSArIFwiXCIsXG4gICAgICAgICAgc2NoZW1hUGF0aDogJyMvdHlwZScsXG4gICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0J1xuICAgICAgICAgIH0sXG4gICAgICAgICAgbWVzc2FnZTogJ3Nob3VsZCBiZSBvYmplY3QnXG4gICAgICAgIH07XG4gICAgICAgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gW2Vycl07XG4gICAgICAgIGVsc2UgdkVycm9ycy5wdXNoKGVycik7XG4gICAgICAgIGVycm9ycysrO1xuICAgICAgfVxuICAgICAgdmFsaWRhdGUuZXJyb3JzID0gdkVycm9ycztcbiAgICAgIHJldHVybiBlcnJvcnMgPT09IDA7XG4gICAgfTtcbiAgfSkoKTtcbiAgcmVmVmFsMy5zY2hlbWEgPSB7XG4gICAgXCJ0eXBlXCI6IFwib2JqZWN0XCIsXG4gICAgXCJwYXR0ZXJuUHJvcGVydGllc1wiOiB7XG4gICAgICBcIl5bMC05XSskXCI6IHtcbiAgICAgICAgXCIkcmVmXCI6IFwiIy9kZWZpbml0aW9ucy9jb2x1bW5cIlxuICAgICAgfVxuICAgIH0sXG4gICAgXCJhZGRpdGlvbmFsUHJvcGVydGllc1wiOiBmYWxzZVxuICB9O1xuICByZWZWYWwzLmVycm9ycyA9IG51bGw7XG4gIHJlZlZhbFszXSA9IHJlZlZhbDM7XG4gIHZhciByZWZWYWw0ID0gKGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXR0ZXJuMCA9IG5ldyBSZWdFeHAoJ15bMC05XSskJyk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIHZhbGlkYXRlKGRhdGEsIGRhdGFQYXRoLCBwYXJlbnREYXRhLCBwYXJlbnREYXRhUHJvcGVydHksIHJvb3REYXRhKSB7XG4gICAgICAndXNlIHN0cmljdCc7XG4gICAgICB2YXIgdkVycm9ycyA9IG51bGw7XG4gICAgICB2YXIgZXJyb3JzID0gMDtcbiAgICAgIGlmICgoZGF0YSAmJiB0eXBlb2YgZGF0YSA9PT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheShkYXRhKSkpIHtcbiAgICAgICAgdmFyIGVycnNfXzAgPSBlcnJvcnM7XG4gICAgICAgIHZhciB2YWxpZDEgPSB0cnVlO1xuICAgICAgICBmb3IgKHZhciBrZXkwIGluIGRhdGEpIHtcbiAgICAgICAgICB2YXIgaXNBZGRpdGlvbmFsMCA9ICEoZmFsc2UgfHwgdmFsaWRhdGUuc2NoZW1hLnByb3BlcnRpZXNba2V5MF0pO1xuICAgICAgICAgIGlmIChpc0FkZGl0aW9uYWwwKSB7XG4gICAgICAgICAgICB2YWxpZDEgPSBmYWxzZTtcbiAgICAgICAgICAgIHZhciBlcnIgPSB7XG4gICAgICAgICAgICAgIGtleXdvcmQ6ICdhZGRpdGlvbmFsUHJvcGVydGllcycsXG4gICAgICAgICAgICAgIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgJycpICsgXCJcIixcbiAgICAgICAgICAgICAgc2NoZW1hUGF0aDogJyMvYWRkaXRpb25hbFByb3BlcnRpZXMnLFxuICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICBhZGRpdGlvbmFsUHJvcGVydHk6ICcnICsga2V5MCArICcnXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG1lc3NhZ2U6ICdzaG91bGQgTk9UIGhhdmUgYWRkaXRpb25hbCBwcm9wZXJ0aWVzJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gW2Vycl07XG4gICAgICAgICAgICBlbHNlIHZFcnJvcnMucHVzaChlcnIpO1xuICAgICAgICAgICAgZXJyb3JzKys7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBkYXRhMSA9IGRhdGEuYWxpZ25tZW50O1xuICAgICAgICBpZiAoZGF0YTEgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHZhciBlcnJzXzEgPSBlcnJvcnM7XG4gICAgICAgICAgaWYgKHR5cGVvZiBkYXRhMSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgdmFyIGVyciA9IHtcbiAgICAgICAgICAgICAga2V5d29yZDogJ3R5cGUnLFxuICAgICAgICAgICAgICBkYXRhUGF0aDogKGRhdGFQYXRoIHx8ICcnKSArICcuYWxpZ25tZW50JyxcbiAgICAgICAgICAgICAgc2NoZW1hUGF0aDogJyMvcHJvcGVydGllcy9hbGlnbm1lbnQvdHlwZScsXG4gICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG1lc3NhZ2U6ICdzaG91bGQgYmUgc3RyaW5nJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gW2Vycl07XG4gICAgICAgICAgICBlbHNlIHZFcnJvcnMucHVzaChlcnIpO1xuICAgICAgICAgICAgZXJyb3JzKys7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBzY2hlbWExID0gdmFsaWRhdGUuc2NoZW1hLnByb3BlcnRpZXMuYWxpZ25tZW50LmVudW07XG4gICAgICAgICAgdmFyIHZhbGlkMTtcbiAgICAgICAgICB2YWxpZDEgPSBmYWxzZTtcbiAgICAgICAgICBmb3IgKHZhciBpMSA9IDA7IGkxIDwgc2NoZW1hMS5sZW5ndGg7IGkxKyspXG4gICAgICAgICAgICBpZiAoZXF1YWwoZGF0YTEsIHNjaGVtYTFbaTFdKSkge1xuICAgICAgICAgICAgICB2YWxpZDEgPSB0cnVlO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIXZhbGlkMSkge1xuICAgICAgICAgICAgdmFyIGVyciA9IHtcbiAgICAgICAgICAgICAga2V5d29yZDogJ2VudW0nLFxuICAgICAgICAgICAgICBkYXRhUGF0aDogKGRhdGFQYXRoIHx8ICcnKSArICcuYWxpZ25tZW50JyxcbiAgICAgICAgICAgICAgc2NoZW1hUGF0aDogJyMvcHJvcGVydGllcy9hbGlnbm1lbnQvZW51bScsXG4gICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgIGFsbG93ZWRWYWx1ZXM6IHNjaGVtYTFcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgbWVzc2FnZTogJ3Nob3VsZCBiZSBlcXVhbCB0byBvbmUgb2YgdGhlIGFsbG93ZWQgdmFsdWVzJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gW2Vycl07XG4gICAgICAgICAgICBlbHNlIHZFcnJvcnMucHVzaChlcnIpO1xuICAgICAgICAgICAgZXJyb3JzKys7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB2YWxpZDEgPSBlcnJvcnMgPT09IGVycnNfMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YS53aWR0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdmFyIGVycnNfMSA9IGVycm9ycztcbiAgICAgICAgICBpZiAodHlwZW9mIGRhdGEud2lkdGggIT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIHZhciBlcnIgPSB7XG4gICAgICAgICAgICAgIGtleXdvcmQ6ICd0eXBlJyxcbiAgICAgICAgICAgICAgZGF0YVBhdGg6IChkYXRhUGF0aCB8fCAnJykgKyAnLndpZHRoJyxcbiAgICAgICAgICAgICAgc2NoZW1hUGF0aDogJyMvcHJvcGVydGllcy93aWR0aC90eXBlJyxcbiAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ251bWJlcidcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgbWVzc2FnZTogJ3Nob3VsZCBiZSBudW1iZXInXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTtcbiAgICAgICAgICAgIGVsc2UgdkVycm9ycy5wdXNoKGVycik7XG4gICAgICAgICAgICBlcnJvcnMrKztcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHZhbGlkMSA9IGVycm9ycyA9PT0gZXJyc18xO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhLndyYXBXb3JkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB2YXIgZXJyc18xID0gZXJyb3JzO1xuICAgICAgICAgIGlmICh0eXBlb2YgZGF0YS53cmFwV29yZCAhPT0gXCJib29sZWFuXCIpIHtcbiAgICAgICAgICAgIHZhciBlcnIgPSB7XG4gICAgICAgICAgICAgIGtleXdvcmQ6ICd0eXBlJyxcbiAgICAgICAgICAgICAgZGF0YVBhdGg6IChkYXRhUGF0aCB8fCAnJykgKyAnLndyYXBXb3JkJyxcbiAgICAgICAgICAgICAgc2NoZW1hUGF0aDogJyMvcHJvcGVydGllcy93cmFwV29yZC90eXBlJyxcbiAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG1lc3NhZ2U6ICdzaG91bGQgYmUgYm9vbGVhbidcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdO1xuICAgICAgICAgICAgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTtcbiAgICAgICAgICAgIGVycm9ycysrO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgdmFsaWQxID0gZXJyb3JzID09PSBlcnJzXzE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGEudHJ1bmNhdGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHZhciBlcnJzXzEgPSBlcnJvcnM7XG4gICAgICAgICAgaWYgKHR5cGVvZiBkYXRhLnRydW5jYXRlICE9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICB2YXIgZXJyID0ge1xuICAgICAgICAgICAgICBrZXl3b3JkOiAndHlwZScsXG4gICAgICAgICAgICAgIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgJycpICsgJy50cnVuY2F0ZScsXG4gICAgICAgICAgICAgIHNjaGVtYVBhdGg6ICcjL3Byb3BlcnRpZXMvdHJ1bmNhdGUvdHlwZScsXG4gICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdudW1iZXInXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG1lc3NhZ2U6ICdzaG91bGQgYmUgbnVtYmVyJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gW2Vycl07XG4gICAgICAgICAgICBlbHNlIHZFcnJvcnMucHVzaChlcnIpO1xuICAgICAgICAgICAgZXJyb3JzKys7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB2YWxpZDEgPSBlcnJvcnMgPT09IGVycnNfMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YS5wYWRkaW5nTGVmdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdmFyIGVycnNfMSA9IGVycm9ycztcbiAgICAgICAgICBpZiAodHlwZW9mIGRhdGEucGFkZGluZ0xlZnQgIT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIHZhciBlcnIgPSB7XG4gICAgICAgICAgICAgIGtleXdvcmQ6ICd0eXBlJyxcbiAgICAgICAgICAgICAgZGF0YVBhdGg6IChkYXRhUGF0aCB8fCAnJykgKyAnLnBhZGRpbmdMZWZ0JyxcbiAgICAgICAgICAgICAgc2NoZW1hUGF0aDogJyMvcHJvcGVydGllcy9wYWRkaW5nTGVmdC90eXBlJyxcbiAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ251bWJlcidcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgbWVzc2FnZTogJ3Nob3VsZCBiZSBudW1iZXInXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTtcbiAgICAgICAgICAgIGVsc2UgdkVycm9ycy5wdXNoKGVycik7XG4gICAgICAgICAgICBlcnJvcnMrKztcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHZhbGlkMSA9IGVycm9ycyA9PT0gZXJyc18xO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhLnBhZGRpbmdSaWdodCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdmFyIGVycnNfMSA9IGVycm9ycztcbiAgICAgICAgICBpZiAodHlwZW9mIGRhdGEucGFkZGluZ1JpZ2h0ICE9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICB2YXIgZXJyID0ge1xuICAgICAgICAgICAgICBrZXl3b3JkOiAndHlwZScsXG4gICAgICAgICAgICAgIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgJycpICsgJy5wYWRkaW5nUmlnaHQnLFxuICAgICAgICAgICAgICBzY2hlbWFQYXRoOiAnIy9wcm9wZXJ0aWVzL3BhZGRpbmdSaWdodC90eXBlJyxcbiAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ251bWJlcidcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgbWVzc2FnZTogJ3Nob3VsZCBiZSBudW1iZXInXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTtcbiAgICAgICAgICAgIGVsc2UgdkVycm9ycy5wdXNoKGVycik7XG4gICAgICAgICAgICBlcnJvcnMrKztcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHZhbGlkMSA9IGVycm9ycyA9PT0gZXJyc18xO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZXJyID0ge1xuICAgICAgICAgIGtleXdvcmQ6ICd0eXBlJyxcbiAgICAgICAgICBkYXRhUGF0aDogKGRhdGFQYXRoIHx8ICcnKSArIFwiXCIsXG4gICAgICAgICAgc2NoZW1hUGF0aDogJyMvdHlwZScsXG4gICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0J1xuICAgICAgICAgIH0sXG4gICAgICAgICAgbWVzc2FnZTogJ3Nob3VsZCBiZSBvYmplY3QnXG4gICAgICAgIH07XG4gICAgICAgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gW2Vycl07XG4gICAgICAgIGVsc2UgdkVycm9ycy5wdXNoKGVycik7XG4gICAgICAgIGVycm9ycysrO1xuICAgICAgfVxuICAgICAgdmFsaWRhdGUuZXJyb3JzID0gdkVycm9ycztcbiAgICAgIHJldHVybiBlcnJvcnMgPT09IDA7XG4gICAgfTtcbiAgfSkoKTtcbiAgcmVmVmFsNC5zY2hlbWEgPSB7XG4gICAgXCJ0eXBlXCI6IFwib2JqZWN0XCIsXG4gICAgXCJwcm9wZXJ0aWVzXCI6IHtcbiAgICAgIFwiYWxpZ25tZW50XCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgIFwiZW51bVwiOiBbXCJsZWZ0XCIsIFwicmlnaHRcIiwgXCJjZW50ZXJcIl1cbiAgICAgIH0sXG4gICAgICBcIndpZHRoXCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwibnVtYmVyXCJcbiAgICAgIH0sXG4gICAgICBcIndyYXBXb3JkXCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiYm9vbGVhblwiXG4gICAgICB9LFxuICAgICAgXCJ0cnVuY2F0ZVwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcIm51bWJlclwiXG4gICAgICB9LFxuICAgICAgXCJwYWRkaW5nTGVmdFwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcIm51bWJlclwiXG4gICAgICB9LFxuICAgICAgXCJwYWRkaW5nUmlnaHRcIjoge1xuICAgICAgICBcInR5cGVcIjogXCJudW1iZXJcIlxuICAgICAgfVxuICAgIH0sXG4gICAgXCJhZGRpdGlvbmFsUHJvcGVydGllc1wiOiBmYWxzZVxuICB9O1xuICByZWZWYWw0LmVycm9ycyA9IG51bGw7XG4gIHJlZlZhbFs0XSA9IHJlZlZhbDQ7XG4gIHJldHVybiBmdW5jdGlvbiB2YWxpZGF0ZShkYXRhLCBkYXRhUGF0aCwgcGFyZW50RGF0YSwgcGFyZW50RGF0YVByb3BlcnR5LCByb290RGF0YSkge1xuICAgICd1c2Ugc3RyaWN0JzsgLyojIHNvdXJjZVVSTD1jb25maWcuanNvbiAqL1xuICAgIHZhciB2RXJyb3JzID0gbnVsbDtcbiAgICB2YXIgZXJyb3JzID0gMDtcbiAgICBpZiAocm9vdERhdGEgPT09IHVuZGVmaW5lZCkgcm9vdERhdGEgPSBkYXRhO1xuICAgIGlmICgoZGF0YSAmJiB0eXBlb2YgZGF0YSA9PT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheShkYXRhKSkpIHtcbiAgICAgIHZhciBlcnJzX18wID0gZXJyb3JzO1xuICAgICAgdmFyIHZhbGlkMSA9IHRydWU7XG4gICAgICBmb3IgKHZhciBrZXkwIGluIGRhdGEpIHtcbiAgICAgICAgdmFyIGlzQWRkaXRpb25hbDAgPSAhKGZhbHNlIHx8IGtleTAgPT0gJ2JvcmRlcicgfHwga2V5MCA9PSAnY29sdW1ucycgfHwga2V5MCA9PSAnY29sdW1uRGVmYXVsdCcgfHwga2V5MCA9PSAnZHJhd0hvcml6b250YWxMaW5lJyk7XG4gICAgICAgIGlmIChpc0FkZGl0aW9uYWwwKSB7XG4gICAgICAgICAgdmFsaWQxID0gZmFsc2U7XG4gICAgICAgICAgdmFyIGVyciA9IHtcbiAgICAgICAgICAgIGtleXdvcmQ6ICdhZGRpdGlvbmFsUHJvcGVydGllcycsXG4gICAgICAgICAgICBkYXRhUGF0aDogKGRhdGFQYXRoIHx8ICcnKSArIFwiXCIsXG4gICAgICAgICAgICBzY2hlbWFQYXRoOiAnIy9hZGRpdGlvbmFsUHJvcGVydGllcycsXG4gICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgYWRkaXRpb25hbFByb3BlcnR5OiAnJyArIGtleTAgKyAnJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdzaG91bGQgTk9UIGhhdmUgYWRkaXRpb25hbCBwcm9wZXJ0aWVzJ1xuICAgICAgICAgIH07XG4gICAgICAgICAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTtcbiAgICAgICAgICBlbHNlIHZFcnJvcnMucHVzaChlcnIpO1xuICAgICAgICAgIGVycm9ycysrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZGF0YS5ib3JkZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB2YXIgZXJyc18xID0gZXJyb3JzO1xuICAgICAgICBpZiAoIXJlZlZhbDEoZGF0YS5ib3JkZXIsIChkYXRhUGF0aCB8fCAnJykgKyAnLmJvcmRlcicsIGRhdGEsICdib3JkZXInLCByb290RGF0YSkpIHtcbiAgICAgICAgICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IHJlZlZhbDEuZXJyb3JzO1xuICAgICAgICAgIGVsc2UgdkVycm9ycyA9IHZFcnJvcnMuY29uY2F0KHJlZlZhbDEuZXJyb3JzKTtcbiAgICAgICAgICBlcnJvcnMgPSB2RXJyb3JzLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdmFsaWQxID0gZXJyb3JzID09PSBlcnJzXzE7XG4gICAgICB9XG4gICAgICBpZiAoZGF0YS5jb2x1bW5zICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdmFyIGVycnNfMSA9IGVycm9ycztcbiAgICAgICAgaWYgKCFyZWZWYWwzKGRhdGEuY29sdW1ucywgKGRhdGFQYXRoIHx8ICcnKSArICcuY29sdW1ucycsIGRhdGEsICdjb2x1bW5zJywgcm9vdERhdGEpKSB7XG4gICAgICAgICAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSByZWZWYWwzLmVycm9ycztcbiAgICAgICAgICBlbHNlIHZFcnJvcnMgPSB2RXJyb3JzLmNvbmNhdChyZWZWYWwzLmVycm9ycyk7XG4gICAgICAgICAgZXJyb3JzID0gdkVycm9ycy5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHZhbGlkMSA9IGVycm9ycyA9PT0gZXJyc18xO1xuICAgICAgfVxuICAgICAgaWYgKGRhdGEuY29sdW1uRGVmYXVsdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHZhciBlcnJzXzEgPSBlcnJvcnM7XG4gICAgICAgIGlmICghcmVmVmFsWzRdKGRhdGEuY29sdW1uRGVmYXVsdCwgKGRhdGFQYXRoIHx8ICcnKSArICcuY29sdW1uRGVmYXVsdCcsIGRhdGEsICdjb2x1bW5EZWZhdWx0Jywgcm9vdERhdGEpKSB7XG4gICAgICAgICAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSByZWZWYWxbNF0uZXJyb3JzO1xuICAgICAgICAgIGVsc2UgdkVycm9ycyA9IHZFcnJvcnMuY29uY2F0KHJlZlZhbFs0XS5lcnJvcnMpO1xuICAgICAgICAgIGVycm9ycyA9IHZFcnJvcnMubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIHZhciB2YWxpZDEgPSBlcnJvcnMgPT09IGVycnNfMTtcbiAgICAgIH1cbiAgICAgIGlmIChkYXRhLmRyYXdIb3Jpem9udGFsTGluZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHZhciBlcnJzXzEgPSBlcnJvcnM7XG4gICAgICAgIHZhciBlcnJzX18xID0gZXJyb3JzO1xuICAgICAgICB2YXIgdmFsaWQxO1xuICAgICAgICB2YWxpZDEgPSB0eXBlb2YgZGF0YS5kcmF3SG9yaXpvbnRhbExpbmUgPT0gXCJmdW5jdGlvblwiO1xuICAgICAgICBpZiAoIXZhbGlkMSkge1xuICAgICAgICAgIGlmIChlcnJzX18xID09IGVycm9ycykge1xuICAgICAgICAgICAgdmFyIGVyciA9IHtcbiAgICAgICAgICAgICAga2V5d29yZDogJ3R5cGVvZicsXG4gICAgICAgICAgICAgIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgJycpICsgJy5kcmF3SG9yaXpvbnRhbExpbmUnLFxuICAgICAgICAgICAgICBzY2hlbWFQYXRoOiAnIy9wcm9wZXJ0aWVzL2RyYXdIb3Jpem9udGFsTGluZS90eXBlb2YnLFxuICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICBrZXl3b3JkOiAndHlwZW9mJ1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBtZXNzYWdlOiAnc2hvdWxkIHBhc3MgXCJ0eXBlb2ZcIiBrZXl3b3JkIHZhbGlkYXRpb24nXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTtcbiAgICAgICAgICAgIGVsc2UgdkVycm9ycy5wdXNoKGVycik7XG4gICAgICAgICAgICBlcnJvcnMrKztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yICh2YXIgaTEgPSBlcnJzX18xOyBpMSA8IGVycm9yczsgaTErKykge1xuICAgICAgICAgICAgICB2YXIgcnVsZUVycjEgPSB2RXJyb3JzW2kxXTtcbiAgICAgICAgICAgICAgaWYgKHJ1bGVFcnIxLmRhdGFQYXRoID09PSB1bmRlZmluZWQpIHJ1bGVFcnIxLmRhdGFQYXRoID0gKGRhdGFQYXRoIHx8ICcnKSArICcuZHJhd0hvcml6b250YWxMaW5lJztcbiAgICAgICAgICAgICAgaWYgKHJ1bGVFcnIxLnNjaGVtYVBhdGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJ1bGVFcnIxLnNjaGVtYVBhdGggPSBcIiMvcHJvcGVydGllcy9kcmF3SG9yaXpvbnRhbExpbmUvdHlwZW9mXCI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHZhbGlkMSA9IGVycm9ycyA9PT0gZXJyc18xO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgZXJyID0ge1xuICAgICAgICBrZXl3b3JkOiAndHlwZScsXG4gICAgICAgIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgJycpICsgXCJcIixcbiAgICAgICAgc2NoZW1hUGF0aDogJyMvdHlwZScsXG4gICAgICAgIHBhcmFtczoge1xuICAgICAgICAgIHR5cGU6ICdvYmplY3QnXG4gICAgICAgIH0sXG4gICAgICAgIG1lc3NhZ2U6ICdzaG91bGQgYmUgb2JqZWN0J1xuICAgICAgfTtcbiAgICAgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gW2Vycl07XG4gICAgICBlbHNlIHZFcnJvcnMucHVzaChlcnIpO1xuICAgICAgZXJyb3JzKys7XG4gICAgfVxuICAgIHZhbGlkYXRlLmVycm9ycyA9IHZFcnJvcnM7XG4gICAgcmV0dXJuIGVycm9ycyA9PT0gMDtcbiAgfTtcbn0pKCk7XG52YWxpZGF0ZS5zY2hlbWEgPSB7XG4gIFwiJGlkXCI6IFwiY29uZmlnLmpzb25cIixcbiAgXCIkc2NoZW1hXCI6IFwiaHR0cDovL2pzb24tc2NoZW1hLm9yZy9kcmFmdC0wNi9zY2hlbWEjXCIsXG4gIFwidHlwZVwiOiBcIm9iamVjdFwiLFxuICBcInByb3BlcnRpZXNcIjoge1xuICAgIFwiYm9yZGVyXCI6IHtcbiAgICAgIFwiJHJlZlwiOiBcIiMvZGVmaW5pdGlvbnMvYm9yZGVyc1wiXG4gICAgfSxcbiAgICBcImNvbHVtbnNcIjoge1xuICAgICAgXCIkcmVmXCI6IFwiIy9kZWZpbml0aW9ucy9jb2x1bW5zXCJcbiAgICB9LFxuICAgIFwiY29sdW1uRGVmYXVsdFwiOiB7XG4gICAgICBcIiRyZWZcIjogXCIjL2RlZmluaXRpb25zL2NvbHVtblwiXG4gICAgfSxcbiAgICBcImRyYXdIb3Jpem9udGFsTGluZVwiOiB7XG4gICAgICBcInR5cGVvZlwiOiBcImZ1bmN0aW9uXCJcbiAgICB9XG4gIH0sXG4gIFwiYWRkaXRpb25hbFByb3BlcnRpZXNcIjogZmFsc2UsXG4gIFwiZGVmaW5pdGlvbnNcIjoge1xuICAgIFwiY29sdW1uc1wiOiB7XG4gICAgICBcInR5cGVcIjogXCJvYmplY3RcIixcbiAgICAgIFwicGF0dGVyblByb3BlcnRpZXNcIjoge1xuICAgICAgICBcIl5bMC05XSskXCI6IHtcbiAgICAgICAgICBcIiRyZWZcIjogXCIjL2RlZmluaXRpb25zL2NvbHVtblwiXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcImFkZGl0aW9uYWxQcm9wZXJ0aWVzXCI6IGZhbHNlXG4gICAgfSxcbiAgICBcImNvbHVtblwiOiB7XG4gICAgICBcInR5cGVcIjogXCJvYmplY3RcIixcbiAgICAgIFwicHJvcGVydGllc1wiOiB7XG4gICAgICAgIFwiYWxpZ25tZW50XCI6IHtcbiAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbiAgICAgICAgICBcImVudW1cIjogW1wibGVmdFwiLCBcInJpZ2h0XCIsIFwiY2VudGVyXCJdXG4gICAgICAgIH0sXG4gICAgICAgIFwid2lkdGhcIjoge1xuICAgICAgICAgIFwidHlwZVwiOiBcIm51bWJlclwiXG4gICAgICAgIH0sXG4gICAgICAgIFwid3JhcFdvcmRcIjoge1xuICAgICAgICAgIFwidHlwZVwiOiBcImJvb2xlYW5cIlxuICAgICAgICB9LFxuICAgICAgICBcInRydW5jYXRlXCI6IHtcbiAgICAgICAgICBcInR5cGVcIjogXCJudW1iZXJcIlxuICAgICAgICB9LFxuICAgICAgICBcInBhZGRpbmdMZWZ0XCI6IHtcbiAgICAgICAgICBcInR5cGVcIjogXCJudW1iZXJcIlxuICAgICAgICB9LFxuICAgICAgICBcInBhZGRpbmdSaWdodFwiOiB7XG4gICAgICAgICAgXCJ0eXBlXCI6IFwibnVtYmVyXCJcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIFwiYWRkaXRpb25hbFByb3BlcnRpZXNcIjogZmFsc2VcbiAgICB9LFxuICAgIFwiYm9yZGVyc1wiOiB7XG4gICAgICBcInR5cGVcIjogXCJvYmplY3RcIixcbiAgICAgIFwicHJvcGVydGllc1wiOiB7XG4gICAgICAgIFwidG9wQm9keVwiOiB7XG4gICAgICAgICAgXCIkcmVmXCI6IFwiIy9kZWZpbml0aW9ucy9ib3JkZXJcIlxuICAgICAgICB9LFxuICAgICAgICBcInRvcEpvaW5cIjoge1xuICAgICAgICAgIFwiJHJlZlwiOiBcIiMvZGVmaW5pdGlvbnMvYm9yZGVyXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJ0b3BMZWZ0XCI6IHtcbiAgICAgICAgICBcIiRyZWZcIjogXCIjL2RlZmluaXRpb25zL2JvcmRlclwiXG4gICAgICAgIH0sXG4gICAgICAgIFwidG9wUmlnaHRcIjoge1xuICAgICAgICAgIFwiJHJlZlwiOiBcIiMvZGVmaW5pdGlvbnMvYm9yZGVyXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJib3R0b21Cb2R5XCI6IHtcbiAgICAgICAgICBcIiRyZWZcIjogXCIjL2RlZmluaXRpb25zL2JvcmRlclwiXG4gICAgICAgIH0sXG4gICAgICAgIFwiYm90dG9tSm9pblwiOiB7XG4gICAgICAgICAgXCIkcmVmXCI6IFwiIy9kZWZpbml0aW9ucy9ib3JkZXJcIlxuICAgICAgICB9LFxuICAgICAgICBcImJvdHRvbUxlZnRcIjoge1xuICAgICAgICAgIFwiJHJlZlwiOiBcIiMvZGVmaW5pdGlvbnMvYm9yZGVyXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJib3R0b21SaWdodFwiOiB7XG4gICAgICAgICAgXCIkcmVmXCI6IFwiIy9kZWZpbml0aW9ucy9ib3JkZXJcIlxuICAgICAgICB9LFxuICAgICAgICBcImJvZHlMZWZ0XCI6IHtcbiAgICAgICAgICBcIiRyZWZcIjogXCIjL2RlZmluaXRpb25zL2JvcmRlclwiXG4gICAgICAgIH0sXG4gICAgICAgIFwiYm9keVJpZ2h0XCI6IHtcbiAgICAgICAgICBcIiRyZWZcIjogXCIjL2RlZmluaXRpb25zL2JvcmRlclwiXG4gICAgICAgIH0sXG4gICAgICAgIFwiYm9keUpvaW5cIjoge1xuICAgICAgICAgIFwiJHJlZlwiOiBcIiMvZGVmaW5pdGlvbnMvYm9yZGVyXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJqb2luQm9keVwiOiB7XG4gICAgICAgICAgXCIkcmVmXCI6IFwiIy9kZWZpbml0aW9ucy9ib3JkZXJcIlxuICAgICAgICB9LFxuICAgICAgICBcImpvaW5MZWZ0XCI6IHtcbiAgICAgICAgICBcIiRyZWZcIjogXCIjL2RlZmluaXRpb25zL2JvcmRlclwiXG4gICAgICAgIH0sXG4gICAgICAgIFwiam9pblJpZ2h0XCI6IHtcbiAgICAgICAgICBcIiRyZWZcIjogXCIjL2RlZmluaXRpb25zL2JvcmRlclwiXG4gICAgICAgIH0sXG4gICAgICAgIFwiam9pbkpvaW5cIjoge1xuICAgICAgICAgIFwiJHJlZlwiOiBcIiMvZGVmaW5pdGlvbnMvYm9yZGVyXCJcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIFwiYWRkaXRpb25hbFByb3BlcnRpZXNcIjogZmFsc2VcbiAgICB9LFxuICAgIFwiYm9yZGVyXCI6IHtcbiAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiXG4gICAgfVxuICB9XG59O1xudmFsaWRhdGUuZXJyb3JzID0gbnVsbDtcbm1vZHVsZS5leHBvcnRzID0gdmFsaWRhdGU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3RhYmxlL2Rpc3QvdmFsaWRhdGVDb25maWcuanNcbi8vIG1vZHVsZSBpZCA9IDU0XG4vLyBtb2R1bGUgY2h1bmtzID0gMyA0IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2xvZGFzaCA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG52YXIgX2xvZGFzaDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9sb2Rhc2gpO1xuXG52YXIgX3NsaWNlQW5zaSA9IHJlcXVpcmUoJ3NsaWNlLWFuc2knKTtcblxudmFyIF9zbGljZUFuc2kyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc2xpY2VBbnNpKTtcblxudmFyIF9zdHJpbmdXaWR0aCA9IHJlcXVpcmUoJ3N0cmluZy13aWR0aCcpO1xuXG52YXIgX3N0cmluZ1dpZHRoMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N0cmluZ1dpZHRoKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gaW5wdXRcbiAqIEBwYXJhbSB7bnVtYmVyfSBzaXplXG4gKiBAcmV0dXJucyB7QXJyYXl9XG4gKi9cbmV4cG9ydHMuZGVmYXVsdCA9IChpbnB1dCwgc2l6ZSkgPT4ge1xuICBsZXQgc3ViamVjdDtcblxuICBzdWJqZWN0ID0gaW5wdXQ7XG5cbiAgY29uc3QgY2h1bmtzID0gW107XG5cbiAgLy8gaHR0cHM6Ly9yZWdleDEwMS5jb20vci9nWTVrWjEvMVxuICBjb25zdCByZSA9IG5ldyBSZWdFeHAoJyheLnsxLCcgKyBzaXplICsgJ30oXFxcXHMrfCQpKXwoXi57MSwnICsgKHNpemUgLSAxKSArICd9KFxcXFxcXFxcfC98X3xcXFxcLnwsfDt8LSkpJyk7XG5cbiAgZG8ge1xuICAgIGxldCBjaHVuaztcblxuICAgIGNodW5rID0gc3ViamVjdC5tYXRjaChyZSk7XG5cbiAgICBpZiAoY2h1bmspIHtcbiAgICAgIGNodW5rID0gY2h1bmtbMF07XG5cbiAgICAgIHN1YmplY3QgPSAoMCwgX3NsaWNlQW5zaTIuZGVmYXVsdCkoc3ViamVjdCwgKDAsIF9zdHJpbmdXaWR0aDIuZGVmYXVsdCkoY2h1bmspKTtcblxuICAgICAgY2h1bmsgPSBfbG9kYXNoMi5kZWZhdWx0LnRyaW0oY2h1bmspO1xuICAgIH0gZWxzZSB7XG4gICAgICBjaHVuayA9ICgwLCBfc2xpY2VBbnNpMi5kZWZhdWx0KShzdWJqZWN0LCAwLCBzaXplKTtcbiAgICAgIHN1YmplY3QgPSAoMCwgX3NsaWNlQW5zaTIuZGVmYXVsdCkoc3ViamVjdCwgc2l6ZSk7XG4gICAgfVxuXG4gICAgY2h1bmtzLnB1c2goY2h1bmspO1xuICB9IHdoaWxlICgoMCwgX3N0cmluZ1dpZHRoMi5kZWZhdWx0KShzdWJqZWN0KSk7XG5cbiAgcmV0dXJuIGNodW5rcztcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3RhYmxlL2Rpc3Qvd3JhcFdvcmQuanNcbi8vIG1vZHVsZSBpZCA9IDU1XG4vLyBtb2R1bGUgY2h1bmtzID0gMyA0IiwiJ3VzZSBzdHJpY3QnO1xuY29uc3Qgc3RyaXBBbnNpID0gcmVxdWlyZSgnc3RyaXAtYW5zaScpO1xuY29uc3QgaXNGdWxsd2lkdGhDb2RlUG9pbnQgPSByZXF1aXJlKCdpcy1mdWxsd2lkdGgtY29kZS1wb2ludCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0ciA9PiB7XG5cdGlmICh0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJyB8fCBzdHIubGVuZ3RoID09PSAwKSB7XG5cdFx0cmV0dXJuIDA7XG5cdH1cblxuXHRzdHIgPSBzdHJpcEFuc2koc3RyKTtcblxuXHRsZXQgd2lkdGggPSAwO1xuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y29uc3QgY29kZSA9IHN0ci5jb2RlUG9pbnRBdChpKTtcblxuXHRcdC8vIElnbm9yZSBjb250cm9sIGNoYXJhY3RlcnNcblx0XHRpZiAoY29kZSA8PSAweDFGIHx8IChjb2RlID49IDB4N0YgJiYgY29kZSA8PSAweDlGKSkge1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0Ly8gSWdub3JlIGNvbWJpbmluZyBjaGFyYWN0ZXJzXG5cdFx0aWYgKGNvZGUgPj0gMHgzMDAgJiYgY29kZSA8PSAweDM2Rikge1xuXHRcdFx0Y29udGludWU7XG5cdFx0fVxuXG5cdFx0Ly8gU3Vycm9nYXRlc1xuXHRcdGlmIChjb2RlID4gMHhGRkZGKSB7XG5cdFx0XHRpKys7XG5cdFx0fVxuXG5cdFx0d2lkdGggKz0gaXNGdWxsd2lkdGhDb2RlUG9pbnQoY29kZSkgPyAyIDogMTtcblx0fVxuXG5cdHJldHVybiB3aWR0aDtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vdGFibGUvfi9zdHJpbmctd2lkdGgvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAzIDQiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZXF1YWwoYSwgYikge1xuICBpZiAoYSA9PT0gYikgcmV0dXJuIHRydWU7XG5cbiAgdmFyIGFyckEgPSBBcnJheS5pc0FycmF5KGEpXG4gICAgLCBhcnJCID0gQXJyYXkuaXNBcnJheShiKVxuICAgICwgaTtcblxuICBpZiAoYXJyQSAmJiBhcnJCKSB7XG4gICAgaWYgKGEubGVuZ3RoICE9IGIubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgZm9yIChpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspXG4gICAgICBpZiAoIWVxdWFsKGFbaV0sIGJbaV0pKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAoYXJyQSAhPSBhcnJCKSByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGEgJiYgYiAmJiB0eXBlb2YgYSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIGIgPT09ICdvYmplY3QnKSB7XG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhKTtcbiAgICBpZiAoa2V5cy5sZW5ndGggIT09IE9iamVjdC5rZXlzKGIpLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgdmFyIGRhdGVBID0gYSBpbnN0YW5jZW9mIERhdGVcbiAgICAgICwgZGF0ZUIgPSBiIGluc3RhbmNlb2YgRGF0ZTtcbiAgICBpZiAoZGF0ZUEgJiYgZGF0ZUIpIHJldHVybiBhLmdldFRpbWUoKSA9PSBiLmdldFRpbWUoKTtcbiAgICBpZiAoZGF0ZUEgIT0gZGF0ZUIpIHJldHVybiBmYWxzZTtcblxuICAgIHZhciByZWdleHBBID0gYSBpbnN0YW5jZW9mIFJlZ0V4cFxuICAgICAgLCByZWdleHBCID0gYiBpbnN0YW5jZW9mIFJlZ0V4cDtcbiAgICBpZiAocmVnZXhwQSAmJiByZWdleHBCKSByZXR1cm4gYS50b1N0cmluZygpID09IGIudG9TdHJpbmcoKTtcbiAgICBpZiAocmVnZXhwQSAhPSByZWdleHBCKSByZXR1cm4gZmFsc2U7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKylcbiAgICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIGtleXNbaV0pKSByZXR1cm4gZmFsc2U7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKylcbiAgICAgIGlmKCFlcXVhbChhW2tleXNbaV1dLCBiW2tleXNbaV1dKSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Zhc3QtZGVlcC1lcXVhbC9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gNjVcbi8vIG1vZHVsZSBjaHVua3MgPSAzIDQiLCIndXNlIHN0cmljdCc7XG4vKiBlc2xpbnQtZGlzYWJsZSB5b2RhICovXG5tb2R1bGUuZXhwb3J0cyA9IHggPT4ge1xuXHRpZiAoTnVtYmVyLmlzTmFOKHgpKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0Ly8gY29kZSBwb2ludHMgYXJlIGRlcml2ZWQgZnJvbTpcblx0Ly8gaHR0cDovL3d3dy51bml4Lm9yZy9QdWJsaWMvVU5JREFUQS9FYXN0QXNpYW5XaWR0aC50eHRcblx0aWYgKFxuXHRcdHggPj0gMHgxMTAwICYmIChcblx0XHRcdHggPD0gMHgxMTVmIHx8ICAvLyBIYW5ndWwgSmFtb1xuXHRcdFx0eCA9PT0gMHgyMzI5IHx8IC8vIExFRlQtUE9JTlRJTkcgQU5HTEUgQlJBQ0tFVFxuXHRcdFx0eCA9PT0gMHgyMzJhIHx8IC8vIFJJR0hULVBPSU5USU5HIEFOR0xFIEJSQUNLRVRcblx0XHRcdC8vIENKSyBSYWRpY2FscyBTdXBwbGVtZW50IC4uIEVuY2xvc2VkIENKSyBMZXR0ZXJzIGFuZCBNb250aHNcblx0XHRcdCgweDJlODAgPD0geCAmJiB4IDw9IDB4MzI0NyAmJiB4ICE9PSAweDMwM2YpIHx8XG5cdFx0XHQvLyBFbmNsb3NlZCBDSksgTGV0dGVycyBhbmQgTW9udGhzIC4uIENKSyBVbmlmaWVkIElkZW9ncmFwaHMgRXh0ZW5zaW9uIEFcblx0XHRcdCgweDMyNTAgPD0geCAmJiB4IDw9IDB4NGRiZikgfHxcblx0XHRcdC8vIENKSyBVbmlmaWVkIElkZW9ncmFwaHMgLi4gWWkgUmFkaWNhbHNcblx0XHRcdCgweDRlMDAgPD0geCAmJiB4IDw9IDB4YTRjNikgfHxcblx0XHRcdC8vIEhhbmd1bCBKYW1vIEV4dGVuZGVkLUFcblx0XHRcdCgweGE5NjAgPD0geCAmJiB4IDw9IDB4YTk3YykgfHxcblx0XHRcdC8vIEhhbmd1bCBTeWxsYWJsZXNcblx0XHRcdCgweGFjMDAgPD0geCAmJiB4IDw9IDB4ZDdhMykgfHxcblx0XHRcdC8vIENKSyBDb21wYXRpYmlsaXR5IElkZW9ncmFwaHNcblx0XHRcdCgweGY5MDAgPD0geCAmJiB4IDw9IDB4ZmFmZikgfHxcblx0XHRcdC8vIFZlcnRpY2FsIEZvcm1zXG5cdFx0XHQoMHhmZTEwIDw9IHggJiYgeCA8PSAweGZlMTkpIHx8XG5cdFx0XHQvLyBDSksgQ29tcGF0aWJpbGl0eSBGb3JtcyAuLiBTbWFsbCBGb3JtIFZhcmlhbnRzXG5cdFx0XHQoMHhmZTMwIDw9IHggJiYgeCA8PSAweGZlNmIpIHx8XG5cdFx0XHQvLyBIYWxmd2lkdGggYW5kIEZ1bGx3aWR0aCBGb3Jtc1xuXHRcdFx0KDB4ZmYwMSA8PSB4ICYmIHggPD0gMHhmZjYwKSB8fFxuXHRcdFx0KDB4ZmZlMCA8PSB4ICYmIHggPD0gMHhmZmU2KSB8fFxuXHRcdFx0Ly8gS2FuYSBTdXBwbGVtZW50XG5cdFx0XHQoMHgxYjAwMCA8PSB4ICYmIHggPD0gMHgxYjAwMSkgfHxcblx0XHRcdC8vIEVuY2xvc2VkIElkZW9ncmFwaGljIFN1cHBsZW1lbnRcblx0XHRcdCgweDFmMjAwIDw9IHggJiYgeCA8PSAweDFmMjUxKSB8fFxuXHRcdFx0Ly8gQ0pLIFVuaWZpZWQgSWRlb2dyYXBocyBFeHRlbnNpb24gQiAuLiBUZXJ0aWFyeSBJZGVvZ3JhcGhpYyBQbGFuZVxuXHRcdFx0KDB4MjAwMDAgPD0geCAmJiB4IDw9IDB4M2ZmZmQpXG5cdFx0KVxuXHQpIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdHJldHVybiBmYWxzZTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vc2xpY2UtYW5zaS9+L2lzLWZ1bGx3aWR0aC1jb2RlLXBvaW50L2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA4M1xuLy8gbW9kdWxlIGNodW5rcyA9IDMgNCIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9sb2Rhc2ggPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxudmFyIF9sb2Rhc2gyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbG9kYXNoKTtcblxudmFyIF9zdHJpbmdXaWR0aCA9IHJlcXVpcmUoJ3N0cmluZy13aWR0aCcpO1xuXG52YXIgX3N0cmluZ1dpZHRoMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N0cmluZ1dpZHRoKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuY29uc3QgYWxpZ25tZW50cyA9IFsnbGVmdCcsICdyaWdodCcsICdjZW50ZXInXTtcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3ViamVjdFxuICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5jb25zdCBhbGlnbkxlZnQgPSAoc3ViamVjdCwgd2lkdGgpID0+IHtcbiAgcmV0dXJuIHN1YmplY3QgKyBfbG9kYXNoMi5kZWZhdWx0LnJlcGVhdCgnICcsIHdpZHRoKTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHN1YmplY3RcbiAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aFxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuY29uc3QgYWxpZ25SaWdodCA9IChzdWJqZWN0LCB3aWR0aCkgPT4ge1xuICByZXR1cm4gX2xvZGFzaDIuZGVmYXVsdC5yZXBlYXQoJyAnLCB3aWR0aCkgKyBzdWJqZWN0O1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3ViamVjdFxuICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5jb25zdCBhbGlnbkNlbnRlciA9IChzdWJqZWN0LCB3aWR0aCkgPT4ge1xuICBsZXQgaGFsZldpZHRoO1xuXG4gIGhhbGZXaWR0aCA9IHdpZHRoIC8gMjtcblxuICBpZiAoaGFsZldpZHRoICUgMiA9PT0gMCkge1xuICAgIHJldHVybiBfbG9kYXNoMi5kZWZhdWx0LnJlcGVhdCgnICcsIGhhbGZXaWR0aCkgKyBzdWJqZWN0ICsgX2xvZGFzaDIuZGVmYXVsdC5yZXBlYXQoJyAnLCBoYWxmV2lkdGgpO1xuICB9IGVsc2Uge1xuICAgIGhhbGZXaWR0aCA9IF9sb2Rhc2gyLmRlZmF1bHQuZmxvb3IoaGFsZldpZHRoKTtcblxuICAgIHJldHVybiBfbG9kYXNoMi5kZWZhdWx0LnJlcGVhdCgnICcsIGhhbGZXaWR0aCkgKyBzdWJqZWN0ICsgX2xvZGFzaDIuZGVmYXVsdC5yZXBlYXQoJyAnLCBoYWxmV2lkdGggKyAxKTtcbiAgfVxufTtcblxuLyoqXG4gKiBQYWRzIGEgc3RyaW5nIHRvIHRoZSBsZWZ0IGFuZC9vciByaWdodCB0byBwb3NpdGlvbiB0aGUgc3ViamVjdFxuICogdGV4dCBpbiBhIGRlc2lyZWQgYWxpZ25tZW50IHdpdGhpbiBhIGNvbnRhaW5lci5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3ViamVjdFxuICogQHBhcmFtIHtudW1iZXJ9IGNvbnRhaW5lcldpZHRoXG4gKiBAcGFyYW0ge3N0cmluZ30gYWxpZ25tZW50IE9uZSBvZiB0aGUgdmFsaWQgb3B0aW9ucyAobGVmdCwgcmlnaHQsIGNlbnRlcikuXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5cbmV4cG9ydHMuZGVmYXVsdCA9IChzdWJqZWN0LCBjb250YWluZXJXaWR0aCwgYWxpZ25tZW50KSA9PiB7XG4gIGlmICghX2xvZGFzaDIuZGVmYXVsdC5pc1N0cmluZyhzdWJqZWN0KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1N1YmplY3QgcGFyYW1ldGVyIHZhbHVlIG11c3QgYmUgYSBzdHJpbmcuJyk7XG4gIH1cblxuICBpZiAoIV9sb2Rhc2gyLmRlZmF1bHQuaXNOdW1iZXIoY29udGFpbmVyV2lkdGgpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ29udGFpbmVyIHdpZHRoIHBhcmFtZXRlciB2YWx1ZSBtdXN0IGJlIGEgbnVtYmVyLicpO1xuICB9XG5cbiAgY29uc3Qgc3ViamVjdFdpZHRoID0gKDAsIF9zdHJpbmdXaWR0aDIuZGVmYXVsdCkoc3ViamVjdCk7XG5cbiAgaWYgKHN1YmplY3RXaWR0aCA+IGNvbnRhaW5lcldpZHRoKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ3N1YmplY3RXaWR0aCcsIHN1YmplY3RXaWR0aCwgJ2NvbnRhaW5lcldpZHRoJywgY29udGFpbmVyV2lkdGgsICdzdWJqZWN0Jywgc3ViamVjdCk7XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1N1YmplY3QgcGFyYW1ldGVyIHZhbHVlIHdpZHRoIGNhbm5vdCBiZSBncmVhdGVyIHRoYW4gdGhlIGNvbnRhaW5lciB3aWR0aC4nKTtcbiAgfVxuXG4gIGlmICghX2xvZGFzaDIuZGVmYXVsdC5pc1N0cmluZyhhbGlnbm1lbnQpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQWxpZ25tZW50IHBhcmFtZXRlciB2YWx1ZSBtdXN0IGJlIGEgc3RyaW5nLicpO1xuICB9XG5cbiAgaWYgKGFsaWdubWVudHMuaW5kZXhPZihhbGlnbm1lbnQpID09PSAtMSkge1xuICAgIHRocm93IG5ldyBFcnJvcignQWxpZ25tZW50IHBhcmFtZXRlciB2YWx1ZSBtdXN0IGJlIGEga25vd24gYWxpZ25tZW50IHBhcmFtZXRlciB2YWx1ZSAobGVmdCwgcmlnaHQsIGNlbnRlcikuJyk7XG4gIH1cblxuICBpZiAoc3ViamVjdFdpZHRoID09PSAwKSB7XG4gICAgcmV0dXJuIF9sb2Rhc2gyLmRlZmF1bHQucmVwZWF0KCcgJywgY29udGFpbmVyV2lkdGgpO1xuICB9XG5cbiAgY29uc3QgYXZhaWxhYmxlV2lkdGggPSBjb250YWluZXJXaWR0aCAtIHN1YmplY3RXaWR0aDtcblxuICBpZiAoYWxpZ25tZW50ID09PSAnbGVmdCcpIHtcbiAgICByZXR1cm4gYWxpZ25MZWZ0KHN1YmplY3QsIGF2YWlsYWJsZVdpZHRoKTtcbiAgfVxuXG4gIGlmIChhbGlnbm1lbnQgPT09ICdyaWdodCcpIHtcbiAgICByZXR1cm4gYWxpZ25SaWdodChzdWJqZWN0LCBhdmFpbGFibGVXaWR0aCk7XG4gIH1cblxuICByZXR1cm4gYWxpZ25DZW50ZXIoc3ViamVjdCwgYXZhaWxhYmxlV2lkdGgpO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vdGFibGUvZGlzdC9hbGlnblN0cmluZy5qc1xuLy8gbW9kdWxlIGlkID0gODVcbi8vIG1vZHVsZSBjaHVua3MgPSAzIDQiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfbG9kYXNoID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbnZhciBfbG9kYXNoMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2xvZGFzaCk7XG5cbnZhciBfc3RyaW5nV2lkdGggPSByZXF1aXJlKCdzdHJpbmctd2lkdGgnKTtcblxudmFyIF9zdHJpbmdXaWR0aDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zdHJpbmdXaWR0aCk7XG5cbnZhciBfd3JhcFdvcmQgPSByZXF1aXJlKCcuL3dyYXBXb3JkJyk7XG5cbnZhciBfd3JhcFdvcmQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfd3JhcFdvcmQpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuICogQHBhcmFtIHtudW1iZXJ9IGNvbHVtbldpZHRoXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHVzZVdyYXBXb3JkXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAodmFsdWUsIGNvbHVtbldpZHRoKSB7XG4gIGxldCB1c2VXcmFwV29yZCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogZmFsc2U7XG5cbiAgaWYgKCFfbG9kYXNoMi5kZWZhdWx0LmlzU3RyaW5nKHZhbHVlKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1ZhbHVlIG11c3QgYmUgYSBzdHJpbmcuJyk7XG4gIH1cblxuICBpZiAoIV9sb2Rhc2gyLmRlZmF1bHQuaXNJbnRlZ2VyKGNvbHVtbldpZHRoKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0NvbHVtbiB3aWR0aCBtdXN0IGJlIGFuIGludGVnZXIuJyk7XG4gIH1cblxuICBpZiAoY29sdW1uV2lkdGggPCAxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDb2x1bW4gd2lkdGggbXVzdCBiZSBncmVhdGVyIHRoYW4gMC4nKTtcbiAgfVxuXG4gIGlmICh1c2VXcmFwV29yZCkge1xuICAgIHJldHVybiAoMCwgX3dyYXBXb3JkMi5kZWZhdWx0KSh2YWx1ZSwgY29sdW1uV2lkdGgpLmxlbmd0aDtcbiAgfVxuXG4gIHJldHVybiBfbG9kYXNoMi5kZWZhdWx0LmNlaWwoKDAsIF9zdHJpbmdXaWR0aDIuZGVmYXVsdCkodmFsdWUpIC8gY29sdW1uV2lkdGgpO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vdGFibGUvZGlzdC9jYWxjdWxhdGVDZWxsSGVpZ2h0LmpzXG4vLyBtb2R1bGUgaWQgPSA4NlxuLy8gbW9kdWxlIGNodW5rcyA9IDMgNCIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9sb2Rhc2ggPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxudmFyIF9sb2Rhc2gyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbG9kYXNoKTtcblxudmFyIF9jYWxjdWxhdGVDZWxsV2lkdGhJbmRleCA9IHJlcXVpcmUoJy4vY2FsY3VsYXRlQ2VsbFdpZHRoSW5kZXgnKTtcblxudmFyIF9jYWxjdWxhdGVDZWxsV2lkdGhJbmRleDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jYWxjdWxhdGVDZWxsV2lkdGhJbmRleCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbi8qKlxuICogUHJvZHVjZXMgYW4gYXJyYXkgb2YgdmFsdWVzIHRoYXQgZGVzY3JpYmUgdGhlIGxhcmdlc3QgdmFsdWUgbGVuZ3RoICh3aWR0aCkgaW4gZXZlcnkgY29sdW1uLlxuICpcbiAqIEBwYXJhbSB7QXJyYXlbXX0gcm93c1xuICogQHJldHVybnMge251bWJlcltdfVxuICovXG5leHBvcnRzLmRlZmF1bHQgPSByb3dzID0+IHtcbiAgaWYgKCFyb3dzWzBdKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdEYXRhc2V0IG11c3QgaGF2ZSBhdCBsZWFzdCBvbmUgcm93LicpO1xuICB9XG5cbiAgY29uc3QgY29sdW1ucyA9IF9sb2Rhc2gyLmRlZmF1bHQuZmlsbChBcnJheShyb3dzWzBdLmxlbmd0aCksIDApO1xuXG4gIF9sb2Rhc2gyLmRlZmF1bHQuZm9yRWFjaChyb3dzLCByb3cgPT4ge1xuICAgIGNvbnN0IGNvbHVtbldpZHRoSW5kZXggPSAoMCwgX2NhbGN1bGF0ZUNlbGxXaWR0aEluZGV4Mi5kZWZhdWx0KShyb3cpO1xuXG4gICAgX2xvZGFzaDIuZGVmYXVsdC5mb3JFYWNoKGNvbHVtbldpZHRoSW5kZXgsICh2YWx1ZVdpZHRoLCBpbmRleDApID0+IHtcbiAgICAgIGlmIChjb2x1bW5zW2luZGV4MF0gPCB2YWx1ZVdpZHRoKSB7XG4gICAgICAgIGNvbHVtbnNbaW5kZXgwXSA9IHZhbHVlV2lkdGg7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiBjb2x1bW5zO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vdGFibGUvZGlzdC9jYWxjdWxhdGVNYXhpbXVtQ29sdW1uV2lkdGhJbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gODdcbi8vIG1vZHVsZSBjaHVua3MgPSAzIDQiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfbG9kYXNoID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbnZhciBfbG9kYXNoMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2xvZGFzaCk7XG5cbnZhciBfbWFrZVN0cmVhbUNvbmZpZyA9IHJlcXVpcmUoJy4vbWFrZVN0cmVhbUNvbmZpZycpO1xuXG52YXIgX21ha2VTdHJlYW1Db25maWcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWFrZVN0cmVhbUNvbmZpZyk7XG5cbnZhciBfZHJhd1JvdyA9IHJlcXVpcmUoJy4vZHJhd1JvdycpO1xuXG52YXIgX2RyYXdSb3cyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZHJhd1Jvdyk7XG5cbnZhciBfZHJhd0JvcmRlciA9IHJlcXVpcmUoJy4vZHJhd0JvcmRlcicpO1xuXG52YXIgX3N0cmluZ2lmeVRhYmxlRGF0YSA9IHJlcXVpcmUoJy4vc3RyaW5naWZ5VGFibGVEYXRhJyk7XG5cbnZhciBfc3RyaW5naWZ5VGFibGVEYXRhMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N0cmluZ2lmeVRhYmxlRGF0YSk7XG5cbnZhciBfdHJ1bmNhdGVUYWJsZURhdGEgPSByZXF1aXJlKCcuL3RydW5jYXRlVGFibGVEYXRhJyk7XG5cbnZhciBfdHJ1bmNhdGVUYWJsZURhdGEyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdHJ1bmNhdGVUYWJsZURhdGEpO1xuXG52YXIgX21hcERhdGFVc2luZ1Jvd0hlaWdodEluZGV4ID0gcmVxdWlyZSgnLi9tYXBEYXRhVXNpbmdSb3dIZWlnaHRJbmRleCcpO1xuXG52YXIgX21hcERhdGFVc2luZ1Jvd0hlaWdodEluZGV4MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21hcERhdGFVc2luZ1Jvd0hlaWdodEluZGV4KTtcblxudmFyIF9hbGlnblRhYmxlRGF0YSA9IHJlcXVpcmUoJy4vYWxpZ25UYWJsZURhdGEnKTtcblxudmFyIF9hbGlnblRhYmxlRGF0YTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9hbGlnblRhYmxlRGF0YSk7XG5cbnZhciBfcGFkVGFibGVEYXRhID0gcmVxdWlyZSgnLi9wYWRUYWJsZURhdGEnKTtcblxudmFyIF9wYWRUYWJsZURhdGEyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcGFkVGFibGVEYXRhKTtcblxudmFyIF9jYWxjdWxhdGVSb3dIZWlnaHRJbmRleCA9IHJlcXVpcmUoJy4vY2FsY3VsYXRlUm93SGVpZ2h0SW5kZXgnKTtcblxudmFyIF9jYWxjdWxhdGVSb3dIZWlnaHRJbmRleDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jYWxjdWxhdGVSb3dIZWlnaHRJbmRleCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbi8qKlxuICogQHBhcmFtIHtBcnJheX0gZGF0YVxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xuICogQHJldHVybnMge0FycmF5fVxuICovXG5jb25zdCBwcmVwYXJlRGF0YSA9IChkYXRhLCBjb25maWcpID0+IHtcbiAgbGV0IHJvd3M7XG5cbiAgcm93cyA9ICgwLCBfc3RyaW5naWZ5VGFibGVEYXRhMi5kZWZhdWx0KShkYXRhKTtcblxuICByb3dzID0gKDAsIF90cnVuY2F0ZVRhYmxlRGF0YTIuZGVmYXVsdCkoZGF0YSwgY29uZmlnKTtcblxuICBjb25zdCByb3dIZWlnaHRJbmRleCA9ICgwLCBfY2FsY3VsYXRlUm93SGVpZ2h0SW5kZXgyLmRlZmF1bHQpKHJvd3MsIGNvbmZpZyk7XG5cbiAgcm93cyA9ICgwLCBfbWFwRGF0YVVzaW5nUm93SGVpZ2h0SW5kZXgyLmRlZmF1bHQpKHJvd3MsIHJvd0hlaWdodEluZGV4LCBjb25maWcpO1xuICByb3dzID0gKDAsIF9hbGlnblRhYmxlRGF0YTIuZGVmYXVsdCkocm93cywgY29uZmlnKTtcbiAgcm93cyA9ICgwLCBfcGFkVGFibGVEYXRhMi5kZWZhdWx0KShyb3dzLCBjb25maWcpO1xuXG4gIHJldHVybiByb3dzO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSByb3dcbiAqIEBwYXJhbSB7bnVtYmVyW119IGNvbHVtbldpZHRoSW5kZXhcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcbiAqIEByZXR1cm5zIHt1bmRlZmluZWR9XG4gKi9cbmNvbnN0IGNyZWF0ZSA9IChyb3csIGNvbHVtbldpZHRoSW5kZXgsIGNvbmZpZykgPT4ge1xuICBjb25zdCByb3dzID0gcHJlcGFyZURhdGEoW3Jvd10sIGNvbmZpZyk7XG5cbiAgY29uc3QgYm9keSA9IF9sb2Rhc2gyLmRlZmF1bHQubWFwKHJvd3MsIGxpdGVyYWxSb3cgPT4ge1xuICAgIHJldHVybiAoMCwgX2RyYXdSb3cyLmRlZmF1bHQpKGxpdGVyYWxSb3csIGNvbmZpZy5ib3JkZXIpO1xuICB9KS5qb2luKCcnKTtcblxuICBsZXQgb3V0cHV0O1xuXG4gIG91dHB1dCA9ICcnO1xuXG4gIG91dHB1dCArPSAoMCwgX2RyYXdCb3JkZXIuZHJhd0JvcmRlclRvcCkoY29sdW1uV2lkdGhJbmRleCwgY29uZmlnLmJvcmRlcik7XG4gIG91dHB1dCArPSBib2R5O1xuICBvdXRwdXQgKz0gKDAsIF9kcmF3Qm9yZGVyLmRyYXdCb3JkZXJCb3R0b20pKGNvbHVtbldpZHRoSW5kZXgsIGNvbmZpZy5ib3JkZXIpO1xuXG4gIG91dHB1dCA9IF9sb2Rhc2gyLmRlZmF1bHQudHJpbUVuZChvdXRwdXQpO1xuXG4gIHByb2Nlc3Muc3Rkb3V0LndyaXRlKG91dHB1dCk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nW119IHJvd1xuICogQHBhcmFtIHtudW1iZXJbXX0gY29sdW1uV2lkdGhJbmRleFxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xuICogQHJldHVybnMge3VuZGVmaW5lZH1cbiAqL1xuY29uc3QgYXBwZW5kID0gKHJvdywgY29sdW1uV2lkdGhJbmRleCwgY29uZmlnKSA9PiB7XG4gIGNvbnN0IHJvd3MgPSBwcmVwYXJlRGF0YShbcm93XSwgY29uZmlnKTtcblxuICBjb25zdCBib2R5ID0gX2xvZGFzaDIuZGVmYXVsdC5tYXAocm93cywgbGl0ZXJhbFJvdyA9PiB7XG4gICAgcmV0dXJuICgwLCBfZHJhd1JvdzIuZGVmYXVsdCkobGl0ZXJhbFJvdywgY29uZmlnLmJvcmRlcik7XG4gIH0pLmpvaW4oJycpO1xuXG4gIGxldCBvdXRwdXQ7XG5cbiAgb3V0cHV0ID0gJ1xcclxcdTAwMUJbSyc7XG5cbiAgb3V0cHV0ICs9ICgwLCBfZHJhd0JvcmRlci5kcmF3Qm9yZGVySm9pbikoY29sdW1uV2lkdGhJbmRleCwgY29uZmlnLmJvcmRlcik7XG4gIG91dHB1dCArPSBib2R5O1xuICBvdXRwdXQgKz0gKDAsIF9kcmF3Qm9yZGVyLmRyYXdCb3JkZXJCb3R0b20pKGNvbHVtbldpZHRoSW5kZXgsIGNvbmZpZy5ib3JkZXIpO1xuXG4gIG91dHB1dCA9IF9sb2Rhc2gyLmRlZmF1bHQudHJpbUVuZChvdXRwdXQpO1xuXG4gIHByb2Nlc3Muc3Rkb3V0LndyaXRlKG91dHB1dCk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSB1c2VyQ29uZmlnXG4gKiBAcmV0dXJucyB7T2JqZWN0fVxuICovXG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uICgpIHtcbiAgbGV0IHVzZXJDb25maWcgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuXG4gIGNvbnN0IGNvbmZpZyA9ICgwLCBfbWFrZVN0cmVhbUNvbmZpZzIuZGVmYXVsdCkodXNlckNvbmZpZyk7XG5cbiAgY29uc3QgY29sdW1uV2lkdGhJbmRleCA9IF9sb2Rhc2gyLmRlZmF1bHQubWFwVmFsdWVzKGNvbmZpZy5jb2x1bW5zLCBjb2x1bW4gPT4ge1xuICAgIHJldHVybiBjb2x1bW4ud2lkdGggKyBjb2x1bW4ucGFkZGluZ0xlZnQgKyBjb2x1bW4ucGFkZGluZ1JpZ2h0O1xuICB9KTtcblxuICBsZXQgZW1wdHk7XG5cbiAgZW1wdHkgPSB0cnVlO1xuXG4gIHJldHVybiB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtzdHJpbmdbXX0gcm93XG4gICAgICogQHJldHVybnMge3VuZGVmaW5lZH1cbiAgICAgKi9cbiAgICB3cml0ZTogcm93ID0+IHtcbiAgICAgIGlmIChyb3cubGVuZ3RoICE9PSBjb25maWcuY29sdW1uQ291bnQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdSb3cgY2VsbCBjb3VudCBkb2VzIG5vdCBtYXRjaCB0aGUgY29uZmlnLmNvbHVtbkNvdW50LicpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZW1wdHkpIHtcbiAgICAgICAgZW1wdHkgPSBmYWxzZTtcblxuICAgICAgICByZXR1cm4gY3JlYXRlKHJvdywgY29sdW1uV2lkdGhJbmRleCwgY29uZmlnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBhcHBlbmQocm93LCBjb2x1bW5XaWR0aEluZGV4LCBjb25maWcpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3RhYmxlL2Rpc3QvY3JlYXRlU3RyZWFtLmpzXG4vLyBtb2R1bGUgaWQgPSA4OFxuLy8gbW9kdWxlIGNodW5rcyA9IDMgNCIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9sb2Rhc2ggPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxudmFyIF9sb2Rhc2gyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbG9kYXNoKTtcblxudmFyIF9kcmF3Qm9yZGVyID0gcmVxdWlyZSgnLi9kcmF3Qm9yZGVyJyk7XG5cbnZhciBfZHJhd1JvdyA9IHJlcXVpcmUoJy4vZHJhd1JvdycpO1xuXG52YXIgX2RyYXdSb3cyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZHJhd1Jvdyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbi8qKlxuICogQHBhcmFtIHtBcnJheX0gcm93c1xuICogQHBhcmFtIHtPYmplY3R9IGJvcmRlclxuICogQHBhcmFtIHtBcnJheX0gY29sdW1uU2l6ZUluZGV4XG4gKiBAcGFyYW0ge0FycmF5fSByb3dTcGFuSW5kZXhcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGRyYXdIb3Jpem9udGFsTGluZVxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZXhwb3J0cy5kZWZhdWx0ID0gKHJvd3MsIGJvcmRlciwgY29sdW1uU2l6ZUluZGV4LCByb3dTcGFuSW5kZXgsIGRyYXdIb3Jpem9udGFsTGluZSkgPT4ge1xuICBsZXQgb3V0cHV0O1xuICBsZXQgcmVhbFJvd0luZGV4O1xuICBsZXQgcm93SGVpZ2h0O1xuXG4gIGNvbnN0IHJvd0NvdW50ID0gcm93cy5sZW5ndGg7XG5cbiAgcmVhbFJvd0luZGV4ID0gMDtcblxuICBvdXRwdXQgPSAnJztcblxuICBpZiAoZHJhd0hvcml6b250YWxMaW5lKHJlYWxSb3dJbmRleCwgcm93Q291bnQpKSB7XG4gICAgb3V0cHV0ICs9ICgwLCBfZHJhd0JvcmRlci5kcmF3Qm9yZGVyVG9wKShjb2x1bW5TaXplSW5kZXgsIGJvcmRlcik7XG4gIH1cblxuICBfbG9kYXNoMi5kZWZhdWx0LmZvckVhY2gocm93cywgKHJvdywgaW5kZXgwKSA9PiB7XG4gICAgb3V0cHV0ICs9ICgwLCBfZHJhd1JvdzIuZGVmYXVsdCkocm93LCBib3JkZXIpO1xuXG4gICAgaWYgKCFyb3dIZWlnaHQpIHtcbiAgICAgIHJvd0hlaWdodCA9IHJvd1NwYW5JbmRleFtyZWFsUm93SW5kZXhdO1xuXG4gICAgICByZWFsUm93SW5kZXgrKztcbiAgICB9XG5cbiAgICByb3dIZWlnaHQtLTtcblxuICAgIGlmIChyb3dIZWlnaHQgPT09IDAgJiYgaW5kZXgwICE9PSByb3dDb3VudCAtIDEgJiYgZHJhd0hvcml6b250YWxMaW5lKHJlYWxSb3dJbmRleCwgcm93Q291bnQpKSB7XG4gICAgICBvdXRwdXQgKz0gKDAsIF9kcmF3Qm9yZGVyLmRyYXdCb3JkZXJKb2luKShjb2x1bW5TaXplSW5kZXgsIGJvcmRlcik7XG4gICAgfVxuICB9KTtcblxuICBpZiAoZHJhd0hvcml6b250YWxMaW5lKHJlYWxSb3dJbmRleCwgcm93Q291bnQpKSB7XG4gICAgb3V0cHV0ICs9ICgwLCBfZHJhd0JvcmRlci5kcmF3Qm9yZGVyQm90dG9tKShjb2x1bW5TaXplSW5kZXgsIGJvcmRlcik7XG4gIH1cblxuICByZXR1cm4gb3V0cHV0O1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vdGFibGUvZGlzdC9kcmF3VGFibGUuanNcbi8vIG1vZHVsZSBpZCA9IDg5XG4vLyBtb2R1bGUgY2h1bmtzID0gMyA0IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5nZXRCb3JkZXJDaGFyYWN0ZXJzID0gZXhwb3J0cy5jcmVhdGVTdHJlYW0gPSBleHBvcnRzLnRhYmxlID0gdW5kZWZpbmVkO1xuXG52YXIgX3RhYmxlID0gcmVxdWlyZSgnLi90YWJsZScpO1xuXG52YXIgX3RhYmxlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3RhYmxlKTtcblxudmFyIF9jcmVhdGVTdHJlYW0gPSByZXF1aXJlKCcuL2NyZWF0ZVN0cmVhbScpO1xuXG52YXIgX2NyZWF0ZVN0cmVhbTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGVTdHJlYW0pO1xuXG52YXIgX2dldEJvcmRlckNoYXJhY3RlcnMgPSByZXF1aXJlKCcuL2dldEJvcmRlckNoYXJhY3RlcnMnKTtcblxudmFyIF9nZXRCb3JkZXJDaGFyYWN0ZXJzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2dldEJvcmRlckNoYXJhY3RlcnMpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5leHBvcnRzLnRhYmxlID0gX3RhYmxlMi5kZWZhdWx0O1xuZXhwb3J0cy5jcmVhdGVTdHJlYW0gPSBfY3JlYXRlU3RyZWFtMi5kZWZhdWx0O1xuZXhwb3J0cy5nZXRCb3JkZXJDaGFyYWN0ZXJzID0gX2dldEJvcmRlckNoYXJhY3RlcnMyLmRlZmF1bHQ7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3RhYmxlL2Rpc3QvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDkwXG4vLyBtb2R1bGUgY2h1bmtzID0gMyA0IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2xvZGFzaCA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG52YXIgX2xvZGFzaDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9sb2Rhc2gpO1xuXG52YXIgX2dldEJvcmRlckNoYXJhY3RlcnMgPSByZXF1aXJlKCcuL2dldEJvcmRlckNoYXJhY3RlcnMnKTtcblxudmFyIF9nZXRCb3JkZXJDaGFyYWN0ZXJzMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2dldEJvcmRlckNoYXJhY3RlcnMpO1xuXG52YXIgX3ZhbGlkYXRlQ29uZmlnID0gcmVxdWlyZSgnLi92YWxpZGF0ZUNvbmZpZycpO1xuXG52YXIgX3ZhbGlkYXRlQ29uZmlnMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3ZhbGlkYXRlQ29uZmlnKTtcblxudmFyIF9jYWxjdWxhdGVNYXhpbXVtQ29sdW1uV2lkdGhJbmRleCA9IHJlcXVpcmUoJy4vY2FsY3VsYXRlTWF4aW11bUNvbHVtbldpZHRoSW5kZXgnKTtcblxudmFyIF9jYWxjdWxhdGVNYXhpbXVtQ29sdW1uV2lkdGhJbmRleDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jYWxjdWxhdGVNYXhpbXVtQ29sdW1uV2lkdGhJbmRleCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbi8qKlxuICogTWVyZ2VzIHVzZXIgcHJvdmlkZWQgYm9yZGVyIGNoYXJhY3RlcnMgd2l0aCB0aGUgZGVmYXVsdCBib3JkZXIgKFwiaG9uZXl3ZWxsXCIpIGNoYXJhY3RlcnMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGJvcmRlclxuICogQHJldHVybnMge09iamVjdH1cbiAqL1xuY29uc3QgbWFrZUJvcmRlciA9IGZ1bmN0aW9uIG1ha2VCb3JkZXIoKSB7XG4gIGxldCBib3JkZXIgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuXG4gIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCAoMCwgX2dldEJvcmRlckNoYXJhY3RlcnMyLmRlZmF1bHQpKCdob25leXdlbGwnKSwgYm9yZGVyKTtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNvbmZpZ3VyYXRpb24gZm9yIGV2ZXJ5IGNvbHVtbiB1c2luZyBkZWZhdWx0XG4gKiB2YWx1ZXMgZm9yIHRoZSBtaXNzaW5nIGNvbmZpZ3VyYXRpb24gcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5W119IHJvd3NcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb2x1bW5zXG4gKiBAcGFyYW0ge09iamVjdH0gY29sdW1uRGVmYXVsdFxuICogQHJldHVybnMge09iamVjdH1cbiAqL1xuY29uc3QgbWFrZUNvbHVtbnMgPSBmdW5jdGlvbiBtYWtlQ29sdW1ucyhyb3dzKSB7XG4gIGxldCBjb2x1bW5zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcbiAgbGV0IGNvbHVtbkRlZmF1bHQgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHt9O1xuXG4gIGNvbnN0IG1heGltdW1Db2x1bW5XaWR0aEluZGV4ID0gKDAsIF9jYWxjdWxhdGVNYXhpbXVtQ29sdW1uV2lkdGhJbmRleDIuZGVmYXVsdCkocm93cyk7XG5cbiAgX2xvZGFzaDIuZGVmYXVsdC50aW1lcyhyb3dzWzBdLmxlbmd0aCwgaW5kZXggPT4ge1xuICAgIGlmIChfbG9kYXNoMi5kZWZhdWx0LmlzVW5kZWZpbmVkKGNvbHVtbnNbaW5kZXhdKSkge1xuICAgICAgY29sdW1uc1tpbmRleF0gPSB7fTtcbiAgICB9XG5cbiAgICBjb2x1bW5zW2luZGV4XSA9IF9sb2Rhc2gyLmRlZmF1bHQuYXNzaWduKHtcbiAgICAgIGFsaWdubWVudDogJ2xlZnQnLFxuICAgICAgcGFkZGluZ0xlZnQ6IDEsXG4gICAgICBwYWRkaW5nUmlnaHQ6IDEsXG4gICAgICB0cnVuY2F0ZTogSW5maW5pdHksXG4gICAgICB3aWR0aDogbWF4aW11bUNvbHVtbldpZHRoSW5kZXhbaW5kZXhdLFxuICAgICAgd3JhcFdvcmQ6IGZhbHNlXG4gICAgfSwgY29sdW1uRGVmYXVsdCwgY29sdW1uc1tpbmRleF0pO1xuICB9KTtcblxuICByZXR1cm4gY29sdW1ucztcbn07XG5cbi8qKlxuICogTWFrZXMgYSBuZXcgY29uZmlndXJhdGlvbiBvYmplY3Qgb3V0IG9mIHRoZSB1c2VyQ29uZmlnIG9iamVjdFxuICogdXNpbmcgZGVmYXVsdCB2YWx1ZXMgZm9yIHRoZSBtaXNzaW5nIGNvbmZpZ3VyYXRpb24gcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5W119IHJvd3NcbiAqIEBwYXJhbSB7T2JqZWN0fSB1c2VyQ29uZmlnXG4gKiBAcmV0dXJucyB7T2JqZWN0fVxuICovXG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChyb3dzKSB7XG4gIGxldCB1c2VyQ29uZmlnID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuICAoMCwgX3ZhbGlkYXRlQ29uZmlnMi5kZWZhdWx0KSgnY29uZmlnLmpzb24nLCB1c2VyQ29uZmlnKTtcblxuICBjb25zdCBjb25maWcgPSBfbG9kYXNoMi5kZWZhdWx0LmNsb25lRGVlcCh1c2VyQ29uZmlnKTtcblxuICBjb25maWcuYm9yZGVyID0gbWFrZUJvcmRlcihjb25maWcuYm9yZGVyKTtcbiAgY29uZmlnLmNvbHVtbnMgPSBtYWtlQ29sdW1ucyhyb3dzLCBjb25maWcuY29sdW1ucywgY29uZmlnLmNvbHVtbkRlZmF1bHQpO1xuXG4gIGlmICghY29uZmlnLmRyYXdIb3Jpem9udGFsTGluZSkge1xuICAgIC8qKlxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgICAgICovXG4gICAgY29uZmlnLmRyYXdIb3Jpem9udGFsTGluZSA9ICgpID0+IHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gY29uZmlnO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vdGFibGUvZGlzdC9tYWtlQ29uZmlnLmpzXG4vLyBtb2R1bGUgaWQgPSA5MVxuLy8gbW9kdWxlIGNodW5rcyA9IDMgNCIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9sb2Rhc2ggPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxudmFyIF9sb2Rhc2gyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbG9kYXNoKTtcblxudmFyIF9nZXRCb3JkZXJDaGFyYWN0ZXJzID0gcmVxdWlyZSgnLi9nZXRCb3JkZXJDaGFyYWN0ZXJzJyk7XG5cbnZhciBfZ2V0Qm9yZGVyQ2hhcmFjdGVyczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9nZXRCb3JkZXJDaGFyYWN0ZXJzKTtcblxudmFyIF92YWxpZGF0ZUNvbmZpZyA9IHJlcXVpcmUoJy4vdmFsaWRhdGVDb25maWcnKTtcblxudmFyIF92YWxpZGF0ZUNvbmZpZzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF92YWxpZGF0ZUNvbmZpZyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbi8qKlxuICogTWVyZ2VzIHVzZXIgcHJvdmlkZWQgYm9yZGVyIGNoYXJhY3RlcnMgd2l0aCB0aGUgZGVmYXVsdCBib3JkZXIgKFwiaG9uZXl3ZWxsXCIpIGNoYXJhY3RlcnMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGJvcmRlclxuICogQHJldHVybnMge09iamVjdH1cbiAqL1xuY29uc3QgbWFrZUJvcmRlciA9IGZ1bmN0aW9uIG1ha2VCb3JkZXIoKSB7XG4gIGxldCBib3JkZXIgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuXG4gIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCAoMCwgX2dldEJvcmRlckNoYXJhY3RlcnMyLmRlZmF1bHQpKCdob25leXdlbGwnKSwgYm9yZGVyKTtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNvbmZpZ3VyYXRpb24gZm9yIGV2ZXJ5IGNvbHVtbiB1c2luZyBkZWZhdWx0XG4gKiB2YWx1ZXMgZm9yIHRoZSBtaXNzaW5nIGNvbmZpZ3VyYXRpb24gcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gY29sdW1uQ291bnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb2x1bW5zXG4gKiBAcGFyYW0ge09iamVjdH0gY29sdW1uRGVmYXVsdFxuICogQHJldHVybnMge09iamVjdH1cbiAqL1xuY29uc3QgbWFrZUNvbHVtbnMgPSBmdW5jdGlvbiBtYWtlQ29sdW1ucyhjb2x1bW5Db3VudCkge1xuICBsZXQgY29sdW1ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG4gIGxldCBjb2x1bW5EZWZhdWx0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiB7fTtcblxuICBfbG9kYXNoMi5kZWZhdWx0LnRpbWVzKGNvbHVtbkNvdW50LCBpbmRleCA9PiB7XG4gICAgaWYgKF9sb2Rhc2gyLmRlZmF1bHQuaXNVbmRlZmluZWQoY29sdW1uc1tpbmRleF0pKSB7XG4gICAgICBjb2x1bW5zW2luZGV4XSA9IHt9O1xuICAgIH1cblxuICAgIGNvbHVtbnNbaW5kZXhdID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBhbGlnbm1lbnQ6ICdsZWZ0JyxcbiAgICAgIHBhZGRpbmdMZWZ0OiAxLFxuICAgICAgcGFkZGluZ1JpZ2h0OiAxLFxuICAgICAgdHJ1bmNhdGU6IEluZmluaXR5LFxuICAgICAgd3JhcFdvcmQ6IGZhbHNlXG4gICAgfSwgY29sdW1uRGVmYXVsdCwgY29sdW1uc1tpbmRleF0pO1xuICB9KTtcblxuICByZXR1cm4gY29sdW1ucztcbn07XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gY29sdW1uQ29uZmlnXG4gKiBAcHJvcGVydHkge3N0cmluZ30gYWxpZ25tZW50XG4gKiBAcHJvcGVydHkge251bWJlcn0gd2lkdGhcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB0cnVuY2F0ZVxuICogQHByb3BlcnR5IHtudW1iZXJ9IHBhZGRpbmdMZWZ0XG4gKiBAcHJvcGVydHkge251bWJlcn0gcGFkZGluZ1JpZ2h0XG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBzdHJlYW1Db25maWdcbiAqIEBwcm9wZXJ0eSB7Y29sdW1uQ29uZmlnfSBjb2x1bW5EZWZhdWx0XG4gKiBAcHJvcGVydHkge09iamVjdH0gYm9yZGVyXG4gKiBAcHJvcGVydHkge2NvbHVtbkNvbmZpZ1tdfVxuICogQHByb3BlcnR5IHtudW1iZXJ9IGNvbHVtbkNvdW50IE51bWJlciBvZiBjb2x1bW5zIGluIHRoZSB0YWJsZSAocmVxdWlyZWQpLlxuICovXG5cbi8qKlxuICogTWFrZXMgYSBuZXcgY29uZmlndXJhdGlvbiBvYmplY3Qgb3V0IG9mIHRoZSB1c2VyQ29uZmlnIG9iamVjdFxuICogdXNpbmcgZGVmYXVsdCB2YWx1ZXMgZm9yIHRoZSBtaXNzaW5nIGNvbmZpZ3VyYXRpb24gcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0ge3N0cmVhbUNvbmZpZ30gdXNlckNvbmZpZ1xuICogQHJldHVybnMge09iamVjdH1cbiAqL1xuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoKSB7XG4gIGxldCB1c2VyQ29uZmlnID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcblxuICAoMCwgX3ZhbGlkYXRlQ29uZmlnMi5kZWZhdWx0KSgnc3RyZWFtQ29uZmlnLmpzb24nLCB1c2VyQ29uZmlnKTtcblxuICBjb25zdCBjb25maWcgPSBfbG9kYXNoMi5kZWZhdWx0LmNsb25lRGVlcCh1c2VyQ29uZmlnKTtcblxuICBpZiAoIWNvbmZpZy5jb2x1bW5EZWZhdWx0IHx8ICFjb25maWcuY29sdW1uRGVmYXVsdC53aWR0aCkge1xuICAgIHRocm93IG5ldyBFcnJvcignTXVzdCBwcm92aWRlIGNvbmZpZy5jb2x1bW5EZWZhdWx0LndpZHRoIHdoZW4gY3JlYXRpbmcgYSBzdHJlYW0uJyk7XG4gIH1cblxuICBpZiAoIWNvbmZpZy5jb2x1bW5Db3VudCkge1xuICAgIHRocm93IG5ldyBFcnJvcignTXVzdCBwcm92aWRlIGNvbmZpZy5jb2x1bW5Db3VudC4nKTtcbiAgfVxuXG4gIGNvbmZpZy5ib3JkZXIgPSBtYWtlQm9yZGVyKGNvbmZpZy5ib3JkZXIpO1xuICBjb25maWcuY29sdW1ucyA9IG1ha2VDb2x1bW5zKGNvbmZpZy5jb2x1bW5Db3VudCwgY29uZmlnLmNvbHVtbnMsIGNvbmZpZy5jb2x1bW5EZWZhdWx0KTtcblxuICByZXR1cm4gY29uZmlnO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vdGFibGUvZGlzdC9tYWtlU3RyZWFtQ29uZmlnLmpzXG4vLyBtb2R1bGUgaWQgPSA5MlxuLy8gbW9kdWxlIGNodW5rcyA9IDMgNCIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9kcmF3VGFibGUgPSByZXF1aXJlKCcuL2RyYXdUYWJsZScpO1xuXG52YXIgX2RyYXdUYWJsZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kcmF3VGFibGUpO1xuXG52YXIgX2NhbGN1bGF0ZUNlbGxXaWR0aEluZGV4ID0gcmVxdWlyZSgnLi9jYWxjdWxhdGVDZWxsV2lkdGhJbmRleCcpO1xuXG52YXIgX2NhbGN1bGF0ZUNlbGxXaWR0aEluZGV4MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NhbGN1bGF0ZUNlbGxXaWR0aEluZGV4KTtcblxudmFyIF9tYWtlQ29uZmlnID0gcmVxdWlyZSgnLi9tYWtlQ29uZmlnJyk7XG5cbnZhciBfbWFrZUNvbmZpZzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tYWtlQ29uZmlnKTtcblxudmFyIF9jYWxjdWxhdGVSb3dIZWlnaHRJbmRleCA9IHJlcXVpcmUoJy4vY2FsY3VsYXRlUm93SGVpZ2h0SW5kZXgnKTtcblxudmFyIF9jYWxjdWxhdGVSb3dIZWlnaHRJbmRleDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jYWxjdWxhdGVSb3dIZWlnaHRJbmRleCk7XG5cbnZhciBfbWFwRGF0YVVzaW5nUm93SGVpZ2h0SW5kZXggPSByZXF1aXJlKCcuL21hcERhdGFVc2luZ1Jvd0hlaWdodEluZGV4Jyk7XG5cbnZhciBfbWFwRGF0YVVzaW5nUm93SGVpZ2h0SW5kZXgyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWFwRGF0YVVzaW5nUm93SGVpZ2h0SW5kZXgpO1xuXG52YXIgX2FsaWduVGFibGVEYXRhID0gcmVxdWlyZSgnLi9hbGlnblRhYmxlRGF0YScpO1xuXG52YXIgX2FsaWduVGFibGVEYXRhMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2FsaWduVGFibGVEYXRhKTtcblxudmFyIF9wYWRUYWJsZURhdGEgPSByZXF1aXJlKCcuL3BhZFRhYmxlRGF0YScpO1xuXG52YXIgX3BhZFRhYmxlRGF0YTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wYWRUYWJsZURhdGEpO1xuXG52YXIgX3ZhbGlkYXRlVGFibGVEYXRhID0gcmVxdWlyZSgnLi92YWxpZGF0ZVRhYmxlRGF0YScpO1xuXG52YXIgX3ZhbGlkYXRlVGFibGVEYXRhMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3ZhbGlkYXRlVGFibGVEYXRhKTtcblxudmFyIF9zdHJpbmdpZnlUYWJsZURhdGEgPSByZXF1aXJlKCcuL3N0cmluZ2lmeVRhYmxlRGF0YScpO1xuXG52YXIgX3N0cmluZ2lmeVRhYmxlRGF0YTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zdHJpbmdpZnlUYWJsZURhdGEpO1xuXG52YXIgX3RydW5jYXRlVGFibGVEYXRhID0gcmVxdWlyZSgnLi90cnVuY2F0ZVRhYmxlRGF0YScpO1xuXG52YXIgX3RydW5jYXRlVGFibGVEYXRhMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3RydW5jYXRlVGFibGVEYXRhKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuLyoqXG4gKiBAdHlwZWRlZiB7c3RyaW5nfSB0YWJsZX5jZWxsXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7dGFibGV+Y2VsbFtdfSB0YWJsZX5yb3dcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IHRhYmxlfmNvbHVtbnNcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBhbGlnbm1lbnQgQ2VsbCBjb250ZW50IGFsaWdubWVudCAoZW51bTogbGVmdCwgY2VudGVyLCByaWdodCkgKGRlZmF1bHQ6IGxlZnQpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IHdpZHRoIENvbHVtbiB3aWR0aCAoZGVmYXVsdDogYXV0bykuXG4gKiBAcHJvcGVydHkge251bWJlcn0gdHJ1bmNhdGUgTnVtYmVyIG9mIGNoYXJhY3RlcnMgYXJlIHdoaWNoIHRoZSBjb250ZW50IHdpbGwgYmUgdHJ1bmNhdGVkIChkZWZhdWx0OiBJbmZpbml0eSkuXG4gKiBAcHJvcGVydHkge251bWJlcn0gcGFkZGluZ0xlZnQgQ2VsbCBjb250ZW50IHBhZGRpbmcgd2lkdGggbGVmdCAoZGVmYXVsdDogMSkuXG4gKiBAcHJvcGVydHkge251bWJlcn0gcGFkZGluZ1JpZ2h0IENlbGwgY29udGVudCBwYWRkaW5nIHdpZHRoIHJpZ2h0IChkZWZhdWx0OiAxKS5cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IHRhYmxlfmJvcmRlclxuICogQHByb3BlcnR5IHtzdHJpbmd9IHRvcEJvZHlcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0b3BKb2luXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdG9wTGVmdFxuICogQHByb3BlcnR5IHtzdHJpbmd9IHRvcFJpZ2h0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gYm90dG9tQm9keVxuICogQHByb3BlcnR5IHtzdHJpbmd9IGJvdHRvbUpvaW5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBib3R0b21MZWZ0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gYm90dG9tUmlnaHRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBib2R5TGVmdFxuICogQHByb3BlcnR5IHtzdHJpbmd9IGJvZHlSaWdodFxuICogQHByb3BlcnR5IHtzdHJpbmd9IGJvZHlKb2luXG4gKiBAcHJvcGVydHkge3N0cmluZ30gam9pbkJvZHlcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBqb2luTGVmdFxuICogQHByb3BlcnR5IHtzdHJpbmd9IGpvaW5SaWdodFxuICogQHByb3BlcnR5IHtzdHJpbmd9IGpvaW5Kb2luXG4gKi9cblxuLyoqXG4gKiBVc2VkIHRvIHRlbGwgd2hldGhlciB0byBkcmF3IGEgaG9yaXpvbnRhbCBsaW5lLlxuICogVGhpcyBjYWxsYmFjayBpcyBjYWxsZWQgZm9yIGVhY2ggbm9uLWNvbnRlbnQgbGluZSBvZiB0aGUgdGFibGUuXG4gKiBUaGUgZGVmYXVsdCBiZWhhdmlvciBpcyB0byBhbHdheXMgcmV0dXJuIHRydWUuXG4gKlxuICogQHR5cGVkZWYge0Z1bmN0aW9ufSBkcmF3SG9yaXpvbnRhbExpbmVcbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleFxuICogQHBhcmFtIHtudW1iZXJ9IHNpemVcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gdGFibGV+Y29uZmlnXG4gKiBAcHJvcGVydHkge3RhYmxlfmJvcmRlcn0gYm9yZGVyXG4gKiBAcHJvcGVydHkge3RhYmxlfmNvbHVtbnNbXX0gY29sdW1ucyBDb2x1bW4gc3BlY2lmaWMgY29uZmlndXJhdGlvbi5cbiAqIEBwcm9wZXJ0eSB7dGFibGV+Y29sdW1uc30gY29sdW1uRGVmYXVsdCBEZWZhdWx0IHZhbHVlcyBmb3IgYWxsIGNvbHVtbnMuIENvbHVtbiBzcGVjaWZpYyBzZXR0aW5ncyBvdmVyd3JpdGUgdGhlIGRlZmF1bHQgdmFsdWVzLlxuICogQHByb3BlcnR5IHt0YWJsZX5kcmF3SG9yaXpvbnRhbExpbmV9IGRyYXdIb3Jpem9udGFsTGluZVxuICovXG5cbi8qKlxuICogR2VuZXJhdGVzIGEgdGV4dCB0YWJsZS5cbiAqXG4gKiBAcGFyYW0ge3RhYmxlfnJvd1tdfSBkYXRhXG4gKiBAcGFyYW0ge3RhYmxlfmNvbmZpZ30gdXNlckNvbmZpZ1xuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgbGV0IHVzZXJDb25maWcgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG4gIGxldCByb3dzO1xuXG4gICgwLCBfdmFsaWRhdGVUYWJsZURhdGEyLmRlZmF1bHQpKGRhdGEpO1xuXG4gIHJvd3MgPSAoMCwgX3N0cmluZ2lmeVRhYmxlRGF0YTIuZGVmYXVsdCkoZGF0YSk7XG5cbiAgY29uc3QgY29uZmlnID0gKDAsIF9tYWtlQ29uZmlnMi5kZWZhdWx0KShyb3dzLCB1c2VyQ29uZmlnKTtcblxuICByb3dzID0gKDAsIF90cnVuY2F0ZVRhYmxlRGF0YTIuZGVmYXVsdCkoZGF0YSwgY29uZmlnKTtcblxuICBjb25zdCByb3dIZWlnaHRJbmRleCA9ICgwLCBfY2FsY3VsYXRlUm93SGVpZ2h0SW5kZXgyLmRlZmF1bHQpKHJvd3MsIGNvbmZpZyk7XG5cbiAgcm93cyA9ICgwLCBfbWFwRGF0YVVzaW5nUm93SGVpZ2h0SW5kZXgyLmRlZmF1bHQpKHJvd3MsIHJvd0hlaWdodEluZGV4LCBjb25maWcpO1xuICByb3dzID0gKDAsIF9hbGlnblRhYmxlRGF0YTIuZGVmYXVsdCkocm93cywgY29uZmlnKTtcbiAgcm93cyA9ICgwLCBfcGFkVGFibGVEYXRhMi5kZWZhdWx0KShyb3dzLCBjb25maWcpO1xuXG4gIGNvbnN0IGNlbGxXaWR0aEluZGV4ID0gKDAsIF9jYWxjdWxhdGVDZWxsV2lkdGhJbmRleDIuZGVmYXVsdCkocm93c1swXSk7XG5cbiAgcmV0dXJuICgwLCBfZHJhd1RhYmxlMi5kZWZhdWx0KShyb3dzLCBjb25maWcuYm9yZGVyLCBjZWxsV2lkdGhJbmRleCwgcm93SGVpZ2h0SW5kZXgsIGNvbmZpZy5kcmF3SG9yaXpvbnRhbExpbmUpO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vdGFibGUvZGlzdC90YWJsZS5qc1xuLy8gbW9kdWxlIGlkID0gOTNcbi8vIG1vZHVsZSBjaHVua3MgPSAzIDQiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbi8qKlxuICogQHR5cGVkZWYge3N0cmluZ30gY2VsbFxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge2NlbGxbXX0gdmFsaWRhdGVEYXRhfmNvbHVtblxuICovXG5cbi8qKlxuICogQHBhcmFtIHtjb2x1bW5bXX0gcm93c1xuICogQHJldHVybnMge3VuZGVmaW5lZH1cbiAqL1xuZXhwb3J0cy5kZWZhdWx0ID0gcm93cyA9PiB7XG4gIGlmICghQXJyYXkuaXNBcnJheShyb3dzKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RhYmxlIGRhdGEgbXVzdCBiZSBhbiBhcnJheS4nKTtcbiAgfVxuXG4gIGlmIChyb3dzLmxlbmd0aCA9PT0gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignVGFibGUgbXVzdCBkZWZpbmUgYXQgbGVhc3Qgb25lIHJvdy4nKTtcbiAgfVxuXG4gIGlmIChyb3dzWzBdLmxlbmd0aCA9PT0gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignVGFibGUgbXVzdCBkZWZpbmUgYXQgbGVhc3Qgb25lIGNvbHVtbi4nKTtcbiAgfVxuXG4gIGNvbnN0IGNvbHVtbk51bWJlciA9IHJvd3NbMF0ubGVuZ3RoO1xuXG4gIGZvciAoY29uc3QgY2VsbHMgb2Ygcm93cykge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShjZWxscykpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RhYmxlIHJvdyBkYXRhIG11c3QgYmUgYW4gYXJyYXkuJyk7XG4gICAgfVxuXG4gICAgaWYgKGNlbGxzLmxlbmd0aCAhPT0gY29sdW1uTnVtYmVyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RhYmxlIG11c3QgaGF2ZSBhIGNvbnNpc3RlbnQgbnVtYmVyIG9mIGNlbGxzLicpO1xuICAgIH1cblxuICAgIC8vIEB0b2RvIE1ha2UgYW4gZXhjZXB0aW9uIGZvciBuZXdsaW5lIGNoYXJhY3RlcnMuXG4gICAgLy8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vZ2FqdXMvdGFibGUvaXNzdWVzLzlcbiAgICBmb3IgKGNvbnN0IGNlbGwgb2YgY2VsbHMpIHtcbiAgICAgIGlmICgvW1xcdTAwMDEtXFx1MDAxQV0vLnRlc3QoY2VsbCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUYWJsZSBkYXRhIG11c3Qgbm90IGNvbnRhaW4gY29udHJvbCBjaGFyYWN0ZXJzLicpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vdGFibGUvZGlzdC92YWxpZGF0ZVRhYmxlRGF0YS5qc1xuLy8gbW9kdWxlIGlkID0gOTRcbi8vIG1vZHVsZSBjaHVua3MgPSAzIDQiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfbG9kYXNoID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbnZhciBfbG9kYXNoMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2xvZGFzaCk7XG5cbnZhciBfc2xpY2VBbnNpID0gcmVxdWlyZSgnc2xpY2UtYW5zaScpO1xuXG52YXIgX3NsaWNlQW5zaTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zbGljZUFuc2kpO1xuXG52YXIgX3N0cmluZ1dpZHRoID0gcmVxdWlyZSgnc3RyaW5nLXdpZHRoJyk7XG5cbnZhciBfc3RyaW5nV2lkdGgyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RyaW5nV2lkdGgpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2Ygc3RyaW5ncyBzcGxpdCBpbnRvIGdyb3VwcyB0aGUgbGVuZ3RoIG9mIHNpemUuXG4gKiBUaGlzIGZ1bmN0aW9uIHdvcmtzIHdpdGggc3RyaW5ncyB0aGF0IGNvbnRhaW4gQVNDSUkgY2hhcmFjdGVycy5cbiAqXG4gKiB3cmFwVGV4dCBpcyBkaWZmZXJlbnQgZnJvbSB3b3VsZC1iZSBcImNodW5rXCIgaW1wbGVtZW50YXRpb25cbiAqIGluIHRoYXQgd2hpdGVzcGFjZSBjaGFyYWN0ZXJzIHRoYXQgb2NjdXIgb24gYSBjaHVuayBzaXplIGxpbWl0IGFyZSB0cmltbWVkLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdWJqZWN0XG4gKiBAcGFyYW0ge251bWJlcn0gc2l6ZVxuICogQHJldHVybnMge0FycmF5fVxuICovXG5leHBvcnRzLmRlZmF1bHQgPSAoc3ViamVjdCwgc2l6ZSkgPT4ge1xuICBsZXQgc3ViamVjdFNsaWNlO1xuXG4gIHN1YmplY3RTbGljZSA9IHN1YmplY3Q7XG5cbiAgY29uc3QgY2h1bmtzID0gW107XG5cbiAgZG8ge1xuICAgIGNodW5rcy5wdXNoKCgwLCBfc2xpY2VBbnNpMi5kZWZhdWx0KShzdWJqZWN0U2xpY2UsIDAsIHNpemUpKTtcblxuICAgIHN1YmplY3RTbGljZSA9IF9sb2Rhc2gyLmRlZmF1bHQudHJpbSgoMCwgX3NsaWNlQW5zaTIuZGVmYXVsdCkoc3ViamVjdFNsaWNlLCBzaXplKSk7XG4gIH0gd2hpbGUgKCgwLCBfc3RyaW5nV2lkdGgyLmRlZmF1bHQpKHN1YmplY3RTbGljZSkpO1xuXG4gIHJldHVybiBjaHVua3M7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi90YWJsZS9kaXN0L3dyYXBTdHJpbmcuanNcbi8vIG1vZHVsZSBpZCA9IDk1XG4vLyBtb2R1bGUgY2h1bmtzID0gMyA0IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJ2Zhc3QtZGVlcC1lcXVhbCcpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3RhYmxlL34vYWp2L2xpYi9jb21waWxlL2VxdWFsLmpzXG4vLyBtb2R1bGUgaWQgPSA5NlxuLy8gbW9kdWxlIGNodW5rcyA9IDMgNCIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSAoKSA9PiB7XG5cdGNvbnN0IHBhdHRlcm4gPSBbXG5cdFx0J1tcXFxcdTAwMUJcXFxcdTAwOUJdW1tcXFxcXSgpIzs/XSooPzooPzooPzpbYS16QS1aXFxcXGRdKig/OjtbYS16QS1aXFxcXGRdKikqKT9cXFxcdTAwMDcpJyxcblx0XHQnKD86KD86XFxcXGR7MSw0fSg/OjtcXFxcZHswLDR9KSopP1tcXFxcZEEtUFJaY2YtbnRxcnk9Pjx+XSkpJ1xuXHRdLmpvaW4oJ3wnKTtcblxuXHRyZXR1cm4gbmV3IFJlZ0V4cChwYXR0ZXJuLCAnZycpO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi90YWJsZS9+L2Fuc2ktcmVnZXgvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDk3XG4vLyBtb2R1bGUgY2h1bmtzID0gMyA0IiwiJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgeW9kYSAqL1xubW9kdWxlLmV4cG9ydHMgPSB4ID0+IHtcblx0aWYgKE51bWJlci5pc05hTih4KSkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8vIGNvZGUgcG9pbnRzIGFyZSBkZXJpdmVkIGZyb206XG5cdC8vIGh0dHA6Ly93d3cudW5peC5vcmcvUHVibGljL1VOSURBVEEvRWFzdEFzaWFuV2lkdGgudHh0XG5cdGlmIChcblx0XHR4ID49IDB4MTEwMCAmJiAoXG5cdFx0XHR4IDw9IDB4MTE1ZiB8fCAgLy8gSGFuZ3VsIEphbW9cblx0XHRcdHggPT09IDB4MjMyOSB8fCAvLyBMRUZULVBPSU5USU5HIEFOR0xFIEJSQUNLRVRcblx0XHRcdHggPT09IDB4MjMyYSB8fCAvLyBSSUdIVC1QT0lOVElORyBBTkdMRSBCUkFDS0VUXG5cdFx0XHQvLyBDSksgUmFkaWNhbHMgU3VwcGxlbWVudCAuLiBFbmNsb3NlZCBDSksgTGV0dGVycyBhbmQgTW9udGhzXG5cdFx0XHQoMHgyZTgwIDw9IHggJiYgeCA8PSAweDMyNDcgJiYgeCAhPT0gMHgzMDNmKSB8fFxuXHRcdFx0Ly8gRW5jbG9zZWQgQ0pLIExldHRlcnMgYW5kIE1vbnRocyAuLiBDSksgVW5pZmllZCBJZGVvZ3JhcGhzIEV4dGVuc2lvbiBBXG5cdFx0XHQoMHgzMjUwIDw9IHggJiYgeCA8PSAweDRkYmYpIHx8XG5cdFx0XHQvLyBDSksgVW5pZmllZCBJZGVvZ3JhcGhzIC4uIFlpIFJhZGljYWxzXG5cdFx0XHQoMHg0ZTAwIDw9IHggJiYgeCA8PSAweGE0YzYpIHx8XG5cdFx0XHQvLyBIYW5ndWwgSmFtbyBFeHRlbmRlZC1BXG5cdFx0XHQoMHhhOTYwIDw9IHggJiYgeCA8PSAweGE5N2MpIHx8XG5cdFx0XHQvLyBIYW5ndWwgU3lsbGFibGVzXG5cdFx0XHQoMHhhYzAwIDw9IHggJiYgeCA8PSAweGQ3YTMpIHx8XG5cdFx0XHQvLyBDSksgQ29tcGF0aWJpbGl0eSBJZGVvZ3JhcGhzXG5cdFx0XHQoMHhmOTAwIDw9IHggJiYgeCA8PSAweGZhZmYpIHx8XG5cdFx0XHQvLyBWZXJ0aWNhbCBGb3Jtc1xuXHRcdFx0KDB4ZmUxMCA8PSB4ICYmIHggPD0gMHhmZTE5KSB8fFxuXHRcdFx0Ly8gQ0pLIENvbXBhdGliaWxpdHkgRm9ybXMgLi4gU21hbGwgRm9ybSBWYXJpYW50c1xuXHRcdFx0KDB4ZmUzMCA8PSB4ICYmIHggPD0gMHhmZTZiKSB8fFxuXHRcdFx0Ly8gSGFsZndpZHRoIGFuZCBGdWxsd2lkdGggRm9ybXNcblx0XHRcdCgweGZmMDEgPD0geCAmJiB4IDw9IDB4ZmY2MCkgfHxcblx0XHRcdCgweGZmZTAgPD0geCAmJiB4IDw9IDB4ZmZlNikgfHxcblx0XHRcdC8vIEthbmEgU3VwcGxlbWVudFxuXHRcdFx0KDB4MWIwMDAgPD0geCAmJiB4IDw9IDB4MWIwMDEpIHx8XG5cdFx0XHQvLyBFbmNsb3NlZCBJZGVvZ3JhcGhpYyBTdXBwbGVtZW50XG5cdFx0XHQoMHgxZjIwMCA8PSB4ICYmIHggPD0gMHgxZjI1MSkgfHxcblx0XHRcdC8vIENKSyBVbmlmaWVkIElkZW9ncmFwaHMgRXh0ZW5zaW9uIEIgLi4gVGVydGlhcnkgSWRlb2dyYXBoaWMgUGxhbmVcblx0XHRcdCgweDIwMDAwIDw9IHggJiYgeCA8PSAweDNmZmZkKVxuXHRcdClcblx0KSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRyZXR1cm4gZmFsc2U7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3RhYmxlL34vaXMtZnVsbHdpZHRoLWNvZGUtcG9pbnQvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDk4XG4vLyBtb2R1bGUgY2h1bmtzID0gMyA0IiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgYW5zaVJlZ2V4ID0gcmVxdWlyZSgnYW5zaS1yZWdleCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlucHV0ID0+IHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycgPyBpbnB1dC5yZXBsYWNlKGFuc2lSZWdleCgpLCAnJykgOiBpbnB1dDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi90YWJsZS9+L3N0cmlwLWFuc2kvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDk5XG4vLyBtb2R1bGUgY2h1bmtzID0gMyA0Il0sInNvdXJjZVJvb3QiOiIifQ==