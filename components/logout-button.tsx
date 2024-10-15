'use client';

import { signOut } from 'next-auth/react';
import { Button } from './ui/button';

export default function LogoutButton() {
  return (
    <Button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full text-center"
    >
      Logout
    </Button>
  );
}
