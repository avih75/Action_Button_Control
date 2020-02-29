import * as WitService from "TFS/WorkItemTracking/Services";
import { ErrorView } from "./errorView";

export class Model { 
    /**
     * Model takes the initial value from Control and sets it to the current value 
     * selected in the Hit Count custom control. This will be updated in View and
     * changes as the user increments and decrements the value.
     */
    //public _dataTransferCurVal: string; 
    public list: Array<string>;

    constructor(dataTransfer) {
        //this._dataTransferCurVal = dataTransferCurVal; 
        this.list = dataTransfer.split(",");
    }
 
    public _buttonPressed(pressed: string): void {   
        var message: string = "pressed " + pressed;
        if (pressed=="Convert Bug"){
            if(this._createNewWit(message)){
                this._closeStateSave();
            }
        }
        else if(pressed="CalCulate"){
            message += " Not Implamented Yet"
        }
        else
        {
            message += " Wrong";
        }
        alert(message);
    }  
    
    private _createNewWit (message:string) :boolean {
        WitService.WorkItemFormService.getService().then(
            (service) => {
                // let list = service.getFieldValues;            
                service.getFieldValue("Buttons.Button1").then((obj)=>{
                    message += obj.toString();
                    alert(message);
                });
            });
        return true;
    }

    private _closeStateSave () {

    }
}