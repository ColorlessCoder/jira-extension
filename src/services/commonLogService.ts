export default class CommonLogService{
    logError = (error: any) => {
        console.error(error)
    }

    log = (obj: any) => {
        console.log(obj)
    }
}