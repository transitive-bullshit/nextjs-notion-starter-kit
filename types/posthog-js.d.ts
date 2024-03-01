// types/posthog-js.d.ts

declare module 'posthog-js' {
    export interface Config {
        api_host?: string;
        app_host?: string;
        autoload?: boolean;
        capture_pageview?: boolean;
        // Add other configuration options based on PostHog's documentation
    }

    export interface EventProperties {
        [property: string]: any;
    }

    export function init(apiKey: string, options?: Config): void;
    export function track(event: string, properties?: EventProperties): void;
    export function identify(userId: string, properties?: EventProperties): void;
    export function reset(): void;
    export function capture(event: string, properties?: EventProperties): void;
    // Add other PostHog methods you use here
}
