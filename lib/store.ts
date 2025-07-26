import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AES, enc } from 'crypto-js'
import { SimpleCard } from './types'

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET_KEY || 'secure-key-2025'

interface CachedItem {
  id: string | number;
  name: string;
  tag?: string;
}

interface AppState {
  filteredCards: SimpleCard[];
  auth: {
    domain: string;
    apiKey: string;
    timestamp: number;
  } | null;
  cache: CachedItem[];
  setAuth: (domain: string, apiKey: string) => void;
  clearAuth: () => void;
  setFilteredCards: (cards: SimpleCard[]) => void;
  addToCache: (id: string | number, name: string , tag?: string) => void;
  getCachedItem: (id: string | number) => CachedItem | undefined;
  clearCache: () => void;
  getDomain: () => string | null;
  isAuthValid: () => boolean;
  getAuth: () => { domain: string; apiKey: string; } | null;
  getDecryptedAuth: () => { domain: string; apiKey: string; } | null;
  getWorkspaces: () => CachedItem[];
}

// Encryption utilities
const encrypt = (text: string): string => {
  return AES.encrypt(text, ENCRYPTION_KEY).toString()
}

const decrypt = (ciphertext: string): string => {
  const bytes = AES.decrypt(ciphertext, ENCRYPTION_KEY)
  return bytes.toString(enc.Utf8)
}

// Initial empty state
const initialState: AppState = {
  filteredCards: [],
  auth: null,
  cache: [],
  setAuth: () => {},
  clearAuth: () => {},
  setFilteredCards: () => {},
  addToCache: () => {},
  getCachedItem: () => undefined,
  clearCache: () => {},
  getDomain: () => null,
  isAuthValid: () => false,
  getAuth: () => null,
  getDecryptedAuth: () => null,
  getWorkspaces: () => []
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setAuth: (domain: string, apiKey: string) => {
        try {
          const encryptedDomain = encrypt(domain);
          const encryptedApiKey = encrypt(apiKey);
          
          set(state => {
            const newState = {
              ...state,
              auth: {
                domain: encryptedDomain,
                apiKey: encryptedApiKey,
                timestamp: Date.now()
              }
            };
            // Verify the auth was set
            if (!newState.auth) {
              throw new Error('Failed to set auth state');
            }
            return newState;
          });
        } catch (error) {
          console.error('Error setting auth:', error);
          throw error;
        }
      },

      clearAuth: () => {
        set(state => ({ ...state, auth: null }));
      },

      setFilteredCards: (cards) => set({ filteredCards: cards }),

      addToCache: (id: string | number, name: string, tag?: string) => {
        set((state) => {
          const newItem = { id, name, tag };
          const filteredCache = state.cache.filter(item => item.id !== id);
          return {
            ...state,
            cache: [newItem, ...filteredCache].slice(0, 100) // Keep last 100 items
          };
        });
      },

      getCachedItem: (id: string | number) => {
        const state = get();
        return state.cache.find(item => item.id === id || item?.tag === id);
      },

      clearCache: () => {
        set(state => ({ ...state, cache: [] }));
      },

      getDomain: () => {
        const state = get();
        return state.auth?.domain ? decrypt(state.auth.domain) : null;
      },

      isAuthValid: () => {
        const state = get();
        if (!state.auth) return false;
        
        const now = Date.now();
        const expirationTime = state.auth.timestamp + 24 * 60 * 60 * 1000;
        return now < expirationTime;
      },

      getAuth: () => {
        const state = get();
        if (!state.auth) return null;
        
        try {
          const auth = {
            domain: state.auth.domain,
            apiKey: state.auth.apiKey
          };
          // Verify we can access the encrypted values
          if (!auth.domain || !auth.apiKey) {
            throw new Error('Invalid auth state');
          }
          return auth;
        } catch (error) {
          console.error('Failed to get auth:', error);
          return null;
        }
      },

      getDecryptedAuth: () => {
        const state = get();
        if (!state.auth) return null;
        
        try {
          return {
            domain: decrypt(state.auth.domain),
            apiKey: decrypt(state.auth.apiKey)
          };
        } catch (error) {
          console.error('Failed to decrypt auth:', error);
          return null;
        }
      },

      getWorkspaces: () => {
        const state = get();
        return state.cache.filter(item => item.tag === 'workspace');
      }
    }),
    {
      name: 'app-store',
      partialize: (state) => {
        const persistedState = {
          auth: state.auth,
          cache: state.cache
        };
        return persistedState;
      },
      version: 1,
      skipHydration: false
    }
  )
)

// Export decrypt for API usage
export { decrypt }
