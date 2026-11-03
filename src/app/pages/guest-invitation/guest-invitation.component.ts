import { Component, OnInit, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WeddingService, WeddingData, GuestWish, GiftRegistry } from '../../services/wedding.service';

@Component({
  selector: 'app-guest-invitation',
  templateUrl: './guest-invitation.component.html',
  styleUrls: ['./guest-invitation.component.css']
})
export class GuestInvitationComponent implements OnInit, AfterViewInit, OnDestroy {
  slug: string = 'thang-lan';
  invitationCode: string = '';
  invitationData: any = null;
  wedding: WeddingData | null = null;
  loading: boolean = true;
  isPlayingMusic: boolean = false;
  audioPlayer: HTMLAudioElement | null = null;
  private scrollObserver: IntersectionObserver | null = null;
  // M-Invite Luxury Envelope Opening Curtain
  isEnvelopeOpened: boolean = false;
  // Demo Mode & Template Theme
  isDemoMode: boolean = false;
  selectedTemplate: string = 'lotus-red';
  availableTemplates = [
    { id: 'lotus-red', name: 'Liên Hạc (Đỏ)', color: '#a3252e' },
    { id: 'wedding-minimal-darkred', name: 'Tối Giản (Đỏ Đô)', color: '#7a1f2b' },
    { id: 'envelope-red', name: 'Phong Thư (Đỏ)', color: '#8e1b2c' },
    { id: 'songhy-red', name: 'Song Hỷ (Đỏ)', color: '#b91c1c' },
    { id: 'photo-moment', name: 'Khoảnh Khắc (Tạp Chí)', color: '#18181b' },
    { id: 'wedding-floral-blush', name: 'Hoa Màu Nước (Hồng)', color: '#e11d48' },
    { id: 'dragon-red', name: 'Long Phụng (Đỏ)', color: '#851a22' },
    { id: 'royal-darkred', name: 'Cung Đình (Đỏ Đô)', color: '#6b1118' },
    { id: 'polaroid-beige', name: 'Polaroid (Be)', color: '#78350f' },
    { id: 'arch-pink', name: 'Cổng Hoa (Hồng)', color: '#be185d' }
  ];

  switchTemplate(tplId: string): void {
    this.selectedTemplate = tplId;
  }

  // Hero Slider
  currentHeroSlide: number = 0;
  heroSlides: string[] = [
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1600&q=85',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=85',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1600&q=85',
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85',
    'https://images.unsplash.com/photo-1545232979-fbf6c63b2f8a?auto=format&fit=crop&w=1600&q=85'
  ];
  private heroSlideTimer: any;

  // Scroll to top
  showScrollTop: boolean = false;

  // Quick Nav Menu Sheet
  isQuickMenuOpen: boolean = false;
  countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  private countdownInterval: any;

  // RSVP Form
  rsvpModel = {
    isAttending: true,
    guestCount: 1,
    dietaryNotes: '',
    specialRequests: ''
  };
  rsvpSubmitted: boolean = false;
  rsvpSubmitting: boolean = false;
  rsvpMessage: string = '';

  // Wishes
  wishes: GuestWish[] = [];
  wishModel = {
    senderName: '',
    message: ''
  };
  wishSubmitting: boolean = false;
  wishSuccessMessage: string = '';

  // Copied bank alert
  copiedText: string = '';

  // ==========================================
  // HỘP QUÀ YÊU THƯƠNG (3D GIFT BOX & MODAL)
  // ==========================================
  isGiftModalOpen: boolean = false;
  activeGiftTab: 'bride' | 'groom' = 'bride';

  // ==========================================
  // ALBUM ẢNH CƯỚI & PRO LIGHTBOX
  // ==========================================
  isAlbumExpanded: boolean = false;
  isLightboxOpen: boolean = false;
  currentLbIndex: number = 0;
  lbZoomLevel: number = 1;
  isLbPlaying: boolean = false;
  isLbFullscreen: boolean = false;
  private lbSlideshowTimer: any = null;

  // 16 ảnh chất lượng cao chuẩn mẫu M-Invite (bố cục theo đúng ảnh tham khảo của người dùng)
  defaultPhotos: string[] = [
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=85', // 1. Nhẫn cưới trên lụa trắng
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=85',  // 2. Hoa cưới cầm tay rực rỡ
    'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=85',  // 3. Đôi bàn tay đeo nhẫn cưới
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=85',  // 4. Cô dâu chú rể mỉm cười hạnh phúc
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=85',  // 5. Nắm tay nhau cùng váy cưới ren
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85', // 6. Bàn tiệc cưới ấm cúng lung linh
    'https://images.unsplash.com/photo-1545232979-fbf6c63b2f8a?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1509924603848-aca5e2f77337?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1200&q=85'
  ];

  constructor(
    private route: ActivatedRoute,
    private weddingService: WeddingService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['slug']) this.slug = params['slug'];
    });

    this.route.queryParams.subscribe(params => {
      if (params['demo'] === 'true') {
        this.isDemoMode = true;
      }
      if (params['template']) {
        this.selectedTemplate = params['template'];
      }
      if (params['code']) {
        this.invitationCode = params['code'];
        this.loadInvitation(this.invitationCode);
      }
      if (params['guest']) {
        const guestName = decodeURIComponent(params['guest']);
        if (!this.invitationData) {
          this.invitationData = { guest: { fullName: guestName } };
        } else if (!this.invitationData.guest) {
          this.invitationData.guest = { fullName: guestName };
        } else {
          this.invitationData.guest.fullName = guestName;
        }
        if (!this.wishModel.senderName) {
          this.wishModel.senderName = guestName;
        }
      }
    });

    this.loadWedding();
    this.loadWishes();

    // Start auto slide
    this.heroSlideTimer = setInterval(() => {
      this.nextHeroSlide();
    }, 4500);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initScrollReveal();
    }, 300);
  }

  ngOnDestroy(): void {
    if (this.scrollObserver) {
      this.scrollObserver.disconnect();
    }
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    if (this.audioPlayer) {
      this.audioPlayer.pause();
    }
    if (this.lbSlideshowTimer) {
      clearInterval(this.lbSlideshowTimer);
    }
    if (this.heroSlideTimer) {
      clearInterval(this.heroSlideTimer);
    }
  }

  openInvitation(): void {
    this.isEnvelopeOpened = true;
    if (!this.isPlayingMusic) {
      this.toggleMusic();
    }
  }

  nextHeroSlide(e?: Event): void {
    if (e) e.stopPropagation();
    this.currentHeroSlide = (this.currentHeroSlide + 1) % this.heroSlides.length;
  }

  prevHeroSlide(e?: Event): void {
    if (e) e.stopPropagation();
    this.currentHeroSlide = (this.currentHeroSlide - 1 + this.heroSlides.length) % this.heroSlides.length;
  }

  goToHeroSlide(index: number): void {
    this.currentHeroSlide = index;
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.showScrollTop = window.scrollY > 400;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleQuickMenu(): void {
    this.isQuickMenuOpen = !this.isQuickMenuOpen;
  }

  closeQuickMenu(): void {
    this.isQuickMenuOpen = false;
  }

  addToCalendar(title: string, startTime: string, location: string): void {
    const start = new Date(startTime).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${start}&location=${encodeURIComponent(location)}`;
    window.open(url, '_blank');
  }

  // Keyboard navigation for Lightbox
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (!this.isLightboxOpen) return;
    if (event.key === 'ArrowRight') {
      this.nextLightboxPhoto();
    } else if (event.key === 'ArrowLeft') {
      this.prevLightboxPhoto();
    } else if (event.key === 'Escape') {
      this.closePhotoModal();
    }
  }

  loadWedding(): void {
    this.weddingService.getWedding(this.slug).subscribe({
      next: (data) => {
        this.wedding = data;
        this.loading = false;
        this.startCountdown(new Date(data.weddingDate));
        setTimeout(() => this.initScrollReveal(), 300);
      },
      error: () => {
        this.loading = false;
        this.setDefaultSampleData();
        setTimeout(() => this.initScrollReveal(), 300);
      }
    });
  }

  loadInvitation(code: string): void {
    this.weddingService.getInvitation(code).subscribe({
      next: (inv) => {
        this.invitationData = inv;
        if (inv.guest?.fullName) {
          this.wishModel.senderName = inv.guest.fullName;
        }
        if (inv.rsvp) {
          this.rsvpSubmitted = true;
          this.rsvpModel.isAttending = inv.rsvp.isAttending;
          this.rsvpModel.guestCount = inv.rsvp.guestCount;
        }
      },
      error: () => {}
    });
  }

  loadWishes(): void {
    this.weddingService.getWishes().subscribe({
      next: (list) => {
        this.wishes = list;
      },
      error: () => {
        this.wishes = [
          { senderName: 'Nguyễn Văn Nam', message: 'Chúc hai bạn trăm năm hạnh phúc, đầu bạc răng long nhé!' },
          { senderName: 'Trần Minh Tuấn', message: 'Mừng ngày vui của Thắng & Lan! Chúc tổ ấm luôn ngập tràn tiếng cười!' },
          { senderName: 'Lê Thu Trang', message: 'Cô dâu chú rể đẹp đôi nhất năm! Chúc tình yêu luôn ngọt ngào như ngày đầu!' }
        ];
      }
    });
  }

  startCountdown(targetDate: Date): void {
    const update = () => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference > 0) {
        this.countdown.days = Math.floor(difference / (1000 * 60 * 60 * 24));
        this.countdown.hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        this.countdown.minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        this.countdown.seconds = Math.floor((difference % (1000 * 60)) / 1000);
      } else {
        this.countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
    };
    update();
    this.countdownInterval = setInterval(update, 1000);
  }

  // ==========================================
  // HỘP QUÀ YÊU THƯƠNG ACTIONS
  // ==========================================
  openGiftModal(tab: 'bride' | 'groom' = 'bride'): void {
    this.activeGiftTab = tab;
    this.isGiftModalOpen = true;
  }

  closeGiftModal(): void {
    this.isGiftModalOpen = false;
  }

  switchGiftTab(tab: 'bride' | 'groom'): void {
    this.activeGiftTab = tab;
  }

  copyGiftStk(stk: string, label: string): void {
    navigator.clipboard.writeText(stk).then(() => {
      this.copiedText = `Đã sao chép số tài khoản: ${stk}`;
      setTimeout(() => this.copiedText = '', 3000);
    }).catch(() => {
      this.copiedText = `Đã sao chép STK: ${stk}`;
      setTimeout(() => this.copiedText = '', 3000);
    });
  }

  get groomGift(): GiftRegistry | undefined {
    return this.wedding?.gifts?.find(g => 
      g.giftName.toLowerCase().includes('chú rể') || 
      g.giftName.toLowerCase().includes('groom') ||
      g.accountHolder?.toLowerCase().includes('thắng')
    ) || this.wedding?.gifts?.[0];
  }

  get brideGift(): GiftRegistry | undefined {
    return this.wedding?.gifts?.find(g => 
      g.giftName.toLowerCase().includes('cô dâu') || 
      g.giftName.toLowerCase().includes('bride') ||
      g.accountHolder?.toLowerCase().includes('lan')
    ) || this.wedding?.gifts?.[1] || this.wedding?.gifts?.[0];
  }

  // ==========================================
  // ALBUM & LIGHTBOX ACTIONS
  // ==========================================
  get photoList(): string[] {
    if (this.wedding?.photos && this.wedding.photos.length > 0) {
      const apiUrls = this.wedding.photos.map(p => p.photoUrl);
      const combined = [
        ...this.defaultPhotos.slice(0, 6),
        ...apiUrls.filter(u => !this.defaultPhotos.includes(u)),
        ...this.defaultPhotos.slice(6)
      ];
      return Array.from(new Set(combined));
    }
    return this.defaultPhotos;
  }

  toggleMorePhotos(): void {
    this.isAlbumExpanded = !this.isAlbumExpanded;
  }

  openPhotoModalByIndex(index: number): void {
    this.currentLbIndex = index;
    this.lbZoomLevel = 1;
    this.isLightboxOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closePhotoModal(): void {
    this.isLightboxOpen = false;
    this.lbZoomLevel = 1;
    if (this.lbSlideshowTimer) {
      clearInterval(this.lbSlideshowTimer);
      this.isLbPlaying = false;
    }
    document.body.style.overflow = '';
  }

  prevLightboxPhoto(e?: Event): void {
    if (e) e.stopPropagation();
    const total = this.photoList.length;
    this.currentLbIndex = (this.currentLbIndex - 1 + total) % total;
    this.lbZoomLevel = 1;
  }

  nextLightboxPhoto(e?: Event): void {
    if (e) e.stopPropagation();
    const total = this.photoList.length;
    this.currentLbIndex = (this.currentLbIndex + 1) % total;
    this.lbZoomLevel = 1;
  }

  zoomLightbox(factor: number): void {
    this.lbZoomLevel = Math.max(0.6, Math.min(3.0, this.lbZoomLevel * factor));
  }

  toggleLbSlideshow(): void {
    if (this.isLbPlaying) {
      clearInterval(this.lbSlideshowTimer);
      this.isLbPlaying = false;
    } else {
      this.isLbPlaying = true;
      this.lbSlideshowTimer = setInterval(() => {
        this.nextLightboxPhoto();
      }, 2800);
    }
  }

  toggleLbFullscreen(): void {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      this.isLbFullscreen = true;
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      this.isLbFullscreen = false;
    }
  }

  // ==========================================
  // HIỆU ỨNG TRƯỢT MƯỢT XUỐNG RSVP
  // ==========================================
  smoothSlideToRsvp(e?: Event): void {
    if (e) e.preventDefault();
    const target = document.getElementById('rsvp');
    if (!target) return;

    const targetRect = target.getBoundingClientRect();
    const startY = window.pageYOffset || document.documentElement.scrollTop;
    const targetY = targetRect.top + startY - 20;
    const distance = targetY - startY;
    const duration = 1150; // 1.15s cinematic ease
    let startTime: number | null = null;

    const step = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, startY + (distance * ease));

      if (timeElapsed < duration) {
        window.requestAnimationFrame(step);
      } else {
        const cardBox = target.querySelector('.rsvp-card-wrapper') || target;
        cardBox.classList.add('rsvp-arrival-highlight');
        setTimeout(() => cardBox.classList.remove('rsvp-arrival-highlight'), 1800);
      }
    };

    window.requestAnimationFrame(step);
  }

  submitRsvp(): void {
    if (this.isDemoMode) {
      this.rsvpSubmitted = true;
      this.rsvpMessage = 'Chế độ xem Demo: Phản hồi tham dự đã được mô phỏng thành công! (Chế độ xem thử, không chỉnh sửa cơ sở dữ liệu)';
      return;
    }

    const code = this.invitationCode || 'GUEST-DEFAULT';
    this.rsvpSubmitting = true;

    this.weddingService.submitRsvp({
      invitationCode: code,
      isAttending: this.rsvpModel.isAttending,
      guestCount: this.rsvpModel.guestCount,
      dietaryNotes: this.rsvpModel.dietaryNotes,
      specialRequests: this.rsvpModel.specialRequests
    }).subscribe({
      next: () => {
        this.rsvpSubmitting = false;
        this.rsvpSubmitted = true;
        this.rsvpMessage = this.rsvpModel.isAttending 
          ? 'Cảm ơn bạn đã xác nhận tham dự! Chúng tôi rất mong được đón tiếp bạn.' 
          : 'Cảm ơn bạn đã phản hồi. Thật tiếc khi bạn không thể tham gia, hẹn bạn dịp khác nhé!';
      },
      error: () => {
        this.rsvpSubmitting = false;
        this.rsvpSubmitted = true;
        this.rsvpMessage = 'Cảm ơn bạn đã xác nhận phản hồi tham dự!';
      }
    });
  }

  submitWish(): void {
    if (!this.wishModel.senderName.trim() || !this.wishModel.message.trim()) return;

    if (this.isDemoMode) {
      this.wishes.unshift({
        senderName: this.wishModel.senderName,
        message: this.wishModel.message,
        createdAt: new Date().toISOString()
      });
      this.wishModel.message = '';
      this.wishSuccessMessage = 'Chế độ xem Demo: Lời chúc đã hiển thị mô phỏng thành công!';
      setTimeout(() => this.wishSuccessMessage = '', 4000);
      return;
    }

    this.wishSubmitting = true;
    this.weddingService.postWish({
      invitationCode: this.invitationCode,
      senderName: this.wishModel.senderName,
      message: this.wishModel.message
    }).subscribe({
      next: (newWish) => {
        this.wishSubmitting = false;
        this.wishes.unshift(newWish);
        this.wishModel.message = '';
        this.wishSuccessMessage = 'Lời chúc của bạn đã được gửi thành công! 💕';
        setTimeout(() => this.wishSuccessMessage = '', 4000);
      },
      error: () => {
        this.wishSubmitting = false;
        this.wishes.unshift({
          senderName: this.wishModel.senderName,
          message: this.wishModel.message,
          createdAt: new Date().toISOString()
        });
        this.wishModel.message = '';
        this.wishSuccessMessage = 'Cảm ơn lời chúc tốt đẹp của bạn! 💕';
        setTimeout(() => this.wishSuccessMessage = '', 4000);
      }
    });
  }

  toggleMusic(): void {
    if (!this.audioPlayer) {
      this.audioPlayer = new Audio('https://cdn.pixabay.com/download/audio/2022/05/16/audio_c97a48d886.mp3?filename=romantic-wedding-112191.mp3');
      this.audioPlayer.loop = true;
    }

    if (this.isPlayingMusic) {
      this.audioPlayer.pause();
      this.isPlayingMusic = false;
    } else {
      this.audioPlayer.play().then(() => {
        this.isPlayingMusic = true;
      }).catch(() => {
        this.isPlayingMusic = false;
      });
    }
  }

  copyToClipboard(text: string, label: string): void {
    navigator.clipboard.writeText(text);
    this.copiedText = `Đã sao chép STK ${label}: ${text}`;
    setTimeout(() => this.copiedText = '', 3000);
  }

  public initScrollReveal(): void {
    if (typeof window === 'undefined') return;

    if (this.scrollObserver) {
      this.scrollObserver.disconnect();
    }

    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal-on-scroll, .reveal-fade-up, .reveal-zoom, .reveal-slide-left, .reveal-slide-right, .reveal-stagger').forEach(el => {
        el.classList.add('is-revealed');
      });
      return;
    }

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.08
    };

    this.scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          this.scrollObserver?.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll(
      '.reveal-on-scroll, .reveal-fade-up, .reveal-zoom, .reveal-slide-left, .reveal-slide-right, .reveal-stagger'
    );
    revealElements.forEach(el => this.scrollObserver?.observe(el));
  }

  private setDefaultSampleData(): void {
    this.wedding = {
      id: 1,
      brideName: 'Nguyễn Ngọc Lan',
      groomName: 'Trần Quang Thắng',
      weddingDate: '2026-11-20T17:30:00',
      venue: 'Trung Tâm Tiệc Cưới White Palace',
      venueAddress: '194 Hoàng Văn Thụ, Phường 9, Quận Phú Nhuận, TP. Hồ Chí Minh',
      venueMapUrl: 'https://maps.google.com/?q=White+Palace+Hoang+Van+Thu',
      brideAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
      groomAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      coverImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80',
      themeColor: '#c59b27',
      customSlug: 'thang-lan',
      events: [
        {
          id: 1,
          eventName: 'Lễ Vu Quy (Nhà Gái)',
          eventType: 'Ceremony',
          startTime: '2026-11-20T08:00:00',
          location: 'Tư Gia Nhà Gái - Quận 7, TP. HCM',
          description: 'Nghi lễ gia tiên truyền thống tại gia đình nhà gái',
          sortOrder: 1,
          sessions: []
        },
        {
          id: 2,
          eventName: 'Lễ Thành Hôn & Tiệc Cưới',
          eventType: 'Reception',
          startTime: '2026-11-20T17:30:00',
          location: 'White Palace - Sảnh Grand Ballroom',
          description: 'Đón khách lúc 17:30 • Khai tiệc mừng lúc 18:30',
          sortOrder: 2,
          sessions: []
        }
      ],
      photos: this.defaultPhotos.map((url, i) => ({
        id: i + 1,
        photoUrl: url,
        caption: `Kỷ niệm tình yêu ${i + 1}`
      })),
      stories: [
        { id: 1, title: 'Lần Đầu Gặp Gỡ', eventDate: '2021-04-15', content: 'Một buổi chiều mưa bất chợt tại quán cafe quen thuộc, chúng mình đã vô tình chạm ánh mắt nhau và bắt đầu câu chuyện tình yêu đẹp.', imageUrl: '' },
        { id: 2, title: 'Lời Cầu Hôn Dưới Ánh Hoàng Hôn', eventDate: '2025-10-10', content: 'Chuyến du lịch Đà Lạt mộng mơ, anh đã quỳ gối trao chiếc nhẫn ước hẹn và nhận được cái gật đầu hạnh phúc từ em.', imageUrl: '' },
        { id: 3, title: 'Về Chung Một Nhà', eventDate: '2026-11-20', content: 'Ngày hạnh phúc nhất đời khi chúng mình chính thức nắm tay nhau bước vào lễ đường dưới sự chứng kiến của gia đình và bạn bè.', imageUrl: '' }
      ],
      gifts: [
        { id: 1, giftName: 'Mừng cưới Chú Rể (Thắng)', bankName: 'Vietcombank', accountNumber: '0071000123456', accountHolder: 'Trần Quang Thắng' },
        { id: 2, giftName: 'Mừng cưới Cô Dâu (Lan)', bankName: 'Techcombank', accountNumber: '19036789012345', accountHolder: 'Nguyễn Ngọc Lan' }
      ]
    };
    this.startCountdown(new Date('2026-11-20T17:30:00'));
  }
}
