<script setup>
import { ref, onMounted, computed } from 'vue';

// État des mails
const mails = ref([]);
const currentMailIndex = ref(0);
const isLoading = ref(true);
const demoMode = ref(true);

// Statistiques
const stats = ref({
  inbox: 13,
  toReply: 1,
  sent: 1,
});

// Générer des mails de test
const generateTestMails = () => {
  const importantSenders = [
    { name: 'Jean Dupont', email: 'j.dupont@ceo-entreprise.fr', initials: 'JD' },
    { name: 'Marie Martin', email: 'm.martin@directrice.fr', initials: 'MM' },
    { name: 'Pierre Lambert', email: 'p.lambert@client-important.com', initials: 'PL' },
  ];
  
  const normalSenders = [
    { name: 'Sophie Marchand', email: 's.marchand@astratech.fr', initials: 'SM' },
    { name: 'Thomas Leroy', email: 't.leroy@collegue.com', initials: 'TL' },
    { name: 'Claire Dubois', email: 'c.dubois@ami.fr', initials: 'CD' },
    { name: 'Nicolas Petit', email: 'n.petit@equipe.fr', initials: 'NP' },
  ];
  
  const faibleSenders = [
    { name: 'Promo Shop', email: 'newsletter@promo-shop.com', initials: 'PS' },
    { name: 'Marketing Pro', email: 'contact@marketing-pro.fr', initials: 'MP' },
    { name: 'Service Info', email: 'info@service-online.com', initials: 'SI' },
  ];
  
  const subjects = [
    'Compte-rendu de la réunion produit de lundi',
    'Urgent : Validation du contrat',
    'Question sur le projet en cours',
    'Nouvelle offre commerciale',
    'Mise à jour importante',
    'Document à signer',
    'Réunion prévue demain',
    'Feedback client',
  ];
  
  const bodies = [
    'Bonjour à tous. Veuillez trouver le CR de lundi : la release 4.2 est confirmée pour le 15, reste à figer la liste des tickets. Qui prend le suivi de la migration ?',
    'Je vous contacte concernant le projet en cours. Pouvez-vous me confirmer votre disponibilité ?',
    'Ci-joint le document demandé hier. Merci de me faire un retour avant vendredi.',
    'Nous vous proposons une offre exclusive valable 48h. Répondez vite !',
    'Votre contrat arrive à échéance dans 3 jours. Pensez à le renouveler.',
    'Félicitations ! Vous avez gagné un bon de réduction de 20%.',
    'La réunion de demain est annulée. Un nouveau créneau sera proposé.',
    'Le client a validé la maquette. On peut passer à la phase de développement.',
  ];
  
  const categories = ['IMPORTANT', 'NORMAL', 'FAIBLE'];
  const mails = [];
  
  for (let i = 1; i <= 15; i++) {
    const rand = Math.random();
    let category, sender;
    
    if (rand < 0.2) {
      category = 'IMPORTANT';
      sender = importantSenders[Math.floor(Math.random() * importantSenders.length)];
    } else if (rand < 0.7) {
      category = 'NORMAL';
      sender = normalSenders[Math.floor(Math.random() * normalSenders.length)];
    } else {
      category = 'FAIBLE';
      sender = faibleSenders[Math.floor(Math.random() * faibleSenders.length)];
    }
    
    const hoursAgo = Math.floor(Math.random() * 24);
    const date = new Date();
    date.setHours(date.getHours() - hoursAgo);
    
    mails.push({
      id: i.toString(),
      sender: sender,
      subject: subjects[Math.floor(Math.random() * subjects.length)],
      body: bodies[Math.floor(Math.random() * bodies.length)],
      date: date.toISOString(),
      category: category,
      isRead: Math.random() < 0.3,
      needsReply: Math.random() < 0.4,
    });
  }
  
  return mails.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Formater la date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).replace(/\//g, '-');
};

// Couleur de la catégorie
const getCategoryColor = (category) => {
  switch (category) {
    case 'IMPORTANT':
      return 'bg-red-500';
    case 'NORMAL':
      return 'bg-blue-500';
    case 'FAIBLE':
      return 'bg-gray-500';
    default:
      return 'bg-gray-400';
  }
};

// Couleur du badge de catégorie
const getCategoryBadgeColor = (category) => {
  switch (category) {
    case 'IMPORTANT':
      return 'bg-red-100 text-red-700';
    case 'NORMAL':
      return 'bg-blue-100 text-blue-700';
    case 'FAIBLE':
      return 'bg-gray-100 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

// Mail courant
const currentMail = computed(() => {
  if (currentMailIndex.value < 0 || currentMailIndex.value >= mails.value.length) {
    return null;
  }
  return mails.value[currentMailIndex.value];
});

// Navigation
const goToNextMail = () => {
  if (currentMailIndex.value < mails.value.length - 1) {
    currentMailIndex.value++;
  }
};

const goToPreviousMail = () => {
  if (currentMailIndex.value > 0) {
    currentMailIndex.value--;
  }
};

// Actions
const handleDelete = () => {
  if (currentMail.value) {
    // Supprimer le mail
    mails.value.splice(currentMailIndex.value, 1);
    if (currentMailIndex.value >= mails.value.length) {
      currentMailIndex.value = Math.max(0, mails.value.length - 1);
    }
    stats.value.sent++;
  }
};

const handleAIReply = () => {
  if (currentMail.value) {
    alert('✨ Réponse IA générée automatiquement !\n\nExemple de réponse :\n\nBonjour,\n\nMerci pour votre message. Je reviens vers vous rapidement avec une réponse détaillée.\n\nCordialement,');
    // Marquer comme répondue
    currentMail.value.needsReply = false;
    stats.value.toReply = Math.max(0, stats.value.toReply - 1);
    goToNextMail();
  }
};

const handleReply = () => {
  if (currentMail.value) {
    alert(`Répondre à : ${currentMail.value.sender.email}\n\nSujet : ${currentMail.value.subject}`);
    // Marquer comme répondue
    currentMail.value.needsReply = false;
    stats.value.toReply = Math.max(0, stats.value.toReply - 1);
    goToNextMail();
  }
};

// Au montage
onMounted(() => {
  mails.value = generateTestMails();
  isLoading.value = false;
  
  // Mettre à jour les stats
  stats.value.inbox = mails.value.length;
  stats.value.toReply = mails.value.filter(m => m.needsReply).length;
});

// Formater l'heure
const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};
</script>

<template>
  <div class="min-h-screen relative">
    <!-- Header with stats -->
    <header class="w-full p-4 pt-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
            <span class="text-xl">📧</span>
          </div>
          <h1 class="text-white text-2xl font-bold">MailTinder</h1>
        </div>
      </div>
      
      <!-- Stats badges -->
      <div class="flex justify-center space-x-4 mt-4">
        <div class="bg-white bg-opacity-20 backdrop-blur-md rounded-full px-4 py-2 flex items-center space-x-2">
          <span class="text-white">📧</span>
          <span class="text-white font-semibold">Boîte</span>
          <span class="bg-white text-pink-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">{{ stats.inbox }}</span>
        </div>
        <div class="bg-white bg-opacity-20 backdrop-blur-md rounded-full px-4 py-2 flex items-center space-x-2">
          <span class="text-white">❓</span>
          <span class="text-white font-semibold">À répondre</span>
          <span class="bg-white text-orange-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">{{ stats.toReply }}</span>
        </div>
        <div class="bg-white bg-opacity-20 backdrop-blur-md rounded-full px-4 py-2 flex items-center space-x-2">
          <span class="text-white">✉️</span>
          <span class="text-white font-semibold">Envoyés</span>
          <span class="bg-white text-pink-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">{{ stats.sent }}</span>
        </div>
      </div>
    </header>
    
    <!-- Demo mode alert -->
    <div class="px-4 mb-4">
      <div class="bg-yellow-100 bg-opacity-90 border border-yellow-300 rounded-lg p-3 flex items-center space-x-3">
        <span class="text-yellow-600">⚠️</span>
        <span class="text-yellow-800 text-sm">
          Mode démo (données intégrées). Renseignez BASE en haut du script avec l'URL de vos webhooks n8n pour passer en mode connecté.
        </span>
      </div>
    </div>
    
    <!-- Main content -->
    <main class="px-4 pb-20">
      <div v-if="isLoading" class="flex items-center justify-center h-96">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
      
      <div v-else>
        <transition name="fade" mode="out-in">
          <div v-if="currentMail" :key="currentMail.id" class="max-w-md mx-auto">
            <!-- Mail Card -->
            <div class="bg-white rounded-2xl p-6 card-shadow">
              <!-- Sender info -->
              <div class="flex items-center space-x-4 mb-4">
                <div class="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center text-white font-bold text-xl">
                  {{ currentMail.sender.initials }}
                </div>
                <div class="flex-1">
                  <h2 class="text-xl font-bold text-gray-900">{{ currentMail.sender.name }}</h2>
                  <p class="text-gray-600 text-sm">{{ currentMail.sender.email }}</p>
                  <p class="text-gray-400 text-xs">{{ formatDate(currentMail.date) }}</p>
                </div>
              </div>
              
              <!-- Category badge -->
              <div class="mb-4">
                <span :class="['px-3 py-1 rounded-full text-xs font-bold', getCategoryBadgeColor(currentMail.category)]">
                  {{ currentMail.category }}
                </span>
              </div>
              
              <!-- Mail content -->
              <div class="mb-6">
                <h3 class="text-lg font-bold text-gray-900 mb-2">{{ currentMail.subject }}</h3>
                <p class="text-gray-700 text-sm leading-relaxed">{{ currentMail.body }}</p>
              </div>
              
              <!-- Action hints -->
              <div class="flex justify-center space-x-8 text-gray-400 text-xs mb-4">
                <span>← lu</span>
                <span>↑ IA répond</span>
                <span>→ à répondre</span>
              </div>
            </div>
            
            <!-- Action buttons -->
            <div class="flex justify-center space-x-6 mt-6">
              <button
                @click="handleDelete"
                class="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg btn-hover"
              >
                <span class="text-3xl">❌</span>
              </button>
              <button
                @click="handleAIReply"
                class="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg btn-hover"
              >
                <span class="text-3xl">🤖</span>
              </button>
              <button
                @click="handleReply"
                class="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg btn-hover"
              >
                <span class="text-3xl">✉️</span>
              </button>
            </div>
            
            <!-- Navigation arrows -->
            <div class="flex justify-center space-x-8 mt-8">
              <button
                @click="goToPreviousMail"
                :disabled="currentMailIndex <= 0"
                class="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg disabled:opacity-50"
              >
                <span class="text-2xl">←</span>
              </button>
              <button
                @click="goToNextMail"
                :disabled="currentMailIndex >= mails.length - 1"
                class="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg disabled:opacity-50"
              >
                <span class="text-2xl">→</span>
              </button>
            </div>
          </div>
          <div v-else class="text-center text-white">
            <p class="text-xl">Aucun mail</p>
          </div>
        </transition>
      </div>
    </main>
    
    <!-- Footer -->
    <footer class="fixed bottom-0 left-0 right-0 bg-white bg-opacity-20 backdrop-blur-md p-4">
      <div class="text-center">
        <p class="text-white text-sm">
          Démo hackaton — n8n + Mistral · swipez, l'IA gère le reste
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
