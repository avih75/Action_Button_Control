
/** The class control.ts will orchestrate the classes of InputParser, Model and View
 *  in order to perform the required actions of the extensions. 
 */

import * as WitService from "TFS/WorkItemTracking/Services";
import { Model } from "./model";
import { View } from "./view";
import { ErrorView } from "./errorView";
import * as Q from "q";

export class Controller {
    private _severityFieldName: string = "";
    private _implicationFieldName: string = "";
    private _taskFrequencyFieldName: string = "";
    private _reaptableFieldName: string = "";

    private _inputs: IDictionaryStringTo<string>;
    private _model: Model;
    private _view: View;

    constructor() {
        this._initialize();
    }

    private _initialize(): void {
        this._inputs = VSS.getConfiguration().witInputs;
        this._severityFieldName = this._inputs["SeveriryField"];
        this._reaptableFieldName = this._inputs["Repeatable"];
        this._taskFrequencyFieldName = this._inputs["TaskFrequencyField"];
        this._implicationFieldName = this._inputs["ImplicationField"];

        WitService.WorkItemFormService.getService().then(
            (service) => {
                Q.spread(
                    [service.getFieldValue(this._severityFieldName), 
                     service.getFieldValue(this._implicationFieldName),
                     service.getFieldValue(this._taskFrequencyFieldName),
                     service.getFieldValue(this._reaptableFieldName)],
                    (sevCurrentValue: string, impCurrentValue: string, taskFreqCurrentValue: string, repCurrentValue: string) => {
                       
                        this._updateInternal(sevCurrentValue, 'severityField', true)
                        this._updateInternal(impCurrentValue, 'implicationField', true)
                        this._updateInternal(repCurrentValue, 'reaptableField', true)
                        this._updateInternal(taskFreqCurrentValue, 'taskFrequencyField', true)
                                            
                        // dependent on view, model, and inputParser refactoring
                        this._model = new Model(sevCurrentValue, impCurrentValue, taskFreqCurrentValue, repCurrentValue);
                        this._view = new View(this._model, (val, fieldName) => {
                            this._updateInternal(val, fieldName, true); 
                            if (fieldName!="severityField")
                            {
                            service.getFieldValue('Repeatable').then((Repeatable) =>{
                                service.getFieldValue('Implication').then((Implication) =>{
                                    service.getFieldValue('Task Frequency').then((TaskFrequency) =>{
                                        service.getFieldValue('Calc severity').then((CalcSeverity) =>{                             
                                            this._model.calcValueFromInputs(this._view.getCurrentValues());
                                            this._updateInternal(this._model.getCurrentValue('severityField'), 'severityField', true);
                                            console.log('**Debug** CurrentValue = ' + this._model.getCurrentValue('severityField'))   
                                        });
                                     });  
                                });
                            })}
                        }, (fieldName) => {
                            this._model.incrementValue();
                            this._updateInternal(this._model.getCurrentValue(fieldName), fieldName, false);
                        }, (fieldName) => {
                            this._model.decrementValue();
                            this._updateInternal(this._model.getCurrentValue(fieldName), fieldName, false);
                        })
                    }, this._handleError
                ).then(null, this._handleError);
            },
            this._handleError);
    }

    private _handleError(error: string): void {
        new ErrorView(error);
    }

    private _updateInternal(value: string, fieldName: string, updateHtml: boolean): any {
        WitService.WorkItemFormService.getService().then(
            (service) => {
                if(fieldName == 'severityField'){
                service.setFieldValue(this._severityFieldName, value).then(
                    () => {
                        this._update(value, fieldName, updateHtml);
                   }, this._handleError);
                }
                else  if(fieldName == 'implicationField'){
                    service.setFieldValue(this._implicationFieldName, value).then(
                        () => {
                            this._update(value, fieldName, updateHtml);
                        }, this._handleError);
                    }
                else  if(fieldName == 'taskFrequencyField'){
                    service.setFieldValue(this._taskFrequencyFieldName, value).then(
                        () => {
                            this._update(value, fieldName, updateHtml);
                        }, this._handleError);
                    }
                else  if(fieldName == 'reaptableField'){
                    service.setFieldValue(this._reaptableFieldName, value).then(
                        () => {
                            this._update(value, fieldName, updateHtml);
                        }, this._handleError);
                    }
            },
            this._handleError
        );
    }
    private _update(value: string, fieldName: string, updateHtml: boolean): void {
        this._model.setCurrentValue(value, fieldName);
        if(updateHtml == true){
            this._view.update(value, fieldName);
        }
    } 
    public getFieldName(): string {
        return ""; 
    }
}

