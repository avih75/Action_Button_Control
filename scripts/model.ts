import * as WitService from "TFS/WorkItemTracking/Services"; 
import RestClient = require("TFS/WorkItemTracking/RestClient");
import { JsonPatchDocument } from "VSS/WebApi/Contracts";

export class Model {
    public list: Array<string>;
    private client: RestClient.WorkItemTrackingHttpClient4_1;
    constructor(dataTransfer) {
        this.list = dataTransfer.split(",");
        this.client = RestClient.getClient();
    }
    public _buttonPressed(pressed: string): void {
        var message: string = "pressed " + pressed;
        if (pressed == "Convert Bug") {
            alert('1');
            if (this._createNewWit(message)) {
                alert('2');
                this._closeStateSave();
            }
        }
        else if (pressed = "CalCulate") {
            message += " Not Implamented Yet"
        }
        else {
            message += " Wrong";
        }
        alert(message);
    }
    private _createNewWit(message: string): boolean {
        var FieldsList: { [FieldName: string]: string; } = {};
        var flag = false;
        WitService.WorkItemFormService.getService().then(
            (service) => {
                service.getFieldValue("System.Id").then((Id) => {
                    FieldsList['Id'] = Id.toString();
                    service.getFieldValue("System.TeamProject").then((TeamProject) => {
                        FieldsList['TeamProject'] = TeamProject.toString();
                        service.getFieldValue("System.IterationId").then((IterationId) => {
                            FieldsList['IterationId'] = IterationId.toString();
                            service.getFieldValue("System.AreaPath").then((AreaPath) => {
                                FieldsList['AreaPath'] = AreaPath.toString();
                                service.getFieldValue("System.Title").then((Title) => {
                                    FieldsList['Title'] = Title.toString();
                                    service.getFieldValue("System.CreatedBy").then((CreatedBy) => {
                                        FieldsList['CreatedBy'] = CreatedBy.toString();
                                        service.getFieldValue("System.Description").then((Description) => {
                                            FieldsList['Description'] = Description.toString();
                                            service.getFieldValue("System.FoundIn").then((FoundIn) => {
                                                FieldsList['FoundIn'] = FoundIn.toString();
                                                message = "id : " + Id.toString();
                                                alert('3');
                                                this._createNewWorkItem(message, FieldsList);
                                                flag = true;
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                });
            });
        return flag;
    }
    private async _createNewWorkItem(message: string, FieldsList: { [FieldName: string]: string; }) {
        var project: string = FieldsList["TeamProject"];
        if (project != undefined && project != "0") {
            let document: JsonPatchDocument = [
                { "op": "add", "path": "/fields/System.IterationId", "value": FieldsList["IterationId"] },
                { "op": "add", "path": "/fields/System.AreaPath", "value": FieldsList["AreaPath"] },
                { "op": "add", "path": "/fields/System.Title", "value": FieldsList["Title"] },
                { "op": "add", "path": "/fields/System.CreatedBy", "value": FieldsList["CreatedBy"] },
                { "op": "add", "path": "/fields/System.Description", "value": FieldsList["IterationId"] },
                { "op": "add", "path": "/fields/System.FoundIn", "value": FieldsList["FoundIn"] }
            ];
            var type: string = "Bug";
            var newWorkItem = await this.client.createWorkItem(document, project, type);
            alert(newWorkItem.id);
            return true;
        }
        else {
            alert('No Id number');
            return false;
        }
    }
    private _closeStateSave() {
        WitService.WorkItemFormService.getService().then(
            (service) => {
                service.setFieldValue("System.State", "Closed");
            });
    }
}