/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"sapui5-btp-cf/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
