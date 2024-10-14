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
import { HiChevronRight } from 'react-icons/hi2';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HiTrash } from 'react-icons/hi2';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface Props {
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null | any;
}

interface Channel {
  id: number;
  name: string;
  interactions: number;
  aiAssistant: string;
  knowledgeBase: string;
}

export default function Channels(props: Props) {
  const [channels, setChannels] = useState<Channel[]>([
    { id: 1, name: 'General', interactions: 1234, aiAssistant: 'GPT-3.5', knowledgeBase: 'Company Wiki' },
    { id: 2, name: 'Support', interactions: 567, aiAssistant: 'GPT-4', knowledgeBase: 'Support Docs' },
    { id: 3, name: 'Sales', interactions: 890, aiAssistant: 'GPT-3.5', knowledgeBase: 'Product Catalog' },
    { id: 4, name: 'Marketing', interactions: 345, aiAssistant: 'GPT-4', knowledgeBase: 'Marketing Materials' },
    { id: 5, name: 'Development', interactions: 678, aiAssistant: 'GPT-3.5', knowledgeBase: 'Tech Docs' },
    { id: 6, name: 'Human Resources', interactions: 234, aiAssistant: 'GPT-4', knowledgeBase: 'HR Policies' },
    { id: 7, name: 'Finance', interactions: 456, aiAssistant: 'GPT-3.5', knowledgeBase: 'Financial Reports' },
    { id: 8, name: 'Product Management', interactions: 789, aiAssistant: 'GPT-4', knowledgeBase: 'Product Roadmap' },
    { id: 9, name: 'Customer Success', interactions: 321, aiAssistant: 'GPT-3.5', knowledgeBase: 'Customer Feedback' },
    { id: 10, name: 'Research', interactions: 543, aiAssistant: 'GPT-4', knowledgeBase: 'Research Papers' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'interactions'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [newChannel, setNewChannel] = useState({ name: '', aiAssistant: '', knowledgeBase: '' });

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
  }, [searchTerm, sortBy, sortOrder, channels]);

  const handleSort = (column: 'name' | 'interactions') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
    setWizardStep(1);
    setNewChannel({ name: '', aiAssistant: '', knowledgeBase: '' });
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleNextStep = () => {
    setWizardStep(wizardStep + 1);
  };

  const handlePreviousStep = () => {
    setWizardStep(wizardStep - 1);
  };

  const handleCreateChannel = () => {
    const newChannelWithId: Channel = {
      ...newChannel,
      id: channels.length + 1,
      interactions: 0,
    };
    setChannels([...channels, newChannelWithId]);
    console.log('Creating channel:', newChannelWithId);
    closeCreateModal();
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
            <Button className="flex items-center" onClick={openCreateModal}>
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
                <TableHead>Knowledge Base</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAndFilteredChannels.map((channel) => (
                <TableRow 
                  key={channel.id} 
                  className="hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer group"
                >
                  <TableCell 
                    className="font-medium text-zinc-900 dark:text-zinc-100"
                    onClick={() => {/* Add navigation logic here */}}
                  >
                    {channel.name}
                  </TableCell>
                  <TableCell 
                    className="text-zinc-700 dark:text-zinc-300"
                    onClick={() => {/* Add navigation logic here */}}
                  >
                    {channel.interactions.toLocaleString()}
                  </TableCell>
                  <TableCell 
                    className="text-zinc-700 dark:text-zinc-300"
                    onClick={() => {/* Add navigation logic here */}}
                  >
                    {channel.aiAssistant}
                  </TableCell>
                  <TableCell 
                    className="text-zinc-700 dark:text-zinc-300"
                    onClick={() => {/* Add navigation logic here */}}
                  >
                    {channel.knowledgeBase}
                  </TableCell>
                  <TableCell className="w-[1%] whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hidden group-hover:inline-flex h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add delete logic here
                        console.log(`Delete channel ${channel.id}`);
                      }}
                    >
                      <HiTrash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Channel</DialogTitle>
          </DialogHeader>
          {wizardStep === 1 && (
            <div>
              <label htmlFor="channelName" className="block text-sm font-medium text-gray-700">Channel Name</label>
              <Input
                id="channelName"
                value={newChannel.name}
                onChange={(e) => setNewChannel({...newChannel, name: e.target.value})}
                className="mt-1"
              />
            </div>
          )}
          {wizardStep === 2 && (
            <div>
              <label htmlFor="aiAssistant" className="block text-sm font-medium text-gray-700">AI Assistant</label>
              <Select
                value={newChannel.aiAssistant}
                onValueChange={(value) => setNewChannel({...newChannel, aiAssistant: value})}
              >
                <SelectTrigger id="aiAssistant">
                  <SelectValue placeholder="Select AI Assistant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GPT-3.5">GPT-3.5</SelectItem>
                  <SelectItem value="GPT-4">GPT-4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {wizardStep === 3 && (
            <div>
              <label htmlFor="knowledgeBase" className="block text-sm font-medium text-gray-700">Knowledge Base (Optional)</label>
              <Input
                id="knowledgeBase"
                value={newChannel.knowledgeBase}
                onChange={(e) => setNewChannel({...newChannel, knowledgeBase: e.target.value})}
                className="mt-1"
                placeholder="Enter knowledge base or leave empty"
              />
            </div>
          )}
          <DialogFooter>
            {wizardStep > 1 && (
              <Button variant="outline" onClick={handlePreviousStep}>Back</Button>
            )}
            {wizardStep < 3 ? (
              <Button onClick={handleNextStep}>Next</Button>
            ) : (
              <Button onClick={handleCreateChannel}>Create</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}