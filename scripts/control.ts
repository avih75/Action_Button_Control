
/** The class control.ts will orchestrate the classes of InputParser, Model and View
 *  in order to perform the required actions of the extensions. 
 */

import * as WitService from "TFS/WorkItemTracking/Services";
import { Model } from "./model";
import { View } from "./view";
import { ErrorView } from "./errorView";
import * as Q from "q";

export class Controller {
    private _dataTransferFieldName: string = ""; 
    private _inputs: IDictionaryStringTo<string>;
    private _model: Model;
    private _view: View;

    constructor() {
        this._initialize();
    }
    private _initialize(): void {
        this._inputs = VSS.getConfiguration().witInputs;
        this._dataTransferFieldName = this._inputs["DataTransfer"];  
        WitService.WorkItemFormService.getService().then(

            (service) => {
                Q.spread(
                    [service.getFieldValue(this._dataTransferFieldName)],
                    (dataTransfer: string) => {                        
                        this._model = new Model(dataTransfer);
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
    private _updateInternal(value: string, fieldName: string, updateHtml: boolean): any {
        WitService.WorkItemFormService.getService().then(
            (service) => {
                if(fieldName == 'dataTransfer'){
                service.setFieldValue(this._dataTransferFieldName, value).then(
                    () => {
                        this._update(value, fieldName, updateHtml);
                   }, this._handleError);
                }   
            },
            this._handleError
        );
    }
    private _update(value: string, fieldName: string, updateHtml: boolean): void {                 
         if(updateHtml == true){                     
        }
    } 
    public getFieldName(): string {
        return ""; 
    }
}

