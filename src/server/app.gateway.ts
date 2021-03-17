import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway(3001)
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('messageToServer')
  handleMessage(client: Socket, payload) {
    this.server.emit('messageToClient', payload, client.id);
  }
  afterInit(server: Server): any {
    this.logger.log('init');
  }
  handleConnection(client: Socket): any {
    this.logger.log(`client connected: ${client.id}`);
  }
  handleDisconnect(client: any): any {
    this.logger.log(`client disconnected: ${client.id}`);
  }
}
