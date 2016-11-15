sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/nbcu/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("com.nbcu.Component", {

		metadata: {
			manifest: "json"
		},

		init: function() {
			UIComponent.prototype.init.apply(this, arguments);
			this.setModel(models.createDeviceModel(), "device");
		}
	});
});