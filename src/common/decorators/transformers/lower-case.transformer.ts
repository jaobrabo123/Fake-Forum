import { Transform } from "class-transformer";

export function ToLowerCase() {
    return Transform(({ value }: { value: unknown }) =>
        typeof value === "string" ? value.toLowerCase() : value,
    );
}
