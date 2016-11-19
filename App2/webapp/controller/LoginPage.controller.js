sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";

	return Controller.extend("com.nbcu.controller.LoginPage", {
		_getData: function() {
			jQuery.sap.log.info("");
		},
		
		onInit: function() {
			var controlData = {
				remember: false
			};
			
			var controlModel = new sap.ui.model.json.JSONModel(controlData);
			this.getView().setModel(controlModel);
		},
		
		onRememberMe: function() {
			if(this._getProperty("remember")) {
				this._setProperty("remember", false);
			} else {
				this._setProperty("remember", true);
			}
		},
		
		_getProperty: function(prop) {
			var control = JSON.parse(this.getView().getModel().getJSON());
			return control[prop];
		},
		
		_setProperty: function(prop, value) {
			var control = JSON.parse(this.getView().getModel().getJSON());
			control[prop] = value;
			
			this.getView().getModel().setData(control);
		},
		
		onAfterRendering: function() {
			var me = this;
			var copyrightLabel = this.getView().byId("copyrightLabel");
			copyrightLabel.setText("\xA9" + " 2016 NBCUNIVERSAL MEDIA, LLC.");
			
			var cookieString = document.cookie;
			var cookies = cookieString.split(";");
			
			for(var i = 0; i < cookies.length; i++) {
				if(cookies[i].trim().split("=")[0] === "sso_id") {
					this.getView().byId("input").setValue(cookies[i].trim().split("=")[1]);
					this._setProperty("remember", true);
				}
				
				if(cookies[i].trim().split("=")[0] === "sso_id_pwd") {
					this.getView().byId("password").setValue(cookies[i].trim().split("=")[1]);
				}
			}
			
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData("mockdata/data.json");
			this.getView().byId("searchResult").setModel(oModel);
			
			$.ajax({
				url: "/filter/api/v2/taxonomy/idm_location",
				method: "get",
				success: function(data, status, xhr) {
					var oLocModel = new sap.ui.model.json.JSONModel(data);
					me.getView().byId("cmbBox").setModel(oLocModel);
				},
				error: function(xhr, status, error) {
					jQuery.sap.log.error("Error while getting locations. Status: " + status + " | Error: " + error);
				}
			});
			
			$.ajax({
				url: "/filter/api/v2/taxonomy/idm_businesssegment",
				method: "get",
				success: function(data, status, xhr) {
					var oLocModel = new sap.ui.model.json.JSONModel(data);
					me.getView().byId("groupsCB").setModel(oLocModel);
				},
				error: function(xhr, status, error) {
					jQuery.sap.log.error("Error while getting business segments. Status: " + status + " | Error: " + error);
				}
			});
			
			var oGrpModel = new sap.ui.model.json.JSONModel();
			oGrpModel.loadData("mockdata/groups.json");
			this.getView().byId("groupsCB").setModel(oGrpModel);
		},		
		
		submit: function() {
			var inp = this.getView().byId("input").getValue();
			var pwd = this.getView().byId("password").getValue();
			
			if(inp === "206505549" && pwd === "password") {				
				if(this._getProperty("remember")) {
					this._saveSSO(inp, pwd);					
				} else {
					this._removeSSO();
				}
				
				this.getView().byId("app2").to(this.getView().byId("searchPage"));
			} else {
				sap.m.MessageToast.show("Please check your SSO id and Password", {
					duration: 5000
				});
			}
		},
		
		_saveSSO: function(inp, pwd) {
			document.cookie = "sso_id=" + inp;
			document.cookie = "sso_id_pwd=" + pwd;
		},
		
		_removeSSO: function() {
			document.cookie = "sso_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
			document.cookie = "sso_id_pwd=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
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
			
			var me = this;
			
			$.ajax({
				url: "/searchUser/solr/collection1/select?q=category:worker%20AND%20title:" + sQuery + "&wt=json",
				method: "get",
				dataType: "json",
				success: function(data, status, xhr) {
					var searchModel = new sap.ui.model.json.JSONModel(data);
					me.getView().byId("searchResult").setModel(searchModel);
					me.getView().byId("searchResult").setVisible(true);
					
					if(data.response.numFound > 1) {
						me.getView().byId("btnFilter").setVisible(true);						
					}
				},
				error: function(xhr, status, error) {
					jQuery.sap.log.error("Error while searching. Status: " + status + " | Error: " + error);
				}
			});
		},
		
		onNavigateFilter: function() {
			this.getView().byId("app2").to(this.getView().byId("filterPage"));
		},
		
		updateResults: function(oEvent) {
			var aFilter = [];
			var filter;
						
			if(this.getView().byId("searchField").getValue() && this.getView().byId("searchField").getValue().length > 0) {
				filter = new sap.ui.model.Filter("firstname", sap.ui.model.FilterOperator.Contains, this.getView().byId("searchField").getValue());
				aFilter.push(filter);
			}

			if(this.getView().byId("cmbBox").getValue() && this.getView().byId("cmbBox").getValue().length >  0){
				filter = new sap.ui.model.Filter("workcity", sap.ui.model.FilterOperator.Contains, this.getView().byId("cmbBox").getValue());
				aFilter.push(filter);
			}

			if(this.getView().byId("groupsCB").getValue() && this.getView().byId("groupsCB").getValue().length >  0){
				filter = new sap.ui.model.Filter("businesssegment", sap.ui.model.FilterOperator.Contains, this.getView().byId("groupsCB").getValue());
				aFilter.push(filter);
			}

			if(this.getView().byId("businessListItem").getValue() && this.getView().byId("businessListItem").getValue().length > 0){
				filter = new sap.ui.model.Filter("subbusinesssegment", sap.ui.model.FilterOperator.Contains, this.getView().byId("businessListItem").getValue());
				aFilter.push(filter);
			}

			var oList = this.getView().byId("searchResult");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
			
			this.getView().byId("app2").to(this.getView().byId("searchPage"));
		},
		
		cancel: function(oEvent) {
			this.getView().byId("app2").to(this.getView().byId("searchPage"));
		},
		
		onItemSelect: function(oEvent) {
			var businessList = this.getView().byId("businessListItem");
		    var bus = this.getView().byId("groupsCB").getModel().getProperty(oEvent.getParameter("selectedItem").getBindingContext().getPath() + "/children");
		    var busModel = new sap.ui.model.json.JSONModel(bus);
		    businessList.setModel(busModel);
		    businessList.setEnabled(true);
		},
		
		resetSearch: function() {
			this.getView().byId("searchField").setValue("");
			
			this.getView().byId("cmbBox").setValue("");
			this.getView().byId("groupsCB").setSelectedItem(null);
			this.getView().byId("businessListItem").setValue("");
			
			this.getView().byId("businessListItem").setEnabled(false);
			this.getView().byId("searchResult").setVisible(false);
			this.getView().byId("searchField").focus();
			
			this.getView().byId("btnFilter").setVisible(false);
		},
		
		resetLoc: function() {
			this.getView().byId("cmbBox").setValue("");
		},
		
		resetGroup: function() {
			this.getView().byId("groupsCB").setSelectedItem(null);
			var businessList = this.byId("businessListItem");
			businessList.setEnabled(false);
		},
		
		resetBusiness: function() {
			this.getView().byId("businessListItem").setValue("");
		}
	});
});