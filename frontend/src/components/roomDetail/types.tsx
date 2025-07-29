export interface RoomMember {
  user_id: string;
  username: string;
  role: string;
  payment_status: string;
  joined_at: string;
  amount_due?: number;
}

export interface RoomDetailData {
  id: string;
  name: string;
  service: string;
  description: string;
  cost: string;
  due_date: string;
  created_at: string;
  owner_username: string;
  user_role: string;
  user_payment_status: string;
  members: RoomMember[];
  member_count: number;
  account_email?: string;
  account_password?: string;
}
