(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["app"] = factory();
	else
		root["app"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	__webpack_require__.p = "./dev/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_scenes_TitleScene__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/scenes/TitleScene */ "./src/scenes/TitleScene.js");
/* harmony import */ var _src_scenes_BootScene__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/scenes/BootScene */ "./src/scenes/BootScene.js");
/* harmony import */ var _src_scenes_GameScene__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/scenes/GameScene */ "./src/scenes/GameScene.js");
/* harmony import */ var _src_scenes_LoadingScene__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/scenes/LoadingScene */ "./src/scenes/LoadingScene.js");




var titleScene = new _src_scenes_TitleScene__WEBPACK_IMPORTED_MODULE_0__["default"]();
var bootScene = new _src_scenes_BootScene__WEBPACK_IMPORTED_MODULE_1__["default"]();
var gameScene = new _src_scenes_GameScene__WEBPACK_IMPORTED_MODULE_2__["default"]();
var loadingScene = new _src_scenes_LoadingScene__WEBPACK_IMPORTED_MODULE_3__["default"]();
var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600
};
var game = new Phaser.Game(config);
game.scene.add('TitleScene', titleScene);
game.scene.add('BootScene', bootScene);
game.scene.add('LoadingScene', loadingScene);
game.scene.add('GameScene', gameScene);
game.scene.start('BootScene', {
  scene: 'title'
});

/***/ }),

/***/ "./src/prefabs/Prefab.js":
/*!*******************************!*\
  !*** ./src/prefabs/Prefab.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Prefab =
/*#__PURE__*/
function (_Phaser$GameObjects$S) {
  _inherits(Prefab, _Phaser$GameObjects$S);

  function Prefab(scene, name, position, properties) {
    var _this;

    _classCallCheck(this, Prefab);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Prefab).call(this, scene, position.x, position.y, properties.texture, properties.frame));
    _this.scene = scene;
    _this.name = name;

    _this.scene.add.existing(_assertThisInitialized(_this));

    _this.scene.groups[properties.group].add(_assertThisInitialized(_this));

    if (properties.scale) {
      _this.setScale(properties.scale.x, properties.scale.y);
    }

    if (properties.anchor) {
      _this.setOrigin(properties.anchor.x, properties.anchor.y);
    }

    _this.scene.sprites[name] = _assertThisInitialized(_this);
    return _this;
  }

  return Prefab;
}(Phaser.GameObjects.Sprite);

/* harmony default export */ __webpack_exports__["default"] = (Prefab);

/***/ }),

/***/ "./src/prefabs/TextPrefab.js":
/*!***********************************!*\
  !*** ./src/prefabs/TextPrefab.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var TextPrefab =
/*#__PURE__*/
function (_Phaser$GameObjects$T) {
  _inherits(TextPrefab, _Phaser$GameObjects$T);

  function TextPrefab(scene, name, position, properties) {
    var _this;

    _classCallCheck(this, TextPrefab);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TextPrefab).call(this, scene, position.x, position.y, properties.text, properties.style));
    _this.scene = scene;
    _this.name = name;

    _this.scene.add.existing(_assertThisInitialized(_this));

    _this.scene.groups[properties.group].add(_assertThisInitialized(_this));

    if (properties.scale) {
      _this.setScale(properties.scale.x, properties.scale.y);
    }

    if (properties.anchor) {
      _this.setOrigin(properties.anchor.x, properties.anchor.y);
    }

    _this.scene.sprites[name] = _assertThisInitialized(_this);
    return _this;
  }

  return TextPrefab;
}(Phaser.GameObjects.Text);

/* harmony default export */ __webpack_exports__["default"] = (TextPrefab);

/***/ }),

/***/ "./src/prefabs/Unit.js":
/*!*****************************!*\
  !*** ./src/prefabs/Unit.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Prefab__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Prefab */ "./src/prefabs/Prefab.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var Unit =
/*#__PURE__*/
function (_Prefab) {
  _inherits(Unit, _Prefab);

  function Unit(scene, name, position, properties) {
    var _this;

    _classCallCheck(this, Unit);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Unit).call(this, scene, name, position, properties, properties));

    if (!_this.scene.anims.anims.has(name + '_idle')) {
      _this.scene.anims.create({
        key: name + '_idle',
        frames: _this.scene.anims.generateFrameNumbers(_this.texture.key, {
          frames: properties.animations.idle.frames
        }),
        frameRate: properties.animations.idle.fps,
        repeat: -1
      });
    }

    if (!_this.scene.anims.anims.has(name + '_attack1')) {
      _this.scene.anims.create({
        key: name + '_attack1',
        frames: _this.scene.anims.generateFrameNumbers(_this.texture.key, {
          frames: properties.animations.idle.frames
        }),
        frameRate: properties.animations.idle.fps,
        repeat: -1,
        onComplete: _this.back_to_idle.bind(_assertThisInitialized(_this))
      });
    }

    if (!_this.scene.anims.anims.has(name + '_attack2')) {
      var attack2_animation = _this.scene.anims.create({
        key: name + '_attack2',
        frames: _this.scene.anims.generateFrameNumbers(_this.texture.key, {
          frames: properties.animations.idle.frames
        }),
        frameRate: properties.animations.idle.fps,
        repeat: -1,
        onComplete: _this.back_to_idle.bind(_assertThisInitialized(_this))
      });
    }

    if (!_this.scene.anims.anims.has(name + '_hit')) {
      _this.scene.anims.create({
        key: name + '_hit',
        frames: _this.scene.anims.generateFrameNumbers(_this.texture.key, {
          frames: properties.animations.idle.frames
        }),
        frameRate: properties.animations.idle.fps,
        repeat: -1,
        onComplete: _this.back_to_idle.bind(_assertThisInitialized(_this))
      });
    }

    _this.anims.play(name + '_idle');

    _this.stats = properties.stats;
    return _this;
  }

  _createClass(Unit, [{
    key: "back_to_idle",
    value: function back_to_idle() {
      this.anims.play(name + '_idle');
    }
  }]);

  return Unit;
}(_Prefab__WEBPACK_IMPORTED_MODULE_0__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (Unit);

/***/ }),

/***/ "./src/scenes/BootScene.js":
/*!*********************************!*\
  !*** ./src/scenes/BootScene.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var BootScene =
/*#__PURE__*/
function (_Phaser$Scene) {
  _inherits(BootScene, _Phaser$Scene);

  function BootScene() {
    var _this;

    _classCallCheck(this, BootScene);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(BootScene).call(this, {
      key: 'BootScene'
    }));
    _this.levels = {
      title: {
        key: 'TitleScene',
        path: 'assets/levels/title_screen.json'
      },
      game: {
        key: 'GameScene',
        path: 'assets/levels/game_scene.json'
      }
    };
    return _this;
  }

  _createClass(BootScene, [{
    key: "preload",
    value: function preload() {
      for (var level_name in this.levels) {
        var level = this.levels[level_name];
        this.load.json(level_name, level.path);
      }
    }
  }, {
    key: "create",
    value: function create(data) {
      var level_data = this.cache.json.get(data.scene);
      this.scene.start('LoadingScene', {
        level_data: level_data,
        scene: this.levels[data.scene].key
      });
    }
  }]);

  return BootScene;
}(Phaser.Scene);

/* harmony default export */ __webpack_exports__["default"] = (BootScene);

/***/ }),

/***/ "./src/scenes/GameScene.js":
/*!*********************************!*\
  !*** ./src/scenes/GameScene.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _prefabs_Prefab__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../prefabs/Prefab */ "./src/prefabs/Prefab.js");
/* harmony import */ var _JSONLevelScene__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./JSONLevelScene */ "./src/scenes/JSONLevelScene.js");
/* harmony import */ var _prefabs_Unit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../prefabs/Unit */ "./src/prefabs/Unit.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var GameScene =
/*#__PURE__*/
function (_JSONLevelScene) {
  _inherits(GameScene, _JSONLevelScene);

  function GameScene() {
    var _this;

    _classCallCheck(this, GameScene);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GameScene).call(this, 'GameScene'));
    _this.prefab_classes = {
      background: _prefabs_Prefab__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.constructor,
      player_unit: _prefabs_Unit__WEBPACK_IMPORTED_MODULE_2__["default"].prototype.constructor,
      enemy_unit: _prefabs_Unit__WEBPACK_IMPORTED_MODULE_2__["default"].prototype.constructor
    };
    return _this;
  }

  _createClass(GameScene, [{
    key: "update",
    value: function update() {}
  }]);

  return GameScene;
}(_JSONLevelScene__WEBPACK_IMPORTED_MODULE_1__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (GameScene);

/***/ }),

/***/ "./src/scenes/JSONLevelScene.js":
/*!**************************************!*\
  !*** ./src/scenes/JSONLevelScene.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _prefabs_Prefab__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../prefabs/Prefab */ "./src/prefabs/Prefab.js");
/* harmony import */ var _prefabs_TextPrefab__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../prefabs/TextPrefab */ "./src/prefabs/TextPrefab.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




var JSONLevelScene =
/*#__PURE__*/
function (_Phaser$Scene) {
  _inherits(JSONLevelScene, _Phaser$Scene);

  function JSONLevelScene(key) {
    _classCallCheck(this, JSONLevelScene);

    return _possibleConstructorReturn(this, _getPrototypeOf(JSONLevelScene).call(this, {
      key: key
    }));
  }

  _createClass(JSONLevelScene, [{
    key: "init",
    value: function init(data) {
      this.level_data = data.level_data;
    }
  }, {
    key: "preload",
    value: function preload() {}
  }, {
    key: "create",
    value: function create() {
      this.groups = {};
      this.level_data.groups.forEach(function (group_name) {
        this.groups[group_name] = this.add.group();
      }, this);
      this.sprites = {};

      for (var sprite_name in this.level_data.sprites) {
        var sprite_data = this.level_data.sprites[sprite_name];
        var sprite = new this.prefab_classes[sprite_data.type](this, sprite_name, sprite_data.position, sprite_data.properties);
      }
    }
  }]);

  return JSONLevelScene;
}(Phaser.Scene);

/* harmony default export */ __webpack_exports__["default"] = (JSONLevelScene);

/***/ }),

/***/ "./src/scenes/LoadingScene.js":
/*!************************************!*\
  !*** ./src/scenes/LoadingScene.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var LoadingScene =
/*#__PURE__*/
function (_Phaser$Scene) {
  _inherits(LoadingScene, _Phaser$Scene);

  function LoadingScene() {
    _classCallCheck(this, LoadingScene);

    return _possibleConstructorReturn(this, _getPrototypeOf(LoadingScene).call(this, {
      key: 'LoadingScene'
    }));
  }

  _createClass(LoadingScene, [{
    key: "init",
    value: function init(data) {
      this.level_data = data.level_data;
      var loading_message = this.add.text(320, 320, "Loading");
    }
  }, {
    key: "preload",
    value: function preload() {
      var assets = this.level_data.assets;

      for (var asset_key in assets) {
        var asset = assets[asset_key];

        switch (asset.type) {
          case "image":
            this.load.image(asset_key, asset.source);
            break;

          case "spritesheet":
            this.load.spritesheet(asset_key, asset.source, {
              frameWidth: asset.frame_width,
              frameHeight: asset.frame_height,
              frames: asset.frames,
              margin: asset.margin,
              spacing: asset.spacing
            });
        }
      }
    }
  }, {
    key: "create",
    value: function create(data) {
      this.scene.start(data.scene, {
        level_data: this.level_data
      });
    }
  }]);

  return LoadingScene;
}(Phaser.Scene);

/* harmony default export */ __webpack_exports__["default"] = (LoadingScene);

/***/ }),

/***/ "./src/scenes/TitleScene.js":
/*!**********************************!*\
  !*** ./src/scenes/TitleScene.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _prefabs_Prefab__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../prefabs/Prefab */ "./src/prefabs/Prefab.js");
/* harmony import */ var _prefabs_TextPrefab__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../prefabs/TextPrefab */ "./src/prefabs/TextPrefab.js");
/* harmony import */ var _JSONLevelScene__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./JSONLevelScene */ "./src/scenes/JSONLevelScene.js");
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }





var TitleScene =
/*#__PURE__*/
function (_JSONLevelScene) {
  _inherits(TitleScene, _JSONLevelScene);

  function TitleScene() {
    var _this;

    _classCallCheck(this, TitleScene);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TitleScene).call(this, 'TitleScene'));
    _this.prefab_classes = {
      background: _prefabs_Prefab__WEBPACK_IMPORTED_MODULE_0__["default"].prototype.constructor
    };
    return _this;
  }

  _createClass(TitleScene, [{
    key: "update",
    value: function update() {
      if (this.input.activePointer.isDown) {
        this.start_game();
      }
    }
  }, {
    key: "start_game",
    value: function start_game() {
      this.scene.start('BootScene', {
        scene: 'game'
      });
    }
  }]);

  return TitleScene;
}(_JSONLevelScene__WEBPACK_IMPORTED_MODULE_2__["default"]);

/* harmony default export */ __webpack_exports__["default"] = (TitleScene);

/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Users\Fabricio\OneDrive\Documentos\GitHub\AFKNights2\src\main.js */"./src/main.js");


/***/ })

/******/ });
});
//# sourceMappingURL=app.js.map