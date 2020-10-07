/// <reference types="vss-web-extension-sdk" />
export interface Function {
    FunctionName: string;
    Command: string;
}
export async function StoreValueList(FunctionList: Array<Function>) {
    var deferred = $.Deferred();
    let dataService: any = await VSS.getService(VSS.ServiceIds.ExtensionData);
    let result = await dataService.setValue("FunctionsList", FunctionList);
    deferred.resolve();
    return deferred;
}
export async function RetriveValueList() {
    let dataService: any = await VSS.getService(VSS.ServiceIds.ExtensionData);
    let result: Array<Function> = await dataService.getValue("FunctionsList");
    return result ? result : new Array<Function>();
}
export async function GetCommand(FunctionName: string) {
    let functionList: Array<Function> = await RetriveValueList();
    let functToreturn: Function = {
        Command: "", FunctionName: ""
    }
    functionList.forEach(func => {
        if (func.FunctionName == FunctionName) {
            functToreturn = func;
        }
    });
    return functToreturn.Command;
}
export async function KillValueList(key: string) {
    let dataService: any = await VSS.getService(VSS.ServiceIds.ExtensionData);
    dataService.setValue(key, undefined);
    dataService.deleteValue(key);
}