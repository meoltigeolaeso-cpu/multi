// FIX: Created a mock API using localStorage to simulate a backend.
import { User, Listing, Wanted, Reservation, Review, Message } from './types';
import { initialData } from './data';

const DB_KEY = 'recheckin_db';
const USER_KEY = 'recheckin_user';

// Initialize DB
const getDb = () => {
    const dbString = localStorage.getItem(DB_KEY);
    if (dbString) {
        return JSON.parse(dbString);
    }
    const db = initialData;
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    return db;
};

const saveDb = (db: any) => {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const api = {
    // AUTH
    async login({ email, password }: { email: string, password?: string }): Promise<User> {
        await delay(500);
        const db = getDb();
        const user = db.users.find((u: User) => u.email === email && u.password === password);
        if (user) {
            const { password, ...userToStore } = user;
            localStorage.setItem(USER_KEY, JSON.stringify(userToStore));
            return userToStore;
        }
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
    },
    async register(newUser: Partial<User>): Promise<User> {
        await delay(500);
        const db = getDb();
        if (db.users.some((u: User) => u.email === newUser.email)) {
            throw new Error('이미 사용 중인 이메일입니다.');
        }
        const user: User = { id: `user_${Date.now()}`, ...newUser, wishlist: [] } as User;
        db.users.push(user);
        saveDb(db);
        const { password, ...userToStore } = user;
        localStorage.setItem(USER_KEY, JSON.stringify(userToStore));
        return userToStore;
    },
    logout(): void {
        localStorage.removeItem(USER_KEY);
    },
    async getCurrentUser(): Promise<User | null> {
        const userString = localStorage.getItem(USER_KEY);
        return userString ? JSON.parse(userString) : null;
    },
    
    // DATA FETCHING
    async getListings(filters: any): Promise<Listing[]> {
        await delay(300);
        const db = getDb();
        return db.listings;
    },
    async getListingById(id: string): Promise<Listing | null> {
        const db = getDb();
        return db.listings.find((l: Listing) => l.id === id) || null;
    },
    async getWanteds(filters: any): Promise<Wanted[]> {
        await delay(300);
        const db = getDb();
        return db.wanteds;
    },
    async getReservations(): Promise<Reservation[]> {
        const db = getDb();
        const currentUser = await this.getCurrentUser();
        if(!currentUser) return [];
        return db.reservations.filter((r: Reservation) => r.buyer === currentUser.name || r.seller === currentUser.name);
    },
     async getReviews(): Promise<Review[]> {
        const db = getDb();
        return db.reviews;
    },
    
    // DATA MUTATION
    async createListing(listingData: Partial<Listing>, user: User): Promise<Listing> {
        await delay(500);
        const db = getDb();
        const newListing: Listing = {
            id: `listing_${Date.now()}`,
            seller: user.name,
            sellerId: user.id,
            images: ['https://source.unsplash.com/random/800x600/?hotel,resort'],
            rating: 0,
            reviewCount: 0,
            status: 'selling',
            applicants: [],
            currentBuyer: null,
            ...listingData
        } as Listing;
        db.listings.unshift(newListing);
        saveDb(db);
        return newListing;
    },
    async createWanted(wantedData: Partial<Wanted>, user: User): Promise<Wanted> {
        await delay(500);
        const db = getDb();
        const newWanted: Wanted = {
            id: `wanted_${Date.now()}`,
            author: user.name,
            authorId: user.id,
            ...wantedData
        } as Wanted;
        db.wanteds.unshift(newWanted);
        saveDb(db);
        return newWanted;
    },
    async applyForListing(listingId: string, applicantName: string): Promise<Listing> {
        await delay(300);
        const db = getDb();
        const listing = db.listings.find((l: Listing) => l.id === listingId);
        if (!listing) throw new Error("Listing not found");
        if (!listing.applicants.includes(applicantName)) {
            listing.applicants.push(applicantName);
        }
        saveDb(db);
        return listing;
    },
    async acceptApplicant(listingId: string, applicantName: string): Promise<Listing> {
        await delay(500);
        const db = getDb();
        const listing = db.listings.find((l: Listing) => l.id === listingId);
        if (!listing) throw new Error("Listing not found");
        listing.status = 'in-progress';
        listing.currentBuyer = applicantName;
        listing.applicants = []; // Clear other applicants
        saveDb(db);
        return listing;
    },
    async completeTransaction(listingId: string): Promise<Listing> {
        await delay(500);
        const db = getDb();
        const listing = db.listings.find((l: Listing) => l.id === listingId);
        if (!listing) throw new Error("Listing not found");
        listing.status = 'completed';
        // Create a reservation record
        const newReservation: Reservation = {
            id: `res_${Date.now()}`,
            listingId: listing.id, name: listing.name, seller: listing.seller,
            buyer: listing.currentBuyer!, price: listing.salePrice,
            checkIn: listing.checkIn, checkOut: listing.checkOut, status: 'completed',
        };
        db.reservations.push(newReservation);
        saveDb(db);
        return listing;
    },
    async cancelTransaction(listingId: string): Promise<Listing> {
        await delay(500);
        const db = getDb();
        const listing = db.listings.find((l: Listing) => l.id === listingId);
        if (!listing) throw new Error("Listing not found");
        listing.status = 'selling';
        listing.currentBuyer = null;
        saveDb(db);
        return listing;
    },
    async toggleWishlist(listingId: string): Promise<User> {
        const db = getDb();
        const user = await this.getCurrentUser();
        if (!user) throw new Error("Not logged in");
        const userInDb = db.users.find((u: User) => u.id === user.id);
        if (!userInDb) throw new Error("User not found");
        if (!userInDb.wishlist) userInDb.wishlist = [];
        const index = userInDb.wishlist.indexOf(listingId);
        if (index > -1) {
            userInDb.wishlist.splice(index, 1);
        } else {
            userInDb.wishlist.push(listingId);
        }
        saveDb(db);
        localStorage.setItem(USER_KEY, JSON.stringify(userInDb));
        return userInDb;
    },

    // MESSAGING
    async getMessages(chatRoomId: string): Promise<Message[]> {
        const db = getDb();
        return db.messages[chatRoomId] || [];
    },
    async sendMessage(chatRoomId: string, message: Message): Promise<Message> {
        await delay(200);
        const db = getDb();
        if (!db.messages[chatRoomId]) {
            db.messages[chatRoomId] = [];
        }
        db.messages[chatRoomId].push(message);
        saveDb(db);
        return message;
    },

    // REVIEWS & DISPUTES
    async submitReview(
        reviewData: { reservationId: string; rating: number; comment: string; },
        reservation: Reservation,
        user: User
    ): Promise<{ newReview: Review, updatedReservation: Reservation }> {
        await delay(600);
        const db = getDb();
        const newReview: Review = {
            id: `review_${Date.now()}`, author: user.name, timestamp: new Date().toISOString(), ...reviewData
        };
        db.reviews.push(newReview);
        const resInDb = db.reservations.find((r: Reservation) => r.id === reservation.id);
        if (resInDb) {
            resInDb.reviewSubmitted = true;
        }
        saveDb(db);
        return { newReview, updatedReservation: resInDb };
    },
     async submitDispute(reservationId: string): Promise<Reservation> {
        await delay(600);
        const db = getDb();
        const reservation = db.reservations.find((r: Reservation) => r.id === reservationId);
        if (!reservation) throw new Error('Reservation not found');
        reservation.status = 'disputed';
        saveDb(db);
        return reservation;
    },
    
    // For Demo
    resetData(): void {
        localStorage.removeItem(DB_KEY);
        localStorage.removeItem(USER_KEY);
        getDb();
    }
};

export default api;