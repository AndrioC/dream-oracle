'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import LogoutButton from './logout-button';
import { useSession } from 'next-auth/react';
import coinImage from '@/assets/coin-icon.svg';
import Image from 'next/image';
import NotificationDropdown from './notification-dropdown';
import { Menu } from 'lucide-react';

async function fetchCredits() {
  const { data } = await axios.get('/api/users/credits');
  return data.credits;
}

export default function Header() {
  const { data: session } = useSession();
  const {
    data: credits,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['credits'],
    queryFn: fetchCredits,
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const closeDropdown = () => setIsDropdownOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 text-foreground shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold text-primary">
              Dream Oracle
            </Link>
            <nav className="hidden md:flex space-x-6 text-sm font-medium">
              <Link
                href="/dreams"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Sonhos
              </Link>
              <Link
                href="/dreams/oracle"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Oráculo
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 bg-muted rounded-full px-4 py-2">
              <Image src={coinImage} alt="credits" width={20} height={20} />
              <span className="text-sm font-medium text-muted-foreground">
                {isLoading
                  ? 'Carregando...'
                  : isError
                    ? 'Erro'
                    : `${credits} créditos`}
              </span>
            </div>
            <NotificationDropdown />
            <DropdownMenu
              open={isDropdownOpen}
              onOpenChange={setIsDropdownOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={session?.user?.image || ''}
                      alt={session?.user?.name || 'User'}
                    />
                    <AvatarFallback>
                      {session?.user?.name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session?.user?.name || 'Usuário'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session?.user?.email || 'usuario@exemplo.com'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={closeDropdown}>
                  <Link href="/settings" onClick={closeDropdown}>
                    Configurações
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={closeDropdown}>
                  <LogoutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
      <div
        className={`md:hidden ${
          isMobileMenuOpen ? 'block' : 'hidden'
        } transition-all duration-300 ease-in-out`}
      >
        <nav className="flex flex-col space-y-4 bg-muted px-4 py-2">
          <Link
            href="/dreams"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Sonhos
          </Link>
          <Link
            href="/dreams/oracle"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Oráculo
          </Link>
        </nav>
      </div>
    </header>
  );
}
