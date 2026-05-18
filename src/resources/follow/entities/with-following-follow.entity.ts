import { SuccessResponseBody } from "../../../common/interceptors/entities/success-response-body.entity";
import { PublicUserProfile } from "../../user-profile/entities/public-user-profile.entity";
import { PublicFollow } from "./public-follow.entity";

export class WithFollowingFollow extends PublicFollow {
    following!: PublicUserProfile;
}

export class WithFollowingFollowResponse extends SuccessResponseBody<WithFollowingFollow> {
    declare content: WithFollowingFollow;
}
