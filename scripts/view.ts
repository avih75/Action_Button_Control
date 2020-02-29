import { Model } from "./model";
import { Actions } from "C:/Users/user/source/repos/ActionsFile";  
 
export class View {    
    //private _model: Model; 
    private _action: Actions;
    constructor(private model: Model){ 
        //this._model = model;
        this._init();
    }
    private _init(): void {
        var newLine = $("<br>");        
        $(".container").remove();
        var container = $("<div />");
        container.addClass("container");  
        container.addClass("wrap");
        this.model.list.forEach(element => {           
            let actionButton = $("<button />");  
            actionButton.addClass("buttons");
            actionButton.text(element);
            actionButton.click(() => {this.model._buttonPressed(element);}); 
            container.append(newLine);
            container.append(actionButton);
            container.append(newLine) 
        });  
        $("body").append(container);
    }
}