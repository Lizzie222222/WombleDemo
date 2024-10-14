'use client';

import DashboardLayout from '@/components/layout';
import { User } from '@supabase/supabase-js';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HiPlus } from 'react-icons/hi2';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'interactions'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sortedAndFilteredChannels = useMemo(() => {
    return channels
      .filter(channel => 
        channel.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'name') {
          return sortOrder === 'asc' 
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else if (sortBy === 'interactions') {
          return sortOrder === 'asc'
            ? a.interactions - b.interactions
            : b.interactions - a.interactions;
        }
        return 0;
      });
  }, [searchTerm, sortBy, sortOrder]);

  const handleSort = (column: 'name' | 'interactions') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

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
          <div className="mb-4">
            <Input
              className="max-w-sm"
              placeholder="Search channels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  Channel Name {sortBy === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('interactions')}
                >
                  Interactions {sortBy === 'interactions' && (sortOrder === 'asc' ? '▲' : '▼')}
                </TableHead>
                <TableHead>AI Assistant</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAndFilteredChannels.map((channel) => (
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
