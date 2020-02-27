export class Model {

    /**
     * Model takes the initial value from Control and sets it to the current value 
     * selected in the Hit Count custom control. This will be updated in View and
     * changes as the user increments and decrements the value.
     */
    public _dataTransferCurVal: string; 
    public list: Array<string>;

    constructor(dataTransferCurVal) {
        this._dataTransferCurVal = dataTransferCurVal; 
        this.list = dataTransferCurVal.split(",");
    }
 
    public _buttonPressed(pressed: string): void { 
        alert(pressed);         
    }
}