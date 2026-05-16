import { PublicUserProfile } from "../../user-profile/entities/public-user-profile.entity";
import { PublicFollow } from "./public-follow.entity";

export class WithFollowingFollow extends PublicFollow {
    following!: PublicUserProfile;
}
