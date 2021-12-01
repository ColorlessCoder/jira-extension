import { Avatar, Chip, createStyles, makeStyles } from "@material-ui/core";
import { Receipt } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { CommentSuggestionsInt, JiraUserInt } from "../../types";
import HorizontalView from "./HorizontalView";
import lodash from 'lodash'
import StaticServices from "../../services";

const useStyles = makeStyles(() => createStyles({
    chip: {
        marginLeft: 5,
        marginRight: 5,
    }
}));

function getAssociatedField<T>(issue: any, levelOfProperties: string[][] | undefined): T | undefined {
    let value: any = undefined
    if (levelOfProperties != undefined) {
        levelOfProperties.forEach((properties, i) => {
            const src = i ? value : issue;
            let currentValue:any = undefined;
            properties.forEach(property => {
                let propertyValue = lodash.get(src, property, undefined)
                if (!currentValue && propertyValue) {
                    currentValue = propertyValue
                }
            });
            value = currentValue
        });
    }
    return value as T
}

export default function CommentSuggestions({ issueKey, onClick }: {
    issueKey: string,
    onClick: (comment: string) => any
}) {
    const classes = useStyles()
    const [suggestions, setSuggestions] = useState<CommentSuggestionsInt[]>([])
    const [issue, setIssue] = useState<any>()
    const getAvatar = (suggestion: CommentSuggestionsInt) => {
        if (suggestion.avatarLink) {
            return <Avatar src={suggestion.avatarLink} />
        }
        if (suggestion.avatarString) {
            return <Avatar>{suggestion.avatarString}</Avatar>
        }
        if (suggestion.avatarParams || suggestion.avatarLinkParams) {
            const value = getAssociatedField(issue, suggestion.avatarLinkParams ? suggestion.avatarLinkParams : suggestion.avatarParams)
            if (suggestion.avatarLinkParams) {
                return <Avatar src={value as string} />
            } else {
                return <Avatar>{value as string}</Avatar>
            }
        }
        return undefined;
    }
    const getComment = (suggestion: CommentSuggestionsInt) => {
        let comment = suggestion.comment
        if (suggestion.commentParams) {
            suggestion.commentParams.forEach(param => {
                const value = getAssociatedField(issue, param.properties) as string
                comment = comment.split("$$" + param.key).join(value ? value : "")
            })
        }
        return comment;
    }
    const onClickChip = (suggestion: CommentSuggestionsInt) => {
        onClick(getComment(suggestion))
    }
    useEffect(() => {
        const newSuggestions: CommentSuggestionsInt[] = []
        // newSuggestions.push({
        //     label: "DS",
        //     avatarString: "D",
        //     comment: "Daily Scrum"
        // });
        // newSuggestions.push({
        //     label: "MS",
        //     avatarString: "M",
        //     comment: "Midday Scrum"
        // });
        // newSuggestions.push({
        //     label: "WM",
        //     avatarString: "W",
        //     comment: "Weekly Meeting"
        // });
        newSuggestions.push({
            label: "Review Code",
            avatarLinkParams: [["customfield_10901", "assignee"], ["avatarUrls"], ["48x48", "32x32", "24x24", "16x16"]],
            comment: `Review code changes of $$assignee`,
            commentParams: [{ key: "assignee", properties: [["customfield_10901", "assignee"], ["displayName"]] }]
        });
        newSuggestions.push({
            label: "Discussion",
            avatarLinkParams:  [["customfield_10901", "assignee"], ["avatarUrls"], ["48x48", "32x32", "24x24", "16x16"]],
            comment: `Discussion with $$assignee`,
            commentParams: [{ key: "assignee", properties: [["customfield_10901", "assignee"], ["displayName"]] }]
        });
        // newSuggestions.push({
        //     label: "Badri",
        //     avatarString: "B",
        //     comment: "Discussion with Badri"
        // });
        // newSuggestions.push({
        //     label: "Muntasir",
        //     avatarString: "M",
        //     comment: "Discussion with Muntasir"
        // });
        // newSuggestions.push({
        //     label: "Nazim",
        //     avatarString: "N",
        //     comment: "Discussion with Nazim"
        // });
        newSuggestions.push({
            label: "Bug",
            avatarString: "C",
            comment: `Analysis of the root cause of the issue and fix`,
        });
        newSuggestions.push({
            label: "Implementation",
            avatarString: "C",
            comment: `Analysis of the requirement and implement`,
        });
        // newSuggestions.push({
        //     label: "Review Assignee",
        //     avatarLinkParams: [["assignee"], ["avatarUrls"], ["48x48", "32x32", "24x24", "16x16"]],
        //     comment: `Review code changes of $$assignee`,
        //     commentParams: [{ key: "assignee", properties: [["assignee"], ["displayName"]] }]
        // });
        // newSuggestions.push({
        //     label: "Discussion Assignee",
        //     avatarLinkParams:  [["assignee"], ["avatarUrls"], ["48x48", "32x32", "24x24", "16x16"]],
        //     comment: `Discussion with $$assignee`,
        //     commentParams: [{ key: "assignee", properties: [["assignee"], ["displayName"]] }]
        // });
        setSuggestions(newSuggestions);
    }, [])
    useEffect(() => {
        if (issueKey) {
            StaticServices.JiraRestApiService
                .getIssueDetails(issueKey)
                .then(issue => setIssue(issue))
        } else {
            setIssue(undefined)
        }
    }, [issueKey])
    return <HorizontalView>
        {suggestions.map((suggestion, i) => <Chip key={i}
            label={suggestion.label}
            avatar={getAvatar(suggestion)}
            className={classes.chip}
            onClick={() => onClickChip(suggestion)}
            variant="outlined" />)}
    </HorizontalView>
}