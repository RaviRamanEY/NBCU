sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("com.nbcu.controller.LoginPage", {
		submit : function(){
			var inp= this.getView().byId("input").getValue();
			var pwd= this.getView().byId("password").getValue();
			
			if(inp=="user" && pwd=="password"){
				sap.m.MessageToast.show("Login Successful");
				//add url later
				window.open("http://www.nbcuniversal.com/","_self");
			}else{
				sap.m.MessageToast.show("Please check your SSO id and Password");
			}
		},
		reset : function(){
			this.getView().byId("input").setValue("");
			this.getView().byId("password").setValue("");
		}
	});
});