import { LoginListener, NTCoreWrapper } from "napcat.core";
import { checkNTIsInit, getWrapperLoginService, getWrapperNodeApi, getWrapperSession } from "@/common/proxy";
import { BrowserWindow } from "electron";
import { NTCore } from "@/common/data";
(async () => {
    try {
        await checkNTIsInit();
    }
    catch (error) {
        console.log("[NapCat] [Error] 很遗憾在NTQQ初始化阶段失败");
        return;
        //阻止下一步
    }
    NTCore.instance = new NTCoreWrapper(getWrapperNodeApi(), getWrapperSession());
    // 挂载NTQQ 到 NapCat Core
    let NCLoginListener = new LoginListener();
    NCLoginListener.onLoginState = (...args) => {
        console.log("LoginState", args);
        //判断是否登录成功 登录成功立刻进入真正初始化
        NCInit().then()
    }
    // 添加Login监听
    getWrapperLoginService().addKernelLoginListener(new (getWrapperNodeApi().NodeIKernelLoginListener)(NCLoginListener));

    // 初始化完毕

})();

export const onBrowserWindowCreated = (window: BrowserWindow) => {

};

async function NCInit() {
    
}
