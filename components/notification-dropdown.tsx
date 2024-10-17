import React, { useState } from 'react';
import { Bell, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { UserSettings } from '@prisma/client';
import { useSession } from 'next-auth/react';

type Notification = {
  id: number;
  type: string;
  dreamId: number;
  userId: number;
  read: boolean;
  createdAt: string;
  dream: {
    title: string;
  };
};

const fetchUserSettings = async (): Promise<UserSettings> => {
  const { data } = await axios.get('/api/users/load-settings');
  return data;
};

async function fetchNotifications(): Promise<Notification[]> {
  const { data } = await axios.get('/api/users/load-notification');
  return data;
}

async function markNotificationsAsRead(
  notificationIds: number[]
): Promise<void> {
  await axios.put('/api/users/read-notification', { notificationIds });
}

function getNotificationMessage(
  notification: Notification,
  t: (key: string, values?: Record<string, string>) => string
): string {
  switch (notification.type) {
    case 'LIKE':
      return t('notifications.types.like', {
        dreamTitle: notification.dream.title,
      });
    case 'COMMENT':
      return t('notifications.types.comment', {
        dreamTitle: notification.dream.title,
      });
    default:
      return t('notifications.types.default', {
        dreamTitle: notification.dream.title,
      });
  }
}

export default function NotificationDropdown() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const t = useTranslations('notifications');

  const {
    data: notifications,
    isLoading: notificationsLoading,
    isError: notificationsError,
  } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
  });

  const {
    data: userSettings,
    isLoading: userSettingsLoading,
    isError: userSettingsError,
  } = useQuery<UserSettings>({
    queryKey: ['userSettings'],
    queryFn: fetchUserSettings,
    enabled: !!session,
  });

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notifications'],
      });
    },
  });

  const unreadNotifications = notifications?.filter((n) => !n.read) || [];
  const unreadCount = unreadNotifications.length;

  const handleMarkAsRead = (notificationId: number) => {
    markAsReadMutation.mutate([notificationId]);
  };

  const handleMarkAllAsRead = () => {
    if (notifications) {
      const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
      markAsReadMutation.mutate(unreadIds);
    }
  };

  const getDateLocale = () => {
    return userSettings?.language === 'en-US' ? enUS : ptBR;
  };

  const formatDate = (date: string) => {
    const locale = getDateLocale();
    const formatString = locale === enUS ? "d 'of' MMMM" : "d 'de' MMMM";
    return format(new Date(date), formatString, { locale });
  };

  const isLoading = notificationsLoading || userSettingsLoading;
  const isError = notificationsError || userSettingsError;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative p-2">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-0 top-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-4 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg">{t('title')}</h3>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs"
              disabled={markAsReadMutation.isPending}
            >
              {markAsReadMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {t('markAllAsRead')}
            </Button>
          )}
        </div>
        {isLoading ? (
          <p className="text-center text-muted-foreground">{t('loading')}</p>
        ) : isError ? (
          <p className="text-center text-red-500">{t('error')}</p>
        ) : notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start space-x-4 p-3 rounded-lg bg-accent/50 relative"
            >
              <div className="flex-grow pr-8">
                <p className="font-medium text-sm">
                  {getNotificationMessage(notification, t)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(notification.createdAt)}
                </p>
              </div>
              {!notification.read && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 hover:bg-green-100"
                  onClick={() => handleMarkAsRead(notification.id)}
                  disabled={markAsReadMutation.isPending}
                >
                  {markAsReadMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                  ) : (
                    <Check className="h-4 w-4 text-green-600" />
                  )}
                  <span className="sr-only">{t('markAsRead')}</span>
                </Button>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground text-base">
            {t('empty')}
          </p>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
