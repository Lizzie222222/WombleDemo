import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HiOutlineUser } from "react-icons/hi2";

interface Contact {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
  interactions: number;
  dailyStreak: number;
  lastOnline: string;
  dateJoined: string;
}

const contacts: Contact[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', avatarUrl: 'https://i.pravatar.cc/150?img=1', interactions: 150, dailyStreak: 7, lastOnline: '2 hours ago', dateJoined: '2023-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', avatarUrl: 'https://i.pravatar.cc/150?img=2', interactions: 89, dailyStreak: 3, lastOnline: '1 day ago', dateJoined: '2023-02-20' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', avatarUrl: 'https://i.pravatar.cc/150?img=3', interactions: 234, dailyStreak: 12, lastOnline: '3 hours ago', dateJoined: '2022-11-05' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', avatarUrl: 'https://i.pravatar.cc/150?img=4', interactions: 67, dailyStreak: 1, lastOnline: 'Just now', dateJoined: '2023-03-10' },
  { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', avatarUrl: 'https://i.pravatar.cc/150?img=5', interactions: 178, dailyStreak: 5, lastOnline: '5 hours ago', dateJoined: '2023-01-30' },
];

export default function ChannelContacts() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-zinc-900 dark:text-zinc-100">Name</TableHead>
          <TableHead className="text-zinc-900 dark:text-zinc-100">Interactions</TableHead>
          <TableHead className="text-zinc-900 dark:text-zinc-100">Daily Streak</TableHead>
          <TableHead className="text-zinc-900 dark:text-zinc-100">Last Online</TableHead>
          <TableHead className="text-zinc-900 dark:text-zinc-100">Date Joined</TableHead>
          <TableHead className="text-zinc-900 dark:text-zinc-100">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((contact) => (
          <TableRow key={contact.id}>
            <TableCell className="font-medium">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={contact.avatarUrl} alt={contact.name} />
                  <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">{contact.name}</div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">{contact.email}</div>
                </div>
              </div>
            </TableCell>
            <TableCell className="text-zinc-700 dark:text-zinc-300">{contact.interactions}</TableCell>
            <TableCell className="text-zinc-700 dark:text-zinc-300">{contact.dailyStreak} days</TableCell>
            <TableCell className="text-zinc-700 dark:text-zinc-300">{contact.lastOnline}</TableCell>
            <TableCell className="text-zinc-700 dark:text-zinc-300">{contact.dateJoined}</TableCell>
            <TableCell>
              <Button variant="outline" size="sm" className="text-zinc-900 dark:text-zinc-100">
                <HiOutlineUser className="mr-2 h-4 w-4" />
                See Profile
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
