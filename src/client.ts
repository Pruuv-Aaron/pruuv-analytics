import { v4 as UUID4 } from 'uuid'

interface PruuvAnalyticsContext {
  utms: object
  page: {
    path: string
    referrer: string
    queryString: string
    title: string
    url: string
  }
  timezone: string
  timestamp: string
}

export class PruuvAnalyticsClient {
  private readonly apiKey: string
  private readonly funnelId: string
  private readonly baseUrl: string
  private readonly userIdStorageKey: string
  private readonly userId: string

  constructor(apiKey: string, funnelId: string) {
    this.apiKey = apiKey
    this.funnelId = funnelId
    this.baseUrl = 'http://localhost:8000/api/marketing/analytics/'
    this.userIdStorageKey = 'pruuv-uf2ld-23fsd-234sd'
    this.userId = this.getOrCreateUniqueUserId()
  }

  protected request<T>(options?: RequestInit): Promise<T> {
    const headers = {
      'Content-Type': 'application/json',
      // 'api-key': this.apiKey,
    }
    const config = {
      ...options,
      headers,
    }

    return fetch(this.baseUrl, config).then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error(response.statusText)
    })
  }

  protected pruuvAnalyticsContexts(): PruuvAnalyticsContext {
    const urlInfo = new URL(window.location.href)
    return {
      utms: {
        'sample-utm-1': 'sample-value-1',
        'sample-utm-2': 'sample-value-2',
      },
      page: {
        path: urlInfo.pathname,
        referrer: 'sample-referrer',
        queryString: 'sample-query-string',
        title: 'sample-title',
        url: urlInfo.hostname
      },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timestamp: new Date().toUTCString()
    }
  }

  protected getOrCreateUniqueUserId(): string {
    const userExists = window.localStorage.getItem(this.userIdStorageKey)
    if (userExists !== null)
      return userExists

    const newUserId = UUID4()
    window.localStorage.setItem(this.userIdStorageKey, newUserId)

    return newUserId
  }

  public pageView(additionalContext: object): void {
    const apiBody = {
      userId: this.userId,
      eventType: 'page-view',
      funnelId: this.funnelId,
      context: {
        ...this.pruuvAnalyticsContexts(),
        ...additionalContext
      }
    }

    void this.request(
        {
          method: "post",
          body: JSON.stringify(apiBody)
        }
    )
  }
}
