import { User, Listing, Wanted, Reservation, Review, Message } from './types';

const users: User[] = [
  { id: 'user_1', name: '김민준', email: 'minjun.kim@example.com', password: 'password123', wishlist: ['listing_3', 'listing_10'] },
  { id: 'user_2', name: '이서연', email: 'seoyeon.lee@example.com', password: 'password123', wishlist: [] },
  { id: 'user_3', name: '박도윤', email: 'doyoon.park@example.com', password: 'password123', wishlist: [] },
  { id: 'user_4', name: '최지우', email: 'jiwoo.choi@example.com', password: 'password123', wishlist: [] },
];

const listings: Listing[] = [
    {
        id: 'listing_1',
        name: '제주 신라호텔 오션뷰 스위트',
        location: '제주도 서귀포시',
        originalPrice: 850000,
        salePrice: 700000,
        description: '개인 사정으로 급하게 양도합니다. 최고의 전망을 자랑하는 오션뷰 스위트룸입니다. 수영장, 조식 포함.',
        checkIn: '2024-08-10',
        checkOut: '2024-08-12',
        seller: '김민준',
        sellerId: 'user_1',
        images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'],
        rating: 4.9,
        reviewCount: 120,
        category: 'accommodation',
        details: {
            type: '호텔',
            guests: 2,
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            amenities: ['wifi', '수영장', '조식', '주차장'],
        },
        status: 'selling',
        applicants: ['이서연'],
        currentBuyer: null,
    },
    // ... (49 more listings)
    { id: 'listing_50', name: '가평 풀빌라 프라이빗 독채', location: '경기도 가평군', originalPrice: 450000, salePrice: 380000, description: '친구들과의 약속이 취소되어 양도합니다. 개별 수영장과 바베큐 시설 완비.', checkIn: '2024-09-05', checkOut: '2024-09-06', seller: '박도윤', sellerId: 'user_3', images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'], rating: 4.8, reviewCount: 75, category: 'accommodation', details: { type: '풀빌라', guests: 4, bedrooms: 2, beds: 2, bathrooms: 2, amenities: ['wifi', '개별 수영장', '바베큐'] }, status: 'selling', applicants: [], currentBuyer: null }
];

const wanteds: Wanted[] = [
    {
        id: 'wanted_1',
        author: '최지우',
        authorId: 'user_4',
        category: 'accommodation',
        location: '강원도 양양 서피비치 근처',
        checkIn: '2024-08-15',
        checkOut: '2024-08-17',
        details: '서핑하기 좋은 위치의 숙소 구합니다. 2인, 펜션이나 감성 숙소 선호해요!',
        desiredPrice: 300000,
    },
    // ... (49 more wanteds)
    { id: 'wanted_50', author: '김민준', authorId: 'user_1', category: 'golf', location: '제주도', checkIn: '2024-09-20', checkOut: '2024-09-21', details: '주말 제주도 골프 2인 양도 받습니다. 어느 골프장이든 상관없어요.', desiredPrice: 400000, golfBookingDetails: { teeTime: '오전', players: 2 } }
];

// Add 48 more listings
for (let i = 2; i <= 49; i++) {
    const isAccommodation = Math.random() > 0.3;
    const seller = users[i % users.length];
    const checkInDate = new Date(2024, 7 + Math.floor(i/10), 1 + (i%28));
    const checkOutDate = new Date(checkInDate.getTime() + (1 + Math.floor(Math.random() * 2)) * 24 * 60 * 60 * 1000);
    const originalPrice = (isAccommodation ? 200000 : 150000) + Math.floor(Math.random() * 20) * 10000;
    const salePrice = originalPrice - (Math.floor(Math.random() * 5) + 1) * 10000;

    if (isAccommodation) {
        listings.push({
            id: `listing_${i}`,
            name: `[양도] ${['속초', '강릉', '부산', '여수', '경주'][i%5]} 오션뷰 호텔`,
            location: ['강원도 속초시', '강원도 강릉시', '부산광역시 해운대구', '전라남도 여수시', '경상북도 경주시'][i%5],
            originalPrice, salePrice,
            description: `급한 출장으로 인해 저렴하게 양도합니다. 뷰가 정말 좋은 곳이에요.`,
            checkIn: checkInDate.toISOString().split('T')[0],
            checkOut: checkOutDate.toISOString().split('T')[0],
            seller: seller.name,
            sellerId: seller.id,
            images: [`https://source.unsplash.com/random/800x600/?hotel,resort&sig=${i}`],
            rating: 4.5 + Math.random() * 0.5,
            reviewCount: 20 + Math.floor(Math.random() * 100),
            category: 'accommodation',
            details: { type: '호텔', guests: 2, bedrooms: 1, beds: 1, bathrooms: 1, amenities: ['wifi', '주차장'] },
            status: 'selling', applicants: [], currentBuyer: null
        });
    } else {
        listings.push({
            id: `listing_${i}`,
            name: `${['남서울', '이스트밸리', '가평베네스트', '블랙스톤'][i%4]} CC 주말 라운딩`,
            location: ['경기도 성남시', '경기도 광주시', '경기도 가평군', '제주도 제주시'][i%4],
            originalPrice, salePrice,
            description: '동반자 부상으로 양도합니다. 황금 시간대입니다!',
            checkIn: checkInDate.toISOString().split('T')[0],
            checkOut: checkInDate.toISOString().split('T')[0],
            seller: seller.name,
            sellerId: seller.id,
            images: [`https://source.unsplash.com/random/800x600/?golf,course&sig=${i}`],
            rating: 4.8, reviewCount: 40,
            category: 'golf',
            details: { courseName: `${['남서울', '이스트밸리', '가평베네스트', '블랙스톤'][i%4]} CC`, teeTime: '13:30', players: 4, includes: ['green_fee', 'cart_fee'] },
            status: 'selling', applicants: [], currentBuyer: null
        });
    }
}

// Add 48 more wanteds
for (let i = 2; i <= 49; i++) {
    const isAccommodation = Math.random() > 0.3;
    const author = users[i % users.length];
    const checkInDate = new Date(2024, 8 + Math.floor(i/15), 1 + (i%28));
    const checkOutDate = new Date(checkInDate.getTime() + (1 + Math.floor(Math.random() * 2)) * 24 * 60 * 60 * 1000);
    const desiredPrice = (isAccommodation ? 150000 : 100000) + Math.floor(Math.random() * 15) * 10000;

    if (isAccommodation) {
        wanteds.push({
            id: `wanted_${i}`, author: author.name, authorId: author.id,
            category: 'accommodation',
            location: ['부산', '서울', '제주', '강릉', '속초'][i%5] + ' 근처',
            checkIn: checkInDate.toISOString().split('T')[0],
            checkOut: checkOutDate.toISOString().split('T')[0],
            details: `2인 ${['오션뷰', '시티뷰', '조용한 곳', '핫플레이스'][i%4]} 숙소 원해요.`,
            desiredPrice
        });
    } else {
         wanteds.push({
            id: `wanted_${i}`, author: author.name, authorId: author.id,
            category: 'golf',
            location: ['수도권', '강원권', '충청권', '제주도'][i%4],
            checkIn: checkInDate.toISOString().split('T')[0],
            checkOut: checkInDate.toISOString().split('T')[0],
            details: `주말 ${['오전', '오후'][i%2]} 티타임 4인 양도 구합니다.`,
            desiredPrice,
            golfBookingDetails: { teeTime: ['오전', '오후'][i%2], players: 4 }
        });
    }
}


const reservations: Reservation[] = [];
const reviews: Review[] = [];
const messages: Record<string, Message[]> = {};


export const initialData = {
  users,
  listings,
  wanteds,
  reservations,
  reviews,
  messages,
};