import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('send_message')
  handleMessage(@MessageBody() data: any) {
    this.server.to(data.conversationId).emit('receive_message', data);
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(@MessageBody() room: string) {
    this.server.to(room).emit('user_joined', room);
  }
}
