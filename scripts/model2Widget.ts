import WorkItemService = require("TFS/WorkItemTracking/Services"); 
export class Model2Widget {
    public buttonPressed(pressed: string, type: string): void {
        switch (pressed) {
            case "Create Work Item": {
                this.WidgetCreateWorkItem(type);
                break;
            }
            case "Create Bulk of Work Items": {
                this.WidgetCreateWorkItem(type);
                break;
            }
            case "Open URL": {
                window.open(type, '_blank'); 
                break;
            }
            default: { 
                break;
            }
        }
    }
    private WidgetCreateWorkItem(taskType: string) { 
        WorkItemService.WorkItemFormNavigationService.getService().then((service) => {
            let init: IDictionaryStringTo<Object> = {
                ["System.Title"]: "New " + taskType
            }
            service.openNewWorkItem(taskType, init); 
        })
    }
}