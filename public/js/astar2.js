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
/******/ 			var chunkId = 3;
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
/******/ 	return hotCreateRequire(246)(__webpack_require__.s = 246);
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

/***/ 128:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_table__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_table___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_table__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__shared_lib_index__ = __webpack_require__(241);




__WEBPACK_IMPORTED_MODULE_0_jquery__(() => {
    const wall = [Position.of(3, 0), Position.of(3, 1), Position.of(3, 2), Position.of(3, 3)];
    const width = 5;
    const height = 5;
    const grid = new Grid(width, height);
    wall.forEach(it => {
        const box = grid.getBox(it);
        grid.addWall(box);
    });
    grid.print();
    const startPosition = Position.of(0, 0);
    const endPosition = Position.of(4, 0);
    const onFind = (path) => {
        grid.print(path);
    };
    const start = grid.getBox(startPosition);
    const end = grid.getBox(endPosition);
    new AStar(grid, start, end, onFind).search();
});
class AStar {
    constructor(grid, start, end, onFind) {
        this.grid = grid;
        this.start = start;
        this.end = end;
        this.onFind = onFind;
        this.shortestPath = [];
        this.lockingBoxList = [];
        this.grid.forEach(it => {
            this.shortestPath.push(new __WEBPACK_IMPORTED_MODULE_3__shared_lib_index__["a" /* Store */]());
        });
    }
    compare(o1, o2, dist) {
        const p0 = dist.getPostion();
        const p1 = o1.getPostion();
        const p2 = o2.getPostion();
        return (Math.pow(p0.w - p1.w, 2) + Math.pow(p0.h - p1.h, 2) - Math.pow(p0.w - p2.w, 2) - Math.pow(p0.h - p2.h, 2));
    }
    isLocking(box) {
        return this.lockingBoxList.includes(box);
    }
    lockBox(box) {
        return this.lockingBoxList.push(box);
    }
    unLockBox(box) {
        if (this.lockingBoxList.includes(box)) {
            this.lockingBoxList.splice(this.lockingBoxList.indexOf(box));
        }
    }
    action(box, action) {
        this.lockBox(box);
        action();
        this.unLockBox(box);
    }
    search() {
        const getConnector = (start, end, onGetConnector) => {
            this.lockBox(start);
            const neighbours = this.grid.getNeighbours(start).filter(it => !this.isLocking(it));
            neighbours.forEach(it => {
                onGetConnector(new __WEBPACK_IMPORTED_MODULE_3__shared_lib_index__["b" /* Pair */](start, it));
            });
            this.unLockBox(start);
        };
        const cartesianProduct = (path1, path2, onGetCartesianProduct) => {
            const getMinPath = (paths) => {
                const result = new __WEBPACK_IMPORTED_MODULE_3__shared_lib_index__["a" /* Store */]();
                paths.forEach(it => {
                    if (result.state) {
                        result.data = it.length < result.data.length ? it : result.data;
                    }
                    else {
                        result.data = it;
                    }
                });
                return result;
            };
            const store1 = getMinPath(path1);
            const store2 = getMinPath(path2);
            if (store1.state && store2.state) {
                onGetCartesianProduct([...store1.data, ...store2.data]);
            }
        };
        const getAllPath = (start, end, getConnector, onGetPath) => {
            if (start.equals(end)) {
                onGetPath([end]);
            }
            else {
                const onGetConnector = connectPair => {
                    const getSubResult = (start, end) => {
                        let result = [];
                        getAllPath(start, end, getConnector, path => {
                            result.push(path);
                        });
                        return result;
                    };
                    const sub1 = getSubResult(start, connectPair.first);
                    const sub2 = getSubResult(connectPair.second, end);
                    if (sub1.length > 0 && sub2.length > 0) {
                        cartesianProduct(sub1, sub2, path => {
                            onGetPath(path);
                        });
                    }
                };
                getConnector(start, end, onGetConnector);
            }
        };
        // const getShortestPath = (allPaths: Box[][], onGet: Stat1<Box[]>) => {
        // 	if (allPaths.length > 0) {
        // 		let result = allPaths.reduce((prev: Box[], curr: Box[]) => {
        // 			let result = null
        // 			if (prev == null) {
        // 				result = curr
        // 			} else {
        // 				prev = prev.length < curr.length ? prev : curr
        // 			}
        // 			return result
        // 		}, null)
        // 		onGet(result)
        // 	}
        // }
        getAllPath(this.start, this.end, getConnector, path => {
            this.grid.print(path);
            this.onFind;
        });
    }
}
class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.wallBoxList = [];
        this.boxList = [];
        this.boxList = new Array(width * height);
        for (let h = 0; h < height; h++) {
            for (let w = 0; w < width; w++) {
                this.boxList[h * width + w] = new Box(w, h, this);
            }
        }
    }
    getNeighbours(box) {
        return this.getNeighbourPosition(box.getPostion())
            .map(it => this.getBox(it))
            .filter(it => !this.isWall(it));
    }
    isWall(box) {
        return this.wallBoxList.includes(box);
    }
    addWall(box) {
        this.wallBoxList.push(box);
    }
    getNeighbourPosition(position) {
        const subPosition1 = [position.w - 1, position.w + 1].map(it => new Position(it, position.h));
        const subPosition2 = [position.h - 1, position.h + 1].map(it => new Position(position.w, it));
        const subPosition3 = [position.w - 1, position.w + 1].map(it => new Position(it, position.h + 1));
        const subPosition4 = [position.w - 1, position.w + 1].map(it => new Position(it, position.h - 1));
        return __WEBPACK_IMPORTED_MODULE_1_lodash__["flatMap"]([subPosition1, subPosition2, subPosition3, subPosition4]).filter(it => {
            return it.w >= 0 && it.h >= 0 && it.w < this.width && it.h < this.height;
        });
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
            else if (this.isWall(it)) {
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
    constructor(w, h, grid) {
        this.w = w;
        this.h = h;
        this.grid = grid;
    }
    getPostion() {
        return Position.of(this.w, this.h);
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

/***/ 240:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const isReady = new Promise((resolve, reject) => {
    document.addEventListener("DOMContentLoaded", () => {
        resolve();
    });
});
class Dom {
    static onReady() {
        return isReady;
    }
}
/* unused harmony export Dom */



/***/ }),

/***/ 241:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dom__ = __webpack_require__(240);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__functions__ = __webpack_require__(100);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_1__functions__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_1__functions__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util__ = __webpack_require__(242);
/* unused harmony namespace reexport */





/***/ }),

/***/ 242:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const none = "";
/* unused harmony export none */



/***/ }),

/***/ 246:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(128);


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOGJkNTMyNGNiOWY1MWViYjJhYWY/ZGFmYyoqKiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ2ZW5kb3JcIj9iOTQwKioqIiwid2VicGFjazovLy9kZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvbG9kYXNoL2xvZGFzaC5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgdmVuZG9yIiwid2VicGFjazovLy8uL3NyYy9zaGFyZWQvbGliL2Z1bmN0aW9ucy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFnZS9hc3Rhci9hc3RhcjIudHN4Iiwid2VicGFjazovLy9kZWxlZ2F0ZWQgLi9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIGZyb20gZGxsLXJlZmVyZW5jZSB2ZW5kb3I/NDFkOCoiLCJ3ZWJwYWNrOi8vLy4vfi90YWJsZS9kaXN0L2dldEJvcmRlckNoYXJhY3RlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NoYXJlZC9saWIvZG9tLnRzIiwid2VicGFjazovLy8uL3NyYy9zaGFyZWQvbGliL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9zaGFyZWQvbGliL3V0aWwudHMiLCJ3ZWJwYWNrOi8vL2RlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9qcXVlcnkvZGlzdC9qcXVlcnkuanMgZnJvbSBkbGwtcmVmZXJlbmNlIHZlbmRvcj82NThjKiIsIndlYnBhY2s6Ly8vLi9+L3NsaWNlLWFuc2kvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi90YWJsZS9kaXN0L2FsaWduVGFibGVEYXRhLmpzIiwid2VicGFjazovLy8uL34vdGFibGUvZGlzdC9jYWxjdWxhdGVDZWxsV2lkdGhJbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L3RhYmxlL2Rpc3QvY2FsY3VsYXRlUm93SGVpZ2h0SW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi90YWJsZS9kaXN0L2RyYXdCb3JkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vfi90YWJsZS9kaXN0L2RyYXdSb3cuanMiLCJ3ZWJwYWNrOi8vLy4vfi90YWJsZS9kaXN0L21hcERhdGFVc2luZ1Jvd0hlaWdodEluZGV4LmpzIiwid2VicGFjazovLy8uL34vdGFibGUvZGlzdC9wYWRUYWJsZURhdGEuanMiLCJ3ZWJwYWNrOi8vLy4vfi90YWJsZS9kaXN0L3N0cmluZ2lmeVRhYmxlRGF0YS5qcyIsIndlYnBhY2s6Ly8vLi9+L3RhYmxlL2Rpc3QvdHJ1bmNhdGVUYWJsZURhdGEuanMiLCJ3ZWJwYWNrOi8vLy4vfi90YWJsZS9kaXN0L3ZhbGlkYXRlQ29uZmlnLmpzIiwid2VicGFjazovLy8uL34vdGFibGUvZGlzdC93cmFwV29yZC5qcyIsIndlYnBhY2s6Ly8vLi9+L3RhYmxlL34vc3RyaW5nLXdpZHRoL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vZmFzdC1kZWVwLWVxdWFsL2luZGV4LmpzIiwid2VicGFjazovLy8uL34vc2xpY2UtYW5zaS9+L2lzLWZ1bGx3aWR0aC1jb2RlLXBvaW50L2luZGV4LmpzIiwid2VicGFjazovLy8uL34vdGFibGUvZGlzdC9hbGlnblN0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9+L3RhYmxlL2Rpc3QvY2FsY3VsYXRlQ2VsbEhlaWdodC5qcyIsIndlYnBhY2s6Ly8vLi9+L3RhYmxlL2Rpc3QvY2FsY3VsYXRlTWF4aW11bUNvbHVtbldpZHRoSW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi90YWJsZS9kaXN0L2NyZWF0ZVN0cmVhbS5qcyIsIndlYnBhY2s6Ly8vLi9+L3RhYmxlL2Rpc3QvZHJhd1RhYmxlLmpzIiwid2VicGFjazovLy8uL34vdGFibGUvZGlzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9+L3RhYmxlL2Rpc3QvbWFrZUNvbmZpZy5qcyIsIndlYnBhY2s6Ly8vLi9+L3RhYmxlL2Rpc3QvbWFrZVN0cmVhbUNvbmZpZy5qcyIsIndlYnBhY2s6Ly8vLi9+L3RhYmxlL2Rpc3QvdGFibGUuanMiLCJ3ZWJwYWNrOi8vLy4vfi90YWJsZS9kaXN0L3ZhbGlkYXRlVGFibGVEYXRhLmpzIiwid2VicGFjazovLy8uL34vdGFibGUvZGlzdC93cmFwU3RyaW5nLmpzIiwid2VicGFjazovLy8uL34vdGFibGUvfi9hanYvbGliL2NvbXBpbGUvZXF1YWwuanMiLCJ3ZWJwYWNrOi8vLy4vfi90YWJsZS9+L2Fuc2ktcmVnZXgvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vfi90YWJsZS9+L2lzLWZ1bGx3aWR0aC1jb2RlLXBvaW50L2luZGV4LmpzIiwid2VicGFjazovLy8uL34vdGFibGUvfi9zdHJpcC1hbnNpL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUVBQTJEO0FBQzNEO0FBQ0E7QUFDQSxXQUFHOztBQUVILG9EQUE0QztBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwwQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxlQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKOzs7O0FBSUE7QUFDQSxzREFBOEM7QUFDOUM7QUFDQSxvQ0FBNEI7QUFDNUIscUNBQTZCO0FBQzdCLHlDQUFpQzs7QUFFakMsK0NBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIscUJBQXFCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsa0NBQWtDLGFBQWE7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEI7Ozs7Ozs7O0FDaHZCQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7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YUFBYSxPQUFPO0FBQ3BCOztBQUVBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCOztBQUVBO0FBQ0EsV0FBVyxTQUFTO0FBQ3BCLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFOzs7Ozs7OztBQ2xEQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQSxzQ0FBc0MsdUNBQXVDLGdCQUFnQjs7QUFFN0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsV0FBVyxPQUFPO0FBQ2xCLGFBQWE7QUFDYjtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxFOzs7Ozs7OztBQzdDQTs7QUFFQTs7Ozs7Ozs7O0FDRkE7O0FBRUE7QUFDQTtBQUNBLDRCQUE0Qiw0QkFBNEI7QUFDeEQsYUFBYSxJQUFJLElBQUksSUFBSSxJQUFJO0FBQzdCOztBQUVBO0FBQ0E7Ozs7Ozs7OztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7O0FDN0NBO0FBQ0E7O0FBRUEiLCJmaWxlIjoianMvYXN0YXIyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0ZnVuY3Rpb24gaG90RGlzcG9zZUNodW5rKGNodW5rSWQpIHtcbiBcdFx0ZGVsZXRlIGluc3RhbGxlZENodW5rc1tjaHVua0lkXTtcbiBcdH1cbiBcdHZhciBwYXJlbnRIb3RVcGRhdGVDYWxsYmFjayA9IHRoaXNbXCJ3ZWJwYWNrSG90VXBkYXRlXCJdO1xuIFx0dGhpc1tcIndlYnBhY2tIb3RVcGRhdGVcIl0gPSBcclxuIFx0ZnVuY3Rpb24gd2VicGFja0hvdFVwZGF0ZUNhbGxiYWNrKGNodW5rSWQsIG1vcmVNb2R1bGVzKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHRob3RBZGRVcGRhdGVDaHVuayhjaHVua0lkLCBtb3JlTW9kdWxlcyk7XHJcbiBcdFx0aWYocGFyZW50SG90VXBkYXRlQ2FsbGJhY2spIHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrKGNodW5rSWQsIG1vcmVNb2R1bGVzKTtcclxuIFx0fSA7XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdO1xyXG4gXHRcdHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xyXG4gXHRcdHNjcmlwdC50eXBlID0gXCJ0ZXh0L2phdmFzY3JpcHRcIjtcclxuIFx0XHRzY3JpcHQuY2hhcnNldCA9IFwidXRmLThcIjtcclxuIFx0XHRzY3JpcHQuc3JjID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGNodW5rSWQgKyBcIi5cIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc1wiO1xyXG4gXHRcdGhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRNYW5pZmVzdCgpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuIFx0XHRcdGlmKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0cmV0dXJuIHJlamVjdChuZXcgRXJyb3IoXCJObyBicm93c2VyIHN1cHBvcnRcIikpO1xyXG4gXHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0dmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuIFx0XHRcdFx0dmFyIHJlcXVlc3RQYXRoID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc29uXCI7XHJcbiBcdFx0XHRcdHJlcXVlc3Qub3BlbihcIkdFVFwiLCByZXF1ZXN0UGF0aCwgdHJ1ZSk7XHJcbiBcdFx0XHRcdHJlcXVlc3QudGltZW91dCA9IDEwMDAwO1xyXG4gXHRcdFx0XHRyZXF1ZXN0LnNlbmQobnVsbCk7XHJcbiBcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRyZXR1cm4gcmVqZWN0KGVycik7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4gXHRcdFx0XHRpZihyZXF1ZXN0LnJlYWR5U3RhdGUgIT09IDQpIHJldHVybjtcclxuIFx0XHRcdFx0aWYocmVxdWVzdC5zdGF0dXMgPT09IDApIHtcclxuIFx0XHRcdFx0XHQvLyB0aW1lb3V0XHJcbiBcdFx0XHRcdFx0cmVqZWN0KG5ldyBFcnJvcihcIk1hbmlmZXN0IHJlcXVlc3QgdG8gXCIgKyByZXF1ZXN0UGF0aCArIFwiIHRpbWVkIG91dC5cIikpO1xyXG4gXHRcdFx0XHR9IGVsc2UgaWYocmVxdWVzdC5zdGF0dXMgPT09IDQwNCkge1xyXG4gXHRcdFx0XHRcdC8vIG5vIHVwZGF0ZSBhdmFpbGFibGVcclxuIFx0XHRcdFx0XHRyZXNvbHZlKCk7XHJcbiBcdFx0XHRcdH0gZWxzZSBpZihyZXF1ZXN0LnN0YXR1cyAhPT0gMjAwICYmIHJlcXVlc3Quc3RhdHVzICE9PSAzMDQpIHtcclxuIFx0XHRcdFx0XHQvLyBvdGhlciBmYWlsdXJlXHJcbiBcdFx0XHRcdFx0cmVqZWN0KG5ldyBFcnJvcihcIk1hbmlmZXN0IHJlcXVlc3QgdG8gXCIgKyByZXF1ZXN0UGF0aCArIFwiIGZhaWxlZC5cIikpO1xyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdC8vIHN1Y2Nlc3NcclxuIFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0dmFyIHVwZGF0ZSA9IEpTT04ucGFyc2UocmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG4gXHRcdFx0XHRcdH0gY2F0Y2goZSkge1xyXG4gXHRcdFx0XHRcdFx0cmVqZWN0KGUpO1xyXG4gXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRyZXNvbHZlKHVwZGF0ZSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH07XHJcbiBcdFx0fSk7XHJcbiBcdH1cclxuXG4gXHRcclxuIFx0XHJcbiBcdHZhciBob3RBcHBseU9uVXBkYXRlID0gdHJ1ZTtcclxuIFx0dmFyIGhvdEN1cnJlbnRIYXNoID0gXCI4YmQ1MzI0Y2I5ZjUxZWJiMmFhZlwiOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RDdXJyZW50TW9kdWxlRGF0YSA9IHt9O1xyXG4gXHR2YXIgaG90Q3VycmVudENoaWxkTW9kdWxlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RDdXJyZW50UGFyZW50cyA9IFtdOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RDdXJyZW50UGFyZW50c1RlbXAgPSBbXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIG1lID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0aWYoIW1lKSByZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXztcclxuIFx0XHR2YXIgZm4gPSBmdW5jdGlvbihyZXF1ZXN0KSB7XHJcbiBcdFx0XHRpZihtZS5ob3QuYWN0aXZlKSB7XHJcbiBcdFx0XHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0pIHtcclxuIFx0XHRcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCkgPCAwKVxyXG4gXHRcdFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLnB1c2gobW9kdWxlSWQpO1xyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0XHRob3RDdXJyZW50Q2hpbGRNb2R1bGUgPSByZXF1ZXN0O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKG1lLmNoaWxkcmVuLmluZGV4T2YocmVxdWVzdCkgPCAwKVxyXG4gXHRcdFx0XHRcdG1lLmNoaWxkcmVuLnB1c2gocmVxdWVzdCk7XHJcbiBcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRjb25zb2xlLndhcm4oXCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgKyByZXF1ZXN0ICsgXCIpIGZyb20gZGlzcG9zZWQgbW9kdWxlIFwiICsgbW9kdWxlSWQpO1xyXG4gXHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFtdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18ocmVxdWVzdCk7XHJcbiBcdFx0fTtcclxuIFx0XHR2YXIgT2JqZWN0RmFjdG9yeSA9IGZ1bmN0aW9uIE9iamVjdEZhY3RvcnkobmFtZSkge1xyXG4gXHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxyXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxyXG4gXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xyXG4gXHRcdFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdO1xyXG4gXHRcdFx0XHR9LFxyXG4gXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiBcdFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXSA9IHZhbHVlO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9O1xyXG4gXHRcdH07XHJcbiBcdFx0Zm9yKHZhciBuYW1lIGluIF9fd2VicGFja19yZXF1aXJlX18pIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChfX3dlYnBhY2tfcmVxdWlyZV9fLCBuYW1lKSAmJiBuYW1lICE9PSBcImVcIikge1xyXG4gXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sIG5hbWUsIE9iamVjdEZhY3RvcnkobmFtZSkpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHRmbi5lID0gZnVuY3Rpb24oY2h1bmtJZCkge1xyXG4gXHRcdFx0aWYoaG90U3RhdHVzID09PSBcInJlYWR5XCIpXHJcbiBcdFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XHJcbiBcdFx0XHRob3RDaHVua3NMb2FkaW5nKys7XHJcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5lKGNodW5rSWQpLnRoZW4oZmluaXNoQ2h1bmtMb2FkaW5nLCBmdW5jdGlvbihlcnIpIHtcclxuIFx0XHRcdFx0ZmluaXNoQ2h1bmtMb2FkaW5nKCk7XHJcbiBcdFx0XHRcdHRocm93IGVycjtcclxuIFx0XHRcdH0pO1xyXG4gXHRcclxuIFx0XHRcdGZ1bmN0aW9uIGZpbmlzaENodW5rTG9hZGluZygpIHtcclxuIFx0XHRcdFx0aG90Q2h1bmtzTG9hZGluZy0tO1xyXG4gXHRcdFx0XHRpZihob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiKSB7XHJcbiBcdFx0XHRcdFx0aWYoIWhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSkge1xyXG4gXHRcdFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiYgaG90V2FpdGluZ0ZpbGVzID09PSAwKSB7XHJcbiBcdFx0XHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fTtcclxuIFx0XHRyZXR1cm4gZm47XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIGhvdCA9IHtcclxuIFx0XHRcdC8vIHByaXZhdGUgc3R1ZmZcclxuIFx0XHRcdF9hY2NlcHRlZERlcGVuZGVuY2llczoge30sXHJcbiBcdFx0XHRfZGVjbGluZWREZXBlbmRlbmNpZXM6IHt9LFxyXG4gXHRcdFx0X3NlbGZBY2NlcHRlZDogZmFsc2UsXHJcbiBcdFx0XHRfc2VsZkRlY2xpbmVkOiBmYWxzZSxcclxuIFx0XHRcdF9kaXNwb3NlSGFuZGxlcnM6IFtdLFxyXG4gXHRcdFx0X21haW46IGhvdEN1cnJlbnRDaGlsZE1vZHVsZSAhPT0gbW9kdWxlSWQsXHJcbiBcdFxyXG4gXHRcdFx0Ly8gTW9kdWxlIEFQSVxyXG4gXHRcdFx0YWN0aXZlOiB0cnVlLFxyXG4gXHRcdFx0YWNjZXB0OiBmdW5jdGlvbihkZXAsIGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGlmKHR5cGVvZiBkZXAgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmQWNjZXB0ZWQgPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwiZnVuY3Rpb25cIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZBY2NlcHRlZCA9IGRlcDtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxyXG4gXHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xyXG4gXHRcdFx0XHRlbHNlXHJcbiBcdFx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBdID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRkZWNsaW5lOiBmdW5jdGlvbihkZXApIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGRlcCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZEZWNsaW5lZCA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcclxuIFx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0XHRcdFx0aG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBbaV1dID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZVxyXG4gXHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwXSA9IHRydWU7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0ZGlzcG9zZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0YWRkRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdHJlbW92ZURpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90Ll9kaXNwb3NlSGFuZGxlcnMuaW5kZXhPZihjYWxsYmFjayk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdH0sXHJcbiBcdFxyXG4gXHRcdFx0Ly8gTWFuYWdlbWVudCBBUElcclxuIFx0XHRcdGNoZWNrOiBob3RDaGVjayxcclxuIFx0XHRcdGFwcGx5OiBob3RBcHBseSxcclxuIFx0XHRcdHN0YXR1czogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHRpZighbCkgcmV0dXJuIGhvdFN0YXR1cztcclxuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRhZGRTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0cmVtb3ZlU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90U3RhdHVzSGFuZGxlcnMuaW5kZXhPZihsKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIGhvdFN0YXR1c0hhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHJcbiBcdFx0XHQvL2luaGVyaXQgZnJvbSBwcmV2aW91cyBkaXNwb3NlIGNhbGxcclxuIFx0XHRcdGRhdGE6IGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXVxyXG4gXHRcdH07XHJcbiBcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gdW5kZWZpbmVkO1xyXG4gXHRcdHJldHVybiBob3Q7XHJcbiBcdH1cclxuIFx0XHJcbiBcdHZhciBob3RTdGF0dXNIYW5kbGVycyA9IFtdO1xyXG4gXHR2YXIgaG90U3RhdHVzID0gXCJpZGxlXCI7XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RTZXRTdGF0dXMobmV3U3RhdHVzKSB7XHJcbiBcdFx0aG90U3RhdHVzID0gbmV3U3RhdHVzO1xyXG4gXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBob3RTdGF0dXNIYW5kbGVycy5sZW5ndGg7IGkrKylcclxuIFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzW2ldLmNhbGwobnVsbCwgbmV3U3RhdHVzKTtcclxuIFx0fVxyXG4gXHRcclxuIFx0Ly8gd2hpbGUgZG93bmxvYWRpbmdcclxuIFx0dmFyIGhvdFdhaXRpbmdGaWxlcyA9IDA7XHJcbiBcdHZhciBob3RDaHVua3NMb2FkaW5nID0gMDtcclxuIFx0dmFyIGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdEF2YWlsYWJsZUZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3REZWZlcnJlZDtcclxuIFx0XHJcbiBcdC8vIFRoZSB1cGRhdGUgaW5mb1xyXG4gXHR2YXIgaG90VXBkYXRlLCBob3RVcGRhdGVOZXdIYXNoO1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gdG9Nb2R1bGVJZChpZCkge1xyXG4gXHRcdHZhciBpc051bWJlciA9ICgraWQpICsgXCJcIiA9PT0gaWQ7XHJcbiBcdFx0cmV0dXJuIGlzTnVtYmVyID8gK2lkIDogaWQ7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENoZWNrKGFwcGx5KSB7XHJcbiBcdFx0aWYoaG90U3RhdHVzICE9PSBcImlkbGVcIikgdGhyb3cgbmV3IEVycm9yKFwiY2hlY2soKSBpcyBvbmx5IGFsbG93ZWQgaW4gaWRsZSBzdGF0dXNcIik7XHJcbiBcdFx0aG90QXBwbHlPblVwZGF0ZSA9IGFwcGx5O1xyXG4gXHRcdGhvdFNldFN0YXR1cyhcImNoZWNrXCIpO1xyXG4gXHRcdHJldHVybiBob3REb3dubG9hZE1hbmlmZXN0KCkudGhlbihmdW5jdGlvbih1cGRhdGUpIHtcclxuIFx0XHRcdGlmKCF1cGRhdGUpIHtcclxuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcclxuIFx0XHRcdFx0cmV0dXJuIG51bGw7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwID0ge307XHJcbiBcdFx0XHRob3RBdmFpbGFibGVGaWxlc01hcCA9IHVwZGF0ZS5jO1xyXG4gXHRcdFx0aG90VXBkYXRlTmV3SGFzaCA9IHVwZGF0ZS5oO1xyXG4gXHRcclxuIFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XHJcbiBcdFx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gXHRcdFx0XHRob3REZWZlcnJlZCA9IHtcclxuIFx0XHRcdFx0XHRyZXNvbHZlOiByZXNvbHZlLFxyXG4gXHRcdFx0XHRcdHJlamVjdDogcmVqZWN0XHJcbiBcdFx0XHRcdH07XHJcbiBcdFx0XHR9KTtcclxuIFx0XHRcdGhvdFVwZGF0ZSA9IHt9O1xyXG4gXHRcdFx0dmFyIGNodW5rSWQgPSAzO1xyXG4gXHRcdFx0eyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWxvbmUtYmxvY2tzXHJcbiBcdFx0XHRcdC8qZ2xvYmFscyBjaHVua0lkICovXHJcbiBcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0aWYoaG90U3RhdHVzID09PSBcInByZXBhcmVcIiAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xyXG4gXHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXR1cm4gcHJvbWlzZTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdGlmKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSB8fCAhaG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0pXHJcbiBcdFx0XHRyZXR1cm47XHJcbiBcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSBmYWxzZTtcclxuIFx0XHRmb3IodmFyIG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRob3RVcGRhdGVbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHRpZigtLWhvdFdhaXRpbmdGaWxlcyA9PT0gMCAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwKSB7XHJcbiBcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKSB7XHJcbiBcdFx0aWYoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdKSB7XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xyXG4gXHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXMrKztcclxuIFx0XHRcdGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RVcGRhdGVEb3dubG9hZGVkKCkge1xyXG4gXHRcdGhvdFNldFN0YXR1cyhcInJlYWR5XCIpO1xyXG4gXHRcdHZhciBkZWZlcnJlZCA9IGhvdERlZmVycmVkO1xyXG4gXHRcdGhvdERlZmVycmVkID0gbnVsbDtcclxuIFx0XHRpZighZGVmZXJyZWQpIHJldHVybjtcclxuIFx0XHRpZihob3RBcHBseU9uVXBkYXRlKSB7XHJcbiBcdFx0XHRob3RBcHBseShob3RBcHBseU9uVXBkYXRlKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xyXG4gXHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XHJcbiBcdFx0XHR9LCBmdW5jdGlvbihlcnIpIHtcclxuIFx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KGVycik7XHJcbiBcdFx0XHR9KTtcclxuIFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XHJcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2godG9Nb2R1bGVJZChpZCkpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RBcHBseShvcHRpb25zKSB7XHJcbiBcdFx0aWYoaG90U3RhdHVzICE9PSBcInJlYWR5XCIpIHRocm93IG5ldyBFcnJvcihcImFwcGx5KCkgaXMgb25seSBhbGxvd2VkIGluIHJlYWR5IHN0YXR1c1wiKTtcclxuIFx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuIFx0XHJcbiBcdFx0dmFyIGNiO1xyXG4gXHRcdHZhciBpO1xyXG4gXHRcdHZhciBqO1xyXG4gXHRcdHZhciBtb2R1bGU7XHJcbiBcdFx0dmFyIG1vZHVsZUlkO1xyXG4gXHRcclxuIFx0XHRmdW5jdGlvbiBnZXRBZmZlY3RlZFN0dWZmKHVwZGF0ZU1vZHVsZUlkKSB7XHJcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW3VwZGF0ZU1vZHVsZUlkXTtcclxuIFx0XHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpLm1hcChmdW5jdGlvbihpZCkge1xyXG4gXHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdGNoYWluOiBbaWRdLFxyXG4gXHRcdFx0XHRcdGlkOiBpZFxyXG4gXHRcdFx0XHR9O1xyXG4gXHRcdFx0fSk7XHJcbiBcdFx0XHR3aGlsZShxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiBcdFx0XHRcdHZhciBxdWV1ZUl0ZW0gPSBxdWV1ZS5wb3AoKTtcclxuIFx0XHRcdFx0dmFyIG1vZHVsZUlkID0gcXVldWVJdGVtLmlkO1xyXG4gXHRcdFx0XHR2YXIgY2hhaW4gPSBxdWV1ZUl0ZW0uY2hhaW47XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRpZighbW9kdWxlIHx8IG1vZHVsZS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0aWYobW9kdWxlLmhvdC5fc2VsZkRlY2xpbmVkKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1kZWNsaW5lZFwiLFxyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihtb2R1bGUuaG90Ll9tYWluKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwidW5hY2NlcHRlZFwiLFxyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbW9kdWxlLnBhcmVudHMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHR2YXIgcGFyZW50SWQgPSBtb2R1bGUucGFyZW50c1tpXTtcclxuIFx0XHRcdFx0XHR2YXIgcGFyZW50ID0gaW5zdGFsbGVkTW9kdWxlc1twYXJlbnRJZF07XHJcbiBcdFx0XHRcdFx0aWYoIXBhcmVudCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0aWYocGFyZW50LmhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRlY2xpbmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0cGFyZW50SWQ6IHBhcmVudElkXHJcbiBcdFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRpZihvdXRkYXRlZE1vZHVsZXMuaW5kZXhPZihwYXJlbnRJZCkgPj0gMCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0aWYocGFyZW50LmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRpZighb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdKVxyXG4gXHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0gPSBbXTtcclxuIFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSwgW21vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXTtcclxuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaChwYXJlbnRJZCk7XHJcbiBcdFx0XHRcdFx0cXVldWUucHVzaCh7XHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxyXG4gXHRcdFx0XHRcdFx0aWQ6IHBhcmVudElkXHJcbiBcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHJcbiBcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHR0eXBlOiBcImFjY2VwdGVkXCIsXHJcbiBcdFx0XHRcdG1vZHVsZUlkOiB1cGRhdGVNb2R1bGVJZCxcclxuIFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzOiBvdXRkYXRlZE1vZHVsZXMsXHJcbiBcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzOiBvdXRkYXRlZERlcGVuZGVuY2llc1xyXG4gXHRcdFx0fTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGZ1bmN0aW9uIGFkZEFsbFRvU2V0KGEsIGIpIHtcclxuIFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBiLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdHZhciBpdGVtID0gYltpXTtcclxuIFx0XHRcdFx0aWYoYS5pbmRleE9mKGl0ZW0pIDwgMClcclxuIFx0XHRcdFx0XHRhLnB1c2goaXRlbSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBhdCBiZWdpbiBhbGwgdXBkYXRlcyBtb2R1bGVzIGFyZSBvdXRkYXRlZFxyXG4gXHRcdC8vIHRoZSBcIm91dGRhdGVkXCIgc3RhdHVzIGNhbiBwcm9wYWdhdGUgdG8gcGFyZW50cyBpZiB0aGV5IGRvbid0IGFjY2VwdCB0aGUgY2hpbGRyZW5cclxuIFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcclxuIFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0dmFyIGFwcGxpZWRVcGRhdGUgPSB7fTtcclxuIFx0XHJcbiBcdFx0dmFyIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSA9IGZ1bmN0aW9uIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSgpIHtcclxuIFx0XHRcdGNvbnNvbGUud2FybihcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlc3VsdC5tb2R1bGVJZCArIFwiKSB0byBkaXNwb3NlZCBtb2R1bGVcIik7XHJcbiBcdFx0fTtcclxuIFx0XHJcbiBcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGVJZCA9IHRvTW9kdWxlSWQoaWQpO1xyXG4gXHRcdFx0XHR2YXIgcmVzdWx0O1xyXG4gXHRcdFx0XHRpZihob3RVcGRhdGVbaWRdKSB7XHJcbiBcdFx0XHRcdFx0cmVzdWx0ID0gZ2V0QWZmZWN0ZWRTdHVmZihtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0cmVzdWx0ID0ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJkaXNwb3NlZFwiLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IGlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR2YXIgYWJvcnRFcnJvciA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgZG9BcHBseSA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgZG9EaXNwb3NlID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBjaGFpbkluZm8gPSBcIlwiO1xyXG4gXHRcdFx0XHRpZihyZXN1bHQuY2hhaW4pIHtcclxuIFx0XHRcdFx0XHRjaGFpbkluZm8gPSBcIlxcblVwZGF0ZSBwcm9wYWdhdGlvbjogXCIgKyByZXN1bHQuY2hhaW4uam9pbihcIiAtPiBcIik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0c3dpdGNoKHJlc3VsdC50eXBlKSB7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcInNlbGYtZGVjbGluZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBvZiBzZWxmIGRlY2xpbmU6IFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgY2hhaW5JbmZvKTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJkZWNsaW5lZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIG9mIGRlY2xpbmVkIGRlcGVuZGVuY3k6IFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIgaW4gXCIgKyByZXN1bHQucGFyZW50SWQgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcInVuYWNjZXB0ZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25VbmFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uVW5hY2NlcHRlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlVW5hY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBcIiArIG1vZHVsZUlkICsgXCIgaXMgbm90IGFjY2VwdGVkXCIgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcImFjY2VwdGVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uQWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25BY2NlcHRlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0ZG9BcHBseSA9IHRydWU7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwiZGlzcG9zZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EaXNwb3NlZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRpc3Bvc2VkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRkb0Rpc3Bvc2UgPSB0cnVlO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0ZGVmYXVsdDpcclxuIFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVuZXhjZXB0aW9uIHR5cGUgXCIgKyByZXN1bHQudHlwZSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYoYWJvcnRFcnJvcikge1xyXG4gXHRcdFx0XHRcdGhvdFNldFN0YXR1cyhcImFib3J0XCIpO1xyXG4gXHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChhYm9ydEVycm9yKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihkb0FwcGx5KSB7XHJcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSBob3RVcGRhdGVbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgcmVzdWx0Lm91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0XHRcdFx0Zm9yKG1vZHVsZUlkIGluIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0XHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pXHJcbiBcdFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdID0gW107XHJcbiBcdFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSwgcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKGRvRGlzcG9zZSkge1xyXG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgW3Jlc3VsdC5tb2R1bGVJZF0pO1xyXG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBTdG9yZSBzZWxmIGFjY2VwdGVkIG91dGRhdGVkIG1vZHVsZXMgdG8gcmVxdWlyZSB0aGVtIGxhdGVyIGJ5IHRoZSBtb2R1bGUgc3lzdGVtXHJcbiBcdFx0dmFyIG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdGZvcihpID0gMDsgaSA8IG91dGRhdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBvdXRkYXRlZE1vZHVsZXNbaV07XHJcbiBcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSAmJiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0b3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLnB1c2goe1xyXG4gXHRcdFx0XHRcdG1vZHVsZTogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZFxyXG4gXHRcdFx0XHR9KTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIE5vdyBpbiBcImRpc3Bvc2VcIiBwaGFzZVxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImRpc3Bvc2VcIik7XHJcbiBcdFx0T2JqZWN0LmtleXMoaG90QXZhaWxhYmxlRmlsZXNNYXApLmZvckVhY2goZnVuY3Rpb24oY2h1bmtJZCkge1xyXG4gXHRcdFx0aWYoaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gPT09IGZhbHNlKSB7XHJcbiBcdFx0XHRcdGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9KTtcclxuIFx0XHJcbiBcdFx0dmFyIGlkeDtcclxuIFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKTtcclxuIFx0XHR3aGlsZShxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiBcdFx0XHRtb2R1bGVJZCA9IHF1ZXVlLnBvcCgpO1xyXG4gXHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRpZighbW9kdWxlKSBjb250aW51ZTtcclxuIFx0XHJcbiBcdFx0XHR2YXIgZGF0YSA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdC8vIENhbGwgZGlzcG9zZSBoYW5kbGVyc1xyXG4gXHRcdFx0dmFyIGRpc3Bvc2VIYW5kbGVycyA9IG1vZHVsZS5ob3QuX2Rpc3Bvc2VIYW5kbGVycztcclxuIFx0XHRcdGZvcihqID0gMDsgaiA8IGRpc3Bvc2VIYW5kbGVycy5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHRjYiA9IGRpc3Bvc2VIYW5kbGVyc1tqXTtcclxuIFx0XHRcdFx0Y2IoZGF0YSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF0gPSBkYXRhO1xyXG4gXHRcclxuIFx0XHRcdC8vIGRpc2FibGUgbW9kdWxlICh0aGlzIGRpc2FibGVzIHJlcXVpcmVzIGZyb20gdGhpcyBtb2R1bGUpXHJcbiBcdFx0XHRtb2R1bGUuaG90LmFjdGl2ZSA9IGZhbHNlO1xyXG4gXHRcclxuIFx0XHRcdC8vIHJlbW92ZSBtb2R1bGUgZnJvbSBjYWNoZVxyXG4gXHRcdFx0ZGVsZXRlIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcclxuIFx0XHRcdC8vIHJlbW92ZSBcInBhcmVudHNcIiByZWZlcmVuY2VzIGZyb20gYWxsIGNoaWxkcmVuXHJcbiBcdFx0XHRmb3IoaiA9IDA7IGogPCBtb2R1bGUuY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcclxuIFx0XHRcdFx0dmFyIGNoaWxkID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGUuY2hpbGRyZW5bal1dO1xyXG4gXHRcdFx0XHRpZighY2hpbGQpIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRpZHggPSBjaGlsZC5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpO1xyXG4gXHRcdFx0XHRpZihpZHggPj0gMCkge1xyXG4gXHRcdFx0XHRcdGNoaWxkLnBhcmVudHMuc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIHJlbW92ZSBvdXRkYXRlZCBkZXBlbmRlbmN5IGZyb20gbW9kdWxlIGNoaWxkcmVuXHJcbiBcdFx0dmFyIGRlcGVuZGVuY3k7XHJcbiBcdFx0dmFyIG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzO1xyXG4gXHRcdGZvcihtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdGlmKG1vZHVsZSkge1xyXG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGZvcihqID0gMDsgaiA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbal07XHJcbiBcdFx0XHRcdFx0XHRpZHggPSBtb2R1bGUuY2hpbGRyZW4uaW5kZXhPZihkZXBlbmRlbmN5KTtcclxuIFx0XHRcdFx0XHRcdGlmKGlkeCA+PSAwKSBtb2R1bGUuY2hpbGRyZW4uc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBOb3QgaW4gXCJhcHBseVwiIHBoYXNlXHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiYXBwbHlcIik7XHJcbiBcdFxyXG4gXHRcdGhvdEN1cnJlbnRIYXNoID0gaG90VXBkYXRlTmV3SGFzaDtcclxuIFx0XHJcbiBcdFx0Ly8gaW5zZXJ0IG5ldyBjb2RlXHJcbiBcdFx0Zm9yKG1vZHVsZUlkIGluIGFwcGxpZWRVcGRhdGUpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcHBsaWVkVXBkYXRlLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBhcHBsaWVkVXBkYXRlW21vZHVsZUlkXTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIGNhbGwgYWNjZXB0IGhhbmRsZXJzXHJcbiBcdFx0dmFyIGVycm9yID0gbnVsbDtcclxuIFx0XHRmb3IobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0dmFyIGNhbGxiYWNrcyA9IFtdO1xyXG4gXHRcdFx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXTtcclxuIFx0XHRcdFx0XHRjYiA9IG1vZHVsZS5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcGVuZGVuY3ldO1xyXG4gXHRcdFx0XHRcdGlmKGNhbGxiYWNrcy5pbmRleE9mKGNiKSA+PSAwKSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRjYWxsYmFja3MucHVzaChjYik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0Zm9yKGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdFx0Y2IgPSBjYWxsYmFja3NbaV07XHJcbiBcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdGNiKG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzKTtcclxuIFx0XHRcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiYWNjZXB0LWVycm9yZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZGVwZW5kZW5jeUlkOiBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXSxcclxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBMb2FkIHNlbGYgYWNjZXB0ZWQgbW9kdWxlc1xyXG4gXHRcdGZvcihpID0gMDsgaSA8IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0dmFyIGl0ZW0gPSBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXNbaV07XHJcbiBcdFx0XHRtb2R1bGVJZCA9IGl0ZW0ubW9kdWxlO1xyXG4gXHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xyXG4gXHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCk7XHJcbiBcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgaXRlbS5lcnJvckhhbmRsZXIgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gXHRcdFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdFx0XHRpdGVtLmVycm9ySGFuZGxlcihlcnIpO1xyXG4gXHRcdFx0XHRcdH0gY2F0Y2goZXJyMikge1xyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3ItaGFuZGxlci1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnIyLFxyXG4gXHRcdFx0XHRcdFx0XHRcdG9yZ2luYWxFcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnIyO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBoYW5kbGUgZXJyb3JzIGluIGFjY2VwdCBoYW5kbGVycyBhbmQgc2VsZiBhY2NlcHRlZCBtb2R1bGUgbG9hZFxyXG4gXHRcdGlmKGVycm9yKSB7XHJcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJmYWlsXCIpO1xyXG4gXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XHJcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcclxuIFx0XHRcdHJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGhvdDogaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSxcbiBcdFx0XHRwYXJlbnRzOiAoaG90Q3VycmVudFBhcmVudHNUZW1wID0gaG90Q3VycmVudFBhcmVudHMsIGhvdEN1cnJlbnRQYXJlbnRzID0gW10sIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCksXG4gXHRcdFx0Y2hpbGRyZW46IFtdXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBfX3dlYnBhY2tfaGFzaF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhvdEN1cnJlbnRIYXNoOyB9O1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBob3RDcmVhdGVSZXF1aXJlKDI0NikoX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMjQ2KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA4YmQ1MzI0Y2I5ZjUxZWJiMmFhZiIsIm1vZHVsZS5leHBvcnRzID0gdmVuZG9yO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwidmVuZG9yXCJcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSA2IDcgOCA5IDEwIiwibW9kdWxlLmV4cG9ydHMgPSAoX193ZWJwYWNrX3JlcXVpcmVfXygwKSkoNzcpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGRlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvbG9kYXNoLmpzIGZyb20gZGxsLXJlZmVyZW5jZSB2ZW5kb3Jcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAzIDQgOCIsImV4cG9ydCBpbnRlcmZhY2UgQ2FsbCB7XG5cdCgpOiB2b2lkO1xufVxuZXhwb3J0IGludGVyZmFjZSBDYWxsMTxBPiB7XG5cdChhcmc6IEEpOiB2b2lkO1xufVxuZXhwb3J0IGludGVyZmFjZSBDYWxsMjxBMSwgQTI+IHtcblx0KGFyZzE6IEExLCBhcmcyOiBBMik6IHZvaWQ7XG59XG5leHBvcnQgaW50ZXJmYWNlIENhbGwzPEExLCBBMiwgQTM+IHtcblx0KGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMpOiB2b2lkO1xufVxuZXhwb3J0IGNsYXNzIFBhaXI8VDEsIFQyPiB7XG5cdGNvbnN0cnVjdG9yKHB1YmxpYyBmaXJzdDogVDEsIHB1YmxpYyBzZWNvbmQ6IFQyKSB7fVxufVxuZXhwb3J0IGludGVyZmFjZSBGdW4wPFQ+IHtcblx0KCk6IFQ7XG59XG5leHBvcnQgaW50ZXJmYWNlIEZ1bjE8QSwgVD4ge1xuXHQoYXJnOiBBKTogVDtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgRnVuMjxBMSwgQTIsIFQ+IHtcblx0KGFyZzE6IEExLCBhcmcyOiBBMik6IFQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcnJheWlmKG9iajogYW55ID0gW10pOiBhbnlbXSB7XG5cdGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcblx0XHRyZXR1cm4gWy4uLm9ial07XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIFtvYmpdO1xuXHR9XG59XG5leHBvcnQgZnVuY3Rpb24gbGF6eSh2YWw6IGFueSk6ICgpID0+IGFueSB7XG5cdGlmICh0eXBlb2YgdmFsID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRyZXR1cm4gdmFsKCk7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuICgpID0+IHZhbDtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgTG9jayB7XG5cdGNvbnN0cnVjdG9yKHByaXZhdGUgX2xvY2s6IGJvb2xlYW4gPSBmYWxzZSwgcHJpdmF0ZSBiZWZvcmU/OiBDYWxsLCBwcml2YXRlIGFmdGVyPzogQ2FsbCkge31cblx0cHVibGljIHN0YXRpYyBvZigpOiBMb2NrIHtcblx0XHRyZXR1cm4gbmV3IExvY2soKTtcblx0fVxuXHRnZXQgaXNMb2NrKCk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiB0aGlzLl9sb2NrO1xuXHR9XG5cdGdldCBpc0ZyZWUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuICF0aGlzLl9sb2NrO1xuXHR9XG5cdHN0YXJ0KGJlZm9yZT86IENhbGwpOiB2b2lkIHtcblx0XHR0aGlzLmNoZWNrRnJlZSgpO1xuXHRcdGlmICh0aGlzLmJlZm9yZSkge1xuXHRcdFx0dGhpcy5iZWZvcmUoKTtcblx0XHR9XG5cdFx0aWYgKGJlZm9yZSkge1xuXHRcdFx0YmVmb3JlKCk7XG5cdFx0fVxuXHRcdHRoaXMuX2xvY2sgPSB0cnVlO1xuXHR9XG5cdGVuZChhZnRlcj86IENhbGwpOiB2b2lkIHtcblx0XHR0aGlzLmNoZWNrTG9ja2luZygpO1xuXHRcdHRoaXMuX2xvY2sgPSBmYWxzZTtcblx0XHRpZiAoYWZ0ZXIpIHtcblx0XHRcdGFmdGVyKCk7XG5cdFx0fVxuXHRcdGlmICh0aGlzLmFmdGVyKSB7XG5cdFx0XHR0aGlzLmFmdGVyKCk7XG5cdFx0fVxuXHR9XG5cdGF0b20oYWN0aW9uOiBDYWxsLCBiZWZvcmU/OiBDYWxsLCBhZnRlcj86IENhbGwpOiBMb2NrIHtcblx0XHR0aGlzLnN0YXJ0KGJlZm9yZSk7XG5cdFx0YWN0aW9uKCk7XG5cdFx0dGhpcy5lbmQoYWZ0ZXIpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cdHByaXZhdGUgY2hlY2tMb2NraW5nKCk6IHZvaWQge1xuXHRcdGlmICghdGhpcy5fbG9jaykge1xuXHRcdFx0dGhyb3cgbmV3IEV4Y2VwdGlvbihcIm9iamVjdCBsb2NrZWRcIik7XG5cdFx0fVxuXHR9XG5cdHByaXZhdGUgY2hlY2tGcmVlKCk6IHZvaWQge1xuXHRcdGlmICh0aGlzLl9sb2NrKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXhjZXB0aW9uKFwib2JqZWN0IGxvY2tlZFwiKTtcblx0XHR9XG5cdH1cbn1cblxuLyoqXG4gKiDlkIzmraXmlrnms5XkuK3pmo/kvr/kvb/nlKhcbiAqIOW8guatpeaWueazleS4reWmguaenOS4jeWFs+W/g+e7k+aenOeahOWJjee9ruWkhOeQhu+8jOWPquWFs+W/g+e7k+aenOeahOWQjue9ruWkhOeQhu+8jOWPr+S7peS9v+eUqOivpeexu++8jFxuICovXG5leHBvcnQgY2xhc3MgU3RvcmU8VD4ge1xuXHRwcml2YXRlIF9zdGF0ZTogYm9vbGVhbiA9IGZhbHNlO1xuXHRwcml2YXRlIF9kYXRhOiBUID0gbnVsbDtcblxuXHRzZXQgZGF0YShyZXN1bHQ6IFQpIHtcblx0XHR0aGlzLl9zdGF0ZSA9IHRydWU7XG5cdFx0dGhpcy5fZGF0YSA9IHJlc3VsdDtcblx0fVxuXHRnZXQgc3RhdGUoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMuX3N0YXRlO1xuXHR9XG5cdGdldCBkYXRhKCk6IFQge1xuXHRcdHJldHVybiB0aGlzLl9kYXRhO1xuXHR9XG5cdHJlc2V0KCk6IHRoaXMge1xuXHRcdHRoaXMuX3N0YXRlID0gZmFsc2U7XG5cdFx0dGhpcy5fZGF0YSA9IG51bGw7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cbn1cbmV4cG9ydCBjbGFzcyBTdGFuZGFyZFN0b3JlPFQ+IHtcblx0cHJpdmF0ZSBfaXNTdGFuZGFyZDogYm9vbGVhbiA9IGZhbHNlO1xuXHRwcml2YXRlIF9zdG9yZTogU3RvcmU8VCB8IGFueT4gPSBuZXcgU3RvcmU8VCB8IGFueT4oKTtcblxuXHRzdGF0ZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5fc3RvcmUuc3RhdGU7XG5cdH1cblx0aXNTdGFuZGFyZCgpOiBib29sZWFuIHtcblx0XHR0aGlzLmNoZWNrUmVhZGFibGUoKTtcblx0XHRyZXR1cm4gdGhpcy5faXNTdGFuZGFyZDtcblx0fVxuXHRzZXREYXRhKGRhdGE6IFQpOiB0aGlzIHtcblx0XHR0aGlzLl9pc1N0YW5kYXJkID0gZmFsc2U7XG5cdFx0dGhpcy5fc3RvcmUuZGF0YSA9IGRhdGE7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0c2V0RXJyb3IoZXJyb3I6IGFueSk6IHRoaXMge1xuXHRcdHRoaXMuX2lzU3RhbmRhcmQgPSB0cnVlO1xuXHRcdHRoaXMuX3N0b3JlLmRhdGEgPSBlcnJvcjtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXHRnZXREYXRhKCk6IFQge1xuXHRcdHRoaXMuY2hlY2tSZWFkYWJsZSgpO1xuXHRcdHJldHVybiAhdGhpcy5faXNTdGFuZGFyZCA/IHRoaXMuX3N0b3JlLmRhdGEgOiBudWxsO1xuXHR9XG5cdGdldEVycm9yKCkge1xuXHRcdHRoaXMuY2hlY2tSZWFkYWJsZSgpO1xuXHRcdHJldHVybiB0aGlzLl9pc1N0YW5kYXJkID8gdGhpcy5fc3RvcmUuZGF0YSA6IG51bGw7XG5cdH1cblx0cHJpdmF0ZSBjaGVja1JlYWRhYmxlKCkge1xuXHRcdGlmICghdGhpcy5fc3RvcmUuc3RhdGUpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihcInJlc3VsdCBkb2VzIG5vdCBzZXRcIik7XG5cdFx0fVxuXHR9XG5cdHJlc2V0KCkge1xuXHRcdHRoaXMuX3N0b3JlLnJlc2V0KCk7XG5cdH1cbn1cbmV4cG9ydCBjbGFzcyBTdGF0ZVByb21pc2U8VD4ge1xuXHRwcml2YXRlIF9maW5pc2hlZDogYm9vbGVhbiA9IGZhbHNlO1xuXHRwcml2YXRlIF9yZXNvbHZlOiBDYWxsMTxUPjtcblx0cHJpdmF0ZSBfcmVqZWN0OiBDYWxsMTxhbnk+O1xuXHRwcml2YXRlIF9wcm9taXNlOiBQcm9taXNlPFQ+O1xuXHRwcml2YXRlIF9sb2NrOiBMb2NrID0gbmV3IExvY2soKTtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5fcHJvbWlzZSA9IG5ldyBQcm9taXNlPFQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdHRoaXMuX3Jlc29sdmUgPSByZXNvbHZlO1xuXHRcdFx0dGhpcy5fcmVqZWN0ID0gcmVqZWN0O1xuXHRcdH0pO1xuXHR9XG5cdGdldCBpc0ZpbmlzaGVkKCkge1xuXHRcdHJldHVybiB0aGlzLl9maW5pc2hlZDtcblx0fVxuXHRhY3Rpb24oYWN0aW9uOiBDYWxsMjxDYWxsMTxUPiwgQ2FsbDE8YW55Pj4pIHtcblx0XHR0aGlzLmNoZWNrV3JpdGVhYmxlKCk7XG5cdFx0aWYgKHRoaXMuX2xvY2suaXNMb2NrKSB7XG5cdFx0XHR0aGlzLl9sb2NrLmF0b20oKCkgPT4ge1xuXHRcdFx0XHRhY3Rpb24oXG5cdFx0XHRcdFx0KGRhdGE/OiBUKSA9PiB7XG5cdFx0XHRcdFx0XHR0aGlzLnJlc29sdmUoZGF0YSk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQoZXJyb3I/OiBhbnkpID0+IHtcblx0XHRcdFx0XHRcdHRoaXMucmVqZWN0KGVycm9yKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblx0cmVqZWN0KGVycm9yPzogYW55KSB7XG5cdFx0dGhpcy5jaGVja1dyaXRlYWJsZSgpO1xuXHRcdHRoaXMuX2ZpbmlzaGVkID0gdHJ1ZTtcblx0XHR0aGlzLl9yZWplY3QoZXJyb3IpO1xuXHR9XG5cdHJlc29sdmUoZGF0YT86IFQpIHtcblx0XHR0aGlzLmNoZWNrV3JpdGVhYmxlKCk7XG5cdFx0dGhpcy5fZmluaXNoZWQgPSB0cnVlO1xuXHRcdHRoaXMuX3Jlc29sdmUoZGF0YSk7XG5cdH1cblx0Z2V0IHByb21pc2UoKTogUHJvbWlzZTxUPiB7XG5cdFx0cmV0dXJuIHRoaXMuX3Byb21pc2U7XG5cdH1cblx0cHJpdmF0ZSBjaGVja1dyaXRlYWJsZSgpIHtcblx0XHRpZiAodGhpcy5fZmluaXNoZWQpIHtcblx0XHRcdHRocm93IG5ldyBFeGNlcHRpb24oXCJyZXN1bHQgaGFzIGJlZW4gc2V0dGVkXCIpO1xuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgY2xhc3MgU3RhdGVzUHJvbWlzZTxUPiB7XG5cdHByaXZhdGUgX2ZpbmlzaGVkOiBib29sZWFuID0gZmFsc2U7XG5cdHByaXZhdGUgX3Jlc29sdmU6IENhbGwxPFQ+O1xuXHRwcml2YXRlIF9yZWplY3Q6IENhbGwxPGFueT47XG5cdHByaXZhdGUgX3Byb21pc2U6IFByb21pc2U8VD47XG5cdHByaXZhdGUgX3N0b3JlOiBTdGFuZGFyZFN0b3JlPFQ+ID0gbmV3IFN0YW5kYXJkU3RvcmU8VD4oKTtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5fcHJvbWlzZSA9IG5ldyBQcm9taXNlPFQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdHRoaXMuX3Jlc29sdmUgPSByZXNvbHZlO1xuXHRcdFx0dGhpcy5fcmVqZWN0ID0gcmVqZWN0O1xuXHRcdH0pO1xuXHR9XG5cdGlzRmluaXNoZWQoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX2ZpbmlzaGVkO1xuXHR9XG5cdHJlc29sdmVEYXRhKGRhdGE6IFQpOiB0aGlzIHtcblx0XHR0aGlzLmNoZWNrV3JpdGVhYmxlKCk7XG5cdFx0dGhpcy5fc3RvcmUuc2V0RGF0YShkYXRhKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXHRyZWplY3REYXRhKGVycm9yPzogYW55KTogdGhpcyB7XG5cdFx0dGhpcy5jaGVja1dyaXRlYWJsZSgpO1xuXHRcdHRoaXMuX3N0b3JlLnNldEVycm9yKGVycm9yKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXHRyZWplY3QoKSB7XG5cdFx0dGhpcy5jaGVja1dyaXRlYWJsZSgpO1xuXHRcdHRoaXMuX3JlamVjdCh0aGlzLl9zdG9yZS5nZXRFcnJvcigpKTtcblx0fVxuXHRyZXNvbHZlKCkge1xuXHRcdHRoaXMuY2hlY2tXcml0ZWFibGUoKTtcblx0XHR0aGlzLl9yZXNvbHZlKHRoaXMuX3N0b3JlLmdldERhdGEoKSk7XG5cdH1cblx0cHJpdmF0ZSBjaGVja1dyaXRlYWJsZSgpIHtcblx0XHRpZiAodGhpcy5fZmluaXNoZWQpIHtcblx0XHRcdHRocm93IG5ldyBFeGNlcHRpb24oXCJyZXN1bHQgaGFzIGJlZW4gc2V0dGVkXCIpO1xuXHRcdH1cblx0fVxuXHRnZXQgcHJvbWlzZSgpOiBQcm9taXNlPFQ+IHtcblx0XHRyZXR1cm4gdGhpcy5fcHJvbWlzZTtcblx0fVxufVxuZXhwb3J0IGNsYXNzIEV4Y2VwdGlvbiBleHRlbmRzIEVycm9yIHtcblx0cHJpdmF0ZSBjb2RlOiBudW1iZXIgPSAtMTtcblx0Y29uc3RydWN0b3IobWVzc2FnZT86IHN0cmluZywgY29kZT86IG51bWJlcikge1xuXHRcdHN1cGVyKG1lc3NhZ2UpO1xuXHRcdGlmIChOdW1iZXIuaXNGaW5pdGUoY29kZSkpIHtcblx0XHRcdHRoaXMuY29kZSA9IGNvZGU7XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsYXp5VmFsdWU8VD4odmFsdWU6IENhbGwgfCBhbnkpOiBUIHtcblx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0cmV0dXJuIHZhbHVlKCk7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2hhcmVkL2xpYi9mdW5jdGlvbnMudHMiLCJpbXBvcnQgKiBhcyAkIGZyb20gXCJqcXVlcnlcIjtcbmltcG9ydCAqIGFzIF8gZnJvbSBcImxvZGFzaFwiO1xuaW1wb3J0IHsgdGFibGUgfSBmcm9tIFwidGFibGVcIjtcbmltcG9ydCB7IENhbGwxLCBDYWxsMyB9IGZyb20gXCIuLi8uLi9zaGFyZWQvbGliL2Z1bmN0aW9uc1wiO1xuaW1wb3J0IHsgUGFpciwgU3RvcmUgfSBmcm9tIFwiLi4vLi4vc2hhcmVkL2xpYi9pbmRleFwiO1xuXG4kKCgpID0+IHtcblx0Y29uc3Qgd2FsbDogUG9zaXRpb25bXSA9IFtQb3NpdGlvbi5vZigzLCAwKSwgUG9zaXRpb24ub2YoMywgMSksIFBvc2l0aW9uLm9mKDMsIDIpLCBQb3NpdGlvbi5vZigzLCAzKV07XG5cdGNvbnN0IHdpZHRoID0gNTtcblx0Y29uc3QgaGVpZ2h0ID0gNTtcblx0Y29uc3QgZ3JpZCA9IG5ldyBHcmlkKHdpZHRoLCBoZWlnaHQpO1xuXHR3YWxsLmZvckVhY2goaXQgPT4ge1xuXHRcdGNvbnN0IGJveCA9IGdyaWQuZ2V0Qm94KGl0KTtcblx0XHRncmlkLmFkZFdhbGwoYm94KTtcblx0fSk7XG5cdGdyaWQucHJpbnQoKTtcblxuXHRjb25zdCBzdGFydFBvc2l0aW9uID0gUG9zaXRpb24ub2YoMCwgMCk7XG5cdGNvbnN0IGVuZFBvc2l0aW9uID0gUG9zaXRpb24ub2YoNCwgMCk7XG5cblx0Y29uc3Qgb25GaW5kOiBDYWxsMTxCb3hbXT4gPSAocGF0aDogQm94W10pID0+IHtcblx0XHRncmlkLnByaW50KHBhdGgpO1xuXHR9O1xuXHRjb25zdCBzdGFydDogQm94ID0gZ3JpZC5nZXRCb3goc3RhcnRQb3NpdGlvbik7XG5cdGNvbnN0IGVuZDogQm94ID0gZ3JpZC5nZXRCb3goZW5kUG9zaXRpb24pO1xuXG5cdG5ldyBBU3RhcihncmlkLCBzdGFydCwgZW5kLCBvbkZpbmQpLnNlYXJjaCgpO1xufSk7XG5cbmNsYXNzIEFTdGFyIHtcblx0cHJpdmF0ZSBzaG9ydGVzdFBhdGg6IFN0b3JlPEJveFtdPltdID0gW107XG5cdGNvbnN0cnVjdG9yKHByaXZhdGUgZ3JpZDogR3JpZCwgcHJpdmF0ZSBzdGFydDogQm94LCBwcml2YXRlIGVuZDogQm94LCBwcml2YXRlIG9uRmluZDogQ2FsbDE8Qm94W10+KSB7XG5cdFx0dGhpcy5ncmlkLmZvckVhY2goaXQgPT4ge1xuXHRcdFx0dGhpcy5zaG9ydGVzdFBhdGgucHVzaChuZXcgU3RvcmU8Qm94W10+KCkpO1xuXHRcdH0pO1xuXHR9XG5cdGNvbXBhcmUobzE6IEJveCwgbzI6IEJveCwgZGlzdDogQm94KTogbnVtYmVyIHtcblx0XHRjb25zdCBwMCA9IGRpc3QuZ2V0UG9zdGlvbigpO1xuXHRcdGNvbnN0IHAxID0gbzEuZ2V0UG9zdGlvbigpO1xuXHRcdGNvbnN0IHAyID0gbzIuZ2V0UG9zdGlvbigpO1xuXHRcdHJldHVybiAoXG5cdFx0XHRNYXRoLnBvdyhwMC53IC0gcDEudywgMikgKyBNYXRoLnBvdyhwMC5oIC0gcDEuaCwgMikgLSBNYXRoLnBvdyhwMC53IC0gcDIudywgMikgLSBNYXRoLnBvdyhwMC5oIC0gcDIuaCwgMilcblx0XHQpO1xuXHR9XG5cdGxvY2tpbmdCb3hMaXN0OiBCb3hbXSA9IFtdO1xuXHRpc0xvY2tpbmcoYm94OiBCb3gpIHtcblx0XHRyZXR1cm4gdGhpcy5sb2NraW5nQm94TGlzdC5pbmNsdWRlcyhib3gpO1xuXHR9XG5cdGxvY2tCb3goYm94OiBCb3gpIHtcblx0XHRyZXR1cm4gdGhpcy5sb2NraW5nQm94TGlzdC5wdXNoKGJveCk7XG5cdH1cblx0dW5Mb2NrQm94KGJveDogQm94KSB7XG5cdFx0aWYgKHRoaXMubG9ja2luZ0JveExpc3QuaW5jbHVkZXMoYm94KSkge1xuXHRcdFx0dGhpcy5sb2NraW5nQm94TGlzdC5zcGxpY2UodGhpcy5sb2NraW5nQm94TGlzdC5pbmRleE9mKGJveCkpO1xuXHRcdH1cblx0fVxuXHRhY3Rpb24oYm94OiBCb3gsIGFjdGlvbjogKCkgPT4gdm9pZCkge1xuXHRcdHRoaXMubG9ja0JveChib3gpO1xuXHRcdGFjdGlvbigpO1xuXHRcdHRoaXMudW5Mb2NrQm94KGJveCk7XG5cdH1cblx0c2VhcmNoKCkge1xuXHRcdGNvbnN0IGdldENvbm5lY3RvcjogQ2FsbDM8Qm94LCBCb3gsIENhbGwxPFBhaXI8Qm94LCBCb3g+Pj4gPSAoXG5cdFx0XHRzdGFydDogQm94LFxuXHRcdFx0ZW5kOiBCb3gsXG5cdFx0XHRvbkdldENvbm5lY3RvcjogQ2FsbDE8UGFpcjxCb3gsIEJveD4+XG5cdFx0KSA9PiB7XG5cdFx0XHR0aGlzLmxvY2tCb3goc3RhcnQpO1xuXHRcdFx0Y29uc3QgbmVpZ2hib3VycyA9IHRoaXMuZ3JpZC5nZXROZWlnaGJvdXJzKHN0YXJ0KS5maWx0ZXIoaXQgPT4gIXRoaXMuaXNMb2NraW5nKGl0KSk7XG5cdFx0XHRuZWlnaGJvdXJzLmZvckVhY2goaXQgPT4ge1xuXHRcdFx0XHRvbkdldENvbm5lY3RvcihuZXcgUGFpcihzdGFydCwgaXQpKTtcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy51bkxvY2tCb3goc3RhcnQpO1xuXHRcdH07XG5cdFx0Y29uc3QgY2FydGVzaWFuUHJvZHVjdCA9IChwYXRoMTogQm94W11bXSwgcGF0aDI6IEJveFtdW10sIG9uR2V0Q2FydGVzaWFuUHJvZHVjdDogQ2FsbDE8Qm94W10+KSA9PiB7XG5cdFx0XHRjb25zdCBnZXRNaW5QYXRoID0gKHBhdGhzOiBCb3hbXVtdKTogU3RvcmU8Qm94W10+ID0+IHtcblx0XHRcdFx0Y29uc3QgcmVzdWx0ID0gbmV3IFN0b3JlPEJveFtdPigpO1xuXHRcdFx0XHRwYXRocy5mb3JFYWNoKGl0ID0+IHtcblx0XHRcdFx0XHRpZiAocmVzdWx0LnN0YXRlKSB7XG5cdFx0XHRcdFx0XHRyZXN1bHQuZGF0YSA9IGl0Lmxlbmd0aCA8IHJlc3VsdC5kYXRhLmxlbmd0aCA/IGl0IDogcmVzdWx0LmRhdGE7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJlc3VsdC5kYXRhID0gaXQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH07XG5cdFx0XHRjb25zdCBzdG9yZTEgPSBnZXRNaW5QYXRoKHBhdGgxKTtcblx0XHRcdGNvbnN0IHN0b3JlMiA9IGdldE1pblBhdGgocGF0aDIpO1xuXHRcdFx0aWYgKHN0b3JlMS5zdGF0ZSAmJiBzdG9yZTIuc3RhdGUpIHtcblx0XHRcdFx0b25HZXRDYXJ0ZXNpYW5Qcm9kdWN0KFsuLi5zdG9yZTEuZGF0YSwgLi4uc3RvcmUyLmRhdGFdKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0Y29uc3QgZ2V0QWxsUGF0aCA9IChcblx0XHRcdHN0YXJ0OiBCb3gsXG5cdFx0XHRlbmQ6IEJveCxcblx0XHRcdGdldENvbm5lY3RvcjogQ2FsbDM8Qm94LCBCb3gsIENhbGwxPFBhaXI8Qm94LCBCb3g+Pj4sXG5cdFx0XHRvbkdldFBhdGg6IENhbGwxPEJveFtdPlxuXHRcdCkgPT4ge1xuXHRcdFx0aWYgKHN0YXJ0LmVxdWFscyhlbmQpKSB7XG5cdFx0XHRcdG9uR2V0UGF0aChbZW5kXSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zdCBvbkdldENvbm5lY3RvciA9IGNvbm5lY3RQYWlyID0+IHtcblx0XHRcdFx0XHRjb25zdCBnZXRTdWJSZXN1bHQgPSAoc3RhcnQsIGVuZCkgPT4ge1xuXHRcdFx0XHRcdFx0bGV0IHJlc3VsdDogQm94W11bXSA9IFtdO1xuXHRcdFx0XHRcdFx0Z2V0QWxsUGF0aChzdGFydCwgZW5kLCBnZXRDb25uZWN0b3IsIHBhdGggPT4ge1xuXHRcdFx0XHRcdFx0XHRyZXN1bHQucHVzaChwYXRoKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGNvbnN0IHN1YjEgPSBnZXRTdWJSZXN1bHQoc3RhcnQsIGNvbm5lY3RQYWlyLmZpcnN0KTtcblx0XHRcdFx0XHRjb25zdCBzdWIyID0gZ2V0U3ViUmVzdWx0KGNvbm5lY3RQYWlyLnNlY29uZCwgZW5kKTtcblx0XHRcdFx0XHRpZiAoc3ViMS5sZW5ndGggPiAwICYmIHN1YjIubGVuZ3RoID4gMCkge1xuXHRcdFx0XHRcdFx0Y2FydGVzaWFuUHJvZHVjdChzdWIxLCBzdWIyLCBwYXRoID0+IHtcblx0XHRcdFx0XHRcdFx0b25HZXRQYXRoKHBhdGgpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRnZXRDb25uZWN0b3Ioc3RhcnQsIGVuZCwgb25HZXRDb25uZWN0b3IpO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0Ly8gY29uc3QgZ2V0U2hvcnRlc3RQYXRoID0gKGFsbFBhdGhzOiBCb3hbXVtdLCBvbkdldDogU3RhdDE8Qm94W10+KSA9PiB7XG5cdFx0Ly8gXHRpZiAoYWxsUGF0aHMubGVuZ3RoID4gMCkge1xuXHRcdC8vIFx0XHRsZXQgcmVzdWx0ID0gYWxsUGF0aHMucmVkdWNlKChwcmV2OiBCb3hbXSwgY3VycjogQm94W10pID0+IHtcblx0XHQvLyBcdFx0XHRsZXQgcmVzdWx0ID0gbnVsbFxuXHRcdC8vIFx0XHRcdGlmIChwcmV2ID09IG51bGwpIHtcblx0XHQvLyBcdFx0XHRcdHJlc3VsdCA9IGN1cnJcblx0XHQvLyBcdFx0XHR9IGVsc2Uge1xuXHRcdC8vIFx0XHRcdFx0cHJldiA9IHByZXYubGVuZ3RoIDwgY3Vyci5sZW5ndGggPyBwcmV2IDogY3VyclxuXHRcdC8vIFx0XHRcdH1cblx0XHQvLyBcdFx0XHRyZXR1cm4gcmVzdWx0XG5cdFx0Ly8gXHRcdH0sIG51bGwpXG5cdFx0Ly8gXHRcdG9uR2V0KHJlc3VsdClcblx0XHQvLyBcdH1cblx0XHQvLyB9XG5cdFx0Z2V0QWxsUGF0aCh0aGlzLnN0YXJ0LCB0aGlzLmVuZCwgZ2V0Q29ubmVjdG9yLCBwYXRoID0+IHtcblx0XHRcdHRoaXMuZ3JpZC5wcmludChwYXRoKTtcblx0XHRcdHRoaXMub25GaW5kO1xuXHRcdH0pO1xuXHR9XG59XG5cbmNsYXNzIEdyaWQge1xuXHRnZXROZWlnaGJvdXJzKGJveDogQm94KSB7XG5cdFx0cmV0dXJuIHRoaXMuZ2V0TmVpZ2hib3VyUG9zaXRpb24oYm94LmdldFBvc3Rpb24oKSlcblx0XHRcdC5tYXAoaXQgPT4gdGhpcy5nZXRCb3goaXQpKVxuXHRcdFx0LmZpbHRlcihpdCA9PiAhdGhpcy5pc1dhbGwoaXQpKTtcblx0fVxuXHRwcml2YXRlIHdhbGxCb3hMaXN0OiBCb3hbXSA9IFtdO1xuXHRpc1dhbGwoYm94OiBCb3gpIHtcblx0XHRyZXR1cm4gdGhpcy53YWxsQm94TGlzdC5pbmNsdWRlcyhib3gpO1xuXHR9XG5cdGFkZFdhbGwoYm94OiBCb3gpIHtcblx0XHR0aGlzLndhbGxCb3hMaXN0LnB1c2goYm94KTtcblx0fVxuXG5cdHByaXZhdGUgZ2V0TmVpZ2hib3VyUG9zaXRpb24ocG9zaXRpb246IFBvc2l0aW9uKTogUG9zaXRpb25bXSB7XG5cdFx0Y29uc3Qgc3ViUG9zaXRpb24xID0gW3Bvc2l0aW9uLncgLSAxLCBwb3NpdGlvbi53ICsgMV0ubWFwKGl0ID0+IG5ldyBQb3NpdGlvbihpdCwgcG9zaXRpb24uaCkpO1xuXHRcdGNvbnN0IHN1YlBvc2l0aW9uMiA9IFtwb3NpdGlvbi5oIC0gMSwgcG9zaXRpb24uaCArIDFdLm1hcChpdCA9PiBuZXcgUG9zaXRpb24ocG9zaXRpb24udywgaXQpKTtcblx0XHRjb25zdCBzdWJQb3NpdGlvbjMgPSBbcG9zaXRpb24udyAtIDEsIHBvc2l0aW9uLncgKyAxXS5tYXAoaXQgPT4gbmV3IFBvc2l0aW9uKGl0LCBwb3NpdGlvbi5oICsgMSkpO1xuXHRcdGNvbnN0IHN1YlBvc2l0aW9uNCA9IFtwb3NpdGlvbi53IC0gMSwgcG9zaXRpb24udyArIDFdLm1hcChpdCA9PiBuZXcgUG9zaXRpb24oaXQsIHBvc2l0aW9uLmggLSAxKSk7XG5cdFx0cmV0dXJuIF8uZmxhdE1hcChbc3ViUG9zaXRpb24xLCBzdWJQb3NpdGlvbjIsIHN1YlBvc2l0aW9uMywgc3ViUG9zaXRpb240XSkuZmlsdGVyKGl0ID0+IHtcblx0XHRcdHJldHVybiBpdC53ID49IDAgJiYgaXQuaCA+PSAwICYmIGl0LncgPCB0aGlzLndpZHRoICYmIGl0LmggPCB0aGlzLmhlaWdodDtcblx0XHR9KTtcblx0fVxuXHRwcml2YXRlIGJveExpc3Q6IEJveFtdID0gW107XG5cdGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSB3aWR0aDogbnVtYmVyLCBwdWJsaWMgcmVhZG9ubHkgaGVpZ2h0OiBudW1iZXIpIHtcblx0XHR0aGlzLmJveExpc3QgPSBuZXcgQXJyYXkod2lkdGggKiBoZWlnaHQpO1xuXHRcdGZvciAobGV0IGggPSAwOyBoIDwgaGVpZ2h0OyBoKyspIHtcblx0XHRcdGZvciAobGV0IHcgPSAwOyB3IDwgd2lkdGg7IHcrKykge1xuXHRcdFx0XHR0aGlzLmJveExpc3RbaCAqIHdpZHRoICsgd10gPSBuZXcgQm94KHcsIGgsIHRoaXMpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGZvckVhY2goY2FsbGJhY2s6IChib3g6IEJveCkgPT4gdm9pZCkge1xuXHRcdHRoaXMuYm94TGlzdC5mb3JFYWNoKGNhbGxiYWNrKTtcblx0fVxuXHRwcmludChwYXRoOiBCb3hbXSA9IFtdKSB7XG5cdFx0cGF0aCA9IHBhdGggfHwgW107XG5cdFx0Y29uc3QgZGF0YSA9IF8uY2h1bmsoXG5cdFx0XHR0aGlzLmJveExpc3QubWFwKGl0ID0+IHtcblx0XHRcdFx0aWYgKHBhdGguaW5jbHVkZXMoaXQpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHBhdGguaW5kZXhPZihpdCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5pc1dhbGwoaXQpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIFwifFwiO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnN0IHBvc2l0aW9uID0gaXQuZ2V0UG9zdGlvbigpO1xuXHRcdFx0XHRcdHJldHVybiBwYXRoLmxlbmd0aCA9PT0gMCA/IGAke3Bvc2l0aW9uLnd9JHtwb3NpdGlvbi5ofWAgOiBcIiBcIjtcblx0XHRcdFx0fVxuXHRcdFx0fSksXG5cdFx0XHR0aGlzLndpZHRoXG5cdFx0KTtcblx0XHRjb25zb2xlLmxvZyh0YWJsZShkYXRhKSk7XG5cdH1cblx0cHJpbnRQYXRoKHBhdGg6IEJveFtdID0gW10pIHtcblx0XHRwYXRoID0gcGF0aCB8fCBbXTtcblx0XHRjb25zdCB0YWJsZURhdGEgPSBwYXRoLm1hcChpdCA9PiB7XG5cdFx0XHRjb25zdCBwID0gaXQuZ2V0UG9zdGlvbigpO1xuXHRcdFx0cmV0dXJuIGAke3Aud30ke3AuaH1gO1xuXHRcdH0pO1xuXHRcdGlmICh0YWJsZURhdGEubGVuZ3RoID4gMCkge1xuXHRcdFx0Y29uc29sZS5sb2codGFibGUoW3RhYmxlRGF0YV0pKTtcblx0XHR9XG5cdH1cblx0Z2V0Qm94KHBvc2l0aW9uOiBQb3NpdGlvbikge1xuXHRcdGNvbnN0IGluZGV4ID0gcG9zaXRpb24uaCAqIHRoaXMud2lkdGggKyBwb3NpdGlvbi53O1xuXHRcdHJldHVybiB0aGlzLmJveExpc3RbaW5kZXhdO1xuXHR9XG59XG5cbmNsYXNzIEJveCB7XG5cdGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSB3OiBudW1iZXIsIHB1YmxpYyByZWFkb25seSBoOiBudW1iZXIsIHB1YmxpYyByZWFkb25seSBncmlkOiBHcmlkKSB7fVxuXHRnZXRQb3N0aW9uKCkge1xuXHRcdHJldHVybiBQb3NpdGlvbi5vZih0aGlzLncsIHRoaXMuaCk7XG5cdH1cblx0cHVibGljIGVxdWFscyhvdGhlcjogQm94KSB7XG5cdFx0cmV0dXJuIG90aGVyICE9IG51bGwgJiYgdGhpcy5nZXRQb3N0aW9uKCkuZXF1YWxzKG90aGVyLmdldFBvc3Rpb24oKSk7XG5cdH1cbn1cblxuY2xhc3MgUG9zaXRpb24ge1xuXHRjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgdzogbnVtYmVyLCBwdWJsaWMgcmVhZG9ubHkgaDogbnVtYmVyKSB7fVxuXHRwdWJsaWMgdG9TdHJpbmcoKSB7XG5cdFx0cmV0dXJuIEpTT04uc3RyaW5naWZ5KHtcblx0XHRcdHc6IHRoaXMudyxcblx0XHRcdGg6IHRoaXMuaFxuXHRcdH0pO1xuXHR9XG5cdHB1YmxpYyBlcXVhbHMocG9zaXRpb246IFBvc2l0aW9uKSB7XG5cdFx0cmV0dXJuIHRoaXMudyA9PT0gcG9zaXRpb24udyAmJiB0aGlzLmggPT09IHBvc2l0aW9uLmg7XG5cdH1cblx0cHVibGljIHN0YXRpYyBvZih4OiBudW1iZXIsIHk6IG51bWJlcik6IFBvc2l0aW9uIHtcblx0XHRyZXR1cm4gbmV3IFBvc2l0aW9uKHgsIHkpO1xuXHR9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvcGFnZS9hc3Rhci9hc3RhcjIudHN4IiwibW9kdWxlLmV4cG9ydHMgPSAoX193ZWJwYWNrX3JlcXVpcmVfXygwKSkoNDgpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGRlbGVnYXRlZCAuL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMgZnJvbSBkbGwtcmVmZXJlbmNlIHZlbmRvclxuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMiAzIDQgNSIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxuLyogZXNsaW50LWRpc2FibGUgc29ydC1rZXlzICovXG5cbi8qKlxuICogQHR5cGVkZWYgYm9yZGVyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdG9wQm9keVxuICogQHByb3BlcnR5IHtzdHJpbmd9IHRvcEpvaW5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0b3BMZWZ0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gdG9wUmlnaHRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBib3R0b21Cb2R5XG4gKiBAcHJvcGVydHkge3N0cmluZ30gYm90dG9tSm9pblxuICogQHByb3BlcnR5IHtzdHJpbmd9IGJvdHRvbUxlZnRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBib3R0b21SaWdodFxuICogQHByb3BlcnR5IHtzdHJpbmd9IGJvZHlMZWZ0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gYm9keVJpZ2h0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gYm9keUpvaW5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBqb2luQm9keVxuICogQHByb3BlcnR5IHtzdHJpbmd9IGpvaW5MZWZ0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gam9pblJpZ2h0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gam9pbkpvaW5cbiAqL1xuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gKiBAcmV0dXJucyB7Ym9yZGVyfVxuICovXG5leHBvcnRzLmRlZmF1bHQgPSBuYW1lID0+IHtcbiAgaWYgKG5hbWUgPT09ICdob25leXdlbGwnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRvcEJvZHk6ICfilZAnLFxuICAgICAgdG9wSm9pbjogJ+KVpCcsXG4gICAgICB0b3BMZWZ0OiAn4pWUJyxcbiAgICAgIHRvcFJpZ2h0OiAn4pWXJyxcblxuICAgICAgYm90dG9tQm9keTogJ+KVkCcsXG4gICAgICBib3R0b21Kb2luOiAn4pWnJyxcbiAgICAgIGJvdHRvbUxlZnQ6ICfilZonLFxuICAgICAgYm90dG9tUmlnaHQ6ICfilZ0nLFxuXG4gICAgICBib2R5TGVmdDogJ+KVkScsXG4gICAgICBib2R5UmlnaHQ6ICfilZEnLFxuICAgICAgYm9keUpvaW46ICfilIInLFxuXG4gICAgICBqb2luQm9keTogJ+KUgCcsXG4gICAgICBqb2luTGVmdDogJ+KVnycsXG4gICAgICBqb2luUmlnaHQ6ICfilaInLFxuICAgICAgam9pbkpvaW46ICfilLwnXG4gICAgfTtcbiAgfVxuXG4gIGlmIChuYW1lID09PSAnbm9yYycpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdG9wQm9keTogJ+KUgCcsXG4gICAgICB0b3BKb2luOiAn4pSsJyxcbiAgICAgIHRvcExlZnQ6ICfilIwnLFxuICAgICAgdG9wUmlnaHQ6ICfilJAnLFxuXG4gICAgICBib3R0b21Cb2R5OiAn4pSAJyxcbiAgICAgIGJvdHRvbUpvaW46ICfilLQnLFxuICAgICAgYm90dG9tTGVmdDogJ+KUlCcsXG4gICAgICBib3R0b21SaWdodDogJ+KUmCcsXG5cbiAgICAgIGJvZHlMZWZ0OiAn4pSCJyxcbiAgICAgIGJvZHlSaWdodDogJ+KUgicsXG4gICAgICBib2R5Sm9pbjogJ+KUgicsXG5cbiAgICAgIGpvaW5Cb2R5OiAn4pSAJyxcbiAgICAgIGpvaW5MZWZ0OiAn4pScJyxcbiAgICAgIGpvaW5SaWdodDogJ+KUpCcsXG4gICAgICBqb2luSm9pbjogJ+KUvCdcbiAgICB9O1xuICB9XG5cbiAgaWYgKG5hbWUgPT09ICdyYW1hYycpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdG9wQm9keTogJy0nLFxuICAgICAgdG9wSm9pbjogJysnLFxuICAgICAgdG9wTGVmdDogJysnLFxuICAgICAgdG9wUmlnaHQ6ICcrJyxcblxuICAgICAgYm90dG9tQm9keTogJy0nLFxuICAgICAgYm90dG9tSm9pbjogJysnLFxuICAgICAgYm90dG9tTGVmdDogJysnLFxuICAgICAgYm90dG9tUmlnaHQ6ICcrJyxcblxuICAgICAgYm9keUxlZnQ6ICd8JyxcbiAgICAgIGJvZHlSaWdodDogJ3wnLFxuICAgICAgYm9keUpvaW46ICd8JyxcblxuICAgICAgam9pbkJvZHk6ICctJyxcbiAgICAgIGpvaW5MZWZ0OiAnfCcsXG4gICAgICBqb2luUmlnaHQ6ICd8JyxcbiAgICAgIGpvaW5Kb2luOiAnfCdcbiAgICB9O1xuICB9XG5cbiAgaWYgKG5hbWUgPT09ICd2b2lkJykge1xuICAgIHJldHVybiB7XG4gICAgICB0b3BCb2R5OiAnJyxcbiAgICAgIHRvcEpvaW46ICcnLFxuICAgICAgdG9wTGVmdDogJycsXG4gICAgICB0b3BSaWdodDogJycsXG5cbiAgICAgIGJvdHRvbUJvZHk6ICcnLFxuICAgICAgYm90dG9tSm9pbjogJycsXG4gICAgICBib3R0b21MZWZ0OiAnJyxcbiAgICAgIGJvdHRvbVJpZ2h0OiAnJyxcblxuICAgICAgYm9keUxlZnQ6ICcnLFxuICAgICAgYm9keVJpZ2h0OiAnJyxcbiAgICAgIGJvZHlKb2luOiAnJyxcblxuICAgICAgam9pbkJvZHk6ICcnLFxuICAgICAgam9pbkxlZnQ6ICcnLFxuICAgICAgam9pblJpZ2h0OiAnJyxcbiAgICAgIGpvaW5Kb2luOiAnJ1xuICAgIH07XG4gIH1cblxuICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gYm9yZGVyIHRlbXBsYXRlIFwiJyArIG5hbWUgKyAnXCIuJyk7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi90YWJsZS9kaXN0L2dldEJvcmRlckNoYXJhY3RlcnMuanNcbi8vIG1vZHVsZSBpZCA9IDIwXG4vLyBtb2R1bGUgY2h1bmtzID0gMyA0IiwiY29uc3QgaXNSZWFkeTogUHJvbWlzZTxhbnk+ID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoKSA9PiB7XG5cdFx0cmVzb2x2ZSgpO1xuXHR9KTtcbn0pO1xuXG5leHBvcnQgY2xhc3MgRG9tIHtcblx0cHVibGljIHN0YXRpYyBvblJlYWR5KCk6IFByb21pc2U8YW55PiB7XG5cdFx0cmV0dXJuIGlzUmVhZHk7XG5cdH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zaGFyZWQvbGliL2RvbS50cyIsImV4cG9ydCAqIGZyb20gXCIuL2RvbVwiO1xuZXhwb3J0ICogZnJvbSBcIi4vZnVuY3Rpb25zXCI7XG5leHBvcnQgKiBmcm9tIFwiLi91dGlsXCI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2hhcmVkL2xpYi9pbmRleC50cyIsImV4cG9ydCBjb25zdCBub25lID0gXCJcIjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zaGFyZWQvbGliL3V0aWwudHMiLCJtb2R1bGUuZXhwb3J0cyA9IChfX3dlYnBhY2tfcmVxdWlyZV9fKDApKSg3Nik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZGVsZWdhdGVkIC4vbm9kZV9tb2R1bGVzL2pxdWVyeS9kaXN0L2pxdWVyeS5qcyBmcm9tIGRsbC1yZWZlcmVuY2UgdmVuZG9yXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMSAyIDMgNCA2IDggOSAxMCIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IGlzRnVsbHdpZHRoQ29kZVBvaW50ID0gcmVxdWlyZSgnaXMtZnVsbHdpZHRoLWNvZGUtcG9pbnQnKTtcblxuY29uc3QgRVNDQVBFUyA9IFtcblx0J1xcdTAwMUInLFxuXHQnXFx1MDA5Qidcbl07XG5cbmNvbnN0IEVORF9DT0RFID0gMzk7XG5jb25zdCBBU1RSQUxfUkVHRVggPSAvW1xcdUQ4MDAtXFx1REJGRl1bXFx1REMwMC1cXHVERkZGXS87XG5cbmNvbnN0IEVTQ0FQRV9DT0RFUyA9IG5ldyBNYXAoW1xuXHRbMCwgMF0sXG5cdFsxLCAyMl0sXG5cdFsyLCAyMl0sXG5cdFszLCAyM10sXG5cdFs0LCAyNF0sXG5cdFs3LCAyN10sXG5cdFs4LCAyOF0sXG5cdFs5LCAyOV0sXG5cdFszMCwgMzldLFxuXHRbMzEsIDM5XSxcblx0WzMyLCAzOV0sXG5cdFszMywgMzldLFxuXHRbMzQsIDM5XSxcblx0WzM1LCAzOV0sXG5cdFszNiwgMzldLFxuXHRbMzcsIDM5XSxcblx0WzkwLCAzOV0sXG5cdFs0MCwgNDldLFxuXHRbNDEsIDQ5XSxcblx0WzQyLCA0OV0sXG5cdFs0MywgNDldLFxuXHRbNDQsIDQ5XSxcblx0WzQ1LCA0OV0sXG5cdFs0NiwgNDldLFxuXHRbNDcsIDQ5XVxuXSk7XG5cbmNvbnN0IHdyYXBBbnNpID0gY29kZSA9PiBgJHtFU0NBUEVTWzBdfVske2NvZGV9bWA7XG5cbm1vZHVsZS5leHBvcnRzID0gKHN0ciwgYmVnaW4sIGVuZCkgPT4ge1xuXHRjb25zdCBhcnIgPSBBcnJheS5mcm9tKHN0ci5ub3JtYWxpemUoKSk7XG5cblx0ZW5kID0gdHlwZW9mIGVuZCA9PT0gJ251bWJlcicgPyBlbmQgOiBhcnIubGVuZ3RoO1xuXG5cdGxldCBpbnNpZGVFc2NhcGUgPSBmYWxzZTtcblx0bGV0IGVzY2FwZUNvZGU7XG5cdGxldCB2aXNpYmxlID0gMDtcblx0bGV0IG91dHB1dCA9ICcnO1xuXG5cdGZvciAoY29uc3QgaXRlbSBvZiBhcnIuZW50cmllcygpKSB7XG5cdFx0Y29uc3QgaSA9IGl0ZW1bMF07XG5cdFx0Y29uc3QgeCA9IGl0ZW1bMV07XG5cblx0XHRsZXQgbGVmdEVzY2FwZSA9IGZhbHNlO1xuXG5cdFx0aWYgKEVTQ0FQRVMuaW5kZXhPZih4KSAhPT0gLTEpIHtcblx0XHRcdGluc2lkZUVzY2FwZSA9IHRydWU7XG5cdFx0XHRjb25zdCBjb2RlID0gL1xcZFtebV0qLy5leGVjKHN0ci5zbGljZShpLCBpICsgNCkpO1xuXHRcdFx0ZXNjYXBlQ29kZSA9IGNvZGUgPT09IEVORF9DT0RFID8gbnVsbCA6IGNvZGU7XG5cdFx0fSBlbHNlIGlmIChpbnNpZGVFc2NhcGUgJiYgeCA9PT0gJ20nKSB7XG5cdFx0XHRpbnNpZGVFc2NhcGUgPSBmYWxzZTtcblx0XHRcdGxlZnRFc2NhcGUgPSB0cnVlO1xuXHRcdH1cblxuXHRcdGlmICghaW5zaWRlRXNjYXBlICYmICFsZWZ0RXNjYXBlKSB7XG5cdFx0XHQrK3Zpc2libGU7XG5cdFx0fVxuXG5cdFx0aWYgKCFBU1RSQUxfUkVHRVgudGVzdCh4KSAmJiBpc0Z1bGx3aWR0aENvZGVQb2ludCh4LmNvZGVQb2ludEF0KCkpKSB7XG5cdFx0XHQrK3Zpc2libGU7XG5cdFx0fVxuXG5cdFx0aWYgKHZpc2libGUgPiBiZWdpbiAmJiB2aXNpYmxlIDw9IGVuZCkge1xuXHRcdFx0b3V0cHV0ICs9IHg7XG5cdFx0fSBlbHNlIGlmICh2aXNpYmxlID09PSBiZWdpbiAmJiAhaW5zaWRlRXNjYXBlICYmIGVzY2FwZUNvZGUgIT09IHVuZGVmaW5lZCAmJiBlc2NhcGVDb2RlICE9PSBFTkRfQ09ERSkge1xuXHRcdFx0b3V0cHV0ICs9IHdyYXBBbnNpKGVzY2FwZUNvZGUpO1xuXHRcdH0gZWxzZSBpZiAodmlzaWJsZSA+PSBlbmQpIHtcblx0XHRcdGlmIChlc2NhcGVDb2RlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0b3V0cHV0ICs9IHdyYXBBbnNpKEVTQ0FQRV9DT0RFUy5nZXQocGFyc2VJbnQoZXNjYXBlQ29kZSwgMTApKSB8fCBFTkRfQ09ERSk7XG5cdFx0XHR9XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gb3V0cHV0O1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9zbGljZS1hbnNpL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA0MVxuLy8gbW9kdWxlIGNodW5rcyA9IDMgNCIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9zdHJpbmdXaWR0aCA9IHJlcXVpcmUoJ3N0cmluZy13aWR0aCcpO1xuXG52YXIgX3N0cmluZ1dpZHRoMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N0cmluZ1dpZHRoKTtcblxudmFyIF9hbGlnblN0cmluZyA9IHJlcXVpcmUoJy4vYWxpZ25TdHJpbmcnKTtcblxudmFyIF9hbGlnblN0cmluZzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9hbGlnblN0cmluZyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbi8qKlxuICogQHBhcmFtIHt0YWJsZX5yb3dbXX0gcm93c1xuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xuICogQHJldHVybnMge3RhYmxlfnJvd1tdfVxuICovXG5leHBvcnRzLmRlZmF1bHQgPSAocm93cywgY29uZmlnKSA9PiB7XG4gIHJldHVybiByb3dzLm1hcChjZWxscyA9PiB7XG4gICAgcmV0dXJuIGNlbGxzLm1hcCgodmFsdWUsIGluZGV4MSkgPT4ge1xuICAgICAgY29uc3QgY29sdW1uID0gY29uZmlnLmNvbHVtbnNbaW5kZXgxXTtcblxuICAgICAgaWYgKCgwLCBfc3RyaW5nV2lkdGgyLmRlZmF1bHQpKHZhbHVlKSA9PT0gY29sdW1uLndpZHRoKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAoMCwgX2FsaWduU3RyaW5nMi5kZWZhdWx0KSh2YWx1ZSwgY29sdW1uLndpZHRoLCBjb2x1bW4uYWxpZ25tZW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi90YWJsZS9kaXN0L2FsaWduVGFibGVEYXRhLmpzXG4vLyBtb2R1bGUgaWQgPSA0NVxuLy8gbW9kdWxlIGNodW5rcyA9IDMgNCIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9zdHJpbmdXaWR0aCA9IHJlcXVpcmUoJ3N0cmluZy13aWR0aCcpO1xuXG52YXIgX3N0cmluZ1dpZHRoMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N0cmluZ1dpZHRoKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuLyoqXG4gKiBDYWxjdWxhdGVzIHdpZHRoIG9mIGVhY2ggY2VsbCBjb250ZW50cy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBjZWxsc1xuICogQHJldHVybnMge251bWJlcltdfVxuICovXG5leHBvcnRzLmRlZmF1bHQgPSBjZWxscyA9PiB7XG4gIHJldHVybiBjZWxscy5tYXAodmFsdWUgPT4ge1xuICAgIHJldHVybiAoMCwgX3N0cmluZ1dpZHRoMi5kZWZhdWx0KSh2YWx1ZSk7XG4gIH0pO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vdGFibGUvZGlzdC9jYWxjdWxhdGVDZWxsV2lkdGhJbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gNDZcbi8vIG1vZHVsZSBjaHVua3MgPSAzIDQiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfbG9kYXNoID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbnZhciBfbG9kYXNoMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2xvZGFzaCk7XG5cbnZhciBfY2FsY3VsYXRlQ2VsbEhlaWdodCA9IHJlcXVpcmUoJy4vY2FsY3VsYXRlQ2VsbEhlaWdodCcpO1xuXG52YXIgX2NhbGN1bGF0ZUNlbGxIZWlnaHQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY2FsY3VsYXRlQ2VsbEhlaWdodCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbi8qKlxuICogQ2FsY3VsYXRlcyB0aGUgdmVydGljYWwgcm93IHNwYW4gaW5kZXguXG4gKlxuICogQHBhcmFtIHtBcnJheVtdfSByb3dzXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXG4gKiBAcmV0dXJucyB7bnVtYmVyW119XG4gKi9cbmV4cG9ydHMuZGVmYXVsdCA9IChyb3dzLCBjb25maWcpID0+IHtcbiAgY29uc3QgdGFibGVXaWR0aCA9IHJvd3NbMF0ubGVuZ3RoO1xuXG4gIGNvbnN0IHJvd1NwYW5JbmRleCA9IFtdO1xuXG4gIF9sb2Rhc2gyLmRlZmF1bHQuZm9yRWFjaChyb3dzLCBjZWxscyA9PiB7XG4gICAgY29uc3QgY2VsbEhlaWdodEluZGV4ID0gX2xvZGFzaDIuZGVmYXVsdC5maWxsKEFycmF5KHRhYmxlV2lkdGgpLCAxKTtcblxuICAgIF9sb2Rhc2gyLmRlZmF1bHQuZm9yRWFjaChjZWxscywgKHZhbHVlLCBpbmRleDEpID0+IHtcbiAgICAgIGlmICghX2xvZGFzaDIuZGVmYXVsdC5pc051bWJlcihjb25maWcuY29sdW1uc1tpbmRleDFdLndpZHRoKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdjb2x1bW5baW5kZXhdLndpZHRoIG11c3QgYmUgYSBudW1iZXIuJyk7XG4gICAgICB9XG5cbiAgICAgIGlmICghX2xvZGFzaDIuZGVmYXVsdC5pc0Jvb2xlYW4oY29uZmlnLmNvbHVtbnNbaW5kZXgxXS53cmFwV29yZCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY29sdW1uW2luZGV4XS53cmFwV29yZCBtdXN0IGJlIGEgYm9vbGVhbi4nKTtcbiAgICAgIH1cblxuICAgICAgY2VsbEhlaWdodEluZGV4W2luZGV4MV0gPSAoMCwgX2NhbGN1bGF0ZUNlbGxIZWlnaHQyLmRlZmF1bHQpKHZhbHVlLCBjb25maWcuY29sdW1uc1tpbmRleDFdLndpZHRoLCBjb25maWcuY29sdW1uc1tpbmRleDFdLndyYXBXb3JkKTtcbiAgICB9KTtcblxuICAgIHJvd1NwYW5JbmRleC5wdXNoKF9sb2Rhc2gyLmRlZmF1bHQubWF4KGNlbGxIZWlnaHRJbmRleCkpO1xuICB9KTtcblxuICByZXR1cm4gcm93U3BhbkluZGV4O1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vdGFibGUvZGlzdC9jYWxjdWxhdGVSb3dIZWlnaHRJbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gNDdcbi8vIG1vZHVsZSBjaHVua3MgPSAzIDQiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRyYXdCb3JkZXJUb3AgPSBleHBvcnRzLmRyYXdCb3JkZXJKb2luID0gZXhwb3J0cy5kcmF3Qm9yZGVyQm90dG9tID0gZXhwb3J0cy5kcmF3Qm9yZGVyID0gdW5kZWZpbmVkO1xuXG52YXIgX2xvZGFzaCA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG52YXIgX2xvZGFzaDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9sb2Rhc2gpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG4vKipcbiAqIEB0eXBlZGVmIGRyYXdCb3JkZXJ+cGFydHNcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBsZWZ0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gcmlnaHRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBib2R5XG4gKiBAcHJvcGVydHkge3N0cmluZ30gam9pblxuICovXG5cbi8qKlxuICogQHBhcmFtIHtudW1iZXJbXX0gY29sdW1uU2l6ZUluZGV4XG4gKiBAcGFyYW0ge2RyYXdCb3JkZXJ+cGFydHN9IHBhcnRzXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5jb25zdCBkcmF3Qm9yZGVyID0gKGNvbHVtblNpemVJbmRleCwgcGFydHMpID0+IHtcbiAgY29uc3QgY29sdW1ucyA9IF9sb2Rhc2gyLmRlZmF1bHQubWFwKGNvbHVtblNpemVJbmRleCwgc2l6ZSA9PiB7XG4gICAgcmV0dXJuIF9sb2Rhc2gyLmRlZmF1bHQucmVwZWF0KHBhcnRzLmJvZHksIHNpemUpO1xuICB9KS5qb2luKHBhcnRzLmpvaW4pO1xuXG4gIHJldHVybiBwYXJ0cy5sZWZ0ICsgY29sdW1ucyArIHBhcnRzLnJpZ2h0ICsgJ1xcbic7XG59O1xuXG4vKipcbiAqIEB0eXBlZGVmIGRyYXdCb3JkZXJUb3B+cGFydHNcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0b3BMZWZ0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gdG9wUmlnaHRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0b3BCb2R5XG4gKiBAcHJvcGVydHkge3N0cmluZ30gdG9wSm9pblxuICovXG5cbi8qKlxuICogQHBhcmFtIHtudW1iZXJbXX0gY29sdW1uU2l6ZUluZGV4XG4gKiBAcGFyYW0ge2RyYXdCb3JkZXJUb3B+cGFydHN9IHBhcnRzXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5jb25zdCBkcmF3Qm9yZGVyVG9wID0gKGNvbHVtblNpemVJbmRleCwgcGFydHMpID0+IHtcbiAgcmV0dXJuIGRyYXdCb3JkZXIoY29sdW1uU2l6ZUluZGV4LCB7XG4gICAgYm9keTogcGFydHMudG9wQm9keSxcbiAgICBqb2luOiBwYXJ0cy50b3BKb2luLFxuICAgIGxlZnQ6IHBhcnRzLnRvcExlZnQsXG4gICAgcmlnaHQ6IHBhcnRzLnRvcFJpZ2h0XG4gIH0pO1xufTtcblxuLyoqXG4gKiBAdHlwZWRlZiBkcmF3Qm9yZGVySm9pbn5wYXJ0c1xuICogQHByb3BlcnR5IHtzdHJpbmd9IGpvaW5MZWZ0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gam9pblJpZ2h0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gam9pbkJvZHlcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBqb2luSm9pblxuICovXG5cbi8qKlxuICogQHBhcmFtIHtudW1iZXJbXX0gY29sdW1uU2l6ZUluZGV4XG4gKiBAcGFyYW0ge2RyYXdCb3JkZXJKb2lufnBhcnRzfSBwYXJ0c1xuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuY29uc3QgZHJhd0JvcmRlckpvaW4gPSAoY29sdW1uU2l6ZUluZGV4LCBwYXJ0cykgPT4ge1xuICByZXR1cm4gZHJhd0JvcmRlcihjb2x1bW5TaXplSW5kZXgsIHtcbiAgICBib2R5OiBwYXJ0cy5qb2luQm9keSxcbiAgICBqb2luOiBwYXJ0cy5qb2luSm9pbixcbiAgICBsZWZ0OiBwYXJ0cy5qb2luTGVmdCxcbiAgICByaWdodDogcGFydHMuam9pblJpZ2h0XG4gIH0pO1xufTtcblxuLyoqXG4gKiBAdHlwZWRlZiBkcmF3Qm9yZGVyQm90dG9tfnBhcnRzXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdG9wTGVmdFxuICogQHByb3BlcnR5IHtzdHJpbmd9IHRvcFJpZ2h0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gdG9wQm9keVxuICogQHByb3BlcnR5IHtzdHJpbmd9IHRvcEpvaW5cbiAqL1xuXG4vKipcbiAqIEBwYXJhbSB7bnVtYmVyW119IGNvbHVtblNpemVJbmRleFxuICogQHBhcmFtIHtkcmF3Qm9yZGVyQm90dG9tfnBhcnRzfSBwYXJ0c1xuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuY29uc3QgZHJhd0JvcmRlckJvdHRvbSA9IChjb2x1bW5TaXplSW5kZXgsIHBhcnRzKSA9PiB7XG4gIHJldHVybiBkcmF3Qm9yZGVyKGNvbHVtblNpemVJbmRleCwge1xuICAgIGJvZHk6IHBhcnRzLmJvdHRvbUJvZHksXG4gICAgam9pbjogcGFydHMuYm90dG9tSm9pbixcbiAgICBsZWZ0OiBwYXJ0cy5ib3R0b21MZWZ0LFxuICAgIHJpZ2h0OiBwYXJ0cy5ib3R0b21SaWdodFxuICB9KTtcbn07XG5cbmV4cG9ydHMuZHJhd0JvcmRlciA9IGRyYXdCb3JkZXI7XG5leHBvcnRzLmRyYXdCb3JkZXJCb3R0b20gPSBkcmF3Qm9yZGVyQm90dG9tO1xuZXhwb3J0cy5kcmF3Qm9yZGVySm9pbiA9IGRyYXdCb3JkZXJKb2luO1xuZXhwb3J0cy5kcmF3Qm9yZGVyVG9wID0gZHJhd0JvcmRlclRvcDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vdGFibGUvZGlzdC9kcmF3Qm9yZGVyLmpzXG4vLyBtb2R1bGUgaWQgPSA0OFxuLy8gbW9kdWxlIGNodW5rcyA9IDMgNCIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBkcmF3Um93fmJvcmRlclxuICogQHByb3BlcnR5IHtzdHJpbmd9IGJvZHlMZWZ0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gYm9keVJpZ2h0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gYm9keUpvaW5cbiAqL1xuXG4vKipcbiAqIEBwYXJhbSB7bnVtYmVyW119IGNvbHVtbnNcbiAqIEBwYXJhbSB7ZHJhd1Jvd35ib3JkZXJ9IGJvcmRlclxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZXhwb3J0cy5kZWZhdWx0ID0gKGNvbHVtbnMsIGJvcmRlcikgPT4ge1xuICByZXR1cm4gYm9yZGVyLmJvZHlMZWZ0ICsgY29sdW1ucy5qb2luKGJvcmRlci5ib2R5Sm9pbikgKyBib3JkZXIuYm9keVJpZ2h0ICsgJ1xcbic7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi90YWJsZS9kaXN0L2RyYXdSb3cuanNcbi8vIG1vZHVsZSBpZCA9IDQ5XG4vLyBtb2R1bGUgY2h1bmtzID0gMyA0IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2xvZGFzaCA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG52YXIgX2xvZGFzaDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9sb2Rhc2gpO1xuXG52YXIgX3dyYXBTdHJpbmcgPSByZXF1aXJlKCcuL3dyYXBTdHJpbmcnKTtcblxudmFyIF93cmFwU3RyaW5nMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3dyYXBTdHJpbmcpO1xuXG52YXIgX3dyYXBXb3JkID0gcmVxdWlyZSgnLi93cmFwV29yZCcpO1xuXG52YXIgX3dyYXBXb3JkMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3dyYXBXb3JkKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuLyoqXG4gKiBAcGFyYW0ge0FycmF5fSB1bm1hcHBlZFJvd3NcbiAqIEBwYXJhbSB7bnVtYmVyW119IHJvd0hlaWdodEluZGV4XG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXG4gKiBAcmV0dXJucyB7QXJyYXl9XG4gKi9cbmV4cG9ydHMuZGVmYXVsdCA9ICh1bm1hcHBlZFJvd3MsIHJvd0hlaWdodEluZGV4LCBjb25maWcpID0+IHtcbiAgY29uc3QgdGFibGVXaWR0aCA9IHVubWFwcGVkUm93c1swXS5sZW5ndGg7XG5cbiAgY29uc3QgbWFwcGVkUm93cyA9IHVubWFwcGVkUm93cy5tYXAoKGNlbGxzLCBpbmRleDApID0+IHtcbiAgICBjb25zdCByb3dIZWlnaHQgPSBfbG9kYXNoMi5kZWZhdWx0LnRpbWVzKHJvd0hlaWdodEluZGV4W2luZGV4MF0sICgpID0+IHtcbiAgICAgIHJldHVybiBfbG9kYXNoMi5kZWZhdWx0LmZpbGwoQXJyYXkodGFibGVXaWR0aCksICcnKTtcbiAgICB9KTtcblxuICAgIC8vIHJvd0hlaWdodFxuICAgIC8vICAgICBbe3JvdyBpbmRleCB3aXRoaW4gcm93U2F3OyBpbmRleDJ9XVxuICAgIC8vICAgICBbe2NlbGwgaW5kZXggd2l0aGluIGEgdmlydHVhbCByb3c7IGluZGV4MX1dXG5cbiAgICBfbG9kYXNoMi5kZWZhdWx0LmZvckVhY2goY2VsbHMsICh2YWx1ZSwgaW5kZXgxKSA9PiB7XG4gICAgICBsZXQgY2h1bmtlZFZhbHVlO1xuXG4gICAgICBpZiAoY29uZmlnLmNvbHVtbnNbaW5kZXgxXS53cmFwV29yZCkge1xuICAgICAgICBjaHVua2VkVmFsdWUgPSAoMCwgX3dyYXBXb3JkMi5kZWZhdWx0KSh2YWx1ZSwgY29uZmlnLmNvbHVtbnNbaW5kZXgxXS53aWR0aCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjaHVua2VkVmFsdWUgPSAoMCwgX3dyYXBTdHJpbmcyLmRlZmF1bHQpKHZhbHVlLCBjb25maWcuY29sdW1uc1tpbmRleDFdLndpZHRoKTtcbiAgICAgIH1cblxuICAgICAgX2xvZGFzaDIuZGVmYXVsdC5mb3JFYWNoKGNodW5rZWRWYWx1ZSwgKHBhcnQsIGluZGV4MikgPT4ge1xuICAgICAgICByb3dIZWlnaHRbaW5kZXgyXVtpbmRleDFdID0gcGFydDtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJvd0hlaWdodDtcbiAgfSk7XG5cbiAgcmV0dXJuIF9sb2Rhc2gyLmRlZmF1bHQuZmxhdHRlbihtYXBwZWRSb3dzKTtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3RhYmxlL2Rpc3QvbWFwRGF0YVVzaW5nUm93SGVpZ2h0SW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDUwXG4vLyBtb2R1bGUgY2h1bmtzID0gMyA0IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2xvZGFzaCA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG52YXIgX2xvZGFzaDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9sb2Rhc2gpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG4vKipcbiAqIEBwYXJhbSB7dGFibGV+cm93W119IHJvd3NcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcbiAqIEByZXR1cm5zIHt0YWJsZX5yb3dbXX1cbiAqL1xuZXhwb3J0cy5kZWZhdWx0ID0gKHJvd3MsIGNvbmZpZykgPT4ge1xuICByZXR1cm4gX2xvZGFzaDIuZGVmYXVsdC5tYXAocm93cywgY2VsbHMgPT4ge1xuICAgIHJldHVybiBfbG9kYXNoMi5kZWZhdWx0Lm1hcChjZWxscywgKHZhbHVlLCBpbmRleDEpID0+IHtcbiAgICAgIGNvbnN0IGNvbHVtbiA9IGNvbmZpZy5jb2x1bW5zW2luZGV4MV07XG5cbiAgICAgIHJldHVybiBfbG9kYXNoMi5kZWZhdWx0LnJlcGVhdCgnICcsIGNvbHVtbi5wYWRkaW5nTGVmdCkgKyB2YWx1ZSArIF9sb2Rhc2gyLmRlZmF1bHQucmVwZWF0KCcgJywgY29sdW1uLnBhZGRpbmdSaWdodCk7XG4gICAgfSk7XG4gIH0pO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vdGFibGUvZGlzdC9wYWRUYWJsZURhdGEuanNcbi8vIG1vZHVsZSBpZCA9IDUxXG4vLyBtb2R1bGUgY2h1bmtzID0gMyA0IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbi8qKlxuICogQ2FzdHMgYWxsIGNlbGwgdmFsdWVzIHRvIGEgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7dGFibGV+cm93W119IHJvd3NcbiAqIEByZXR1cm5zIHt0YWJsZX5yb3dbXX1cbiAqL1xuZXhwb3J0cy5kZWZhdWx0ID0gcm93cyA9PiB7XG4gIHJldHVybiByb3dzLm1hcChjZWxscyA9PiB7XG4gICAgcmV0dXJuIGNlbGxzLm1hcChTdHJpbmcpO1xuICB9KTtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3RhYmxlL2Rpc3Qvc3RyaW5naWZ5VGFibGVEYXRhLmpzXG4vLyBtb2R1bGUgaWQgPSA1MlxuLy8gbW9kdWxlIGNodW5rcyA9IDMgNCIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9sb2Rhc2ggPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxudmFyIF9sb2Rhc2gyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbG9kYXNoKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuLyoqXG4gKiBAdG9kbyBNYWtlIGl0IHdvcmsgd2l0aCBBU0NJSSBjb250ZW50LlxuICogQHBhcmFtIHt0YWJsZX5yb3dbXX0gcm93c1xuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ1xuICogQHJldHVybnMge3RhYmxlfnJvd1tdfVxuICovXG5leHBvcnRzLmRlZmF1bHQgPSAocm93cywgY29uZmlnKSA9PiB7XG4gIHJldHVybiBfbG9kYXNoMi5kZWZhdWx0Lm1hcChyb3dzLCBjZWxscyA9PiB7XG4gICAgcmV0dXJuIF9sb2Rhc2gyLmRlZmF1bHQubWFwKGNlbGxzLCAoY29udGVudCwgaW5kZXgpID0+IHtcbiAgICAgIHJldHVybiBfbG9kYXNoMi5kZWZhdWx0LnRydW5jYXRlKGNvbnRlbnQsIHtcbiAgICAgICAgbGVuZ3RoOiBjb25maWcuY29sdW1uc1tpbmRleF0udHJ1bmNhdGVcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3RhYmxlL2Rpc3QvdHJ1bmNhdGVUYWJsZURhdGEuanNcbi8vIG1vZHVsZSBpZCA9IDUzXG4vLyBtb2R1bGUgY2h1bmtzID0gMyA0IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGVxdWFsID0gcmVxdWlyZSgnYWp2L2xpYi9jb21waWxlL2VxdWFsJyk7XG52YXIgdmFsaWRhdGUgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBwYXR0ZXJuMCA9IG5ldyBSZWdFeHAoJ15bMC05XSskJyk7XG4gIHZhciByZWZWYWwgPSBbXTtcbiAgdmFyIHJlZlZhbDEgPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhdHRlcm4wID0gbmV3IFJlZ0V4cCgnXlswLTldKyQnKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gdmFsaWRhdGUoZGF0YSwgZGF0YVBhdGgsIHBhcmVudERhdGEsIHBhcmVudERhdGFQcm9wZXJ0eSwgcm9vdERhdGEpIHtcbiAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgIHZhciB2RXJyb3JzID0gbnVsbDtcbiAgICAgIHZhciBlcnJvcnMgPSAwO1xuICAgICAgaWYgKHJvb3REYXRhID09PSB1bmRlZmluZWQpIHJvb3REYXRhID0gZGF0YTtcbiAgICAgIGlmICgoZGF0YSAmJiB0eXBlb2YgZGF0YSA9PT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheShkYXRhKSkpIHtcbiAgICAgICAgdmFyIGVycnNfXzAgPSBlcnJvcnM7XG4gICAgICAgIHZhciB2YWxpZDEgPSB0cnVlO1xuICAgICAgICBmb3IgKHZhciBrZXkwIGluIGRhdGEpIHtcbiAgICAgICAgICB2YXIgaXNBZGRpdGlvbmFsMCA9ICEoZmFsc2UgfHwgdmFsaWRhdGUuc2NoZW1hLnByb3BlcnRpZXNba2V5MF0pO1xuICAgICAgICAgIGlmIChpc0FkZGl0aW9uYWwwKSB7XG4gICAgICAgICAgICB2YWxpZDEgPSBmYWxzZTtcbiAgICAgICAgICAgIHZhciBlcnIgPSB7XG4gICAgICAgICAgICAgIGtleXdvcmQ6ICdhZGRpdGlvbmFsUHJvcGVydGllcycsXG4gICAgICAgICAgICAgIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgJycpICsgXCJcIixcbiAgICAgICAgICAgICAgc2NoZW1hUGF0aDogJyMvYWRkaXRpb25hbFByb3BlcnRpZXMnLFxuICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICBhZGRpdGlvbmFsUHJvcGVydHk6ICcnICsga2V5MCArICcnXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG1lc3NhZ2U6ICdzaG91bGQgTk9UIGhhdmUgYWRkaXRpb25hbCBwcm9wZXJ0aWVzJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gW2Vycl07XG4gICAgICAgICAgICBlbHNlIHZFcnJvcnMucHVzaChlcnIpO1xuICAgICAgICAgICAgZXJyb3JzKys7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhLnRvcEJvZHkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHZhciBlcnJzXzEgPSBlcnJvcnM7XG4gICAgICAgICAgaWYgKCFyZWZWYWwyKGRhdGEudG9wQm9keSwgKGRhdGFQYXRoIHx8ICcnKSArICcudG9wQm9keScsIGRhdGEsICd0b3BCb2R5Jywgcm9vdERhdGEpKSB7XG4gICAgICAgICAgICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IHJlZlZhbDIuZXJyb3JzO1xuICAgICAgICAgICAgZWxzZSB2RXJyb3JzID0gdkVycm9ycy5jb25jYXQocmVmVmFsMi5lcnJvcnMpO1xuICAgICAgICAgICAgZXJyb3JzID0gdkVycm9ycy5sZW5ndGg7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB2YWxpZDEgPSBlcnJvcnMgPT09IGVycnNfMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YS50b3BKb2luICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB2YXIgZXJyc18xID0gZXJyb3JzO1xuICAgICAgICAgIGlmICghcmVmVmFsWzJdKGRhdGEudG9wSm9pbiwgKGRhdGFQYXRoIHx8ICcnKSArICcudG9wSm9pbicsIGRhdGEsICd0b3BKb2luJywgcm9vdERhdGEpKSB7XG4gICAgICAgICAgICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IHJlZlZhbFsyXS5lcnJvcnM7XG4gICAgICAgICAgICBlbHNlIHZFcnJvcnMgPSB2RXJyb3JzLmNvbmNhdChyZWZWYWxbMl0uZXJyb3JzKTtcbiAgICAgICAgICAgIGVycm9ycyA9IHZFcnJvcnMubGVuZ3RoO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgdmFsaWQxID0gZXJyb3JzID09PSBlcnJzXzE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGEudG9wTGVmdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdmFyIGVycnNfMSA9IGVycm9ycztcbiAgICAgICAgICBpZiAoIXJlZlZhbFsyXShkYXRhLnRvcExlZnQsIChkYXRhUGF0aCB8fCAnJykgKyAnLnRvcExlZnQnLCBkYXRhLCAndG9wTGVmdCcsIHJvb3REYXRhKSkge1xuICAgICAgICAgICAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSByZWZWYWxbMl0uZXJyb3JzO1xuICAgICAgICAgICAgZWxzZSB2RXJyb3JzID0gdkVycm9ycy5jb25jYXQocmVmVmFsWzJdLmVycm9ycyk7XG4gICAgICAgICAgICBlcnJvcnMgPSB2RXJyb3JzLmxlbmd0aDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHZhbGlkMSA9IGVycm9ycyA9PT0gZXJyc18xO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhLnRvcFJpZ2h0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB2YXIgZXJyc18xID0gZXJyb3JzO1xuICAgICAgICAgIGlmICghcmVmVmFsWzJdKGRhdGEudG9wUmlnaHQsIChkYXRhUGF0aCB8fCAnJykgKyAnLnRvcFJpZ2h0JywgZGF0YSwgJ3RvcFJpZ2h0Jywgcm9vdERhdGEpKSB7XG4gICAgICAgICAgICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IHJlZlZhbFsyXS5lcnJvcnM7XG4gICAgICAgICAgICBlbHNlIHZFcnJvcnMgPSB2RXJyb3JzLmNvbmNhdChyZWZWYWxbMl0uZXJyb3JzKTtcbiAgICAgICAgICAgIGVycm9ycyA9IHZFcnJvcnMubGVuZ3RoO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgdmFsaWQxID0gZXJyb3JzID09PSBlcnJzXzE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGEuYm90dG9tQm9keSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdmFyIGVycnNfMSA9IGVycm9ycztcbiAgICAgICAgICBpZiAoIXJlZlZhbFsyXShkYXRhLmJvdHRvbUJvZHksIChkYXRhUGF0aCB8fCAnJykgKyAnLmJvdHRvbUJvZHknLCBkYXRhLCAnYm90dG9tQm9keScsIHJvb3REYXRhKSkge1xuICAgICAgICAgICAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSByZWZWYWxbMl0uZXJyb3JzO1xuICAgICAgICAgICAgZWxzZSB2RXJyb3JzID0gdkVycm9ycy5jb25jYXQocmVmVmFsWzJdLmVycm9ycyk7XG4gICAgICAgICAgICBlcnJvcnMgPSB2RXJyb3JzLmxlbmd0aDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHZhbGlkMSA9IGVycm9ycyA9PT0gZXJyc18xO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhLmJvdHRvbUpvaW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHZhciBlcnJzXzEgPSBlcnJvcnM7XG4gICAgICAgICAgaWYgKCFyZWZWYWxbMl0oZGF0YS5ib3R0b21Kb2luLCAoZGF0YVBhdGggfHwgJycpICsgJy5ib3R0b21Kb2luJywgZGF0YSwgJ2JvdHRvbUpvaW4nLCByb290RGF0YSkpIHtcbiAgICAgICAgICAgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gcmVmVmFsWzJdLmVycm9ycztcbiAgICAgICAgICAgIGVsc2UgdkVycm9ycyA9IHZFcnJvcnMuY29uY2F0KHJlZlZhbFsyXS5lcnJvcnMpO1xuICAgICAgICAgICAgZXJyb3JzID0gdkVycm9ycy5sZW5ndGg7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB2YWxpZDEgPSBlcnJvcnMgPT09IGVycnNfMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YS5ib3R0b21MZWZ0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB2YXIgZXJyc18xID0gZXJyb3JzO1xuICAgICAgICAgIGlmICghcmVmVmFsWzJdKGRhdGEuYm90dG9tTGVmdCwgKGRhdGFQYXRoIHx8ICcnKSArICcuYm90dG9tTGVmdCcsIGRhdGEsICdib3R0b21MZWZ0Jywgcm9vdERhdGEpKSB7XG4gICAgICAgICAgICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IHJlZlZhbFsyXS5lcnJvcnM7XG4gICAgICAgICAgICBlbHNlIHZFcnJvcnMgPSB2RXJyb3JzLmNvbmNhdChyZWZWYWxbMl0uZXJyb3JzKTtcbiAgICAgICAgICAgIGVycm9ycyA9IHZFcnJvcnMubGVuZ3RoO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgdmFsaWQxID0gZXJyb3JzID09PSBlcnJzXzE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGEuYm90dG9tUmlnaHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHZhciBlcnJzXzEgPSBlcnJvcnM7XG4gICAgICAgICAgaWYgKCFyZWZWYWxbMl0oZGF0YS5ib3R0b21SaWdodCwgKGRhdGFQYXRoIHx8ICcnKSArICcuYm90dG9tUmlnaHQnLCBkYXRhLCAnYm90dG9tUmlnaHQnLCByb290RGF0YSkpIHtcbiAgICAgICAgICAgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gcmVmVmFsWzJdLmVycm9ycztcbiAgICAgICAgICAgIGVsc2UgdkVycm9ycyA9IHZFcnJvcnMuY29uY2F0KHJlZlZhbFsyXS5lcnJvcnMpO1xuICAgICAgICAgICAgZXJyb3JzID0gdkVycm9ycy5sZW5ndGg7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB2YWxpZDEgPSBlcnJvcnMgPT09IGVycnNfMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YS5ib2R5TGVmdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdmFyIGVycnNfMSA9IGVycm9ycztcbiAgICAgICAgICBpZiAoIXJlZlZhbFsyXShkYXRhLmJvZHlMZWZ0LCAoZGF0YVBhdGggfHwgJycpICsgJy5ib2R5TGVmdCcsIGRhdGEsICdib2R5TGVmdCcsIHJvb3REYXRhKSkge1xuICAgICAgICAgICAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSByZWZWYWxbMl0uZXJyb3JzO1xuICAgICAgICAgICAgZWxzZSB2RXJyb3JzID0gdkVycm9ycy5jb25jYXQocmVmVmFsWzJdLmVycm9ycyk7XG4gICAgICAgICAgICBlcnJvcnMgPSB2RXJyb3JzLmxlbmd0aDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHZhbGlkMSA9IGVycm9ycyA9PT0gZXJyc18xO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhLmJvZHlSaWdodCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdmFyIGVycnNfMSA9IGVycm9ycztcbiAgICAgICAgICBpZiAoIXJlZlZhbFsyXShkYXRhLmJvZHlSaWdodCwgKGRhdGFQYXRoIHx8ICcnKSArICcuYm9keVJpZ2h0JywgZGF0YSwgJ2JvZHlSaWdodCcsIHJvb3REYXRhKSkge1xuICAgICAgICAgICAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSByZWZWYWxbMl0uZXJyb3JzO1xuICAgICAgICAgICAgZWxzZSB2RXJyb3JzID0gdkVycm9ycy5jb25jYXQocmVmVmFsWzJdLmVycm9ycyk7XG4gICAgICAgICAgICBlcnJvcnMgPSB2RXJyb3JzLmxlbmd0aDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHZhbGlkMSA9IGVycm9ycyA9PT0gZXJyc18xO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhLmJvZHlKb2luICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB2YXIgZXJyc18xID0gZXJyb3JzO1xuICAgICAgICAgIGlmICghcmVmVmFsWzJdKGRhdGEuYm9keUpvaW4sIChkYXRhUGF0aCB8fCAnJykgKyAnLmJvZHlKb2luJywgZGF0YSwgJ2JvZHlKb2luJywgcm9vdERhdGEpKSB7XG4gICAgICAgICAgICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IHJlZlZhbFsyXS5lcnJvcnM7XG4gICAgICAgICAgICBlbHNlIHZFcnJvcnMgPSB2RXJyb3JzLmNvbmNhdChyZWZWYWxbMl0uZXJyb3JzKTtcbiAgICAgICAgICAgIGVycm9ycyA9IHZFcnJvcnMubGVuZ3RoO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgdmFsaWQxID0gZXJyb3JzID09PSBlcnJzXzE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGEuam9pbkJvZHkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHZhciBlcnJzXzEgPSBlcnJvcnM7XG4gICAgICAgICAgaWYgKCFyZWZWYWxbMl0oZGF0YS5qb2luQm9keSwgKGRhdGFQYXRoIHx8ICcnKSArICcuam9pbkJvZHknLCBkYXRhLCAnam9pbkJvZHknLCByb290RGF0YSkpIHtcbiAgICAgICAgICAgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gcmVmVmFsWzJdLmVycm9ycztcbiAgICAgICAgICAgIGVsc2UgdkVycm9ycyA9IHZFcnJvcnMuY29uY2F0KHJlZlZhbFsyXS5lcnJvcnMpO1xuICAgICAgICAgICAgZXJyb3JzID0gdkVycm9ycy5sZW5ndGg7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB2YWxpZDEgPSBlcnJvcnMgPT09IGVycnNfMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YS5qb2luTGVmdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdmFyIGVycnNfMSA9IGVycm9ycztcbiAgICAgICAgICBpZiAoIXJlZlZhbFsyXShkYXRhLmpvaW5MZWZ0LCAoZGF0YVBhdGggfHwgJycpICsgJy5qb2luTGVmdCcsIGRhdGEsICdqb2luTGVmdCcsIHJvb3REYXRhKSkge1xuICAgICAgICAgICAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSByZWZWYWxbMl0uZXJyb3JzO1xuICAgICAgICAgICAgZWxzZSB2RXJyb3JzID0gdkVycm9ycy5jb25jYXQocmVmVmFsWzJdLmVycm9ycyk7XG4gICAgICAgICAgICBlcnJvcnMgPSB2RXJyb3JzLmxlbmd0aDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHZhbGlkMSA9IGVycm9ycyA9PT0gZXJyc18xO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhLmpvaW5SaWdodCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdmFyIGVycnNfMSA9IGVycm9ycztcbiAgICAgICAgICBpZiAoIXJlZlZhbFsyXShkYXRhLmpvaW5SaWdodCwgKGRhdGFQYXRoIHx8ICcnKSArICcuam9pblJpZ2h0JywgZGF0YSwgJ2pvaW5SaWdodCcsIHJvb3REYXRhKSkge1xuICAgICAgICAgICAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSByZWZWYWxbMl0uZXJyb3JzO1xuICAgICAgICAgICAgZWxzZSB2RXJyb3JzID0gdkVycm9ycy5jb25jYXQocmVmVmFsWzJdLmVycm9ycyk7XG4gICAgICAgICAgICBlcnJvcnMgPSB2RXJyb3JzLmxlbmd0aDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHZhbGlkMSA9IGVycm9ycyA9PT0gZXJyc18xO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhLmpvaW5Kb2luICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB2YXIgZXJyc18xID0gZXJyb3JzO1xuICAgICAgICAgIGlmICghcmVmVmFsWzJdKGRhdGEuam9pbkpvaW4sIChkYXRhUGF0aCB8fCAnJykgKyAnLmpvaW5Kb2luJywgZGF0YSwgJ2pvaW5Kb2luJywgcm9vdERhdGEpKSB7XG4gICAgICAgICAgICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IHJlZlZhbFsyXS5lcnJvcnM7XG4gICAgICAgICAgICBlbHNlIHZFcnJvcnMgPSB2RXJyb3JzLmNvbmNhdChyZWZWYWxbMl0uZXJyb3JzKTtcbiAgICAgICAgICAgIGVycm9ycyA9IHZFcnJvcnMubGVuZ3RoO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgdmFsaWQxID0gZXJyb3JzID09PSBlcnJzXzE7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBlcnIgPSB7XG4gICAgICAgICAga2V5d29yZDogJ3R5cGUnLFxuICAgICAgICAgIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgJycpICsgXCJcIixcbiAgICAgICAgICBzY2hlbWFQYXRoOiAnIy90eXBlJyxcbiAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnXG4gICAgICAgICAgfSxcbiAgICAgICAgICBtZXNzYWdlOiAnc2hvdWxkIGJlIG9iamVjdCdcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTtcbiAgICAgICAgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTtcbiAgICAgICAgZXJyb3JzKys7XG4gICAgICB9XG4gICAgICB2YWxpZGF0ZS5lcnJvcnMgPSB2RXJyb3JzO1xuICAgICAgcmV0dXJuIGVycm9ycyA9PT0gMDtcbiAgICB9O1xuICB9KSgpO1xuICByZWZWYWwxLnNjaGVtYSA9IHtcbiAgICBcInR5cGVcIjogXCJvYmplY3RcIixcbiAgICBcInByb3BlcnRpZXNcIjoge1xuICAgICAgXCJ0b3BCb2R5XCI6IHtcbiAgICAgICAgXCIkcmVmXCI6IFwiIy9kZWZpbml0aW9ucy9ib3JkZXJcIlxuICAgICAgfSxcbiAgICAgIFwidG9wSm9pblwiOiB7XG4gICAgICAgIFwiJHJlZlwiOiBcIiMvZGVmaW5pdGlvbnMvYm9yZGVyXCJcbiAgICAgIH0sXG4gICAgICBcInRvcExlZnRcIjoge1xuICAgICAgICBcIiRyZWZcIjogXCIjL2RlZmluaXRpb25zL2JvcmRlclwiXG4gICAgICB9LFxuICAgICAgXCJ0b3BSaWdodFwiOiB7XG4gICAgICAgIFwiJHJlZlwiOiBcIiMvZGVmaW5pdGlvbnMvYm9yZGVyXCJcbiAgICAgIH0sXG4gICAgICBcImJvdHRvbUJvZHlcIjoge1xuICAgICAgICBcIiRyZWZcIjogXCIjL2RlZmluaXRpb25zL2JvcmRlclwiXG4gICAgICB9LFxuICAgICAgXCJib3R0b21Kb2luXCI6IHtcbiAgICAgICAgXCIkcmVmXCI6IFwiIy9kZWZpbml0aW9ucy9ib3JkZXJcIlxuICAgICAgfSxcbiAgICAgIFwiYm90dG9tTGVmdFwiOiB7XG4gICAgICAgIFwiJHJlZlwiOiBcIiMvZGVmaW5pdGlvbnMvYm9yZGVyXCJcbiAgICAgIH0sXG4gICAgICBcImJvdHRvbVJpZ2h0XCI6IHtcbiAgICAgICAgXCIkcmVmXCI6IFwiIy9kZWZpbml0aW9ucy9ib3JkZXJcIlxuICAgICAgfSxcbiAgICAgIFwiYm9keUxlZnRcIjoge1xuICAgICAgICBcIiRyZWZcIjogXCIjL2RlZmluaXRpb25zL2JvcmRlclwiXG4gICAgICB9LFxuICAgICAgXCJib2R5UmlnaHRcIjoge1xuICAgICAgICBcIiRyZWZcIjogXCIjL2RlZmluaXRpb25zL2JvcmRlclwiXG4gICAgICB9LFxuICAgICAgXCJib2R5Sm9pblwiOiB7XG4gICAgICAgIFwiJHJlZlwiOiBcIiMvZGVmaW5pdGlvbnMvYm9yZGVyXCJcbiAgICAgIH0sXG4gICAgICBcImpvaW5Cb2R5XCI6IHtcbiAgICAgICAgXCIkcmVmXCI6IFwiIy9kZWZpbml0aW9ucy9ib3JkZXJcIlxuICAgICAgfSxcbiAgICAgIFwiam9pbkxlZnRcIjoge1xuICAgICAgICBcIiRyZWZcIjogXCIjL2RlZmluaXRpb25zL2JvcmRlclwiXG4gICAgICB9LFxuICAgICAgXCJqb2luUmlnaHRcIjoge1xuICAgICAgICBcIiRyZWZcIjogXCIjL2RlZmluaXRpb25zL2JvcmRlclwiXG4gICAgICB9LFxuICAgICAgXCJqb2luSm9pblwiOiB7XG4gICAgICAgIFwiJHJlZlwiOiBcIiMvZGVmaW5pdGlvbnMvYm9yZGVyXCJcbiAgICAgIH1cbiAgICB9LFxuICAgIFwiYWRkaXRpb25hbFByb3BlcnRpZXNcIjogZmFsc2VcbiAgfTtcbiAgcmVmVmFsMS5lcnJvcnMgPSBudWxsO1xuICByZWZWYWxbMV0gPSByZWZWYWwxO1xuICB2YXIgcmVmVmFsMiA9IChmdW5jdGlvbigpIHtcbiAgICB2YXIgcGF0dGVybjAgPSBuZXcgUmVnRXhwKCdeWzAtOV0rJCcpO1xuICAgIHJldHVybiBmdW5jdGlvbiB2YWxpZGF0ZShkYXRhLCBkYXRhUGF0aCwgcGFyZW50RGF0YSwgcGFyZW50RGF0YVByb3BlcnR5LCByb290RGF0YSkge1xuICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgdmFyIHZFcnJvcnMgPSBudWxsO1xuICAgICAgdmFyIGVycm9ycyA9IDA7XG4gICAgICBpZiAodHlwZW9mIGRhdGEgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgdmFyIGVyciA9IHtcbiAgICAgICAgICBrZXl3b3JkOiAndHlwZScsXG4gICAgICAgICAgZGF0YVBhdGg6IChkYXRhUGF0aCB8fCAnJykgKyBcIlwiLFxuICAgICAgICAgIHNjaGVtYVBhdGg6ICcjL3R5cGUnLFxuICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgICB9LFxuICAgICAgICAgIG1lc3NhZ2U6ICdzaG91bGQgYmUgc3RyaW5nJ1xuICAgICAgICB9O1xuICAgICAgICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdO1xuICAgICAgICBlbHNlIHZFcnJvcnMucHVzaChlcnIpO1xuICAgICAgICBlcnJvcnMrKztcbiAgICAgIH1cbiAgICAgIHZhbGlkYXRlLmVycm9ycyA9IHZFcnJvcnM7XG4gICAgICByZXR1cm4gZXJyb3JzID09PSAwO1xuICAgIH07XG4gIH0pKCk7XG4gIHJlZlZhbDIuc2NoZW1hID0ge1xuICAgIFwidHlwZVwiOiBcInN0cmluZ1wiXG4gIH07XG4gIHJlZlZhbDIuZXJyb3JzID0gbnVsbDtcbiAgcmVmVmFsWzJdID0gcmVmVmFsMjtcbiAgdmFyIHJlZlZhbDMgPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhdHRlcm4wID0gbmV3IFJlZ0V4cCgnXlswLTldKyQnKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gdmFsaWRhdGUoZGF0YSwgZGF0YVBhdGgsIHBhcmVudERhdGEsIHBhcmVudERhdGFQcm9wZXJ0eSwgcm9vdERhdGEpIHtcbiAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgIHZhciB2RXJyb3JzID0gbnVsbDtcbiAgICAgIHZhciBlcnJvcnMgPSAwO1xuICAgICAgaWYgKHJvb3REYXRhID09PSB1bmRlZmluZWQpIHJvb3REYXRhID0gZGF0YTtcbiAgICAgIGlmICgoZGF0YSAmJiB0eXBlb2YgZGF0YSA9PT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheShkYXRhKSkpIHtcbiAgICAgICAgdmFyIGVycnNfXzAgPSBlcnJvcnM7XG4gICAgICAgIHZhciB2YWxpZDEgPSB0cnVlO1xuICAgICAgICBmb3IgKHZhciBrZXkwIGluIGRhdGEpIHtcbiAgICAgICAgICB2YXIgaXNBZGRpdGlvbmFsMCA9ICEoZmFsc2UgfHwgcGF0dGVybjAudGVzdChrZXkwKSk7XG4gICAgICAgICAgaWYgKGlzQWRkaXRpb25hbDApIHtcbiAgICAgICAgICAgIHZhbGlkMSA9IGZhbHNlO1xuICAgICAgICAgICAgdmFyIGVyciA9IHtcbiAgICAgICAgICAgICAga2V5d29yZDogJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJyxcbiAgICAgICAgICAgICAgZGF0YVBhdGg6IChkYXRhUGF0aCB8fCAnJykgKyBcIlwiLFxuICAgICAgICAgICAgICBzY2hlbWFQYXRoOiAnIy9hZGRpdGlvbmFsUHJvcGVydGllcycsXG4gICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxQcm9wZXJ0eTogJycgKyBrZXkwICsgJydcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgbWVzc2FnZTogJ3Nob3VsZCBOT1QgaGF2ZSBhZGRpdGlvbmFsIHByb3BlcnRpZXMnXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTtcbiAgICAgICAgICAgIGVsc2UgdkVycm9ycy5wdXNoKGVycik7XG4gICAgICAgICAgICBlcnJvcnMrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIga2V5MCBpbiBkYXRhKSB7XG4gICAgICAgICAgaWYgKHBhdHRlcm4wLnRlc3Qoa2V5MCkpIHtcbiAgICAgICAgICAgIHZhciBlcnJzXzEgPSBlcnJvcnM7XG4gICAgICAgICAgICBpZiAoIXJlZlZhbDQoZGF0YVtrZXkwXSwgKGRhdGFQYXRoIHx8ICcnKSArICdbXFwnJyArIGtleTAgKyAnXFwnXScsIGRhdGEsIGtleTAsIHJvb3REYXRhKSkge1xuICAgICAgICAgICAgICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IHJlZlZhbDQuZXJyb3JzO1xuICAgICAgICAgICAgICBlbHNlIHZFcnJvcnMgPSB2RXJyb3JzLmNvbmNhdChyZWZWYWw0LmVycm9ycyk7XG4gICAgICAgICAgICAgIGVycm9ycyA9IHZFcnJvcnMubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHZhbGlkMSA9IGVycm9ycyA9PT0gZXJyc18xO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGVyciA9IHtcbiAgICAgICAgICBrZXl3b3JkOiAndHlwZScsXG4gICAgICAgICAgZGF0YVBhdGg6IChkYXRhUGF0aCB8fCAnJykgKyBcIlwiLFxuICAgICAgICAgIHNjaGVtYVBhdGg6ICcjL3R5cGUnLFxuICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCdcbiAgICAgICAgICB9LFxuICAgICAgICAgIG1lc3NhZ2U6ICdzaG91bGQgYmUgb2JqZWN0J1xuICAgICAgICB9O1xuICAgICAgICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdO1xuICAgICAgICBlbHNlIHZFcnJvcnMucHVzaChlcnIpO1xuICAgICAgICBlcnJvcnMrKztcbiAgICAgIH1cbiAgICAgIHZhbGlkYXRlLmVycm9ycyA9IHZFcnJvcnM7XG4gICAgICByZXR1cm4gZXJyb3JzID09PSAwO1xuICAgIH07XG4gIH0pKCk7XG4gIHJlZlZhbDMuc2NoZW1hID0ge1xuICAgIFwidHlwZVwiOiBcIm9iamVjdFwiLFxuICAgIFwicGF0dGVyblByb3BlcnRpZXNcIjoge1xuICAgICAgXCJeWzAtOV0rJFwiOiB7XG4gICAgICAgIFwiJHJlZlwiOiBcIiMvZGVmaW5pdGlvbnMvY29sdW1uXCJcbiAgICAgIH1cbiAgICB9LFxuICAgIFwiYWRkaXRpb25hbFByb3BlcnRpZXNcIjogZmFsc2VcbiAgfTtcbiAgcmVmVmFsMy5lcnJvcnMgPSBudWxsO1xuICByZWZWYWxbM10gPSByZWZWYWwzO1xuICB2YXIgcmVmVmFsNCA9IChmdW5jdGlvbigpIHtcbiAgICB2YXIgcGF0dGVybjAgPSBuZXcgUmVnRXhwKCdeWzAtOV0rJCcpO1xuICAgIHJldHVybiBmdW5jdGlvbiB2YWxpZGF0ZShkYXRhLCBkYXRhUGF0aCwgcGFyZW50RGF0YSwgcGFyZW50RGF0YVByb3BlcnR5LCByb290RGF0YSkge1xuICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgdmFyIHZFcnJvcnMgPSBudWxsO1xuICAgICAgdmFyIGVycm9ycyA9IDA7XG4gICAgICBpZiAoKGRhdGEgJiYgdHlwZW9mIGRhdGEgPT09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkoZGF0YSkpKSB7XG4gICAgICAgIHZhciBlcnJzX18wID0gZXJyb3JzO1xuICAgICAgICB2YXIgdmFsaWQxID0gdHJ1ZTtcbiAgICAgICAgZm9yICh2YXIga2V5MCBpbiBkYXRhKSB7XG4gICAgICAgICAgdmFyIGlzQWRkaXRpb25hbDAgPSAhKGZhbHNlIHx8IHZhbGlkYXRlLnNjaGVtYS5wcm9wZXJ0aWVzW2tleTBdKTtcbiAgICAgICAgICBpZiAoaXNBZGRpdGlvbmFsMCkge1xuICAgICAgICAgICAgdmFsaWQxID0gZmFsc2U7XG4gICAgICAgICAgICB2YXIgZXJyID0ge1xuICAgICAgICAgICAgICBrZXl3b3JkOiAnYWRkaXRpb25hbFByb3BlcnRpZXMnLFxuICAgICAgICAgICAgICBkYXRhUGF0aDogKGRhdGFQYXRoIHx8ICcnKSArIFwiXCIsXG4gICAgICAgICAgICAgIHNjaGVtYVBhdGg6ICcjL2FkZGl0aW9uYWxQcm9wZXJ0aWVzJyxcbiAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgYWRkaXRpb25hbFByb3BlcnR5OiAnJyArIGtleTAgKyAnJ1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBtZXNzYWdlOiAnc2hvdWxkIE5PVCBoYXZlIGFkZGl0aW9uYWwgcHJvcGVydGllcydcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdO1xuICAgICAgICAgICAgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTtcbiAgICAgICAgICAgIGVycm9ycysrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgZGF0YTEgPSBkYXRhLmFsaWdubWVudDtcbiAgICAgICAgaWYgKGRhdGExICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB2YXIgZXJyc18xID0gZXJyb3JzO1xuICAgICAgICAgIGlmICh0eXBlb2YgZGF0YTEgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHZhciBlcnIgPSB7XG4gICAgICAgICAgICAgIGtleXdvcmQ6ICd0eXBlJyxcbiAgICAgICAgICAgICAgZGF0YVBhdGg6IChkYXRhUGF0aCB8fCAnJykgKyAnLmFsaWdubWVudCcsXG4gICAgICAgICAgICAgIHNjaGVtYVBhdGg6ICcjL3Byb3BlcnRpZXMvYWxpZ25tZW50L3R5cGUnLFxuICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBtZXNzYWdlOiAnc2hvdWxkIGJlIHN0cmluZydcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdO1xuICAgICAgICAgICAgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTtcbiAgICAgICAgICAgIGVycm9ycysrO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgc2NoZW1hMSA9IHZhbGlkYXRlLnNjaGVtYS5wcm9wZXJ0aWVzLmFsaWdubWVudC5lbnVtO1xuICAgICAgICAgIHZhciB2YWxpZDE7XG4gICAgICAgICAgdmFsaWQxID0gZmFsc2U7XG4gICAgICAgICAgZm9yICh2YXIgaTEgPSAwOyBpMSA8IHNjaGVtYTEubGVuZ3RoOyBpMSsrKVxuICAgICAgICAgICAgaWYgKGVxdWFsKGRhdGExLCBzY2hlbWExW2kxXSkpIHtcbiAgICAgICAgICAgICAgdmFsaWQxID0gdHJ1ZTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCF2YWxpZDEpIHtcbiAgICAgICAgICAgIHZhciBlcnIgPSB7XG4gICAgICAgICAgICAgIGtleXdvcmQ6ICdlbnVtJyxcbiAgICAgICAgICAgICAgZGF0YVBhdGg6IChkYXRhUGF0aCB8fCAnJykgKyAnLmFsaWdubWVudCcsXG4gICAgICAgICAgICAgIHNjaGVtYVBhdGg6ICcjL3Byb3BlcnRpZXMvYWxpZ25tZW50L2VudW0nLFxuICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICBhbGxvd2VkVmFsdWVzOiBzY2hlbWExXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG1lc3NhZ2U6ICdzaG91bGQgYmUgZXF1YWwgdG8gb25lIG9mIHRoZSBhbGxvd2VkIHZhbHVlcydcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdO1xuICAgICAgICAgICAgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTtcbiAgICAgICAgICAgIGVycm9ycysrO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgdmFsaWQxID0gZXJyb3JzID09PSBlcnJzXzE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGEud2lkdGggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHZhciBlcnJzXzEgPSBlcnJvcnM7XG4gICAgICAgICAgaWYgKHR5cGVvZiBkYXRhLndpZHRoICE9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICB2YXIgZXJyID0ge1xuICAgICAgICAgICAgICBrZXl3b3JkOiAndHlwZScsXG4gICAgICAgICAgICAgIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgJycpICsgJy53aWR0aCcsXG4gICAgICAgICAgICAgIHNjaGVtYVBhdGg6ICcjL3Byb3BlcnRpZXMvd2lkdGgvdHlwZScsXG4gICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdudW1iZXInXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG1lc3NhZ2U6ICdzaG91bGQgYmUgbnVtYmVyJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gW2Vycl07XG4gICAgICAgICAgICBlbHNlIHZFcnJvcnMucHVzaChlcnIpO1xuICAgICAgICAgICAgZXJyb3JzKys7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB2YWxpZDEgPSBlcnJvcnMgPT09IGVycnNfMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YS53cmFwV29yZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdmFyIGVycnNfMSA9IGVycm9ycztcbiAgICAgICAgICBpZiAodHlwZW9mIGRhdGEud3JhcFdvcmQgIT09IFwiYm9vbGVhblwiKSB7XG4gICAgICAgICAgICB2YXIgZXJyID0ge1xuICAgICAgICAgICAgICBrZXl3b3JkOiAndHlwZScsXG4gICAgICAgICAgICAgIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgJycpICsgJy53cmFwV29yZCcsXG4gICAgICAgICAgICAgIHNjaGVtYVBhdGg6ICcjL3Byb3BlcnRpZXMvd3JhcFdvcmQvdHlwZScsXG4gICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBtZXNzYWdlOiAnc2hvdWxkIGJlIGJvb2xlYW4nXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSBbZXJyXTtcbiAgICAgICAgICAgIGVsc2UgdkVycm9ycy5wdXNoKGVycik7XG4gICAgICAgICAgICBlcnJvcnMrKztcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHZhbGlkMSA9IGVycm9ycyA9PT0gZXJyc18xO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhLnRydW5jYXRlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB2YXIgZXJyc18xID0gZXJyb3JzO1xuICAgICAgICAgIGlmICh0eXBlb2YgZGF0YS50cnVuY2F0ZSAhPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgdmFyIGVyciA9IHtcbiAgICAgICAgICAgICAga2V5d29yZDogJ3R5cGUnLFxuICAgICAgICAgICAgICBkYXRhUGF0aDogKGRhdGFQYXRoIHx8ICcnKSArICcudHJ1bmNhdGUnLFxuICAgICAgICAgICAgICBzY2hlbWFQYXRoOiAnIy9wcm9wZXJ0aWVzL3RydW5jYXRlL3R5cGUnLFxuICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnbnVtYmVyJ1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBtZXNzYWdlOiAnc2hvdWxkIGJlIG51bWJlcidcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdO1xuICAgICAgICAgICAgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTtcbiAgICAgICAgICAgIGVycm9ycysrO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgdmFsaWQxID0gZXJyb3JzID09PSBlcnJzXzE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGEucGFkZGluZ0xlZnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHZhciBlcnJzXzEgPSBlcnJvcnM7XG4gICAgICAgICAgaWYgKHR5cGVvZiBkYXRhLnBhZGRpbmdMZWZ0ICE9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICB2YXIgZXJyID0ge1xuICAgICAgICAgICAgICBrZXl3b3JkOiAndHlwZScsXG4gICAgICAgICAgICAgIGRhdGFQYXRoOiAoZGF0YVBhdGggfHwgJycpICsgJy5wYWRkaW5nTGVmdCcsXG4gICAgICAgICAgICAgIHNjaGVtYVBhdGg6ICcjL3Byb3BlcnRpZXMvcGFkZGluZ0xlZnQvdHlwZScsXG4gICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdudW1iZXInXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG1lc3NhZ2U6ICdzaG91bGQgYmUgbnVtYmVyJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gW2Vycl07XG4gICAgICAgICAgICBlbHNlIHZFcnJvcnMucHVzaChlcnIpO1xuICAgICAgICAgICAgZXJyb3JzKys7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB2YWxpZDEgPSBlcnJvcnMgPT09IGVycnNfMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YS5wYWRkaW5nUmlnaHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHZhciBlcnJzXzEgPSBlcnJvcnM7XG4gICAgICAgICAgaWYgKHR5cGVvZiBkYXRhLnBhZGRpbmdSaWdodCAhPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgdmFyIGVyciA9IHtcbiAgICAgICAgICAgICAga2V5d29yZDogJ3R5cGUnLFxuICAgICAgICAgICAgICBkYXRhUGF0aDogKGRhdGFQYXRoIHx8ICcnKSArICcucGFkZGluZ1JpZ2h0JyxcbiAgICAgICAgICAgICAgc2NoZW1hUGF0aDogJyMvcHJvcGVydGllcy9wYWRkaW5nUmlnaHQvdHlwZScsXG4gICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdudW1iZXInXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG1lc3NhZ2U6ICdzaG91bGQgYmUgbnVtYmVyJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gW2Vycl07XG4gICAgICAgICAgICBlbHNlIHZFcnJvcnMucHVzaChlcnIpO1xuICAgICAgICAgICAgZXJyb3JzKys7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciB2YWxpZDEgPSBlcnJvcnMgPT09IGVycnNfMTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGVyciA9IHtcbiAgICAgICAgICBrZXl3b3JkOiAndHlwZScsXG4gICAgICAgICAgZGF0YVBhdGg6IChkYXRhUGF0aCB8fCAnJykgKyBcIlwiLFxuICAgICAgICAgIHNjaGVtYVBhdGg6ICcjL3R5cGUnLFxuICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCdcbiAgICAgICAgICB9LFxuICAgICAgICAgIG1lc3NhZ2U6ICdzaG91bGQgYmUgb2JqZWN0J1xuICAgICAgICB9O1xuICAgICAgICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdO1xuICAgICAgICBlbHNlIHZFcnJvcnMucHVzaChlcnIpO1xuICAgICAgICBlcnJvcnMrKztcbiAgICAgIH1cbiAgICAgIHZhbGlkYXRlLmVycm9ycyA9IHZFcnJvcnM7XG4gICAgICByZXR1cm4gZXJyb3JzID09PSAwO1xuICAgIH07XG4gIH0pKCk7XG4gIHJlZlZhbDQuc2NoZW1hID0ge1xuICAgIFwidHlwZVwiOiBcIm9iamVjdFwiLFxuICAgIFwicHJvcGVydGllc1wiOiB7XG4gICAgICBcImFsaWdubWVudFwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuICAgICAgICBcImVudW1cIjogW1wibGVmdFwiLCBcInJpZ2h0XCIsIFwiY2VudGVyXCJdXG4gICAgICB9LFxuICAgICAgXCJ3aWR0aFwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcIm51bWJlclwiXG4gICAgICB9LFxuICAgICAgXCJ3cmFwV29yZFwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcImJvb2xlYW5cIlxuICAgICAgfSxcbiAgICAgIFwidHJ1bmNhdGVcIjoge1xuICAgICAgICBcInR5cGVcIjogXCJudW1iZXJcIlxuICAgICAgfSxcbiAgICAgIFwicGFkZGluZ0xlZnRcIjoge1xuICAgICAgICBcInR5cGVcIjogXCJudW1iZXJcIlxuICAgICAgfSxcbiAgICAgIFwicGFkZGluZ1JpZ2h0XCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwibnVtYmVyXCJcbiAgICAgIH1cbiAgICB9LFxuICAgIFwiYWRkaXRpb25hbFByb3BlcnRpZXNcIjogZmFsc2VcbiAgfTtcbiAgcmVmVmFsNC5lcnJvcnMgPSBudWxsO1xuICByZWZWYWxbNF0gPSByZWZWYWw0O1xuICByZXR1cm4gZnVuY3Rpb24gdmFsaWRhdGUoZGF0YSwgZGF0YVBhdGgsIHBhcmVudERhdGEsIHBhcmVudERhdGFQcm9wZXJ0eSwgcm9vdERhdGEpIHtcbiAgICAndXNlIHN0cmljdCc7IC8qIyBzb3VyY2VVUkw9Y29uZmlnLmpzb24gKi9cbiAgICB2YXIgdkVycm9ycyA9IG51bGw7XG4gICAgdmFyIGVycm9ycyA9IDA7XG4gICAgaWYgKHJvb3REYXRhID09PSB1bmRlZmluZWQpIHJvb3REYXRhID0gZGF0YTtcbiAgICBpZiAoKGRhdGEgJiYgdHlwZW9mIGRhdGEgPT09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkoZGF0YSkpKSB7XG4gICAgICB2YXIgZXJyc19fMCA9IGVycm9ycztcbiAgICAgIHZhciB2YWxpZDEgPSB0cnVlO1xuICAgICAgZm9yICh2YXIga2V5MCBpbiBkYXRhKSB7XG4gICAgICAgIHZhciBpc0FkZGl0aW9uYWwwID0gIShmYWxzZSB8fCBrZXkwID09ICdib3JkZXInIHx8IGtleTAgPT0gJ2NvbHVtbnMnIHx8IGtleTAgPT0gJ2NvbHVtbkRlZmF1bHQnIHx8IGtleTAgPT0gJ2RyYXdIb3Jpem9udGFsTGluZScpO1xuICAgICAgICBpZiAoaXNBZGRpdGlvbmFsMCkge1xuICAgICAgICAgIHZhbGlkMSA9IGZhbHNlO1xuICAgICAgICAgIHZhciBlcnIgPSB7XG4gICAgICAgICAgICBrZXl3b3JkOiAnYWRkaXRpb25hbFByb3BlcnRpZXMnLFxuICAgICAgICAgICAgZGF0YVBhdGg6IChkYXRhUGF0aCB8fCAnJykgKyBcIlwiLFxuICAgICAgICAgICAgc2NoZW1hUGF0aDogJyMvYWRkaXRpb25hbFByb3BlcnRpZXMnLFxuICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgIGFkZGl0aW9uYWxQcm9wZXJ0eTogJycgKyBrZXkwICsgJydcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtZXNzYWdlOiAnc2hvdWxkIE5PVCBoYXZlIGFkZGl0aW9uYWwgcHJvcGVydGllcydcbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gW2Vycl07XG4gICAgICAgICAgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTtcbiAgICAgICAgICBlcnJvcnMrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGRhdGEuYm9yZGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdmFyIGVycnNfMSA9IGVycm9ycztcbiAgICAgICAgaWYgKCFyZWZWYWwxKGRhdGEuYm9yZGVyLCAoZGF0YVBhdGggfHwgJycpICsgJy5ib3JkZXInLCBkYXRhLCAnYm9yZGVyJywgcm9vdERhdGEpKSB7XG4gICAgICAgICAgaWYgKHZFcnJvcnMgPT09IG51bGwpIHZFcnJvcnMgPSByZWZWYWwxLmVycm9ycztcbiAgICAgICAgICBlbHNlIHZFcnJvcnMgPSB2RXJyb3JzLmNvbmNhdChyZWZWYWwxLmVycm9ycyk7XG4gICAgICAgICAgZXJyb3JzID0gdkVycm9ycy5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHZhbGlkMSA9IGVycm9ycyA9PT0gZXJyc18xO1xuICAgICAgfVxuICAgICAgaWYgKGRhdGEuY29sdW1ucyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHZhciBlcnJzXzEgPSBlcnJvcnM7XG4gICAgICAgIGlmICghcmVmVmFsMyhkYXRhLmNvbHVtbnMsIChkYXRhUGF0aCB8fCAnJykgKyAnLmNvbHVtbnMnLCBkYXRhLCAnY29sdW1ucycsIHJvb3REYXRhKSkge1xuICAgICAgICAgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gcmVmVmFsMy5lcnJvcnM7XG4gICAgICAgICAgZWxzZSB2RXJyb3JzID0gdkVycm9ycy5jb25jYXQocmVmVmFsMy5lcnJvcnMpO1xuICAgICAgICAgIGVycm9ycyA9IHZFcnJvcnMubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIHZhciB2YWxpZDEgPSBlcnJvcnMgPT09IGVycnNfMTtcbiAgICAgIH1cbiAgICAgIGlmIChkYXRhLmNvbHVtbkRlZmF1bHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB2YXIgZXJyc18xID0gZXJyb3JzO1xuICAgICAgICBpZiAoIXJlZlZhbFs0XShkYXRhLmNvbHVtbkRlZmF1bHQsIChkYXRhUGF0aCB8fCAnJykgKyAnLmNvbHVtbkRlZmF1bHQnLCBkYXRhLCAnY29sdW1uRGVmYXVsdCcsIHJvb3REYXRhKSkge1xuICAgICAgICAgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gcmVmVmFsWzRdLmVycm9ycztcbiAgICAgICAgICBlbHNlIHZFcnJvcnMgPSB2RXJyb3JzLmNvbmNhdChyZWZWYWxbNF0uZXJyb3JzKTtcbiAgICAgICAgICBlcnJvcnMgPSB2RXJyb3JzLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdmFsaWQxID0gZXJyb3JzID09PSBlcnJzXzE7XG4gICAgICB9XG4gICAgICBpZiAoZGF0YS5kcmF3SG9yaXpvbnRhbExpbmUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB2YXIgZXJyc18xID0gZXJyb3JzO1xuICAgICAgICB2YXIgZXJyc19fMSA9IGVycm9ycztcbiAgICAgICAgdmFyIHZhbGlkMTtcbiAgICAgICAgdmFsaWQxID0gdHlwZW9mIGRhdGEuZHJhd0hvcml6b250YWxMaW5lID09IFwiZnVuY3Rpb25cIjtcbiAgICAgICAgaWYgKCF2YWxpZDEpIHtcbiAgICAgICAgICBpZiAoZXJyc19fMSA9PSBlcnJvcnMpIHtcbiAgICAgICAgICAgIHZhciBlcnIgPSB7XG4gICAgICAgICAgICAgIGtleXdvcmQ6ICd0eXBlb2YnLFxuICAgICAgICAgICAgICBkYXRhUGF0aDogKGRhdGFQYXRoIHx8ICcnKSArICcuZHJhd0hvcml6b250YWxMaW5lJyxcbiAgICAgICAgICAgICAgc2NoZW1hUGF0aDogJyMvcHJvcGVydGllcy9kcmF3SG9yaXpvbnRhbExpbmUvdHlwZW9mJyxcbiAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAga2V5d29yZDogJ3R5cGVvZidcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgbWVzc2FnZTogJ3Nob3VsZCBwYXNzIFwidHlwZW9mXCIga2V5d29yZCB2YWxpZGF0aW9uJ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh2RXJyb3JzID09PSBudWxsKSB2RXJyb3JzID0gW2Vycl07XG4gICAgICAgICAgICBlbHNlIHZFcnJvcnMucHVzaChlcnIpO1xuICAgICAgICAgICAgZXJyb3JzKys7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkxID0gZXJyc19fMTsgaTEgPCBlcnJvcnM7IGkxKyspIHtcbiAgICAgICAgICAgICAgdmFyIHJ1bGVFcnIxID0gdkVycm9yc1tpMV07XG4gICAgICAgICAgICAgIGlmIChydWxlRXJyMS5kYXRhUGF0aCA9PT0gdW5kZWZpbmVkKSBydWxlRXJyMS5kYXRhUGF0aCA9IChkYXRhUGF0aCB8fCAnJykgKyAnLmRyYXdIb3Jpem9udGFsTGluZSc7XG4gICAgICAgICAgICAgIGlmIChydWxlRXJyMS5zY2hlbWFQYXRoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBydWxlRXJyMS5zY2hlbWFQYXRoID0gXCIjL3Byb3BlcnRpZXMvZHJhd0hvcml6b250YWxMaW5lL3R5cGVvZlwiO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciB2YWxpZDEgPSBlcnJvcnMgPT09IGVycnNfMTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGVyciA9IHtcbiAgICAgICAga2V5d29yZDogJ3R5cGUnLFxuICAgICAgICBkYXRhUGF0aDogKGRhdGFQYXRoIHx8ICcnKSArIFwiXCIsXG4gICAgICAgIHNjaGVtYVBhdGg6ICcjL3R5cGUnLFxuICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICB0eXBlOiAnb2JqZWN0J1xuICAgICAgICB9LFxuICAgICAgICBtZXNzYWdlOiAnc2hvdWxkIGJlIG9iamVjdCdcbiAgICAgIH07XG4gICAgICBpZiAodkVycm9ycyA9PT0gbnVsbCkgdkVycm9ycyA9IFtlcnJdO1xuICAgICAgZWxzZSB2RXJyb3JzLnB1c2goZXJyKTtcbiAgICAgIGVycm9ycysrO1xuICAgIH1cbiAgICB2YWxpZGF0ZS5lcnJvcnMgPSB2RXJyb3JzO1xuICAgIHJldHVybiBlcnJvcnMgPT09IDA7XG4gIH07XG59KSgpO1xudmFsaWRhdGUuc2NoZW1hID0ge1xuICBcIiRpZFwiOiBcImNvbmZpZy5qc29uXCIsXG4gIFwiJHNjaGVtYVwiOiBcImh0dHA6Ly9qc29uLXNjaGVtYS5vcmcvZHJhZnQtMDYvc2NoZW1hI1wiLFxuICBcInR5cGVcIjogXCJvYmplY3RcIixcbiAgXCJwcm9wZXJ0aWVzXCI6IHtcbiAgICBcImJvcmRlclwiOiB7XG4gICAgICBcIiRyZWZcIjogXCIjL2RlZmluaXRpb25zL2JvcmRlcnNcIlxuICAgIH0sXG4gICAgXCJjb2x1bW5zXCI6IHtcbiAgICAgIFwiJHJlZlwiOiBcIiMvZGVmaW5pdGlvbnMvY29sdW1uc1wiXG4gICAgfSxcbiAgICBcImNvbHVtbkRlZmF1bHRcIjoge1xuICAgICAgXCIkcmVmXCI6IFwiIy9kZWZpbml0aW9ucy9jb2x1bW5cIlxuICAgIH0sXG4gICAgXCJkcmF3SG9yaXpvbnRhbExpbmVcIjoge1xuICAgICAgXCJ0eXBlb2ZcIjogXCJmdW5jdGlvblwiXG4gICAgfVxuICB9LFxuICBcImFkZGl0aW9uYWxQcm9wZXJ0aWVzXCI6IGZhbHNlLFxuICBcImRlZmluaXRpb25zXCI6IHtcbiAgICBcImNvbHVtbnNcIjoge1xuICAgICAgXCJ0eXBlXCI6IFwib2JqZWN0XCIsXG4gICAgICBcInBhdHRlcm5Qcm9wZXJ0aWVzXCI6IHtcbiAgICAgICAgXCJeWzAtOV0rJFwiOiB7XG4gICAgICAgICAgXCIkcmVmXCI6IFwiIy9kZWZpbml0aW9ucy9jb2x1bW5cIlxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgXCJhZGRpdGlvbmFsUHJvcGVydGllc1wiOiBmYWxzZVxuICAgIH0sXG4gICAgXCJjb2x1bW5cIjoge1xuICAgICAgXCJ0eXBlXCI6IFwib2JqZWN0XCIsXG4gICAgICBcInByb3BlcnRpZXNcIjoge1xuICAgICAgICBcImFsaWdubWVudFwiOiB7XG4gICAgICAgICAgXCJ0eXBlXCI6IFwic3RyaW5nXCIsXG4gICAgICAgICAgXCJlbnVtXCI6IFtcImxlZnRcIiwgXCJyaWdodFwiLCBcImNlbnRlclwiXVxuICAgICAgICB9LFxuICAgICAgICBcIndpZHRoXCI6IHtcbiAgICAgICAgICBcInR5cGVcIjogXCJudW1iZXJcIlxuICAgICAgICB9LFxuICAgICAgICBcIndyYXBXb3JkXCI6IHtcbiAgICAgICAgICBcInR5cGVcIjogXCJib29sZWFuXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJ0cnVuY2F0ZVwiOiB7XG4gICAgICAgICAgXCJ0eXBlXCI6IFwibnVtYmVyXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJwYWRkaW5nTGVmdFwiOiB7XG4gICAgICAgICAgXCJ0eXBlXCI6IFwibnVtYmVyXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJwYWRkaW5nUmlnaHRcIjoge1xuICAgICAgICAgIFwidHlwZVwiOiBcIm51bWJlclwiXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcImFkZGl0aW9uYWxQcm9wZXJ0aWVzXCI6IGZhbHNlXG4gICAgfSxcbiAgICBcImJvcmRlcnNcIjoge1xuICAgICAgXCJ0eXBlXCI6IFwib2JqZWN0XCIsXG4gICAgICBcInByb3BlcnRpZXNcIjoge1xuICAgICAgICBcInRvcEJvZHlcIjoge1xuICAgICAgICAgIFwiJHJlZlwiOiBcIiMvZGVmaW5pdGlvbnMvYm9yZGVyXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJ0b3BKb2luXCI6IHtcbiAgICAgICAgICBcIiRyZWZcIjogXCIjL2RlZmluaXRpb25zL2JvcmRlclwiXG4gICAgICAgIH0sXG4gICAgICAgIFwidG9wTGVmdFwiOiB7XG4gICAgICAgICAgXCIkcmVmXCI6IFwiIy9kZWZpbml0aW9ucy9ib3JkZXJcIlxuICAgICAgICB9LFxuICAgICAgICBcInRvcFJpZ2h0XCI6IHtcbiAgICAgICAgICBcIiRyZWZcIjogXCIjL2RlZmluaXRpb25zL2JvcmRlclwiXG4gICAgICAgIH0sXG4gICAgICAgIFwiYm90dG9tQm9keVwiOiB7XG4gICAgICAgICAgXCIkcmVmXCI6IFwiIy9kZWZpbml0aW9ucy9ib3JkZXJcIlxuICAgICAgICB9LFxuICAgICAgICBcImJvdHRvbUpvaW5cIjoge1xuICAgICAgICAgIFwiJHJlZlwiOiBcIiMvZGVmaW5pdGlvbnMvYm9yZGVyXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJib3R0b21MZWZ0XCI6IHtcbiAgICAgICAgICBcIiRyZWZcIjogXCIjL2RlZmluaXRpb25zL2JvcmRlclwiXG4gICAgICAgIH0sXG4gICAgICAgIFwiYm90dG9tUmlnaHRcIjoge1xuICAgICAgICAgIFwiJHJlZlwiOiBcIiMvZGVmaW5pdGlvbnMvYm9yZGVyXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJib2R5TGVmdFwiOiB7XG4gICAgICAgICAgXCIkcmVmXCI6IFwiIy9kZWZpbml0aW9ucy9ib3JkZXJcIlxuICAgICAgICB9LFxuICAgICAgICBcImJvZHlSaWdodFwiOiB7XG4gICAgICAgICAgXCIkcmVmXCI6IFwiIy9kZWZpbml0aW9ucy9ib3JkZXJcIlxuICAgICAgICB9LFxuICAgICAgICBcImJvZHlKb2luXCI6IHtcbiAgICAgICAgICBcIiRyZWZcIjogXCIjL2RlZmluaXRpb25zL2JvcmRlclwiXG4gICAgICAgIH0sXG4gICAgICAgIFwiam9pbkJvZHlcIjoge1xuICAgICAgICAgIFwiJHJlZlwiOiBcIiMvZGVmaW5pdGlvbnMvYm9yZGVyXCJcbiAgICAgICAgfSxcbiAgICAgICAgXCJqb2luTGVmdFwiOiB7XG4gICAgICAgICAgXCIkcmVmXCI6IFwiIy9kZWZpbml0aW9ucy9ib3JkZXJcIlxuICAgICAgICB9LFxuICAgICAgICBcImpvaW5SaWdodFwiOiB7XG4gICAgICAgICAgXCIkcmVmXCI6IFwiIy9kZWZpbml0aW9ucy9ib3JkZXJcIlxuICAgICAgICB9LFxuICAgICAgICBcImpvaW5Kb2luXCI6IHtcbiAgICAgICAgICBcIiRyZWZcIjogXCIjL2RlZmluaXRpb25zL2JvcmRlclwiXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcImFkZGl0aW9uYWxQcm9wZXJ0aWVzXCI6IGZhbHNlXG4gICAgfSxcbiAgICBcImJvcmRlclwiOiB7XG4gICAgICBcInR5cGVcIjogXCJzdHJpbmdcIlxuICAgIH1cbiAgfVxufTtcbnZhbGlkYXRlLmVycm9ycyA9IG51bGw7XG5tb2R1bGUuZXhwb3J0cyA9IHZhbGlkYXRlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi90YWJsZS9kaXN0L3ZhbGlkYXRlQ29uZmlnLmpzXG4vLyBtb2R1bGUgaWQgPSA1NFxuLy8gbW9kdWxlIGNodW5rcyA9IDMgNCIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9sb2Rhc2ggPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxudmFyIF9sb2Rhc2gyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbG9kYXNoKTtcblxudmFyIF9zbGljZUFuc2kgPSByZXF1aXJlKCdzbGljZS1hbnNpJyk7XG5cbnZhciBfc2xpY2VBbnNpMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3NsaWNlQW5zaSk7XG5cbnZhciBfc3RyaW5nV2lkdGggPSByZXF1aXJlKCdzdHJpbmctd2lkdGgnKTtcblxudmFyIF9zdHJpbmdXaWR0aDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zdHJpbmdXaWR0aCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IGlucHV0XG4gKiBAcGFyYW0ge251bWJlcn0gc2l6ZVxuICogQHJldHVybnMge0FycmF5fVxuICovXG5leHBvcnRzLmRlZmF1bHQgPSAoaW5wdXQsIHNpemUpID0+IHtcbiAgbGV0IHN1YmplY3Q7XG5cbiAgc3ViamVjdCA9IGlucHV0O1xuXG4gIGNvbnN0IGNodW5rcyA9IFtdO1xuXG4gIC8vIGh0dHBzOi8vcmVnZXgxMDEuY29tL3IvZ1k1a1oxLzFcbiAgY29uc3QgcmUgPSBuZXcgUmVnRXhwKCcoXi57MSwnICsgc2l6ZSArICd9KFxcXFxzK3wkKSl8KF4uezEsJyArIChzaXplIC0gMSkgKyAnfShcXFxcXFxcXHwvfF98XFxcXC58LHw7fC0pKScpO1xuXG4gIGRvIHtcbiAgICBsZXQgY2h1bms7XG5cbiAgICBjaHVuayA9IHN1YmplY3QubWF0Y2gocmUpO1xuXG4gICAgaWYgKGNodW5rKSB7XG4gICAgICBjaHVuayA9IGNodW5rWzBdO1xuXG4gICAgICBzdWJqZWN0ID0gKDAsIF9zbGljZUFuc2kyLmRlZmF1bHQpKHN1YmplY3QsICgwLCBfc3RyaW5nV2lkdGgyLmRlZmF1bHQpKGNodW5rKSk7XG5cbiAgICAgIGNodW5rID0gX2xvZGFzaDIuZGVmYXVsdC50cmltKGNodW5rKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2h1bmsgPSAoMCwgX3NsaWNlQW5zaTIuZGVmYXVsdCkoc3ViamVjdCwgMCwgc2l6ZSk7XG4gICAgICBzdWJqZWN0ID0gKDAsIF9zbGljZUFuc2kyLmRlZmF1bHQpKHN1YmplY3QsIHNpemUpO1xuICAgIH1cblxuICAgIGNodW5rcy5wdXNoKGNodW5rKTtcbiAgfSB3aGlsZSAoKDAsIF9zdHJpbmdXaWR0aDIuZGVmYXVsdCkoc3ViamVjdCkpO1xuXG4gIHJldHVybiBjaHVua3M7XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi90YWJsZS9kaXN0L3dyYXBXb3JkLmpzXG4vLyBtb2R1bGUgaWQgPSA1NVxuLy8gbW9kdWxlIGNodW5rcyA9IDMgNCIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IHN0cmlwQW5zaSA9IHJlcXVpcmUoJ3N0cmlwLWFuc2knKTtcbmNvbnN0IGlzRnVsbHdpZHRoQ29kZVBvaW50ID0gcmVxdWlyZSgnaXMtZnVsbHdpZHRoLWNvZGUtcG9pbnQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBzdHIgPT4ge1xuXHRpZiAodHlwZW9mIHN0ciAhPT0gJ3N0cmluZycgfHwgc3RyLmxlbmd0aCA9PT0gMCkge1xuXHRcdHJldHVybiAwO1xuXHR9XG5cblx0c3RyID0gc3RyaXBBbnNpKHN0cik7XG5cblx0bGV0IHdpZHRoID0gMDtcblxuXHRmb3IgKGxldCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuXHRcdGNvbnN0IGNvZGUgPSBzdHIuY29kZVBvaW50QXQoaSk7XG5cblx0XHQvLyBJZ25vcmUgY29udHJvbCBjaGFyYWN0ZXJzXG5cdFx0aWYgKGNvZGUgPD0gMHgxRiB8fCAoY29kZSA+PSAweDdGICYmIGNvZGUgPD0gMHg5RikpIHtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblxuXHRcdC8vIElnbm9yZSBjb21iaW5pbmcgY2hhcmFjdGVyc1xuXHRcdGlmIChjb2RlID49IDB4MzAwICYmIGNvZGUgPD0gMHgzNkYpIHtcblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblxuXHRcdC8vIFN1cnJvZ2F0ZXNcblx0XHRpZiAoY29kZSA+IDB4RkZGRikge1xuXHRcdFx0aSsrO1xuXHRcdH1cblxuXHRcdHdpZHRoICs9IGlzRnVsbHdpZHRoQ29kZVBvaW50KGNvZGUpID8gMiA6IDE7XG5cdH1cblxuXHRyZXR1cm4gd2lkdGg7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3RhYmxlL34vc3RyaW5nLXdpZHRoL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMyA0IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVxdWFsKGEsIGIpIHtcbiAgaWYgKGEgPT09IGIpIHJldHVybiB0cnVlO1xuXG4gIHZhciBhcnJBID0gQXJyYXkuaXNBcnJheShhKVxuICAgICwgYXJyQiA9IEFycmF5LmlzQXJyYXkoYilcbiAgICAsIGk7XG5cbiAgaWYgKGFyckEgJiYgYXJyQikge1xuICAgIGlmIChhLmxlbmd0aCAhPSBiLmxlbmd0aCkgcmV0dXJuIGZhbHNlO1xuICAgIGZvciAoaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKVxuICAgICAgaWYgKCFlcXVhbChhW2ldLCBiW2ldKSkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKGFyckEgIT0gYXJyQikgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChhICYmIGIgJiYgdHlwZW9mIGEgPT09ICdvYmplY3QnICYmIHR5cGVvZiBiID09PSAnb2JqZWN0Jykge1xuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYSk7XG4gICAgaWYgKGtleXMubGVuZ3RoICE9PSBPYmplY3Qua2V5cyhiKS5sZW5ndGgpIHJldHVybiBmYWxzZTtcblxuICAgIHZhciBkYXRlQSA9IGEgaW5zdGFuY2VvZiBEYXRlXG4gICAgICAsIGRhdGVCID0gYiBpbnN0YW5jZW9mIERhdGU7XG4gICAgaWYgKGRhdGVBICYmIGRhdGVCKSByZXR1cm4gYS5nZXRUaW1lKCkgPT0gYi5nZXRUaW1lKCk7XG4gICAgaWYgKGRhdGVBICE9IGRhdGVCKSByZXR1cm4gZmFsc2U7XG5cbiAgICB2YXIgcmVnZXhwQSA9IGEgaW5zdGFuY2VvZiBSZWdFeHBcbiAgICAgICwgcmVnZXhwQiA9IGIgaW5zdGFuY2VvZiBSZWdFeHA7XG4gICAgaWYgKHJlZ2V4cEEgJiYgcmVnZXhwQikgcmV0dXJuIGEudG9TdHJpbmcoKSA9PSBiLnRvU3RyaW5nKCk7XG4gICAgaWYgKHJlZ2V4cEEgIT0gcmVnZXhwQikgcmV0dXJuIGZhbHNlO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspXG4gICAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBrZXlzW2ldKSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspXG4gICAgICBpZighZXF1YWwoYVtrZXlzW2ldXSwgYltrZXlzW2ldXSkpIHJldHVybiBmYWxzZTtcblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9mYXN0LWRlZXAtZXF1YWwvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDY1XG4vLyBtb2R1bGUgY2h1bmtzID0gMyA0IiwiJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgeW9kYSAqL1xubW9kdWxlLmV4cG9ydHMgPSB4ID0+IHtcblx0aWYgKE51bWJlci5pc05hTih4KSkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8vIGNvZGUgcG9pbnRzIGFyZSBkZXJpdmVkIGZyb206XG5cdC8vIGh0dHA6Ly93d3cudW5peC5vcmcvUHVibGljL1VOSURBVEEvRWFzdEFzaWFuV2lkdGgudHh0XG5cdGlmIChcblx0XHR4ID49IDB4MTEwMCAmJiAoXG5cdFx0XHR4IDw9IDB4MTE1ZiB8fCAgLy8gSGFuZ3VsIEphbW9cblx0XHRcdHggPT09IDB4MjMyOSB8fCAvLyBMRUZULVBPSU5USU5HIEFOR0xFIEJSQUNLRVRcblx0XHRcdHggPT09IDB4MjMyYSB8fCAvLyBSSUdIVC1QT0lOVElORyBBTkdMRSBCUkFDS0VUXG5cdFx0XHQvLyBDSksgUmFkaWNhbHMgU3VwcGxlbWVudCAuLiBFbmNsb3NlZCBDSksgTGV0dGVycyBhbmQgTW9udGhzXG5cdFx0XHQoMHgyZTgwIDw9IHggJiYgeCA8PSAweDMyNDcgJiYgeCAhPT0gMHgzMDNmKSB8fFxuXHRcdFx0Ly8gRW5jbG9zZWQgQ0pLIExldHRlcnMgYW5kIE1vbnRocyAuLiBDSksgVW5pZmllZCBJZGVvZ3JhcGhzIEV4dGVuc2lvbiBBXG5cdFx0XHQoMHgzMjUwIDw9IHggJiYgeCA8PSAweDRkYmYpIHx8XG5cdFx0XHQvLyBDSksgVW5pZmllZCBJZGVvZ3JhcGhzIC4uIFlpIFJhZGljYWxzXG5cdFx0XHQoMHg0ZTAwIDw9IHggJiYgeCA8PSAweGE0YzYpIHx8XG5cdFx0XHQvLyBIYW5ndWwgSmFtbyBFeHRlbmRlZC1BXG5cdFx0XHQoMHhhOTYwIDw9IHggJiYgeCA8PSAweGE5N2MpIHx8XG5cdFx0XHQvLyBIYW5ndWwgU3lsbGFibGVzXG5cdFx0XHQoMHhhYzAwIDw9IHggJiYgeCA8PSAweGQ3YTMpIHx8XG5cdFx0XHQvLyBDSksgQ29tcGF0aWJpbGl0eSBJZGVvZ3JhcGhzXG5cdFx0XHQoMHhmOTAwIDw9IHggJiYgeCA8PSAweGZhZmYpIHx8XG5cdFx0XHQvLyBWZXJ0aWNhbCBGb3Jtc1xuXHRcdFx0KDB4ZmUxMCA8PSB4ICYmIHggPD0gMHhmZTE5KSB8fFxuXHRcdFx0Ly8gQ0pLIENvbXBhdGliaWxpdHkgRm9ybXMgLi4gU21hbGwgRm9ybSBWYXJpYW50c1xuXHRcdFx0KDB4ZmUzMCA8PSB4ICYmIHggPD0gMHhmZTZiKSB8fFxuXHRcdFx0Ly8gSGFsZndpZHRoIGFuZCBGdWxsd2lkdGggRm9ybXNcblx0XHRcdCgweGZmMDEgPD0geCAmJiB4IDw9IDB4ZmY2MCkgfHxcblx0XHRcdCgweGZmZTAgPD0geCAmJiB4IDw9IDB4ZmZlNikgfHxcblx0XHRcdC8vIEthbmEgU3VwcGxlbWVudFxuXHRcdFx0KDB4MWIwMDAgPD0geCAmJiB4IDw9IDB4MWIwMDEpIHx8XG5cdFx0XHQvLyBFbmNsb3NlZCBJZGVvZ3JhcGhpYyBTdXBwbGVtZW50XG5cdFx0XHQoMHgxZjIwMCA8PSB4ICYmIHggPD0gMHgxZjI1MSkgfHxcblx0XHRcdC8vIENKSyBVbmlmaWVkIElkZW9ncmFwaHMgRXh0ZW5zaW9uIEIgLi4gVGVydGlhcnkgSWRlb2dyYXBoaWMgUGxhbmVcblx0XHRcdCgweDIwMDAwIDw9IHggJiYgeCA8PSAweDNmZmZkKVxuXHRcdClcblx0KSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRyZXR1cm4gZmFsc2U7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3NsaWNlLWFuc2kvfi9pcy1mdWxsd2lkdGgtY29kZS1wb2ludC9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gODNcbi8vIG1vZHVsZSBjaHVua3MgPSAzIDQiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfbG9kYXNoID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbnZhciBfbG9kYXNoMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2xvZGFzaCk7XG5cbnZhciBfc3RyaW5nV2lkdGggPSByZXF1aXJlKCdzdHJpbmctd2lkdGgnKTtcblxudmFyIF9zdHJpbmdXaWR0aDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zdHJpbmdXaWR0aCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmNvbnN0IGFsaWdubWVudHMgPSBbJ2xlZnQnLCAncmlnaHQnLCAnY2VudGVyJ107XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHN1YmplY3RcbiAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aFxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuY29uc3QgYWxpZ25MZWZ0ID0gKHN1YmplY3QsIHdpZHRoKSA9PiB7XG4gIHJldHVybiBzdWJqZWN0ICsgX2xvZGFzaDIuZGVmYXVsdC5yZXBlYXQoJyAnLCB3aWR0aCk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdWJqZWN0XG4gKiBAcGFyYW0ge251bWJlcn0gd2lkdGhcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmNvbnN0IGFsaWduUmlnaHQgPSAoc3ViamVjdCwgd2lkdGgpID0+IHtcbiAgcmV0dXJuIF9sb2Rhc2gyLmRlZmF1bHQucmVwZWF0KCcgJywgd2lkdGgpICsgc3ViamVjdDtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHN1YmplY3RcbiAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aFxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuY29uc3QgYWxpZ25DZW50ZXIgPSAoc3ViamVjdCwgd2lkdGgpID0+IHtcbiAgbGV0IGhhbGZXaWR0aDtcblxuICBoYWxmV2lkdGggPSB3aWR0aCAvIDI7XG5cbiAgaWYgKGhhbGZXaWR0aCAlIDIgPT09IDApIHtcbiAgICByZXR1cm4gX2xvZGFzaDIuZGVmYXVsdC5yZXBlYXQoJyAnLCBoYWxmV2lkdGgpICsgc3ViamVjdCArIF9sb2Rhc2gyLmRlZmF1bHQucmVwZWF0KCcgJywgaGFsZldpZHRoKTtcbiAgfSBlbHNlIHtcbiAgICBoYWxmV2lkdGggPSBfbG9kYXNoMi5kZWZhdWx0LmZsb29yKGhhbGZXaWR0aCk7XG5cbiAgICByZXR1cm4gX2xvZGFzaDIuZGVmYXVsdC5yZXBlYXQoJyAnLCBoYWxmV2lkdGgpICsgc3ViamVjdCArIF9sb2Rhc2gyLmRlZmF1bHQucmVwZWF0KCcgJywgaGFsZldpZHRoICsgMSk7XG4gIH1cbn07XG5cbi8qKlxuICogUGFkcyBhIHN0cmluZyB0byB0aGUgbGVmdCBhbmQvb3IgcmlnaHQgdG8gcG9zaXRpb24gdGhlIHN1YmplY3RcbiAqIHRleHQgaW4gYSBkZXNpcmVkIGFsaWdubWVudCB3aXRoaW4gYSBjb250YWluZXIuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN1YmplY3RcbiAqIEBwYXJhbSB7bnVtYmVyfSBjb250YWluZXJXaWR0aFxuICogQHBhcmFtIHtzdHJpbmd9IGFsaWdubWVudCBPbmUgb2YgdGhlIHZhbGlkIG9wdGlvbnMgKGxlZnQsIHJpZ2h0LCBjZW50ZXIpLlxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuXG5leHBvcnRzLmRlZmF1bHQgPSAoc3ViamVjdCwgY29udGFpbmVyV2lkdGgsIGFsaWdubWVudCkgPT4ge1xuICBpZiAoIV9sb2Rhc2gyLmRlZmF1bHQuaXNTdHJpbmcoc3ViamVjdCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdTdWJqZWN0IHBhcmFtZXRlciB2YWx1ZSBtdXN0IGJlIGEgc3RyaW5nLicpO1xuICB9XG5cbiAgaWYgKCFfbG9kYXNoMi5kZWZhdWx0LmlzTnVtYmVyKGNvbnRhaW5lcldpZHRoKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0NvbnRhaW5lciB3aWR0aCBwYXJhbWV0ZXIgdmFsdWUgbXVzdCBiZSBhIG51bWJlci4nKTtcbiAgfVxuXG4gIGNvbnN0IHN1YmplY3RXaWR0aCA9ICgwLCBfc3RyaW5nV2lkdGgyLmRlZmF1bHQpKHN1YmplY3QpO1xuXG4gIGlmIChzdWJqZWN0V2lkdGggPiBjb250YWluZXJXaWR0aCkge1xuICAgIC8vIGNvbnNvbGUubG9nKCdzdWJqZWN0V2lkdGgnLCBzdWJqZWN0V2lkdGgsICdjb250YWluZXJXaWR0aCcsIGNvbnRhaW5lcldpZHRoLCAnc3ViamVjdCcsIHN1YmplY3QpO1xuXG4gICAgdGhyb3cgbmV3IEVycm9yKCdTdWJqZWN0IHBhcmFtZXRlciB2YWx1ZSB3aWR0aCBjYW5ub3QgYmUgZ3JlYXRlciB0aGFuIHRoZSBjb250YWluZXIgd2lkdGguJyk7XG4gIH1cblxuICBpZiAoIV9sb2Rhc2gyLmRlZmF1bHQuaXNTdHJpbmcoYWxpZ25tZW50KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FsaWdubWVudCBwYXJhbWV0ZXIgdmFsdWUgbXVzdCBiZSBhIHN0cmluZy4nKTtcbiAgfVxuXG4gIGlmIChhbGlnbm1lbnRzLmluZGV4T2YoYWxpZ25tZW50KSA9PT0gLTEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0FsaWdubWVudCBwYXJhbWV0ZXIgdmFsdWUgbXVzdCBiZSBhIGtub3duIGFsaWdubWVudCBwYXJhbWV0ZXIgdmFsdWUgKGxlZnQsIHJpZ2h0LCBjZW50ZXIpLicpO1xuICB9XG5cbiAgaWYgKHN1YmplY3RXaWR0aCA9PT0gMCkge1xuICAgIHJldHVybiBfbG9kYXNoMi5kZWZhdWx0LnJlcGVhdCgnICcsIGNvbnRhaW5lcldpZHRoKTtcbiAgfVxuXG4gIGNvbnN0IGF2YWlsYWJsZVdpZHRoID0gY29udGFpbmVyV2lkdGggLSBzdWJqZWN0V2lkdGg7XG5cbiAgaWYgKGFsaWdubWVudCA9PT0gJ2xlZnQnKSB7XG4gICAgcmV0dXJuIGFsaWduTGVmdChzdWJqZWN0LCBhdmFpbGFibGVXaWR0aCk7XG4gIH1cblxuICBpZiAoYWxpZ25tZW50ID09PSAncmlnaHQnKSB7XG4gICAgcmV0dXJuIGFsaWduUmlnaHQoc3ViamVjdCwgYXZhaWxhYmxlV2lkdGgpO1xuICB9XG5cbiAgcmV0dXJuIGFsaWduQ2VudGVyKHN1YmplY3QsIGF2YWlsYWJsZVdpZHRoKTtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3RhYmxlL2Rpc3QvYWxpZ25TdHJpbmcuanNcbi8vIG1vZHVsZSBpZCA9IDg1XG4vLyBtb2R1bGUgY2h1bmtzID0gMyA0IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2xvZGFzaCA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG52YXIgX2xvZGFzaDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9sb2Rhc2gpO1xuXG52YXIgX3N0cmluZ1dpZHRoID0gcmVxdWlyZSgnc3RyaW5nLXdpZHRoJyk7XG5cbnZhciBfc3RyaW5nV2lkdGgyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RyaW5nV2lkdGgpO1xuXG52YXIgX3dyYXBXb3JkID0gcmVxdWlyZSgnLi93cmFwV29yZCcpO1xuXG52YXIgX3dyYXBXb3JkMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3dyYXBXb3JkKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcbiAqIEBwYXJhbSB7bnVtYmVyfSBjb2x1bW5XaWR0aFxuICogQHBhcmFtIHtib29sZWFufSB1c2VXcmFwV29yZFxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKHZhbHVlLCBjb2x1bW5XaWR0aCkge1xuICBsZXQgdXNlV3JhcFdvcmQgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IGZhbHNlO1xuXG4gIGlmICghX2xvZGFzaDIuZGVmYXVsdC5pc1N0cmluZyh2YWx1ZSkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdWYWx1ZSBtdXN0IGJlIGEgc3RyaW5nLicpO1xuICB9XG5cbiAgaWYgKCFfbG9kYXNoMi5kZWZhdWx0LmlzSW50ZWdlcihjb2x1bW5XaWR0aCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDb2x1bW4gd2lkdGggbXVzdCBiZSBhbiBpbnRlZ2VyLicpO1xuICB9XG5cbiAgaWYgKGNvbHVtbldpZHRoIDwgMSkge1xuICAgIHRocm93IG5ldyBFcnJvcignQ29sdW1uIHdpZHRoIG11c3QgYmUgZ3JlYXRlciB0aGFuIDAuJyk7XG4gIH1cblxuICBpZiAodXNlV3JhcFdvcmQpIHtcbiAgICByZXR1cm4gKDAsIF93cmFwV29yZDIuZGVmYXVsdCkodmFsdWUsIGNvbHVtbldpZHRoKS5sZW5ndGg7XG4gIH1cblxuICByZXR1cm4gX2xvZGFzaDIuZGVmYXVsdC5jZWlsKCgwLCBfc3RyaW5nV2lkdGgyLmRlZmF1bHQpKHZhbHVlKSAvIGNvbHVtbldpZHRoKTtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3RhYmxlL2Rpc3QvY2FsY3VsYXRlQ2VsbEhlaWdodC5qc1xuLy8gbW9kdWxlIGlkID0gODZcbi8vIG1vZHVsZSBjaHVua3MgPSAzIDQiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfbG9kYXNoID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbnZhciBfbG9kYXNoMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2xvZGFzaCk7XG5cbnZhciBfY2FsY3VsYXRlQ2VsbFdpZHRoSW5kZXggPSByZXF1aXJlKCcuL2NhbGN1bGF0ZUNlbGxXaWR0aEluZGV4Jyk7XG5cbnZhciBfY2FsY3VsYXRlQ2VsbFdpZHRoSW5kZXgyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY2FsY3VsYXRlQ2VsbFdpZHRoSW5kZXgpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG4vKipcbiAqIFByb2R1Y2VzIGFuIGFycmF5IG9mIHZhbHVlcyB0aGF0IGRlc2NyaWJlIHRoZSBsYXJnZXN0IHZhbHVlIGxlbmd0aCAod2lkdGgpIGluIGV2ZXJ5IGNvbHVtbi5cbiAqXG4gKiBAcGFyYW0ge0FycmF5W119IHJvd3NcbiAqIEByZXR1cm5zIHtudW1iZXJbXX1cbiAqL1xuZXhwb3J0cy5kZWZhdWx0ID0gcm93cyA9PiB7XG4gIGlmICghcm93c1swXSkge1xuICAgIHRocm93IG5ldyBFcnJvcignRGF0YXNldCBtdXN0IGhhdmUgYXQgbGVhc3Qgb25lIHJvdy4nKTtcbiAgfVxuXG4gIGNvbnN0IGNvbHVtbnMgPSBfbG9kYXNoMi5kZWZhdWx0LmZpbGwoQXJyYXkocm93c1swXS5sZW5ndGgpLCAwKTtcblxuICBfbG9kYXNoMi5kZWZhdWx0LmZvckVhY2gocm93cywgcm93ID0+IHtcbiAgICBjb25zdCBjb2x1bW5XaWR0aEluZGV4ID0gKDAsIF9jYWxjdWxhdGVDZWxsV2lkdGhJbmRleDIuZGVmYXVsdCkocm93KTtcblxuICAgIF9sb2Rhc2gyLmRlZmF1bHQuZm9yRWFjaChjb2x1bW5XaWR0aEluZGV4LCAodmFsdWVXaWR0aCwgaW5kZXgwKSA9PiB7XG4gICAgICBpZiAoY29sdW1uc1tpbmRleDBdIDwgdmFsdWVXaWR0aCkge1xuICAgICAgICBjb2x1bW5zW2luZGV4MF0gPSB2YWx1ZVdpZHRoO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICByZXR1cm4gY29sdW1ucztcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3RhYmxlL2Rpc3QvY2FsY3VsYXRlTWF4aW11bUNvbHVtbldpZHRoSW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDg3XG4vLyBtb2R1bGUgY2h1bmtzID0gMyA0IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2xvZGFzaCA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG52YXIgX2xvZGFzaDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9sb2Rhc2gpO1xuXG52YXIgX21ha2VTdHJlYW1Db25maWcgPSByZXF1aXJlKCcuL21ha2VTdHJlYW1Db25maWcnKTtcblxudmFyIF9tYWtlU3RyZWFtQ29uZmlnMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21ha2VTdHJlYW1Db25maWcpO1xuXG52YXIgX2RyYXdSb3cgPSByZXF1aXJlKCcuL2RyYXdSb3cnKTtcblxudmFyIF9kcmF3Um93MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RyYXdSb3cpO1xuXG52YXIgX2RyYXdCb3JkZXIgPSByZXF1aXJlKCcuL2RyYXdCb3JkZXInKTtcblxudmFyIF9zdHJpbmdpZnlUYWJsZURhdGEgPSByZXF1aXJlKCcuL3N0cmluZ2lmeVRhYmxlRGF0YScpO1xuXG52YXIgX3N0cmluZ2lmeVRhYmxlRGF0YTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zdHJpbmdpZnlUYWJsZURhdGEpO1xuXG52YXIgX3RydW5jYXRlVGFibGVEYXRhID0gcmVxdWlyZSgnLi90cnVuY2F0ZVRhYmxlRGF0YScpO1xuXG52YXIgX3RydW5jYXRlVGFibGVEYXRhMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3RydW5jYXRlVGFibGVEYXRhKTtcblxudmFyIF9tYXBEYXRhVXNpbmdSb3dIZWlnaHRJbmRleCA9IHJlcXVpcmUoJy4vbWFwRGF0YVVzaW5nUm93SGVpZ2h0SW5kZXgnKTtcblxudmFyIF9tYXBEYXRhVXNpbmdSb3dIZWlnaHRJbmRleDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9tYXBEYXRhVXNpbmdSb3dIZWlnaHRJbmRleCk7XG5cbnZhciBfYWxpZ25UYWJsZURhdGEgPSByZXF1aXJlKCcuL2FsaWduVGFibGVEYXRhJyk7XG5cbnZhciBfYWxpZ25UYWJsZURhdGEyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfYWxpZ25UYWJsZURhdGEpO1xuXG52YXIgX3BhZFRhYmxlRGF0YSA9IHJlcXVpcmUoJy4vcGFkVGFibGVEYXRhJyk7XG5cbnZhciBfcGFkVGFibGVEYXRhMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3BhZFRhYmxlRGF0YSk7XG5cbnZhciBfY2FsY3VsYXRlUm93SGVpZ2h0SW5kZXggPSByZXF1aXJlKCcuL2NhbGN1bGF0ZVJvd0hlaWdodEluZGV4Jyk7XG5cbnZhciBfY2FsY3VsYXRlUm93SGVpZ2h0SW5kZXgyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY2FsY3VsYXRlUm93SGVpZ2h0SW5kZXgpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG4vKipcbiAqIEBwYXJhbSB7QXJyYXl9IGRhdGFcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcbiAqIEByZXR1cm5zIHtBcnJheX1cbiAqL1xuY29uc3QgcHJlcGFyZURhdGEgPSAoZGF0YSwgY29uZmlnKSA9PiB7XG4gIGxldCByb3dzO1xuXG4gIHJvd3MgPSAoMCwgX3N0cmluZ2lmeVRhYmxlRGF0YTIuZGVmYXVsdCkoZGF0YSk7XG5cbiAgcm93cyA9ICgwLCBfdHJ1bmNhdGVUYWJsZURhdGEyLmRlZmF1bHQpKGRhdGEsIGNvbmZpZyk7XG5cbiAgY29uc3Qgcm93SGVpZ2h0SW5kZXggPSAoMCwgX2NhbGN1bGF0ZVJvd0hlaWdodEluZGV4Mi5kZWZhdWx0KShyb3dzLCBjb25maWcpO1xuXG4gIHJvd3MgPSAoMCwgX21hcERhdGFVc2luZ1Jvd0hlaWdodEluZGV4Mi5kZWZhdWx0KShyb3dzLCByb3dIZWlnaHRJbmRleCwgY29uZmlnKTtcbiAgcm93cyA9ICgwLCBfYWxpZ25UYWJsZURhdGEyLmRlZmF1bHQpKHJvd3MsIGNvbmZpZyk7XG4gIHJvd3MgPSAoMCwgX3BhZFRhYmxlRGF0YTIuZGVmYXVsdCkocm93cywgY29uZmlnKTtcblxuICByZXR1cm4gcm93cztcbn07XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmdbXX0gcm93XG4gKiBAcGFyYW0ge251bWJlcltdfSBjb2x1bW5XaWR0aEluZGV4XG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnXG4gKiBAcmV0dXJucyB7dW5kZWZpbmVkfVxuICovXG5jb25zdCBjcmVhdGUgPSAocm93LCBjb2x1bW5XaWR0aEluZGV4LCBjb25maWcpID0+IHtcbiAgY29uc3Qgcm93cyA9IHByZXBhcmVEYXRhKFtyb3ddLCBjb25maWcpO1xuXG4gIGNvbnN0IGJvZHkgPSBfbG9kYXNoMi5kZWZhdWx0Lm1hcChyb3dzLCBsaXRlcmFsUm93ID0+IHtcbiAgICByZXR1cm4gKDAsIF9kcmF3Um93Mi5kZWZhdWx0KShsaXRlcmFsUm93LCBjb25maWcuYm9yZGVyKTtcbiAgfSkuam9pbignJyk7XG5cbiAgbGV0IG91dHB1dDtcblxuICBvdXRwdXQgPSAnJztcblxuICBvdXRwdXQgKz0gKDAsIF9kcmF3Qm9yZGVyLmRyYXdCb3JkZXJUb3ApKGNvbHVtbldpZHRoSW5kZXgsIGNvbmZpZy5ib3JkZXIpO1xuICBvdXRwdXQgKz0gYm9keTtcbiAgb3V0cHV0ICs9ICgwLCBfZHJhd0JvcmRlci5kcmF3Qm9yZGVyQm90dG9tKShjb2x1bW5XaWR0aEluZGV4LCBjb25maWcuYm9yZGVyKTtcblxuICBvdXRwdXQgPSBfbG9kYXNoMi5kZWZhdWx0LnRyaW1FbmQob3V0cHV0KTtcblxuICBwcm9jZXNzLnN0ZG91dC53cml0ZShvdXRwdXQpO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSByb3dcbiAqIEBwYXJhbSB7bnVtYmVyW119IGNvbHVtbldpZHRoSW5kZXhcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcbiAqIEByZXR1cm5zIHt1bmRlZmluZWR9XG4gKi9cbmNvbnN0IGFwcGVuZCA9IChyb3csIGNvbHVtbldpZHRoSW5kZXgsIGNvbmZpZykgPT4ge1xuICBjb25zdCByb3dzID0gcHJlcGFyZURhdGEoW3Jvd10sIGNvbmZpZyk7XG5cbiAgY29uc3QgYm9keSA9IF9sb2Rhc2gyLmRlZmF1bHQubWFwKHJvd3MsIGxpdGVyYWxSb3cgPT4ge1xuICAgIHJldHVybiAoMCwgX2RyYXdSb3cyLmRlZmF1bHQpKGxpdGVyYWxSb3csIGNvbmZpZy5ib3JkZXIpO1xuICB9KS5qb2luKCcnKTtcblxuICBsZXQgb3V0cHV0O1xuXG4gIG91dHB1dCA9ICdcXHJcXHUwMDFCW0snO1xuXG4gIG91dHB1dCArPSAoMCwgX2RyYXdCb3JkZXIuZHJhd0JvcmRlckpvaW4pKGNvbHVtbldpZHRoSW5kZXgsIGNvbmZpZy5ib3JkZXIpO1xuICBvdXRwdXQgKz0gYm9keTtcbiAgb3V0cHV0ICs9ICgwLCBfZHJhd0JvcmRlci5kcmF3Qm9yZGVyQm90dG9tKShjb2x1bW5XaWR0aEluZGV4LCBjb25maWcuYm9yZGVyKTtcblxuICBvdXRwdXQgPSBfbG9kYXNoMi5kZWZhdWx0LnRyaW1FbmQob3V0cHV0KTtcblxuICBwcm9jZXNzLnN0ZG91dC53cml0ZShvdXRwdXQpO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge09iamVjdH0gdXNlckNvbmZpZ1xuICogQHJldHVybnMge09iamVjdH1cbiAqL1xuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoKSB7XG4gIGxldCB1c2VyQ29uZmlnID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcblxuICBjb25zdCBjb25maWcgPSAoMCwgX21ha2VTdHJlYW1Db25maWcyLmRlZmF1bHQpKHVzZXJDb25maWcpO1xuXG4gIGNvbnN0IGNvbHVtbldpZHRoSW5kZXggPSBfbG9kYXNoMi5kZWZhdWx0Lm1hcFZhbHVlcyhjb25maWcuY29sdW1ucywgY29sdW1uID0+IHtcbiAgICByZXR1cm4gY29sdW1uLndpZHRoICsgY29sdW1uLnBhZGRpbmdMZWZ0ICsgY29sdW1uLnBhZGRpbmdSaWdodDtcbiAgfSk7XG5cbiAgbGV0IGVtcHR5O1xuXG4gIGVtcHR5ID0gdHJ1ZTtcblxuICByZXR1cm4ge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nW119IHJvd1xuICAgICAqIEByZXR1cm5zIHt1bmRlZmluZWR9XG4gICAgICovXG4gICAgd3JpdGU6IHJvdyA9PiB7XG4gICAgICBpZiAocm93Lmxlbmd0aCAhPT0gY29uZmlnLmNvbHVtbkNvdW50KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignUm93IGNlbGwgY291bnQgZG9lcyBub3QgbWF0Y2ggdGhlIGNvbmZpZy5jb2x1bW5Db3VudC4nKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGVtcHR5KSB7XG4gICAgICAgIGVtcHR5ID0gZmFsc2U7XG5cbiAgICAgICAgcmV0dXJuIGNyZWF0ZShyb3csIGNvbHVtbldpZHRoSW5kZXgsIGNvbmZpZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gYXBwZW5kKHJvdywgY29sdW1uV2lkdGhJbmRleCwgY29uZmlnKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi90YWJsZS9kaXN0L2NyZWF0ZVN0cmVhbS5qc1xuLy8gbW9kdWxlIGlkID0gODhcbi8vIG1vZHVsZSBjaHVua3MgPSAzIDQiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfbG9kYXNoID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbnZhciBfbG9kYXNoMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2xvZGFzaCk7XG5cbnZhciBfZHJhd0JvcmRlciA9IHJlcXVpcmUoJy4vZHJhd0JvcmRlcicpO1xuXG52YXIgX2RyYXdSb3cgPSByZXF1aXJlKCcuL2RyYXdSb3cnKTtcblxudmFyIF9kcmF3Um93MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RyYXdSb3cpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG4vKipcbiAqIEBwYXJhbSB7QXJyYXl9IHJvd3NcbiAqIEBwYXJhbSB7T2JqZWN0fSBib3JkZXJcbiAqIEBwYXJhbSB7QXJyYXl9IGNvbHVtblNpemVJbmRleFxuICogQHBhcmFtIHtBcnJheX0gcm93U3BhbkluZGV4XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBkcmF3SG9yaXpvbnRhbExpbmVcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmV4cG9ydHMuZGVmYXVsdCA9IChyb3dzLCBib3JkZXIsIGNvbHVtblNpemVJbmRleCwgcm93U3BhbkluZGV4LCBkcmF3SG9yaXpvbnRhbExpbmUpID0+IHtcbiAgbGV0IG91dHB1dDtcbiAgbGV0IHJlYWxSb3dJbmRleDtcbiAgbGV0IHJvd0hlaWdodDtcblxuICBjb25zdCByb3dDb3VudCA9IHJvd3MubGVuZ3RoO1xuXG4gIHJlYWxSb3dJbmRleCA9IDA7XG5cbiAgb3V0cHV0ID0gJyc7XG5cbiAgaWYgKGRyYXdIb3Jpem9udGFsTGluZShyZWFsUm93SW5kZXgsIHJvd0NvdW50KSkge1xuICAgIG91dHB1dCArPSAoMCwgX2RyYXdCb3JkZXIuZHJhd0JvcmRlclRvcCkoY29sdW1uU2l6ZUluZGV4LCBib3JkZXIpO1xuICB9XG5cbiAgX2xvZGFzaDIuZGVmYXVsdC5mb3JFYWNoKHJvd3MsIChyb3csIGluZGV4MCkgPT4ge1xuICAgIG91dHB1dCArPSAoMCwgX2RyYXdSb3cyLmRlZmF1bHQpKHJvdywgYm9yZGVyKTtcblxuICAgIGlmICghcm93SGVpZ2h0KSB7XG4gICAgICByb3dIZWlnaHQgPSByb3dTcGFuSW5kZXhbcmVhbFJvd0luZGV4XTtcblxuICAgICAgcmVhbFJvd0luZGV4Kys7XG4gICAgfVxuXG4gICAgcm93SGVpZ2h0LS07XG5cbiAgICBpZiAocm93SGVpZ2h0ID09PSAwICYmIGluZGV4MCAhPT0gcm93Q291bnQgLSAxICYmIGRyYXdIb3Jpem9udGFsTGluZShyZWFsUm93SW5kZXgsIHJvd0NvdW50KSkge1xuICAgICAgb3V0cHV0ICs9ICgwLCBfZHJhd0JvcmRlci5kcmF3Qm9yZGVySm9pbikoY29sdW1uU2l6ZUluZGV4LCBib3JkZXIpO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKGRyYXdIb3Jpem9udGFsTGluZShyZWFsUm93SW5kZXgsIHJvd0NvdW50KSkge1xuICAgIG91dHB1dCArPSAoMCwgX2RyYXdCb3JkZXIuZHJhd0JvcmRlckJvdHRvbSkoY29sdW1uU2l6ZUluZGV4LCBib3JkZXIpO1xuICB9XG5cbiAgcmV0dXJuIG91dHB1dDtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3RhYmxlL2Rpc3QvZHJhd1RhYmxlLmpzXG4vLyBtb2R1bGUgaWQgPSA4OVxuLy8gbW9kdWxlIGNodW5rcyA9IDMgNCIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZ2V0Qm9yZGVyQ2hhcmFjdGVycyA9IGV4cG9ydHMuY3JlYXRlU3RyZWFtID0gZXhwb3J0cy50YWJsZSA9IHVuZGVmaW5lZDtcblxudmFyIF90YWJsZSA9IHJlcXVpcmUoJy4vdGFibGUnKTtcblxudmFyIF90YWJsZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90YWJsZSk7XG5cbnZhciBfY3JlYXRlU3RyZWFtID0gcmVxdWlyZSgnLi9jcmVhdGVTdHJlYW0nKTtcblxudmFyIF9jcmVhdGVTdHJlYW0yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY3JlYXRlU3RyZWFtKTtcblxudmFyIF9nZXRCb3JkZXJDaGFyYWN0ZXJzID0gcmVxdWlyZSgnLi9nZXRCb3JkZXJDaGFyYWN0ZXJzJyk7XG5cbnZhciBfZ2V0Qm9yZGVyQ2hhcmFjdGVyczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9nZXRCb3JkZXJDaGFyYWN0ZXJzKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZXhwb3J0cy50YWJsZSA9IF90YWJsZTIuZGVmYXVsdDtcbmV4cG9ydHMuY3JlYXRlU3RyZWFtID0gX2NyZWF0ZVN0cmVhbTIuZGVmYXVsdDtcbmV4cG9ydHMuZ2V0Qm9yZGVyQ2hhcmFjdGVycyA9IF9nZXRCb3JkZXJDaGFyYWN0ZXJzMi5kZWZhdWx0O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi90YWJsZS9kaXN0L2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA5MFxuLy8gbW9kdWxlIGNodW5rcyA9IDMgNCIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9sb2Rhc2ggPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxudmFyIF9sb2Rhc2gyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbG9kYXNoKTtcblxudmFyIF9nZXRCb3JkZXJDaGFyYWN0ZXJzID0gcmVxdWlyZSgnLi9nZXRCb3JkZXJDaGFyYWN0ZXJzJyk7XG5cbnZhciBfZ2V0Qm9yZGVyQ2hhcmFjdGVyczIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9nZXRCb3JkZXJDaGFyYWN0ZXJzKTtcblxudmFyIF92YWxpZGF0ZUNvbmZpZyA9IHJlcXVpcmUoJy4vdmFsaWRhdGVDb25maWcnKTtcblxudmFyIF92YWxpZGF0ZUNvbmZpZzIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF92YWxpZGF0ZUNvbmZpZyk7XG5cbnZhciBfY2FsY3VsYXRlTWF4aW11bUNvbHVtbldpZHRoSW5kZXggPSByZXF1aXJlKCcuL2NhbGN1bGF0ZU1heGltdW1Db2x1bW5XaWR0aEluZGV4Jyk7XG5cbnZhciBfY2FsY3VsYXRlTWF4aW11bUNvbHVtbldpZHRoSW5kZXgyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY2FsY3VsYXRlTWF4aW11bUNvbHVtbldpZHRoSW5kZXgpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG4vKipcbiAqIE1lcmdlcyB1c2VyIHByb3ZpZGVkIGJvcmRlciBjaGFyYWN0ZXJzIHdpdGggdGhlIGRlZmF1bHQgYm9yZGVyIChcImhvbmV5d2VsbFwiKSBjaGFyYWN0ZXJzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBib3JkZXJcbiAqIEByZXR1cm5zIHtPYmplY3R9XG4gKi9cbmNvbnN0IG1ha2VCb3JkZXIgPSBmdW5jdGlvbiBtYWtlQm9yZGVyKCkge1xuICBsZXQgYm9yZGVyID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcblxuICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgKDAsIF9nZXRCb3JkZXJDaGFyYWN0ZXJzMi5kZWZhdWx0KSgnaG9uZXl3ZWxsJyksIGJvcmRlcik7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjb25maWd1cmF0aW9uIGZvciBldmVyeSBjb2x1bW4gdXNpbmcgZGVmYXVsdFxuICogdmFsdWVzIGZvciB0aGUgbWlzc2luZyBjb25maWd1cmF0aW9uIHByb3BlcnRpZXMuXG4gKlxuICogQHBhcmFtIHtBcnJheVtdfSByb3dzXG4gKiBAcGFyYW0ge09iamVjdH0gY29sdW1uc1xuICogQHBhcmFtIHtPYmplY3R9IGNvbHVtbkRlZmF1bHRcbiAqIEByZXR1cm5zIHtPYmplY3R9XG4gKi9cbmNvbnN0IG1ha2VDb2x1bW5zID0gZnVuY3Rpb24gbWFrZUNvbHVtbnMocm93cykge1xuICBsZXQgY29sdW1ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG4gIGxldCBjb2x1bW5EZWZhdWx0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiB7fTtcblxuICBjb25zdCBtYXhpbXVtQ29sdW1uV2lkdGhJbmRleCA9ICgwLCBfY2FsY3VsYXRlTWF4aW11bUNvbHVtbldpZHRoSW5kZXgyLmRlZmF1bHQpKHJvd3MpO1xuXG4gIF9sb2Rhc2gyLmRlZmF1bHQudGltZXMocm93c1swXS5sZW5ndGgsIGluZGV4ID0+IHtcbiAgICBpZiAoX2xvZGFzaDIuZGVmYXVsdC5pc1VuZGVmaW5lZChjb2x1bW5zW2luZGV4XSkpIHtcbiAgICAgIGNvbHVtbnNbaW5kZXhdID0ge307XG4gICAgfVxuXG4gICAgY29sdW1uc1tpbmRleF0gPSBfbG9kYXNoMi5kZWZhdWx0LmFzc2lnbih7XG4gICAgICBhbGlnbm1lbnQ6ICdsZWZ0JyxcbiAgICAgIHBhZGRpbmdMZWZ0OiAxLFxuICAgICAgcGFkZGluZ1JpZ2h0OiAxLFxuICAgICAgdHJ1bmNhdGU6IEluZmluaXR5LFxuICAgICAgd2lkdGg6IG1heGltdW1Db2x1bW5XaWR0aEluZGV4W2luZGV4XSxcbiAgICAgIHdyYXBXb3JkOiBmYWxzZVxuICAgIH0sIGNvbHVtbkRlZmF1bHQsIGNvbHVtbnNbaW5kZXhdKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGNvbHVtbnM7XG59O1xuXG4vKipcbiAqIE1ha2VzIGEgbmV3IGNvbmZpZ3VyYXRpb24gb2JqZWN0IG91dCBvZiB0aGUgdXNlckNvbmZpZyBvYmplY3RcbiAqIHVzaW5nIGRlZmF1bHQgdmFsdWVzIGZvciB0aGUgbWlzc2luZyBjb25maWd1cmF0aW9uIHByb3BlcnRpZXMuXG4gKlxuICogQHBhcmFtIHtBcnJheVtdfSByb3dzXG4gKiBAcGFyYW0ge09iamVjdH0gdXNlckNvbmZpZ1xuICogQHJldHVybnMge09iamVjdH1cbiAqL1xuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAocm93cykge1xuICBsZXQgdXNlckNvbmZpZyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cbiAgKDAsIF92YWxpZGF0ZUNvbmZpZzIuZGVmYXVsdCkoJ2NvbmZpZy5qc29uJywgdXNlckNvbmZpZyk7XG5cbiAgY29uc3QgY29uZmlnID0gX2xvZGFzaDIuZGVmYXVsdC5jbG9uZURlZXAodXNlckNvbmZpZyk7XG5cbiAgY29uZmlnLmJvcmRlciA9IG1ha2VCb3JkZXIoY29uZmlnLmJvcmRlcik7XG4gIGNvbmZpZy5jb2x1bW5zID0gbWFrZUNvbHVtbnMocm93cywgY29uZmlnLmNvbHVtbnMsIGNvbmZpZy5jb2x1bW5EZWZhdWx0KTtcblxuICBpZiAoIWNvbmZpZy5kcmF3SG9yaXpvbnRhbExpbmUpIHtcbiAgICAvKipcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICAgICAqL1xuICAgIGNvbmZpZy5kcmF3SG9yaXpvbnRhbExpbmUgPSAoKSA9PiB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIGNvbmZpZztcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3RhYmxlL2Rpc3QvbWFrZUNvbmZpZy5qc1xuLy8gbW9kdWxlIGlkID0gOTFcbi8vIG1vZHVsZSBjaHVua3MgPSAzIDQiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfbG9kYXNoID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbnZhciBfbG9kYXNoMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2xvZGFzaCk7XG5cbnZhciBfZ2V0Qm9yZGVyQ2hhcmFjdGVycyA9IHJlcXVpcmUoJy4vZ2V0Qm9yZGVyQ2hhcmFjdGVycycpO1xuXG52YXIgX2dldEJvcmRlckNoYXJhY3RlcnMyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZ2V0Qm9yZGVyQ2hhcmFjdGVycyk7XG5cbnZhciBfdmFsaWRhdGVDb25maWcgPSByZXF1aXJlKCcuL3ZhbGlkYXRlQ29uZmlnJyk7XG5cbnZhciBfdmFsaWRhdGVDb25maWcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdmFsaWRhdGVDb25maWcpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG4vKipcbiAqIE1lcmdlcyB1c2VyIHByb3ZpZGVkIGJvcmRlciBjaGFyYWN0ZXJzIHdpdGggdGhlIGRlZmF1bHQgYm9yZGVyIChcImhvbmV5d2VsbFwiKSBjaGFyYWN0ZXJzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBib3JkZXJcbiAqIEByZXR1cm5zIHtPYmplY3R9XG4gKi9cbmNvbnN0IG1ha2VCb3JkZXIgPSBmdW5jdGlvbiBtYWtlQm9yZGVyKCkge1xuICBsZXQgYm9yZGVyID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcblxuICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgKDAsIF9nZXRCb3JkZXJDaGFyYWN0ZXJzMi5kZWZhdWx0KSgnaG9uZXl3ZWxsJyksIGJvcmRlcik7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjb25maWd1cmF0aW9uIGZvciBldmVyeSBjb2x1bW4gdXNpbmcgZGVmYXVsdFxuICogdmFsdWVzIGZvciB0aGUgbWlzc2luZyBjb25maWd1cmF0aW9uIHByb3BlcnRpZXMuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IGNvbHVtbkNvdW50XG4gKiBAcGFyYW0ge09iamVjdH0gY29sdW1uc1xuICogQHBhcmFtIHtPYmplY3R9IGNvbHVtbkRlZmF1bHRcbiAqIEByZXR1cm5zIHtPYmplY3R9XG4gKi9cbmNvbnN0IG1ha2VDb2x1bW5zID0gZnVuY3Rpb24gbWFrZUNvbHVtbnMoY29sdW1uQ291bnQpIHtcbiAgbGV0IGNvbHVtbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICBsZXQgY29sdW1uRGVmYXVsdCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDoge307XG5cbiAgX2xvZGFzaDIuZGVmYXVsdC50aW1lcyhjb2x1bW5Db3VudCwgaW5kZXggPT4ge1xuICAgIGlmIChfbG9kYXNoMi5kZWZhdWx0LmlzVW5kZWZpbmVkKGNvbHVtbnNbaW5kZXhdKSkge1xuICAgICAgY29sdW1uc1tpbmRleF0gPSB7fTtcbiAgICB9XG5cbiAgICBjb2x1bW5zW2luZGV4XSA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgYWxpZ25tZW50OiAnbGVmdCcsXG4gICAgICBwYWRkaW5nTGVmdDogMSxcbiAgICAgIHBhZGRpbmdSaWdodDogMSxcbiAgICAgIHRydW5jYXRlOiBJbmZpbml0eSxcbiAgICAgIHdyYXBXb3JkOiBmYWxzZVxuICAgIH0sIGNvbHVtbkRlZmF1bHQsIGNvbHVtbnNbaW5kZXhdKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGNvbHVtbnM7XG59O1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IGNvbHVtbkNvbmZpZ1xuICogQHByb3BlcnR5IHtzdHJpbmd9IGFsaWdubWVudFxuICogQHByb3BlcnR5IHtudW1iZXJ9IHdpZHRoXG4gKiBAcHJvcGVydHkge251bWJlcn0gdHJ1bmNhdGVcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBwYWRkaW5nTGVmdFxuICogQHByb3BlcnR5IHtudW1iZXJ9IHBhZGRpbmdSaWdodFxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gc3RyZWFtQ29uZmlnXG4gKiBAcHJvcGVydHkge2NvbHVtbkNvbmZpZ30gY29sdW1uRGVmYXVsdFxuICogQHByb3BlcnR5IHtPYmplY3R9IGJvcmRlclxuICogQHByb3BlcnR5IHtjb2x1bW5Db25maWdbXX1cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBjb2x1bW5Db3VudCBOdW1iZXIgb2YgY29sdW1ucyBpbiB0aGUgdGFibGUgKHJlcXVpcmVkKS5cbiAqL1xuXG4vKipcbiAqIE1ha2VzIGEgbmV3IGNvbmZpZ3VyYXRpb24gb2JqZWN0IG91dCBvZiB0aGUgdXNlckNvbmZpZyBvYmplY3RcbiAqIHVzaW5nIGRlZmF1bHQgdmFsdWVzIGZvciB0aGUgbWlzc2luZyBjb25maWd1cmF0aW9uIHByb3BlcnRpZXMuXG4gKlxuICogQHBhcmFtIHtzdHJlYW1Db25maWd9IHVzZXJDb25maWdcbiAqIEByZXR1cm5zIHtPYmplY3R9XG4gKi9cblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKCkge1xuICBsZXQgdXNlckNvbmZpZyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG5cbiAgKDAsIF92YWxpZGF0ZUNvbmZpZzIuZGVmYXVsdCkoJ3N0cmVhbUNvbmZpZy5qc29uJywgdXNlckNvbmZpZyk7XG5cbiAgY29uc3QgY29uZmlnID0gX2xvZGFzaDIuZGVmYXVsdC5jbG9uZURlZXAodXNlckNvbmZpZyk7XG5cbiAgaWYgKCFjb25maWcuY29sdW1uRGVmYXVsdCB8fCAhY29uZmlnLmNvbHVtbkRlZmF1bHQud2lkdGgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ011c3QgcHJvdmlkZSBjb25maWcuY29sdW1uRGVmYXVsdC53aWR0aCB3aGVuIGNyZWF0aW5nIGEgc3RyZWFtLicpO1xuICB9XG5cbiAgaWYgKCFjb25maWcuY29sdW1uQ291bnQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ011c3QgcHJvdmlkZSBjb25maWcuY29sdW1uQ291bnQuJyk7XG4gIH1cblxuICBjb25maWcuYm9yZGVyID0gbWFrZUJvcmRlcihjb25maWcuYm9yZGVyKTtcbiAgY29uZmlnLmNvbHVtbnMgPSBtYWtlQ29sdW1ucyhjb25maWcuY29sdW1uQ291bnQsIGNvbmZpZy5jb2x1bW5zLCBjb25maWcuY29sdW1uRGVmYXVsdCk7XG5cbiAgcmV0dXJuIGNvbmZpZztcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3RhYmxlL2Rpc3QvbWFrZVN0cmVhbUNvbmZpZy5qc1xuLy8gbW9kdWxlIGlkID0gOTJcbi8vIG1vZHVsZSBjaHVua3MgPSAzIDQiLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfZHJhd1RhYmxlID0gcmVxdWlyZSgnLi9kcmF3VGFibGUnKTtcblxudmFyIF9kcmF3VGFibGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZHJhd1RhYmxlKTtcblxudmFyIF9jYWxjdWxhdGVDZWxsV2lkdGhJbmRleCA9IHJlcXVpcmUoJy4vY2FsY3VsYXRlQ2VsbFdpZHRoSW5kZXgnKTtcblxudmFyIF9jYWxjdWxhdGVDZWxsV2lkdGhJbmRleDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jYWxjdWxhdGVDZWxsV2lkdGhJbmRleCk7XG5cbnZhciBfbWFrZUNvbmZpZyA9IHJlcXVpcmUoJy4vbWFrZUNvbmZpZycpO1xuXG52YXIgX21ha2VDb25maWcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbWFrZUNvbmZpZyk7XG5cbnZhciBfY2FsY3VsYXRlUm93SGVpZ2h0SW5kZXggPSByZXF1aXJlKCcuL2NhbGN1bGF0ZVJvd0hlaWdodEluZGV4Jyk7XG5cbnZhciBfY2FsY3VsYXRlUm93SGVpZ2h0SW5kZXgyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY2FsY3VsYXRlUm93SGVpZ2h0SW5kZXgpO1xuXG52YXIgX21hcERhdGFVc2luZ1Jvd0hlaWdodEluZGV4ID0gcmVxdWlyZSgnLi9tYXBEYXRhVXNpbmdSb3dIZWlnaHRJbmRleCcpO1xuXG52YXIgX21hcERhdGFVc2luZ1Jvd0hlaWdodEluZGV4MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX21hcERhdGFVc2luZ1Jvd0hlaWdodEluZGV4KTtcblxudmFyIF9hbGlnblRhYmxlRGF0YSA9IHJlcXVpcmUoJy4vYWxpZ25UYWJsZURhdGEnKTtcblxudmFyIF9hbGlnblRhYmxlRGF0YTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9hbGlnblRhYmxlRGF0YSk7XG5cbnZhciBfcGFkVGFibGVEYXRhID0gcmVxdWlyZSgnLi9wYWRUYWJsZURhdGEnKTtcblxudmFyIF9wYWRUYWJsZURhdGEyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfcGFkVGFibGVEYXRhKTtcblxudmFyIF92YWxpZGF0ZVRhYmxlRGF0YSA9IHJlcXVpcmUoJy4vdmFsaWRhdGVUYWJsZURhdGEnKTtcblxudmFyIF92YWxpZGF0ZVRhYmxlRGF0YTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF92YWxpZGF0ZVRhYmxlRGF0YSk7XG5cbnZhciBfc3RyaW5naWZ5VGFibGVEYXRhID0gcmVxdWlyZSgnLi9zdHJpbmdpZnlUYWJsZURhdGEnKTtcblxudmFyIF9zdHJpbmdpZnlUYWJsZURhdGEyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3RyaW5naWZ5VGFibGVEYXRhKTtcblxudmFyIF90cnVuY2F0ZVRhYmxlRGF0YSA9IHJlcXVpcmUoJy4vdHJ1bmNhdGVUYWJsZURhdGEnKTtcblxudmFyIF90cnVuY2F0ZVRhYmxlRGF0YTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90cnVuY2F0ZVRhYmxlRGF0YSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbi8qKlxuICogQHR5cGVkZWYge3N0cmluZ30gdGFibGV+Y2VsbFxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge3RhYmxlfmNlbGxbXX0gdGFibGV+cm93XG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSB0YWJsZX5jb2x1bW5zXG4gKiBAcHJvcGVydHkge3N0cmluZ30gYWxpZ25tZW50IENlbGwgY29udGVudCBhbGlnbm1lbnQgKGVudW06IGxlZnQsIGNlbnRlciwgcmlnaHQpIChkZWZhdWx0OiBsZWZ0KS5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB3aWR0aCBDb2x1bW4gd2lkdGggKGRlZmF1bHQ6IGF1dG8pLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IHRydW5jYXRlIE51bWJlciBvZiBjaGFyYWN0ZXJzIGFyZSB3aGljaCB0aGUgY29udGVudCB3aWxsIGJlIHRydW5jYXRlZCAoZGVmYXVsdDogSW5maW5pdHkpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IHBhZGRpbmdMZWZ0IENlbGwgY29udGVudCBwYWRkaW5nIHdpZHRoIGxlZnQgKGRlZmF1bHQ6IDEpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IHBhZGRpbmdSaWdodCBDZWxsIGNvbnRlbnQgcGFkZGluZyB3aWR0aCByaWdodCAoZGVmYXVsdDogMSkuXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSB0YWJsZX5ib3JkZXJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0b3BCb2R5XG4gKiBAcHJvcGVydHkge3N0cmluZ30gdG9wSm9pblxuICogQHByb3BlcnR5IHtzdHJpbmd9IHRvcExlZnRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0b3BSaWdodFxuICogQHByb3BlcnR5IHtzdHJpbmd9IGJvdHRvbUJvZHlcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBib3R0b21Kb2luXG4gKiBAcHJvcGVydHkge3N0cmluZ30gYm90dG9tTGVmdFxuICogQHByb3BlcnR5IHtzdHJpbmd9IGJvdHRvbVJpZ2h0XG4gKiBAcHJvcGVydHkge3N0cmluZ30gYm9keUxlZnRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBib2R5UmlnaHRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBib2R5Sm9pblxuICogQHByb3BlcnR5IHtzdHJpbmd9IGpvaW5Cb2R5XG4gKiBAcHJvcGVydHkge3N0cmluZ30gam9pbkxlZnRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBqb2luUmlnaHRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBqb2luSm9pblxuICovXG5cbi8qKlxuICogVXNlZCB0byB0ZWxsIHdoZXRoZXIgdG8gZHJhdyBhIGhvcml6b250YWwgbGluZS5cbiAqIFRoaXMgY2FsbGJhY2sgaXMgY2FsbGVkIGZvciBlYWNoIG5vbi1jb250ZW50IGxpbmUgb2YgdGhlIHRhYmxlLlxuICogVGhlIGRlZmF1bHQgYmVoYXZpb3IgaXMgdG8gYWx3YXlzIHJldHVybiB0cnVlLlxuICpcbiAqIEB0eXBlZGVmIHtGdW5jdGlvbn0gZHJhd0hvcml6b250YWxMaW5lXG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXhcbiAqIEBwYXJhbSB7bnVtYmVyfSBzaXplXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IHRhYmxlfmNvbmZpZ1xuICogQHByb3BlcnR5IHt0YWJsZX5ib3JkZXJ9IGJvcmRlclxuICogQHByb3BlcnR5IHt0YWJsZX5jb2x1bW5zW119IGNvbHVtbnMgQ29sdW1uIHNwZWNpZmljIGNvbmZpZ3VyYXRpb24uXG4gKiBAcHJvcGVydHkge3RhYmxlfmNvbHVtbnN9IGNvbHVtbkRlZmF1bHQgRGVmYXVsdCB2YWx1ZXMgZm9yIGFsbCBjb2x1bW5zLiBDb2x1bW4gc3BlY2lmaWMgc2V0dGluZ3Mgb3ZlcndyaXRlIHRoZSBkZWZhdWx0IHZhbHVlcy5cbiAqIEBwcm9wZXJ0eSB7dGFibGV+ZHJhd0hvcml6b250YWxMaW5lfSBkcmF3SG9yaXpvbnRhbExpbmVcbiAqL1xuXG4vKipcbiAqIEdlbmVyYXRlcyBhIHRleHQgdGFibGUuXG4gKlxuICogQHBhcmFtIHt0YWJsZX5yb3dbXX0gZGF0YVxuICogQHBhcmFtIHt0YWJsZX5jb25maWd9IHVzZXJDb25maWdcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gIGxldCB1c2VyQ29uZmlnID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuICBsZXQgcm93cztcblxuICAoMCwgX3ZhbGlkYXRlVGFibGVEYXRhMi5kZWZhdWx0KShkYXRhKTtcblxuICByb3dzID0gKDAsIF9zdHJpbmdpZnlUYWJsZURhdGEyLmRlZmF1bHQpKGRhdGEpO1xuXG4gIGNvbnN0IGNvbmZpZyA9ICgwLCBfbWFrZUNvbmZpZzIuZGVmYXVsdCkocm93cywgdXNlckNvbmZpZyk7XG5cbiAgcm93cyA9ICgwLCBfdHJ1bmNhdGVUYWJsZURhdGEyLmRlZmF1bHQpKGRhdGEsIGNvbmZpZyk7XG5cbiAgY29uc3Qgcm93SGVpZ2h0SW5kZXggPSAoMCwgX2NhbGN1bGF0ZVJvd0hlaWdodEluZGV4Mi5kZWZhdWx0KShyb3dzLCBjb25maWcpO1xuXG4gIHJvd3MgPSAoMCwgX21hcERhdGFVc2luZ1Jvd0hlaWdodEluZGV4Mi5kZWZhdWx0KShyb3dzLCByb3dIZWlnaHRJbmRleCwgY29uZmlnKTtcbiAgcm93cyA9ICgwLCBfYWxpZ25UYWJsZURhdGEyLmRlZmF1bHQpKHJvd3MsIGNvbmZpZyk7XG4gIHJvd3MgPSAoMCwgX3BhZFRhYmxlRGF0YTIuZGVmYXVsdCkocm93cywgY29uZmlnKTtcblxuICBjb25zdCBjZWxsV2lkdGhJbmRleCA9ICgwLCBfY2FsY3VsYXRlQ2VsbFdpZHRoSW5kZXgyLmRlZmF1bHQpKHJvd3NbMF0pO1xuXG4gIHJldHVybiAoMCwgX2RyYXdUYWJsZTIuZGVmYXVsdCkocm93cywgY29uZmlnLmJvcmRlciwgY2VsbFdpZHRoSW5kZXgsIHJvd0hlaWdodEluZGV4LCBjb25maWcuZHJhd0hvcml6b250YWxMaW5lKTtcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3RhYmxlL2Rpc3QvdGFibGUuanNcbi8vIG1vZHVsZSBpZCA9IDkzXG4vLyBtb2R1bGUgY2h1bmtzID0gMyA0IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG4vKipcbiAqIEB0eXBlZGVmIHtzdHJpbmd9IGNlbGxcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtjZWxsW119IHZhbGlkYXRlRGF0YX5jb2x1bW5cbiAqL1xuXG4vKipcbiAqIEBwYXJhbSB7Y29sdW1uW119IHJvd3NcbiAqIEByZXR1cm5zIHt1bmRlZmluZWR9XG4gKi9cbmV4cG9ydHMuZGVmYXVsdCA9IHJvd3MgPT4ge1xuICBpZiAoIUFycmF5LmlzQXJyYXkocm93cykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUYWJsZSBkYXRhIG11c3QgYmUgYW4gYXJyYXkuJyk7XG4gIH1cblxuICBpZiAocm93cy5sZW5ndGggPT09IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RhYmxlIG11c3QgZGVmaW5lIGF0IGxlYXN0IG9uZSByb3cuJyk7XG4gIH1cblxuICBpZiAocm93c1swXS5sZW5ndGggPT09IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RhYmxlIG11c3QgZGVmaW5lIGF0IGxlYXN0IG9uZSBjb2x1bW4uJyk7XG4gIH1cblxuICBjb25zdCBjb2x1bW5OdW1iZXIgPSByb3dzWzBdLmxlbmd0aDtcblxuICBmb3IgKGNvbnN0IGNlbGxzIG9mIHJvd3MpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoY2VsbHMpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUYWJsZSByb3cgZGF0YSBtdXN0IGJlIGFuIGFycmF5LicpO1xuICAgIH1cblxuICAgIGlmIChjZWxscy5sZW5ndGggIT09IGNvbHVtbk51bWJlcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUYWJsZSBtdXN0IGhhdmUgYSBjb25zaXN0ZW50IG51bWJlciBvZiBjZWxscy4nKTtcbiAgICB9XG5cbiAgICAvLyBAdG9kbyBNYWtlIGFuIGV4Y2VwdGlvbiBmb3IgbmV3bGluZSBjaGFyYWN0ZXJzLlxuICAgIC8vIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2dhanVzL3RhYmxlL2lzc3Vlcy85XG4gICAgZm9yIChjb25zdCBjZWxsIG9mIGNlbGxzKSB7XG4gICAgICBpZiAoL1tcXHUwMDAxLVxcdTAwMUFdLy50ZXN0KGNlbGwpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGFibGUgZGF0YSBtdXN0IG5vdCBjb250YWluIGNvbnRyb2wgY2hhcmFjdGVycy4nKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3RhYmxlL2Rpc3QvdmFsaWRhdGVUYWJsZURhdGEuanNcbi8vIG1vZHVsZSBpZCA9IDk0XG4vLyBtb2R1bGUgY2h1bmtzID0gMyA0IiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2xvZGFzaCA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG52YXIgX2xvZGFzaDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9sb2Rhc2gpO1xuXG52YXIgX3NsaWNlQW5zaSA9IHJlcXVpcmUoJ3NsaWNlLWFuc2knKTtcblxudmFyIF9zbGljZUFuc2kyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc2xpY2VBbnNpKTtcblxudmFyIF9zdHJpbmdXaWR0aCA9IHJlcXVpcmUoJ3N0cmluZy13aWR0aCcpO1xuXG52YXIgX3N0cmluZ1dpZHRoMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N0cmluZ1dpZHRoKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHN0cmluZ3Mgc3BsaXQgaW50byBncm91cHMgdGhlIGxlbmd0aCBvZiBzaXplLlxuICogVGhpcyBmdW5jdGlvbiB3b3JrcyB3aXRoIHN0cmluZ3MgdGhhdCBjb250YWluIEFTQ0lJIGNoYXJhY3RlcnMuXG4gKlxuICogd3JhcFRleHQgaXMgZGlmZmVyZW50IGZyb20gd291bGQtYmUgXCJjaHVua1wiIGltcGxlbWVudGF0aW9uXG4gKiBpbiB0aGF0IHdoaXRlc3BhY2UgY2hhcmFjdGVycyB0aGF0IG9jY3VyIG9uIGEgY2h1bmsgc2l6ZSBsaW1pdCBhcmUgdHJpbW1lZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3ViamVjdFxuICogQHBhcmFtIHtudW1iZXJ9IHNpemVcbiAqIEByZXR1cm5zIHtBcnJheX1cbiAqL1xuZXhwb3J0cy5kZWZhdWx0ID0gKHN1YmplY3QsIHNpemUpID0+IHtcbiAgbGV0IHN1YmplY3RTbGljZTtcblxuICBzdWJqZWN0U2xpY2UgPSBzdWJqZWN0O1xuXG4gIGNvbnN0IGNodW5rcyA9IFtdO1xuXG4gIGRvIHtcbiAgICBjaHVua3MucHVzaCgoMCwgX3NsaWNlQW5zaTIuZGVmYXVsdCkoc3ViamVjdFNsaWNlLCAwLCBzaXplKSk7XG5cbiAgICBzdWJqZWN0U2xpY2UgPSBfbG9kYXNoMi5kZWZhdWx0LnRyaW0oKDAsIF9zbGljZUFuc2kyLmRlZmF1bHQpKHN1YmplY3RTbGljZSwgc2l6ZSkpO1xuICB9IHdoaWxlICgoMCwgX3N0cmluZ1dpZHRoMi5kZWZhdWx0KShzdWJqZWN0U2xpY2UpKTtcblxuICByZXR1cm4gY2h1bmtzO1xufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vdGFibGUvZGlzdC93cmFwU3RyaW5nLmpzXG4vLyBtb2R1bGUgaWQgPSA5NVxuLy8gbW9kdWxlIGNodW5rcyA9IDMgNCIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCdmYXN0LWRlZXAtZXF1YWwnKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi90YWJsZS9+L2Fqdi9saWIvY29tcGlsZS9lcXVhbC5qc1xuLy8gbW9kdWxlIGlkID0gOTZcbi8vIG1vZHVsZSBjaHVua3MgPSAzIDQiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gKCkgPT4ge1xuXHRjb25zdCBwYXR0ZXJuID0gW1xuXHRcdCdbXFxcXHUwMDFCXFxcXHUwMDlCXVtbXFxcXF0oKSM7P10qKD86KD86KD86W2EtekEtWlxcXFxkXSooPzo7W2EtekEtWlxcXFxkXSopKik/XFxcXHUwMDA3KScsXG5cdFx0Jyg/Oig/OlxcXFxkezEsNH0oPzo7XFxcXGR7MCw0fSkqKT9bXFxcXGRBLVBSWmNmLW50cXJ5PT48fl0pKSdcblx0XS5qb2luKCd8Jyk7XG5cblx0cmV0dXJuIG5ldyBSZWdFeHAocGF0dGVybiwgJ2cnKTtcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vdGFibGUvfi9hbnNpLXJlZ2V4L2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA5N1xuLy8gbW9kdWxlIGNodW5rcyA9IDMgNCIsIid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIHlvZGEgKi9cbm1vZHVsZS5leHBvcnRzID0geCA9PiB7XG5cdGlmIChOdW1iZXIuaXNOYU4oeCkpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQvLyBjb2RlIHBvaW50cyBhcmUgZGVyaXZlZCBmcm9tOlxuXHQvLyBodHRwOi8vd3d3LnVuaXgub3JnL1B1YmxpYy9VTklEQVRBL0Vhc3RBc2lhbldpZHRoLnR4dFxuXHRpZiAoXG5cdFx0eCA+PSAweDExMDAgJiYgKFxuXHRcdFx0eCA8PSAweDExNWYgfHwgIC8vIEhhbmd1bCBKYW1vXG5cdFx0XHR4ID09PSAweDIzMjkgfHwgLy8gTEVGVC1QT0lOVElORyBBTkdMRSBCUkFDS0VUXG5cdFx0XHR4ID09PSAweDIzMmEgfHwgLy8gUklHSFQtUE9JTlRJTkcgQU5HTEUgQlJBQ0tFVFxuXHRcdFx0Ly8gQ0pLIFJhZGljYWxzIFN1cHBsZW1lbnQgLi4gRW5jbG9zZWQgQ0pLIExldHRlcnMgYW5kIE1vbnRoc1xuXHRcdFx0KDB4MmU4MCA8PSB4ICYmIHggPD0gMHgzMjQ3ICYmIHggIT09IDB4MzAzZikgfHxcblx0XHRcdC8vIEVuY2xvc2VkIENKSyBMZXR0ZXJzIGFuZCBNb250aHMgLi4gQ0pLIFVuaWZpZWQgSWRlb2dyYXBocyBFeHRlbnNpb24gQVxuXHRcdFx0KDB4MzI1MCA8PSB4ICYmIHggPD0gMHg0ZGJmKSB8fFxuXHRcdFx0Ly8gQ0pLIFVuaWZpZWQgSWRlb2dyYXBocyAuLiBZaSBSYWRpY2Fsc1xuXHRcdFx0KDB4NGUwMCA8PSB4ICYmIHggPD0gMHhhNGM2KSB8fFxuXHRcdFx0Ly8gSGFuZ3VsIEphbW8gRXh0ZW5kZWQtQVxuXHRcdFx0KDB4YTk2MCA8PSB4ICYmIHggPD0gMHhhOTdjKSB8fFxuXHRcdFx0Ly8gSGFuZ3VsIFN5bGxhYmxlc1xuXHRcdFx0KDB4YWMwMCA8PSB4ICYmIHggPD0gMHhkN2EzKSB8fFxuXHRcdFx0Ly8gQ0pLIENvbXBhdGliaWxpdHkgSWRlb2dyYXBoc1xuXHRcdFx0KDB4ZjkwMCA8PSB4ICYmIHggPD0gMHhmYWZmKSB8fFxuXHRcdFx0Ly8gVmVydGljYWwgRm9ybXNcblx0XHRcdCgweGZlMTAgPD0geCAmJiB4IDw9IDB4ZmUxOSkgfHxcblx0XHRcdC8vIENKSyBDb21wYXRpYmlsaXR5IEZvcm1zIC4uIFNtYWxsIEZvcm0gVmFyaWFudHNcblx0XHRcdCgweGZlMzAgPD0geCAmJiB4IDw9IDB4ZmU2YikgfHxcblx0XHRcdC8vIEhhbGZ3aWR0aCBhbmQgRnVsbHdpZHRoIEZvcm1zXG5cdFx0XHQoMHhmZjAxIDw9IHggJiYgeCA8PSAweGZmNjApIHx8XG5cdFx0XHQoMHhmZmUwIDw9IHggJiYgeCA8PSAweGZmZTYpIHx8XG5cdFx0XHQvLyBLYW5hIFN1cHBsZW1lbnRcblx0XHRcdCgweDFiMDAwIDw9IHggJiYgeCA8PSAweDFiMDAxKSB8fFxuXHRcdFx0Ly8gRW5jbG9zZWQgSWRlb2dyYXBoaWMgU3VwcGxlbWVudFxuXHRcdFx0KDB4MWYyMDAgPD0geCAmJiB4IDw9IDB4MWYyNTEpIHx8XG5cdFx0XHQvLyBDSksgVW5pZmllZCBJZGVvZ3JhcGhzIEV4dGVuc2lvbiBCIC4uIFRlcnRpYXJ5IElkZW9ncmFwaGljIFBsYW5lXG5cdFx0XHQoMHgyMDAwMCA8PSB4ICYmIHggPD0gMHgzZmZmZClcblx0XHQpXG5cdCkge1xuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0cmV0dXJuIGZhbHNlO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi90YWJsZS9+L2lzLWZ1bGx3aWR0aC1jb2RlLXBvaW50L2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA5OFxuLy8gbW9kdWxlIGNodW5rcyA9IDMgNCIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IGFuc2lSZWdleCA9IHJlcXVpcmUoJ2Fuc2ktcmVnZXgnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBpbnB1dCA9PiB0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnID8gaW5wdXQucmVwbGFjZShhbnNpUmVnZXgoKSwgJycpIDogaW5wdXQ7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vdGFibGUvfi9zdHJpcC1hbnNpL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA5OVxuLy8gbW9kdWxlIGNodW5rcyA9IDMgNCJdLCJzb3VyY2VSb290IjoiIn0=