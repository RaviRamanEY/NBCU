sap.ui.controller("loginpage.SearchPage", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf loginpage.SearchPage
*/
	onInit: function() {
			var oController= this;
			var oModel = new sap.ui.model.json.JSONModel();
			// load JSON file into model
			oModel.loadData("mockdata/data.json");
			// bind model to whole view 
			this.getView().setModel(oModel);
	},
	

	
	onSearch : function(oEvent){		
			var oController= this;
			sap.ui.getCore().byId("idSearchPage--searchResult").setVisible(true);
			sap.ui.getCore().byId("idSearchPage--panel").setVisible(true);
			var aFilter = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new sap.ui.model.Filter("empName", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilter.push(filter);
			}
			var oList = sap.ui.getCore().byId("idSearchPage--searchResult");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);			
	},
	
	updateResults : function(oEvent){
		var aFilter=[];
		sap.ui.getCore().byId("idSearchPage--panel").setExpanded(false);
		if(sap.ui.getCore().byId("idSearchPage--searchField").getValue() && sap.ui.getCore().byId("idSearchPage--searchField").getValue().length >  0){
			var filter = new sap.ui.model.Filter("empName", sap.ui.model.FilterOperator.Contains, sap.ui.getCore().byId("idSearchPage--searchField").getValue());
			aFilter.push(filter);
		}
		if(sap.ui.getCore().byId("idSearchPage--cmbBox").getValue() && sap.ui.getCore().byId("idSearchPage--cmbBox").getValue().length >  0){
			var filter = new sap.ui.model.Filter("location", sap.ui.model.FilterOperator.Contains, sap.ui.getCore().byId("idSearchPage--cmbBox").getValue());
			aFilter.push(filter);
		}
		if(sap.ui.getCore().byId("idSearchPage--groupsCB").getValue() && sap.ui.getCore().byId("idSearchPage--groupsCB").getValue().length >  0){
			var filter = new sap.ui.model.Filter("group", sap.ui.model.FilterOperator.Contains, sap.ui.getCore().byId("idSearchPage--groupsCB").getValue());
			aFilter.push(filter);
		}
		if(sap.ui.getCore().byId("idSearchPage--businessListItem").getValue() && sap.ui.getCore().byId("idSearchPage--businessListItem").getValue().length > 0){
			var filter = new sap.ui.model.Filter("business", sap.ui.model.FilterOperator.Contains, sap.ui.getCore().byId("idSearchPage--businessListItem").getValue());
			aFilter.push(filter);
		}
		var oList = sap.ui.getCore().byId("idSearchPage--searchResult");
		var oBinding = oList.getBinding("items");
		oBinding.filter(aFilter);
	},
	
	cancel : function(oEvent){
		sap.ui.getCore().byId("idSearchPage--panel").setVisible(false);
		sap.ui.getCore().byId("idSearchPage--cmbBox").setValue("");
		sap.ui.getCore().byId("idSearchPage--groupsCB").setValue("");
		sap.ui.getCore().byId("idSearchPage--businessListItem").setValue("");
		
	},
	
	onItemSelect : function(oEvent){
		var oList = this.getView().byId("idSearchPage--searchResult");
		var businessList = this.byId("businessListItem");
	    var oTemplate = new sap.ui.core.ListItem({ key : "{business}", text : "{business}"})
	    businessList.bindItems(oEvent.getParameter("selectedItem").getBindingContext().getPath() + "/businesses", oTemplate);
	},
	resetSearch : function(){
		sap.ui.getCore().byId("idSearchPage--searchField").setValue("");
		sap.ui.getCore().byId("idSearchPage--panel").setExpandable(false);
		sap.ui.getCore().byId("idSearchPage--cmbBox").setValue("");
		sap.ui.getCore().byId("idSearchPage--groupsCB").setValue("");
		sap.ui.getCore().byId("idSearchPage--businessListItem").setValue("");
		var oList = sap.ui.getCore().byId("idSearchPage--searchResult");
		var oBinding = oList.setBinding("");
	},
	resetLoc : function(){
		sap.ui.getCore().byId("idSearchPage--cmbBox").setValue("");
	},
	resetGroup : function(){
		sap.ui.getCore().byId("idSearchPage--groupsCB").setValue("");
	},
	resetBusiness : function(){
		sap.ui.getCore().byId("idSearchPage--businessListItem").setValue("");
	}
	
	

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf loginpage.SearchPage
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf loginpage.SearchPage
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf loginpage.SearchPage
*/
//	onExit: function() {
//
//	}

});