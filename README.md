# Jira Time Tracker (chrome extension)

A chrome extension to track jira work logs happily.

## How to install:
- Download the [build.rar](https://github.com/ColorlessCoder/jira-extension/blob/main/build.rar) file
- Extract the rar file
- Open Chrome or any chromium browser
- Go to Menu -> extensions or "Manage Extensions"
- Click 'Load Unpacked'
- Select the extracted directory
- The extension will be visible and can be used

 ![alt text](/public/logo.png)
 
 ## How to use:
 ### Settings:
 If you are using the extension first time, it will jump to settings menu
 1. Jira Domain Url- The domain url of the jira you want to connect. E.g. https://xyz.atlassian.net
 
 Thats all, no username or token required. Before connect, make sure you are logged in to the jira account. The extension use the current logged in session to access jira.
 
 ### Work Log:
 This screen will present all the pending and submitted worklogs for a certain date.
 
 **Log Date**: The date field at to top. You can use navigation button to move to previous or next date, or you can use the calendar icon to set a custom date.
 
 **Create a new log**: Select the plus (+) button besides log date. A pop-up will come with following fields-
 - Jira issue: A searchable dropdown, user can search with keyword and select the appropriate ticket
 - Started At: The started time for the log
 - Total Spent Time: Only supports hour(h) and minutes(m). E.g 1h 20m. Note that, to log some minutes, you can ommit m suffix. E.g 20 is same as 20m
 - Seconds: Precision time
 - Comments: Plain text, rich text is not supported
 - There are some comment buttons that have quick comments
 - Resumed At: The last time the task resumed
 - Save button will save the log as pending log and will not submitted to Jira immediately so that user can edit that later.
 - Save and Start button will save the log as pending log with resumed state like a stopwatch. User can pause the task later.
 
 **Pending Work Log**: This collpasable section will contain all the logs that are not submitted to jira yet.
 
 **Submitted Work Log**: This collpasable section will contain all the logs that were submitted to jira yet.
 
 **Edit Worklogs**: Only one worklog can be edited at a time. Select a pending worklog and click the edit icon on the table header.
 
 **Resume/Pause logs**: Only one worklog can be resumed/paused at a time. Select a pending worklog and click the resume or pause icon on the table header.
 
 **Delete logs**: Multiple worklogs can be deleted at a time. Select the pending worklogs need to be deleted and click the delete icon on the table header.
 
 **Submit Worklogs to Jira**: Multiple worklogs can be submitted to Jira at a time. Select the pending worklogs need to be submitted and click the upload icon on the table header. A pop-up will be shown with all the logs that are going to be uploaded rounding up the seconds to minute. After review, just click submit button to upload them to Jira.
 
 **Summary of full week**: Summary of full week can be found in the right side bar. By default, the current week will be selected. User can navigate to next or previous week with the options icon besides Summary header.
 
 ### Notes:
 This screen will present all the notes that were taken while doing some work.
 
 **Create Note**: Notes cannot be created independently. While creating/editing a log for some jira issue and submit the log to Jira, user will be provided with a option "Add Notes". There will be the below fields. **Notes will only be shown in Notes screen if the log is submitted to Jira.**
 - Type: A dropdown having values Others, Discussion, Code Review. This will represent for which perspective the note has been created.
 - For user: If the note applies to a certain user then you can select a user here to relate.
 - Rating: If the note is for evaluation purpose, then you can select a rating
 - Details: Finally you can write the plain text note.
 
 **View the notes**: You can see all the notes in Note menu screen and can filter or sort the items. Notes cannot be edited but can be deleted.
 
 ### Storage:
 All the data will be stored in browser's local storage. **Please do not store any sensitive information (like token/password) in pending logs or notes**.
 
 ### Backup:
 Since the application only uses local storage, the manual backup option is there. The main intention of backup is to backup the notes, though backup will also contain any pending worklogs. Export button will export a json file with all the data without any encryption. The same file can be imported.
 
 
 ## Development instruction (React Js, express):
 1. First run the command in project directory - `npm install`
 2. From localhost, it is not possible to invoke any API. A proxy server needed to be created. Since proxy server will make the api calls, it is not possible to use the logged in session. So username and token need to be added in `.env` file.
 3. Run the command `npm start`to debug and development
 4. Run the command `npm run build` to build the project. The <project_dir>/build folder will have all the bundles. From chrome, load unpacked extension and select this build folder.
