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

  greeting: {
    lines: [
      "서로가 마주 보며 다져온 사랑을",
      "이제 함께 한 곳을 향해 걸어가려 합니다.",
      "저희 두 사람이 사랑의 이름으로 지켜나갈 수 있게",
      "앞날을 축복해 주시면 감사하겠습니다.",
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
        { name: "길동균", role: "신랑 아버지", phone: "010-0000-0001" },
        { name: "마치다 치에꼬", role: "신랑 어머니", phone: "010-0000-0002" },
        { name: "길필선", role: "신랑", phone: "010-0000-0003" },
      ],
    },
    brideSide: {
      label: "신부측",
      people: [
        { name: "김홍득", role: "신부 아버지", phone: "010-0000-0011" },
        { name: "구보 나미에", role: "신부 어머니", phone: "010-0000-0012" },
        { name: "김소미", role: "신부", phone: "010-0000-0013" },
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
      "https://maps.google.com/maps?q=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C+%EA%B4%91%EC%A7%84%EA%B5%AC+%EB%8A%A5%EB%8F%99%EB%A1%9C+110+%EC%8A%A4%ED%83%80%EC%8B%9C%ED%8B%B0%EC%98%81%EC%A1%B4&z=17&output=embed",
    lat: 37.5576,
    lng: 127.0795,
    directions: {
      subway: "2·7호선 건대입구역 도보 이용 (역에서 도보 약 5~10분, 출구 안내에 따라 이동)",
      bus: "건대입구역·스타시티 인근 정류장 하차",
      parking: "스타시티 지하 주차장 이용 (예식장 안내 참고)",
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

  meal: {
    title: "식사 안내",
    image: "images/meal.jpg",
    text: "뷔페 식사는 예식 종료 후 로비에서 안내에 따라 이동해 주세요. 알레르기가 있으시면 사전에 말씀 부탁드립니다.",
  },

  accounts: {
    title: "마음 전하실 곳",
    groomSide: {
      label: "신랑측",
      banks: [
        { bank: "국민은행", number: "123456-78-901234", holder: "길필선" },
        { bank: "신한은행", number: "110-123-456789", holder: "길○○" },
      ],
    },
    brideSide: {
      label: "신부측",
      banks: [{ bank: "우리은행", number: "1002-123-456789", holder: "김소미" }],
    },
  },

  footer: {
    message: "찾아주셔서 진심으로 감사드립니다.",
    groomPhone: "010-1234-5678",
    bridePhone: "010-8765-4321",
  },

  useDemoPlaceholders: false,
  demoPlaceholder: (seed) => `https://picsum.photos/seed/${seed}/800/1200`,
};

