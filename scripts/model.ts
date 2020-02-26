export class Model {

    /**
     * Model takes the initial value from Control and sets it to the current value 
     * selected in the Hit Count custom control. This will be updated in View and
     * changes as the user increments and decrements the value.
     */
    private _sevCurrentValue: string;
    private _repCurrentValue: string;
    private _impCurrentValue: string;
    private _taskFreqCurrentValue: string;

    constructor(sevCurrentValue, impCurrentValue, taskFreqCurrentValue, repCurrentValue) {
        this._sevCurrentValue = sevCurrentValue;
        this._repCurrentValue = repCurrentValue;
        this._taskFreqCurrentValue = taskFreqCurrentValue;
        this._impCurrentValue = impCurrentValue;
    }

    public setCurrentValue(value: string, fieldName: string) {
        if (value === undefined) {
            throw "Undefined value";
        }
        if(fieldName == 'severityField'){
            this._sevCurrentValue = String(value);
        }
        if(fieldName == 'implicationField'){
            this._impCurrentValue = String(value);
        }
        if(fieldName == 'taskFrequencyField'){
            this._taskFreqCurrentValue = String(value);
        }
        if(fieldName == 'reaptableField'){
            this._repCurrentValue = String(value);
        }
    }

    public decrementValue() {
    }

    public incrementValue() { 
    }

    public getCurrentValue(fieldName: string): string {
        if(fieldName == 'severityField'){
            return this._sevCurrentValue;
        }
        if(fieldName == 'implicationField'){
            return this._impCurrentValue;
        }
        if(fieldName == 'taskFrequencyField'){
            return this._taskFreqCurrentValue;
        }
        if(fieldName == 'reaptableField'){
            return this._repCurrentValue;
        }        
    }
 
    public calcValueFromInputs(currentValues) {
        console.log('**Debug** reapetable = ' + currentValues.reapetable)
        console.log('**Debug** implication = ' + currentValues.implication)
        console.log('**Debug** taskFrequency = ' + currentValues.taskFrequency)

        if(currentValues.reapetable != null && currentValues.implication != null && currentValues.taskFrequency != null){
            //TODO need set Calc Severity flag to false
            var RepeatablePrefix = currentValues.reapetable.substr(0,1)
            var TaskFrequencyPrefix = currentValues.taskFrequency.substr(0,1)
            var ImplicationPrefix = currentValues.implication.substr(0,1)            
            var severity = Number(RepeatablePrefix) * Number(TaskFrequencyPrefix) * Number(ImplicationPrefix);
                                                
            if (severity <= 20 )
            {
                this._sevCurrentValue = "Minor";                                     
            }
            else if (severity > 20 && severity <= 40 )
            {
                this._sevCurrentValue = "Medium";
            }
            else if (severity > 40 && severity <= 60 )
            {
                this._sevCurrentValue = "Major";
            }
            else if (severity > 60)
            {
                this._sevCurrentValue = "Critical";
            }       
        }
    }
}