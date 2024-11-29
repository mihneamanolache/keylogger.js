/**
 * Interface representing a session's metadata.
 */
export interface ISession {
    /** Unique identifier for the session. */
    id:             string;
    /** Timestamp when the session was created. */
    created_at:     Date;
    /** User agent string of the client browser. */
    user_agent:     string;
    /** Persistent session cookie. */
    session_cookie: string;
}

export interface IPayload {
    /** Type of event captured. */
    type:   "keypress" | "enter";
    /** Value of the captured event. */
    value:  string;
}
