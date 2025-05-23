type activityData = {
    title: string;
    description: string;
    typeId: string; 
    confirmationCode: string;
    image?: string;
    scheduledDate: Date;
    createdAt: Date;
    deletedAt?: Date;
    completedAt?: Date;
    private: boolean;
    creatorId: string;
  };
  
  export default activityData;