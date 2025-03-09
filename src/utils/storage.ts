
import { GroupData, Member } from './types';

// Default number of ahzab in the Quran
const TOTAL_AHZAB = 60;

// Initialize with example data if nothing exists
const defaultData: GroupData = {
  name: "اقرأ و ارتقى",
  members: [
    {
      id: "1",
      name: "Naim Nadia",
      avatarColor: "#0EA5E9",
      totalAhzab: TOTAL_AHZAB,
      completedAhzab: 0,
    },
    {
      id: "2",
      name: "Abada Afaf",
      avatarColor: "#10B981",
      totalAhzab: TOTAL_AHZAB,
      completedAhzab: 0,
    },
    {
      id: "3",
      name: "Nadia Fouad",
      avatarColor: "#8B5CF6",
      totalAhzab: TOTAL_AHZAB,
      completedAhzab: 0,
    },
    {
      id: "4",
      name: "Nadia Znasti",
      avatarColor: "#F59E0B",
      totalAhzab: TOTAL_AHZAB,
      completedAhzab: 0,
    },
    {
      id: "5",
      name: "Sakina Charkaoui",
      avatarColor: "#EF4444",
      totalAhzab: TOTAL_AHZAB,
      completedAhzab: 0,
    },
  ],
  totalAhzab: TOTAL_AHZAB,
  createdAt: new Date().toISOString(),
};

// Get data from localStorage or use default
export const getGroupData = (): GroupData => {
  const data = localStorage.getItem('quranGroupData');
  return data ? JSON.parse(data) : defaultData;
};

// Save data to localStorage
export const saveGroupData = (data: GroupData): void => {
  localStorage.setItem('quranGroupData', JSON.stringify(data));
};

// Add a new member to the group
export const addMember = (name: string): GroupData => {
  const data = getGroupData();
  const colors = [
    '#0EA5E9', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444',
    '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#84CC16'
  ];
  
  const newMember: Member = {
    id: Date.now().toString(),
    name,
    avatarColor: colors[data.members.length % colors.length],
    totalAhzab: TOTAL_AHZAB,
    completedAhzab: 0,
  };
  
  data.members.push(newMember);
  saveGroupData(data);
  return data;
};

// Update a member's progress
export const updateMemberProgress = (memberId: string, completedAhzab: number): GroupData => {
  const data = getGroupData();
  const memberIndex = data.members.findIndex(m => m.id === memberId);
  
  if (memberIndex !== -1) {
    data.members[memberIndex].completedAhzab = completedAhzab;
    saveGroupData(data);
  }
  
  return data;
};

// Remove a member from the group
export const removeMember = (memberId: string): GroupData => {
  const data = getGroupData();
  data.members = data.members.filter(m => m.id !== memberId);
  saveGroupData(data);
  return data;
};

// Calculate overall group progress
export const calculateGroupProgress = (data: GroupData): number => {
  if (data.members.length === 0) return 0;
  
  const totalCompleted = data.members.reduce(
    (sum, member) => sum + member.completedAhzab, 0
  );
  
  const totalPossible = data.members.length * TOTAL_AHZAB;
  return totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0;
};

// Calculate average progress per member
export const calculateAverageProgress = (data: GroupData): number => {
  if (data.members.length === 0) return 0;
  
  const averageCompleted = data.members.reduce(
    (sum, member) => sum + (member.completedAhzab / member.totalAhzab), 0
  ) / data.members.length;
  
  return averageCompleted * 100;
};
