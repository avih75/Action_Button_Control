import { WorkItemFormService } from "TFS/WorkItemTracking/Services";
import { JsonPatchDocument, JsonPatchOperation, Operation } from "VSS/WebApi/Contracts";
import RestClient = require("TFS/WorkItemTracking/RestClient");

export class Model {

    public buttonList: Array<string>;
    private client: RestClient.WorkItemTrackingHttpClient4_1;
    private workItemType;

    constructor(dataTransfer, targetType) {
        this.workItemType = targetType;
        this.buttonList = dataTransfer.split(",");
        this.client = RestClient.getClient();
    }

    public buttonPressed(pressed: string): void {
        switch (pressed) {
            case "Convert Work Item": {
                this.createNewWit()
                break;
            }
            default: {
                alert(pressed + " not implamented yet")
            }
        }
    }
    // convert to....
    private createNewWit() {
        WorkItemFormService.getService().then(
            (service) => {
                service.getFieldValues([
                    "System.Id",
                    "System.TeamProject",
                    "System.IterationId",
                    "System.AreaPath",
                    "System.Title",
                    "System.CreatedBy",
                    "System.Description",
                    "System.FoundIn"
                ]).then((values) => {
                    this.createNewWorkItem(values);
                })
            });
    }

    private createNewWorkItem(FieldsList: IDictionaryStringTo<Object>) {
        let project: string = FieldsList["System.TeamProject"].toString();
        let type: string = this.workItemType;
        const id = FieldsList["System.Id"] ? FieldsList["System.Id"].toString() : '';
        let document: JsonPatchDocument;
        if (id != '') {
            document = [
                { "op": "add", "path": "/fields/System.IterationId", "value": FieldsList["System.IterationId"] ? FieldsList["System.IterationId"].toString() : '' },
                { "op": "add", "path": "/fields/System.AreaPath", "value": FieldsList["System.AreaPath"] ? FieldsList["System.AreaPath"].toString() : '' },
                { "op": "add", "path": "/fields/System.Title", "value": FieldsList["System.Title"] ? FieldsList["System.Title"].toString() : '' },
                { "op": "add", "path": "/fields/System.CreatedBy", "value": FieldsList["System.CreatedBy"] ? FieldsList["System.CreatedBy"].toString() : '' },
                { "op": "add", "path": "/fields/System.Description", "value": FieldsList["System.Description"] ? FieldsList["System.Description"].toString() : '' },
                { "op": "add", "path": '/relations/-', "value": { rel: "System.LinkTypes.Hierarchy-Reverse", url: "http://elitebooki7:9090/tfs/DefaultCollection/_api/_wit/workitems/" + id } },
            ];
        }
        else {
            document = [
                { "op": "add", "path": "/fields/System.IterationId", "value": FieldsList["System.IterationId"] ? FieldsList["System.IterationId"].toString() : '' },
                { "op": "add", "path": "/fields/System.AreaPath", "value": FieldsList["System.AreaPath"] ? FieldsList["System.AreaPath"].toString() : '' },
                { "op": "add", "path": "/fields/System.Title", "value": FieldsList["System.Title"] ? FieldsList["System.Title"].toString() : '' },
                { "op": "add", "path": "/fields/System.CreatedBy", "value": FieldsList["System.CreatedBy"] ? FieldsList["System.CreatedBy"].toString() : '' },
                { "op": "add", "path": "/fields/System.Description", "value": FieldsList["System.Description"] ? FieldsList["System.Description"].toString() : '' },
            ];
        }
        this.client.createWorkItem(document, project, type).then((newWorkItem) => {
            alert("new " + this.workItemType + " was created, ID number : " + newWorkItem.id);
            this.closeStateSave();
        });
    }

    private closeStateSave() {
        WorkItemFormService.getService().then(
            (service) => {
                service.setFieldValue("System.State", "Closed").then(() => {
                    service.save;
                });
            });
    }
}