import { Model } from "./modelll";
export class View {
    constructor(model: Model) {
        var container = $("<div />");
        container.addClass("container");
        container.addClass("wrap");
        let index:number=0;
        model.buttonFunctionList.forEach(element => {
            let actionButton = $("<button />");
            actionButton.addClass("buttons");
            actionButton.text(" " + model.buttonNameList[index] + " ");
            actionButton.click(() => { model.buttonPressed(element); });
            container.append(actionButton);
            index++;
        });
        $("body").append(container);
        VSS.resize();
    }
}