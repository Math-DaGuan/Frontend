import { api } from '../utils/request';
import type { Notification } from './types';

export function getNotifications() {
  return api.get<Notification[]>('/notifications');
}
