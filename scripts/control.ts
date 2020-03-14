import * as WitService from "TFS/WorkItemTracking/Services";
import { Model } from "./modelll";
import { View } from "./view";
import { ErrorView } from "./errorView";
import * as Q from "q";

export class Controller {
    private _dataTransferFieldName: string = "";
    private _targetType: string = "";
    private _filedsToCopy: string = "";
    private _inputs: IDictionaryStringTo<string>;
    private _model: Model;
    private _view: View;

    constructor() {
        this._initialize();
    }
    private _initialize(): void {
        this._inputs = VSS.getConfiguration().witInputs;
        this._dataTransferFieldName = this._inputs["DataTransfer"];
        this._targetType = this._inputs["TargetType"];
        this._filedsToCopy = this._inputs["FieldsToCopy"];
        WitService.WorkItemFormService.getService().then(
            (service) => {
                Q.spread(
                    [service.getFieldValue(this._dataTransferFieldName),
                    service.getFieldValue(this._targetType),
                    service.getFieldValue(this._filedsToCopy)
                    ],
                    (dataTransfer: string, targetType: string, fieldsToCopy: string) => {
                        this._model = new Model(dataTransfer, targetType, fieldsToCopy);
                        this._view = new View(this._model)
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

