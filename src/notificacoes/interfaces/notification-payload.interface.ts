// src/notificacoes/interfaces/notification-payload.interface.ts
/**
 * Payload básico para envio de mensagens de notificação.
 */
export interface NotificationPayload {
  message: string;
  data?: unknown; // Ajuste para um tipo mais específico, se quiser
}
