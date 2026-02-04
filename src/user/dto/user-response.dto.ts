export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  banner_image?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }

  static fromEntity(entity: any): UserResponseDto {
    return new UserResponseDto({
      id: entity.id,
      name: entity.name,
      email: entity.email,
      avatar: entity.avatar,
      banner_image: entity.banner_image,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
