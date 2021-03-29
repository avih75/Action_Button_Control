import { WorkItemFormNavigationService, WorkItemFormService } from "TFS/WorkItemTracking/Services";
import RestClient = require("TFS/WorkItemTracking/RestClient");
import { WorkItem, WorkItemExpand } from "TFS/WorkItemTracking/Contracts";
import { JsonPatchDocument } from "VSS/WebApi/Contracts";
import { documentBuild } from "./modelll";
export class Model2Widget {
    private client: RestClient.WorkItemTrackingHttpClient4_1 = RestClient.getClient();
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
        let Ids: Array<number> = new Array<number>();
        let PNs = id.split(';');
        PNs.forEach(pn => {
            if (Number(pn) != NaN) {
                Ids.push(Number.parseInt(pn));
            }
            else {
                alert("Wrong parts number ids (number only): " + id);
                return;
            }
        });
        if (Ids.length > 0)
            try {
                this.client.getWorkItems(Ids, null, null, WorkItemExpand.Fields).then((NonPOMPNs) => {
                    if (NonPOMPNs.length == 0) {
                        alert("Wrong parts number ids (not exists): " + id);
                    }
                    else {
                        this.CreateRequisitionWithPN(NonPOMPNs);
                    }
                });
            }
            catch (ex) {
                alert("There was a problem during handeling your request");
            }
        else
            alert("No ids to create Requisition!");
    }
    private CreateRequisitionWithPN(NonPOMPNs: WorkItem[]) {
        let cost = 0;
        let Currency = "";
        let Supplier = "";
        let Requestor = "";
        let GlAccount = "";
        let CostCenter = "";
        let DepartmentSection = "";
        let BudgetType = "";
        let first: boolean = true;
        let flag: boolean = true;
        let document: JsonPatchDocument;
        let tempDoc: Array<documentBuild> = [];
        NonPOMPNs.forEach(PNid => {
            let checkCurrency = PNid.fields["Custom.Currency"] ? PNid.fields["Custom.Currency"] : "";
            let checkSupplier = PNid.fields["Custom.Supplier"] ? PNid.fields["Custom.Supplier"] : "";
            let checkRequestor = PNid.fields["Custom.Requestor"] ? PNid.fields["Custom.Requestor"] : "";
            let checkGlAccount = PNid.fields["Custom.G_LAccount"] ? PNid.fields["Custom.G_LAccount"] : "";
            let checkCostCenter = PNid.fields["Custom.CostCenter_"] ? PNid.fields["Custom.CostCenter_"] : "";
            BudgetType = PNid.fields["Custom.BudgetType"] ? PNid.fields["Custom.BudgetType"] : "";
            DepartmentSection = PNid.fields["Custom.DepartmentandSection"];
            let checkPrice = Number.parseInt(PNid.fields["Custom.PriceperUOM"]);
            let checkQuantity = Number.parseInt(PNid.fields["Custom.Quantity"]);
            cost += checkPrice * checkQuantity;
            tempDoc.push({ op: "add", path: "/relations/-", value: { rel: "System.LinkTypes.Related", url: PNid.url } })
            if (first) {
                Currency = checkCurrency;
                Supplier = checkSupplier;
                Requestor = checkRequestor;
                GlAccount = checkGlAccount;
                CostCenter = checkCostCenter;
                first = false;
            }
            else {
                if (!((Currency == checkCurrency) &&
                    (Supplier == checkSupplier) &&
                    (Requestor == checkRequestor) &&
                    (GlAccount == checkGlAccount) &&
                    (CostCenter == checkCostCenter))) {
                    flag = false;
                }
            }
        });
        document = tempDoc;
        if (flag) {
            let init: IDictionaryStringTo<Object> = {
                ["System.Title"]: "New Requisition",
                ["Custom.Currency"]: Currency,
                ["Custom.Supplier"]: Supplier,
                ["Custom.Requestor"]: Requestor,
                ["Custom.G_LAccount"]: GlAccount,
                ["Custom.CostCenter_"]: CostCenter,
                ["Custom.OrderCost"]: cost,
                ["Custom.DepartmentandSection"]: DepartmentSection,
                ["Custom.BudgetType"]: BudgetType
            }
            this.CreateTheRequsition(init, document);
        }
        else {
            alert("Data not align");
        }
    }
    private CreateTheRequsition(init: IDictionaryStringTo<Object>, document: JsonPatchDocument) {
        WorkItemFormNavigationService.getService().then((service) => {
            service.openNewWorkItem("Requisition", init).then((newWorkItem: WorkItem) => {
                this.client.updateWorkItem(document, newWorkItem.id);
            }); 
        })
    }
}