import { WorkItemFormService } from "TFS/WorkItemTracking/Services";
import { JsonPatchDocument, JsonPatchOperation, Operation } from "VSS/WebApi/Contracts";
import RestClient = require("TFS/WorkItemTracking/RestClient");

export class Model {

    public list: Array<string>;
    private client: RestClient.WorkItemTrackingHttpClient4_1;
    private workItemType: string = 'Bug';

    constructor(dataTransfer) {
        this.list = dataTransfer.split(",");
        this.client = RestClient.getClient();
    }

    public _buttonPressed(pressed: string): void {
        let message: string = "pressed " + pressed;
        switch (pressed) {
            case "Convert Bug": {
                if (this.createNewWit(message)) {
                    this._closeStateSave();
                }
                else {
                    message = 'problem';
                }
            }
            case "CalCulate": {
                message += " Not Implamented Yet";
            }
            default: {
                message += " Wrong";
            }
        }
    }

    private createNewWit(message: string): boolean {
        var flag = false;
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
                    this.createNewWorkItem(message, values);
                })
            });
        return flag;
    }

    private createNewWorkItem(message: string, FieldsList: IDictionaryStringTo<Object>) {
        let project: string = FieldsList["System.TeamProject"].toString();
        let patchesList = []
        const id = FieldsList["System.Id"] ? FieldsList["System.Id"].toString() : '';
        if (id != '') {
            // let x :JsonPatchOperation = { op: Operation.Add, path: '/relations/-', value: { rel: 'System.LinkTypes.Hierarchy-Reverse', url: 'http://elitebooki7:9090/tfs/DefaultCollection/_api/_wit/workitems/' + id } };
            patchesList.push({ op: 'add', path: '/relations/-', value: { rel: 'System.LinkTypes.Hierarchy-Reverse', url: 'http://elitebooki7:9090/tfs/DefaultCollection/_api/_wit/workitems/' + id } });
            //document = [x];
        }
        patchesList.push({ op: 'add', path: '/fields/System.IterationId', value: FieldsList["System.IterationId"] ? FieldsList["System.IterationId"].toString() : '' });
        patchesList.push({ op: 'add', path: '/fields/System.AreaPath', value: FieldsList["System.AreaPath"] ? FieldsList["System.AreaPath"].toString() : '' });
        patchesList.push({ op: 'add', path: '/fields/System.Title', value: FieldsList["System.Title"] ? FieldsList["System.Title"].toString() : '' });
        patchesList.push({ op: 'add', path: '/fields/System.CreatedBy', value: FieldsList["System.CreatedBy"] ? FieldsList["System.CreatedBy"].toString() : '' });
        patchesList.push({ op: 'add', path: '/fields/System.Description', value: FieldsList["System.Description"] ? FieldsList["System.Description"].toString() : '' });


        // let document: JsonPatchDocument = [
        //     { "op": "add", "path": "/fields/System.IterationId", "value": FieldsList["System.IterationId"] ? FieldsList["System.IterationId"].toString() : '' },
        //     { "op": "add", "path": "/fields/System.AreaPath", "value": FieldsList["System.AreaPath"] ? FieldsList["System.AreaPath"].toString() : '' },
        //     { "op": "add", "path": "/fields/System.Title", "value": FieldsList["System.Title"] ? FieldsList["System.Title"].toString() : '' },
        //     { "op": "add", "path": "/fields/System.CreatedBy", "value": FieldsList["System.CreatedBy"] ? FieldsList["System.CreatedBy"].toString() : '' },
        //     { "op": "add", "path": "/fields/System.Description", "value": FieldsList["System.Description"] ? FieldsList["System.Description"].toString() : '' },
        //     //{ "op": "add", "path": '/relations/-', "value": { rel: "System.LinkTypes.Hierarchy-Reverse", url: "http://elitebooki7:9090/tfs/DefaultCollection/_api/_wit/workitems/2" } },
        // ];
        let document: JsonPatchDocument = [patchesList];
        let type: string = this.workItemType;
        this.client.createWorkItem(document, project, type).then((newWorkItem) => {
            message += " " + newWorkItem.id;
            alert(message);
        });
    }

    private _closeStateSave() {
        WorkItemFormService.getService().then(
            (service) => {
                service.setFieldValue("System.State", "Closed");
            });
    }
}