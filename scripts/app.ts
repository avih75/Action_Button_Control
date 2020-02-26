import { Controller } from "./control";
import { IWorkItemLoadedArgs, IWorkItemFieldChangedArgs } from "TFS/WorkItemTracking/ExtensionContracts";
import { WorkItemFormService } from "TFS/WorkItemTracking/Services";

// save on ctr + s
$(window).bind("keydown", function (event: JQueryEventObject) {
    if (event.ctrlKey || event.metaKey) {
        if (String.fromCharCode(event.which) === "S") {
            event.preventDefault();
            WorkItemFormService.getService().then((service) => service.beginSaveWorkItem($.noop, $.noop));
        }
    }
});

var control: Controller;

var provider = () => {
    return {
        onLoaded: (workItemLoadedArgs: IWorkItemLoadedArgs) => {
            control = new Controller();
        },
        onFieldChanged: (fieldChangedArgs: IWorkItemFieldChangedArgs) => {
            var changedValue = fieldChangedArgs.changedFields[control.getFieldName()];
            if (changedValue !== undefined) {
                // control.updateExternal(changedValue, "reaptableField");
                // control.updateExternal(changedValue, "taskFrequencyField");
                // control.updateExternal(changedValue, "implicationField");
                // control.updateExternal(changedValue, "severityField");
            }
        }
    };
};

VSS.register(VSS.getContribution().id, provider);