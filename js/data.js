// Valentine Compatibility Test Data

const QUESTIONS = [
    {
        id: 1,
        text: "데이트할 때 가장 설레는 순간은?",
        options: [
            { text: "맛집에서 함께 음식을 나눠 먹을 때", type: "S" },
            { text: "소파에서 영화 보며 기대앉을 때", type: "C" },
            { text: "새로운 곳을 함께 탐험할 때", type: "A" },
            { text: "카페에서 깊은 대화를 나눌 때", type: "T" }
        ]
    },
    {
        id: 2,
        text: "연인에게 가장 끌리는 매력은?",
        options: [
            { text: "웃음을 주는 유머 감각", type: "A" },
            { text: "흔들리지 않는 신뢰감", type: "C" },
            { text: "따뜻한 배려와 다정함", type: "S" },
            { text: "함께 성장하는 열정", type: "T" }
        ]
    },
    {
        id: 3,
        text: "사랑을 표현하는 나만의 방법은?",
        options: [
            { text: "꼭 안아주기, 손 잡기 💕", type: "S" },
            { text: "칭찬과 응원의 말 전하기 💬", type: "T" },
            { text: "깜짝 선물이나 이벤트 🎁", type: "A" },
            { text: "함께 시간 보내기 ⏰", type: "C" }
        ]
    },
    {
        id: 4,
        text: "둘 사이에 갈등이 생기면?",
        options: [
            { text: "바로 솔직하게 대화한다", type: "T" },
            { text: "시간을 두고 생각을 정리한다", type: "C" },
            { text: "편지나 메시지로 마음을 전한다", type: "S" },
            { text: "상대 입장에서 먼저 생각해본다", type: "A" }
        ]
    },
    {
        id: 5,
        text: "우리 커플의 이상적인 모습은?",
        options: [
            { text: "친구처럼 편안한 커플", type: "C" },
            { text: "서로 응원하는 동반자 커플", type: "T" },
            { text: "로맨틱한 영화 속 커플", type: "S" },
            { text: "각자의 세계를 존중하는 커플", type: "A" }
        ]
    }
];

// Love type definitions
const LOVE_TYPES = {
    S: { name: "스킨십형", emoji: "💕", desc: "따뜻한 체온으로 사랑을 전하는 타입" },
    C: { name: "편안함형", emoji: "🏠", desc: "안정감과 일상의 행복을 추구하는 타입" },
    A: { name: "모험형", emoji: "✨", desc: "새로운 경험과 설렘을 추구하는 타입" },
    T: { name: "소통형", emoji: "💬", desc: "마음을 나누는 대화를 중시하는 타입" }
};

// Type compatibility matrix
const TYPE_COMPAT = {
    "SS": 90, "SC": 80, "SA": 70, "ST": 75,
    "CS": 80, "CC": 85, "CA": 65, "CT": 78,
    "AS": 70, "AC": 65, "AA": 88, "AT": 72,
    "TS": 75, "TC": 78, "TA": 72, "TT": 92
};

// Zodiac compatibility (별자리)
const ZODIAC_SIGNS = [
    { name: "물병자리", range: [[1,20],[2,18]], emoji: "♒", element: "air" },
    { name: "물고기자리", range: [[2,19],[3,20]], emoji: "♓", element: "water" },
    { name: "양자리", range: [[3,21],[4,19]], emoji: "♈", element: "fire" },
    { name: "황소자리", range: [[4,20],[5,20]], emoji: "♉", element: "earth" },
    { name: "쌍둥이자리", range: [[5,21],[6,21]], emoji: "♊", element: "air" },
    { name: "게자리", range: [[6,22],[7,22]], emoji: "♋", element: "water" },
    { name: "사자자리", range: [[7,23],[8,22]], emoji: "♌", element: "fire" },
    { name: "처녀자리", range: [[8,23],[9,22]], emoji: "♍", element: "earth" },
    { name: "천칭자리", range: [[9,23],[10,23]], emoji: "♎", element: "air" },
    { name: "전갈자리", range: [[10,24],[11,22]], emoji: "♏", element: "water" },
    { name: "사수자리", range: [[11,23],[12,21]], emoji: "♐", element: "fire" },
    { name: "염소자리", range: [[12,22],[1,19]], emoji: "♑", element: "earth" }
];

const ELEMENT_COMPAT = {
    "fire-fire": 85, "fire-earth": 55, "fire-air": 90, "fire-water": 50,
    "earth-fire": 55, "earth-earth": 80, "earth-air": 50, "earth-water": 88,
    "air-fire": 90, "air-earth": 50, "air-air": 82, "air-water": 55,
    "water-fire": 50, "water-earth": 88, "water-air": 55, "water-water": 85
};

// Result messages by score range
const RESULT_LEVELS = [
    {
        min: 90, max: 100,
        title: "운명적 소울메이트",
        emoji: "💫",
        color: "#ff2d55",
        desc: "전생부터 이어진 인연! 서로를 위해 태어난 것 같은 놀라운 궁합이에요. 함께 있으면 시간이 빛처럼 지나가고, 말하지 않아도 마음이 통하는 특별한 관계입니다.",
        tips: ["서로의 존재를 당연하게 여기지 말기", "작은 감사도 표현하기", "함께하는 추억을 많이 만들기"],
        loveStyle: "서로를 비추는 두 개의 별처럼, 존재만으로도 빛나는 관계"
    },
    {
        min: 80, max: 89,
        title: "찰떡궁합 커플",
        emoji: "💕",
        color: "#e91e63",
        desc: "서로를 보완하며 성장하는 환상의 궁합! 비슷한 가치관을 공유하면서도 적절한 차이가 서로에게 매력적인 자극이 됩니다.",
        tips: ["서로의 차이점을 매력으로 받아들이기", "공통 취미 만들기", "정기적으로 데이트하기"],
        loveStyle: "퍼즐 조각처럼 서로를 완성시키는 관계"
    },
    {
        min: 70, max: 79,
        title: "케미 폭발 커플",
        emoji: "🔥",
        color: "#ff6348",
        desc: "함께하면 재미있고 에너지가 넘치는 조합! 서로 다른 매력이 강한 케미를 만들어내고, 주변에서도 부러워하는 커플이에요.",
        tips: ["감정 표현을 아끼지 말기", "상대의 의견을 존중하기", "함께 새로운 도전하기"],
        loveStyle: "불꽃처럼 뜨겁고, 바람처럼 자유로운 관계"
    },
    {
        min: 60, max: 69,
        title: "성장하는 커플",
        emoji: "🌱",
        color: "#2ed573",
        desc: "함께 노력하면 더 단단해지는 관계! 서로의 차이를 이해하는 과정에서 한 단계 더 깊은 사랑을 발견하게 됩니다.",
        tips: ["서로의 언어가 다를 수 있음을 인정하기", "작은 것부터 맞춰가기", "대화 시간을 늘리기"],
        loveStyle: "씨앗에서 꽃으로, 함께 피어나는 관계"
    },
    {
        min: 45, max: 59,
        title: "매력적인 밀당 커플",
        emoji: "💝",
        color: "#ffa502",
        desc: "적절한 긴장감이 매력인 관계! 서로 다른 점이 오히려 호기심과 설렘을 유지시켜주는 흥미로운 조합입니다.",
        tips: ["상대를 변화시키려 하지 말기", "공통점을 찾는 노력하기", "서로의 세계를 탐험하기"],
        loveStyle: "당기면 밀고, 밀면 당기는 매력적인 관계"
    },
    {
        min: 0, max: 44,
        title: "반대가 끌리는 커플",
        emoji: "🧲",
        color: "#5352ed",
        desc: "정반대의 매력이 서로를 끌어당기는 관계! 차이가 크지만 그만큼 서로에게 배울 점이 많고, 함께하면 세상을 더 넓게 볼 수 있어요.",
        tips: ["차이를 단점이 아닌 강점으로 보기", "서로의 세계에 관심 갖기", "인내심을 가지고 소통하기"],
        loveStyle: "N극과 S극처럼, 반대이기에 끌리는 관계"
    }
];

// Korean consonant stroke counts for name compatibility
const CONSONANT_STROKES = {
    'ㄱ': 2, 'ㄲ': 4, 'ㄴ': 2, 'ㄷ': 3, 'ㄸ': 6,
    'ㄹ': 5, 'ㅁ': 4, 'ㅂ': 4, 'ㅃ': 8, 'ㅅ': 2,
    'ㅆ': 4, 'ㅇ': 1, 'ㅈ': 3, 'ㅉ': 6, 'ㅊ': 4,
    'ㅋ': 3, 'ㅌ': 4, 'ㅍ': 4, 'ㅎ': 3
};

const VOWEL_STROKES = {
    'ㅏ': 2, 'ㅐ': 3, 'ㅑ': 3, 'ㅒ': 4, 'ㅓ': 2,
    'ㅔ': 3, 'ㅕ': 3, 'ㅖ': 4, 'ㅗ': 2, 'ㅘ': 4,
    'ㅙ': 5, 'ㅚ': 3, 'ㅛ': 3, 'ㅜ': 2, 'ㅝ': 4,
    'ㅞ': 5, 'ㅟ': 3, 'ㅠ': 3, 'ㅡ': 1, 'ㅢ': 2, 'ㅣ': 1
};

const JONGSEONG_STROKES = {
    '': 0, 'ㄱ': 2, 'ㄲ': 4, 'ㄳ': 4, 'ㄴ': 2, 'ㄵ': 5,
    'ㄶ': 5, 'ㄷ': 3, 'ㄹ': 5, 'ㄺ': 7, 'ㄻ': 9, 'ㄼ': 9,
    'ㄽ': 7, 'ㄾ': 9, 'ㄿ': 9, 'ㅀ': 8, 'ㅁ': 4, 'ㅂ': 4,
    'ㅄ': 6, 'ㅅ': 2, 'ㅆ': 4, 'ㅇ': 1, 'ㅈ': 3, 'ㅊ': 4,
    'ㅋ': 3, 'ㅌ': 4, 'ㅍ': 4, 'ㅎ': 3
};
