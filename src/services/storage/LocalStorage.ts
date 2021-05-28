export class LocalStorage {
    constructor() {
        this.storage = window.localStorage
    }
    storage: Storage

    get = async <T>(itemKey: string, textFormat: boolean = false): Promise<T|null> => {
        let responseString:any = this.storage.getItem(itemKey)
        if (!textFormat && responseString) {
            return JSON.parse(responseString) as T
        }
        return responseString as T;
    }

    set = async (itemKey: string, value: any) => {
        this.storage.setItem(itemKey, JSON.stringify(value));
    }

    remove = async (itemKey: string) => {
        this.storage.removeItem(itemKey)
    }
}