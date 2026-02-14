export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  is_admin: boolean;
};

export type Trip = {
  id: string;
  driver_id: string;
  from_text: string;
  to_text: string;
  depart_at: string;
  seats_total: number;
  seats_taken: number;
  notes: string | null;
  created_at: string;
  driver?: { full_name: string | null } | null;
  pending_requests_count?: number;
};

export type JoinRequestStatus = "pending" | "accepted" | "declined" | "cancelled";

export type JoinRequest = {
  id: string;
  trip_id: string;
  passenger_id: string;
  status: JoinRequestStatus;
  created_at: string;
  trip?: {
    id: string;
    from_text: string;
    to_text: string;
    depart_at: string;
    driver?: { full_name: string | null } | null;
  } | null;
};
