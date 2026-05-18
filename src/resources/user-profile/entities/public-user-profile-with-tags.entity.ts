import { PublicUserProfile } from "./public-user-profile.entity";

export class PublicUserProfileWithTags extends PublicUserProfile {
    tags!: {
        id: string;
        name: string;
        createdAt: Date;
    }[];
}
