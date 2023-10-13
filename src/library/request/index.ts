import { Request } from './class';
import { type BuilderRequest, type IRequestParams } from "./types";

export async function builderRequest <K> (url: string, params?: IRequestParams): Promise<K>;
export function builderRequest (params?: IRequestParams): Request;
export function builderRequest <K> (url?: string | IRequestParams, params?: IRequestParams): BuilderRequest<K> {
  const baseRequest = new Request()
    .method("GET").headers("Content-Type", "application/json");
  if (url !== undefined && typeof url === "string") {
    return baseRequest.create<K>(url, params);
  }

  if (url !== undefined && typeof url === "object") {
    if (url.cacheStrategy !== undefined) {
      baseRequest.setCache(url.cacheStrategy);
    }
  }

  return baseRequest;
}
