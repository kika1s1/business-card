import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import api from '../services/api';

const useCardStore = create(devtools((set, get) => ({
  // State
  cards: [],
  currentCard: null,
  templates: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    category: 'all'
  },

  // Actions
  fetchCards: async () => {
    try {
      set({ loading: true, error: null });
      
      const response = await api.get('/api/cards');
      
      // Ensure we always set an array
      const cardsData = Array.isArray(response.data) ? response.data : [];
      
      set({ 
        cards: cardsData, 
        loading: false 
      });
    } catch (error) {
      // For development: provide mock data when API is not available
      const mockCards = [
        {
          id: '1',
          name: 'My Business Card',
          profession: 'Software Developer',
          category: 'technology',
          templateId: 'modern',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          content: {
            fullName: 'John Doe',
            jobTitle: 'Senior Software Developer',
            company: 'Tech Solutions Inc.',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            website: 'https://johndoe.dev',
            address: '123 Tech Street, Silicon Valley, CA'
          }
        },
        {
          id: '2',
          name: 'Creative Portfolio Card',
          profession: 'Graphic Designer',
          category: 'creative',
          templateId: 'creative',
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
          content: {
            fullName: 'Jane Smith',
            jobTitle: 'Creative Director',
            company: 'Design Studio',
            email: 'jane@designstudio.com',
            phone: '+1 (555) 987-6543',
            website: 'https://janesmith.design',
            address: '456 Creative Ave, New York, NY'
          }
        }
      ];
      
      const errorMessage = error.response?.data?.message || 'API not available - using mock data';
      set({ 
        error: null, // Don't show error for mock data
        loading: false,
        cards: mockCards
      });
    }
  },

  fetchTemplates: async () => {
    try {
      set({ loading: true, error: null });
      
      const response = await api.get('/api/templates');
      
      // Ensure we always set an array
      const templatesData = Array.isArray(response.data) ? response.data : [];
      
      set({ 
        templates: templatesData, 
        loading: false 
      });
    } catch (error) {
      // For development: provide mock template data when API is not available
      const mockTemplates = [
        {
          id: 'modern',
          name: 'Modern Professional',
          category: 'corporate',
          description: 'Clean and modern design perfect for business professionals',
          features: ['Minimalist layout', 'Professional colors', 'Easy to read'],
          preview: '/templates/modern-preview.jpg',
          isPremium: false,
          colors: {
            primary: '#2563eb',
            secondary: '#64748b',
            accent: '#f1f5f9'
          }
        },
        {
          id: 'creative',
          name: 'Creative Portfolio',
          category: 'creative',
          description: 'Vibrant and artistic design for creative professionals',
          features: ['Bold colors', 'Artistic layout', 'Portfolio showcase'],
          preview: '/templates/creative-preview.jpg',
          isPremium: false,
          colors: {
            primary: '#7c3aed',
            secondary: '#fbbf24',
            accent: '#f9fafb'
          }
        },
        {
          id: 'executive',
          name: 'Executive Luxury',
          category: 'corporate',
          description: 'Elegant and sophisticated design for executives',
          features: ['Premium finish', 'Gold accents', 'Luxury feel'],
          preview: '/templates/executive-preview.jpg',
          isPremium: true,
          colors: {
            primary: '#1f2937',
            secondary: '#d97706',
            accent: '#f3f4f6'
          }
        },
        {
          id: 'healthcare',
          name: 'Healthcare Professional',
          category: 'healthcare',
          description: 'Clean and trustworthy design for healthcare workers',
          features: ['Medical icons', 'Trust colors', 'Clear layout'],
          preview: '/templates/healthcare-preview.jpg',
          isPremium: false,
          colors: {
            primary: '#059669',
            secondary: '#0891b2',
            accent: '#ecfdf5'
          }
        },
        {
          id: 'tech',
          name: 'Tech Innovator',
          category: 'technology',
          description: 'Futuristic design for technology professionals',
          features: ['Tech patterns', 'Modern fonts', 'Digital feel'],
          preview: '/templates/tech-preview.jpg',
          isPremium: true,
          colors: {
            primary: '#3b82f6',
            secondary: '#6366f1',
            accent: '#eff6ff'
          }
        }
      ];
      
      const errorMessage = error.response?.data?.message || 'API not available - using mock data';
      set({ 
        error: null, // Don't show error for mock data
        loading: false,
        templates: mockTemplates
      });
    }
  },

  createCard: async (cardData) => {
    try {
      set({ loading: true, error: null });
      
      const response = await api.post('/api/cards', cardData);
      const newCard = response.data;
      
      set(state => ({ 
        cards: [...state.cards, newCard],
        currentCard: newCard,
        loading: false 
      }));
      
      return { success: true, card: newCard };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create card';
      set({ 
        error: errorMessage, 
        loading: false 
      });
      return { success: false, error: errorMessage };
    }
  },

  updateCard: async (cardId, cardData) => {
    try {
      set({ loading: true, error: null });
      
      const response = await api.put(`/api/cards/${cardId}`, cardData);
      const updatedCard = response.data;
      
      set(state => ({
        cards: state.cards.map(card => 
          card.id === cardId ? updatedCard : card
        ),
        currentCard: state.currentCard?.id === cardId ? updatedCard : state.currentCard,
        loading: false
      }));
      
      return { success: true, card: updatedCard };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update card';
      set({ 
        error: errorMessage, 
        loading: false 
      });
      return { success: false, error: errorMessage };
    }
  },

  deleteCard: async (cardId) => {
    try {
      set({ loading: true, error: null });
      
      await api.delete(`/api/cards/${cardId}`);
      
      set(state => ({
        cards: state.cards.filter(card => card.id !== cardId),
        currentCard: state.currentCard?.id === cardId ? null : state.currentCard,
        loading: false
      }));
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete card';
      set({ 
        error: errorMessage, 
        loading: false 
      });
      return { success: false, error: errorMessage };
    }
  },

  duplicateCard: async (cardId) => {
    try {
      const card = get().cards.find(c => c.id === cardId);
      if (!card) throw new Error('Card not found');
      
      const duplicatedData = {
        ...card,
        name: `${card.name} (Copy)`,
        id: undefined,
        createdAt: undefined,
        updatedAt: undefined
      };
      
      return await get().createCard(duplicatedData);
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  setCurrentCard: (card) => {
    set({ currentCard: card });
  },

  clearCurrentCard: () => {
    set({ currentCard: null });
  },

  setFilters: (filters) => {
    set(state => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  getFilteredCards: () => {
    const { cards, filters } = get();
    
    // Ensure cards is always an array
    const cardsArray = Array.isArray(cards) ? cards : [];
    
    return cardsArray.filter(card => {
      const matchesSearch = !filters.search || 
        card.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        card.profession?.toLowerCase().includes(filters.search.toLowerCase());
        
      const matchesCategory = filters.category === 'all' || 
        card.category === filters.category;
        
      return matchesSearch && matchesCategory;
    });
  },

  clearError: () => set({ error: null })
}), { name: 'card-store' }));

export default useCardStore; 