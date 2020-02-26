import { Model } from "./model";
import { RedeployTriggerAction } from "ReleaseManagement/Core/Constants";

/**
 * Class view returns the view of a the control rendered to allow
 * the user to change the value.
 */

export class View {
    
    private impCurrentValue: string = "";
    private taskFreqCurrentValue: string = "";
    private repCurrentValue: string = "";
    private sevCurrentValue: string = "";

    constructor(private model: Model, private onInputChanged: Function, private onUpTick: Function, private onDownTick: Function) {
        this._init();
    }

    private _init(): void {

        var newLine = $("<br>");        
        $(".container").remove();
        var container = $("<div />");
        container.addClass("container");     

        //  Frequency field
        var taskFreqWrap = $("<div />"); 
        var taskFreqLB = $("<Label />")
        taskFreqLB.addClass("workitemcontrol-label")
        taskFreqLB.text('Task Frequency');
        taskFreqLB.attr('for', 'taskFreq'); 
        var taskFreqTB = $("<select />");
        taskFreqTB.attr("id", "taskFreq")
        //taskFreqTB.attr("style", "width: 100%;")
        taskFreqTB.css({
            width: "100%",
            background: "rgb(247, 248, 195)"
        });
        taskFreqWrap.append(taskFreqTB);
        taskFreqTB.attr("aria-valuenow", this.taskFreqCurrentValue);
        taskFreqTB.addClass("taskFreqClass");
        taskFreqTB.change(() => { 
        }).on("input", (evt: JQueryKeyEventObject) => {
            this._inputChanged('taskFrequencyField', 'taskFreqClass', evt); 
        });
        var freqItem1 = $("<option />").attr("value", "1.Once a month or more");
        var freqItem2 = $("<option />").attr("value", "2.Once a week");
        var freqItem3 = $("<option />").attr("value", "3.Several times a week");
        var freqItem4 = $("<option />").attr("value", "4.Daily");
        var freqItem5 = $("<option />").attr("value", "5.Several times a day");
        freqItem1.attr("label", "1.Once a month or more");
        freqItem2.attr("label", "2.Once a week");
        freqItem3.attr("label", "3.Several times a week");
        freqItem4.attr("label", "4.Daily");
        freqItem5.attr("label", "5.Several times a day");
        taskFreqTB.append(freqItem1);
        taskFreqTB.append(freqItem2);
        taskFreqTB.append(freqItem3);
        taskFreqTB.append(freqItem4);
        taskFreqTB.append(freqItem5);
        container.append(taskFreqLB);
        container.append(taskFreqWrap);
        container.append(newLine)

        // repeated field //
        var repWrap = $("<div />"); 
        var repLB = $("<Label />");
        repLB.addClass("workitemcontrol-label");
        repLB.text("Occurrence");
        repLB.attr("for", "reaptField"); 
        var repTB = $("<select />");
        repTB.attr("id", "reaptField")
        //repTB.attr("style", "width: 100%;")
        repTB.css({
            width: "100%",
            background: "rgb(247, 248, 195)"
        });
        repWrap.append(repTB);
        repTB.attr("aria-valuenow", this.repCurrentValue);
        repTB.addClass("repClass");
        repTB.change(() => { 
        }).on("input", (evt: JQueryKeyEventObject) => {
            this._inputChanged('reaptableField', 'repClass', evt); 
        });
        var repettem1 = $("<option />").attr("value", "1.Single occurrence");
        var repettem2 = $("<option />").attr("value", "2.Several occurrences");
        var repettem3 = $("<option />").attr("value", "3.Repeatable all the time"); 
        repettem1.attr("label", "1.Single occurrence");        
        repettem2.attr("label", "2.Several occurrences");        
        repettem3.attr("label", "3.Repeatable all the time");
        repTB.append(repettem1);
        repTB.append(repettem2);
        repTB.append(repettem3);
        container.append(repLB);
        container.append(repWrap);
        container.append(newLine);

        // Implication Field //
        var impWrap = $("<div />"); 
        var impLB = $("<Label />");
        impLB.addClass("workitemcontrol-label");
        impLB.text('Implication');
        impLB.attr('for', 'impField'); 
        var impTB = $("<select />");
        impTB.attr("id", "impField");
        //impTB.attr("style", "width: 100%;");
        impTB.css({
            width: "100%",
            background: "rgb(247, 248, 195)"
        });
        impWrap.append(impTB);
        impTB.attr("aria-valuenow", this.impCurrentValue);
        impTB.addClass("impClass");
        impTB.change(() => { }).on("input", (evt: JQueryKeyEventObject) => {
            this._inputChanged('implicationField', 'impClass', evt); 
        });
        // add values to the selection list
        var implucItem1 = $("<option />").attr("value", "1.Cosmetics or superficial");
        var implucItem2 = $("<option />").attr("value", "2.Unclear or annoying work");
        var implucItem3 = $("<option />").attr("value", "3.Easy workaround exists");
        var implucItem4 = $("<option />").attr("value", "4.Complex workaround or long term damage");
        var implucItem5 = $("<option />").attr("value", "5.No workaround or minor to medium damage");
        var implucItem6 = $("<option />").attr("value", "6.Safety or severe damage to machine");
        implucItem1.attr("label", "1.Cosmetics or superficial");
        implucItem2.attr("label", "2.Unclear or annoying work");
        implucItem3.attr("label", "3.Easy workaround exists");
        implucItem4.attr("label", "4.Complex workaround or long term damage");
        implucItem5.attr("label", "5.No workaround or minor to medium damage");
        implucItem6.attr("label", "6.Safety or severe damage to machine");
        impTB.append(implucItem1);
        impTB.append(implucItem2);
        impTB.append(implucItem3);
        impTB.append(implucItem4);
        impTB.append(implucItem5);
        impTB.append(implucItem6);
        container.append(impLB);
        container.append(impWrap);
        container.append(newLine)

        // severity field
        var sevWrap = $("<div />"); 
        var sevLB = $("<Label />")
        sevLB.addClass("workitemcontrol-label")
        sevLB.text('Severity');
        sevLB.attr("for", 'sevField');
        var sevTB = $("<select />").attr("type", "text");
        sevTB.attr("id", "sevField") 
        //sevTB.attr("style", "width: 100%;") 
        sevTB.css({
            color: "red",
            width: "100%",
            //background: "burlywood"
        }) 
        sevWrap.append(sevLB);
        sevWrap.append(sevTB);
        sevTB.attr("aria-valuenow", this.sevCurrentValue); 
        sevTB.addClass("sevClass");
        // sevTB.addClass(function(){
        //     return ($('#sevField option:selected').attr('label'));// == "Minor" ? $('select[name=selector]').val() : $('select[name=selector]').val();
        //     return (sevTB.val == "Critical" ?  : "sevClass" : "CritiSevClass");
        //     var clname = $('#sevField').val() == "Minor" ? 'a' : 'b';
        //     return "sevClass";
        // });

        sevTB.change(() => { 
        }).on("input", (evt: JQueryKeyEventObject) => {
           this._inputChanged('severityField', 'sevClass', evt); 
        }); 
        var seviritiItem1 = $("<option />").attr("value", "Minor");
        var seviritiItem2 = $("<option />").attr("value", "Medium");
        var seviritiItem3 = $("<option />").attr("value", "Major");
        var seviritiItem4 = $("<option />").attr("value", "Critical");
        seviritiItem1.attr("label", "Minor");
        seviritiItem2.attr("label", "Medium");
        seviritiItem3.attr("label", "Major");
        seviritiItem4.attr("label", "Critical");
        sevTB.append(seviritiItem1);
        sevTB.append(seviritiItem2);
        sevTB.append(seviritiItem3);
        sevTB.append(seviritiItem4);

        container.append(sevWrap);

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
            this.sevCurrentValue = String(value);
            $(".sevClass").val(this.sevCurrentValue);
        }
        if(fieldName == 'implicationField'){
            this.impCurrentValue = String(value);
            $(".impClass").val(this.impCurrentValue);
        }
        if(fieldName == 'taskFrequencyField'){
            this.taskFreqCurrentValue = String(value);
            $(".taskFreqClass").val(this.taskFreqCurrentValue);
        }
        if(fieldName == 'reaptableField'){
            this.repCurrentValue = String(value);
            $(".repClass").val(this.repCurrentValue);
        }
    }

    public getCurrentValues() :any{
        var currentValues = {
            severity: $(".sevClass").val(),
            implication: $(".impClass").val(),
            taskFrequency: $(".taskFreqClass").val(),
            reapetable: $(".repClass").val()       
        }
        return currentValues;
    }
}