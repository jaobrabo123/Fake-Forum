export class PublicUserProfile {
    id!: string;
    createdAt!: Date;
    updatedAt!: Date;
    name!: string;
    description!: string | null;
    birthDate!: Date;
    active!: boolean;
    image!: string | null;
}
