import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import LoginPage from './features/auth/LoginPage';
import RequireAuth from './features/auth/RequireAuth';
import { authUi } from './features/auth/authUi';
import useAuth from './features/auth/useAuth';
import CheckoutPage from './features/payments/CheckoutPage';
import OrdersPage from './features/payments/OrdersPage';
import PaymentResultPage from './features/payments/PaymentResultPage';
import { paymentUi } from './features/payments/paymentUi';
import ExploreLayout from './features/places/ExploreLayout';
import PlaceDetailPage from './features/places/PlaceDetailPage';
import PlacesPage from './features/places/PlacesPage';
import SavedPlacesPage from './features/places/SavedPlacesPage';
import useSavedPlaces from './features/places/useSavedPlaces';
import { usePlaces } from './features/places/usePlaces';
import useLanguage from './hooks/useLanguage';
import { copy } from './data/content';
import LandingPage from './pages/LandingPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  const [lang, setLang] = useLanguage();
  const auth = useAuth();
  const authLabels = authUi[lang];
  const placeCatalog = usePlaces();
  const savedPlaces = useSavedPlaces(auth.token);
  const location = useLocation();
  const navigate = useNavigate();
  const canSave = auth.user !== null;
  const isSaved = (placeId: string) => canSave && savedPlaces.isSaved(placeId);

  const handleToggleSaved = (placeId: string) => {
    if (!canSave) {
      navigate('/login', { state: { from: location.pathname, reason: 'save' } });
      return;
    }

    savedPlaces.toggleSaved(placeId);
  };

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage lang={lang} onLanguage={setLang} />} />
        <Route
          element={(
            <ExploreLayout
              lang={lang}
              loginLabel={authLabels.loginNav}
              applyLabel={copy[lang].apply}
              ordersLabel={paymentUi[lang].orders}
              onLanguage={setLang}
              onLogout={auth.logout}
              logoutLabel={authLabels.logout}
              saveError={savedPlaces.actionError}
              savedCount={canSave ? savedPlaces.savedIds.length : 0}
              signedInLabel={authLabels.signedInAs}
              userName={auth.user?.name ?? null}
            />
          )}
        >
          <Route
            path="/places"
            element={(
              <PlacesPage
                canSave={canSave}
                error={placeCatalog.error}
                isLoading={placeCatalog.isLoading}
                lang={lang}
                places={placeCatalog.places}
                savingId={savedPlaces.savingId}
                isSaved={isSaved}
                onRetry={placeCatalog.retry}
                onToggleSaved={handleToggleSaved}
              />
            )}
          />
          <Route
            path="/places/:placeId"
            element={(
              <PlaceDetailPage
                canSave={canSave}
                lang={lang}
                savingId={savedPlaces.savingId}
                isSaved={isSaved}
                onToggleSaved={handleToggleSaved}
              />
            )}
          />
          <Route
            path="/saved"
            element={(
              <RequireAuth isAuthenticated={canSave} isLoading={auth.isInitializing}>
                <SavedPlacesPage
                  error={savedPlaces.loadError}
                  isLoading={savedPlaces.isLoading}
                  lang={lang}
                  places={savedPlaces.places}
                  savingId={savedPlaces.savingId}
                  onRetry={savedPlaces.retry}
                  onToggleSaved={handleToggleSaved}
                />
              </RequireAuth>
            )}
          />
          <Route path="/login" element={<LoginPage lang={lang} onLogin={auth.login} onRegister={auth.register} />} />
          <Route path="/checkout" element={<CheckoutPage lang={lang} token={auth.token} isInitializing={auth.isInitializing} />} />
          <Route path="/checkout/success" element={<PaymentResultPage lang={lang} token={auth.token} kind="success" />} />
          <Route path="/checkout/fail" element={<PaymentResultPage lang={lang} token={auth.token} kind="fail" />} />
          <Route path="/orders" element={(
            <RequireAuth isAuthenticated={canSave} isLoading={auth.isInitializing} reason="payment">
              <OrdersPage lang={lang} token={auth.token ?? ''} />
            </RequireAuth>
          )} />
        </Route>
        <Route path="*" element={<NotFoundPage lang={lang} />} />
      </Routes>
    </>
  );
}
