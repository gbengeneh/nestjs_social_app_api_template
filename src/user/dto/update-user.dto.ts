export class UpdateUserDto {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
  provider?: string;
  providerId?: string;
  avatar?: string;
  bio?: string;
  banner_image?: string;

  facebookLink?: string;
  instagramLink?: string;
  twitterLink?: string;

  gender?: string;
  dob?: Date;
}
