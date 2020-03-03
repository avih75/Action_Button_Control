import { Model } from "./modelll"; 
 
export class View {     
    constructor(private model: Model){  
        this._init();
    }
    private _init(): void {
        var newLine = $("<br>");        
        $(".container").remove();
        var container = $("<div />");
        container.addClass("container");  
        container.addClass("wrap");
        this.model.buttonList.forEach(element => {           
            let actionButton = $("<button />");  
            actionButton.addClass("buttons");
            actionButton.text(element);
            actionButton.click(() => {this.model.buttonPressed(element);}); 
            container.append(newLine);
            container.append(actionButton);
            container.append(newLine) 
        });  
        $("body").append(container);
    }
}