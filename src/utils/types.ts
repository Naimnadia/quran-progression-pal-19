
export interface Member {
  id: string;
  name: string;
  avatarColor: string;
  totalAhzab: number;
  completedAhzab: number;
  photoUrl?: string;
  monthlyProgress?: MonthlyProgress[];
}

export interface MonthlyProgress {
  month: string; // Format: YYYY-MM (e.g., "2023-01")
  ahzabCompleted: number;
}

export interface GroupData {
  name: string;
  members: Member[];
  totalAhzab: number;
  createdAt: string;
}
