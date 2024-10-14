'use client';

import DashboardLayout from '@/components/layout';
import { User } from '@supabase/supabase-js';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HiPlus } from 'react-icons/hi2';

interface Props {
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null | any;
}

interface Channel {
  id: number;
  name: string;
  interactions: number;
  aiAssistant: string;
}

const channels: Channel[] = [
  { id: 1, name: 'General', interactions: 1234, aiAssistant: 'GPT-3.5' },
  { id: 2, name: 'Support', interactions: 567, aiAssistant: 'GPT-4' },
  { id: 3, name: 'Sales', interactions: 890, aiAssistant: 'GPT-3.5' },
  { id: 4, name: 'Marketing', interactions: 345, aiAssistant: 'GPT-4' },
  { id: 5, name: 'Development', interactions: 678, aiAssistant: 'GPT-3.5' },
  { id: 6, name: 'Human Resources', interactions: 234, aiAssistant: 'GPT-4' },
  { id: 7, name: 'Finance', interactions: 456, aiAssistant: 'GPT-3.5' },
  { id: 8, name: 'Product Management', interactions: 789, aiAssistant: 'GPT-4' },
  { id: 9, name: 'Customer Success', interactions: 321, aiAssistant: 'GPT-3.5' },
  { id: 10, name: 'Research', interactions: 543, aiAssistant: 'GPT-4' },
];

export default function Channels(props: Props) {
  return (
    <DashboardLayout
      user={props.user}
      userDetails={props.userDetails}
      title="Channels"
      description="Manage your AI channels"
    >
      <div className="h-full w-full">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-zinc-950 dark:text-white">Channels</h2>
            <Button className="flex items-center">
              <HiPlus className="mr-2" /> Create Channel
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-zinc-800 dark:text-zinc-200">Channel Name</TableHead>
                <TableHead className="text-zinc-800 dark:text-zinc-200">Interactions</TableHead>
                <TableHead className="text-zinc-800 dark:text-zinc-200">AI Assistant</TableHead>
                <TableHead className="text-zinc-800 dark:text-zinc-200">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {channels.map((channel) => (
                <TableRow key={channel.id} className="hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                  <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">{channel.name}</TableCell>
                  <TableCell className="text-zinc-700 dark:text-zinc-300">{channel.interactions.toLocaleString()}</TableCell>
                  <TableCell className="text-zinc-700 dark:text-zinc-300">{channel.aiAssistant}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="hover:bg-zinc-200 dark:hover:bg-zinc-700">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
}
