import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCardStore from '../stores/cardStore';
import useUIStore from '../stores/uiStore';
import { ROUTES, SUCCESS_MESSAGES } from '../utils/constants';

export const useCards = () => {
  const {
    cards,
    currentCard,
    templates,
    loading,
    error,
    filters,
    fetchCards,
    fetchTemplates,
    createCard,
    updateCard,
    deleteCard,
    duplicateCard,
    setCurrentCard,
    clearCurrentCard,
    setFilters,
    getFilteredCards,
    clearError
  } = useCardStore();

  const { showSuccess, showError } = useUIStore();
  const navigate = useNavigate();

  // Fetch data on mount
  useEffect(() => {
    if (cards.length === 0) {
      fetchCards();
    }
    if (templates.length === 0) {
      fetchTemplates();
    }
  }, [cards.length, templates.length, fetchCards, fetchTemplates]);

  const handleCreateCard = async (cardData) => {
    const result = await createCard(cardData);
    
    if (result.success) {
      showSuccess(SUCCESS_MESSAGES.CARD_SAVED);
      navigate(`${ROUTES.CARD_EDITOR}/${result.card.id}`);
    } else {
      showError(result.error);
    }
    
    return result;
  };

  const handleUpdateCard = async (cardId, cardData) => {
    const result = await updateCard(cardId, cardData);
    
    if (result.success) {
      showSuccess(SUCCESS_MESSAGES.CARD_SAVED);
    } else {
      showError(result.error);
    }
    
    return result;
  };

  const handleDeleteCard = async (cardId) => {
    const result = await deleteCard(cardId);
    
    if (result.success) {
      showSuccess(SUCCESS_MESSAGES.CARD_DELETED);
    } else {
      showError(result.error);
    }
    
    return result;
  };

  const handleDuplicateCard = async (cardId) => {
    const result = await duplicateCard(cardId);
    
    if (result.success) {
      showSuccess('Card duplicated successfully!');
    } else {
      showError(result.error);
    }
    
    return result;
  };

  const searchCards = (searchTerm) => {
    setFilters({ search: searchTerm });
  };

  const filterByCategory = (category) => {
    setFilters({ category });
  };

  const getCardsByCategory = (category) => {
    return cards.filter(card => card.category === category);
  };

  const getRecentCards = (limit = 5) => {
    return cards
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, limit);
  };

  const getCardById = (cardId) => {
    return cards.find(card => card.id === cardId);
  };

  const getTemplateById = (templateId) => {
    return templates.find(template => template.id === templateId);
  };

  const getTemplatesByCategory = (category) => {
    return templates.filter(template => template.category === category);
  };

  const getCardStats = () => {
    return {
      total: cards.length,
      byCategory: cards.reduce((acc, card) => {
        acc[card.category] = (acc[card.category] || 0) + 1;
        return acc;
      }, {}),
      recentlyCreated: cards.filter(card => {
        const createdAt = new Date(card.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdAt > weekAgo;
      }).length
    };
  };

  return {
    // State
    cards,
    currentCard,
    templates,
    loading,
    error,
    filters,
    
    // Derived state
    filteredCards: getFilteredCards(),
    
    // Actions
    createCard: handleCreateCard,
    updateCard: handleUpdateCard,
    deleteCard: handleDeleteCard,
    duplicateCard: handleDuplicateCard,
    refreshCards: fetchCards,
    refreshTemplates: fetchTemplates,
    setCurrentCard,
    clearCurrentCard,
    clearError,
    
    // Search and filter
    searchCards,
    filterByCategory,
    setFilters,
    
    // Utilities
    getCardsByCategory,
    getRecentCards,
    getCardById,
    getTemplateById,
    getTemplatesByCategory,
    getCardStats,
  };
}; 