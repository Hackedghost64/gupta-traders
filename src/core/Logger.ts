export class Logger {
    private static isProduction = import.meta.env?.PROD ?? false;

    public static debug(message: string, ...optionalParams: unknown[]): void {
        if (!this.isProduction) {
            // eslint-disable-next-line no-console
            console.debug(`[DEBUG] ${message}`, ...optionalParams);
        }
    }

    public static info(message: string, ...optionalParams: unknown[]): void {
        // eslint-disable-next-line no-console
        console.info(`[INFO] ${message}`, ...optionalParams);
    }

    public static warn(message: string, ...optionalParams: unknown[]): void {
        // eslint-disable-next-line no-console
        console.warn(`[WARN] ${message}`, ...optionalParams);
    }

    public static error(message: string, ...optionalParams: unknown[]): void {
        // eslint-disable-next-line no-console
        console.error(`[ERROR] ${message}`, ...optionalParams);
    }
}
