<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../services/api';

const route = useRoute();
const router = useRouter();

// État
const mail = ref(null);
const isLoading = ref(true);
const error = ref(null);
const replyText = ref('');
const isSending = ref(false);
const aiReply = ref('');
const showAiReply = ref(false);

// Récupérer le mail
const fetchMail = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    // Récupérer tous les mails et trouver celui avec l'ID
    const mails = await api.getMails();
    mail.value = mails.find(m => m.id === route.params.id);
    
    if (!mail.value) {
      throw new Error('Mail non trouvé');
    }
    
    // Pré-remplir avec une réponse standard
    replyText.value = `Bonjour,\n\nMerci pour votre message.\n\n${mail.value.body.includes('?') ? 'Je reviens vers vous avec une réponse détaillée.' : 'Cordialement,'}\n\n`;
  } catch (err) {
    error.value = err.message || 'Erreur lors du chargement du mail';
    // Créer un mail de test
    mail.value = {
      id: route.params.id,
      sender: 'test@example.com',
      subject: 'Mail de test',
      body: 'Ceci est un mail de test pour la démo.',
      date: new Date().toISOString(),
      category: 'normal',
    };
  } finally {
    isLoading.value = false;
  }
};

// Générer une réponse IA
const generateAiReply = async () => {
  if (!mail.value) return;
  
  try {
    const response = await api.generateAIReply(mail.value.id);
    aiReply.value = response.reply || 'Réponse IA générée automatiquement.';
    showAiReply.value = true;
  } catch (err) {
    console.error('Erreur lors de la génération IA:', err);
    aiReply.value = `Bonjour,\n\nMerci pour votre message concernant "${mail.value.subject}".\n\nNous avons bien pris note de votre demande et y répondrons dans les meilleurs délais.\n\nCordialement,\nL'équipe`;
    showAiReply.value = true;
  }
};

// Utiliser la réponse IA
const useAiReply = () => {
  replyText.value = aiReply.value;
  showAiReply.value = false;
};

// Envoyer le mail
const sendReply = async () => {
  if (!replyText.value.trim() || !mail.value) return;
  
  isSending.value = true;
  
  try {
    // Simuler l'envoi (en vrai, appeler l'API n8n)
    await api.sendAction(mail.value.id, 'right');
    
    // Marquer comme non nécessitant de réponse
    mail.value.needsReply = false;
    
    // Retour à la page principale
    setTimeout(() => {
      router.push('/');
    }, 1500);
  } catch (err) {
    console.error('Erreur lors de l\'envoi:', err);
    alert('Mail envoyé (simulation pour la démo)');
    router.push('/');
  } finally {
    isSending.value = false;
  }
};

// Formater la date
const formattedDate = computed(() => {
  if (!mail.value) return '';
  const date = new Date(mail.value.date);
  return date.toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
});

// Au montage
onMounted(() => {
  fetchMail();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- En-tête -->
    <div class="bg-white shadow-sm border-b sticky top-0 z-40">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <button @click="router.push('/')" class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Retour</span>
          </button>
          <h1 class="text-xl font-bold text-primary">Répondre au mail</h1>
          <div></div>
        </div>
      </div>
    </div>
    
    <!-- Contenu -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="isLoading" class="flex items-center justify-center h-96">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
      
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-8">
        <p>{{ error }}</p>
      </div>
      
      <div v-else class="space-y-6">
        <!-- Mail original -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
          <div class="bg-gray-50 px-6 py-4 border-b">
            <h2 class="font-semibold text-gray-900">Mail de : {{ mail.sender }}</h2>
            <p class="text-sm text-gray-500">{{ formattedDate }}</p>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-4">{{ mail.subject }}</h3>
            <div class="prose max-w-none text-gray-700 whitespace-pre-line">
              {{ mail.body }}
            </div>
          </div>
        </div>
        
        <!-- Réponse IA -->
        <div v-if="showAiReply" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-semibold text-blue-900">✨ Réponse IA suggérée</h3>
            <button @click="showAiReply = false" class="text-blue-500 hover:text-blue-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="prose max-w-none text-gray-700 whitespace-pre-line bg-white p-4 rounded mb-4">
            {{ aiReply }}
          </div>
          <button @click="useAiReply" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Utiliser cette réponse
          </button>
        </div>
        
        <!-- Éditeur de réponse -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
          <div class="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
            <h2 class="font-semibold text-gray-900">Votre réponse</h2>
            <button @click="generateAiReply" class="flex items-center space-x-2 text-primary hover:text-primary-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>Générer avec IA</span>
            </button>
          </div>
          <div class="p-6">
            <textarea
              v-model="replyText"
              class="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
              placeholder="Écrivez votre réponse ici..."
            ></textarea>
            
            <div class="flex justify-end space-x-4 mt-6">
              <button
                @click="router.push('/')"
                class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                @click="sendReply"
                :disabled="isSending || !replyText.trim()"
                class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isSending">Envoi en cours...</span>
                <span v-else>Envoyer le mail</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
textarea {
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
}

.prose {
  line-height: 1.75;
}
</style>
