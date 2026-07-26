export class Logger {
    private static readonly prefix = '[GuptaTraders]';
    private static isProduction = import.meta.env?.PROD ?? false;

    public static debug(message: string, ...optionalParams: unknown[]): void {
        if (!this.isProduction) {
            console.debug(`${this.prefix} ${message}`, ...optionalParams);
        }
    }

    public static info(message: string, ...optionalParams: unknown[]): void {
        console.info(`${this.prefix} ${message}`, ...optionalParams);
    }

    public static warn(message: string, ...optionalParams: unknown[]): void {
        console.warn(`${this.prefix} ${message}`, ...optionalParams);
    }

    public static error(message: string, ...optionalParams: unknown[]): void {
        console.error(`${this.prefix} ${message}`, ...optionalParams);
    }
}
