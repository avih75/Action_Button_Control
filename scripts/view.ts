import { Model } from "./model";
import { RedeployTriggerAction } from "ReleaseManagement/Core/Constants";

/**
 * Class view returns the view of a the control rendered to allow
 * the user to change the value.
 */

export class View {
    
    private dataTransferCurVal: string = ""; 

    constructor(private model: Model, private onInputChanged: Function, private onUpTick: Function, private onDownTick: Function) {
        this._init();
    }

    private _init(): void {

        var newLine = $("<br>");        
        $(".container").remove();
        var container = $("<div />");
        container.addClass("container");     
 
        var actionButton = $("<button />"); 
        var actionLable = $("<Label />")
        actionLable.addClass("workitemcontrol-label")
        actionLable.text('Action');  
        actionButton.click(() => { 
        }).on("input", (evt: JQueryKeyEventObject) => {
            this._inputChanged('taskFrequencyField', 'taskFreqClass', evt); 
        });
        container.append(actionLable);
        container.append(actionButton);
        container.append(newLine)  

        $("body").append(container);
    }

    private _inputChanged(fieldName: string, JQselector: string, evt: JQueryKeyEventObject): void {
        let newValue = $(evt.target).val()
        if (newValue!="")
        {
            let element= $(evt.target);
            element.css({
                background: "rgb(255, 255, 255)"
            })
        }
        if (this.onInputChanged) {
            this.onInputChanged(newValue, fieldName);
        }
    }

    public update(value: string, fieldName: string) {
        if(fieldName == 'severityField'){
            this.dataTransferCurVal = String(value);
            $(".sevClass").val(this.dataTransferCurVal);
        } 
    }

    public getCurrentValues() :any{
        var currentValues = {
            dataTransfer: $(".dataTransferClass").val()     
        }
        return currentValues;
    }
}