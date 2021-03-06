import moment from "moment";

export const JiraDateTimeFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZZ';
export const dayWiseWorkLogDateFormat = "YYYY-MM-DD";
export const UiDateTimeLocalFormat = "YYYY-MM-DDTHH:mm";
export const TimeFormatForView = "hh:mm A";

export function areSameDate(date1: Date, date2: Date, format: string = JiraDateTimeFormat) {
    return moment(date1).format(format) === moment(date2).format(format)
}

export function getAllDatesWithinRange(fromDate: string, toDate: string) {
    const allDates = [];
    let currentDate = moment(fromDate);
    while(currentDate.isSameOrBefore(toDate)) {
        allDates.push(currentDate.format(dayWiseWorkLogDateFormat))
        currentDate = currentDate.add(1, "day")
    }
    return allDates
}