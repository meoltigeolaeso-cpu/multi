import React, { useState, useEffect, useCallback } from 'react';
import { Listing, User, Wanted, Reservation, Review } from './types';
import api from './api';
import Header from './components/Header';
import ListingCard from './components/ListingCard';
import WantedCard from './components/WantedCard';
import SearchBar from './components/SearchBar';
import FilterControls from './components/FilterControls';
import LoginModal from './components/LoginModal';
import SignUpModal from './components/SignUpModal';
import ListingDetailModal from './components/ListingDetailModal';
import ListingForm from './components/ListingForm';
import WantedForm from './components/WantedForm';
import FloatingActionButton from './components/FloatingActionButton';
import MyReservationsModal from './components/MyReservationsModal';
import MyWishlistModal from './components/MyWishlistModal';
import UserProfileModal from './components/UserProfileModal';
import NotificationSettingsModal from './components/NotificationSettingsModal';
import ReviewModal from './components/ReviewModal';
import DisputeModal from './components/DisputeModal';
import ChatModal from './components/ChatModal';
import ConfirmationModal from './components/ConfirmationModal';
import PurposeBanner from './components/PurposeBanner';
import { useLocale } from './contexts/LocaleContext';

type ModalState = 
  | 'login' | 'signup' | 'listingDetail' | 'listingForm' | 'wantedForm' 
  | 'myReservations' | 'myWishlist' | 'userProfile' | 'notifications' 
  | 'review' | 'dispute' | 'chat' | 'feeInfo' | null;

const App: React.FC = () => {
  const { t } = useLocale();

  // Data state
  const [listings, setListings] = useState<Listing[]>([]);
  const [wanteds, setWanteds] = useState<Wanted[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  
  // UI State
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ view: 'listings', category: 'all' });

  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Modal state
  const [activeModal, setActiveModal] = useState<ModalState>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [selectedWanted, setSelectedWanted] = useState<Wanted | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [listingToDuplicate, setListingToDuplicate] = useState<Listing | undefined>(undefined);
  const [wantedToDuplicate, setWantedToDuplicate] = useState<Wanted | undefined>(undefined);
  const [chatTarget, setChatTarget] = useState<{ user: string, item: Listing | Wanted } | null>(null);
  const [confirmationProps, setConfirmationProps] = useState({ isOpen: false, onConfirm: () => {}, title: '', message: '' });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [user, listingsData, wantedsData, reservationsData, reviewsData] = await Promise.all([
        api.getCurrentUser(),
        api.getListings(filters),
        api.getWanteds(filters),
        api.getReservations(),
        api.getReviews(),
      ]);
      setCurrentUser(user);
      setListings(listingsData);
      setWanteds(wantedsData);
      setReservations(reservationsData);
      setReviews(reviewsData);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auth handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    fetchData(); // re-fetch data for the logged in user
    setActiveModal(null);
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
  };
  
  const handleResetData = () => {
    api.resetData();
    window.location.reload();
  };

  // Modal handlers
  const openModal = (modal: ModalState) => setActiveModal(modal);
  const closeModal = () => {
    setActiveModal(null);
    setSelectedListing(null);
    setSelectedWanted(null);
    setSelectedReservation(null);
    setListingToDuplicate(undefined);
    setWantedToDuplicate(undefined);
    setChatTarget(null);
  };

  // Action handlers
  const handleViewListingDetail = (listing: Listing) => {
    setSelectedListing(listing);
    openModal('listingDetail');
  };
  
  const handleListingSave = async (listingData: Partial<Listing>) => {
    if (!currentUser) return;
    const newListing = await api.createListing(listingData, currentUser);
    setListings(prev => [newListing, ...prev]);
    closeModal();
  };
  
  const handleWantedSave = async (wantedData: Partial<Wanted>) => {
    if (!currentUser) return;
    const newWanted = await api.createWanted(wantedData, currentUser);
    setWanteds(prev => [newWanted, ...prev]);
    closeModal();
  };

  const handleToggleWishlist = async (listingId: string) => {
    if (!currentUser) {
      openModal('login');
      return;
    }
    try {
      const updatedUser = await api.toggleWishlist(listingId);
      setCurrentUser(updatedUser);
    } catch (error) {
      console.error("Failed to toggle wishlist", error);
    }
  };
  
  const handleListingUpdate = (updatedListing: Listing) => {
    setListings(prev => prev.map(l => l.id === updatedListing.id ? updatedListing : l));
    if (selectedListing?.id === updatedListing.id) {
      setSelectedListing(updatedListing);
    }
    fetchData(); // re-fetch all data to ensure consistency
  };
  
  const handleReservationUpdate = (updatedReservation: Reservation) => {
     setReservations(prev => prev.map(r => r.id === updatedReservation.id ? updatedReservation : r));
  };
  
  const handleReviewSubmit = ({ newReview, updatedReservation }: { newReview: Review, updatedReservation: Reservation }) => {
    setReviews(prev => [...prev, newReview]);
    handleReservationUpdate(updatedReservation);
    closeModal();
  };

  const handleDuplicateListing = (listing: Listing) => {
    setListingToDuplicate(listing);
    openModal('listingForm');
  }

  const handleDuplicateWanted = (wanted: Wanted) => {
    setWantedToDuplicate(wanted);
    openModal('wantedForm');
  }

  const handleContact = (item: Listing | Wanted) => {
    const targetUser = 'seller' in item ? item.seller : item.author;
    setChatTarget({ user: targetUser, item });
    openModal('chat');
  };

  // Filtering and searching
  const filteredListings = listings.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.location.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredWanteds = wanteds.filter(w => w.location.toLowerCase().includes(searchQuery.toLowerCase()) || w.details.toLowerCase().includes(searchQuery.toLowerCase()));
  
  const wishlistItems = listings.filter(l => currentUser?.wishlist?.includes(l.id));

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header 
        isLoggedIn={!!currentUser}
        user={currentUser}
        onLoginClick={() => openModal('login')}
        onLogoutClick={handleLogout}
        onSignUpClick={() => openModal('signup')}
        onMyReservationsClick={() => openModal('myReservations')}
        onWishlistClick={() => openModal('myWishlist')}
        onProfileClick={() => openModal('userProfile')}
        onNotificationsClick={() => openModal('notifications')}
        onResetData={handleResetData}
      />
      <main className="container mx-auto px-4 py-8">
        <PurposeBanner />
        <SearchBar onSearch={setSearchQuery} />
        
        <FilterControls onFilterChange={setFilters} />

        {isLoading ? (
          <p className="text-center text-gray-500 py-10 text-lg">{t('loading')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filters.view === 'listings' ? 
              (filteredListings.length > 0 ? filteredListings.map(listing => (
                <ListingCard 
                  key={listing.id} 
                  listing={listing} 
                  onViewDetail={handleViewListingDetail}
                  onToggleWishlist={handleToggleWishlist}
                  currentUser={currentUser}
                  onDuplicate={handleDuplicateListing}
                />
              )) : <p className="col-span-full text-center text-gray-500 py-10">{t('noResults')}</p>)
             : 
              (filteredWanteds.length > 0 ? filteredWanteds.map(wanted => (
                <WantedCard 
                    key={wanted.id} 
                    wanted={wanted}
                    onContact={handleContact}
                    currentUser={currentUser}
                    onDuplicate={handleDuplicateWanted}
                />
              )) : <p className="col-span-full text-center text-gray-500 py-10">{t('noResults')}</p>)
            }
          </div>
        )}
      </main>

      {currentUser && <FloatingActionButton onList={() => openModal('listingForm')} onWant={() => openModal('wantedForm')} />}

      {/* Modals */}
      {activeModal === 'login' && <LoginModal onClose={closeModal} onLoginSuccess={handleLoginSuccess} onSwitchToSignUp={() => openModal('signup')} />}
      {activeModal === 'signup' && <SignUpModal onClose={closeModal} onSignUpSuccess={handleLoginSuccess} onSwitchToLogin={() => openModal('login')} />}
      {activeModal === 'listingDetail' && selectedListing && <ListingDetailModal listing={selectedListing} user={currentUser} onClose={closeModal} onUpdateListing={handleListingUpdate} onContact={handleContact} onLoginRequest={() => openModal('login')} />}
      {activeModal === 'listingForm' && currentUser && <ListingForm user={currentUser} onSave={handleListingSave} onClose={closeModal} existingListing={listingToDuplicate} />}
      {activeModal === 'wantedForm' && currentUser && <WantedForm user={currentUser} onSave={handleWantedSave} onClose={closeModal} existingWanted={wantedToDuplicate} />}
      {activeModal === 'myReservations' && currentUser && <MyReservationsModal user={currentUser} reservations={reservations} onClose={closeModal} onWriteReview={(res) => { closeModal(); setSelectedReservation(res); openModal('review'); }} onDispute={(res) => { closeModal(); setSelectedReservation(res); openModal('dispute'); }} />}
      {activeModal === 'myWishlist' && currentUser && <MyWishlistModal user={currentUser} wishlist={wishlistItems} onClose={closeModal} onToggleWishlist={handleToggleWishlist} onViewDetail={handleViewListingDetail} />}
      {activeModal === 'userProfile' && currentUser && <UserProfileModal user={currentUser} onClose={closeModal} />}
      {activeModal === 'notifications' && <NotificationSettingsModal onClose={closeModal} />}
      {activeModal === 'review' && selectedReservation && currentUser && <ReviewModal reservation={selectedReservation} user={currentUser} onClose={closeModal} onSubmitSuccess={handleReviewSubmit} />}
      {activeModal === 'dispute' && selectedReservation && <DisputeModal reservation={selectedReservation} onClose={closeModal} onSubmitSuccess={handleReservationUpdate} />}
      {activeModal === 'chat' && chatTarget && currentUser && <ChatModal targetUser={chatTarget.user} item={chatTarget.item} onClose={closeModal} currentUser={currentUser} />}
      <ConfirmationModal {...confirmationProps} onClose={() => setConfirmationProps(prev => ({...prev, isOpen: false}))} />
    </div>
  );
}

export default App;