sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";

	return Controller.extend("com.nbcu.controller.LoginPage", {
		submit: function(){
			var inp = this.getView().byId("input").getValue();
			var pwd = this.getView().byId("password").getValue();
			
			if(inp === "user" && pwd === "password") {
				window.open("http://www.nbcuniversal.com/","_self");
			} else {
				MessageToast.show("Please check your SSO id and Password", {
					duration: 5000
				});
			}
		},
		
		reset: function(){
			this.getView().byId("input").setValue("");
			this.getView().byId("password").setValue("");
		}
	});
});