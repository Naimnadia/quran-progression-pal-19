
export interface Member {
  id: string;
  name: string;
  avatarColor: string;
  totalAhzab: number;
  completedAhzab: number;
}

export interface GroupData {
  name: string;
  members: Member[];
  totalAhzab: number;
  createdAt: string;
}
