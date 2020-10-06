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
export async function SetValue(Function: Function) {
    var deferred = $.Deferred();
    let dataService: any = await VSS.getService(VSS.ServiceIds.ExtensionData);
    let result = await dataService.setValue(Function.FunctionName, Function.Command);
    deferred.resolve();
    return deferred;
}
export async function GetValue(FunctionName: string) {
    let dataService: any = await VSS.getService(VSS.ServiceIds.ExtensionData);
    let result: Function = await dataService.getValue(FunctionName);
    return result;
}
export async function GetCommand(FunctionName: string) {
    RetriveValueList().then((functionList: Array<Function>) => {
        functionList.forEach(func => {
            if (func.FunctionName == FunctionName) {
                return func.Command;
            }
        });
        return "";
    })
}
export async function KillValueList(key: string) {
    let dataService: any = await VSS.getService(VSS.ServiceIds.ExtensionData);
    dataService.setValue(key, undefined);
    dataService.deleteValue(key);
}