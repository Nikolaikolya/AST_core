import { type IRequestParams, type RequestHeaderKeys, type RequestHeaderValue, type RequestMethods } from "./types";
import { type ICache } from "../cache";
import { NeverCache } from "../cache/engines/NeverCache";

const BASE_URL = "http://localhost:3004";

export class Request {
  #state: RequestInit = {};
  private cache: ICache<string, unknown> = new NeverCache();

  constructor (private readonly baseUrl: string = BASE_URL) {
  }

  method (method: RequestMethods): Request {
    this.#state = { ...this.#state, method };

    return this;
  }

  setCache (cache: ICache<string, unknown>): Request {
    this.cache = cache;
    return this;
  }

  headers (name: RequestHeaderKeys, value: RequestHeaderValue): Request {
    const headers = new Headers(this.#state.headers ?? []);

    headers.append(name, value);

    this.#state.headers = headers;

    return this;
  }

  async create <K>(url: string, params?: IRequestParams): Promise<K> {
    if (params !== undefined) {
      const { cacheStrategy } = params;
      this.cache = cacheStrategy;
    }

    if (this.cache.get(url) !== undefined) {
      return this.cache.get(url) as K;
    }

    const response = await fetch(this.url(url), { ...this.#state, ...params });
    const data = await response.json() as K;

    this.cache.set(url, data);

    return data;
  }

  private url (endpoint: string): string {
    return this.baseUrl + endpoint;
  }
}
