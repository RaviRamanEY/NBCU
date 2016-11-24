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
	//		var copyrightLabel = this.getView().byId("copyrightLabel");
	//		copyrightLabel.setText("\xA9" + " 2016 NBCUNIVERSAL MEDIA, LLC.");
			
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
			
		//	var oModel = new sap.ui.model.json.JSONModel();
		//	oModel.loadData("mockdata/data.json");
		//	this.getView().byId("searchResult").setModel(oModel);
			//
			var url = "/searchUser/solr/collection1/select?q=category:worker&wt=json&rows=10000";
			$.ajax({
				url: url,
				method: "get",
				dataType: "json",
				success: function(data, status, xhr) {
					var searchModel = new sap.ui.model.json.JSONModel(data);
					me.getView().byId("searchResult").setModel(searchModel);
					me.getView().byId("searchResult").setVisible(true);
					
					if(data.response.numFound > 1) {
					/*	me.getView().byId("clearResult").setVisible(true);*/
						me.getView().byId("btnFilter").setVisible(true);						
					}
				},
				error: function(xhr, status, error) {
					jQuery.sap.log.error("Error while searching. Status: " + status + " | Error: " + error);
				}
			});
			$.ajax({
				url: "/filter/api/v2/taxonomy/idm_location",
				method: "get",
				success: function(data, status, xhr) {
					data.data.unshift({"name":"All"});
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
					var okGroups = [];
					data.data.unshift({
						"name":"All",
						"tid": "All",
						"children": [
							{
								"name":"All",
								"tid": "All"
							}	
						]
					});
					
					jQuery.each(data.data, function(index, grp){
					/*	if(grp.children.length !== 0 && grp.name !== "All") {
							grp.children.unshift({
								"name":"All",
								"tid":"All"
							});
						}*/
						
						if(grp.children.length !== 0 ){
							if(grp.name ==="All"){
								okGroups.push(grp);
							}else{
								grp.children.unshift({
									"name":"All",
									"tid":"All"
								});
								okGroups.push(grp);
							}
						}
					});
					
					var oGrpModel = new sap.ui.model.json.JSONModel(okGroups);
					me.getView().byId("groupsCB").setModel(oGrpModel);
				},
				error: function(xhr, status, error) {
					jQuery.sap.log.error("Error while getting business segments. Status: " + status + " | Error: " + error);
				}
			});
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
				var msg = this.getView().getModel("i18n").getProperty("msgAuth");
				sap.m.MessageToast.show(msg, {
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
			this.getView().byId("btnFilter").setVisible(false);
		/*	this.getView().byId("clearResult").setVisible(false);*/
			/*if(sQuery === "") {
				MessageToast.show("Please enter employee name");
				return;
			}*/
			if(sQuery.indexOf("*") > -1 || sQuery.indexOf("?") > -1) {
				MessageToast.show("Wildcards (*, ?) are not supported. Please remove wildcards and try again.");
				return;
			}
			this.getView().byId("searchId").setText("Searching for  " +sQuery);
			var me = this;
			var url="";
			
			if(sQuery === ""){
				url = "/searchUser/solr/collection1/select?q=category:worker&wt=json&rows=200";
			}else{
				url= "/searchUser/solr/collection1/select?q=category:worker%20AND%20title:" + sQuery + "&wt=json&rows=200";
			}
			$.ajax({
				url: url,
				method: "get",
				dataType: "json",
				success: function(data, status, xhr) {
					var searchModel = new sap.ui.model.json.JSONModel(data);
					me.getView().byId("searchResult").setModel(searchModel);
					me.getView().byId("searchResult").setVisible(true);
					
					if(data.response.numFound > 1) {
					/*	me.getView().byId("clearResult").setVisible(true);*/
						me.getView().byId("btnFilter").setVisible(true);						
					}
				},
				error: function(xhr, status, error) {
					jQuery.sap.log.error("Error while searching. Status: " + status + " | Error: " + error);
				}
			});
		},
		
		dataLoaded: function() {
			if(this.getView().byId("searchResult").getItems().length > 15) {
				if(this.getView().byId("btnGoToTop")) {
					this.getView().byId("btnGoToTop").setVisible(true);
				}
			}
		},
		
		goToTop: function() {
			this.getView().byId("searchField").focus();
		},
		
		onNavigateFilter: function() {
			this.getView().byId("app2").to(this.getView().byId("filterPage"));
		},
		
		updateResults: function(oEvent) {
			var aFilter = [];
			var filter;

			if(this.getView().byId("cmbBox").getValue() && this.getView().byId("cmbBox").getValue().length >  0 && (this.getView().byId("cmbBox").getValue().split(',')[0] !== "All")){
				filter = new sap.ui.model.Filter("workcity", sap.ui.model.FilterOperator.Contains, this.getView().byId("cmbBox").getValue().split(',')[0]);
				aFilter.push(filter);
			}

			if(this.getView().byId("groupsCB").getValue() && this.getView().byId("groupsCB").getValue().length >  0 &&  this.getView().byId("groupsCB").getValue()!== "All" ){
				filter = new sap.ui.model.Filter("businesssegment", sap.ui.model.FilterOperator.Contains, this.getView().byId("groupsCB").getValue());
				aFilter.push(filter);
			}

			if(this.getView().byId("businessListItem").getValue() && this.getView().byId("businessListItem").getValue().length > 0 && this.getView().byId("businessListItem").getValue()!== "All"){
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
		    this.getView().byId("businessListItem").setValue("");
			this.getView().byId("businessListItem").setSelectedItem(null);
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
			this.getView().byId("btnGoToTop").setVisible(false);
		},
		
		resetLoc: function() {
			this.getView().byId("cmbBox").setValue("");
		},
		
		resetGroup: function() {
			this.getView().byId("groupsCB").setSelectedItem(null);
			this.getView().byId("businessListItem").setValue("");
			this.getView().byId("businessListItem").setSelectedItem(null);
			var businessList = this.byId("businessListItem");
			businessList.setEnabled(false);
		},
		
		resetBusiness: function() {
			this.getView().byId("businessListItem").setValue("");
		},
		imageLoad : function(oEvent){
			var img = oEvent.getSource();
			img.setSrc("images/default_user.png");
		},
		profileSelected: function(oEvent) {
			var bindingPath = oEvent.getParameters().listItem.getBindingContext().getPath();
			var model = oEvent.getSource().getModel();
			
			var profModel = new sap.ui.model.json.JSONModel(model.getProperty(bindingPath));
	
			this.getView().byId("profilePage").setModel(profModel);
			this.getView().byId("app2").to(this.getView().byId("profilePage"));
		
			this.getView().byId("searchResult").setSelectedItem(this.getView().byId("__xmlview0--searchResult").getSelectedItem(), false);
		},
		
		profileOK: function() {
			this.getView().byId("app2").to(this.getView().byId("searchPage"));
		
		}
	});
});