"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IStatus = exports.IRole = void 0;
var IRole;
(function (IRole) {
    IRole["AGENT"] = "AGENT";
    IRole["ADMIN"] = "ADMIN";
    IRole["USER"] = "USER";
    IRole["SUPER_ADMIN"] = "SUPER_ADMIN";
})(IRole || (exports.IRole = IRole = {}));
var IStatus;
(function (IStatus) {
    IStatus["ACTIVE"] = "ACTIVE";
    IStatus["SUSPENDED"] = "SUSPENDED";
    IStatus["BLOCKED"] = "BLOCKED";
    IStatus["DELETE"] = "DELETE";
})(IStatus || (exports.IStatus = IStatus = {}));
