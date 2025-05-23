export interface Activity {
  id: string;
  title: string;
  description: string;
  type: string;
  image: string;
  confirmationCode: string;
  participantCount: number;
  address: {
    latitude: number;
    longitude: number;
  };
  scheduledDate: string;
  createdAt: string;
  completedAt: string;
  private: boolean;
  creator: {
    id: string;
    name: string;
    avatar: string;
  };
  userSubscriptionStatus?: string;
  typeId?: string;
}
export interface ActivityType {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface PaginatedActivities {
  page: number;
  pageSize: number;
  totalActivities: number;
  totalPages: number;
  previous: number | null;
  next: number | null;
  activities: Activity[];
}

export interface ParticipantsActivity {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  subscriptionStatus: string;
  confirmedAt: Date;
  acepptOrDeniedParticipants?: boolean;
}
