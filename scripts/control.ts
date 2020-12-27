// import * as WitService from "TFS/WorkItemTracking/Services";
import { Model } from "./modelll";
import { View } from "./view";
import { ErrorView } from "./errorView";
import * as Q from "q";
export class Controller {
    private _actionsNames: string = "";   // list o fbutton functionality
    private _buttonsNames: string = "";   // list of button content
    private _targetType: string = "";     // work item type
    private _filedsToCopy: string = "";   // list of fields
    private _targetProject = "";          // project name
    private _preTitel: string;            // Aded text to title
    private _linkToParent: boolean;       // conect betwin wits
    private _inputs;                      //: IDictionaryStringTo<string>;
    private _model: Model;
    private _view: View;
    constructor() {
        this._initialize();
    }
    private _initialize(): void {
        this._inputs = VSS.getConfiguration().witInputs;
        this._actionsNames = this._inputs["ActionsNames"];
        this._buttonsNames = this._inputs["ButtonsNames"];
        this._targetType = (this._inputs["TargetType"]) ? this._inputs["TargetType"] : "";
        this._filedsToCopy = (this._inputs["FieldsToCopy"]) ? this._inputs["FieldsToCopy"] : "";
        this._targetProject = (this._inputs["TargetProject"]) ? this._inputs["TargetProject"] : "";
        this._preTitel = (this._inputs["PreTitel"]) ? this._inputs["PreTitel"] : "";
        this._linkToParent = this._inputs["LinkToParent"]; 
        // Q.spread(
        //     [
                // this._actionsNames,  // service.getFieldValue(this._dataTransferFieldName)                  
                // this._targetType,             // service.getFieldValue(this._targetType),
                // this._filedsToCopy,           // service.getFieldValue(this._filedsToCopy)
                // this._targetProject,
                // this._preTitel,
                // this._linkToParent
            // ],
            // (dataTransfer: string, targetType: string, fieldsToCopy: string, targetProject: string, preTitel: string, linkToParent: boolean) => {
                this._model = new Model(this._actionsNames,this._buttonsNames, this._targetType, this._filedsToCopy, this._targetProject, this._preTitel, this._linkToParent);
                this._view = new View(this._model);
                VSS.resize();
        //     }, this._handleError
        // ).then(null, this._handleError); 
    }
    private _handleError(error: string): void {
        new ErrorView(error);
    }
}

