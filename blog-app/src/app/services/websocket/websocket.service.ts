import { Injectable, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { io, Socket } from 'socket.io-client';

export interface WsMessage {
  type: string;
  payload: any;
}

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private socket: Socket | null = null;
  private messages$ = new Subject<WsMessage>();

  connect(): void {
    if (!environment.useApi) return;

    try {
     this.socket = io('http://localhost:3000', {
    path: '/events',
    transports: ['websocket'],
    reconnection: true
    });

      this.socket.on('comment-created', (data: WsMessage) => {
        this.messages$.next(data);
      });

      this.socket.on('comment-rating-changed', (data: WsMessage) => {
        this.messages$.next(data);
      });

      this.socket.on('article-rating-changed', (data: WsMessage) => {
        this.messages$.next(data);
      });

      this.socket.on('connect_error', (err) => {
        console.warn('WebSocket connection error:', err);
      });
    } catch (e) {
      console.warn('WebSocket not available:', e);
    }
  }

  subscribeToArticle(articleId: string): void {
    this.socket?.emit('subscribe-article', articleId);
  }

  unsubscribeFromArticle(articleId: string): void {
    this.socket?.emit('unsubscribe-article', articleId);
  }

  getMessages(): Observable<WsMessage> {
    return this.messages$.asObservable();
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }
}