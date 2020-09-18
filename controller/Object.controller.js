/*global location*/
sap.ui.define([
	"mavin/create/so/ZFIORI_DC_CREATE_SO/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"mavin/create/so/ZFIORI_DC_CREATE_SO/model/formatter",
	"sap/ui/model/Filter",
	"sap/m/MessageBox",
	"sap/ui/model/FilterOperator"
], function(
	BaseController,
	JSONModel,
	History,
	formatter,
	Filter,
	MessageBox,
	FilterOperator
) {
	"use strict";

	return BaseController.extend("mavin.create.so.ZFIORI_DC_CREATE_SO.controller.Object", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
				busy: true,
				delay: 0
			});

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

			// Store original busy indicator delay, so it can be restored later on
			this.setModel(oViewModel, "objectView");
			this.getModel("objectView").setProperty("/sTotal", 0);
			this.getModel("objectView").setProperty("/sTotalWeight", 0);
			this.getModel("objectView").setProperty("/sTotalReBate", 0);
			var sCurrentDate = new Date();
			this.getView().getModel("objectView").setProperty("/currentDate", sCurrentDate);
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onTabBarItemsSelect: function(oEvent) {
			var sKey = oEvent.getSource().getSelectedKey();
			if (sKey === "01") {
				this.getView().byId("kttk").setVisible(true);
				this.getView().byId("tdh").setVisible(false);
				return;
			}

			if (sKey === "02") {
				this.getView().byId("kttk").setVisible(false);
				this.getView().byId("tdh").setVisible(true);
				return;
			}
		},

		handleMatnrValueHelp: function(oEvent) {
			this.ProjectId = oEvent.getSource().getId();
			if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment(
					"mavin.create.so.ZFIORI_DC_CREATE_SO.fragment.MatnrFragment",
					this
				);
				this.getView().addDependent(this._valueHelpDialog);
			}
			// open value help dialog filtered by the input value
			this._valueHelpDialog.open();
		},

		_handleMatnrValueHelpClose: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId("name");
				productInput.setValue(oSelectedItem.getTitle());
				var sSelectedPath = oEvent.getParameter("selectedItem").getBindingContextPath();
				var oSelectedObject = oEvent.getParameter("selectedItem").getModel().getData(sSelectedPath);
				this.getView().byId("uom").setValue(oSelectedObject.BaseUomVi);
			}
		},

		_handleMatrnValueHelpSearch: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("Material", FilterOperator.EQ, sValue);
			var oFilter_1 = new Filter("MaterialDesc", FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter, oFilter_1]);
		},

		handlePlantValueHelp: function(oEvent) {
			this.Plant = oEvent.getSource().getId();
			if (!this._valuePlantHelpDialog) {
				this._valuePlantHelpDialog = sap.ui.xmlfragment(
					"mavin.create.so.ZFIORI_DC_CREATE_SO.fragment.Plant",
					this
				);
				this.getView().addDependent(this._valuePlantHelpDialog);
			}
			// open value help dialog filtered by the input value
			this._valuePlantHelpDialog.open();
		},

		_handlePlantValueHelpClose: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				var plantInput = this.byId(this.Plant);
				plantInput.setValue(oSelectedItem.getTitle());
			}
		},

		handleSLocValueHelp: function(oEvent) {
			var sWerks = this.getView().byId("plant").getValue();
			this.Sloc = oEvent.getSource().getId();
			if (!this._valueSlocHelpDialog) {
				this._valueSlocHelpDialog = sap.ui.xmlfragment(
					"mavin.create.so.ZFIORI_DC_CREATE_SO.fragment.Sloc",
					this
				);
				this.getView().addDependent(this._valueSlocHelpDialog);
			}
			this._valueSlocHelpDialog.getBinding("items").filter([new Filter(
				"WERKS",
				sap.ui.model.FilterOperator.EQ, sWerks
			)]);
			// open value help dialog filtered by the input value
			this._valueSlocHelpDialog.open();
		},

		_handleSlocValueHelpClose: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				var sLocInput = this.byId(this.Sloc);
				sLocInput.setValue(oSelectedItem.getTitle());
			}
		},

		handleUoMValueHelp: function(oEvent) {
			this.UoM = oEvent.getSource().getId();
			if (!this._valueUoMHelpDialog) {
				this._valueUoMHelpDialog = sap.ui.xmlfragment(
					"mavin.create.so.ZFIORI_DC_CREATE_SO.fragment.BaseUnit",
					this
				);
				this.getView().addDependent(this._valueUoMHelpDialog);
			}
			this._valueUoMHelpDialog.open();
		},

		_handleUoMValueHelpClose: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				var sUoMInput = this.byId(this.UoM);
				sUoMInput.setValue(oSelectedItem.getTitle());
			}
		},

		handleSaleOfficeValueHelp: function(oEvent) {
			this.sSaleOffice = oEvent.getSource().getId();
			if (!this._valueSalesOfficeHelpDialog) {
				this._valueSalesOfficeHelpDialog = sap.ui.xmlfragment(
					"mavin.create.so.ZFIORI_DC_CREATE_SO.fragment.SalesOffice",
					this
				);
				this.getView().addDependent(this._valueSalesOfficeHelpDialog);
			}

			this._valueSalesOfficeHelpDialog.getBinding("items").filter([new Filter(
				"Extnm",
				sap.ui.model.FilterOperator.EQ, this.sIndentification
			)]);
			this._valueSalesOfficeHelpDialog.open();
		},

		_handleSalseOfficeValueHelpClose: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				var sSalesOffcice = this.byId(this.sSaleOffice);
				sSalesOffcice.setValue(oSelectedItem.getTitle());
				// sSalesOffcice.setDescription(oSelectedItem.getDescription());
				this.getView().byId("salesofficetext").setValue(oSelectedItem.getDescription());

			}
		},

		handleCustomerValueHelp: function(oEvent) {
			this.sCustomerId = oEvent.getSource().getId();
			if (!this._valueCustomerHelpDialog) {
				this._valueCustomerHelpDialog = sap.ui.xmlfragment(
					"mavin.create.so.ZFIORI_DC_CREATE_SO.fragment.Customer",
					this
				);
				this.getView().addDependent(this._valueCustomerHelpDialog);
			}

			this._valueCustomerHelpDialog.getBinding("items").filter([new Filter(
				"IndentityNumber",
				sap.ui.model.FilterOperator.EQ, this.sIndentification
			)]);
			this._valueCustomerHelpDialog.open();
		},

		_handleCustomerValueHelpClose: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			var oSelectedObject = oEvent.getParameter("selectedItem").getBindingContext().getObject();
			var sInformation = oSelectedObject.Address + ' - ' + oSelectedObject.Telephone;
			if (oSelectedItem) {
				var sCustomerIdInput = this.byId(this.sCustomerId);
				sCustomerIdInput.setValue(oSelectedItem.getTitle());
				this.getView().byId("custInfo").setValue(sInformation);
				this.getView().byId("defaultPlant").setSelectedKey(oSelectedItem.getBindingContext().getObject().DefaultPlant);
			}
		},

		_handleCustomerValueHelpSearch: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			sValue.toUpperCase();
			var oFilter = new Filter("CustomerName", FilterOperator.EQ, sValue);
			// var oFilter_1 = new Filter("Maktx", FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		handleSOMaterialValueHelp: function(oEvent) {
			this.sMaterialId = oEvent.getSource().getId();
			if (!this._valueSOMaterialHelpDialog) {
				this._valueSOMaterialHelpDialog = sap.ui.xmlfragment(
					"mavin.create.so.ZFIORI_DC_CREATE_SO.fragment.CreateSOMaterial",
					this
				);
				this.getView().addDependent(this._valueSOMaterialHelpDialog);
			}

			this._valueSOMaterialHelpDialog.open();
		},

		_handleCreateSOValueHelpSearch: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			sValue.toUpperCase();
			var oFilter = new Filter("Matnr", FilterOperator.EQ, sValue);
			var oFilter_1 = new Filter("Maktx", FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter, oFilter_1]);
		},

		_handleCSOMatnrValueHelpClose: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				var sSelectedPath = oEvent.getParameter("selectedItem").getBindingContextPath();
				var oSelectedObject = oEvent.getParameter("selectedItem").getModel().getData(sSelectedPath);
				var sMatnrInput = this.byId(this.sMaterialId);
				sMatnrInput.setValue(oSelectedItem.getTitle());
				var sUomInput = this.getView().byId("souom");
				sUomInput.setValue(oSelectedObject.BaseUomVi);
				var sUomInputOrg = this.getView().byId("souomorg");
				sUomInputOrg.setValue(oSelectedObject.BaseUom);
				this.sMaktx = oSelectedItem.getDescription();
			}
		},

		onMatAvailablityCheck: function(oEvent) {
			var aFilters = [];
			// Material filter value
			var oMatFilter = new Filter("MATERIAL", sap.ui.model.FilterOperator.EQ, this.getView().byId("name").getValue());
			aFilters.push(oMatFilter);

			// Plant filter value
			var oPlantFilter = new Filter("PLANT", sap.ui.model.FilterOperator.EQ, this.getView().byId("plant").getValue());
			aFilters.push(oPlantFilter);

			// Storage Location value
			var oStorageLoc = new Filter("STGE_LOC", sap.ui.model.FilterOperator.EQ, this.getView().byId("sloc").getValue());
			aFilters.push(oStorageLoc);

			// Base Unit (UoM) value
			var oUoMFilter = new Filter("UNIT", sap.ui.model.FilterOperator.EQ, this.getView().byId("uom").getValue());
			aFilters.push(oUoMFilter);

			// Reporting Date value
			var oReportingDate = new Filter("REPORTINGDATE", sap.ui.model.FilterOperator.EQ, this.getView().byId("reportingdate").getValue());
			aFilters.push(oReportingDate);

			var sPath = "/MaterialAvailabilityCheckSet";
			this.getModel().read(sPath, {
				filters: aFilters,
				success: function(oData) {
					this.getModel("objectView").setProperty("/matAvaiCheck", oData.results[0]);
					this.getView().byId("Result").setVisible(true);
				}.bind(this),
				error: function(oError) {
					MessageBox.error("Có lỗi xảy ra, vui liện hệ với bộ phân IT");
				}.bind(this)
			});
		},

		onAddNewItem: function(oEvent) {
			var oItem = {};
			var aItems;
			this.sTotal = 0;
			this.sTotalWeight = 0;
			this.sTotalReBate = 0;
			// Check if material is already added.
			var aCheckItems = this.getModel("objectView").getProperty("/sOItems");
			var sMaterialAdd = this.getView().byId("somatno").getValue();
			if (aCheckItems) {
				for (var i = 0; i < aCheckItems.length; i++) {
					if (sMaterialAdd === aCheckItems[i].MaterialNumber) {
						MessageBox.error("Mã vật tư này đã được thêm vào");
						this.getView().byId("somatno").setValue("");
						this.getView().byId("soquan").setValue("");
						return;
					}
				}
			}

			if (this.getView().byId("soldtoparty").getValue() === "") {
				MessageBox.error("Mã khách hang đang bị rỗng");
				return;
			}
			var sPath = this.getView().getModel().createKey('/PriceSimulateSet', {
				'INDENTITYNUMBER': this.sIndentification,
				'SD_DOC_CAT': 'C',
				'DOC_TYPE': 'ZSO2',
				'SALES_ORG': '2010',
				'DISTR_CHAN': '10',
				'DIVISION': '',
				'SERV_DATE': this.getView().byId("deldate").getValue(),
				'ITEM_NUMBER': '0010',
				'MATNR': this.getView().byId("somatno").getValue(),
				'MENGE': this.getView().byId("soquan").getValue(),
				'WERKS': this.getView().byId("defaultPlant").getSelectedKey(),
				'KUNNR': this.getView().byId("soldtoparty").getValue(),
				'SALEOFFICE': this.getView().byId("salesoffice").getValue()
			});
			this.showBusy();
			this.getView().getModel().read(sPath, {
				success: function(oSuccess, oHeader) {
					if (this.getModel("objectView").getProperty("/sOItems")) {
						aItems = this.getModel("objectView").getProperty("/sOItems");
					} else {
						aItems = [];
					}
					oItem.MaterialNumber = this.getView().byId("somatno").getValue();
					oItem.MaerialDesc = this.sMaktx;
					oItem.UnitOfMeasure = this.getView().byId("souom").getValue();
					oItem.UnitOfMeasureOrg = this.getView().byId("souomorg").getValue();
					oItem.Quantity = this.getView().byId("soquan").getValue();
					oItem.Weight = oSuccess.NET_WEIGHT;
					oItem.NetWeight = oSuccess.NET_WEIGHT * oItem.Quantity;
					if (oSuccess.WERKS === "") {
						oItem.Werks = this.getView().byId("defaultPlant").getSelectedKey();
					} else {
						oItem.Werks = oSuccess.WERKS;
					}
					oItem.Price = parseFloat(oSuccess.PRICE);
					oItem.ActPrice = parseFloat(oSuccess.ACT_PRICE);
					oItem.TaxAmount = parseFloat(oSuccess.TAX_AMOUNT);
					oItem.ReBate = parseFloat(oSuccess.REBATE);
					var n = oSuccess.REBATE.search("-");
					if (n >= 0) {
						oItem.TotalItemPrice = (oItem.Quantity * oSuccess.PRICE) - parseFloat(oSuccess.REBATE) + parseFloat(oSuccess.TAX_AMOUNT);
					} else {
						oItem.TotalItemPrice = (oItem.Quantity * oSuccess.PRICE) + parseFloat(oSuccess.REBATE) + parseFloat(oSuccess.TAX_AMOUNT);
					}
					oItem.Currency = oSuccess.CURRENCY;

					aItems.push(oItem);
					this.getModel("objectView").setProperty("/sOItems", aItems);

					for (var i = 0; i < aItems.length; i++) {
						this.sTotal = this.sTotal + aItems[i].TotalItemPrice;
						this.sTotalWeight  = this.sTotalWeight  + aItems[i].NetWeight;
						this.sTotalReBate = this.sTotalReBate + oItem.ReBate;
					}
					this.getModel("objectView").setProperty("/sTotal", this.sTotal);
					this.getModel("objectView").setProperty("/sTotalWeight", this.sTotalWeight);
					this.getModel("objectView").setProperty("/sTotalReBate", this.sTotalReBate);

					this.getView().byId("somatno").setValue("");
					this.getView().byId("soquan").setValue("");
					this.hideBusy();
				}.bind(this),
				error: function(oError) {
					this.hideBusy();
				}.bind(this)
			});

		},

		onDelItem: function(oEvent) {
			var oDelObject = oEvent.getSource().getBindingContext("objectView").getObject();
			var aOldItems = this.getView().getModel("objectView").getProperty("/sOItems");
			var aNewItems = [];
			var sTotal = this.getModel("objectView").getProperty("/sTotal");
			var sTotalWeight = this.getModel("objectView").getProperty("/sTotalWeight");
			var sTotalReBate = this.getModel("objectView").getProperty("/sTotalReBate");
			for (var i = 0; i < aOldItems.length; i++) {
				if (aOldItems[i].MaterialNumber !== oDelObject.MaterialNumber) {
					aNewItems.push(aOldItems[i]);
				} else {
					sTotal = sTotal - aOldItems[i].TotalItemPrice;
					sTotalWeight = sTotalWeight - aOldItems[i].NetWeight;
					sTotalReBate = sTotalReBate - aOldItems[i].ReBate;
				}
			}
			this.getModel("objectView").setProperty("/sTotal", sTotal);
			this.getModel("objectView").setProperty("/sTotalWeight", sTotalWeight);
			this.getModel("objectView").setProperty("/sTotalReBate", sTotalReBate);
			this.getView().getModel("objectView").setProperty("/sOItems", aNewItems);
		},

		onQuantityChange: function(oEvent) {
			if (oEvent.getSource().getValue() <= 0) {
				MessageBox.error("Số lượng không thể bé hơn hoặc băng 0");
				return;
			}
			var sQuantity = oEvent.getSource().getValue();
			var oBindingItemChangeQuan = oEvent.getSource().getBindingContext("objectView").getObject();
			var sPath = this.getView().getModel().createKey('/PriceSimulateSet', {
				'INDENTITYNUMBER': this.sIndentification,
				'SD_DOC_CAT': 'C',
				'DOC_TYPE': 'ZSO2',
				'SALES_ORG': '2010',
				'DISTR_CHAN': '10',
				'DIVISION': '',
				'SERV_DATE': this.getView().byId("deldate").getValue(),
				'ITEM_NUMBER': '0010',
				'MATNR': oBindingItemChangeQuan.MaterialNumber,
				'MENGE': sQuantity,
				'WERKS': this.getView().byId("defaultPlant").getSelectedKey(),
				'KUNNR': this.getView().byId("soldtoparty").getValue(),
				'SALEOFFICE': this.getView().byId("salesoffice").getValue()
			});
			this.showBusy();
			this.getView().getModel().read(sPath, {
				success: function(oSuccess, oHeader) {
					oBindingItemChangeQuan.TotalItemPrice = oBindingItemChangeQuan.Price * sQuantity - oBindingItemChangeQuan.ReBate;
					oBindingItemChangeQuan.NetWeight = oSuccess.NET_WEIGHT * sQuantity;
					oBindingItemChangeQuan.ReBate = parseFloat(oSuccess.REBATE);
					var n = oSuccess.REBATE.search("-");
					if (n >= 0) {
						oBindingItemChangeQuan.TotalItemPrice = (oBindingItemChangeQuan.Quantity * oSuccess.PRICE) - parseFloat(oSuccess.REBATE) +
							parseFloat(oSuccess.TAX_AMOUNT);
					} else {
						oBindingItemChangeQuan.TotalItemPrice = (oBindingItemChangeQuan.Quantity * oSuccess.PRICE) + parseFloat(oSuccess.REBATE) +
							parseFloat(oSuccess.TAX_AMOUNT);
					}
					var aItems = this.getView().byId("idProductsTable").getItems();
					var sTotalPrice = 0;
					var sTotalWeight = 0;
					var sTotalReBate = 0;
					for (var i = 0; i < aItems.length; i++) {
						var oItem = aItems[i].getBindingContext("objectView").getObject();
						sTotalPrice = sTotalPrice + oItem.TotalItemPrice;
						sTotalWeight  = sTotalWeight  + oItem.NetWeight;
						sTotalReBate = sTotalReBate + oItem.ReBate;
					}
					this.getModel("objectView").setProperty("/sTotal", sTotalPrice);
					this.getModel("objectView").setProperty("/sTotalWeight", sTotalWeight);
					this.getModel("objectView").setProperty("/sTotalReBate", sTotalReBate);
					this.hideBusy();
				}.bind(this),
				error: function(oError) {
					this.hideBusy();
				}.bind(this)
			});
		},

		onPlantChange: function(oEvent) {
			var aItems = this.getModel("objectView").getProperty("/sOItems");
			this.getView().byId("defaultPlant").setSelectedKey(oEvent.getSource().getSelectedKey());
			for (var i = 0; i < aItems.length; i++) {
				aItems[i].Werks = oEvent.getSource().getSelectedKey();
			}
			this.getModel("objectView").setProperty("/sOItems", aItems);
			this._simulateByPlant(aItems);
		},

		_simulateByPlant: function(aItems) {

			var aSimulateItems = [];
			var aDeferred = this.getModel().getDeferredGroups();
			for (var i = 0; i < aItems.length; i++) {

				var sPath = this.getView().getModel().createKey('/PriceSimulateSet', {
					'INDENTITYNUMBER': this.sIndentification,
					'SD_DOC_CAT': 'C',
					'DOC_TYPE': 'ZSO2',
					'SALES_ORG': '2010',
					'DISTR_CHAN': '10',
					'DIVISION': '',
					'SERV_DATE': this.getView().byId("deldate").getValue(),
					'ITEM_NUMBER': '0010',
					'MATNR': aItems[i].MaterialNumber,
					'MENGE': aItems[i].Quantity,
					'WERKS': aItems[i].Werks,
					'KUNNR': this.getView().byId("soldtoparty").getValue(),
					'SALEOFFICE': this.getView().byId("salesoffice").getValue()
				});
				this.getModel().read(sPath, {
					groupId: "MassSimulate",
					changeSetId: "get"
				});
				aDeferred.push("MassSimulate");
			}
			this.getModel().setDeferredGroups(aDeferred);
			this.showBusy();
			this.getModel().submitChanges({
				groupId: "MassSimulate",
				success: function(oBatchResponse) {
					var aBatchResponse = oBatchResponse.__batchResponses;
					for (var j = 0; j < aBatchResponse.length; j++) {
						var oItem = {};
						oItem.MaterialNumber = aBatchResponse[j].data.MATNR;
						oItem.MaerialDesc = aBatchResponse[j].data.MATNR;
						oItem.UnitOfMeasure = this.getView().byId("souom").getValue();
						oItem.UnitOfMeasureOrg = this.getView().byId("souomorg").getValue();
						oItem.Quantity = parseFloat(aBatchResponse[j].data.MENGE);
						oItem.Weight = aBatchResponse[j].data.NET_WEIGHT;
						oItem.NetWeight = aBatchResponse[j].data.NET_WEIGHT * aBatchResponse[j].data.MENGE;
						if (aBatchResponse[j].data.WERKS === "") {
							oItem.Werks = this.getView().byId("defaultPlant").getSelectedKey();
						} else {
							oItem.Werks = aBatchResponse[j].data.WERKS;
						}
						oItem.Price = parseFloat(aBatchResponse[j].data.PRICE);
						oItem.ActPrice = parseFloat(aBatchResponse[j].data.ACT_PRICE);
						oItem.TaxAmount = parseFloat(aBatchResponse[j].data.TAX_AMOUNT);
						oItem.ReBate = parseFloat(aBatchResponse[j].data.REBATE);
						var n = aBatchResponse[j].data.REBATE.search("-");
						if (n >= 0) {
							oItem.TotalItemPrice = (aBatchResponse[j].data.MENGE * aBatchResponse[j].data.PRICE) - parseFloat(aBatchResponse[j].data.REBATE) +
								parseFloat(aBatchResponse[j].data.TAX_AMOUNT);
						} else {
							oItem.TotalItemPrice = (aBatchResponse[j].data.MENGE * aBatchResponse[j].data.PRICE) + parseFloat(aBatchResponse[j].data.REBATE) +
								parseFloat(aBatchResponse[j].data.TAX_AMOUNT);
						}
						oItem.Currency = aBatchResponse[j].data.CURRENCY;

						aSimulateItems.push(oItem);
						this.getModel("objectView").setProperty("/sOItems", aSimulateItems);
						this.hideBusy();
					}
				}.bind(this),
				error: function(oError) {
					this.hideBusy();
				}.bind(this)
			});

		},

		onCreateSalesOrder: function(oEvent) {
			var oSaleOder = {};
			var aSoItems = [];
			var sValid = this._checkInputData();
			if (sValid === true) {
				oSaleOder.DeliveryNumber = this.sIndentification;
				oSaleOder.SalesOffice = this.getView().byId("salesoffice").getValue();
				oSaleOder.DeliveryDate = this.getView().byId("deldate").getValue();
				oSaleOder.SoldToParty = this.getView().byId("soldtoparty").getValue();
				oSaleOder.Extnm = this.getOwnerComponent().User;

				var aItems = this.getModel("objectView").getProperty("/sOItems");
				for (var i = 0; i < aItems.length; i++) {
					var oItem = {};
					oItem.DeliveryNumber = oSaleOder.DeliveryNumber;
					oItem.MaterialNumber = aItems[i].MaterialNumber;
					oItem.UnitOfMeasure = aItems[i].UnitOfMeasureOrg;
					if (aItems[i].Quantity <= 0) {
						MessageBox.error("Số lượng không thể bé hơn hoặc băng 0");
						return;
					}
					oItem.Quantity = aItems[i].Quantity.toString();
					oItem.Plant = aItems[i].Werks;
					aSoItems.push(oItem);
				}
				oSaleOder.SalesItemsSet = aSoItems;

				var sPath = "/SalesHeaderSet";
				this.showBusy();
				this.getModel().create(sPath, oSaleOder, {
					success: function(oScuccess, oHeader) {
						var messageReturn = oHeader.headers["sap-message"];
						var hdrMessageObject = JSON.parse(messageReturn);
						if (hdrMessageObject.severity === 'error') {
							MessageBox.error(hdrMessageObject.message);
						} else {
							MessageBox.information('ĐƠN HÀNG ' + oScuccess.DeliveryNumber + ' THÀNH CÔNG');
						}
						this.getModel("objectView").setProperty("/sOItems", []);
						this.getModel("objectView").setProperty("/sTotal", "");
						this.hideBusy();
					}.bind(this),
					error: function(oError) {
						MessageBox.error("TẠO ĐƠN HÀNG THẤT BẠI");
						this.hideBusy();
					}.bind(this)
				});
			}

		},

		onMb52Open: function(oEvent) {
			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			var hashUrl = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
				target: {
					semanticObject: "ZSDMB52",
					action: "display"
				}
			}));
			oCrossAppNavigator.toExternal({
				target: {
					shellHash: hashUrl
				}
			});
		},

		onVa05Open: function(oEvent) {
			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			var hashUrl = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
				target: {
					semanticObject: "ZSDVA05",
					action: "display"
				}
			}));
			oCrossAppNavigator.toExternal({
				target: {
					shellHash: hashUrl
				}
			});
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function(oEvent) {
			this.sIndentification = oEvent.getParameter("arguments").objectId;
			this.Pass = oEvent.getParameter("arguments").Pass;
			
			var sPath = "/IndentificationCheckSet(Extnm='param',Pass='pass')";
			sPath = sPath.replace('param', this.sIndentification);
			sPath = sPath.replace('pass', this.Pass);
			this.showBusy();
			this.getModel().read(sPath, {
				success: function(oData) {
					this.hideBusy();
					if (oData.Return === 'NO') {
						this.getRouter().navTo("worklist", {
						});
					}else {
						this.getOwnerComponent().User = this.sIndentification;
					}
				}.bind(this),
				error: function(oError) {
					MessageBox.error("Có lỗi xảy ra");
					this.hideBusy();
				}.bind(this)
			});
		},

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_checkInputData: function() {
			if (this.getView().byId("salesoffice").getValue() === "") {
				MessageBox.error("ĐIỂM BÁN HÀNG không được để trống");
				return false;
			}

			if (this.getView().byId("deldate").getValue() === "") {
				MessageBox.error("NGÀY GIAO HÀNG không được để trống");
				return false;
			}

			if (this.getView().byId("soldtoparty").getValue() === "") {
				MessageBox.error("MÃ KHÁCH HÀNG không được để trống");
				return false;
			}
			return true;

		}
	});

});