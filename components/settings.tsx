'use client';

import { useTheme } from 'next-themes';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-toastify';

type UserSettings = {
  language: string;
  theme: string;
};

const fetchUserSettings = async (): Promise<UserSettings> => {
  const { data } = await axios.get('/api/users/load-settings');
  return data;
};

const updateUserSettings = async (
  settings: UserSettings
): Promise<UserSettings> => {
  const { data } = await axios.put('/api/users/update-settings', settings);
  return data;
};

export default function SettingsPageComponent() {
  const { data: session } = useSession();
  const { setTheme } = useTheme();
  const queryClient = useQueryClient();

  const { data: userSettings, isLoading } = useQuery<UserSettings>({
    queryKey: ['userSettings'],
    queryFn: fetchUserSettings,
    enabled: !!session,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: updateUserSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(['userSettings'], data);
      setTheme(data.theme);
      toast.success('Configurações atualizadas com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar as configurações. Tente novamente.');
    },
  });

  const handleLanguageChange = (newLanguage: string) => {
    if (userSettings) {
      updateSettingsMutation.mutate({ ...userSettings, language: newLanguage });
    }
  };

  const handleThemeChange = (newTheme: string) => {
    if (userSettings) {
      updateSettingsMutation.mutate({ ...userSettings, theme: newTheme });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando configurações...</div>;
  }

  if (!userSettings) {
    return (
      <div className="text-center py-8">Configurações não encontradas</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Configurações do Usuário
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label
              htmlFor="language"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Idioma
            </label>
            <Select
              value={userSettings.language}
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger id="language">
                <SelectValue placeholder="Selecione o idioma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                <SelectItem value="en-US">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label
              htmlFor="theme"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Tema
            </label>
            <Select
              value={userSettings.theme}
              onValueChange={handleThemeChange}
            >
              <SelectTrigger id="theme">
                <SelectValue placeholder="Selecione o tema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Claro</SelectItem>
                <SelectItem value="dark">Escuro</SelectItem>
                <SelectItem value="system">Sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
