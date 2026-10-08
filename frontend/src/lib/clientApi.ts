export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

export class ClientApi {
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const url = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    const { body, ...restOptions } = options;
    let formattedBody: BodyInit | null | undefined = undefined;
    if (body !== undefined) {
      formattedBody =
        typeof body === 'string' ? body : JSON.stringify(body);
    }

    const config: RequestInit = {
      ...restOptions,
      headers,
      body: formattedBody,
    };

    const response = await fetch(url, config);
    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const errorMessage =
        (typeof data === "object" && data !== null && "error" in data
          ? data.error
          : typeof data === "object" && data !== null && "message" in data
            ? Array.isArray(data.message)
              ? data.message.join(", ")
              : data.message
            : null) ||
        response.statusText ||
        "Request failed";
      throw new Error(errorMessage);
    }

    return data as T;
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "POST", body });
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "PUT", body });
  }

  async patch<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "PATCH", body });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const clientApi = new ClientApi();
