import WidgetHelpers = require("TFS/Dashboards/WidgetHelpers");
import { Model2Widget } from "./model2Widget";

WidgetHelpers.IncludeWidgetStyles();
VSS.register("ButtonsWidget", function () {
    let getQueryInfo = function (widgetSettings) {
        var settings = JSON.parse(widgetSettings.customSettings.data);
        let container = $('#buttons-container');
        if (!settings || !settings.buttons) {
            container.empty();
            container.text("Sorry nothing to show, please configure a buttons");
            return WidgetHelpers.WidgetStatusHelper.Success();
        }
        else {
            let model = new Model2Widget();
            container.empty();
            let buttonsQuantity: string[] = settings.buttons.split(';');
            buttonsQuantity.forEach(button => {
                let val: string[] = button.split(',');
                if (val.length > 0) {
                    let $buttonElement = $('<button>');
                    $buttonElement.text(val[0]);
                    $buttonElement.css("width","100%");
                    $buttonElement.css("margin-top","5px");
                    $buttonElement.click(() => {
                        let input = $("#inputData");
                        if (val[1] == "Create Requisition") {
                            let inputData: string = input.val();
                            if (inputData && inputData != "")
                                model.buttonPressed(val[1], inputData,input,$buttonElement);
                            else
                                alert("No PNs Ids");
                        }
                        else {
                            model.buttonPressed(val[1], val[2],input,$buttonElement);
                        }
                    })
                    container.append($buttonElement);
                    container.append($("<br/>"));
                }
            });
            return WidgetHelpers.WidgetStatusHelper.Success();
        }
    }
    return {
        load: function (widgetSettings) {
            return getQueryInfo(widgetSettings);
        },
        reload: function (widgetSettings) {
            return getQueryInfo(widgetSettings);
        }
    }
});