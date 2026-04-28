/**
 * 모바일 청첩장 설정 — 사진·문구·계좌·장소·연락처만 여기서 수정하세요.
 */
window.INVITATION_CONFIG = {
  /** 봉투 왁스 실에 새길 이니셜 (한 글자) */
  landingWaxLetter: "G",

  hero: {
    image: "images/hero.jpg",
    title: "저희 결혼합니다",
    subtitle: "2026. 7. 11. 토요일 오후 5:40",
    venueLine: "스타시티 아트홀",
  },

  fonts: {
    sans: '"Noto Sans KR", system-ui, sans-serif',
    serif: '"Nanum Myeongjo", serif',
    hero: '"Orbit", "Nanum Myeongjo", serif',
  },

  heroEffects: {
    enabled: true,
    petalCount: 6,
  },

  surprisePhotos: {
    enabled: true,
    hotspots: [
      { section: "greeting", x: 3, y: 26, size: 18, label: "숨은 사진 1", icon: "images/hidden-1.png" },
      { section: "wedding-day", x: 3, y: 50, size: 22, label: "숨은 사진 2", icon: "images/hidden-2.png" },
      { section: "", x: 3, y: 78, size: 18, label: "숨은 사진 3", icon: "images/hidden-3.png" },
      { section: "wedding-day", x: 85, y: 0, width: 50, height: 30, label: "숨은 사진 4", icon: "images/hidden-4.png" },
      { section: "gallery", x: 3, y: 64, size: 25, label: "숨은 사진 5", icon: "images/hidden-5.png" },
      { section: "location", x: 97, y: 70, size: 18, label: "숨은 사진 6", icon: "images/hidden-6.png" },
      { section: "gift", x: 3, y: 0, size: 18, label: "숨은 사진 7", icon: "images/hidden-7.png" },
      { section: "final-note", x: 97, y: 58, size: 18, label: "숨은 사진 8", icon: "images/hidden-8.png" },
    ],
    popupImages: [
      "images/surprise-01.jpg",
      "images/surprise-02.jpg",
"images/surprise-03.jpg",  
      "images/surprise-04.jpg",
    ],
    sounds: ["audio/dingdong.mp3", "audio/laugh.mp3"],
  },

  greeting: {
    lines: [
      "필연처럼 만난 저희가 여섯 번의 여름을 지나",
      "선물 같은 결실을 맺으려 합니다.",
      "소중한 분들의 따뜻한 마음을 평생 간직하며",
      "미래를 향한 첫 발걸음을 내딛겠습니다.",
    ],
    /** 부모님 이름 두 분 — 사이에 * 로 표시됩니다 */
    groomParents: ["길동균", "마치다 치에꼬"],
    brideParents: ["김홍득", "구보 나미에"],
    groomName: "길필선",
    brideName: "김소미",
  },

  /** 인사 아래 「연락하기」에 표시 — 번호는 필요에 맞게 수정하세요. */
  familyContacts: {
    groomSide: {
      label: "신랑측",
      people: [
        { name: "길동균", role: "신랑 아버지", phone: "010-3751-7628" },
        { name: "마치다 치에꼬", role: "신랑 어머니", phone: "010-8200-7628" },
        { name: "길필선", role: "신랑", phone: "010-8751-7628" },
      ],
    },
    brideSide: {
      label: "신부측",
      people: [
        { name: "김홍득", role: "신부 아버지", phone: "010-7572-1583" },
        { name: "구보 나미에", role: "신부 어머니", phone: "010-9415-1583" },
        { name: "김소미", role: "신부", phone: "010-4244-1583" },
      ],
    },
  },

  profiles: {
    groom: {
      image: "images/profile-groom.jpg",
      name: "길필선",
      message:
        "늘 밝은 에너지로 함께해 주세요.\n앞으로도 서로를 믿고 존중하며 살겠습니다.",
    },
    bride: {
      image: "images/profile-bride.jpg",
      name: "김소미",
      message:
        "소중한 날 찾아주시면 큰 기쁨이 됩니다.\n따뜻한 마음으로 맞이하겠습니다.",
    },
  },

  weddingDay: {
    title: "Wedding Day",
    monthLabel: "7월",
    /** 카운트다운·캘린더·캘린더 링크에 사용 (한국 시간) */
    dateTimeISO: "2026-07-11T17:40:00+09:00",
    year: 2026,
    month: 7,
    day: 11,
    weekdayLabel: "토요일 오후 5시 40분",
    venueName: "스타시티 아트홀",
    address: "서울특별시 광진구 능동로 110 스타시티영존 5층",
  },

  gallery: [
    "images/gallery-01.jpg",
    "images/gallery-02.jpg",
    "images/gallery-03.jpg",
    "images/gallery-04.jpg",
    "images/gallery-05.jpg",
    "images/gallery-06.jpg",
    "images/gallery-07.jpg",
    "images/gallery-08.jpg",
    "images/gallery-09.jpg",
    "images/gallery-10.jpg",
    "images/gallery-11.jpg",
    "images/gallery-12.jpg",
  ],

  location: {
    titleKo: "오시는 길",
    venueName: "스타시티 아트홀",
    address: "서울특별시 광진구 능동로 110 스타시티영존 5층",
    mapEmbedUrl:
      "https://www.google.com/maps?q=스타시티아트홀&output=embed",
    lat: 37.5576,
    lng: 127.0795,
    directions: {
      subway: "2호선 건대입구역 2번 출구 도보 3분\n 7호선 건대입구역 3번 출구 도보 1분 \n 7호선 건대입구역 건물과 연결",
      bus: "간선 : 240번, 721번, N61번, N62번\n지선 : 2016번, 2222번, 3217번, 3220번, 4212번\n직행 : 102번, 3500번\n공항 : 6013번",
      parking: "스타시티 지하 주차장 이용 / 건대병원 주차장 이용 (지하주차장 만차시)",
    },
  },

  /**
   * 갤러리 라이트박스 하단 인스타그램 스타일 UI (페이지 본문에는 표시 안 함)
   */
  gallerySocial: {
    username: "our_wedding_day",
    avatar: "images/insta-avatar.jpg",
    caption: "2026. 7. 11. 스타시티 아트홀 💍 #웨딩 #청첩장",
    likedBy: "좋아요 128개",
  },

  /** 배경음 — 빈 문자열이면 음악·스피커 버튼 비활성. mp3 파일을 audio 폴더에 두고 경로 지정 */
  music: {
    src: "",
  },

  guide: {
    title: "안내",
    tabs: [
      {
        key: "meal",
        label: "식사",
        heading: "식사 안내",
        text: "뷔페 식사는 예식 종료 후 로비에서 안내에 따라 이동해 주세요.\n알레르기가 있으시면 사전에 말씀 부탁드립니다.",
      },
      {
        key: "parking",
        label: "주차",
        heading: "주차 안내",
        text: "스타시티 지하 주차장 이용이 가능합니다.\n혼잡 시간대에는 여유 있게 도착해 주세요.",
      },
      {
        key: "etc",
        label: "기타",
        heading: "기타 안내",
        text: "화환은 정중히 사양합니다.\n예식 관련 문의는 연락하기 버튼으로 부탁드립니다.",
      },
    ],
  },

  accounts: {
    title: "마음 전하실 곳",
    groomSide: {
      label: "신랑측",
      banks: [
        { bank: "농협", number: "203049-52-024406", holder: "길동균" },
        { bank: "우리은행", number: "1002-745-853550", holder: "마치다 치에꼬" },
        { bank: "우리은행", number: "1002-345-182228", holder: "길필선" },
      ],
    },
    brideSide: {
      label: "신부측",
      banks: [
        { bank: "우리은행", number: "1002-459-596777", holder: "김홍득" },
        { bank: "농협", number: "312-0065-1337-51", holder: "김소미" },
      ],
    },
  },

  finalNote: {
    image: "images/final-note.jpg",
    text: "소중한 걸음 해주셔서 감사합니다.\n",
  },

  footer: {
    message: "찾아주셔서 진심으로 감사드립니다.",
    groomPhone: "010-8751-7628",
    bridePhone: "010-4244-1583",
  },

  useDemoPlaceholders: false,
  demoPlaceholder: (seed) => `https://picsum.photos/seed/${seed}/800/1200`,
};

