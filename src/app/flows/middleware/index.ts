import dialogMiddleware from "./dialog.mid";
import noticeMiddleware from "./notice.mid";

const appMiddleware = [noticeMiddleware, dialogMiddleware];
export default appMiddleware;
