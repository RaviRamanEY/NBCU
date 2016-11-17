sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";

	return Controller.extend("com.nbcu.controller.LoginPage", {
		onInit: function() {
			var controlData = {
				remember: false
			};
			
			var controlModel = new sap.ui.model.json.JSONModel(controlData);
			this.getView().setModel(controlModel);
		},
		
		onRememberMe: function() {
			console.log("eere");
			
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
		},		
		
		submit: function() {
			var inp = this.getView().byId("input").getValue();
			var pwd = this.getView().byId("password").getValue();
			
			if(inp === "aaaaa" && pwd === "password") {				
				
				console.log(this._getProperty("remember"));
				
				if(this._getProperty("remember")) {
					this._saveSSO(inp, pwd);					
				} else {
					this._removeSSO();
				}
				
				window.open("http://www.nbcuniversal.com/","_self");
			} else {
				MessageToast.show("Please check your SSO ID and Password", {
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
		}
	});
});