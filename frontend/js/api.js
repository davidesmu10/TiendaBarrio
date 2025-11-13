const API_URL = "http://localhost:8080/api";

export async function apiGet(url) {
    return fetch(API_URL + url).then(r => r.json());
}

export async function apiPost(url, body) {
    return fetch(API_URL + url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
    }).then(r => r.json());
}