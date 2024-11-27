export interface UserFilter {
    firstname?: string;
    city?: string;
    district?: string;
    status?: string;
    gender?: { male: boolean; female: boolean }; // Doğru format
    role?: string;
  }
  