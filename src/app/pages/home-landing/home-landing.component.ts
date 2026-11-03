import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface TemplateItem {
  id: string;
  name: string;
  tag: string;
  category: string;
  badge: string;
  colorScheme: string;
  colorHex: string;
  previewImage: string;
  description: string;
  features: string[];
  demoUrl: string;
  isAvailable: boolean;
}

export interface CategoryTab {
  id: string;
  name: string;
  icon: string;
  badge?: string;
  count?: number;
  available: boolean;
}

@Component({
  selector: 'app-home-landing',
  templateUrl: './home-landing.component.html',
  styleUrls: ['./home-landing.component.css']
})
export class HomeLandingComponent implements OnInit {
  activeCategory: string = 'wedding';
  searchKeyword: string = '';
  selectedFilter: string = 'all';

  categories: CategoryTab[] = [
    { id: 'wedding', name: 'Thiệp Cưới', icon: 'fa-heart', count: 10, available: true },
    { id: 'housewarming', name: 'Mời Tân Gia', icon: 'fa-house-chimney', badge: 'Sắp ra mắt', available: false },
    { id: 'graduation', name: 'Lễ Tốt Nghiệp', icon: 'fa-graduation-cap', badge: 'Sắp ra mắt', available: false },
    { id: 'birthday', name: 'Sinh Nhật & Thôi Nôi', icon: 'fa-cake-candles', badge: 'Sắp ra mắt', available: false },
    { id: 'events', name: 'Sự Kiện & Gala', icon: 'fa-champagne-glasses', badge: 'Sắp ra mắt', available: false }
  ];

  templates: TemplateItem[] = [
    {
      id: 'lotus-red',
      name: 'Liên Hạc - Đỏ',
      tag: 'Truyền Thống Hoàng Gia',
      category: 'wedding',
      badge: 'Bán chạy nhất',
      colorScheme: 'Đỏ rượu & Vàng đồng',
      colorHex: '#a3252e',
      previewImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=85',
      description: 'Họa tiết chim Hạc & hoa Sen trang nghiêm kết hợp font thư pháp Great Vibes uốn lượn, thẻ Tiệc Cưới nổi bật và VietQR mừng cưới thông minh.',
      features: ['Mở phong bì 3D chim hạc', 'Thư pháp Great Vibes', 'Thẻ Tiệc Cưới riêng biệt', 'Mừng cưới VietQR tự động'],
      demoUrl: '/invite/thang-lan?demo=true&template=lotus-red',
      isAvailable: true
    },
    {
      id: 'wedding-minimal-darkred',
      name: 'Tối Giản - Đỏ Đô',
      tag: 'Tối Giản & Thanh Lịch',
      category: 'wedding',
      badge: 'Hot 2026',
      colorScheme: 'Đỏ đô & Vàng cát',
      colorHex: '#7a1f2b',
      previewImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=85',
      description: 'Phong cách tối giản chuẩn Châu Âu với font chữ Cormorant Garamond, con dấu sáp vàng tròn nổi và ngày cưới 20 số lớn ấn tượng.',
      features: ['Typography Cormorant', 'Con dấu sáp vàng Monogram', 'Save The Date nghệ thuật', 'Bản đồ Google Maps 1 chạm'],
      demoUrl: '/invite/thang-lan?demo=true&template=wedding-minimal-darkred',
      isAvailable: true
    },
    {
      id: 'envelope-red',
      name: 'Phong Thư - Đỏ',
      tag: 'Kéo Mở Phong Bì 3D',
      category: 'wedding',
      badge: 'Tương tác 3D',
      colorScheme: 'Đỏ đất & Kem hồng',
      colorHex: '#8e1b2c',
      previewImage: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=85',
      description: 'Bao thư tương tác 3D nắp gập sang trọng, hé lộ tấm thiệp ảnh cưới Polaroid trượt ra từ bên trong cùng lời mời thân mật.',
      features: ['Bao thư 3D nắp gập', 'Ảnh cưới Polaroid nhô ra', 'Hiệu ứng mở phong bì lãng mạn', 'RSVP xác nhận bàn tiệc'],
      demoUrl: '/invite/thang-lan?demo=true&template=envelope-red',
      isAvailable: true
    },
    {
      id: 'songhy-red',
      name: 'Song Hỷ - Đỏ',
      tag: 'Cát Tường Như Ý',
      category: 'wedding',
      badge: 'Cổ truyền',
      colorScheme: 'Đỏ tươi & Hoàng kim',
      colorHex: '#b91c1c',
      previewImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=85',
      description: 'Biểu tượng chữ Song Hỷ (囍) mạ vàng cát tường, hoa văn triện cổ truyền và đèn lồng đỏ mang trọn vẹn phúc khí hôn nhân.',
      features: ['Biểu tượng Song Hỷ (囍) vàng', 'Họa tiết mây lành cát tường', 'Lịch trình Vu Quy & Thành Hôn', 'Hộp mừng cưới Song Hỷ'],
      demoUrl: '/invite/thang-lan?demo=true&template=songhy-red',
      isAvailable: true
    },
    {
      id: 'photo-moment',
      name: 'Khoảnh Khắc - Tạp Chí',
      tag: 'Editorial Vogue',
      category: 'wedding',
      badge: 'Hiện đại',
      colorScheme: 'Đen sang & Vàng ánh kim',
      colorHex: '#18181b',
      previewImage: 'https://images.unsplash.com/photo-1545232979-fbf6c63b2f8a?auto=format&fit=crop&w=800&q=85',
      description: 'Ảnh cưới kích thước lớn tràn màn hình như bìa tạp chí thời trang, kết hợp typography phóng khoáng và đếm ngược tối giản.',
      features: ['Bìa tạp chí tràn viền', 'Typography Vogue hiện đại', 'Bộ đếm ngược ngày cưới nổi', 'Album ảnh so le Mosaic'],
      demoUrl: '/invite/thang-lan?demo=true&template=photo-moment',
      isAvailable: true
    },
    {
      id: 'wedding-floral-blush',
      name: 'Hoa Màu Nước - Hồng',
      tag: 'Màu Nước Botanical',
      category: 'wedding',
      badge: 'Lãng mạn',
      colorScheme: 'Hồng phấn & Xanh lá mạ',
      colorHex: '#e11d48',
      previewImage: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=85',
      description: 'Họa tiết hoa mẫu đơn màu nước bồng bềnh nữ tính, tone hồng pastel dịu dàng, tạo cảm xúc bay bổng như truyện cổ tích.',
      features: ['Hoa mẫu đơn màu nước', 'Tone màu hồng pastel mơ mộng', 'Font chữ Dancing uốn lượn', 'Sổ lưu bút chúc phúc'],
      demoUrl: '/invite/thang-lan?demo=true&template=wedding-floral-blush',
      isAvailable: true
    },
    {
      id: 'dragon-red',
      name: 'Long Phụng - Đỏ',
      tag: 'Cung Đình Đại Lễ',
      category: 'wedding',
      badge: 'Hoàng triều',
      colorScheme: 'Đỏ ruby & Vàng ròng',
      colorHex: '#851a22',
      previewImage: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=85',
      description: 'Cặp Long Phụng sum vầy dát vàng kim sa uy nghi, thể hiện sự vương giả, bền vững trọn đời của hai dòng họ danh giá.',
      features: ['Cặp Long Phụng dát vàng', 'Khung viền triện cung đình', 'Nhạc lễ cưới cổ truyền', 'Mừng cưới tài lộc VietQR'],
      demoUrl: '/invite/thang-lan?demo=true&template=dragon-red',
      isAvailable: true
    },
    {
      id: 'royal-darkred',
      name: 'Cung Đình - Đỏ Đô',
      tag: 'Quý Phái Châu Âu',
      category: 'wedding',
      badge: 'VIP',
      colorScheme: 'Đỏ mận & Viền hoa văn vàng',
      colorHex: '#6b1118',
      previewImage: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=85',
      description: 'Dành riêng cho các buổi dạ tiệc cưới xa hoa tại trung tâm hội nghị khách sạn 5 sao, viền vàng dập nổi và hoa văn baroque hoàng gia.',
      features: ['Hoa văn Baroque mạ vàng', 'Đèn chùm dạ tiệc lung linh', 'Dress Code sang trọng', 'Hiệu ứng mở rèm nhung'],
      demoUrl: '/invite/thang-lan?demo=true&template=royal-darkred',
      isAvailable: true
    },
    {
      id: 'polaroid-beige',
      name: 'Polaroid - Be',
      tag: 'Retro Kỷ Niệm',
      category: 'wedding',
      badge: 'Vintage',
      colorScheme: 'Be cát & Nâu gỗ mộc',
      colorHex: '#78350f',
      previewImage: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=85',
      description: 'Gợi nhớ cảm giác hoài niệm với các khung ảnh cưới Polaroid đặt so le, kèm ghim kẹp gỗ và lời nhắn nhủ viết tay dễ thương.',
      features: ['Khung ảnh Polaroid nghiêng', 'Băng dính Washi & ghim kẹp', 'Tone nâu ấm áp Retro', 'Dòng thời gian tình yêu'],
      demoUrl: '/invite/thang-lan?demo=true&template=polaroid-beige',
      isAvailable: true
    },
    {
      id: 'arch-pink',
      name: 'Cổng Hoa - Hồng',
      tag: 'Kiến Trúc Vòm Pháp',
      category: 'wedding',
      badge: 'Thơ mộng',
      colorScheme: 'Hồng pastel & Trắng ngọc trai',
      colorHex: '#be185d',
      previewImage: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=85',
      description: 'Khung vòm tân cổ điển kiểu Pháp ôm trọn các thông tin ngày lành, điểm xuyết hoa hồng leo nở rộ cho hôn lễ ngọt ngào.',
      features: ['Khung vòm Neoclassical', 'Dây hoa hồng leo mềm mại', 'Thiệp mời định dạng vòm', 'Đếm ngược hoa hồng'],
      demoUrl: '/invite/thang-lan?demo=true&template=arch-pink',
      isAvailable: true
    }
  ];

  filteredTemplates: TemplateItem[] = [];

  // Modal create template interest
  showModal: boolean = false;
  selectedTemplateForUse: TemplateItem | null = null;
  registerForm = {
    fullName: '',
    phone: '',
    weddingDate: '',
    package: 'Standard'
  };
  registerSuccess: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.applyFilter();
  }

  setCategory(catId: string): void {
    this.activeCategory = catId;
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.activeCategory !== 'wedding') {
      this.filteredTemplates = [];
      return;
    }

    let list = this.templates.filter(t => t.category === this.activeCategory);

    if (this.searchKeyword.trim()) {
      const q = this.searchKeyword.toLowerCase().trim();
      list = list.filter(t => 
        t.name.toLowerCase().includes(q) || 
        t.tag.toLowerCase().includes(q) || 
        t.description.toLowerCase().includes(q)
      );
    }

    this.filteredTemplates = list;
  }

  viewDemo(template: TemplateItem): void {
    this.router.navigateByUrl(template.demoUrl);
  }

  openCreateModal(template: TemplateItem): void {
    this.selectedTemplateForUse = template;
    this.showModal = true;
    this.registerSuccess = false;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedTemplateForUse = null;
  }

  submitRegister(): void {
    if (!this.registerForm.fullName || !this.registerForm.phone) {
      alert('Vui lòng nhập họ tên và số điện thoại liên hệ!');
      return;
    }
    this.registerSuccess = true;
    setTimeout(() => {
      this.closeModal();
      this.registerForm = { fullName: '', phone: '', weddingDate: '', package: 'Standard' };
      alert('Đăng ký nhận tư vấn tạo thiệp thành công! Chuyên viên M-Invite sẽ liên hệ hỗ trợ bạn ngay.');
    }, 1200);
  }

  scrollToSection(id: string): void {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
