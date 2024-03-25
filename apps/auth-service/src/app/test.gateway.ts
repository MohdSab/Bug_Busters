import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { gateway, Gateway } from '@bb/gateway-lib';

const port = +process.env.WS_PORT || 3001;
@WebSocketGateway(port, {
  cors: {
    origin: '*',
    credentials: true,
    allowedHeaders: '*',
  },
})
export class TestGateway implements OnGatewayInit {
  afterInit(server: any) {
    new Gateway(process.env.GATEWAY_HOST + ':' + process.env.GATEWAY_PORT)
      .RegisterService({
        key: 'test',
        port,
      })
      .then((res) => {
        console.log('Registered route: ', res);
      })
      .catch(console.error);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  @SubscribeMessage('holy shit')
  handle(client: Socket) {
    return client.id;
  }
}
