import {
  Controller,
  Get,
  InternalServerErrorException,
  Res,
  MessageEvent,
  Post,
  Body,
} from '@nestjs/common';
import { Subject } from 'rxjs';
import { Response } from 'express';
import { v1 } from 'uuid';
import { GiftCardService } from '../services/gift-card.service';
import { PrintGiftCardsDto } from '../dto/print-gift-cards.dto';

@Controller('sse')
export class GiftCardsSseController {
  /** List of connected clients */
  connectedClients = new Map<
    string,
    { close: () => void; subject: Subject<MessageEvent> }
  >();

  constructor(private readonly giftCardService: GiftCardService) {}

  @Post()
  async example(@Res() response: Response, @Body() dto: PrintGiftCardsDto) {
    console.log(dto);
    let validationFailed = false;

    if (validationFailed)
      throw new InternalServerErrorException({
        message: 'Generating Cards Failed',
        error: 100,
        status: 500,
      });

    // Create a subject for this client in which we'll push our data
    const subject = new Subject<MessageEvent>();

    // Create an observer that will take the data pushed to the subject and
    // write it to our connection stream in the right format
    const observer = {
      next: (msg: MessageEvent) => {
        // Called when data is pushed to the subject using subject.next()
        // Encode the message as SSE (see https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events)

        // Here's an example of what it could look like, assuming msg.data is an object
        // If msg.data is not an object, you should adjust accordingly

        if (msg.type) response.write(`event: ${msg.type}\n`);
        if (msg.id) response.write(`id: ${msg.id}\n`);
        if (msg.retry) response.write(`retry: ${msg.retry}\n`);

        response.write(`data: ${JSON.stringify(msg.data)}\n\n`);
      },
      complete: () => {
        console.log(`observer.complete`);
      },
      error: (err: any) => {
        console.log(`observer.error: ${err}`);
      },
    };

    // Attach the observer to the subject
    subject.subscribe(observer);

    // Add the client to our client list
    const clientKey = v1(); // String that identifies your client
    this.connectedClients.set(clientKey, {
      close: () => {
        response.end();
      }, // Will allow us to close the connection if needed
      subject, // Subject related to this client
    });

    // Handle connection closed
    response.on('close', () => {
      console.log(`Closing connection for client ${clientKey}`);
      subject.complete(); // End the observable stream
      this.connectedClients.delete(clientKey); // Remove client from the list
      response.end(); // Close connection (unsure if this is really requried, to release the resources)
    });

    // Send headers to establish SSE connection
    response.set({
      'Cache-Control':
        'private, no-cache, no-store, must-revalidate, max-age=0, no-transform',
      Connection: 'keep-alive',
      'Content-Type': 'text/event-stream',
    });

    response.flushHeaders();

    // From this point, the connection with the client is established.
    // We can send data using the subject.next(MessageEvent) function.
    // See the sendDataToClient() function below.

    const onProgress = (
      n: number,
      KEY: string,
      fileName: string,
      ack: string,
    ) => {
      this.sendDataToClient(KEY, {
        data: { progress: n, fileName: fileName, ack: ack },
      });
      if (fileName.length > 0 || ack === 'No cards matches the given ids') {
        this.connectedClients?.get(KEY)?.close();
      }
    };

    this.giftCardService.printCards(clientKey, onProgress, dto);
  }

  /** Send a SSE message to the specified client */
  sendDataToClient(clientId: string, message: MessageEvent) {
    this.connectedClients?.get(clientId)?.subject.next(message);
  }
}
