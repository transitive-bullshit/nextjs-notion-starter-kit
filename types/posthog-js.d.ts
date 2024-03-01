// types/posthog-js.d.ts

declare module 'posthog-js' {
    // Define the shape of your configuration options here
    // This example includes only a few possible configuration options
    export interface PostHogConfig {
        api_host?: string;
        app_host?: string;
        autoload?: boolean;
        capture_pageview?: boolean;
        // Add other configuration options based on PostHog's documentation
    }

    // Define the shape of the properties you might send with events
    interface EventProperties {
        [property: string]: any; // This allows any property with any value, adjust as needed
    }

    // The init function initializes PostHog with an API key and optional configuration
    export function init(apiKey: string, options?: PostHogConfig): void;

    // The track function sends an event to PostHog with an optional properties object
    export function track(event: string, properties?: EventProperties): void;

    // You would continue to declare other methods you use from the PostHog library
    // For example:
    export function identify(userId: string, properties?: EventProperties): void;
    export function reset(): void;
    // ... and so on
}
