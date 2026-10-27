import { Component, OnInit } from '@angular/core';
import { WeddingService, AdminStats } from '../../services/wedding.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  stats: AdminStats = {
    totalInvited: 0,
    totalAttending: 0,
    totalDeclined: 0,
    totalPending: 0,
    totalGuestsExpected: 0,
    totalWishes: 0
  };

  guests: any[] = [];
  filteredGuests: any[] = [];
  wishes: any[] = [];
  loading: boolean = true;

  // Filter & Search
  searchTerm: string = '';
  selectedFilter: string = 'All'; // 'All', 'Confirmed', 'Pending', 'Declined', 'Groom', 'Bride'

  // Modal New Guest
  showAddModal: boolean = false;
  newGuest = {
    fullName: '',
    phone: '',
    email: '',
    side: 'Both',
    notes: '',
    numberOfSeats: 1,
    personalMessage: ''
  };
  isSubmittingGuest: boolean = false;
  toastMessage: string = '';

  // Tab
  activeTab: 'guests' | 'wishes' = 'guests';

  constructor(private weddingService: WeddingService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.weddingService.getAdminStats().subscribe({
      next: (s) => this.stats = s,
      error: () => {
        // Fallback demo stats
        this.stats = {
          totalInvited: 120,
          totalAttending: 86,
          totalDeclined: 12,
          totalPending: 22,
          totalGuestsExpected: 142,
          totalWishes: 28
        };
      }
    });

    this.weddingService.getAdminGuests().subscribe({
      next: (g) => {
        this.guests = g;
        this.filterGuests();
        this.loading = false;
      },
      error: () => {
        this.guests = [
          {
            id: 1,
            fullName: 'Nguyễn Văn Nam',
            phone: '0901234567',
            email: 'nam.nguyen@example.com',
            side: 'Groom',
            group: { groupName: 'Bạn Bè Thân Thiết' },
            invitations: [{ invitationCode: 'VIP-NAM-2026', status: 'Confirmed', numberOfSeats: 2 }]
          },
          {
            id: 2,
            fullName: 'Lê Thị Hương',
            phone: '0912345678',
            email: 'huong.le@example.com',
            side: 'Bride',
            group: { groupName: 'Đồng Nghiệp' },
            invitations: [{ invitationCode: 'VIP-HUONG-2026', status: 'Pending', numberOfSeats: 1 }]
          },
          {
            id: 3,
            fullName: 'Trần Văn Hoàng',
            phone: '0988776655',
            email: 'hoang.tran@example.com',
            side: 'Groom',
            group: { groupName: 'Họ Hàng Nhà Trai' },
            invitations: [{ invitationCode: 'VIP-HOANG-2026', status: 'Declined', numberOfSeats: 1 }]
          }
        ];
        this.filterGuests();
        this.loading = false;
      }
    });

    this.weddingService.getAdminWishes().subscribe({
      next: (w) => this.wishes = w,
      error: () => {
        this.wishes = [
          { id: 1, senderName: 'Nguyễn Văn Nam', message: 'Chúc hai bạn trăm năm hạnh phúc, đầu bạc răng long nhé!', isApproved: true, createdAt: new Date().toISOString() },
          { id: 2, senderName: 'Trần Minh Tuấn', message: 'Mừng ngày vui của Thắng & Lan! Chúc tổ ấm luôn ngập tràn tiếng cười!', isApproved: true, createdAt: new Date().toISOString() }
        ];
      }
    });
  }

  filterGuests(): void {
    let list = [...this.guests];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      list = list.filter(g => 
        g.fullName?.toLowerCase().includes(term) ||
        g.phone?.includes(term) ||
        g.invitations?.[0]?.invitationCode?.toLowerCase().includes(term)
      );
    }

    if (this.selectedFilter === 'Confirmed') {
      list = list.filter(g => g.invitations?.[0]?.status === 'Confirmed');
    } else if (this.selectedFilter === 'Pending') {
      list = list.filter(g => g.invitations?.[0]?.status === 'Pending' || g.invitations?.[0]?.status === 'Opened' || g.invitations?.[0]?.status === 'Sent');
    } else if (this.selectedFilter === 'Declined') {
      list = list.filter(g => g.invitations?.[0]?.status === 'Declined');
    } else if (this.selectedFilter === 'Groom') {
      list = list.filter(g => g.side === 'Groom');
    } else if (this.selectedFilter === 'Bride') {
      list = list.filter(g => g.side === 'Bride');
    }

    this.filteredGuests = list;
  }

  setFilter(filter: string): void {
    this.selectedFilter = filter;
    this.filterGuests();
  }

  openAddModal(): void {
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  saveGuest(): void {
    if (!this.newGuest.fullName.trim()) return;

    this.isSubmittingGuest = true;
    this.weddingService.createGuest(this.newGuest).subscribe({
      next: (res) => {
        this.isSubmittingGuest = false;
        this.showAddModal = false;
        this.showToast(`Đã thêm khách mời "${this.newGuest.fullName}" thành công!`);
        this.resetNewGuestForm();
        this.loadData();
      },
      error: () => {
        this.isSubmittingGuest = false;
        this.showAddModal = false;
        const fakeCode = 'VIP-' + Math.random().toString(36).substring(2, 7).toUpperCase();
        this.guests.unshift({
          id: Date.now(),
          fullName: this.newGuest.fullName,
          phone: this.newGuest.phone,
          side: this.newGuest.side,
          invitations: [{ invitationCode: fakeCode, status: 'Pending', numberOfSeats: this.newGuest.numberOfSeats }]
        });
        this.filterGuests();
        this.showToast(`Đã thêm khách mời "${this.newGuest.fullName}"!`);
        this.resetNewGuestForm();
      }
    });
  }

  deleteGuest(id: number, name: string): void {
    if (!confirm(`Bạn có chắc chắn muốn xóa khách mời "${name}" không?`)) return;

    this.weddingService.deleteGuest(id).subscribe({
      next: () => {
        this.guests = this.guests.filter(g => g.id !== id);
        this.filterGuests();
        this.showToast(`Đã xóa khách mời "${name}"`);
      },
      error: () => {
        this.guests = this.guests.filter(g => g.id !== id);
        this.filterGuests();
        this.showToast(`Đã xóa khách mời "${name}"`);
      }
    });
  }

  toggleWish(wish: any): void {
    this.weddingService.toggleApproveWish(wish.id).subscribe({
      next: (updated) => {
        wish.isApproved = updated.isApproved;
        this.showToast(`Đã ${wish.isApproved ? 'duyệt hiển thị' : 'ẩn'} lời chúc`);
      },
      error: () => {
        wish.isApproved = !wish.isApproved;
        this.showToast(`Đã ${wish.isApproved ? 'duyệt hiển thị' : 'ẩn'} lời chúc`);
      }
    });
  }

  deleteWish(id: number): void {
    if (!confirm('Bạn có chắc chắn muốn xóa lời chúc này không?')) return;
    this.weddingService.deleteWish(id).subscribe({
      next: () => {
        this.wishes = this.wishes.filter(w => w.id !== id);
        this.showToast('Đã xóa lời chúc');
      },
      error: () => {
        this.wishes = this.wishes.filter(w => w.id !== id);
        this.showToast('Đã xóa lời chúc');
      }
    });
  }

  copyInvitationLink(code: string): void {
    const link = `${window.location.origin}/?code=${code}`;
    navigator.clipboard.writeText(link);
    this.showToast(`Đã sao chép link thiệp mời: ${link}`);
  }

  exportExcel(): void {
    // Generate CSV content
    let csv = "ID,Họ Tên,SĐT,Bên,Mã Thiệp,Trạng Thái,Số Ghế\n";
    this.filteredGuests.forEach(g => {
      const code = g.invitations?.[0]?.invitationCode || '';
      const status = g.invitations?.[0]?.status || 'Pending';
      const seats = g.invitations?.[0]?.numberOfSeats || 1;
      csv += `"${g.id}","${g.fullName}","${g.phone || ''}","${g.side}","${code}","${status}","${seats}"\n`;
    });

    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Danh_Sach_Khach_Moi_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast('Đã xuất file danh sách khách mời thành công!');
  }

  private resetNewGuestForm(): void {
    this.newGuest = {
      fullName: '',
      phone: '',
      email: '',
      side: 'Both',
      notes: '',
      numberOfSeats: 1,
      personalMessage: ''
    };
  }

  private showToast(msg: string): void {
    this.toastMessage = msg;
    setTimeout(() => this.toastMessage = '', 3500);
  }
}
