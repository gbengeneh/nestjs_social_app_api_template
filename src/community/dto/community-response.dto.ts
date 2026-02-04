export class CommunityResponseDto {
  id: string;
  name: string;
  description?: string;
  members: any[];
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<CommunityResponseDto>) {
    Object.assign(this, partial);
  }

  static fromEntity(entity: any): CommunityResponseDto {
    return new CommunityResponseDto({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      members: entity.members || [],
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
