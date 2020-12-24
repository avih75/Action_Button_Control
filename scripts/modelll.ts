import { WorkItemFormService } from "TFS/WorkItemTracking/Services";
import { JsonPatchDocument } from "VSS/WebApi/Contracts";
import RestClient = require("TFS/WorkItemTracking/RestClient");
import WorkItemService = require("TFS/WorkItemTracking/Services");
import { WorkItem, WorkItemRelation } from "TFS/WorkItemTracking/Contracts";
import { GetCommand } from "./StorageHelper";

export class documentBuild {
    op: string;
    path: string;
    value: any;
}
export class Model {

    public buttonList: Array<string>;
    public fieldsList: Array<string>;
    private client: RestClient.WorkItemTrackingHttpClient4_1;
    private workItemType;

    constructor(dataTransfer: string, targetType: string, fieldsToCopy: string) {
        this.fieldsList = fieldsToCopy.split(",");
        let flag = false;
        this.fieldsList.forEach(element => {
            if (element == "System.TeamProject")
                flag = true;
        });
        if (flag == false)
            this.fieldsList.push("System.TeamProject");
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
            case "Not a Bug": {
                this.notABug()
                break;
            }
            case "New Task": {
                this.NewWit()
                break;
            }
            case "Create CAB Request": {
                this.NewCAB()
                break;
            }
            case "New Sub Task": {
                this.NewWit()
                break;
            }
            case "Duplicate": {
                this.NewWit()
                break;
            }
            default: {
                this.RunString(pressed);
            }
        }
    }
    private notABug() {
        WorkItemFormService.getService().then(
            (service) => {
                service.getFieldValues(this.fieldsList).then((values) => {
                    this.createNewWorkItem(values, true);
                })
            });
    }
    private createNewWit() {
        WorkItemFormService.getService().then(
            (service) => {
                service.getFieldValues(this.fieldsList).then((values) => {
                    this.createNewWorkItem(values);
                })
            });
    }
    private createNewWorkItem2(FieldsList: IDictionaryStringTo<Object>, closeTheSource: boolean = false) {
        let project: string = FieldsList["System.TeamProject"].toString();
        const id = FieldsList["System.Id"] ? FieldsList["System.Id"].toString() : '';
        let document: JsonPatchDocument;
        let tempDoc: Array<documentBuild> = [];
        // need to get the url
        this.fieldsList.forEach(element => {
            var x: documentBuild = { op: "add", path: "/fields/" + element, value: FieldsList[element] ? FieldsList[element].toString() : '' };
            tempDoc.push(x);
        });
        document = tempDoc;  // test the new use
        this.client.createWorkItem(document, project, this.workItemType).then((newWorkItem) => {
            alert("new " + this.workItemType + " was created, ID number : " + newWorkItem.id);
            if (newWorkItem != undefined && newWorkItem.id > 0) {
                let tempDoc: Array<documentBuild> = [];
                tempDoc.push({ op: "add", path: "/relations/-", value: { rel: "System.LinkTypes.Hierarchy", url: newWorkItem } })
                this.client.updateWorkItem(tempDoc, +id).then(() => alert("lined !"));
            }
        });
    }
    private createNewWorkItem(FieldsList: IDictionaryStringTo<Object>, closeTheSource: boolean = false) {
        let project: string = FieldsList["System.TeamProject"].toString();
        const id = FieldsList["System.Id"] ? FieldsList["System.Id"].toString() : '';
        let document: JsonPatchDocument;
        let tempDoc: Array<documentBuild> = [];
        // need to get the url
        this.fieldsList.forEach(element => {
            let x: documentBuild = { op: "add", path: "/fields/" + element, value: FieldsList[element] ? FieldsList[element].toString() : '' };
            tempDoc.push(x);
        });
        if (id != '') {
            this.client.getWorkItem(+id).then((workitem) => {
                tempDoc.push({ op: "add", path: "/relations/-", value: { rel: "System.LinkTypes.Hierarchy-Reverse", url: workitem } })
            }).then(() => {
                document = tempDoc;  // test the new use
                this.client.createWorkItem(document, project, this.workItemType).then((newWorkItem) => {
                    //alert("new " + this.workItemType + " was created, ID number : " + newWorkItem.id);
                    //if (closeTheSource)
                    //this.closeStateSave();
                });
            })
        }
        else {
            document = tempDoc;  // test the new use
            this.client.createWorkItem(document, project, this.workItemType).then((newWorkItem) => {
                //alert("new " + this.workItemType + " was created, ID number : " + newWorkItem.id);
                if (closeTheSource)
                    this.closeStateSave();
            });
        }
    }
    private closeStateSave() {
        WorkItemFormService.getService().then(
            (service) => {
                service.setFieldValue("System.State", "Closed").then(() => {
                    service.save;
                });
            });
    }
    // create new child by click
    private NewCAB() {
        WorkItemFormService.getService().then(
            (service) => {
                service.getFieldValues(["System.Id", "System.Title", "System.Description", "System.Risk","System.DueDate"]).then((value) => {
                    let id = "";
                    if (value["System.Id"])
                        id = value["System.Id"].toString();
                    this.CreateNewCAB(value["System.Title"].toString(), value["System.Description"].toString(), id, value["System.Risk"].toString(),value["System.DueDate"].toString());
                })
            }
        );
    }
    private CreateNewCAB(parentTitle: string, parentDescription: string, parentId: string, risk: string,dueDate: string) {
        WorkItemService.WorkItemFormNavigationService.getService().then((service) => {
            let init: IDictionaryStringTo<Object> = {
                ["System.Title"]: "Sub Task of " + parentTitle,
                ["System.Description"]: parentDescription,
                ["System.Risk"]: risk,
                ["System.DueDate"]: dueDate
            }
            service.openNewWorkItem("Change Request", init).then((newWorkItem: WorkItem) => {
                let document: JsonPatchDocument;
                let tempDoc: Array<documentBuild> = [];
                WorkItemFormService.getService().then(
                    (service2) => {
                        if (parentId != "") {
                            this.client.getWorkItem(+parentId).then((workitem) => {
                                tempDoc.push({ op: "add", path: "/relations/-", value: { rel: "System.LinkTypes.Hierarchy-Reverse", url: workitem.url } })
                            }).then(() => {
                                document = tempDoc;  // test the new use
                                this.client.updateWorkItem(document, newWorkItem.id);
                            }).then(() => {
                                service2.getWorkItemRelations().then((x) => {
                                    let w = x;
                                })
                            })
                        }
                        else {
                            let relations: Array<WorkItemRelation> = new Array<WorkItemRelation>();
                            let rel: WorkItemRelation = {
                                attributes: { "isDeleted": "false", "isLocked": "false", "isNew": "false" },
                                rel: "System.LinkTypes.Hierarchy-Forward",
                                url: newWorkItem.url
                            }
                            relations.push(rel);
                            service2.addWorkItemRelations(relations).then(() => { service2.refresh() });
                        }
                    }
                )
            })
        })
    }
    private NewWit() {
        WorkItemFormService.getService().then(
            (service) => {
                service.getFieldValues(["System.Id", "System.Title", "System.Description", "Custom.Stages", "Custom.Severityfield"]).then((value) => {
                    let id = "";
                    if (value["System.Id"])
                        id = value["System.Id"].toString();
                    this.CreateNewTask(this.workItemType, value["System.Title"].toString(), value["System.Description"].toString(),
                        id, value["Custom.Stages"].toString());//, value["Custom.Severityfield"].toString());
                })
            }
        );
    }
    private CreateNewTask(taskType: string, parentTitle: string, parentDescription: string, parentId: string, stage: string) {//, severity: string) {
        WorkItemService.WorkItemFormNavigationService.getService().then((service) => {
            let init: IDictionaryStringTo<Object> = {
                ["System.Title"]: "Sub Task of " + parentTitle,
                ["System.Description"]: parentDescription,
                ["Custom.Stages"]: stage,
                ["System.AreaId"]: "76"
                //["Custom.Severityfield"]: severity
            }
            if (taskType == "I Task")
                init["Custom.TaskDescription"] = parentDescription;
            service.openNewWorkItem(taskType, init).then((newWorkItem: WorkItem) => {
                let document: JsonPatchDocument;
                let tempDoc: Array<documentBuild> = [];
                WorkItemFormService.getService().then(
                    (service2) => {
                        if (parentId != "") {
                            this.client.getWorkItem(+parentId).then((workitem) => {
                                tempDoc.push({ op: "add", path: "/relations/-", value: { rel: "System.LinkTypes.Hierarchy-Reverse", url: workitem.url } })
                            }).then(() => {
                                document = tempDoc;  // test the new use
                                this.client.updateWorkItem(document, newWorkItem.id);
                            }).then(() => {
                                service2.getWorkItemRelations().then((x) => {
                                    let w = x;
                                })
                            })
                        }
                        else {
                            let relations: Array<WorkItemRelation> = new Array<WorkItemRelation>();
                            let rel: WorkItemRelation = {
                                attributes: { "isDeleted": "false", "isLocked": "false", "isNew": "false" },
                                rel: "System.LinkTypes.Hierarchy-Forward",
                                url: newWorkItem.url
                            }
                            relations.push(rel);
                            service2.addWorkItemRelations(relations).then(() => { service2.refresh() });
                        }
                    }
                )
            })
        })
    }
    private async RunString(Action: string) {
        let command: string = await GetCommand(Action);
        if (command != "") {
            this.RunAction(command);
        }
        else {
            alert("No Action Set");
        }
    }
    private RunAction(command: string) {
        return eval(command);
    }
}