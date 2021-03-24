// import { Model } from "./modelll";
// import { View } from "./view";
// export class WidgetController {
//     constructor() {
//         let inputs = VSS.getConfiguration().witInputs;                                           // IDictionaryStringTo<string>;
//         let buttonsNames: string = inputs["ButtonsNames"];                                       // list of button content
//         let actionsNames: string = inputs["ActionsNames"];                                       // list o fbutton functionality
//         let targetType: string = (inputs["TargetType"]) ? inputs["TargetType"] : "";             // work item type
//         let preTitel: string = (inputs["PreTitel"]) ? inputs["PreTitel"] : "";                   // Aded text to title        
//         let filedsToCopy: string = (inputs["FieldsToCopy"]) ? inputs["FieldsToCopy"] : "";       // list of fields
//         let targetProject: string = (inputs["TargetProject"]) ? inputs["TargetProject"] : "";    // project name
//         let linkToParent: boolean = inputs["LinkToParent"];                                      // conect betwin wits    
//         let fieldsValues: string = inputs["FieldsValues"]? inputs["FieldsValues"] : "";          // list of values
//         let targetFieldsList: string = inputs["TargetFields"]? inputs["TargetFields"] : "";      // list of fields

//         let model = new Model(actionsNames, buttonsNames, targetType, filedsToCopy,
//             targetProject, preTitel, linkToParent, fieldsValues, targetFieldsList);

//         new View(model);
        
//         VSS.resize();
//     }
// }