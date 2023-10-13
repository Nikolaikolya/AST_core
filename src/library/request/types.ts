import { type Request } from "./class";
import { type ICache } from "../cache";

export interface IRequestParams extends RequestInit {
  cacheStrategy: ICache<string, unknown>
}

export type RequestMethods = "POST" | "GET" | "PUT" | "DELETE" | "UPDATE";

export type RequestHeaderKeys = "Content-Type" | "X-AUTH";
export type RequestHeaderValue = RequestContentTypes | RequestAuthTypes;

type RequestAuthTypes = "CURRENT_ID";

type RequestContentTypes =
    | "text/html"
    | "application/x-www-form-urlencoded"
    | "multipart/form-data"
    | "text/plain"
    | "application/json";

export type BuilderRequest<K> = Request | Promise<K>
