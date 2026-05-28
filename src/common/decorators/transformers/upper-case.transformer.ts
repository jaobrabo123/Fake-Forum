import { Transform } from "class-transformer";

export function ToUpperCase() {
    return Transform(({ value }: { value: unknown }) =>
        typeof value === "string" ? value.toUpperCase() : value,
    );
}
