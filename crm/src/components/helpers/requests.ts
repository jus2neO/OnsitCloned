import axios from "axios";

const baseUrl = "http://localhost:8081";

export const onRequestAuth = () => axios.create({
    baseURL: baseUrl,
    timeout: 30 * 60 * 1000,
    headers: {
        Accept: "application/json",
        'Access-Control-Max-Age' : 600, //disable pre-flight browser inspection  to speed up api call
        'Content-Type': 'application/json'
    }
});

export const onRequest = (apiKey: string) => axios.create({
    baseURL: baseUrl,
    timeout: 30 * 60 * 1000,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    headers: {
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
        'Access-Control-Max-Age' : 600, //disable pre-flight browser inspection  to speed up api call
        'Content-Type': 'application/json'
    },
});

export const onRequestFile = (apiKey: string) => axios.create({
    baseURL: baseUrl,
    timeout: 30 * 60 * 1000,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    headers: {
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
        'Access-Control-Max-Age' : 600, //disable pre-flight browser inspection  to speed up api call
        'Content-Type': 'multipart/form-data'
    },
});

export const onRequestMultiForm = (apiKey: string) => axios.create({
    baseURL: baseUrl,
    timeout: 30 * 60 * 1000,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    headers: {
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
        'Access-Control-Max-Age' : 600, //disable pre-flight browser inspection  to speed up api call
        'Content-Type': 'multipart/form-data'
    },
});