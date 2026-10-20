<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  mail: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['swipe-left', 'swipe-right', 'swipe-up']);

// État du swipe
const touchStartX = ref(0);
const touchStartY = ref(0);
const touchEndX = ref(0);
const touchEndY = ref(0);
const isSwiping = ref(false);
const swipeDirection = ref('');
const cardStyle = ref({});
const overlayStyle = ref({});

// Gestion des touches pour le swipe
const handleTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX;
  touchStartY.value = e.touches[0].clientY;
  isSwiping.value = true;
  swipeDirection.value = '';
  cardStyle.value = { transition: 'none' };
};

const handleTouchMove = (e) => {
  if (!isSwiping.value) return;
  
  const touchX = e.touches[0].clientX;
  const touchY = e.touches[0].clientY;
  const deltaX = touchX - touchStartX.value;
  const deltaY = touchY - touchStartY.value;
  
  // Calcul de la distance et direction
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  
  if (distance > 10) {
    // Déterminer la direction principale
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        swipeDirection.value = 'right';
      } else {
        swipeDirection.value = 'left';
      }
    } else {
      if (deltaY < 0) {
        swipeDirection.value = 'up';
      } else {
        swipeDirection.value = 'down';
      }
    }
    
    // Appliquer le décalage
    cardStyle.value = {
      transform: `translate(${deltaX}px, ${deltaY}px)`,
      transition: 'none',
      zIndex: 10,
    };
    
    // Opacité de l'overlay
    const opacity = Math.min(1, distance / 100);
    overlayStyle.value = {
      opacity: opacity,
    };
  }
};

const handleTouchEnd = () => {
  if (!isSwiping.value) return;
  
  const deltaX = touchEndX.value - touchStartX.value;
  const deltaY = touchEndY.value - touchStartY.value;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  
  // Reset des styles
  cardStyle.value = {
    transform: 'translate(0, 0)',
    transition: 'transform 0.3s ease',
    zIndex: 1,
  };
  overlayStyle.value = { opacity: 0 };
  
  isSwiping.value = false;
  
  // Seuil pour déclencher le swipe (100px)
  if (distance < 100) {
    swipeDirection.value = '';
    return;
  }
  
  // Déterminer l'action finale
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0) {
      emit('swipe-right', props.mail);
    } else {
      emit('swipe-left', props.mail);
    }
  } else {
    if (deltaY < 0) {
      emit('swipe-up', props.mail);
    }
  }
  
  swipeDirection.value = '';
};

// Gestion pour souris (pour le desktop)
const handleMouseDown = (e) => {
  touchStartX.value = e.clientX;
  touchStartY.value = e.clientY;
  isSwiping.value = true;
  swipeDirection.value = '';
  cardStyle.value = { transition: 'none' };
};

const handleMouseMove = (e) => {
  if (!isSwiping.value) return;
  
  const deltaX = e.clientX - touchStartX.value;
  const deltaY = e.clientY - touchStartY.value;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  
  if (distance > 10) {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      swipeDirection.value = deltaX > 0 ? 'right' : 'left';
    } else {
      swipeDirection.value = deltaY < 0 ? 'up' : 'down';
    }
    
    cardStyle.value = {
      transform: `translate(${deltaX}px, ${deltaY}px)`,
      transition: 'none',
      zIndex: 10,
    };
    
    const opacity = Math.min(1, distance / 100);
    overlayStyle.value = { opacity: opacity };
  }
};

const handleMouseUp = () => {
  handleTouchEnd();
};

// Classe CSS basée sur la catégorie
const categoryClass = computed(() => {
  switch (props.mail.category) {
    case 'important':
      return 'mail-card-important';
    case 'normal':
      return 'mail-card-normal';
    case 'faible':
      return 'mail-card-faible';
    default:
      return '';
  }
});

// Classe du badge de catégorie
const categoryBadgeClass = computed(() => {
  switch (props.mail.category) {
    case 'important':
      return 'category-badge category-important';
    case 'normal':
      return 'category-badge category-normal';
    case 'faible':
      return 'category-badge category-faible';
    default:
      return 'category-badge';
  }
});

// Texte du badge
const categoryText = computed(() => {
  switch (props.mail.category) {
    case 'important':
      return '⭐ Important';
    case 'normal':
      return '📧 Normal';
    case 'faible':
      return '🗑️ Faible';
    default:
      return '';
  }
});

// Formater la date
const formattedDate = computed(() => {
  const date = new Date(props.mail.date);
  return date.toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
});

// Texte de l'overlay
const overlayText = computed(() => {
  switch (swipeDirection.value) {
    case 'left':
      return '✓ LU';
    case 'right':
      return '→ RÉPONDRE';
    case 'up':
      return '⬆️ RÉPONSE IA';
    default:
      return '';
  }
});

// Classe de l'overlay
const overlayClass = computed(() => {
  switch (swipeDirection.value) {
    case 'left':
      return 'swipe-overlay swipe-left-overlay';
    case 'right':
      return 'swipe-overlay swipe-right-overlay';
    case 'up':
      return 'swipe-overlay swipe-up-overlay';
    default:
      return 'swipe-overlay';
  }
});
</script>

<template>
  <div
    class="mail-card relative overflow-hidden mb-4 mx-4 cursor-grab active:cursor-grabbing"
    :class="[categoryClass, { 'shadow-xl': isSwiping }]"
    :style="cardStyle"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    @mouseleave="handleMouseUp"
  >
    <!-- Overlay de swipe -->
    <div :class="overlayClass" :style="overlayStyle">
      <span>{{ overlayText }}</span>
    </div>
    
    <!-- Contenu de la carte -->
    <div class="p-6 relative z-10">
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <div class="flex items-center space-x-3 mb-2">
            <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <span class="text-primary font-bold text-lg">{{ mail.sender.charAt(0).toUpperCase() }}</span>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">{{ mail.sender }}</h3>
              <p class="text-sm text-gray-500">{{ formattedDate }}</p>
            </div>
          </div>
          
          <h2 class="text-xl font-bold text-gray-900 mb-2">{{ mail.subject }}</h2>
          
          <p class="text-gray-700 mb-4 line-clamp-3">{{ mail.body }}</p>
          
          <div class="flex items-center space-x-2">
            <span :class="categoryBadgeClass">{{ categoryText }}</span>
            <span v-if="mail.needsReply" class="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">✉️ Besoin de réponse</span>
            <span v-if="mail.isRead" class="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">Lu</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cursor-grab {
  cursor: grab;
}

.cursor-grab:active {
  cursor: grabbing;
}

.active\:cursor-grabbing:active {
  cursor: grabbing;
}
</style>
