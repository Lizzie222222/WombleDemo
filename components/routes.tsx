// Auth Imports
import { IRoute } from '@/types/types';
import {
  HiOutlineHome,
  HiOutlineChatBubbleLeftRight,
  HiOutlineUsers,
  HiOutlineUser,
  HiOutlineCog8Tooth,
  HiOutlineCreditCard,
  HiOutlineDocumentText,
  HiOutlineCurrencyDollar
} from 'react-icons/hi2';

export const routes: IRoute[] = [
  {
    name: 'Main Dashboard',
    path: '/dashboard/main',
    icon: <HiOutlineHome className="-mt-[7px] h-4 w-4 stroke-2 text-inherit" />,
    collapse: false
  },
  {
    name: 'AI Playground',
    path: '/dashboard/ai-chat',
    icon: (
      <HiOutlineChatBubbleLeftRight className="-mt-[7px] h-4 w-4 stroke-2 text-inherit" />
    ),
    collapse: false
  },
  {
    name: 'Profile Settings',
    path: '/dashboard/settings',
    icon: (
      <HiOutlineCog8Tooth className="-mt-[7px] h-4 w-4 stroke-2 text-inherit" />
    ),
    collapse: false
  },
  {
    name: 'Contacts',
    path: '/dashboard/contacts',
    icon: <HiOutlineUsers className="-mt-[7px] h-4 w-4 stroke-2 text-inherit" />,
    collapse: false
  },
];
