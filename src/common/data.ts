import { NTCoreWrapper } from "napcat.core";
interface NTCoreType {
    instance: NTCoreWrapper | undefined;
}
export const NTCore:NTCoreType = { instance: undefined };