import * as WitService from "TFS/WorkItemTracking/Services";
import { Model } from "./modelll";
import { View } from "./view";
import { ErrorView } from "./errorView";
import * as Q from "q";
export class Controller {
    private _actionsNames: string = "";
    private _targetType: string = "";
    private _filedsToCopy: string = "";
    private _targetProject = "";
    private _inputs: IDictionaryStringTo<string>;
    private _model: Model;
    private _view: View;

    constructor() {
        this._initialize();
    }
    private _initialize(): void {
        this._inputs = VSS.getConfiguration().witInputs;
        this._actionsNames = this._inputs["DataTransfer"];
        this._targetType = (this._inputs["TargetType"]) ? this._inputs["TargetType"] : "";
        this._filedsToCopy = (this._inputs["FieldsToCopy"]) ? this._inputs["FieldsToCopy"] : "";
        this._targetProject = (this._inputs["TargetProject"]) ? this._inputs["TargetProject"] : "";
        WitService.WorkItemFormService.getService().then(
            (service) => {
                Q.spread(
                    [
                        this._actionsNames,  // service.getFieldValue(this._dataTransferFieldName)                  
                        this._targetType,             // service.getFieldValue(this._targetType),
                        this._filedsToCopy,           // service.getFieldValue(this._filedsToCopy)
                        this._targetProject
                    ],
                    (dataTransfer: string, targetType: string, fieldsToCopy: string, targetProject: string) => {
                        this._model = new Model(dataTransfer, targetType, fieldsToCopy, targetProject);
                        this._view = new View(this._model);
                        VSS.resize();
                    }, this._handleError
                ).then(null, this._handleError);
            },
            this._handleError
        );
    }
    private _handleError(error: string): void {
        new ErrorView(error);
    }
}

