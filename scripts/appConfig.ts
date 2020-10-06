import { StoreValueList, KillValueList } from "./StorageHelper";
import GitRestClient = require("TFS/VersionControl/GitRestClient");
import { GitCommitRef, GitChange, ItemContent, GitItem, GitRefUpdate, GitPush, GitRepository, GitRef } from "TFS/VersionControl/Contracts";

let provider = () => {
    return {
        execute: (actionContext) => {
        }
    };
};

function InitP() {

    // get the list
    // show it

    VSS.resize();

}

// function to add and delete command to the list

VSS.register(VSS.getContribution().id, provider);
InitP(); 