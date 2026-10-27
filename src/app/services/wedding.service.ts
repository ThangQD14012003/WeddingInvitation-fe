import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface WeddingData {
  id: number;
  brideName: string;
  groomName: string;
  weddingDate: string;
  venue: string;
  venueAddress?: string;
  venueMapUrl?: string;
  brideAvatar?: string;
  groomAvatar?: string;
  coverImageUrl?: string;
  themeColor?: string;
  customSlug: string;
  events: WeddingEvent[];
  photos: WeddingPhoto[];
  stories: WeddingStory[];
  gifts: GiftRegistry[];
}

export interface WeddingEvent {
  id: number;
  eventName: string;
  eventType: string;
  startTime: string;
  endTime?: string;
  location: string;
  description?: string;
  sortOrder: number;
  sessions: EventSession[];
}

export interface EventSession {
  id: number;
  sessionName: string;
  startAt: string;
  endAt?: string;
  description?: string;
}

export interface WeddingPhoto {
  id: number;
  photoUrl: string;
  thumbnailUrl?: string;
  caption?: string;
}

export interface WeddingStory {
  id: number;
  title: string;
  content: string;
  eventDate: string;
  imageUrl?: string;
}

export interface GiftRegistry {
  id: number;
  giftName: string;
  description?: string;
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  qrCodeDataUrl?: string;
}

export interface GuestWish {
  id?: number;
  senderName: string;
  message: string;
  createdAt?: string;
  isApproved?: boolean;
}

export interface AdminStats {
  totalInvited: number;
  totalAttending: number;
  totalDeclined: number;
  totalPending: number;
  totalGuestsExpected: number;
  totalWishes: number;
}

@Injectable({
  providedIn: 'root'
})
export class WeddingService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Public Guest API
  getWedding(slug: string = 'thang-lan'): Observable<WeddingData> {
    return this.http.get<WeddingData>(`${this.baseUrl}/wedding/${slug}`);
  }

  getInvitation(code: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/wedding/invitation/${code}`);
  }

  submitRsvp(data: {
    invitationCode: string;
    isAttending: boolean;
    guestCount: number;
    dietaryNotes?: string;
    specialRequests?: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/rsvp`, data);
  }

  getWishes(): Observable<GuestWish[]> {
    return this.http.get<GuestWish[]>(`${this.baseUrl}/wishes`);
  }

  postWish(data: { invitationCode?: string; senderName: string; message: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/wishes`, data);
  }

  // Admin API
  getAdminStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.baseUrl}/admin/dashboard`);
  }

  getAdminGuests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/guests`);
  }

  createGuest(guest: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/admin/guests`, guest);
  }

  deleteGuest(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/admin/guests/${id}`);
  }

  getAdminWishes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/wishes`);
  }

  toggleApproveWish(id: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/admin/wishes/${id}/toggle-approve`, {});
  }

  deleteWish(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/admin/wishes/${id}`);
  }
}
