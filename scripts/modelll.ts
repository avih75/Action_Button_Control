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
    public targetFieldsList: Array<string>;
    public fieldsValues: Array<string>;
    private client: RestClient.WorkItemTrackingHttpClient4_1;
    //private workItemType: string;
    private workItemTypes: Array<string>;
    private targetProject: string;
    private linkToWit: Array<string>;
    private buyPass: boolean;
    private includeLinks: boolean;
    private includeAttachments: boolean;
    //private titelPrev: string;
    private titelPrevs: Array<string>;
    private mapFields: boolean;
    private mapValues: boolean;

    constructor(buttonActions: string, buttonsNames: string, targetTypes: string, fieldsToCopy: string, targetProject: string,
        titelPrev: string, linkToWit: string, fieldsValues: string, targetFieldsList: string, buyPass: boolean, includeLinks: boolean, includeAttachments: boolean) {
        this.titelPrevs = titelPrev.split(",");
        this.linkToWit = linkToWit.split(",");
        this.buyPass = buyPass;
        this.includeLinks = includeLinks;
        this.includeAttachments = includeAttachments;
        fieldsToCopy = "System.Id," + fieldsToCopy;
        this.fieldsList = fieldsToCopy.split(",");
        if (targetFieldsList != null && targetFieldsList != "") {
            this.targetFieldsList = targetFieldsList.split(",");
            if (this.targetFieldsList.length == this.fieldsList.length) {
                this.mapFields = true;
            }
        }
        if (fieldsValues != null && fieldsValues != "") {
            this.fieldsValues = fieldsValues.split(",");
            if (this.fieldsValues.length == this.fieldsList.length) {
                this.mapValues = true;
            }
        }
        let flag = false;
        this.fieldsList.forEach(element => {
            element = element.trim();
            if (element == "System.TeamProject")
                flag = true;
        });
        if (flag == false)
            this.fieldsList.push("System.TeamProject");
        //this.workItemType = targetType;
        this.workItemTypes = targetTypes.split(",");
        this.targetProject = targetProject;
        this.buttonFunctionList = buttonActions.split(",");
        this.buttonNameList = buttonsNames.split(",");
        this.client = RestClient.getClient();
    } 
    public buttonPressed(pressed: string,btnIndex: number): void { 
        switch (pressed) { 
            case "Convert Work Item": {
                this.ConvertWit(btnIndex)
                break;
            }
            case "Not a Bug": {
                this.NotABug(btnIndex)
                break;
            }
            case "New Task": {
                this.HPNewWit(btnIndex)
                break;
            }
            case "New Sub Task": {
                this.HPNewWit(btnIndex)
                break;
            }
            case "New Work Item": {
                this.CreateNewWit(btnIndex)
                break;
            }
            case "Command": {
                this.RunString(pressed);
            }
            case "Create Work Item": {
                this.WidgetCreateWorkItem(this.workItemTypes[btnIndex]);
            }
            case "Create Bulk of Work Items": {

                this.WidgetCreateWorkItem(this.workItemTypes[btnIndex]);
            }
            case "Open Query URL": {
                this.RunString(pressed);
            }
            default: {
                this.CreateNewWit(btnIndex);
            }
        }
    }
    private CreateNewWit(btnIndex: number) {
        WorkItemFormService.getService().then(
            (service) => {
                service.getFieldValues(this.fieldsList).then((values) => {
                    this.CreateNewWorkItem(values,btnIndex); 
                })
            });
    }
    private CreateNewWorkItem(FieldsList: IDictionaryStringTo<Object>,btnIndex: number) {
        if (this.targetProject == ""){
            this.targetProject = FieldsList["System.TeamProject"].toString();
        }
        const id = FieldsList["System.Id"] ? FieldsList["System.Id"].toString() : '';
        let document: JsonPatchDocument;
        let tempDoc: Array<documentBuild> = [];
        if (this.targetProject == ""){
            FieldsList["System.TeamProject"] = this.targetProject;
        }
        if (FieldsList["System.Title"]) {
            FieldsList["System.Title"] = this.titelPrevs[btnIndex] + " " + FieldsList["System.Title"].toString();
        }
        else {
            if (this.titelPrevs[btnIndex] == null || this.titelPrevs[btnIndex] == "")
            {
                FieldsList["System.Title"] = "No Title!! Action Button Avi Hadad";
            }
            else{
                FieldsList["System.Title"] = this.titelPrevs[btnIndex];
            }
        }
        this.fieldsList.forEach(element => {
            if (FieldsList[element] && FieldsList[element] != null && FieldsList[element] != "") {              
                element = element.trim();
                if (element != "" && element != "System.Id" && element != "System.TeamProject") {
                    if (FieldsList[element] instanceof Date){
                        var x: documentBuild = { op: "add", path: "/fields/" + element, value: new Date(FieldsList[element].toString()) }; //value
                    }
                    else{
                        var x: documentBuild = { op: "add", path: "/fields/" + element, value: FieldsList[element].toString() }; //value
                    }
                    tempDoc.push(x);
                }
            }
        });
        if (this.fieldsList.lastIndexOf("System.Title") == -1)
        {
            if (FieldsList["System.Title"] && FieldsList["System.Title"] != null && FieldsList["System.Title"] != "") {
                let value = FieldsList["System.Title"].toString();   
                var x: documentBuild = { op: "add", path: "/fields/System.Title", value: value };
                tempDoc.push(x);                
            }
        }
        document = tempDoc; 
        let workItemType: string = (this.workItemTypes[btnIndex]!=null && this.workItemTypes[btnIndex] != "")? this.workItemTypes[btnIndex] : "Child";
        this.client.createWorkItem(document, this.targetProject, workItemType, null, this.buyPass).then(async (newWorkItem) => {
            let selectedRel :string= this.GetRelName(this.linkToWit[btnIndex])
            WorkItemFormService.getService().then( async (service1) => {
                let tempDoc: Array<documentBuild> = [];
                let relations: Array<WorkItemRelation> = new Array<WorkItemRelation>();
                if (this.includeLinks){                
                    this.CreateLinks(id,btnIndex,selectedRel,relations,newWorkItem,document,service1,tempDoc)            
                }
                else if(this.includeAttachments){                 
                    this.CreateAttachment(id,btnIndex,selectedRel,relations,newWorkItem,document,service1,tempDoc)                
                }
                else if (selectedRel != ""){                
                    this.CreateRelatoin(id,btnIndex,selectedRel,relations,newWorkItem,document,service1,tempDoc)                  
                }
            })
        });
    }
    private CreateLinks(id: string,btnIndex: number,selectedRel: string,relations: Array<WorkItemRelation>,newWorkItem,document,service1,tempDoc: Array<documentBuild>){ 
        service1.getWorkItemRelations().then((relations) =>{
            let filteredRelations: Array<WorkItemRelation> = new Array<WorkItemRelation>(); 
            relations.forEach( rel => {
                if (rel.rel != "ArtifactLink"){
                    if (rel.rel == "System.LinkTypes.Related-Forward" || rel.rel == "System.LinkTypes.Hierarchy-Forward" || rel.rel == "System.LinkTypes.Hierarchy-Reverse"){
                        rel.rel = "System.LinkTypes.Related"
                    }
                    filteredRelations.push(rel)
                    tempDoc.push({ op: "add", path: "/relations/-", value: { rel: rel.rel, url: rel.url } });          
                }               
            })
            if(this.includeAttachments){
                this.CreateAttachment(id,btnIndex,selectedRel,filteredRelations,newWorkItem,document,service1,tempDoc)
            }
            else{
                this.CreateRelatoin(id,btnIndex,selectedRel,filteredRelations,newWorkItem,document,service1,tempDoc)
            }
        })
    }
    private CreateAttachment(id: string,btnIndex: number,selectedRel: string,relations: Array<WorkItemRelation>,newWorkItem,document,service1,tempDoc: Array<documentBuild>){ 
        //let x: WorkItemOptions;
        service1.getWorkItemAttachments().then((wI) =>{
            // build list of relation not include Parent\Child
            this.CreateRelatoin(id,btnIndex,selectedRel,relations,newWorkItem,document,service1,tempDoc)
        })        
    }
    private CreateRelatoin (id: string,btnIndex: number,selectedRel: string,relations: Array<WorkItemRelation>,newWorkItem,document,service1,tempDoc: Array<documentBuild>){            
        let typeName = this.ConvertRelName(selectedRel);
        //tempDoc  = []; 
        this.client.getWorkItem(+id).then((workitem) => {           
            tempDoc.push({ op: "add", path: "/relations/-", value: { rel: typeName, url: workitem.url } })             
        }).then(() => {
            document = tempDoc;
            this.client.updateWorkItem(document, newWorkItem.id).then(() => {
                WorkItemService.WorkItemFormNavigationService.getService().then((service) => {
                    service.openWorkItem(newWorkItem.id)
                })
            });
        });
    
        // if (id == "") {    
        //     // need to add the list from links and attachments                                   
        //     let rel: WorkItemRelation = {
        //         attributes: { "isDeleted": "false", "isLocked": "false", "isNew": "false" },
        //         rel: selectedRel,
        //         url: newWorkItem.url
        //     }
        //     relations.push(rel);
        // }
        // else {
        //     let tempDoc: Array<documentBuild> = []; 
        //     this.client.getWorkItem(+id).then((workitem) => {
        //         tempDoc.push({ op: "add", path: "/relations/-", value: { rel: this.ConvertRelName(selectedRel), url: workitem.url } })
        //     }).then(() => {
        //         document = tempDoc;  // test the new use
        //         this.client.updateWorkItem(document, newWorkItem.id);//.then(() => {
        //             // WorkItemService.WorkItemFormNavigationService.getService().then((service) => {
        //             //     service.openWorkItem(newWorkItem.id)
        //             // })
        //         //});
        //     });
        // }         
        // service1.addWorkItemRelations(relations).then(() => {
        //     WorkItemService.WorkItemFormNavigationService.getService().then((service) => {
        //         service.openWorkItem(newWorkItem.id)
        //     })
        // });

    }
    private GetRelName (TypeName: string){
        switch (TypeName) { 
            case null: {
                TypeName = "";
                break;
            }
            case "Child": {
                TypeName = "System.LinkTypes.Hierarchy-Forward";
                break;
            }
            case "Duplicate Of": {
                TypeName = "System.LinkTypes.Duplicate-Reverse";
                break;
            }
            case "Successor": {
                TypeName = "System.LinkTypes.Dependency";
                break;
            }
            case "Related": {
                TypeName = "System.LinkTypes.Related";
                break;
            }
            case "Tests": {
                TypeName = "Microsoft.VSTS.Common.TestedBy-Reverse";
                break;
            }
            case "Affects": {
                TypeName = "Microsoft.VSTS.Common.Affects-Forward";
                break;
            }
        }
        return TypeName
    }
    private ConvertRelName (TypeName: string){
        switch (TypeName) { 
            case "System.LinkTypes.Hierarchy-Forward": {
                TypeName = "System.LinkTypes.Hierarchy-Reverse";
                break;
            }
            case "Microsoft.VSTS.Common.Affects-Forward": {
                TypeName = "Microsoft.VSTS.Common.Affects-Reverse";
                break;
            }
            case "System.LinkTypes.Duplicate-Reverse": {
                TypeName = "System.LinkTypes.Duplicate-Forward";
                break;
            }
            case "Microsoft.VSTS.Common.TestedBy-Reverse": {
                TypeName = "Microsoft.VSTS.Common.TestedBy-Forward";
                break;
            }
        }
        return TypeName
    }
    private NotABug(btnIndex:number) {
        WorkItemFormService.getService().then(
            (service) => {
                service.getFieldValues(this.fieldsList).then((values) => {
                    this.ConvertWorkItem(values,btnIndex ,true);
                })
            });
    }
    private ConvertWit(btnIndex: number) {
        WorkItemFormService.getService().then(
            (service) => {
                service.getFieldValues(this.fieldsList).then((values) => {
                    this.ConvertWorkItem(values,btnIndex);
                })
            });
    }
    private ConvertWorkItem(FieldsList: IDictionaryStringTo<Object>,btnIndex: number ,closeTheSource: boolean = false) {
        let project: string = FieldsList["System.TeamProject"].toString();
        const id = FieldsList["System.Id"] ? FieldsList["System.Id"].toString() : '';
        let document: JsonPatchDocument;
        let tempDoc: Array<documentBuild> = []; 
        if (id != '') { 
            let x: documentBuild = { op: "add", path: "/fields/System.WorkItemType", value: this.workItemTypes[btnIndex] };
            tempDoc.push(x);
            document = tempDoc;
            this.client.updateWorkItem(document, +id, this.targetProject, null, true);
        }
        else { 
            this.fieldsList.forEach(element => {
                let x: documentBuild = { op: "add", path: "/fields/" + element, value: FieldsList[element] ? FieldsList[element].toString() : '' };
                tempDoc.push(x);
            });
            document = tempDoc;
            this.client.createWorkItem(document, this.targetProject, this.workItemTypes[btnIndex]);
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
    private HPNewWit(btnIndex: number) {
        WorkItemFormService.getService().then(
            (service) => {
                service.getFieldValues(["System.Id", "System.Title", "System.Description", "Custom.Stages", "Custom.Severityfield"]).then((value) => {
                    let id = "";
                    if (value["System.Id"])
                        id = value["System.Id"].toString();
                    this.HPCreateNewTask(this.workItemTypes[btnIndex], value["System.Title"].toString(), value["System.Description"].toString(),
                        id, value["Custom.Stages"].toString());
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
            }
            if (taskType == "I Task") {
                init["Custom.TaskDescription"] = parentDescription;
                init["System.Title"] = "Task of " + parentTitle;
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
                                document = tempDoc; 
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
    private WidgetCreateWorkItem(taskType:string) {
        WorkItemService.WorkItemFormNavigationService.getService().then((service) => {
            let init: IDictionaryStringTo<Object> = {
                ["System.Title"]: "New" + taskType
            }
            service.openNewWorkItem(taskType, init); 
        })
    }
    private HPCreateBulkWorkItems(taskType:string) {
        WorkItemService.WorkItemFormNavigationService.getService().then((service) => {
            let init: IDictionaryStringTo<Object> = {
                ["System.Title"]: "New" + taskType
            }
            service.openNewWorkItem(taskType, init); 
        })
    }
}