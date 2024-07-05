import type { NodeIKernelLoginService, NodeIQQNTWrapperSession, NTWrapperNodeApi } from "napcat.core";
let Process = require('process');
let os = require('os');

Process.dlopenOrig = Process.dlopen

let WrapperSession: NodeIQQNTWrapperSession | undefined = undefined;//NativeNpdeSession
let WrapperNodeApi: NTWrapperNodeApi | undefined = undefined;//NativeNpdeApi
let WrapperLoginService: NodeIKernelLoginService | undefined = undefined;

Process.dlopen = function (module, filename, flags = os.constants.dlopen.RTLD_LAZY) {
    let dlopenRet = this.dlopenOrig(module, filename, flags)
    for (let export_name in module.exports) {
        module.exports[export_name] = new Proxy(module.exports[export_name], {
            construct: (target, args, _newTarget) => {
                let ret = new target(...args)
                if (export_name === 'NodeIQQNTWrapperSession') WrapperSession = ret
                if (export_name === 'NodeIKernelLoginService') WrapperLoginService = ret
                return ret
            },
        })
    }
    if (filename.toLowerCase().indexOf('wrapper.node') != -1) {
        WrapperNodeApi = module.exports;
    }
    return dlopenRet;
}
export function getWrapperSession() {
    return WrapperSession;
}
export function getWrapperLoginService() {
    return WrapperLoginService;
}
export function getWrapperNodeApi() {
    return WrapperNodeApi;
}
export function NTIsInit() {
    return WrapperSession != undefined && WrapperNodeApi != undefined && WrapperLoginService != undefined;
}
function pollForNTInit() {
    return new Promise((resolve, reject) => {
        let isSolve = false;
        const intervalId = setInterval(() => {
            if (isSolve) return;
            try {
                if (NTIsInit()) {
                    clearInterval(intervalId);
                    isSolve = true;
                    resolve(true);
                }
            } catch (error) {
                clearInterval(intervalId);
                reject(error);
            }
        }, 500);
    });
}

export async function checkNTIsInit() {
    return Promise.race([
        pollForNTInit(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("NTIsInit is false after 10 seconds")), 10000))
    ]);
}