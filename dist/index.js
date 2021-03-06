"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.connectStore = exports.createSagas = exports.createContainer = exports.dispatchPromise = exports.commitAsync = exports.dispatch = exports.commit = exports.latest = exports.every = exports.createStore = exports.STORE = undefined;

var _babelPolyfill = require('babel-polyfill');

var _babelPolyfill2 = _interopRequireDefault(_babelPolyfill);

var _immer = require('immer');

var _immer2 = _interopRequireDefault(_immer);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _reduxSaga = require('redux-saga');

var _reduxSaga2 = _interopRequireDefault(_reduxSaga);

var _effects = require('redux-saga/effects');

var _helpers = require('./helpers');

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var devTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
var composeEnhancers = devTools || _redux.compose;

var sagaMiddleware = (0, _reduxSaga2.default)();
var middlewares = [sagaMiddleware];

var STORE = exports.STORE = null;

var createStore = exports.createStore = function createStore(modules) {
	var reducers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	var _marked = /*#__PURE__*/regeneratorRuntime.mark(rootSaga);

	var new_middlewares = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

	middlewares = middlewares.concat(new_middlewares);
	var reducerList = Object.assign({}, reducers);
	var sagas = [];
	modules.forEach(function (module) {
		sagas = sagas.concat(module.sagas);
		reducerList[module.name] = (0, _reducer2.default)(module.name, module.mutations, module.state);
	});

	var store = (0, _redux.createStore)((0, _redux.combineReducers)(reducerList), composeEnhancers(_redux.applyMiddleware.apply(undefined, _toConsumableArray(middlewares))));
	function rootSaga() {
		return regeneratorRuntime.wrap(function rootSaga$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.prev = 0;
						_context.next = 3;
						return (0, _effects.all)(sagas);

					case 3:
						_context.next = 9;
						break;

					case 5:
						_context.prev = 5;
						_context.t0 = _context['catch'](0);

						alert('Something went wrong! Please check your connectivity');
						process.env.NODE_ENV == 'development' && console.log(_context.t0);

					case 9:
					case 'end':
						return _context.stop();
				}
			}
		}, _marked, this, [[0, 5]]);
	}
	sagaMiddleware.run(rootSaga);
	exports.STORE = STORE = store;
	return store;
};

var every = exports.every = function every(str) {
	return str + '.every';
};
var latest = exports.latest = function latest(str) {
	return str + '.latest';
};

var commit = exports.commit = function commit(action_name, data) {
	return STORE.dispatch({
		type: action_name,
		data: data
	});
};

var dispatch = exports.dispatch = function dispatch(action) {
	return STORE.dispatch(action);
};

var commitAsync = exports.commitAsync = function commitAsync(action_name, data) {
	return new Promise(function (resolve, reject) {
		STORE.dispatch({
			type: action_name,
			data: data,
			resolve: resolve,
			reject: reject
		});
	});
};

var dispatchPromise = exports.dispatchPromise = function dispatchPromise(action) {
	return new Promise(function (resolve, reject) {
		STORE.dispatch(object.assign({}, action, {
			resolve: resolve,
			reject: reject
		}));
	});
};

var createContainer = exports.createContainer = function createContainer(module) {
	var mapStateToProps = function mapStateToProps(state) {
		return state[module.name];
	};
	var set = function set(target, value) {
		STORE.dispatch({
			type: '__SET__' + module.name,
			data: {
				target: target,
				value: value
			}
		});
	};
	var Container = function Container(props) {
		return props.children(Object.assign({}, props, {
			dispatch: dispatch,
			commit: commit,
			set: set,
			dispatchPromise: dispatchPromise,
			commitAsync: commitAsync
		}));
	};
	return (0, _reactRedux.connect)(mapStateToProps, {})(Container);
};

var createSagas = exports.createSagas = function createSagas(saga_list) {
	var arr = [];
	var GeneratorFunction = Object.getPrototypeOf( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
		return regeneratorRuntime.wrap(function _callee$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee, this);
	})).constructor;
	var saga_keys = Object.keys(saga_list);
	saga_keys.forEach(function (key) {
		var action = key.split('.')[0];
		var worker_saga = saga_list[key];
		var mode = key.split('.')[1] || 'latest';
		var watcher = null;
		if (mode == 'latest') {
			watcher = /*#__PURE__*/regeneratorRuntime.mark(function watcher() {
				return regeneratorRuntime.wrap(function watcher$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								_context3.next = 2;
								return (0, _effects.takeLatest)(action, worker_saga);

							case 2:
							case 'end':
								return _context3.stop();
						}
					}
				}, watcher, this);
			});
		} else if (mode == 'every') {
			watcher = /*#__PURE__*/regeneratorRuntime.mark(function watcher() {
				return regeneratorRuntime.wrap(function watcher$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								_context4.next = 2;
								return (0, _effects.takeEvery)(action, worker_saga);

							case 2:
							case 'end':
								return _context4.stop();
						}
					}
				}, watcher, this);
			});
		}
		arr.push(watcher());
	});
	return arr;
};

var connectStore = exports.connectStore = function connectStore() {
	for (var _len = arguments.length, modules = Array(_len), _key = 0; _key < _len; _key++) {
		modules[_key] = arguments[_key];
	}

	var mapStateToProps = function mapStateToProps(state) {
		var finalState = {};
		Object.keys(modules).forEach(function (key) {
			var module = modules[key];
			finalState[module.name] = state[module.name];
		});
		return finalState;
	};

	var mergeProps = function mergeProps(state, actions) {
		return Object.assign({}, state, actions, {
			commit: commit,
			commitAsync: commitAsync,
			dispatchPromise: dispatchPromise
		});
	};

	return (0, _reactRedux.connect)(mapStateToProps, null, mergeProps);
};

exports.default = {
	createContainer: createContainer,
	createSagas: createSagas,
	createStore: createStore,
	dispatch: dispatch,
	commit: commit
};