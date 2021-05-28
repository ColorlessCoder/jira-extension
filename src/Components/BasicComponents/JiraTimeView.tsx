import moment from "moment";
import { Fragment } from "react";
import { useTick } from "../../hooks/tickHook";
import { JiraDateTimeFormat } from "../../utils/dateUtils";
import { convertTimeInSecondToJiraTimeFormat } from "../../utils/jiraUtils";

export default function JiraTimeView({
    timeSpendInSeconds,
    resumed,
    roundSeconds
}: {
    timeSpendInSeconds: number,
    resumed?: string,
    roundSeconds?: boolean
}) {
    const tick = useTick(new Boolean(resumed));
    let totalTimeSpent = timeSpendInSeconds;
    if (resumed) {
        totalTimeSpent += (tick - moment(resumed, JiraDateTimeFormat).toDate().getTime()) / 1000
    }
    totalTimeSpent = Math.ceil(totalTimeSpent)
    const jiraTimeFormat = convertTimeInSecondToJiraTimeFormat(totalTimeSpent, roundSeconds)
    let text = jiraTimeFormat.text
    if(jiraTimeFormat.seconds > 0) {
        if(text) {
            text += " "
        } else {
            text = ""
        }
        text += jiraTimeFormat.seconds + "s"
    }
    if(!text) {
        text = "0"
    }
    return <Fragment>{text}</Fragment>
}