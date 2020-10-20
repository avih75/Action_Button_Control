import { Model } from "./modelll";

export class View {
    constructor(model: Model) {
        // var newLine = $("<br>");
        //$(".container").remove();
        var container = $("<div />");
        container.addClass("container");
        container.addClass("wrap");
        model.buttonList.forEach(element => {
            let actionButton = $("<button />");
            actionButton.addClass("buttons");
            actionButton.text(" " + element + " ");
            actionButton.click(() => { model.buttonPressed(element); });
            // container.append(newLine);
            container.append(actionButton);
            // container.append($("<br />"));
        });
        $("body").append(container);
        VSS.resize();
    }
}