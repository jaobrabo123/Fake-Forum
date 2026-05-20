import { ApiPropertyOptions } from "@nestjs/swagger";

export interface FieldConfig {
    apiProperty?: boolean;
    apiPropertyOptions?: ApiPropertyOptions;
    nullAble?: boolean;
}
