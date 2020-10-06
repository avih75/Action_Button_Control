import { RetriveValueList, Function, StoreValueList } from "./StorageHelper";

let commandList: Array<Function>;
function InitP() {
    let main = $("#main").append($("<h2 />").text("Action Button Configuration"));
    let label = $("<label />").text("Action Functions list");
    let listDiv = $("<div />").attr("id", "listDiv").append(label);
    main.append(listDiv);
    RetriveValueList().then((functionList) => {
        commandList = functionList
        functionList.forEach(func => {
            AddFuncToListView(func.FunctionName);
        });
        let addButton = $("<button />").text("+");
        addButton.click(() => {
            addDiv.show();
            listDiv.hide();
        });
        listDiv.append(addButton);
        VSS.resize();
    });
    let addDiv = $("<div />").attr("id", "addDiv");
    main.append(addDiv);
    addDiv.hide();
    addDiv.append($("<label />").text("New Command"));
    addDiv.append($("<input />").attr("id", "commandName"));
    addDiv.append($("<input />").attr("id", "commandFunc"));
    let saveButton = $("<button />").text("Save");
    let cancleButton = $("<button />").text("Cancle");
    addDiv.append(saveButton);
    addDiv.append(cancleButton);
    cancleButton.click(() => {
        addDiv.hide();
        listDiv.show();
        $("#commandName").val("");
        $("#commandFunc").val("");
    });
    saveButton.click(() => {
        SaveFunction($("#commandName").val(), $("#commandFunc").val())
    })
}
function AddFuncToListView(funcName: string) {
    let div = $("<div />");
    div.append($("<label />").text(funcName));
    let delButton = $("<button />").text("X");
    delButton.click(() => {
        let x: boolean = true;
        // alert box yes/no
        if (x) {
            DellFunction(funcName);
            div.remove();
        }
    });
    div.append(delButton);
    $("#listDiv").append(div);
}
function DellFunction(funcName: string) {
    let newCommandList: Array<Function> = new Array<Function>();
    commandList.forEach(command => {
        if (command.FunctionName != funcName) {
            newCommandList.push(command);
        }
    });
    commandList = newCommandList;
    StoreValueList(commandList);
}
function SaveFunction(commandName: string, commandFunction: string) {
    let newFunc: Function = { FunctionName: commandName, Command: commandFunction };
    commandList.push(newFunc);
    StoreValueList(commandList);
    AddFuncToListView(commandName);
    $("#commandName").val("");
    $("#commandFunc").val("");
    $("#listDiv").show();
    $("#addDiv").hide();
}
VSS.register(VSS.getContribution().id, InitP);
InitP(); 