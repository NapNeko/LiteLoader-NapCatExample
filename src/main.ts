import { LoginListener, NTCoreWrapper } from "napcat.core";
import { checkNTIsInit, getWrapperLoginService, getWrapperNodeApi, getWrapperSession } from "@/common/proxy";
import { BrowserWindow } from "electron";
import { NTCore } from "@/common/data";

let proxyHandler = {
    get(target: any, prop: any, receiver: any) {
        if (typeof target[prop] === 'undefined') {
            return (...args: unknown[]) => {
                console.log(`[NapCat] [Info] ${target.constructor.name} ${prop}`, ...args);
            };
        }
        return Reflect.get(target, prop, receiver);
    }
};

(async () => {
    try {
        await checkNTIsInit();
    }
    catch (error) {
        console.log("[NapCat] [Error] 很遗憾在NTQQ初始化阶段失败");
        return;
        //阻止下一步
    }
    console.log("[NapCat] [Info] NTQQ初始化成功");
    console.log(getWrapperNodeApi(), getWrapperSession(), getWrapperLoginService());
    NTCore.instance = new NTCoreWrapper(getWrapperNodeApi(), getWrapperSession());
    // 挂载NTQQ 到 NapCat Core
    let NCLoginListener = new LoginListener();
    NCLoginListener.onQRCodeLoginSucceed = (arg) => {
        //登录成功 登录成功立刻进入真正初始化
        console.log("[NapCat] [Info] UIN: ", arg.uin, " 登录成功!")
        NCInit().then().catch();
    }
    // 添加Login监听
    getWrapperLoginService().addKernelLoginListener(new (getWrapperNodeApi().NodeIKernelLoginListener)(new Proxy(NCLoginListener, proxyHandler)));

    // 初始化完毕

})();

export const onBrowserWindowCreated = (window: BrowserWindow) => {
    console.log("[NapCat] [Info] onBrowserWindowCreated");
};

async function NCInit() {
    console.log("[NapCat] [Info] 开始初始化自身逻辑");
    //演示接口
    //await NTCore.instance!.getApiMsg().setMsgRead();
    //await NTCore.instance!.getApiCollection().createCollection("test", "U_XXX","1","1","1");
}
