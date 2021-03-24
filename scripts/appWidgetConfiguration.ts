import WidgetHelpers = require("TFS/Dashboards/WidgetHelpers");

let WidgetConfigurationContext: any;

VSS.register("ActionButtonWidget.Configuration", function () {
    let $addNewButton = $("#addNewButton");
    return {
        load: function (widgetSettings, widgetConfigurationContext) {
            WidgetConfigurationContext = widgetConfigurationContext;
            let settings = JSON.parse(widgetSettings.customSettings.data);
            if (settings && settings.buttons) {
                SetTheView(settings.buttons);
            }
            $addNewButton.click(() => {
                AddNewButton();
                UpdateConfigurations();
            });
            VSS.resize();
            return WidgetHelpers.WidgetStatusHelper.Success();
        },
        onSave: function () {
            var customSettings = {
                data: JSON.stringify({
                    buttons: GetButtonList()
                })
            };
            return WidgetHelpers.WidgetConfigurationSave.Valid(customSettings);
        }
    }
});

function GetButtonList() {
    var x = document.getElementsByClassName("li");
    let result = "";
    var i;
    for (i = 0; i < x.length; i++) {
        result += x[i].innerHTML +";";
    } 
    result = result.substring(0,result.length-1);
    return result;
}
function AddNewButton() {
    let buttonName = $('#buttonTitle');
    let buttonACtion = $('#buttonAction');
    let buttonWit = $('#buttonWit');
    let button: string = buttonName.val() + "," + buttonACtion.val() + "," + buttonWit.val();
    AddButtonToView(button);
    VSS.resize();
    buttonName.val("");
    buttonACtion.val("");
    buttonWit.val("");
}
function SetTheView(data: string) {
    let buttons: string[] = data.split(';');
    buttons.forEach(button => {
        AddButtonToView(button);
        UpdateConfigurations();
    });
}
function AddButtonToView(button: string) {
    let $ulList = $("#list");
    let $li = $('<li>');
    let $label = $('<label>');
    $label.addClass("li");
    $label.css("margin-left","5px;")
    $label.text(button);
    let removeButton = $('<button>');
    removeButton.text("X").click(() => {
        $li.remove();
    })
    $li.append(removeButton);
    $li.append($label);
    $ulList.append($li);
}
function UpdateConfigurations() {
    var customSettings = {
        data: JSON.stringify({
            buttons: GetButtonList()
        })
    };
    var eventName = WidgetHelpers.WidgetEvent.ConfigurationChange;
    var eventArgs = WidgetHelpers.WidgetEvent.Args(customSettings);
    WidgetConfigurationContext.notify(eventName, eventArgs);
}