import { SuccessResponseBody } from "../../../common/interceptors/entities/success-response-body.entity";
import { PublicUserProfile } from "../../user-profile/entities/public-user-profile.entity";
import { PublicFollow } from "./public-follow.entity";

export class WithFollowerFollow extends PublicFollow {
    follower!: PublicUserProfile;
}

export class WithFollowerFollowResponse extends SuccessResponseBody<WithFollowerFollow> {
    declare content: WithFollowerFollow;
}
