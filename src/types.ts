export type FilteredGenericType<T, U> = Pick<T, { 
    [K in keyof T]: T[K] extends U ? K : never 
}[keyof T]>;

export interface JiraWorkLogInt {
    self?: string, //"https://your-domain.atlassian.net/rest/api/3/issue/10010/worklog/10000",
    author?: JiraCommentAuthorInt, 
    comment: JiraCommentInt,
    updated?: string, //"2021-04-09T01:45:02.377+0000",
    visibility?: any,
    started: string, //"2021-04-09T01:45:02.377+0000",
    timeSpent?: string, //"3h 20m",
    timeSpentSeconds: number, //12000,
    id: string, //"100028",
    issueId: string, //"10002"
    issueKey: string,
    issueSummaryText: string
}

export interface PendingWorkLogInt extends JiraWorkLogInt{
    resumed: string,
    hasNotes?: boolean,
    notes?: NoteInt
}

export type NoteTypeInt = "Discussion" | "Code Review"| "Others"

export interface NoteInt {
    id: string,
    type: NoteTypeInt,
    rating: number|null,
    forUser?: JiraUserPickerInt,
    details: string,
    createAt?: number,
    spentTime?: number,
    issueKey?: string,
    issueSummaryText?: string
}

export interface JiraCommentInt extends JiraCommentNodeInt {
    type: "doc",
    version: 1,
    content: JiraCommentNodeInt[]
}

export interface JiraCommentNodeInt {
    type: "text" | "paragraph" | string,
    content?: JiraCommentNodeInt[],
    text?: string,
    marks?: any,
    attrs?: any
}

export interface JiraCommentAuthorInt {
    "self": string, //"https://your-domain.atlassian.net/rest/api/3/user?accountId=5b10a2844c20165700ede21g",
    "accountId": string, //"5b10a2844c20165700ede21g",
    "displayName": string, //"Mia Krystof",
    "active": boolean //false
}

export interface JiraIssueBasicInt {
    id: string,
    key: string,
    summaryText: string
}

export interface JiraIssuePickerResponseInt { // https://customerportal.tiptech.com/rest/api/2/issue/picker?query=TWJ-482&currentJQL
    sections: JiraIssuePickerSectionInt[]
}

export interface JiraIssuePickerSectionInt {
    label: "History Search"|"Current Search",
    sub: string,
    issues: JiraIssueBasicInt[]
}

export interface JiraIssueWorkLogResponseInt {
    "startAt": number,
    "maxResults": number,
    "total": number,
    "worklogs": JiraWorkLogInt[]
}

export interface CommentSuggestionsInt {
    label: string,
    comment: string,
    commentParams?: {
        key: string,
        properties: string[][]
    }[],
    avatarString?: string
    avatarLink?: string,
    avatarParams?: string[][]
    avatarLinkParams?: string[][]
}

export interface JiraUserInt {
    displayName: string,
    self: string,
    key: string,
    emailAddress: string,
    avatarUrls: {
        "48x48": string,
        "32x32": string,
        "24x24": string,
        "16x16": string,
    },
    projectKey?: string
}

export interface JiraUserPickerInt {
    displayName: string,
    avatarUrl: string,
    accountId: string
}

export interface SettingsInt {
    jiraDomainUrl: string
}