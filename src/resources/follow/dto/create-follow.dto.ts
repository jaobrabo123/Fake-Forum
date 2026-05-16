import { UUIDField } from "../../../common/decorators/fields";

export class CreateFollowDTO {
    @UUIDField({ apiProperty: true })
    followingId!: string;
}
