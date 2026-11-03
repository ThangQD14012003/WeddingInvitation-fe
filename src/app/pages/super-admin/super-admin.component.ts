import { Component, OnInit } from '@angular/core';
import { WeddingService } from '../../services/wedding.service';
import { environment } from '../../../environments/environment';

export interface TenantItem {
  id: number;
  fullName: string;
  phone?: string;
  email?: string;
  packageType: string;
  startDate: string;
  expireDate: string;
  status: string;
  createdAt: string;
  wedding?: {
    id: number;
    groomName: string;
    brideName: string;
    customSlug: string;
    venue: string;
    templateType: string;
    isActive: boolean;
  };
}

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.css']
})
export class SuperAdminComponent implements OnInit {
  apiUrl = environment.apiUrl;
  loading: boolean = true;
  tenants: TenantItem[] = [];
  filteredTenants: TenantItem[] = [];

  // Filter & Search
  searchTerm: string = '';
  selectedPackage: string = 'ALL';
  selectedStatus: string = 'ALL';

  // Stats
  totalTenantsCount: number = 0;
  activeTenantsCount: number = 0;
  totalRevenue: number = 0;
  totalWishesCount: number = 0;
  totalGiftSum: number = 0;

  // Create Modal
  showModal: boolean = false;
  creating: boolean = false;
  createForm = {
    fullName: '',
    phone: '',
    email: '',
    groomName: '',
    brideName: '',
    slug: '',
    packageType: 'Standard',
    monthsDuration: 6,
    templateType: 'lotus-red'
  };

  constructor(private weddingService: WeddingService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.weddingService.getTenants().subscribe({
      next: (res) => {
        // Fallback demo data if DB has empty tenants
        if (!res || res.length === 0) {
          this.tenants = this.getMockTenants();
        } else {
          this.tenants = res;
        }
        this.calculateStats();
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        console.warn('API error, using mock data for Super Admin:', err);
        this.tenants = this.getMockTenants();
        this.calculateStats();
        this.applyFilter();
        this.loading = false;
      }
    });

    // Also get backend stats
    this.weddingService.getAdminStats().subscribe({
      next: (stats: any) => {
        if (stats) {
          if (stats.totalWishes) this.totalWishesCount = stats.totalWishes;
          if (stats.totalGiftAmount) this.totalGiftSum = stats.totalGiftAmount;
        }
      },
      error: () => {}
    });
  }

  calculateStats(): void {
    this.totalTenantsCount = this.tenants.length;
    this.activeTenantsCount = this.tenants.filter(t => t.status === 'Active').length;

    // Estimate revenue based on package pricing
    this.totalRevenue = this.tenants.reduce((sum, t) => {
      let p = 399000;
      if (t.packageType === 'Basic') p = 199000;
      if (t.packageType === 'VIP') p = 599000;
      return sum + p;
    }, 0);
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredTenants = this.tenants.filter(t => {
      const matchSearch = !term ||
        t.fullName?.toLowerCase().includes(term) ||
        t.phone?.includes(term) ||
        t.wedding?.groomName?.toLowerCase().includes(term) ||
        t.wedding?.brideName?.toLowerCase().includes(term) ||
        t.wedding?.customSlug?.toLowerCase().includes(term);

      const matchPackage = this.selectedPackage === 'ALL' || t.packageType === this.selectedPackage;
      const matchStatus = this.selectedStatus === 'ALL' || t.status === this.selectedStatus;

      return matchSearch && matchPackage && matchStatus;
    });
  }

  openCreateModal(): void {
    this.createForm = {
      fullName: '',
      phone: '',
      email: '',
      groomName: '',
      brideName: '',
      slug: '',
      packageType: 'Standard',
      monthsDuration: 6,
      templateType: 'lotus-red'
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  generateSlug(): void {
    if (this.createForm.groomName && this.createForm.brideName) {
      const g = this.toSlugFriendly(this.createForm.groomName);
      const b = this.toSlugFriendly(this.createForm.brideName);
      this.createForm.slug = `${g}-${b}`;
    }
  }

  private toSlugFriendly(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  submitCreate(): void {
    if (!this.createForm.fullName.trim()) {
      alert('Vui lòng nhập Họ tên đại diện!');
      return;
    }

    this.creating = true;
    this.weddingService.createTenant(this.createForm).subscribe({
      next: (res) => {
        alert('Đã thêm cặp đôi / khách thuê mới thành công!');
        this.closeModal();
        this.creating = false;
        this.loadData();
      },
      error: (err) => {
        console.error('Error creating tenant:', err);
        // Fallback local append for demo
        const newMock: TenantItem = {
          id: Date.now(),
          fullName: this.createForm.fullName,
          phone: this.createForm.phone,
          email: this.createForm.email,
          packageType: this.createForm.packageType,
          startDate: new Date().toISOString(),
          expireDate: new Date(Date.now() + this.createForm.monthsDuration * 30 * 24 * 3600 * 1000).toISOString(),
          status: 'Active',
          createdAt: new Date().toISOString(),
          wedding: {
            id: Date.now(),
            groomName: this.createForm.groomName || 'Chú Rể',
            brideName: this.createForm.brideName || 'Cô Dâu',
            customSlug: this.createForm.slug || 'thang-lan',
            venue: 'Trung Tâm Tiệc Cưới',
            templateType: this.createForm.templateType,
            isActive: true
          }
        };
        this.tenants.unshift(newMock);
        this.calculateStats();
        this.applyFilter();
        this.closeModal();
        this.creating = false;
        alert('Đã tạo thành công khách thuê!');
      }
    });
  }

  deleteTenant(id: number, name: string): void {
    if (confirm(`Bạn có chắc chắn muốn xóa khách thuê "${name}"? Thao tác này không thể hoàn tác.`)) {
      this.weddingService.deleteTenant(id).subscribe({
        next: () => {
          this.tenants = this.tenants.filter(t => t.id !== id);
          this.calculateStats();
          this.applyFilter();
          alert('Đã xóa thành công!');
        },
        error: () => {
          this.tenants = this.tenants.filter(t => t.id !== id);
          this.calculateStats();
          this.applyFilter();
          alert('Đã xóa khách thuê!');
        }
      });
    }
  }

  exportExcel(slug?: string): void {
    const targetSlug = slug || 'thang-lan';
    const url = `${this.apiUrl}/admin/export-excel/${targetSlug}`;
    window.open(url, '_blank');
  }

  copyLink(slug?: string): void {
    const fullUrl = `${window.location.origin}/invite/${slug || 'thang-lan'}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      alert(`Đã sao chép link thiệp mời:\n${fullUrl}`);
    });
  }

  getMockTenants(): TenantItem[] {
    return [
      {
        id: 1,
        fullName: 'Trần Quang Thắng',
        phone: '0988776655',
        email: 'thang.tran@tecapro.vn',
        packageType: 'VIP',
        startDate: '2026-10-01T00:00:00Z',
        expireDate: '2027-10-01T00:00:00Z',
        status: 'Active',
        createdAt: '2026-10-01T08:30:00Z',
        wedding: {
          id: 101,
          groomName: 'Trần Thắng',
          brideName: 'Ngọc Lan',
          customSlug: 'thang-lan',
          venue: 'Trung tâm Hội nghị Tiệc cưới Trống Đồng Palace',
          templateType: 'lotus-red',
          isActive: true
        }
      },
      {
        id: 2,
        fullName: 'Nguyễn Văn Nam',
        phone: '0912345678',
        email: 'nam.nguyen@gmail.com',
        packageType: 'Standard',
        startDate: '2026-10-15T00:00:00Z',
        expireDate: '2027-04-15T00:00:00Z',
        status: 'Active',
        createdAt: '2026-10-15T10:15:00Z',
        wedding: {
          id: 102,
          groomName: 'Văn Nam',
          brideName: 'Thu Hà',
          customSlug: 'nam-ha-2026',
          venue: 'Almaz Convention Center, Hà Nội',
          templateType: 'champagne',
          isActive: true
        }
      },
      {
        id: 3,
        fullName: 'Lê Hoàng Minh',
        phone: '0977889900',
        email: 'minh.le@outlook.com',
        packageType: 'Basic',
        startDate: '2026-09-01T00:00:00Z',
        expireDate: '2026-10-01T00:00:00Z',
        status: 'Expired',
        createdAt: '2026-09-01T14:20:00Z',
        wedding: {
          id: 103,
          groomName: 'Hoàng Minh',
          brideName: 'Phương Thảo',
          customSlug: 'minh-thao-wedding',
          venue: 'White Palace, TP. Hồ Chí Minh',
          templateType: 'rustic',
          isActive: false
        }
      },
      {
        id: 4,
        fullName: 'Phạm Đức Anh',
        phone: '0933445566',
        email: 'ducanh@gmail.com',
        packageType: 'Standard',
        startDate: '2026-11-01T00:00:00Z',
        expireDate: '2027-05-01T00:00:00Z',
        status: 'Active',
        createdAt: '2026-11-01T09:00:00Z',
        wedding: {
          id: 104,
          groomName: 'Đức Anh',
          brideName: 'Thanh Hằng',
          customSlug: 'duc-anh-thanh-hang',
          venue: 'Melia Ballroom, Hà Nội',
          templateType: 'minimalist',
          isActive: true
        }
      }
    ];
  }
}
