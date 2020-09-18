sap.ui.define([
		"mavin/create/so/ZFIORI_DC_CREATE_SO/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("mavin.create.so.ZFIORI_DC_CREATE_SO.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);