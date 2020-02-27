import { Model } from "./model";
import { RedeployTriggerAction } from "ReleaseManagement/Core/Constants";

/**
 * Class view returns the view of a the control rendered to allow
 * the user to change the value.
 */

export class View {    
    private _model: Model; 
    constructor(private model: Model, private onInputChanged: Function, private onUpTick: Function, private onDownTick: Function) {
         
        this._model = model;
        this._init();
    }
    private _init(): void {
        var newLine = $("<br>");        
        $(".container").remove();
        var container = $("<div />");
        container.addClass("container");  
        this.model.list.forEach(element => {           
        let actionButton = $("<button />");  
        actionButton.text(element);
        actionButton.click(() => {this.model._buttonPressed(element);});
        container.append(newLine);
        container.append(actionButton);
        container.append(newLine) 
    });  
        $("body").append(container);
    }
}