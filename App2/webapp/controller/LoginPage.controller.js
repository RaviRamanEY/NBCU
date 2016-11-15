sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("com.nbcu.controller.LoginPage", {
		onInit: function() {
						var oModel = new sap.ui.model.json.JSONModel();
			// load JSON file into model
			oModel.loadData("mockdata/data.json");
			// bind model to whole view 
			this.getView().setModel(oModel);
		},
		
		submit : function(){
			var inp= this.getView().byId("input").getValue();
			var pwd= this.getView().byId("password").getValue();
			
			if(inp == "user" && pwd == "password"){
				sap.m.MessageToast.show("Login Successful", {duration : 3000});
				//window.open("page.html");
				
				this.getView().byId("app2").to(this.getView().byId("page2")) ;
			}else{
				sap.m.MessageToast.show("Please check your SSO id and Password",{duration:3000});
			}
		},
		reset : function(){
			this.getView().byId("input").setValue("");
			this.getView().byId("password").setValue("");
		},
		
		onSearch : function(oEvent){		
			var oController= this;
			this.getView().byId("searchResult").setVisible(true);
			this.getView().byId("panel").setVisible(true);
			
			var aFilter = [];
			var sQuery = oEvent.getSource().getValue();
			
			if (sQuery && sQuery.length > 0) {
				var filter = new sap.ui.model.Filter("empName", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilter.push(filter);
			}
			
			var oList = this.getView().byId("searchResult");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);			
		},
		
		updateResults : function(oEvent){
			var aFilter=[];
			var filter;
			
			this.getView().byId("panel").setExpanded(false);
			
			if(this.getView().byId("searchField").getValue() && this.getView().byId("searchField").getValue().length >  0){
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
		},
		
		cancel : function(oEvent){
			this.getView().byId("panel").setVisible(false);
			this.getView().byId("cmbBox").setValue("");
			this.getView().byId("groupsCB").setValue("");
			this.getView().byId("businessListItem").setValue("");
		},
		
		onItemSelect : function(oEvent){
			var oList = this.getView().byId("searchResult");
			var businessList = this.byId("businessListItem");
		    var oTemplate = new sap.ui.core.ListItem({ key : "{business}", text : "{business}"})
		    businessList.bindItems(oEvent.getParameter("selectedItem").getBindingContext().getPath() + "/businesses", oTemplate);
		},
		
		resetSearch : function(){
			this.getView().byId("idSearchPage--searchField").setValue("");
			this.getView().byId("idSearchPage--panel").setExpandable(false);
			this.getView().byId("idSearchPage--cmbBox").setValue("");
			this.getView().byId("idSearchPage--groupsCB").setValue("");
			this.getView().byId("idSearchPage--businessListItem").setValue("");
			
			var oList = this.getView().byId("searchResult");
			oList.setBinding("");
		},
		
		resetLoc : function(){
			this.getView().byId("cmbBox").setValue("");
		},
		
		resetGroup : function(){
			this.getView().byId("groupsCB").setValue("");
		},
		
		resetBusiness : function(){
			this.getView().byId("businessListItem").setValue("");
		}
	});
});