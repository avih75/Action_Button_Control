import { WorkItemFormNavigationService, WorkItemFormService } from "TFS/WorkItemTracking/Services";
import { WorkItemTrackingHttpClient4_1, WorkItemTrackingHttpClient5 } from "TFS/WorkItemTracking/RestClient";
import { WorkItem, WorkItemExpand } from "TFS/WorkItemTracking/Contracts";
import { JsonPatchDocument } from "VSS/WebApi/Contracts";
import { documentBuild } from "./modelll";
export class Model2Widget {
    // private client: WorkItemTrackingHttpClient4_1;
    private client: WorkItemTrackingHttpClient5;
    public buttonPressed(pressed: string, data: string): void {
        switch (pressed) {
            case "Create Work Item": {
                this.WidgetCreateWorkItem(data);
                break;
            }
            case "Create Requisition": {
                this.WidgetCreateRequisition(data);
                break;
            }
            case "Create Bulk of Work Items": {
                this.WidgetCreateWorkItem(data);
                break;
            }
            case "Open URL": {
                window.open(data, '_blank');
                break;
            }
            default: {
                break;
            }
        }
    }
    private WidgetCreateWorkItem(taskType: string) {
        WorkItemFormNavigationService.getService().then((service) => {
            let init: IDictionaryStringTo<Object> = {
                ["System.Title"]: "New " + taskType
            }
            service.openNewWorkItem(taskType, init);
        })
    }
    private WidgetCreateRequisition(id: string) {
        WorkItemFormNavigationService.getService().then(async (service) => {

            let Ids: Array<number> = new Array<number>();
            let PNs = id.split(',');
            PNs.forEach(pn => {
                if (Number.isInteger(pn)) {
                    Ids.push(Number.parseInt(pn));
                }
                else {
                    alert("Wrong parts number ids");
                    return;
                }
            });
            let NonPOMPNs = await this.client.getWorkItems(Ids, null, null, WorkItemExpand.Fields);
            let cost = 0;
            let Currency = "";
            let Supplier = "";
            let Requestor = "";
            let GlAccount = "";
            let CostCenter = "";
            let first: boolean;
            let flag: boolean = true;
            NonPOMPNs.forEach(PNid => {
                if (first) {
                    Currency = PNid.fields["Custom.Currency"] ? PNid.fields["Custom.Currency"] : "";
                    Supplier = PNid.fields["Custom.Supplier"] ? PNid.fields["Custom.Supplier"] : "";
                    Requestor = PNid.fields["Custom.Supplier"] ? PNid.fields["Custom.Supplier"] : "";
                    GlAccount = PNid.fields["Custom.Supplier"] ? PNid.fields["Custom.Supplier"] : "";
                    CostCenter = PNid.fields["Custom.Supplier"] ? PNid.fields["Custom.Supplier"] : "";
                    cost = PNid.fields["Custom.Cost"];
                }
                else {
                    let checkCurrency = PNid.fields["Custom.Currency"] ? PNid.fields["Custom.Currency"] : "";
                    let checkSupplier = PNid.fields["Custom.Supplier"] ? PNid.fields["Custom.Supplier"] : "";
                    let checkRequestor = PNid.fields["Custom.Requestor"] ? PNid.fields["Custom.Requestor"] : "";
                    let checkGlAccount = PNid.fields["Custom.GlAccount"] ? PNid.fields["Custom.GlAccount"] : "";
                    let checkCostCenter = PNid.fields["Custom.CostCenter"] ? PNid.fields["Custom.CostCenter"] : "";
                    if ((Currency == checkCurrency) &&
                        (Supplier == checkSupplier) &&
                        (Requestor == checkRequestor) &&
                        (GlAccount == checkGlAccount) &&
                        (CostCenter == checkCostCenter)) {
                        cost += PNid.fields["Custom.Cost"];
                    }
                    else {
                        flag = false;
                    }
                }
            });
            if (flag) {
                // make all the ids as linked
                let init: IDictionaryStringTo<Object> = {
                    ["System.Title"]: "New Requisition" + id,
                    ["Custom.Currency"]: Currency,
                    ["Custom.Supplier"]: Supplier,
                    ["Custom.Requestor"]: Requestor,
                    ["Custom.GlAccount"]: GlAccount,
                    ["Custom.CostCenter"]: CostCenter,
                    ["Custom.cost"]: cost
                }
                service.openNewWorkItem("Requisition", init).then((newWorkItem: WorkItem) => {
                    let document: JsonPatchDocument;
                    let tempDoc: Array<documentBuild> = [];
                    WorkItemFormService.getService().then(
                        (service2) => {
                            // let relations: Array<WorkItemRelation> = new Array<WorkItemRelation>();
                            // let rel: WorkItemRelation = {
                            //     attributes: { "isDeleted": "false", "isLocked": "false", "isNew": "false" },
                            //     rel: "System.LinkTypes.Hierarchy-Forward",
                            //     url: newWorkItem.url
                            // }
                            // relations.push(rel);
                            // service2.addWorkItemRelations(relations).then(() => { service2.refresh() });
                        }
                    );
                })
            }
            else {
                alert("Data not align");
            }
        })
    }
}