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

    public buttonFunctionList: Array<string>;
    public buttonNameList: Array<string>;
    public fieldsList: Array<string>;
    public fieldsValues: Array<string>;
    private client: RestClient.WorkItemTrackingHttpClient4_1;
    private workItemType: string;
    private targetProject: string;
    private linkToParent: boolean;
    private titelPrev: string;

    constructor(buttonActions: string, buttonsNames: string, targetType: string, fieldsToCopy: string, targetProject: string, titelPrev: string, linkToParent: boolean) {
        this.titelPrev = titelPrev;
        this.linkToParent = linkToParent;
        fieldsToCopy = "System.Id," + fieldsToCopy;
        let fieldsValues = ",";// + fieldsValues -> when i will want to add values
        this.fieldsValues = fieldsValues.split(",");
        this.fieldsList = fieldsToCopy.split(",");
        let flag = false;
        this.fieldsList.forEach(element => {
            if (element == "System.TeamProject")
                flag = true;
        });
        if (flag == false)
            this.fieldsList.push("System.TeamProject");
        this.workItemType = targetType;
        this.targetProject = targetProject;
        this.buttonFunctionList = buttonActions.split(",");
        this.buttonNameList = buttonsNames.split(",");
        this.client = RestClient.getClient();
    }
    public buttonPressed(pressed: string): void {
        switch (pressed) {
            case "Convert Work Item": {
                this.ConvertWit()
                break;
            }
            case "Not a Bug": {
                this.NotABug()
                break;
            }
            case "New Task": {
                this.HPNewWit()
                break;
            }
            case "New Sub Task": {
                this.HPNewWit()
                break;
            }
            case "New Work Item": {
                this.CreateNewWit()
                break;
            }
            case "Command": {
                this.RunString(pressed);
            }
            default: {
                this.CreateNewWit();
            }
        }
    }
    private NotABug() {
        WorkItemFormService.getService().then(
            (service) => {
                service.getFieldValues(this.fieldsList).then((values) => {
                    this.ConvertWorkItem(values, true);
                })
            });
    }
    private ConvertWit() {
        WorkItemFormService.getService().then(
            (service) => {
                service.getFieldValues(this.fieldsList).then((values) => {
                    this.ConvertWorkItem(values);
                })
            });
    }
    private CreateNewWit() {
        WorkItemFormService.getService().then(
            (service) => {
                service.getFieldValues(this.fieldsList).then((values) => {
                    this.CreateNewWorkItem(values);
                    //this.createNewWorkItem3(values);
                })
            });
    }
    private CreateNewWorkItem(FieldsList: IDictionaryStringTo<Object>) {
        if (this.targetProject == "")
            this.targetProject = FieldsList["System.TeamProject"].toString();
        const id = FieldsList["System.Id"] ? FieldsList["System.Id"].toString() : '';
        let document: JsonPatchDocument;
        let tempDoc: Array<documentBuild> = [];
        if (this.targetProject == "")
            FieldsList["System.TeamProject"] = this.targetProject;
        if (FieldsList["System.Title"]) {
            FieldsList["System.Title"] = this.titelPrev + " " + FieldsList["System.Title"].toString();
        }
        else {
            FieldsList["System.Title"] = this.titelPrev
        }
        let index = 0;
        this.fieldsList.forEach(element => {
            let value = FieldsList[element] ? FieldsList[element].toString() : '';
            // add when want to set values 
            // if (this.fieldsValues[index] != "") {  
            //     value = this.fieldsValues[index];
            // }
            element = element.trim();
            if (element != "" && element != "System.Id" && element! + "System.TeamProject") {
                var x: documentBuild = { op: "add", path: "/fields/" + element, value: value };
                tempDoc.push(x);
            }
            index++;
        });
        document = tempDoc;
        this.client.createWorkItem(document, this.targetProject, this.workItemType, null, true).then(async (newWorkItem) => {
            alert("New " + this.workItemType + " created,in " + this.targetProject + ". ID : " + newWorkItem.id);
            tempDoc = [];
            if (this.linkToParent)
                WorkItemFormService.getService().then(
                    async (service2) => {
                        if (id == "") {
                            let relations: Array<WorkItemRelation> = new Array<WorkItemRelation>();
                            let rel: WorkItemRelation = {
                                attributes: { "isDeleted": "false", "isLocked": "false", "isNew": "false" },
                                rel: "System.LinkTypes.Hierarchy-Forward",
                                url: newWorkItem.url
                            }
                            relations.push(rel);
                            service2.addWorkItemRelations(relations).then(() => {
                                WorkItemService.WorkItemFormNavigationService.getService().then((service) => {
                                    service.openWorkItem(newWorkItem.id)
                                })
                            });
                        }
                        else {
                            this.client.getWorkItem(+id).then((workitem) => {
                                tempDoc.push({ op: "add", path: "/relations/-", value: { rel: "System.LinkTypes.Hierarchy-Reverse", url: workitem.url } })
                            }).then(() => {
                                document = tempDoc;  // test the new use
                                this.client.updateWorkItem(document, newWorkItem.id).then(() => {
                                    WorkItemService.WorkItemFormNavigationService.getService().then((service) => {
                                        service.openWorkItem(newWorkItem.id)
                                    })
                                });
                            });
                        }
                    })
        });
    }
    private ConvertWorkItem(FieldsList: IDictionaryStringTo<Object>, closeTheSource: boolean = false) {
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
                });
            })
        }
        else {
            document = tempDoc;  // test the new use
            this.client.createWorkItem(document, project, this.workItemType).then((newWorkItem) => {
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
    private HPNewWit() {
        WorkItemFormService.getService().then(
            (service) => {
                service.getFieldValues(["System.Id", "System.Title", "System.Description", "Custom.Stages", "Custom.Severityfield"]).then((value) => {
                    let id = "";
                    if (value["System.Id"])
                        id = value["System.Id"].toString();
                    this.HPCreateNewTask(this.workItemType, value["System.Title"].toString(), value["System.Description"].toString(),
                        id, value["Custom.Stages"].toString());//, value["Custom.Severityfield"].toString());
                })
            }
        );
    }
    private HPCreateNewTask(taskType: string, parentTitle: string, parentDescription: string, parentId: string, stage: string) {//, severity: string) {
        WorkItemService.WorkItemFormNavigationService.getService().then((service) => {
            let init: IDictionaryStringTo<Object> = {
                ["System.Title"]: "Sub Task of " + parentTitle,
                ["System.Description"]: parentDescription,
                ["Custom.Stages"]: stage,
                ["System.AreaId"]: "76"
                //["Custom.Severityfield"]: severity
            }
            if (taskType == "I Task") {
                init["Custom.TaskDescription"] = parentDescription;
                init["Custom.Title"] = "Task of " + parentTitle;
            }
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