enum CarStatus {
  Active = 'active',
  Inactive = 'inactive',
  Deleted = 'deleted',
}

interface ICars {
  id?: string;
  plate?: string;
  brand?: string;
  model?: string;
  mileage?: number;
  year?: number;
  items?: string;
  daily_price?: number;
  status?: CarStatus;
  registration_date?: Date;
  updated_time?: Date;
}

export default ICars;
