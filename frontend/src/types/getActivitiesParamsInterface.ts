interface GetActivitiesParams {
  page?: number; 
  pageSize?: number; 
  typeId?: string; 
  orderBy?: string; 
  order?: "asc" | "desc"; 
}

export default GetActivitiesParams;
