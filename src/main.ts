import { NTCoreWrapper } from "napcat.core";
import { checkNTIsInit } from "@/common/proxy";
(async () => {
    try {
        await checkNTIsInit();
    }
    catch (error) {
        console.log(error);
        return;
        //阻止下一步
    }

})();