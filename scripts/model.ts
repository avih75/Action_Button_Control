export class Model {

    /**
     * Model takes the initial value from Control and sets it to the current value 
     * selected in the Hit Count custom control. This will be updated in View and
     * changes as the user increments and decrements the value.
     */
    private _dataTransferCurVal: string; 

    constructor(dataTransferCurVal) {
        this._dataTransferCurVal = dataTransferCurVal; 
    }

    public setCurrentValue(value: string, fieldName: string) {
        if (value === undefined) {
            throw "Undefined value";
        }
        if(fieldName == 'dataTransferField'){
            this._dataTransferCurVal = String(value);
        } 
    }

    public decrementValue() {
    }

    public incrementValue() { 
    }

    public getCurrentValue(fieldName: string): string {
        if(fieldName == 'dataTransferField'){
            return this._dataTransferCurVal;
        }        
    }
 
    public calcValueFromInputs(currentValues) {
        console.log('**Debug** dataTransferCurVal = ' + currentValues._dataTransfer)        
    }
}