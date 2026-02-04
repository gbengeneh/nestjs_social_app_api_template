export class CreateMessageDto {
    conversationId: string;
    content?: string;
    mediaUrl?: string;
    mediaType?: string; // optional: 'IMAGE', 'VIDEO', etc.
  }
  