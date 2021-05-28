import { JiraCommentInt, JiraCommentNodeInt } from "../types";

const allowedTimeUnit: any = {
    "h": 60 * 60,
    "m": 60
}

export function convertJiraCommentToText(jiraComment: JiraCommentInt) {
    return convertJiraNodeToText(jiraComment)
}

export function convertTextToJiraComment(text: string): JiraCommentInt {
    return {
        version: 1,
        type: "doc",
        content: [
            {
                type: "paragraph",
                content: [{
                    type: "text",
                    text: text
                }]
            }
        ]
    };
}

function convertJiraNodeToText(node: JiraCommentNodeInt) {
    let comment = "";
    if (node.text) {
        comment = node.text;
    }
    if (node.content) {
        node.content.forEach(child => comment += convertJiraNodeToText(child))
    }
    return comment;
}

export function convertTimeInSecondToJiraTimeFormat(timeInSecond: number, roundSeconds?: boolean): {
    text: string,
    seconds: number
} {
    const seconds = timeInSecond % 60;
    let minutes = Math.floor(timeInSecond / 60);
    if (seconds && roundSeconds) {
        minutes++;
    }
    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;

    const strList: string[] = [];
    if (hours > 0) {
        strList.push(`${hours}h`);
    }
    if (minutes > 0) {
        strList.push(`${minutes}m`);
    }
    return {
        text: strList.join(" "),
        seconds: roundSeconds ? (seconds - 60) : seconds
    };
}

export function addRemainingSecondsToRound(timeInSecond: number) {
    const seconds = timeInSecond % 60
    return timeInSecond + (seconds ? (60 - seconds) : 0)
}

export function convertJiraTimeFormatToSeconds(text: string): number {
    let seconds = 0.0;
    if (text) {
        let set = new Set<string>();
        text.split(" ")
            .map(t => t.trim().toLocaleLowerCase())
            .filter(t => t.length > 0)
            .forEach(t => {
                if (seconds !== -1) {
                    let match = t.match("[0-9.]+[hm]?")
                    if (match && match[0].length === t.length) {
                        let unit = t[t.length - 1];
                        let unitInSecond = allowedTimeUnit[unit];
                        if (!unitInSecond) {
                            unit = 'm';
                            unitInSecond = allowedTimeUnit['m']
                        }
                        if (set.has(unit)) {
                            seconds = -1;
                        } else {
                            set.add(unit);
                            seconds += unitInSecond * (Number.parseFloat(t))
                        }
                    } else {
                        seconds = -1;
                    }
                } else {
                    seconds = -1;
                }
            })
    }

    return seconds === -1 ? Math.ceil(seconds) : seconds;
}