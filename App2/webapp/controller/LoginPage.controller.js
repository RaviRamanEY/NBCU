sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";

	return Controller.extend("com.nbcu.controller.LoginPage", {
		onInit: function() {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData("mockdata/data.json");
			this.getView().setModel(oModel);
		},
		
		onAfterRendering: function() {
			var copyrightLabel = this.getView().byId("copyrightLabel");
			copyrightLabel.setText("\xA9" + " 2016 NBCUNIVERSAL MEDIA, LLC.");
		},
		
		onRememberMe: function() {
			console.log("onRememberMe");
		},
		
		submit: function() {
			var inp = this.getView().byId("input").getValue();
			var pwd = this.getView().byId("password").getValue();
			
			if(inp === "user" && pwd === "password") {				
				this.getView().byId("app2").to(this.getView().byId("searchPage"));
			} else {
				sap.m.MessageToast.show("Please check your SSO id and Password", {
					duration: 5000
				});
			}
		},
		
		reset: function() {
			this.getView().byId("input").setValue("");
			this.getView().byId("password").setValue("");
		},
		
		onSearch: function() {
			var sQuery = this.getView().byId("searchField").getValue();
			
			if(sQuery === "") {
				MessageToast.show("Please enter a search criteria.");
				return;
			}
			
			if(sQuery.indexOf("*") > -1 || sQuery.indexOf("?") > -1) {
				MessageToast.show("Wildcards (*, ?) are not supported. Please remove wildcards and try again.");
				return;
			}
			
			var oController = this;
			
			this.getView().byId("searchResult").setVisible(true);
			
			var aFilter = [];
			
			if (sQuery && sQuery.length > 0) {
				var filter = new sap.ui.model.Filter("empName", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilter.push(filter);
			}
			
			var oList = this.getView().byId("searchResult");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},
		
		onNavigateFilter: function() {
			this.getView().byId("app2").to(this.getView().byId("filterPage"));
		},
		
		updateResults: function(oEvent) {
			var aFilter = [];
			var filter;
			
			this.getView().byId("panel").setExpanded(false);
			
			if(this.getView().byId("searchField").getValue() && this.getView().byId("searchField").getValue().length > 0) {
				filter = new sap.ui.model.Filter("empName", sap.ui.model.FilterOperator.Contains, this.getView().byId("searchField").getValue());
				aFilter.push(filter);
			}

			if(this.getView().byId("cmbBox").getValue() && this.getView().byId("cmbBox").getValue().length >  0){
				filter = new sap.ui.model.Filter("location", sap.ui.model.FilterOperator.Contains, this.getView().byId("cmbBox").getValue());
				aFilter.push(filter);
			}

			if(this.getView().byId("groupsCB").getValue() && this.getView().byId("groupsCB").getValue().length >  0){
				filter = new sap.ui.model.Filter("group", sap.ui.model.FilterOperator.Contains, this.getView().byId("groupsCB").getValue());
				aFilter.push(filter);
			}

			if(this.getView().byId("businessListItem").getValue() && this.getView().byId("businessListItem").getValue().length > 0){
				filter = new sap.ui.model.Filter("business", sap.ui.model.FilterOperator.Contains, this.getView().byId("businessListItem").getValue());
				aFilter.push(filter);
			}

			var oList = this.getView().byId("searchResult");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
			
			this.getView().byId("app2").to(this.getView().byId("searchPage"));
		},
		
		cancel: function(oEvent) {
			this.getView().byId("cmbBox").setValue("");
			this.getView().byId("groupsCB").setValue("");
			this.getView().byId("businessListItem").setValue("");
			
			this.getView().byId("app2").to(this.getView().byId("searchPage"));
		},
		
		onItemSelect: function(oEvent) {
			var oList = this.getView().byId("searchResult");
			var businessList = this.byId("businessListItem");
		    var oTemplate = new sap.ui.core.ListItem({ key : "{business}", text : "{business}"})
		    businessList.bindItems(oEvent.getParameter("selectedItem").getBindingContext().getPath() + "/businesses", oTemplate);
		},
		
		resetSearch: function() {
			this.getView().byId("searchField").setValue("");
			
			this.getView().byId("cmbBox").setValue("");
			this.getView().byId("groupsCB").setValue("");
			this.getView().byId("businessListItem").setValue("");
			
			this.getView().byId("searchResult").setVisible(false);
			
			this.getView().byId("searchField").focus();
		},
		
		resetLoc: function() {
			this.getView().byId("cmbBox").setValue("");
		},
		
		resetGroup: function() {
			this.getView().byId("groupsCB").setValue("");
		},
		
		resetBusiness: function() {
			this.getView().byId("businessListItem").setValue("");
		}
	});
});