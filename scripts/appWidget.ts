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
            $('.Title').text(settings.Title)
            let buttonsQuantity: string[] = settings.buttons.split(';');
            buttonsQuantity.forEach(button => {
                let val: string[] = button.split(',');
                if (val.length > 0) {
                    let $jqueryElemnt: JQuery;
                    if (val[1] == "Open URL") {
                        $jqueryElemnt = $('<div>');
                        let $a = $('<a>');
                        $jqueryElemnt.addClass("aToButton");
                        $jqueryElemnt.css("height", "30px");
                        $a.attr("href", val[2]); 
                        $a.attr("target", "_parent");
                        $a.text(val[0]);
                        $a.css("color", "white");
                        $a.addClass("center");
                        $jqueryElemnt.append($a);
                    }
                    else if (val[1] == "Create Requisition") {
                        $jqueryElemnt = $('<div>');
                        let $input = $('<input>');
                        $input.attr('type', 'text');
                        $input.css("width", "100%");
                        $input.css("margin-top", "5px");
                        let $button = $('<button>');
                        $button.text(val[0]);
                        $button.css("height", "30px");
                        $button.css("width", "100%");
                        $button.css("background-color", "blue");
                        $button.css("font-size", "medium");
                        $button.css("color", "white");
                        $button.click(() => {
                            let inputData: string = $input.val();
                            if (inputData && inputData != "")
                                model.buttonPressed(val[1], inputData, $input, $jqueryElemnt);
                            else
                                alert("No PNs Ids");
                        });
                        $jqueryElemnt.append($button);
                        $jqueryElemnt.append($input);
                    }
                    else {
                        $jqueryElemnt = $('<button>');
                        $jqueryElemnt.css("background-color", "blue");
                        $jqueryElemnt.text(val[0]);
                        $jqueryElemnt.css("font-size", "medium");
                        $jqueryElemnt.css("color", "white");
                        $jqueryElemnt.click(() => {
                            model.buttonPressed(val[1], val[2], null, $jqueryElemnt);
                        });
                        $jqueryElemnt.css("height", "30px");
                    }
                    $jqueryElemnt.css("width", "100%");
                    $jqueryElemnt.css("margin-top", "5px");
                    container.append($jqueryElemnt);
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