import { JiraIssueBasicInt, JiraIssuePickerResponseInt, JiraIssueWorkLogResponseInt, JiraWorkLogInt, PendingWorkLogInt } from '../types';
import HttpService from './HttpService';
import devEnv from "../devEnv";
import { addRemainingSecondsToRound, convertJiraCommentToText, convertTextToJiraComment } from '../utils/jiraUtils';
import { dayWiseWorkLogDateFormat, JiraDateTimeFormat } from '../utils/dateUtils';
const moment = require('moment')
export default class JiraRestApiService {
    private JiraDomainUrl: string;
    private JiraRestVersion: number;
    private JiraCurrentUser: string;
    private Environment: "development" | "production";
    constructor(env?: "development" | "production") {
        this.JiraDomainUrl = "";
        // this.JiraDomainUrl = "https://shakil-pet.atlassian.net";
        this.Environment = (process.env.NODE_ENV === "development") ? "development" : "production"
        // if(env) {
        //     this.Environment = env
        // }
        // if (this.Environment !== "development") {
        //     this.JiraDomainUrl = "https://customerportal.tiptech.com";
        // }
        this.JiraRestVersion = 2
        this.JiraCurrentUser = ""
        // this.JiraCurrentUser = "shakil.ruet.uva@gmail.com"
        // if (this.Environment !== "development") {
        //     this.JiraCurrentUser = "munawar.hussain@enosisbd.com"
        // }
    }

    getJiraCurrentUser = () => {
        return this.JiraCurrentUser
    }

    setJiraCurrentUser = (user: string) => {
        this.JiraCurrentUser = user
    }

    getJiraHeaders = (extraHeaders?: any) => {
        let headers: any = {
            'X-Atlassian-Token': 'nocheck',
            'Accept': 'application/json',
            ...extraHeaders
        };
        if (this.Environment === "development") {
            headers.Authorization = `Basic ${Buffer.from(
                `${devEnv.JIRA_API_EMAIL}:${devEnv.JIRA_API_TOKEN}`
            ).toString('base64')}`
        }
        return headers;
    }

    getJiraDomainUrl = () => this.JiraDomainUrl

    setJiraDomainUrl = (url: string) => {
        let sanitizedUrl = url.trim()
        while (sanitizedUrl.endsWith("/")) {
            sanitizedUrl = sanitizedUrl.substr(0, url.length - 1).trim();
        }
        this.JiraDomainUrl = sanitizedUrl;
    }

    setJiraRestVersion = (version: number) => {
        this.JiraRestVersion = version;
    }

    getJiraRestUrlPrefix = () => {
        return `${this.JiraDomainUrl}/rest/api/${this.JiraRestVersion}`;
    }

    fetchCurrentUser = async (populate: boolean = false) => {
        let url = this.getJiraDomainUrl() + "/rest/gadget/1.0/currentUser";
        const json = await HttpService.get(url, this.getJiraHeaders(), true);
        const response = json as {username: string, fullName: string, email: string}
        if(populate) {
            this.JiraCurrentUser = response.email
        }
        return response
    }

    getIssueSuggestion = async (query?: string): Promise<JiraIssuePickerResponseInt> => {
        let url = this.getJiraRestUrlPrefix() + "/issue/picker";
        if (query && query.trim()) {
            url += `?query=${query.trim()}&currentJQL`
        }
        const json = await HttpService.get(url, this.getJiraHeaders(), true);
        return json as JiraIssuePickerResponseInt;
    }

    getWorkLogsByDate = async (date: Date): Promise<JiraWorkLogInt[]> => {
        let allWorkLogs: JiraWorkLogInt[] = []
        let url = this.getJiraRestUrlPrefix() + "/search";
        const beforeDate = moment(date).subtract(2, "day").format(dayWiseWorkLogDateFormat)
        const afterDate = moment(date).add(1, "day").format(dayWiseWorkLogDateFormat)
        url += `?jql=worklogDate%20>%20"${beforeDate}"%20and%20worklogDate%20<%20"${afterDate}"%20and%20worklogAuthor%20%3D%20currentUser()&fields=summary`
        const json = await HttpService.get(url, this.getJiraHeaders(), true);
        const issues = json.issues as { id: string, key: string, fields: { summary: string } }[];
        const issuesByKey = new Map<string, JiraIssueBasicInt>()
        issues.forEach(issue => {
            const basicIssue: JiraIssueBasicInt = {
                key: issue.key,
                id: issue.id,
                summaryText: issue.fields.summary
            }
            issuesByKey.set(issue.key, basicIssue)
        })

        const startedAfter = moment(moment(date).format(dayWiseWorkLogDateFormat), dayWiseWorkLogDateFormat).toDate()
        for (const key of issuesByKey.keys()) {
            const issue = issuesByKey.get(key)
            if (issue) {
                const response = await this.getWorkLogByIssue(key, startedAfter)
                const workLogs = response.worklogs.filter(r => moment(r.started, JiraDateTimeFormat).format(dayWiseWorkLogDateFormat) === moment(date).format(dayWiseWorkLogDateFormat))
                workLogs.forEach(r => {
                    r.issueId = issue.id
                    r.issueKey = issue.key
                    r.issueSummaryText = issue.summaryText
                });
                allWorkLogs.push(...workLogs)
            }
        }
        return allWorkLogs;
    }

    getWorkLogByIssue = async (issueKey: string, startedAfter: Date): Promise<JiraIssueWorkLogResponseInt> => {
        let url = this.getJiraRestUrlPrefix() + `/issue/${issueKey}/worklog`;
        url += `?startedAfter=${startedAfter.getTime()}`
        const json = await HttpService.get(url, this.getJiraHeaders(), true);
        json.worklogs = json.worklogs
            .filter((r: any) => r.author.emailAddress === this.JiraCurrentUser);
        json.worklogs.forEach((r: any) => {
            if (!r.comment) {
                r.comment = "";
            }
            if (this.JiraRestVersion < 3 && typeof r.comment === "string") {
                r.comment = convertTextToJiraComment(r.comment)
            }
        })
        return json as JiraIssueWorkLogResponseInt;
    }

    postWorkLog = async (workLog: PendingWorkLogInt): Promise<JiraWorkLogInt> => {
        let url = this.getJiraRestUrlPrefix() + `/issue/${workLog.issueKey}/worklog`;
        let body = {
            timeSpentSeconds: addRemainingSecondsToRound(workLog.timeSpentSeconds),
            comment: this.JiraRestVersion == 3 ? workLog.comment : convertJiraCommentToText(workLog.comment),
            started: workLog.started
        }
        const json = await HttpService.post(url, this.getJiraHeaders({
            'Content-Type': 'application/json'
        }), body, true);

        if(typeof json.comment === "string") {
            json.comment = convertTextToJiraComment(json.comment)
        }
        const response = json as JiraWorkLogInt;
        
        response.issueKey = workLog.issueKey
        response.issueSummaryText = workLog.issueSummaryText

        return response
    }

    getIssueDetails = async (issueKey: string): Promise<any> => {
        let url = this.getJiraRestUrlPrefix() + `/issue/${issueKey}`;
        url += `?fields=summary,assignee,customfield_10901`
        const json = await HttpService.get(url, this.getJiraHeaders(), true);
        return json.fields;
    }
}