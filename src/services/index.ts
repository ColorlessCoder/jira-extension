import CommonLogService from "./commonLogService";
import JiraRestApiService from "./jiraRestApiService";

export default class StaticServices {
    static CommonLogService = new CommonLogService()
    static JiraRestApiService = new JiraRestApiService()
}