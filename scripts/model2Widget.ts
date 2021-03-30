import { WorkItemFormNavigationService } from "TFS/WorkItemTracking/Services";
import RestClient = require("TFS/WorkItemTracking/RestClient");
import { WorkItem, WorkItemExpand, WorkItemRelation } from "TFS/WorkItemTracking/Contracts";
import { JsonPatchDocument } from "VSS/WebApi/Contracts";
import { documentBuild } from "./modelll";
export class Model2Widget {
    $button: JQuery;
    $text: JQuery;
    private client: RestClient.WorkItemTrackingHttpClient4_1 = RestClient.getClient();
    public buttonPressed(pressed: string, data: string, text: JQuery, button: JQuery): void {
        this.$button = button;
        this.$text = text;
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
        let PNs = id.split(',');
        let message = "";
        PNs.forEach(pn => {
            if ((Number(pn) != NaN) && (Number.parseInt(pn).toString() == pn)) {
                Ids.push(Number.parseInt(pn));
            }
            else {
                message += "Wrong parts number ids (number only): " + id + "\n";
            }
        });
        if (Ids.length < PNs.length) {
            alert(message);
            return;
        }
        if (Ids.length > 0) {
            try {
                this.client.getWorkItems(Ids, null, null, WorkItemExpand.All).then((NonPOMPNs) => {
                    if (NonPOMPNs.length == 0) {
                        message += "Wrong parts number ids (not exists): " + id + "\n";
                    }
                    else {
                        message += this.CreateRequisitionWithPN(NonPOMPNs);
                    }
                    alert(message);
                });
            }
            catch (ex) {
                message += "There was a problem during handeling your request" + "\n";
                alert(message);
            }
        }
        else {
            message += "No ids to create Requisition!\n";
            alert(message);
        }
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
        let message = "";
        let document: JsonPatchDocument;
        let tempDoc: Array<documentBuild> = [];
        NonPOMPNs.forEach(PNid => {
            if (PNid.relations && PNid.relations.length > 0 && this.CheckIfAllreadyConnected(PNid.relations)) {
                message += "Part number " + PNid.id + " allready connected to other requsition\n";
                flag = false;
            }
            else {
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
                tempDoc.push({ op: "add", path: "/relations/-", value: { rel: "System.LinkTypes.Hierarchy-Forward", url: PNid.url } });; //"System.LinkTypes.Hierarchy-Forward"
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
                        message += "Part number " + PNid.id + " Data not align\n";
                        flag = false;
                    }
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
            message += "All data set... creating Requsition for all Pn\n";
            this.CreateTheRequsition(init, document);
        }
        return message;
    }
    private CheckIfAllreadyConnected(relations: WorkItemRelation[]) {
        let flag = false;
        relations.forEach((relation) => {
            if (relation.rel == "System.LinkTypes.Hierarchy-Reverse") {
                let parentUrl = relation.url.split('/');
                let parentID = parentUrl[parentUrl.length - 1];
                flag = true;
            }
        })
        return flag;
    }
    private CreateTheRequsition(init: IDictionaryStringTo<Object>, document: JsonPatchDocument) {
        WorkItemFormNavigationService.getService().then((service) => {
            service.openNewWorkItem("Requisition", init).then((newWorkItem: WorkItem) => {
                if (newWorkItem && newWorkItem.id > 0) {
                    this.client.updateWorkItem(document, newWorkItem.id);
                    this.$text.val("");
                }
            });
        })
    }
}