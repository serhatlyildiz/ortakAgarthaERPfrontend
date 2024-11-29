export interface UserFilter {
    firstname?: string;
    lastname?: string;
    city?: string;
    district?: string;
    status?: string;
    gender?: { male: boolean; female: boolean }; // Doğru format
    role?: string;
  }
  