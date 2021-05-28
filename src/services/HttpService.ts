import fetch from 'node-fetch';
export default class HttpService {

    static proxy = async (url: string, method: "GET"|"POST"|"PUT", headers: any, bodyData: any, expectJson: boolean) => {
        const res = await fetch("http://localhost:8080/proxy", {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url,
                method,
                headers,
                bodyData
            })
        });
        return expectJson ? await res.json() : await res.text();
    }

    static get = async (url: string, headers: any, expectJson: boolean) => {
        if(process.env.NODE_ENV === "development") {
            return await HttpService.proxy(url, "GET", headers, undefined, expectJson)
        }
        const res = await fetch(url, {
            method: 'GET',
            headers
        });
        return expectJson ? await res.json() : await res.text();
    }
    static post = async (url: string, headers: any, bodyData: any, expectJson: boolean) => {
        if(process.env.NODE_ENV === "development") {
            return await HttpService.proxy(url, "POST", headers, bodyData, expectJson)
        }
        const res = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(bodyData)
        });
        return expectJson ? await res.json() : await res.text();
    }
    static put = async (url: string, headers: any, bodyData: any, expectJson: boolean) => {
        if(process.env.NODE_ENV === "development") {
            return await HttpService.proxy(url, "PUT", headers, bodyData, expectJson)
        }
        const res = await fetch(url, {
            method: 'PUT',
            headers,
            body: JSON.stringify(bodyData)
        });
        return expectJson ? await res.json() : await res.text();
    }
}