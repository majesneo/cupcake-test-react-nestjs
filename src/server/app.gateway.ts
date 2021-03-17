import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, Logger } from '@nestjs/common';
import { MarketStateFirstService } from './market-state-first.service';
import { MarketStateSecondService } from './market-state-second.service';
import { MarketStateThirdService } from './market-state-third.service';

@WebSocketGateway(3001)
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @Inject()
  private marketStateFirstService: MarketStateFirstService;

  @Inject()
  private marketStateSecondService: MarketStateSecondService;

  @Inject()
  private marketStateThirdService: MarketStateThirdService;

  sendResolvePoll(namePoll, service) {
    service.getNextState().subscribe((dataPoll) => {
      if (dataPoll) {
        this.server.emit(namePoll, dataPoll);
        this.sendResolvePoll(namePoll, service);
      }
    });
  }

  afterInit() {
    this.logger.log('init');
  }
  handleConnection(client: Socket) {
    this.logger.log(`client connected: ${client.id}`);
    this.sendResolvePoll('sendFirstPoll', this.marketStateFirstService);
    this.sendResolvePoll('sendSecondPoll', this.marketStateSecondService);
    this.sendResolvePoll('sendThirdPoll', this.marketStateThirdService);
  }

  handleDisconnect(client: any): any {
    this.logger.log(`client disconnected: ${client.id}`);
  }
}
