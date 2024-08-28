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

  protected parseUTMs(): object {
    const UTMs = {}

    const rawUTMs = window.location.search.substring(1)
    const UTMList = rawUTMs.split('&')

    UTMList.map((rawUTM, idx) => {
      const UTMKey = rawUTM.split('=')[0]
      UTMs[UTMKey] = rawUTM.split('=')[1]
    })

    return UTMs
  }

  protected pruuvAnalyticsContexts(): object {
    const urlInfo = new URL(window.location.href)

    return {
      origin: urlInfo.origin,
      hostname: urlInfo.hostname,
      path: urlInfo.pathname,
      utms: this.parseUTMs(),
      userAgent: window.navigator.userAgent,
      timezone: 'GMT',
      timestamp: new Date().toUTCString()
    }
  }

  protected getOrCreateUniqueUserId(): string {
    const userExists = window.localStorage.getItem(this.userIdStorageKey)
    if (userExists !== null)
      return userExists

    const newUserId = crypto.randomUUID()
    window.localStorage.setItem(this.userIdStorageKey, newUserId)

    return newUserId
  }

  public page(additionalContext: object): void {
    const apiBody = {
      anonymousUserID: this.userId,
      eventName: 'page-view',
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
