// Configuration de l'API pour n8n
const API_BASE_URL = 'https://werenn.app.n8n.cloud/webhook-test';

// Génération de mails de test (simulation de données pour la démo)
const generateTestMails = () => {
  const categories = ['important', 'normal', 'faible'];
  const importantSenders = [
    ' boss@entreprise.com',
    'maman@famille.fr',
    'papa@famille.fr',
    'client.principal@client.com',
    'directeur@societe.fr',
    'rh@entreprise.com'
  ];
  
  const normalSenders = [
    'collegue@entreprise.com',
    'ami@hotmail.com',
    'newsletter@technews.com',
    'support@service.com',
    'equipe@projet.fr',
    'john.doe@gmail.com'
  ];
  
  const faibleSenders = [
    'spam@publicite.com',
    'promo@boutique.fr',
    'marketing@societe.com',
    'no-reply@newsletter.com',
    'offre@demo.fr',
    'vendeur@produit.com'
  ];
  
  const subjects = [
    'Réunion importante demain',
    'Rapport trimestriel',
    'Invitation à déjeuner',
    'Nouvelles fonctionnalités',
    'Mise à jour de sécurité',
    'Offre exclusive',
    'Promotion du mois',
    'Votre compte',
    'Confirmation de commande',
    'Question technique',
    'Document à signer',
    'Demande de rendez-vous'
  ];
  
  const bodies = [
    'Bonjour, je vous contacte concernant le projet en cours...',
    'Ci-joint le document demandé hier.',
    'Nous vous proposons une offre exclusive valable 48h.',
    'Pourriez-vous confirmer votre disponibilité pour la réunion ?',
    'Votre commande n°12345 a été expédiée.',
    'Il est urgent de traiter ce dossier avant vendredi.',
    'N\'hésitez pas à me contacter pour toute question.',
    'Cordialement, l\'équipe support.',
    'Votre abonnement arrive à échéance dans 3 jours.',
    'Félicitations ! Vous avez gagné un bon de réduction.'
  ];
  
  const mails = [];
  
  // Générer 50 mails de test
  for (let i = 1; i <= 50; i++) {
    let category;
    const rand = Math.random();
    
    if (rand < 0.2) {
      category = 'important';
    } else if (rand < 0.7) {
      category = 'normal';
    } else {
      category = 'faible';
    }
    
    let sender;
    switch (category) {
      case 'important':
        sender = importantSenders[Math.floor(Math.random() * importantSenders.length)];
        break;
      case 'normal':
        sender = normalSenders[Math.floor(Math.random() * normalSenders.length)];
        break;
      case 'faible':
        sender = faibleSenders[Math.floor(Math.random() * faibleSenders.length)];
        break;
    }
    
    mails.push({
      id: i.toString(),
      sender: sender.trim(),
      subject: subjects[Math.floor(Math.random() * subjects.length)],
      body: bodies[Math.floor(Math.random() * bodies.length)],
      date: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      category: category,
      isRead: Math.random() < 0.3, // 30% de mails déjà lus
      needsReply: Math.random() < 0.4 // 40% de mails nécessitant une réponse
    });
  }
  
  // Trier par date (récent en premier)
  return mails.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Récupérer tous les mails
const getMails = async () => {
  try {
    // D'abord essayer l'API n8n
    const response = await fetch(`${API_BASE_URL}/mails`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    
    // Si l'API échoue, utiliser les données de test
    console.warn('Impossible de récupérer les mails depuis n8n, utilisation des données de test');
    return generateTestMails();
  } catch (error) {
    console.error('Erreur lors de la récupération des mails:', error);
    return generateTestMails();
  }
};

// Récupérer les mails nécessitant une réponse
const getMailsNeedingReply = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/needs_reply`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    
    // Filtrer les mails de test
    const mails = generateTestMails();
    return mails.filter(mail => mail.needsReply);
  } catch (error) {
    console.error('Erreur:', error);
    const mails = generateTestMails();
    return mails.filter(mail => mail.needsReply);
  }
};

// Envoyer une action (swipe)
const sendAction = async (mailId, action) => {
  try {
    const response = await fetch(`${API_BASE_URL}/action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: mailId,
        action: action,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'action:', error);
    // Simuler le succès pour la démo
    return { success: true, message: `Action ${action} appliquée au mail ${mailId}` };
  }
};

// Classer un mail dans une catégorie
const classifyMail = async (mailId, category) => {
  try {
    const response = await fetch(`${API_BASE_URL}/action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: mailId,
        action: 'classify',
        category: category,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors du classement:', error);
    return { success: true, message: `Mail ${mailId} classé comme ${category}` };
  }
};

// Générer une réponse IA
const generateAIReply = async (mailId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: mailId,
        action: 'up', // L'action up déclenche la réponse IA
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la génération de la réponse IA:', error);
    // Réponse simulée pour la démo
    return {
      success: true,
      reply: `Bonjour,\n\nMerci pour votre message. Je reviens vers vous rapidement avec une réponse détaillée.\n\nCordialement,\nL'équipe`
    };
  }
};

export default {
  getMails,
  getMailsNeedingReply,
  sendAction,
  classifyMail,
  generateAIReply,
  generateTestMails,
};
