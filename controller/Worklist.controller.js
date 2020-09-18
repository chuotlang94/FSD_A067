/*global location history */
sap.ui.define([
	"mavin/create/so/ZFIORI_DC_CREATE_SO/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"mavin/create/so/ZFIORI_DC_CREATE_SO/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox"
], function(BaseController, JSONModel, History, formatter, Filter, FilterOperator, MessageBox) {
	"use strict";

	return BaseController.extend("mavin.create.so.ZFIORI_DC_CREATE_SO.controller.Worklist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {
			var oViewModel,
				iOriginalBusyDelay;
			// oTable = this.byId("table");
			// Model used to manipulate control states
			oViewModel = new JSONModel({});
			this.setModel(oViewModel, "worklistView");

		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onValidationCheck: function(oEvent) {
			var sIndentificationNo = this.getView().byId("productInput").getValue();
			var sPass			= this.getView().byId("productPass").getValue();
			if (sIndentificationNo === "" || sPass === "") {
				MessageBox.error("Dữ liệu bắt buộc không được để trống");
				return;
			}

			var sPath = "/IndentificationCheckSet(Extnm='param',Pass='pass')";
			sPath = sPath.replace('param', sIndentificationNo);
			sPath = sPath.replace('pass', sPass);
			this.showBusy();
			this.getModel().read(sPath, {
				success: function(oData) {
					this.hideBusy();
					if (oData.Return === 'YES') {
						this.getRouter().navTo("object", {
							objectId: sIndentificationNo,
							Pass: sPass
						});
						
					} else {
						MessageBox.error("Chứng thực không hợp lệ, vui lòng kiểm tra lại");
					}
				}.bind(this),
				error: function(oError) {
					MessageBox.error("Có lỗi xảy ra");
					this.hideBusy();
				}.bind(this)
			});
		}

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */

	});
});