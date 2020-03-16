import { WorkItemFormService } from "TFS/WorkItemTracking/Services";
import { JsonPatchDocument } from "VSS/WebApi/Contracts";
import RestClient = require("TFS/WorkItemTracking/RestClient");

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
    private newCreatedUser: string;

    constructor(dataTransfer, targetType, fieldsToCopy, changeCreatedBy) {
        this.newCreatedUser = changeCreatedBy;
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
            case "Change Created By": {
                if (this.newCreatedUser == undefined) {
                    alert(this.newCreatedUser + 'no user selected');
                }
                else {
                    this.changeCreatedBy();
                }
                break;
            }
            default: {
                alert(pressed + " not implamented yet")
            }
        }
    }
    private changeCreatedBy() {
        // System.CreatedBy
        WorkItemFormService.getService().then(
            (service) => {
                //service.setFieldValue('System.CreatedBy', this.newCreatedUser);
                service.getFieldValues(['System.Id','System.TeamProject']).then((parameters:IDictionaryStringTo<any>) => {
                    this.changeCreatedByID(parameters['System.Id'],parameters['System.TeamProject']);
                })
            });
    }
    private changeCreatedByID(Id: number, Project: string) {
        let document: JsonPatchDocument = [
            {op: "Replace", path: "/fields/System.CreatedBy", value: this.newCreatedUser }
        ]
        this.client.updateWorkItem(document, Id, Project, true).then((workitem)=>{
            alert(workitem.id) 
        });
    }
    // convert to....
    private createNewWit() {
        WorkItemFormService.getService().then(
            (service) => {                
                service.getFieldValues(this.fieldsList).then((values) => {
                    this.createNewWorkItem(values);
                })
            });
    }
    private createNewWorkItem(FieldsList: IDictionaryStringTo<Object>) {
        let project: string = FieldsList["System.TeamProject"].toString();
        const id = FieldsList["System.Id"] ? FieldsList["System.Id"].toString() : '';
        
        let document: JsonPatchDocument;
        let tempDoc: Array<documentBuild> = [];
        // need to get the url

        this.fieldsList.forEach(element => {
            var x: documentBuild = { op: "add", path: "/fields/" + element, value: FieldsList[element] ? FieldsList[element].toString() : '' };
            tempDoc.push(x);
        });
        if (id != '') {
            this.client.getWorkItem(+id).then((workitem)=>{
                tempDoc.push({ op: "add", path: "/relations/-", value: { rel: "System.LinkTypes.Hierarchy-Reverse", url: workitem } })
            }).then(()=>{
                document = tempDoc;  // test the new use
                this.client.createWorkItem(document, project, this.workItemType).then((newWorkItem) => {
                    alert("new " + this.workItemType + " was created, ID number : " + newWorkItem.id);
                    this.closeStateSave();
                });
            })

        }
        else
        {
            document = tempDoc;  // test the new use
            this.client.createWorkItem(document, project, this.workItemType).then((newWorkItem) => {
                alert("new " + this.workItemType + " was created, ID number : " + newWorkItem.id);
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

}