export class PostResponseDto {
  id: string;
  content: string;
  mediaType?: string;
  mediaUrl?: string;
  userId: string;
  communityId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: any;
  comments?: any[];
  likes?: any[];

  constructor(partial: Partial<PostResponseDto>) {
    Object.assign(this, partial);
  }

  static fromEntity(entity: any): PostResponseDto {
    return new PostResponseDto({
      id: entity.id,
      content: entity.content,
      mediaType: entity.mediaType,
      mediaUrl: entity.mediaUrl,
      userId: entity.userId,
      communityId: entity.communityId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      user: entity.user,
      comments: entity.comments || [],
      likes: entity.likes || [],
    });
  }
}
