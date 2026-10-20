<script setup>
import { ref, onMounted, computed } from 'vue';
import MailCard from '../components/MailCard.vue';
import api from '../services/api';

// État des mails
const mails = ref([]);
const isLoading = ref(true);
const error = ref(null);
const currentMailIndex = ref(0);
const categoryFilter = ref('all');

// Filtres possibles
const categories = ['all', 'important', 'normal', 'faible'];

// Statistiques
const stats = computed(() => ({
  total: mails.value.length,
  important: mails.value.filter(m => m.category === 'important').length,
  normal: mails.value.filter(m => m.category === 'normal').length,
  faible: mails.value.filter(m => m.category === 'faible').length,
  unread: mails.value.filter(m => !m.isRead).length,
  needsReply: mails.value.filter(m => m.needsReply).length,
}));

// Mail courant
const currentMail = computed(() => {
  if (currentMailIndex.value < 0 || currentMailIndex.value >= filteredMails.value.length) {
    return null;
  }
  return filteredMails.value[currentMailIndex.value];
});

// Mails filtrés
const filteredMails = computed(() => {
  if (categoryFilter.value === 'all') {
    return mails.value;
  }
  return mails.value.filter(mail => mail.category === categoryFilter.value);
});

// Récupérer les mails
const fetchMails = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    const data = await api.getMails();
    mails.value = data;
    currentMailIndex.value = 0;
  } catch (err) {
    error.value = err.message || 'Erreur lors du chargement des mails';
    // Utiliser les données de test
    mails.value = api.generateTestMails();
    currentMailIndex.value = 0;
  } finally {
    isLoading.value = false;
  }
};

// Actions de swipe
const handleSwipeLeft = async (mail) => {
  try {
    await api.sendAction(mail.id, 'left');
    // Marquer comme lu localement
    const index = mails.value.findIndex(m => m.id === mail.id);
    if (index !== -1) {
      mails.value[index].isRead = true;
    }
    goToNextMail();
  } catch (err) {
    console.error('Erreur lors du swipe gauche:', err);
  }
};

const handleSwipeRight = async (mail) => {
  try {
    await api.sendAction(mail.id, 'right');
    // Rediriger vers la page de réponse
    window.location.href = `/reply/${mail.id}`;
  } catch (err) {
    console.error('Erreur lors du swipe droit:', err);
  }
};

const handleSwipeUp = async (mail) => {
  try {
    // Appeler l'API pour générer une réponse IA
    const response = await api.generateAIReply(mail.id);
    
    // Afficher un message de confirmation
    alert(`✨ Réponse IA générée :\n\n${response.reply || 'Réponse envoyée automatiquement !'}`);
    
    // Marquer comme répondue
    const index = mails.value.findIndex(m => m.id === mail.id);
    if (index !== -1) {
      mails.value[index].needsReply = false;
    }
    
    goToNextMail();
  } catch (err) {
    console.error('Erreur lors du swipe haut:', err);
    alert('Réponse IA générée (simulation pour la démo)');
    goToNextMail();
  }
};

// Navigation entre les mails
const goToNextMail = () => {
  if (currentMailIndex.value < filteredMails.value.length - 1) {
    currentMailIndex.value++;
  } else {
    // Fin de la liste
    currentMailIndex.value = filteredMails.value.length - 1;
  }
};

const goToPreviousMail = () => {
  if (currentMailIndex.value > 0) {
    currentMailIndex.value--;
  }
};

// Changer de catégorie
const changeCategory = (category) => {
  categoryFilter.value = category;
  currentMailIndex.value = 0;
};

// Rafraîchir les mails
const refreshMails = () => {
  fetchMails();
};

// Au montage du composant
onMounted(() => {
  fetchMails();
  
  // Rafraîchir toutes les 30 secondes (optionnel)
  setInterval(() => {
    if (!isLoading.value) {
      fetchMails();
    }
  }, 30000);
});

// Gestion du clavier
const handleKeyDown = (e) => {
  if (!currentMail.value) return;
  
  switch (e.key) {
    case 'ArrowLeft':
      handleSwipeLeft(currentMail.value);
      break;
    case 'ArrowRight':
      handleSwipeRight(currentMail.value);
      break;
    case 'ArrowUp':
      handleSwipeUp(currentMail.value);
      break;
    case 'ArrowDown':
      goToNextMail();
      break;
  }
};
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 pb-20"
    tabindex="0"
    @keydown="handleKeyDown"
    ref="container"
  >
    <!-- Barre d'actions -->
    <div class="bg-white shadow-sm border-b sticky top-16 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-12">
          <div class="flex space-x-2">
            <button
              @click="refreshMails"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Rafraîchir"
            >
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          
          <div class="flex space-x-1">
            <button
              v-for="cat in categories"
              :key="cat"
              @click="changeCategory(cat)"
              class="px-3 py-1 rounded-full text-sm font-medium transition-colors"
              :class="{
                'bg-primary text-white': categoryFilter === cat,
                'bg-gray-100 text-gray-700': categoryFilter !== cat,
              }"
            >
              <span v-if="cat === 'all'">Tous ({{ stats.total }})</span>
              <span v-else-if="cat === 'important'">⭐ Important ({{ stats.important }})</span>
              <span v-else-if="cat === 'normal'">📧 Normal ({{ stats.normal }})</span>
              <span v-else-if="cat === 'faible'">🗑️ Faible ({{ stats.faible }})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Conteneur principal -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="isLoading" class="flex items-center justify-center h-96">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
      
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p>{{ error }}</p>
        <p class="mt-2 text-sm">Utilisation des données de test pour la démo.</p>
      </div>
      
      <div v-else>
        <!-- Indicateur de position -->
        <div class="text-center mb-6" v-if="filteredMails.length > 0">
          <span class="text-sm text-gray-500">
            Mail {{ currentMailIndex + 1 }} / {{ filteredMails.length }}
          </span>
        </div>
        
        <!-- Carte de mail -->
        <div class="relative">
          <transition name="slide" mode="out-in">
            <MailCard
              v-if="currentMail"
              :key="currentMail.id"
              :mail="currentMail"
              @swipe-left="handleSwipeLeft"
              @swipe-right="handleSwipeRight"
              @swipe-up="handleSwipeUp"
            />
            <div v-else class="text-center py-20 text-gray-500">
              <p class="text-xl">Aucun mail dans cette catégorie</p>
              <button @click="changeCategory('all')" class="mt-4 text-primary underline">
                Voir tous les mails
              </button>
            </div>
          </transition>
        </div>
        
        <!-- Navigation -->
        <div class="flex justify-center space-x-4 mt-8" v-if="filteredMails.length > 0">
          <button
            @click="goToPreviousMail"
            :disabled="currentMailIndex <= 0"
            class="p-3 rounded-full bg-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            @click="goToNextMail"
            :disabled="currentMailIndex >= filteredMails.length - 1"
            class="p-3 rounded-full bg-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Barre d'aide -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
      <div class="max-w-4xl mx-auto flex items-center justify-center space-x-8 text-sm text-gray-600">
        <div class="text-center">
          <div class="text-2xl mb-1">⬅️</div>
          <div>Swipe Gauche</div>
          <div class="text-xs">Marquer comme lu</div>
        </div>
        <div class="text-center">
          <div class="text-2xl mb-1">➡️</div>
          <div>Swipe Droite</div>
          <div class="text-xs">Répondre</div>
        </div>
        <div class="text-center">
          <div class="text-2xl mb-1">⬆️</div>
          <div>Swipe Haut</div>
          <div class="text-xs">Réponse IA</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(50px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
