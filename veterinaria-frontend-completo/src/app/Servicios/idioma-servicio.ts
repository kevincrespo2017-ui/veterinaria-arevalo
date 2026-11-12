import { Injectable, OnDestroy } from '@angular/core';

export type IdiomaPagina = 'es' | 'en' | 'fr' | 'pt';

// Diccionario de textos de interfaz. Los registros de usuarios y datos del negocio
// no se envían a terceros para traducirlos.
const TRADUCCIONES: Record<string, Record<'en' | 'fr' | 'pt', string>> = {
  "Sistema Veterinario": {
    "en": "Veterinary Management System",
    "fr": "Système de gestion vétérinaire",
    "pt": "Sistema de Gestão Veterinária"
  },
  "CUIDAMOS A QUIENES MÁS AMAS": {
    "en": "WE CARE FOR THOSE YOU LOVE MOST",
    "fr": "NOUS PRENONS SOIN DE CEUX QUE VOUS AIMEZ",
    "pt": "CUIDAMOS DE QUEM VOCÊ MAIS AMA"
  },
  "Su bienestar es": {
    "en": "Their well-being is",
    "fr": "Leur bien-être est",
    "pt": "O bem-estar deles é"
  },
  "nuestra prioridad.": {
    "en": "our priority.",
    "fr": "notre priorité.",
    "pt": "nossa prioridade."
  },
  "Gestiona a tus mascotas, organiza sus citas y acompaña su salud desde un solo lugar.": {
    "en": "Manage your pets, schedule appointments and monitor their health in one place.",
    "fr": "Gérez vos animaux, prenez rendez-vous et suivez leur santé au même endroit.",
    "pt": "Gerencie seus animais, agende consultas e acompanhe sua saúde em um só lugar."
  },
  "Atención veterinaria cercana": {
    "en": "Care from local veterinarians",
    "fr": "Des soins vétérinaires de proximité",
    "pt": "Atendimento veterinário próximo"
  },
  "Historial de cuidados organizado": {
    "en": "Organized medical history",
    "fr": "Historique des soins organisé",
    "pt": "Histórico de cuidados organizado"
  },
  "Gestión sencilla de tus citas": {
    "en": "Easy appointment management",
    "fr": "Gestion facile de vos rendez-vous",
    "pt": "Gestão simples das suas consultas"
  },
  "🐾 Más que mascotas, son familia": {
    "en": "🐾 More than pets, they're family",
    "fr": "🐾 Bien plus que des animaux, ils font partie de la famille",
    "pt": "🐾 Mais que animais, são família"
  },
  "Bienvenido de nuevo": {
    "en": "Welcome back",
    "fr": "Bon retour",
    "pt": "Bem-vindo de volta"
  },
  "Inicia sesión para continuar cuidando a quienes más quieres.": {
    "en": "Sign in to keep caring for those you love.",
    "fr": "Connectez-vous pour continuer à prendre soin de ceux que vous aimez.",
    "pt": "Entre para continuar cuidando de quem você mais ama."
  },
  "Correo electrónico": {
    "en": "Email address",
    "fr": "Adresse e-mail",
    "pt": "Endereço de e-mail"
  },
  "Correo": {
    "en": "Email",
    "fr": "E-mail",
    "pt": "E-mail"
  },
  "Contraseña": {
    "en": "Password",
    "fr": "Mot de passe",
    "pt": "Senha"
  },
  "Iniciar sesión": {
    "en": "Sign in",
    "fr": "Se connecter",
    "pt": "Entrar"
  },
  "Ingresando...": {
    "en": "Signing in...",
    "fr": "Connexion...",
    "pt": "Entrando..."
  },
  "¿Olvidaste tu contraseña?": {
    "en": "Forgot your password?",
    "fr": "Mot de passe oublié ?",
    "pt": "Esqueceu sua senha?"
  },
  "¿No tienes una cuenta?": {
    "en": "Don't have an account?",
    "fr": "Vous n'avez pas de compte ?",
    "pt": "Não tem uma conta?"
  },
  "Regístrate aquí": {
    "en": "Sign up here",
    "fr": "Inscrivez-vous ici",
    "pt": "Cadastre-se aqui"
  },
  "Ingresa tu contraseña": {
    "en": "Enter your password",
    "fr": "Saisissez votre mot de passe",
    "pt": "Digite sua senha"
  },
  "Ingresa un correo válido.": {
    "en": "Enter a valid email address.",
    "fr": "Saisissez une adresse e-mail valide.",
    "pt": "Digite um endereço de e-mail válido."
  },
  "El correo electrónico es obligatorio.": {
    "en": "Email is required.",
    "fr": "L'adresse e-mail est obligatoire.",
    "pt": "O e-mail é obrigatório."
  },
  "La contraseña es obligatoria.": {
    "en": "Password is required.",
    "fr": "Le mot de passe est obligatoire.",
    "pt": "A senha é obrigatória."
  },
  "Mostrar contraseña": {
    "en": "Show password",
    "fr": "Afficher le mot de passe",
    "pt": "Mostrar senha"
  },
  "Ocultar contraseña": {
    "en": "Hide password",
    "fr": "Masquer le mot de passe",
    "pt": "Ocultar senha"
  },
  "FORMA PARTE DE NUESTRA FAMILIA": {
    "en": "BECOME PART OF OUR FAMILY",
    "fr": "REJOIGNEZ NOTRE FAMILLE",
    "pt": "FAÇA PARTE DA NOSSA FAMÍLIA"
  },
  "Cuidemos juntos a": {
    "en": "Let's care together for",
    "fr": "Prenons soin ensemble de",
    "pt": "Vamos cuidar juntos dos"
  },
  "tus mejores amigos.": {
    "en": "your best friends.",
    "fr": "vos meilleurs amis.",
    "pt": "seus melhores amigos."
  },
  "Crea tu cuenta para registrar mascotas, organizar citas y consultar nuestros servicios.": {
    "en": "Create your account to register pets, schedule appointments and view services.",
    "fr": "Créez votre compte pour enregistrer vos animaux, prendre rendez-vous et consulter nos services.",
    "pt": "Crie sua conta para cadastrar animais, agendar consultas e consultar nossos serviços."
  },
  "Crear una cuenta": {
    "en": "Create an account",
    "fr": "Créer un compte",
    "pt": "Criar uma conta"
  },
  "Completa tus datos para registrarte en Veterinaria Arévalo.": {
    "en": "Enter your details to sign up for Veterinaria Arévalo.",
    "fr": "Complétez vos informations pour vous inscrire à Veterinaria Arévalo.",
    "pt": "Preencha seus dados para se cadastrar na Veterinaria Arévalo."
  },
  "Nombre completo": {
    "en": "Full name",
    "fr": "Nom complet",
    "pt": "Nome completo"
  },
  "Confirmar contraseña": {
    "en": "Confirm password",
    "fr": "Confirmer le mot de passe",
    "pt": "Confirmar senha"
  },
  "Repite tu contraseña": {
    "en": "Repeat your password",
    "fr": "Répétez votre mot de passe",
    "pt": "Repita sua senha"
  },
  "Registrar cuenta": {
    "en": "Register account",
    "fr": "Créer le compte",
    "pt": "Cadastrar conta"
  },
  "Crear cuenta": {
    "en": "Create account",
    "fr": "Créer un compte",
    "pt": "Criar conta"
  },
  "Verifica tu correo": {
    "en": "Verify your email",
    "fr": "Vérifiez votre e-mail",
    "pt": "Verifique seu e-mail"
  },
  "Introduce el código de 4 dígitos enviado a tu correo electrónico.": {
    "en": "Enter the 4-digit code sent to your email.",
    "fr": "Saisissez le code à 4 chiffres envoyé à votre e-mail.",
    "pt": "Digite o código de 4 dígitos enviado ao seu e-mail."
  },
  "Código de verificación": {
    "en": "Verification code",
    "fr": "Code de vérification",
    "pt": "Código de verificação"
  },
  "Verificar mi cuenta": {
    "en": "Verify my account",
    "fr": "Vérifier mon compte",
    "pt": "Verificar minha conta"
  },
  "Verificando...": {
    "en": "Verifying...",
    "fr": "Vérification...",
    "pt": "Verificando..."
  },
  "↻ Reenviar código al correo": {
    "en": "↻ Resend code by email",
    "fr": "↻ Renvoyer le code par e-mail",
    "pt": "↻ Reenviar código por e-mail"
  },
  "Enviando nuevo código...": {
    "en": "Sending a new code...",
    "fr": "Envoi d'un nouveau code...",
    "pt": "Enviando novo código..."
  },
  "← Volver al registro": {
    "en": "← Back to registration",
    "fr": "← Retour à l'inscription",
    "pt": "← Voltar ao cadastro"
  },
  "Ir al login →": {
    "en": "Go to login →",
    "fr": "Aller à la connexion →",
    "pt": "Ir para login →"
  },
  "Revisa tu correo": {
    "en": "Check your email",
    "fr": "Vérifiez votre e-mail",
    "pt": "Verifique seu e-mail"
  },
  "Espera la aprobación": {
    "en": "Wait for approval",
    "fr": "Attendez l'approbation",
    "pt": "Aguarde a aprovação"
  },
  "El administrador revisará tu cuenta.": {
    "en": "An administrator will review your account.",
    "fr": "Un administrateur examinera votre compte.",
    "pt": "O administrador analisará sua conta."
  },
  "Crea tu cuenta": {
    "en": "Create your account",
    "fr": "Créez votre compte",
    "pt": "Crie sua conta"
  },
  "Completa tus datos personales.": {
    "en": "Enter your personal details.",
    "fr": "Renseignez vos coordonnées.",
    "pt": "Preencha seus dados pessoais."
  },
  "Ingresa el código recibido.": {
    "en": "Enter the received code.",
    "fr": "Saisissez le code reçu.",
    "pt": "Digite o código recebido."
  },
  "Recuperar contraseña": {
    "en": "Reset password",
    "fr": "Réinitialiser le mot de passe",
    "pt": "Recuperar senha"
  },
  "Crear una contraseña nueva": {
    "en": "Create a new password",
    "fr": "Créer un nouveau mot de passe",
    "pt": "Criar uma nova senha"
  },
  "SEGURIDAD DE TU CUENTA": {
    "en": "ACCOUNT SECURITY",
    "fr": "SÉCURITÉ DU COMPTE",
    "pt": "SEGURANÇA DA CONTA"
  },
  "Escribe el correo asociado a tu cuenta. Te enviaremos un código temporal para verificar tu identidad.": {
    "en": "Enter the email linked to your account. We'll send a temporary verification code.",
    "fr": "Saisissez l'e-mail lié à votre compte. Nous vous enverrons un code temporaire.",
    "pt": "Digite o e-mail associado à sua conta. Enviaremos um código temporário."
  },
  "Código de seis dígitos": {
    "en": "Six-digit code",
    "fr": "Code à six chiffres",
    "pt": "Código de seis dígitos"
  },
  "Nueva contraseña": {
    "en": "New password",
    "fr": "Nouveau mot de passe",
    "pt": "Nova senha"
  },
  "Confirmar nueva contraseña": {
    "en": "Confirm new password",
    "fr": "Confirmer le nouveau mot de passe",
    "pt": "Confirmar nova senha"
  },
  "Mínimo 8 caracteres": {
    "en": "At least 8 characters",
    "fr": "8 caractères minimum",
    "pt": "Mínimo de 8 caracteres"
  },
  "Repite la contraseña": {
    "en": "Repeat the password",
    "fr": "Répétez le mot de passe",
    "pt": "Repita a senha"
  },
  "Guardar nueva contraseña": {
    "en": "Save new password",
    "fr": "Enregistrer le nouveau mot de passe",
    "pt": "Salvar nova senha"
  },
  "Actualizando contraseña...": {
    "en": "Updating password...",
    "fr": "Mise à jour du mot de passe...",
    "pt": "Atualizando senha..."
  },
  "Enviar código de recuperación": {
    "en": "Send recovery code",
    "fr": "Envoyer le code de récupération",
    "pt": "Enviar código de recuperação"
  },
  "Enviando solicitud...": {
    "en": "Sending request...",
    "fr": "Envoi de la demande...",
    "pt": "Enviando solicitação..."
  },
  "↻ Reenviar código": {
    "en": "↻ Resend code",
    "fr": "↻ Renvoyer le code",
    "pt": "↻ Reenviar código"
  },
  "Cambiar correo electrónico": {
    "en": "Change email address",
    "fr": "Changer d'adresse e-mail",
    "pt": "Alterar endereço de e-mail"
  },
  "← Volver al inicio de sesión": {
    "en": "← Back to sign in",
    "fr": "← Retour à la connexion",
    "pt": "← Voltar para o login"
  },
  "Mostrar contraseña nueva": {
    "en": "Show new password",
    "fr": "Afficher le nouveau mot de passe",
    "pt": "Mostrar nova senha"
  },
  "Ocultar contraseña nueva": {
    "en": "Hide new password",
    "fr": "Masquer le nouveau mot de passe",
    "pt": "Ocultar nova senha"
  },
  "Mostrar confirmación de contraseña": {
    "en": "Show password confirmation",
    "fr": "Afficher la confirmation du mot de passe",
    "pt": "Mostrar confirmação da senha"
  },
  "Ocultar confirmación de contraseña": {
    "en": "Hide password confirmation",
    "fr": "Masquer la confirmation du mot de passe",
    "pt": "Ocultar confirmação da senha"
  },
  "Las contraseñas no coinciden.": {
    "en": "Passwords do not match.",
    "fr": "Les mots de passe ne correspondent pas.",
    "pt": "As senhas não coincidem."
  },
  "El correo es obligatorio.": {
    "en": "Email is required.",
    "fr": "L'e-mail est obligatoire.",
    "pt": "O e-mail é obrigatório."
  },
  "Vuelve a intentarlo": {
    "en": "Try again",
    "fr": "Réessayer",
    "pt": "Tente novamente"
  },
  "Reintentar": {
    "en": "Retry",
    "fr": "Réessayer",
    "pt": "Tentar novamente"
  },
  "PANEL ADMINISTRATIVO": {
    "en": "ADMINISTRATION DASHBOARD",
    "fr": "TABLEAU DE BORD ADMINISTRATEUR",
    "pt": "PAINEL ADMINISTRATIVO"
  },
  "MENÚ PRINCIPAL": {
    "en": "MAIN MENU",
    "fr": "MENU PRINCIPAL",
    "pt": "MENU PRINCIPAL"
  },
  "Cerrar sesión": {
    "en": "Log out",
    "fr": "Se déconnecter",
    "pt": "Sair"
  },
  "Inicio": {
    "en": "Home",
    "fr": "Accueil",
    "pt": "Início"
  },
  "Usuarios": {
    "en": "Users",
    "fr": "Utilisateurs",
    "pt": "Usuários"
  },
  "Mascotas": {
    "en": "Pets",
    "fr": "Animaux",
    "pt": "Animais"
  },
  "Citas": {
    "en": "Appointments",
    "fr": "Rendez-vous",
    "pt": "Consultas"
  },
  "Atenciones Médicas": {
    "en": "Medical appointments",
    "fr": "Consultations médicales",
    "pt": "Atendimentos médicos"
  },
  "Servicios": {
    "en": "Services",
    "fr": "Services",
    "pt": "Serviços"
  },
  "Veterinarios": {
    "en": "Veterinarians",
    "fr": "Vétérinaires",
    "pt": "Veterinários"
  },
  "Medicamentos": {
    "en": "Medications",
    "fr": "Médicaments",
    "pt": "Medicamentos"
  },
  "Facturas": {
    "en": "Invoices",
    "fr": "Factures",
    "pt": "Faturas"
  },
  "Administrador": {
    "en": "Administrator",
    "fr": "Administrateur",
    "pt": "Administrador"
  },
  "Veterinario": {
    "en": "Veterinarian",
    "fr": "Vétérinaire",
    "pt": "Veterinário"
  },
  "Mi cuenta": {
    "en": "My account",
    "fr": "Mon compte",
    "pt": "Minha conta"
  },
  "Panel de administración": {
    "en": "Administration dashboard",
    "fr": "Tableau de bord administrateur",
    "pt": "Painel de administração"
  },
  "Espacio profesional": {
    "en": "Professional area",
    "fr": "Espace professionnel",
    "pt": "Espaço profissional"
  },
  "Mi espacio personal": {
    "en": "My personal space",
    "fr": "Mon espace personnel",
    "pt": "Meu espaço pessoal"
  },
  "Mis Mascotas": {
    "en": "My Pets",
    "fr": "Mes animaux",
    "pt": "Meus Animais"
  },
  "Mis Citas": {
    "en": "My Appointments",
    "fr": "Mes rendez-vous",
    "pt": "Minhas Consultas"
  },
  "Mis Atenciones": {
    "en": "My Medical Records",
    "fr": "Mes soins",
    "pt": "Meus Atendimentos"
  },
  "Mis Atenciones Médicas": {
    "en": "My Medical Visits",
    "fr": "Mes consultations médicales",
    "pt": "Meus Atendimentos Médicos"
  },
  "Mis Facturas": {
    "en": "My Invoices",
    "fr": "Mes factures",
    "pt": "Minhas Faturas"
  },
  "Medicamentos disponibles": {
    "en": "Available medications",
    "fr": "Médicaments disponibles",
    "pt": "Medicamentos disponíveis"
  },
  "Medicamentos de la atención": {
    "en": "Medications used in care",
    "fr": "Médicaments utilisés",
    "pt": "Medicamentos do atendimento"
  },
  "Cerrar": {
    "en": "Close",
    "fr": "Fermer",
    "pt": "Fechar"
  },
  "Notificaciones": {
    "en": "Notifications",
    "fr": "Notifications",
    "pt": "Notificações"
  },
  "Accesibilidad": {
    "en": "Accessibility",
    "fr": "Accessibilité",
    "pt": "Acessibilidade"
  },
  "Personaliza tu experiencia.": {
    "en": "Customize your experience.",
    "fr": "Personnalisez votre expérience.",
    "pt": "Personalize sua experiência."
  },
  "Apariencia y contraste": {
    "en": "Appearance and contrast",
    "fr": "Apparence et contraste",
    "pt": "Aparência e contraste"
  },
  "Selecciona el modo visual más cómodo.": {
    "en": "Choose the most comfortable display mode.",
    "fr": "Choisissez le mode d'affichage le plus confortable.",
    "pt": "Escolha o modo visual mais confortável."
  },
  "Tamaño de visualización": {
    "en": "Display size",
    "fr": "Taille d'affichage",
    "pt": "Tamanho da visualização"
  },
  "Lectura y sonido": {
    "en": "Reading and sound",
    "fr": "Lecture et son",
    "pt": "Leitura e som"
  },
  "Navegación hablada": {
    "en": "Spoken navigation",
    "fr": "Navigation vocale",
    "pt": "Navegação por voz"
  },
  "Volumen de voz": {
    "en": "Voice volume",
    "fr": "Volume de la voix",
    "pt": "Volume de voz"
  },
  "Velocidad de lectura": {
    "en": "Reading speed",
    "fr": "Vitesse de lecture",
    "pt": "Velocidade de leitura"
  },
  "Restablecer preferencias": {
    "en": "Reset preferences",
    "fr": "Réinitialiser les préférences",
    "pt": "Restaurar preferências"
  },
  "Idioma de la página": {
    "en": "Website language",
    "fr": "Langue du site",
    "pt": "Idioma da página"
  },
  "Selecciona el idioma de los menús y textos de la interfaz.": {
    "en": "Choose the language for menus and interface text.",
    "fr": "Choisissez la langue des menus et de l'interface.",
    "pt": "Escolha o idioma dos menus e textos da interface."
  },
  "Administración de Medicamentos 💊": {
    "en": "Medication Management 💊",
    "fr": "Gestion des médicaments 💊",
    "pt": "Administração de Medicamentos 💊"
  },
  "Gestiona el catálogo, los precios y las existencias de medicamentos de la veterinaria.": {
    "en": "Manage the clinic's medication catalog, prices and inventory.",
    "fr": "Gérez le catalogue, les prix et les stocks de médicaments de la clinique.",
    "pt": "Gerencie o catálogo, os preços e os estoques de medicamentos da clínica."
  },
  "+ Nuevo medicamento": {
    "en": "+ New medication",
    "fr": "+ Nouveau médicament",
    "pt": "+ Novo medicamento"
  },
  "↻ Actualizar": {
    "en": "↻ Refresh",
    "fr": "↻ Actualiser",
    "pt": "↻ Atualizar"
  },
  "⬇ Exportar CSV": {
    "en": "⬇ Export CSV",
    "fr": "⬇ Exporter CSV",
    "pt": "⬇ Exportar CSV"
  },
  "⬇ Exportar PDF": {
    "en": "⬇ Export PDF",
    "fr": "⬇ Exporter PDF",
    "pt": "⬇ Exportar PDF"
  },
  "Generando CSV...": {
    "en": "Generating CSV...",
    "fr": "Génération du CSV...",
    "pt": "Gerando CSV..."
  },
  "Generando PDF...": {
    "en": "Generating PDF...",
    "fr": "Génération du PDF...",
    "pt": "Gerando PDF..."
  },
  "Total de medicamentos": {
    "en": "Total medications",
    "fr": "Total des médicaments",
    "pt": "Total de medicamentos"
  },
  "Medicamentos activos": {
    "en": "Active medications",
    "fr": "Médicaments actifs",
    "pt": "Medicamentos ativos"
  },
  "Medicamentos inactivos": {
    "en": "Inactive medications",
    "fr": "Médicaments inactifs",
    "pt": "Medicamentos inativos"
  },
  "Medicamentos agotados": {
    "en": "Out-of-stock medications",
    "fr": "Médicaments en rupture de stock",
    "pt": "Medicamentos esgotados"
  },
  "Medicamentos con stock": {
    "en": "Medications in stock",
    "fr": "Médicaments en stock",
    "pt": "Medicamentos em estoque"
  },
  "Nombre": {
    "en": "Name",
    "fr": "Nom",
    "pt": "Nome"
  },
  "Descripción": {
    "en": "Description",
    "fr": "Description",
    "pt": "Descrição"
  },
  "Presentación": {
    "en": "Presentation",
    "fr": "Présentation",
    "pt": "Apresentação"
  },
  "Concentración": {
    "en": "Concentration",
    "fr": "Concentration",
    "pt": "Concentração"
  },
  "Precio unitario": {
    "en": "Unit price",
    "fr": "Prix unitaire",
    "pt": "Preço unitário"
  },
  "Stock disponible": {
    "en": "Available stock",
    "fr": "Stock disponible",
    "pt": "Estoque disponível"
  },
  "Stock": {
    "en": "Stock",
    "fr": "Stock",
    "pt": "Estoque"
  },
  "Estado": {
    "en": "Status",
    "fr": "Statut",
    "pt": "Status"
  },
  "Unidad de medida": {
    "en": "Unit of measure",
    "fr": "Unité de mesure",
    "pt": "Unidade de medida"
  },
  "Activo": {
    "en": "Active",
    "fr": "Actif",
    "pt": "Ativo"
  },
  "Inactivo": {
    "en": "Inactive",
    "fr": "Inactif",
    "pt": "Inativo"
  },
  "Activos": {
    "en": "Active",
    "fr": "Actifs",
    "pt": "Ativos"
  },
  "Inactivos": {
    "en": "Inactive",
    "fr": "Inactifs",
    "pt": "Inativos"
  },
  "Todos": {
    "en": "All",
    "fr": "Tous",
    "pt": "Todos"
  },
  "Todas": {
    "en": "All",
    "fr": "Toutes",
    "pt": "Todas"
  },
  "Todos los estados": {
    "en": "All statuses",
    "fr": "Tous les statuts",
    "pt": "Todos os status"
  },
  "Filtrar por estado": {
    "en": "Filter by status",
    "fr": "Filtrer par statut",
    "pt": "Filtrar por status"
  },
  "Buscar medicamento": {
    "en": "Search medication",
    "fr": "Rechercher un médicament",
    "pt": "Buscar medicamento"
  },
  "Buscar": {
    "en": "Search",
    "fr": "Rechercher",
    "pt": "Buscar"
  },
  "Limpiar filtros": {
    "en": "Clear filters",
    "fr": "Effacer les filtres",
    "pt": "Limpar filtros"
  },
  "Ordenar por": {
    "en": "Sort by",
    "fr": "Trier par",
    "pt": "Ordenar por"
  },
  "Nombre (A-Z)": {
    "en": "Name (A-Z)",
    "fr": "Nom (A-Z)",
    "pt": "Nome (A-Z)"
  },
  "Nombre (Z-A)": {
    "en": "Name (Z-A)",
    "fr": "Nom (Z-A)",
    "pt": "Nome (Z-A)"
  },
  "Menor precio": {
    "en": "Lowest price",
    "fr": "Prix le plus bas",
    "pt": "Menor preço"
  },
  "Mayor precio": {
    "en": "Highest price",
    "fr": "Prix le plus élevé",
    "pt": "Maior preço"
  },
  "Menor stock": {
    "en": "Lowest stock",
    "fr": "Stock le plus bas",
    "pt": "Menor estoque"
  },
  "Mayor stock": {
    "en": "Highest stock",
    "fr": "Stock le plus élevé",
    "pt": "Maior estoque"
  },
  "Editar": {
    "en": "Edit",
    "fr": "Modifier",
    "pt": "Editar"
  },
  "Eliminar": {
    "en": "Delete",
    "fr": "Supprimer",
    "pt": "Excluir"
  },
  "Guardar": {
    "en": "Save",
    "fr": "Enregistrer",
    "pt": "Salvar"
  },
  "Actualizar": {
    "en": "Update",
    "fr": "Mettre à jour",
    "pt": "Atualizar"
  },
  "Cancelar": {
    "en": "Cancel",
    "fr": "Annuler",
    "pt": "Cancelar"
  },
  "Confirmar": {
    "en": "Confirm",
    "fr": "Confirmer",
    "pt": "Confirmar"
  },
  "Confirmadas": {
    "en": "Confirmed",
    "fr": "Confirmés",
    "pt": "Confirmadas"
  },
  "Pendientes": {
    "en": "Pending",
    "fr": "En attente",
    "pt": "Pendentes"
  },
  "Completadas": {
    "en": "Completed",
    "fr": "Terminés",
    "pt": "Concluídas"
  },
  "Canceladas": {
    "en": "Cancelled",
    "fr": "Annulés",
    "pt": "Canceladas"
  },
  "Fecha": {
    "en": "Date",
    "fr": "Date",
    "pt": "Data"
  },
  "Fecha desde": {
    "en": "Date from",
    "fr": "Date de début",
    "pt": "Data inicial"
  },
  "Fecha hasta": {
    "en": "Date to",
    "fr": "Date de fin",
    "pt": "Data final"
  },
  "Especialidad": {
    "en": "Specialty",
    "fr": "Spécialité",
    "pt": "Especialidade"
  },
  "Teléfono": {
    "en": "Phone",
    "fr": "Téléphone",
    "pt": "Telefone"
  },
  "Cédula": {
    "en": "ID number",
    "fr": "Numéro d'identité",
    "pt": "Número de identidade"
  },
  "Dirección": {
    "en": "Address",
    "fr": "Adresse",
    "pt": "Endereço"
  },
  "Propietario": {
    "en": "Owner",
    "fr": "Propriétaire",
    "pt": "Proprietário"
  },
  "Especie": {
    "en": "Species",
    "fr": "Espèce",
    "pt": "Espécie"
  },
  "Raza": {
    "en": "Breed",
    "fr": "Race",
    "pt": "Raça"
  },
  "Sexo": {
    "en": "Sex",
    "fr": "Sexe",
    "pt": "Sexo"
  },
  "Edad": {
    "en": "Age",
    "fr": "Âge",
    "pt": "Idade"
  },
  "Servicio": {
    "en": "Service",
    "fr": "Service",
    "pt": "Serviço"
  },
  "Cliente": {
    "en": "Client",
    "fr": "Client",
    "pt": "Cliente"
  },
  "Observaciones": {
    "en": "Notes",
    "fr": "Observations",
    "pt": "Observações"
  },
  "Diagnóstico": {
    "en": "Diagnosis",
    "fr": "Diagnostic",
    "pt": "Diagnóstico"
  },
  "Tratamiento": {
    "en": "Treatment",
    "fr": "Traitement",
    "pt": "Tratamento"
  },
  "Motivo de la cita": {
    "en": "Appointment reason",
    "fr": "Motif de la consultation",
    "pt": "Motivo da consulta"
  },
  "Fecha y hora": {
    "en": "Date and time",
    "fr": "Date et heure",
    "pt": "Data e hora"
  },
  "Total": {
    "en": "Total",
    "fr": "Total",
    "pt": "Total"
  },
  "Subtotal": {
    "en": "Subtotal",
    "fr": "Sous-total",
    "pt": "Subtotal"
  },
  "Impuestos registrados": {
    "en": "Recorded taxes",
    "fr": "Taxes enregistrées",
    "pt": "Impostos registrados"
  },
  "Administración de Veterinarios": {
    "en": "Veterinarian management",
    "fr": "Gestion des vétérinaires",
    "pt": "Administração de veterinários"
  },
  "Veterinarios 👨‍⚕️": {
    "en": "Veterinarians 👨‍⚕️",
    "fr": "Vétérinaires 👨‍⚕️",
    "pt": "Veterinários 👨‍⚕️"
  },
  "NUESTRO EQUIPO": {
    "en": "OUR TEAM",
    "fr": "NOTRE ÉQUIPE",
    "pt": "NOSSA EQUIPE"
  },
  "Conoce a los profesionales veterinarios registrados en nuestra clínica.": {
    "en": "Meet our clinic's registered veterinarians.",
    "fr": "Découvrez les vétérinaires de notre clinique.",
    "pt": "Conheça os veterinários registrados na clínica."
  },
  "Equipo veterinario": {
    "en": "Veterinary team",
    "fr": "Équipe vétérinaire",
    "pt": "Equipe veterinária"
  },
  "Profesionales registrados": {
    "en": "Registered professionals",
    "fr": "Professionnels inscrits",
    "pt": "Profissionais cadastrados"
  },
  "Consulta su información y especialidad.": {
    "en": "View their information and specialty.",
    "fr": "Consultez leurs informations et leur spécialité.",
    "pt": "Consulte suas informações e especialidade."
  },
  "📅 Agendar cita": {
    "en": "📅 Book appointment",
    "fr": "📅 Prendre rendez-vous",
    "pt": "📅 Agendar consulta"
  },
  "← Volver al panel": {
    "en": "← Back to dashboard",
    "fr": "← Retour au tableau de bord",
    "pt": "← Voltar ao painel"
  },
  "Accesos rápidos": {
    "en": "Quick access",
    "fr": "Accès rapide",
    "pt": "Acessos rápidos"
  },
  "🏠 Inicio": {
    "en": "🏠 Home",
    "fr": "🏠 Accueil",
    "pt": "🏠 Início"
  },
  "🐾 Mis Mascotas": {
    "en": "🐾 My Pets",
    "fr": "🐾 Mes animaux",
    "pt": "🐾 Meus Animais"
  },
  "📅 Mis Citas": {
    "en": "📅 My Appointments",
    "fr": "📅 Mes rendez-vous",
    "pt": "📅 Minhas Consultas"
  },
  "🩺 Mis Atenciones": {
    "en": "🩺 My Medical Visits",
    "fr": "🩺 Mes consultations",
    "pt": "🩺 Meus Atendimentos"
  },
  "🧾 Mis Facturas": {
    "en": "🧾 My Invoices",
    "fr": "🧾 Mes factures",
    "pt": "🧾 Minhas Faturas"
  },
  "💚 Servicios": {
    "en": "💚 Services",
    "fr": "💚 Services",
    "pt": "💚 Serviços"
  },
  "👥 Usuarios": {
    "en": "👥 Users",
    "fr": "👥 Utilisateurs",
    "pt": "👥 Usuários"
  },
  "🐾 Mascotas": {
    "en": "🐾 Pets",
    "fr": "🐾 Animaux",
    "pt": "🐾 Animais"
  },
  "📅 Citas": {
    "en": "📅 Appointments",
    "fr": "📅 Rendez-vous",
    "pt": "📅 Consultas"
  },
  "🩺 Atenciones": {
    "en": "🩺 Care",
    "fr": "🩺 Soins",
    "pt": "🩺 Atendimentos"
  },
  "💊 Medicamentos": {
    "en": "💊 Medications",
    "fr": "💊 Médicaments",
    "pt": "💊 Medicamentos"
  },
  "🧾 Facturas": {
    "en": "🧾 Invoices",
    "fr": "🧾 Factures",
    "pt": "🧾 Faturas"
  },
  "👨‍⚕️ Veterinarios": {
    "en": "👨‍⚕️ Veterinarians",
    "fr": "👨‍⚕️ Vétérinaires",
    "pt": "👨‍⚕️ Veterinários"
  },
  "Sin resultados": {
    "en": "No results",
    "fr": "Aucun résultat",
    "pt": "Sem resultados"
  },
  "SIN RESULTADOS": {
    "en": "NO RESULTS",
    "fr": "AUCUN RÉSULTAT",
    "pt": "SEM RESULTADOS"
  },
  "Cargando...": {
    "en": "Loading...",
    "fr": "Chargement...",
    "pt": "Carregando..."
  },
  "Guardando...": {
    "en": "Saving...",
    "fr": "Enregistrement...",
    "pt": "Salvando..."
  },
  "Actualizando...": {
    "en": "Updating...",
    "fr": "Mise à jour...",
    "pt": "Atualizando..."
  },
  "Consultando...": {
    "en": "Loading...",
    "fr": "Chargement...",
    "pt": "Consultando..."
  },
  "Datos actualizados correctamente.": {
    "en": "Data updated successfully.",
    "fr": "Données mises à jour.",
    "pt": "Dados atualizados com sucesso."
  },
  "Ayuda de Veterinaria Arévalo": {
    "en": "Veterinaria Arévalo Help",
    "fr": "Aide Veterinaria Arévalo",
    "pt": "Ajuda da Veterinaria Arévalo"
  },
  "Asistente virtual con IA": {
    "en": "AI virtual assistant",
    "fr": "Assistant virtuel IA",
    "pt": "Assistente virtual com IA"
  },
  "Asistente IA": {
    "en": "AI Assistant",
    "fr": "Assistant IA",
    "pt": "Assistente IA"
  },
  "Cerrar ayuda": {
    "en": "Close help",
    "fr": "Fermer l'aide",
    "pt": "Fechar ajuda"
  },
  "Asistente": {
    "en": "Assistant",
    "fr": "Assistant",
    "pt": "Assistente"
  },
  "Tú": {
    "en": "You",
    "fr": "Vous",
    "pt": "Você"
  },
  "Escribe tu pregunta": {
    "en": "Type your question",
    "fr": "Écrivez votre question",
    "pt": "Escreva sua pergunta"
  },
  "¿En qué puedo ayudarte?": {
    "en": "How can I help you?",
    "fr": "Comment puis-je vous aider ?",
    "pt": "Como posso ajudar você?"
  },
  "Enviar": {
    "en": "Send",
    "fr": "Envoyer",
    "pt": "Enviar"
  },
  "Preparando respuesta…": {
    "en": "Preparing response…",
    "fr": "Préparation de la réponse…",
    "pt": "Preparando resposta…"
  },
  "Agendar cita": {
    "en": "Book an appointment",
    "fr": "Prendre rendez-vous",
    "pt": "Agendar consulta"
  },
  "Recuperar cuenta": {
    "en": "Recover account",
    "fr": "Récupérer le compte",
    "pt": "Recuperar conta"
  },

  // Traducciones adicionales: usuarios y accesibilidad.
  "Administración de Usuarios 👥": {
    "en": "User Management 👥",
    "fr": "Gestion des utilisateurs 👥",
    "pt": "Administração de usuários 👥"
  },
  "Gestiona las cuentas registradas, revisa solicitudes y controla sus estados.": {
    "en": "Manage registered accounts, review requests, and track their status.",
    "fr": "Gérez les comptes enregistrés, examinez les demandes et suivez leur statut.",
    "pt": "Gerencie as contas cadastradas, analise solicitações e acompanhe seus status."
  },
  "Gestión de cuentas": {
    "en": "Account management",
    "fr": "Gestion des comptes",
    "pt": "Gerenciamento de contas"
  },
  "Total de usuarios": {
    "en": "Total users",
    "fr": "Nombre total d’utilisateurs",
    "pt": "Total de usuários"
  },
  "Aprobados": {
    "en": "Approved",
    "fr": "Approuvés",
    "pt": "Aprovados"
  },
  "Bloqueados": {
    "en": "Blocked",
    "fr": "Bloqués",
    "pt": "Bloqueados"
  },
  "Correo verificado": {
    "en": "Verified email",
    "fr": "E-mail vérifié",
    "pt": "E-mail verificado"
  },
  "Cuenta activa": {
    "en": "Active account",
    "fr": "Compte actif",
    "pt": "Conta ativa"
  },
  "Estado de la cuenta": {
    "en": "Account status",
    "fr": "Statut du compte",
    "pt": "Status da conta"
  },
  "Buscar usuario": {
    "en": "Search users",
    "fr": "Rechercher un utilisateur",
    "pt": "Buscar usuário"
  },
  "Busca sin distinguir mayúsculas ni tildes.": {
    "en": "Search ignores capitalization and accents.",
    "fr": "La recherche ignore la casse et les accents.",
    "pt": "A busca ignora letras maiúsculas e acentos."
  },
  "Nombre, correo o ID...": {
    "en": "Name, email or ID...",
    "fr": "Nom, e-mail ou identifiant...",
    "pt": "Nome, e-mail ou ID..."
  },
  "Selecciona una vista para consultar las cuentas del sistema.": {
    "en": "Select a view to browse system accounts.",
    "fr": "Sélectionnez une vue pour consulter les comptes du système.",
    "pt": "Selecione uma visualização para consultar as contas do sistema."
  },
  "Seleccionar vista de usuarios": {
    "en": "Select user view",
    "fr": "Sélectionner la vue des utilisateurs",
    "pt": "Selecionar visualização de usuários"
  },
  "👥 Todos los usuarios": {
    "en": "👥 All users",
    "fr": "👥 Tous les utilisateurs",
    "pt": "👥 Todos os usuários"
  },
  "⏳ Usuarios pendientes": {
    "en": "⏳ Pending users",
    "fr": "⏳ Utilisateurs en attente",
    "pt": "⏳ Usuários pendentes"
  },
  "Resumen de cuentas registradas": {
    "en": "Registered accounts overview",
    "fr": "Vue d’ensemble des comptes enregistrés",
    "pt": "Resumo das contas cadastradas"
  },
  "Consultando las cuentas registradas...": {
    "en": "Loading registered accounts...",
    "fr": "Chargement des comptes enregistrés...",
    "pt": "Carregando contas cadastradas..."
  },
  "No hay usuarios para mostrar": {
    "en": "No users to display",
    "fr": "Aucun utilisateur à afficher",
    "pt": "Nenhum usuário para exibir"
  },
  "Actualmente no existen usuarios pendientes de aprobación.": {
    "en": "There are currently no users awaiting approval.",
    "fr": "Aucun utilisateur n’attend actuellement une approbation.",
    "pt": "No momento, não há usuários aguardando aprovação."
  },
  "No existen cuentas registradas en el sistema.": {
    "en": "No accounts are registered in the system.",
    "fr": "Aucun compte n’est enregistré dans le système.",
    "pt": "Não há contas cadastradas no sistema."
  },
  "No encontramos usuarios con esos filtros": {
    "en": "No users match these filters",
    "fr": "Aucun utilisateur ne correspond à ces filtres",
    "pt": "Nenhum usuário corresponde a esses filtros"
  },
  "Prueba otro nombre, correo o estado.": {
    "en": "Try another name, email or status.",
    "fr": "Essayez un autre nom, e-mail ou statut.",
    "pt": "Tente outro nome, e-mail ou status."
  },
  "Procesando solicitud...": {
    "en": "Processing request...",
    "fr": "Traitement de la demande...",
    "pt": "Processando solicitação..."
  },
  "✓ Aprobar": {
    "en": "✓ Approve",
    "fr": "✓ Approuver",
    "pt": "✓ Aprovar"
  },
  "✕ Rechazar": {
    "en": "✕ Reject",
    "fr": "✕ Refuser",
    "pt": "✕ Rejeitar"
  },
  "🔒 Bloquear": {
    "en": "🔒 Block",
    "fr": "🔒 Bloquer",
    "pt": "🔒 Bloquear"
  },
  "🔓 Activar": {
    "en": "🔓 Activate",
    "fr": "🔓 Activer",
    "pt": "🔓 Ativar"
  },
  "🗑 Eliminar": {
    "en": "🗑 Delete",
    "fr": "🗑 Supprimer",
    "pt": "🗑 Excluir"
  },
  "🛡️ Cuenta administrativa protegida.": {
    "en": "🛡️ Protected administrator account.",
    "fr": "🛡️ Compte administrateur protégé.",
    "pt": "🛡️ Conta de administrador protegida."
  },
  "Accesos rápidos administrativos": {
    "en": "Administrative shortcuts",
    "fr": "Raccourcis d’administration",
    "pt": "Atalhos administrativos"
  },
  "Ingresa directamente a cualquier módulo de administración.": {
    "en": "Go directly to any administration module.",
    "fr": "Accédez directement à un module d’administration.",
    "pt": "Acesse diretamente qualquer módulo de administração."
  },
  "🛠️ Servicios": {
    "en": "🛠️ Services",
    "fr": "🛠️ Services",
    "pt": "🛠️ Serviços"
  },
  "ID": {
    "en": "ID",
    "fr": "Identifiant",
    "pt": "ID"
  },
  "ADMIN": {
    "en": "ADMIN",
    "fr": "ADMIN",
    "pt": "ADMIN"
  },
  "USER": {
    "en": "USER",
    "fr": "UTILISATEUR",
    "pt": "USUÁRIO"
  },
  "APROBADA": {
    "en": "APPROVED",
    "fr": "APPROUVÉ",
    "pt": "APROVADA"
  },
  "PENDIENTE": {
    "en": "PENDING",
    "fr": "EN ATTENTE",
    "pt": "PENDENTE"
  },
  "RECHAZADA": {
    "en": "REJECTED",
    "fr": "REJETÉ",
    "pt": "REJEITADA"
  },
  "BLOQUEADA": {
    "en": "BLOCKED",
    "fr": "BLOQUÉ",
    "pt": "BLOQUEADA"
  },
  "INACTIVA": {
    "en": "INACTIVE",
    "fr": "INACTIF",
    "pt": "INATIVA"
  },
  "● Activa": {
    "en": "● Active",
    "fr": "● Actif",
    "pt": "● Ativa"
  },
  "● Inactiva": {
    "en": "● Inactive",
    "fr": "● Inactif",
    "pt": "● Inativa"
  },
  "✓ Verificado": {
    "en": "✓ Verified",
    "fr": "✓ Vérifié",
    "pt": "✓ Verificado"
  },
  "✕ No verificado": {
    "en": "✕ Not verified",
    "fr": "✕ Non vérifié",
    "pt": "✕ Não verificado"
  },
  "✓ Aprobar usuario": {
    "en": "✓ Approve user",
    "fr": "✓ Approuver l’utilisateur",
    "pt": "✓ Aprovar usuário"
  },
  "Usuario aprobado": {
    "en": "User approved",
    "fr": "Utilisateur approuvé",
    "pt": "Usuário aprovado"
  },
  "Usuario aprobado correctamente.": {
    "en": "User approved successfully.",
    "fr": "Utilisateur approuvé avec succès.",
    "pt": "Usuário aprovado com sucesso."
  },
  "Solicitud rechazada": {
    "en": "Request rejected",
    "fr": "Demande refusée",
    "pt": "Solicitação rejeitada"
  },
  "Usuario rechazado correctamente.": {
    "en": "User rejected successfully.",
    "fr": "Utilisateur refusé avec succès.",
    "pt": "Usuário rejeitado com sucesso."
  },
  "Usuario bloqueado": {
    "en": "User blocked",
    "fr": "Utilisateur bloqué",
    "pt": "Usuário bloqueado"
  },
  "Usuario bloqueado correctamente.": {
    "en": "User blocked successfully.",
    "fr": "Utilisateur bloqué avec succès.",
    "pt": "Usuário bloqueado com sucesso."
  },
  "Usuario activado": {
    "en": "User activated",
    "fr": "Utilisateur activé",
    "pt": "Usuário ativado"
  },
  "Usuario activado correctamente.": {
    "en": "User activated successfully.",
    "fr": "Utilisateur activé avec succès.",
    "pt": "Usuário ativado com sucesso."
  },
  "Usuario eliminado": {
    "en": "User deleted",
    "fr": "Utilisateur supprimé",
    "pt": "Usuário excluído"
  },
  "Usuario eliminado correctamente.": {
    "en": "User deleted successfully.",
    "fr": "Utilisateur supprimé avec succès.",
    "pt": "Usuário excluído com sucesso."
  },
  "No se pudo completar la operación. Intenta nuevamente.": {
    "en": "The operation could not be completed. Please try again.",
    "fr": "L’opération n’a pas pu être effectuée. Réessayez.",
    "pt": "Não foi possível concluir a operação. Tente novamente."
  },
  "Operación no completada": {
    "en": "Operation not completed",
    "fr": "Opération non terminée",
    "pt": "Operação não concluída"
  },
  "No se pudo conectar con el servidor. Comprueba que Spring Boot esté funcionando.": {
    "en": "Could not connect to the server. Check that Spring Boot is running.",
    "fr": "Impossible de se connecter au serveur. Vérifiez que Spring Boot fonctionne.",
    "pt": "Não foi possível conectar ao servidor. Verifique se o Spring Boot está funcionando."
  },
  "No se pudieron cargar los usuarios. Intenta nuevamente.": {
    "en": "Could not load users. Please try again.",
    "fr": "Impossible de charger les utilisateurs. Réessayez.",
    "pt": "Não foi possível carregar os usuários. Tente novamente."
  },
  "No se pudo recuperar la información del sistema.": {
    "en": "Could not retrieve system information.",
    "fr": "Impossible de récupérer les informations du système.",
    "pt": "Não foi possível recuperar as informações do sistema."
  },
  "♿ Accesibilidad": {
    "en": "♿ Accessibility",
    "fr": "♿ Accessibilité",
    "pt": "♿ Acessibilidade"
  },
  "Configuración de accesibilidad": {
    "en": "Accessibility settings",
    "fr": "Paramètres d’accessibilité",
    "pt": "Configurações de acessibilidade"
  },
  "Abrir configuración de accesibilidad": {
    "en": "Open accessibility settings",
    "fr": "Ouvrir les paramètres d’accessibilité",
    "pt": "Abrir configurações de acessibilidade"
  },
  "Cerrar panel de accesibilidad": {
    "en": "Close accessibility panel",
    "fr": "Fermer le panneau d’accessibilité",
    "pt": "Fechar painel de acessibilidade"
  },
  "🌐 Idioma de la página": {
    "en": "🌐 Page language",
    "fr": "🌐 Langue de la page",
    "pt": "🌐 Idioma da página"
  },
  "🎨 Apariencia y contraste": {
    "en": "🎨 Appearance and contrast",
    "fr": "🎨 Apparence et contraste",
    "pt": "🎨 Aparência e contraste"
  },
  "🔠 Tamaño de visualización": {
    "en": "🔠 Display size",
    "fr": "🔠 Taille d’affichage",
    "pt": "🔠 Tamanho da exibição"
  },
  "🔊 Lectura y sonido": {
    "en": "🔊 Reading and sound",
    "fr": "🔊 Lecture et son",
    "pt": "🔊 Leitura e som"
  },
  "⚙️ Lectura y movimiento": {
    "en": "⚙️ Reading and motion",
    "fr": "⚙️ Lecture et mouvement",
    "pt": "⚙️ Leitura e movimento"
  },
  "Normal": {
    "en": "Normal",
    "fr": "Normal",
    "pt": "Normal"
  },
  "Suave": {
    "en": "Soft",
    "fr": "Doux",
    "pt": "Suave"
  },
  "Alto": {
    "en": "High contrast",
    "fr": "Contraste élevé",
    "pt": "Alto contraste"
  },
  "Oscuro": {
    "en": "Dark",
    "fr": "Sombre",
    "pt": "Escuro"
  },
  "Modos de contraste": {
    "en": "Contrast modes",
    "fr": "Modes de contraste",
    "pt": "Modos de contraste"
  },
  "Amplía o reduce textos y controles.": {
    "en": "Increase or decrease the size of text and controls.",
    "fr": "Agrandissez ou réduisez les textes et les commandes.",
    "pt": "Aumente ou diminua o tamanho dos textos e controles."
  },
  "Disminuir tamaño de visualización": {
    "en": "Decrease display size",
    "fr": "Réduire la taille d’affichage",
    "pt": "Diminuir tamanho da exibição"
  },
  "Aumentar tamaño de visualización": {
    "en": "Increase display size",
    "fr": "Augmenter la taille d’affichage",
    "pt": "Aumentar tamanho da exibição"
  },
  "Anuncia botones y enlaces al utilizarlos.": {
    "en": "Announces buttons and links as you use them.",
    "fr": "Annonce les boutons et les liens lors de leur utilisation.",
    "pt": "Anuncia botões e links durante o uso."
  },
  "Este navegador no dispone de síntesis de voz.": {
    "en": "This browser does not support speech synthesis.",
    "fr": "Ce navigateur ne prend pas en charge la synthèse vocale.",
    "pt": "Este navegador não oferece suporte à síntese de voz."
  },
  "Espaciado de texto": {
    "en": "Text spacing",
    "fr": "Espacement du texte",
    "pt": "Espaçamento do texto"
  },
  "Separa letras y líneas.": {
    "en": "Adds spacing between letters and lines.",
    "fr": "Espacement supplémentaire des lettres et des lignes.",
    "pt": "Aumenta o espaçamento entre letras e linhas."
  },
  "Resaltar enlaces": {
    "en": "Highlight links",
    "fr": "Mettre en évidence les liens",
    "pt": "Destacar links"
  },
  "Subraya los enlaces disponibles.": {
    "en": "Underlines available links.",
    "fr": "Souligne les liens disponibles.",
    "pt": "Sublinha os links disponíveis."
  },
  "Reducir animaciones": {
    "en": "Reduce animations",
    "fr": "Réduire les animations",
    "pt": "Reduzir animações"
  },
  "Disminuye los efectos de movimiento.": {
    "en": "Reduces motion effects.",
    "fr": "Réduit les effets de mouvement.",
    "pt": "Reduz os efeitos de movimento."
  },
  "▶ Leer página": {
    "en": "▶ Read page",
    "fr": "▶ Lire la page",
    "pt": "▶ Ler página"
  },
  "■ Detener": {
    "en": "■ Stop",
    "fr": "■ Arrêter",
    "pt": "■ Parar"
  },
  "↺ Restablecer configuración": {
    "en": "↺ Reset settings",
    "fr": "↺ Réinitialiser les paramètres",
    "pt": "↺ Redefinir configurações"
  },
  "Las preferencias se mantienen en esta pestaña.": {
    "en": "Preferences are saved in this tab.",
    "fr": "Les préférences sont conservées dans cet onglet.",
    "pt": "As preferências são mantidas nesta aba."
  },


  "Hoy": {"en":"Today", "fr":"Aujourd’hui", "pt":"Hoje"},

  // Ampliación de traducciones ES/EN/FR/PT para módulos de la aplicación.
  "No tienes notificaciones por ahora.": {
    "en": "You have no notifications right now.",
    "fr": "Vous n'avez aucune notification pour le moment.",
    "pt": "Você não tem notificações no momento."
  },
  "Limpiar notificaciones": {
    "en": "Clear notifications",
    "fr": "Effacer les notifications",
    "pt": "Limpar notificações"
  },
  "Cerrar notificaciones": {
    "en": "Close notifications",
    "fr": "Fermer les notifications",
    "pt": "Fechar notificações"
  },
  "ACCESOS RÁPIDOS · ADMINISTRADOR": {
    "en": "QUICK ACCESS · ADMINISTRATOR",
    "fr": "ACCÈS RAPIDE · ADMINISTRATEUR",
    "pt": "ACESSO RÁPIDO · ADMINISTRADOR"
  },
  "ACCESOS RÁPIDOS · VETERINARIO": {
    "en": "QUICK ACCESS · VETERINARIAN",
    "fr": "ACCÈS RAPIDE · VÉTÉRINAIRE",
    "pt": "ACESSO RÁPIDO · VETERINÁRIO"
  },
  "Cerrar menú de navegación": {
    "en": "Close navigation menu",
    "fr": "Fermer le menu de navigation",
    "pt": "Fechar menu de navegação"
  },
  "Menú principal de Veterinaria Arévalo": {
    "en": "Veterinaria Arévalo main menu",
    "fr": "Menu principal de Veterinaria Arévalo",
    "pt": "Menu principal da Veterinaria Arévalo"
  },
  "Cerrar menú lateral": {
    "en": "Close sidebar",
    "fr": "Fermer la barre latérale",
    "pt": "Fechar barra lateral"
  },
  "Opciones de navegación": {
    "en": "Navigation options",
    "fr": "Options de navigation",
    "pt": "Opções de navegação"
  },
  "Abrir menú de navegación": {
    "en": "Open navigation menu",
    "fr": "Ouvrir le menu de navigation",
    "pt": "Abrir menu de navegação"
  },
  "Notificaciones del sistema": {
    "en": "System notifications",
    "fr": "Notifications du système",
    "pt": "Notificações do sistema"
  },
  "Accesos rápidos del administrador": {
    "en": "Administrator quick access",
    "fr": "Accès rapide de l'administrateur",
    "pt": "Acesso rápido do administrador"
  },
  "Accesos rápidos del veterinario": {
    "en": "Veterinarian quick access",
    "fr": "Accès rapide du vétérinaire",
    "pt": "Acesso rápido do veterinário"
  },
  "Accesos rápidos del cliente": {
    "en": "Customer quick access",
    "fr": "Accès rapide du client",
    "pt": "Acesso rápido do cliente"
  },
  "Acciones": {
    "en": "Actions",
    "fr": "Actions",
    "pt": "Ações"
  },
  "Volver": {
    "en": "Back",
    "fr": "Retour",
    "pt": "Voltar"
  },
  "Cerrar detalle": {
    "en": "Close details",
    "fr": "Fermer les détails",
    "pt": "Fechar detalhes"
  },
  "Ver detalle": {
    "en": "View details",
    "fr": "Voir les détails",
    "pt": "Ver detalhes"
  },
  "Ver": {
    "en": "View",
    "fr": "Voir",
    "pt": "Ver"
  },
  "Ver todas →": {
    "en": "View all →",
    "fr": "Tout voir →",
    "pt": "Ver tudo →"
  },
  "✏️ Editar": {
    "en": "✏️ Edit",
    "fr": "✏️ Modifier",
    "pt": "✏️ Editar"
  },
  "✎ Editar": {
    "en": "✎ Edit",
    "fr": "✎ Modifier",
    "pt": "✎ Editar"
  },
  "Reintentar consulta": {
    "en": "Retry query",
    "fr": "Réessayer la requête",
    "pt": "Tentar consulta novamente"
  },
  "No disponible": {
    "en": "Unavailable",
    "fr": "Indisponible",
    "pt": "Indisponível"
  },
  "Pendiente": {
    "en": "Pending",
    "fr": "En attente",
    "pt": "Pendente"
  },
  "Registrada": {
    "en": "Registered",
    "fr": "Enregistrée",
    "pt": "Registrada"
  },
  "Emitida": {
    "en": "Issued",
    "fr": "Émise",
    "pt": "Emitida"
  },
  "Enviado": {
    "en": "Sent",
    "fr": "Envoyé",
    "pt": "Enviado"
  },
  "No informado": {
    "en": "Not provided",
    "fr": "Non renseigné",
    "pt": "Não informado"
  },
  "Desde": {
    "en": "From",
    "fr": "Du",
    "pt": "De"
  },
  "Hasta": {
    "en": "To",
    "fr": "Au",
    "pt": "Até"
  },
  "Anterior": {
    "en": "Previous",
    "fr": "Précédent",
    "pt": "Anterior"
  },
  "Siguiente": {
    "en": "Next",
    "fr": "Suivant",
    "pt": "Próximo"
  },
  "← Anterior": {
    "en": "← Previous",
    "fr": "← Précédent",
    "pt": "← Anterior"
  },
  "Siguiente →": {
    "en": "Next →",
    "fr": "Suivant →",
    "pt": "Próximo →"
  },
  "Resumen general": {
    "en": "Overview",
    "fr": "Vue d'ensemble",
    "pt": "Visão geral"
  },
  "Resumen financiero": {
    "en": "Financial summary",
    "fr": "Résumé financier",
    "pt": "Resumo financeiro"
  },
  "Resumen de facturación": {
    "en": "Billing summary",
    "fr": "Résumé de facturation",
    "pt": "Resumo de faturamento"
  },
  "Resumen de medicamentos": {
    "en": "Medication summary",
    "fr": "Résumé des médicaments",
    "pt": "Resumo de medicamentos"
  },
  "Resumen de servicios veterinarios": {
    "en": "Veterinary services summary",
    "fr": "Résumé des services vétérinaires",
    "pt": "Resumo de serviços veterinários"
  },
  "Resumen de profesionales": {
    "en": "Professional staff summary",
    "fr": "Résumé des professionnels",
    "pt": "Resumo de profissionais"
  },
  "Resumen de mis citas": {
    "en": "My appointments summary",
    "fr": "Résumé de mes rendez-vous",
    "pt": "Resumo das minhas consultas"
  },
  "Resumen de mis facturas": {
    "en": "My invoices summary",
    "fr": "Résumé de mes factures",
    "pt": "Resumo das minhas faturas"
  },
  "Resumen de atenciones": {
    "en": "Care summary",
    "fr": "Résumé des soins",
    "pt": "Resumo dos atendimentos"
  },
  "Resumen de mascotas y propietarios": {
    "en": "Pet and owner summary",
    "fr": "Résumé des animaux et propriétaires",
    "pt": "Resumo de animais e tutores"
  },
  "MI ESPACIO PERSONAL": {
    "en": "MY PERSONAL SPACE",
    "fr": "MON ESPACE PERSONNEL",
    "pt": "MEU ESPAÇO PESSOAL"
  },
  "🩺 ESPACIO PROFESIONAL": {
    "en": "🩺 PROFESSIONAL AREA",
    "fr": "🩺 ESPACE PROFESSIONNEL",
    "pt": "🩺 ESPAÇO PROFISSIONAL"
  },
  "VETERINARIA ARÉVALO": {
    "en": "VETERINARIA ARÉVALO",
    "fr": "VETERINARIA ARÉVALO",
    "pt": "VETERINARIA ARÉVALO"
  },
  "Servicio veterinario": {
    "en": "Veterinary service",
    "fr": "Service vétérinaire",
    "pt": "Serviço veterinário"
  },
  "Atención médica": {
    "en": "Medical care",
    "fr": "Consultation médicale",
    "pt": "Atendimento médico"
  },
  "Atenciones médicas": {
    "en": "Medical consultations",
    "fr": "Consultations médicales",
    "pt": "Atendimentos médicos"
  },
  "Atenciones Médicas 🩺": {
    "en": "Medical Consultations 🩺",
    "fr": "Consultations médicales 🩺",
    "pt": "Atendimentos médicos 🩺"
  },
  "Supervisa las consultas, diagnósticos y tratamientos realizados por los profesionales veterinarios.": {
    "en": "Monitor consultations, diagnoses and treatments performed by veterinarians.",
    "fr": "Supervisez les consultations, diagnostics et traitements réalisés par les vétérinaires.",
    "pt": "Acompanhe as consultas, os diagnósticos e os tratamentos realizados pelos veterinários."
  },
  "Estadísticas globales de la veterinaria.": {
    "en": "Overall veterinary clinic statistics.",
    "fr": "Statistiques générales de la clinique vétérinaire.",
    "pt": "Estatísticas gerais da clínica veterinária."
  },
  "DATOS GENERALES": {
    "en": "GENERAL INFORMATION",
    "fr": "DONNÉES GÉNÉRALES",
    "pt": "DADOS GERAIS"
  },
  "Total de atenciones": {
    "en": "Total consultations",
    "fr": "Total des consultations",
    "pt": "Total de atendimentos"
  },
  "Consultas registradas": {
    "en": "Recorded consultations",
    "fr": "Consultations enregistrées",
    "pt": "Consultas registradas"
  },
  "Mascotas atendidas": {
    "en": "Pets treated",
    "fr": "Animaux soignés",
    "pt": "Animais atendidos"
  },
  "Mascotas diferentes": {
    "en": "Unique pets",
    "fr": "Animaux différents",
    "pt": "Animais diferentes"
  },
  "Veterinarios activos en atención": {
    "en": "Veterinarians providing care",
    "fr": "Vétérinaires ayant assuré des soins",
    "pt": "Veterinários em atendimento"
  },
  "Profesionales con registros": {
    "en": "Professionals with records",
    "fr": "Professionnels ayant des dossiers",
    "pt": "Profissionais com registros"
  },
  "Calculando estadísticas...": {
    "en": "Calculating statistics...",
    "fr": "Calcul des statistiques...",
    "pt": "Calculando estatísticas..."
  },
  "Atenciones por veterinario": {
    "en": "Consultations by veterinarian",
    "fr": "Consultations par vétérinaire",
    "pt": "Atendimentos por veterinário"
  },
  "Distribución de las consultas registradas.": {
    "en": "Distribution of recorded consultations.",
    "fr": "Répartition des consultations enregistrées.",
    "pt": "Distribuição das consultas registradas."
  },
  "Registro de atenciones": {
    "en": "Consultation records",
    "fr": "Registre des consultations",
    "pt": "Registro de atendimentos"
  },
  "Busca y consulta los registros médicos.": {
    "en": "Search and view medical records.",
    "fr": "Recherchez et consultez les dossiers médicaux.",
    "pt": "Pesquise e consulte os registros médicos."
  },
  "Buscar atención": {
    "en": "Search consultations",
    "fr": "Rechercher une consultation",
    "pt": "Buscar atendimento"
  },
  "Todos los veterinarios": {
    "en": "All veterinarians",
    "fr": "Tous les vétérinaires",
    "pt": "Todos os veterinários"
  },
  "Aplicar fechas": {
    "en": "Apply dates",
    "fr": "Appliquer les dates",
    "pt": "Aplicar datas"
  },
  "El rango de fechas se consulta en el servidor. La búsqueda y el filtro por veterinario se aplican sobre los resultados obtenidos.": {
    "en": "The date range is queried on the server; search and veterinarian filters apply to the results.",
    "fr": "La période est interrogée sur le serveur ; la recherche et le filtre par vétérinaire s'appliquent aux résultats.",
    "pt": "O período é consultado no servidor; a busca e o filtro por veterinário são aplicados aos resultados."
  },
  "Consultando registros médicos...": {
    "en": "Loading medical records...",
    "fr": "Chargement des dossiers médicaux...",
    "pt": "Consultando registros médicos..."
  },
  "No se encontraron atenciones médicas.": {
    "en": "No medical consultations found.",
    "fr": "Aucune consultation médicale trouvée.",
    "pt": "Nenhum atendimento médico encontrado."
  },
  "Prueba cambiando los filtros de búsqueda.": {
    "en": "Try changing the search filters.",
    "fr": "Essayez de modifier les filtres de recherche.",
    "pt": "Tente alterar os filtros de busca."
  },
  "HISTORIAL MÉDICO": {
    "en": "MEDICAL HISTORY",
    "fr": "HISTORIQUE MÉDICAL",
    "pt": "HISTÓRICO MÉDICO"
  },
  "Detalle de atención": {
    "en": "Consultation details",
    "fr": "Détails de la consultation",
    "pt": "Detalhes do atendimento"
  },
  "Fecha de atención": {
    "en": "Consultation date",
    "fr": "Date de consultation",
    "pt": "Data do atendimento"
  },
  "Cita relacionada": {
    "en": "Related appointment",
    "fr": "Rendez-vous associé",
    "pt": "Consulta relacionada"
  },
  "Consultando historial...": {
    "en": "Loading history...",
    "fr": "Chargement de l'historique...",
    "pt": "Consultando histórico..."
  },
  "No existen registros en el historial.": {
    "en": "There are no records in the history.",
    "fr": "Aucun dossier dans l'historique.",
    "pt": "Não há registros no histórico."
  },
  "Consulta administrativa de solo lectura.": {
    "en": "Read-only administrative view.",
    "fr": "Consultation administrative en lecture seule.",
    "pt": "Consulta administrativa somente leitura."
  },
  "Mascota, veterinario, diagnóstico...": {
    "en": "Pet, veterinarian, diagnosis...",
    "fr": "Animal, vétérinaire, diagnostic...",
    "pt": "Animal, veterinário, diagnóstico..."
  },
  "Administración de Citas 📅": {
    "en": "Appointment Management 📅",
    "fr": "Gestion des rendez-vous 📅",
    "pt": "Administração de consultas 📅"
  },
  "Registra, consulta y administra las citas veterinarias del sistema.": {
    "en": "Create, view and manage veterinary appointments.",
    "fr": "Créez, consultez et gérez les rendez-vous vétérinaires.",
    "pt": "Cadastre, consulte e administre as consultas veterinárias."
  },
  "+ Nueva cita": {
    "en": "+ New appointment",
    "fr": "+ Nouveau rendez-vous",
    "pt": "+ Nova consulta"
  },
  "Total de citas": {
    "en": "Total appointments",
    "fr": "Total des rendez-vous",
    "pt": "Total de consultas"
  },
  "Completa los datos obligatorios para guardar la cita.": {
    "en": "Complete the required fields to save the appointment.",
    "fr": "Remplissez les champs obligatoires pour enregistrer le rendez-vous.",
    "pt": "Preencha os campos obrigatórios para salvar a consulta."
  },
  "Información de la cita veterinaria": {
    "en": "Veterinary appointment information",
    "fr": "Informations sur le rendez-vous vétérinaire",
    "pt": "Informações da consulta veterinária"
  },
  "La fecha y hora son obligatorias.": {
    "en": "Date and time are required.",
    "fr": "La date et l'heure sont obligatoires.",
    "pt": "Data e hora são obrigatórias."
  },
  "Estado de la cita": {
    "en": "Appointment status",
    "fr": "Statut du rendez-vous",
    "pt": "Status da consulta"
  },
  "CONFIRMADA": {
    "en": "CONFIRMED",
    "fr": "CONFIRMÉE",
    "pt": "CONFIRMADA"
  },
  "COMPLETADA": {
    "en": "COMPLETED",
    "fr": "TERMINÉE",
    "pt": "CONCLUÍDA"
  },
  "CANCELADA": {
    "en": "CANCELLED",
    "fr": "ANNULÉE",
    "pt": "CANCELADA"
  },
  "El estado se guarda mediante la API.": {
    "en": "The status is saved through the API.",
    "fr": "Le statut est enregistré via l'API.",
    "pt": "O status é salvo pela API."
  },
  "Selecciona una mascota": {
    "en": "Select a pet",
    "fr": "Sélectionnez un animal",
    "pt": "Selecione um animal"
  },
  "Debes seleccionar una mascota.": {
    "en": "You must select a pet.",
    "fr": "Vous devez sélectionner un animal.",
    "pt": "Você deve selecionar um animal."
  },
  "Selecciona un veterinario": {
    "en": "Select a veterinarian",
    "fr": "Sélectionnez un vétérinaire",
    "pt": "Selecione um veterinário"
  },
  "Debes seleccionar un veterinario.": {
    "en": "You must select a veterinarian.",
    "fr": "Vous devez sélectionner un vétérinaire.",
    "pt": "Você deve selecionar um veterinário."
  },
  "Selecciona un servicio": {
    "en": "Select a service",
    "fr": "Sélectionnez un service",
    "pt": "Selecione um serviço"
  },
  "Debes seleccionar un servicio.": {
    "en": "You must select a service.",
    "fr": "Vous devez sélectionner un service.",
    "pt": "Você deve selecionar um serviço."
  },
  "El motivo de la cita es obligatorio.": {
    "en": "An appointment reason is required.",
    "fr": "Le motif du rendez-vous est obligatoire.",
    "pt": "O motivo da consulta é obrigatório."
  },
  "Citas registradas": {
    "en": "Registered appointments",
    "fr": "Rendez-vous enregistrés",
    "pt": "Consultas registradas"
  },
  "Consulta las citas, sus participantes y el estado de cada atención.": {
    "en": "View appointments, participants and the status of each consultation.",
    "fr": "Consultez les rendez-vous, les participants et l'état de chaque consultation.",
    "pt": "Consulte as consultas, os participantes e o estado de cada atendimento."
  },
  "Buscar cita": {
    "en": "Search appointments",
    "fr": "Rechercher un rendez-vous",
    "pt": "Buscar consulta"
  },
  "Busca por nombre, correo, veterinario o ID.": {
    "en": "Search by name, email, veterinarian or ID.",
    "fr": "Recherchez par nom, e-mail, vétérinaire ou identifiant.",
    "pt": "Busque por nome, e-mail, veterinário ou ID."
  },
  "Ordenar citas": {
    "en": "Sort appointments",
    "fr": "Trier les rendez-vous",
    "pt": "Ordenar consultas"
  },
  "Fecha más reciente": {
    "en": "Most recent date",
    "fr": "Date la plus récente",
    "pt": "Data mais recente"
  },
  "Fecha más antigua": {
    "en": "Oldest date",
    "fr": "Date la plus ancienne",
    "pt": "Data mais antiga"
  },
  "ID más alto": {
    "en": "Highest ID",
    "fr": "Identifiant le plus élevé",
    "pt": "Maior ID"
  },
  "Consultando las citas registradas...": {
    "en": "Loading registered appointments...",
    "fr": "Chargement des rendez-vous enregistrés...",
    "pt": "Consultando consultas registradas..."
  },
  "No hay citas registradas": {
    "en": "No appointments registered",
    "fr": "Aucun rendez-vous enregistré",
    "pt": "Nenhuma consulta registrada"
  },
  "Todavía no existen citas veterinarias registradas en el sistema.": {
    "en": "There are no veterinary appointments registered yet.",
    "fr": "Aucun rendez-vous vétérinaire n'est encore enregistré.",
    "pt": "Ainda não há consultas veterinárias cadastradas."
  },
  "+ Registrar primera cita": {
    "en": "+ Create first appointment",
    "fr": "+ Créer le premier rendez-vous",
    "pt": "+ Cadastrar primeira consulta"
  },
  "No encontramos citas con esos filtros": {
    "en": "No appointments match these filters",
    "fr": "Aucun rendez-vous ne correspond à ces filtres",
    "pt": "Nenhuma consulta corresponde a esses filtros"
  },
  "Cambia el término de búsqueda o selecciona otro estado.": {
    "en": "Change the search term or select another status.",
    "fr": "Modifiez le terme de recherche ou choisissez un autre statut.",
    "pt": "Altere a busca ou selecione outro status."
  },
  "Motivo": {
    "en": "Reason",
    "fr": "Motif",
    "pt": "Motivo"
  },
  "Precio": {
    "en": "Price",
    "fr": "Prix",
    "pt": "Preço"
  },
  "🚫 Cancelar": {
    "en": "🚫 Cancel",
    "fr": "🚫 Annuler",
    "pt": "🚫 Cancelar"
  },
  "Estadísticas de citas": {
    "en": "Appointment statistics",
    "fr": "Statistiques des rendez-vous",
    "pt": "Estatísticas de consultas"
  },
  "Ejemplo: Consulta veterinaria de control": {
    "en": "Example: routine veterinary checkup",
    "fr": "Exemple : consultation vétérinaire de contrôle",
    "pt": "Exemplo: consulta veterinária de rotina"
  },
  "Mascota, propietario, servicio, motivo...": {
    "en": "Pet, owner, service, reason...",
    "fr": "Animal, propriétaire, service, motif...",
    "pt": "Animal, tutor, serviço, motivo..."
  },
  "Administración de Mascotas 🐾": {
    "en": "Pet Management 🐾",
    "fr": "Gestion des animaux 🐾",
    "pt": "Administração de animais 🐾"
  },
  "Consulta, actualiza y administra las mascotas registradas en la veterinaria.": {
    "en": "View, update and manage pets registered at the clinic.",
    "fr": "Consultez, modifiez et gérez les animaux enregistrés à la clinique.",
    "pt": "Consulte, atualize e administre os animais cadastrados na clínica."
  },
  "Total de mascotas": {
    "en": "Total pets",
    "fr": "Nombre total d'animaux",
    "pt": "Total de animais"
  },
  "Propietarios": {
    "en": "Owners",
    "fr": "Propriétaires",
    "pt": "Tutores"
  },
  "Editar mascota": {
    "en": "Edit pet",
    "fr": "Modifier l'animal",
    "pt": "Editar animal"
  },
  "Actualiza la información de la mascota sin modificar su propietario.": {
    "en": "Update the pet's information without changing its owner.",
    "fr": "Mettez à jour les informations de l'animal sans changer son propriétaire.",
    "pt": "Atualize as informações do animal sem alterar o tutor."
  },
  "Propietario actual": {
    "en": "Current owner",
    "fr": "Propriétaire actuel",
    "pt": "Tutor atual"
  },
  "Datos de la mascota": {
    "en": "Pet details",
    "fr": "Informations de l'animal",
    "pt": "Dados do animal"
  },
  "El nombre de la mascota es obligatorio.": {
    "en": "Pet name is required.",
    "fr": "Le nom de l'animal est obligatoire.",
    "pt": "O nome do animal é obrigatório."
  },
  "La especie es obligatoria.": {
    "en": "Species is required.",
    "fr": "L'espèce est obligatoire.",
    "pt": "A espécie é obrigatória."
  },
  "La raza es obligatoria.": {
    "en": "Breed is required.",
    "fr": "La race est obligatoire.",
    "pt": "A raça é obrigatória."
  },
  "Edad en años": {
    "en": "Age in years",
    "fr": "Âge en années",
    "pt": "Idade em anos"
  },
  "Ingresa un número entero igual o mayor a cero.": {
    "en": "Enter an integer greater than or equal to zero.",
    "fr": "Saisissez un entier supérieur ou égal à zéro.",
    "pt": "Digite um número inteiro maior ou igual a zero."
  },
  "La edad es obligatoria.": {
    "en": "Age is required.",
    "fr": "L'âge est obligatoire.",
    "pt": "A idade é obrigatória."
  },
  "La edad no puede ser negativa.": {
    "en": "Age cannot be negative.",
    "fr": "L'âge ne peut pas être négatif.",
    "pt": "A idade não pode ser negativa."
  },
  "La edad debe ser un número entero.": {
    "en": "Age must be a whole number.",
    "fr": "L'âge doit être un nombre entier.",
    "pt": "A idade deve ser um número inteiro."
  },
  "Selecciona una opción": {
    "en": "Select an option",
    "fr": "Sélectionnez une option",
    "pt": "Selecione uma opção"
  },
  "Macho": {
    "en": "Male",
    "fr": "Mâle",
    "pt": "Macho"
  },
  "Hembra": {
    "en": "Female",
    "fr": "Femelle",
    "pt": "Fêmea"
  },
  "Debes seleccionar el sexo de la mascota.": {
    "en": "You must select the pet's sex.",
    "fr": "Vous devez sélectionner le sexe de l'animal.",
    "pt": "Você deve selecionar o sexo do animal."
  },
  "Mascotas registradas": {
    "en": "Registered pets",
    "fr": "Animaux enregistrés",
    "pt": "Animais cadastrados"
  },
  "Consulta la información y el propietario asignado a cada mascota.": {
    "en": "View each pet's details and assigned owner.",
    "fr": "Consultez les informations de chaque animal et son propriétaire.",
    "pt": "Consulte os dados de cada animal e seu tutor."
  },
  "Buscar mascota o propietario": {
    "en": "Search pet or owner",
    "fr": "Rechercher un animal ou un propriétaire",
    "pt": "Buscar animal ou tutor"
  },
  "Puedes buscar sin distinguir mayúsculas ni tildes.": {
    "en": "Search is case-insensitive and ignores accents.",
    "fr": "La recherche ignore les majuscules et les accents.",
    "pt": "A busca ignora maiúsculas e acentos."
  },
  "Todas las especies": {
    "en": "All species",
    "fr": "Toutes les espèces",
    "pt": "Todas as espécies"
  },
  "Ordenar mascotas": {
    "en": "Sort pets",
    "fr": "Trier les animaux",
    "pt": "Ordenar animais"
  },
  "Menor edad primero": {
    "en": "Youngest first",
    "fr": "Plus jeune d'abord",
    "pt": "Menor idade primeiro"
  },
  "Mayor edad primero": {
    "en": "Oldest first",
    "fr": "Plus âgé d'abord",
    "pt": "Maior idade primeiro"
  },
  "Consultando las mascotas registradas...": {
    "en": "Loading registered pets...",
    "fr": "Chargement des animaux enregistrés...",
    "pt": "Consultando animais cadastrados..."
  },
  "No hay mascotas registradas": {
    "en": "No pets registered",
    "fr": "Aucun animal enregistré",
    "pt": "Nenhum animal cadastrado"
  },
  "Todavía no existen mascotas registradas en el sistema.": {
    "en": "There are no pets registered in the system yet.",
    "fr": "Aucun animal n'est encore enregistré dans le système.",
    "pt": "Ainda não há animais cadastrados no sistema."
  },
  "No encontramos mascotas con esos filtros": {
    "en": "No pets match these filters",
    "fr": "Aucun animal ne correspond à ces filtres",
    "pt": "Nenhum animal corresponde a esses filtros"
  },
  "Prueba otro nombre o selecciona una especie diferente.": {
    "en": "Try another name or choose a different species.",
    "fr": "Essayez un autre nom ou sélectionnez une autre espèce.",
    "pt": "Tente outro nome ou selecione outra espécie."
  },
  "Mascota registrada": {
    "en": "Registered pet",
    "fr": "Animal enregistré",
    "pt": "Animal cadastrado"
  },
  "Propietario no disponible": {
    "en": "Owner unavailable",
    "fr": "Propriétaire indisponible",
    "pt": "Tutor indisponível"
  },
  "Ejemplo: Rocky": {
    "en": "Example: Rocky",
    "fr": "Exemple : Rocky",
    "pt": "Exemplo: Rocky"
  },
  "Ejemplo: Caballo": {
    "en": "Example: Horse",
    "fr": "Exemple : Cheval",
    "pt": "Exemplo: Cavalo"
  },
  "Ejemplo: Criollo": {
    "en": "Example: Mixed breed",
    "fr": "Exemple : Croisé",
    "pt": "Exemplo: Sem raça definida"
  },
  "Ejemplo: 3": {
    "en": "Example: 3",
    "fr": "Exemple : 3",
    "pt": "Exemplo: 3"
  },
  "Mascota, raza, propietario, correo...": {
    "en": "Pet, breed, owner, email...",
    "fr": "Animal, race, propriétaire, e-mail...",
    "pt": "Animal, raça, tutor, e-mail..."
  },
  "Sin existencias": {
    "en": "Out of stock",
    "fr": "Rupture de stock",
    "pt": "Sem estoque"
  },
  "Completa la información del medicamento.": {
    "en": "Complete the medication information.",
    "fr": "Complétez les informations sur le médicament.",
    "pt": "Preencha as informações do medicamento."
  },
  "Nombre del medicamento *": {
    "en": "Medication name *",
    "fr": "Nom du médicament *",
    "pt": "Nome do medicamento *"
  },
  "El nombre es obligatorio.": {
    "en": "Name is required.",
    "fr": "Le nom est obligatoire.",
    "pt": "O nome é obrigatório."
  },
  "Presentación *": {
    "en": "Dosage form *",
    "fr": "Présentation *",
    "pt": "Apresentação *"
  },
  "La presentación es obligatoria.": {
    "en": "Dosage form is required.",
    "fr": "La présentation est obligatoire.",
    "pt": "A apresentação é obrigatória."
  },
  "Unidad de medida *": {
    "en": "Unit of measurement *",
    "fr": "Unité de mesure *",
    "pt": "Unidade de medida *"
  },
  "Selecciona una unidad": {
    "en": "Select a unit",
    "fr": "Sélectionnez une unité",
    "pt": "Selecione uma unidade"
  },
  "UNIDAD": {
    "en": "UNIT",
    "fr": "UNITÉ",
    "pt": "UNIDADE"
  },
  "TABLETA": {
    "en": "TABLET",
    "fr": "COMPRIMÉ",
    "pt": "COMPRIMIDO"
  },
  "CÁPSULA": {
    "en": "CAPSULE",
    "fr": "GÉLULE",
    "pt": "CÁPSULA"
  },
  "DOSIS": {
    "en": "DOSE",
    "fr": "DOSE",
    "pt": "DOSE"
  },
  "FRASCO": {
    "en": "BOTTLE",
    "fr": "FLACON",
    "pt": "FRASCO"
  },
  "AMPOLLA": {
    "en": "AMPOULE",
    "fr": "AMPOULE",
    "pt": "AMPOLA"
  },
  "SOBRE": {
    "en": "SACHET",
    "fr": "SACHET",
    "pt": "SACHÊ"
  },
  "GRAMO": {
    "en": "GRAM",
    "fr": "GRAMME",
    "pt": "GRAMA"
  },
  "Selecciona una unidad de medida.": {
    "en": "Select a unit of measurement.",
    "fr": "Sélectionnez une unité de mesure.",
    "pt": "Selecione uma unidade de medida."
  },
  "Precio unitario ($) *": {
    "en": "Unit price ($) *",
    "fr": "Prix unitaire ($) *",
    "pt": "Preço unitário ($) *"
  },
  "Ingresa un precio válido.": {
    "en": "Enter a valid price.",
    "fr": "Saisissez un prix valide.",
    "pt": "Digite um preço válido."
  },
  "Stock disponible *": {
    "en": "Available stock *",
    "fr": "Stock disponible *",
    "pt": "Estoque disponível *"
  },
  "Ingresa una cantidad válida.": {
    "en": "Enter a valid quantity.",
    "fr": "Saisissez une quantité valide.",
    "pt": "Digite uma quantidade válida."
  },
  "El precio unitario se utilizará para calcular los importes de medicamentos incluidos en las facturas de las atenciones médicas.": {
    "en": "The unit price is used to calculate medication amounts on medical invoices.",
    "fr": "Le prix unitaire sert à calculer le montant des médicaments sur les factures médicales.",
    "pt": "O preço unitário é usado para calcular os valores dos medicamentos nas faturas dos atendimentos."
  },
  "Nombre A - Z": {
    "en": "Name A - Z",
    "fr": "Nom A - Z",
    "pt": "Nome A - Z"
  },
  "Nombre Z - A": {
    "en": "Name Z - A",
    "fr": "Nom Z - A",
    "pt": "Nome Z - A"
  },
  "Catálogo de medicamentos": {
    "en": "Medication catalog",
    "fr": "Catalogue des médicaments",
    "pt": "Catálogo de medicamentos"
  },
  "Consulta y administra los productos registrados.": {
    "en": "View and manage registered products.",
    "fr": "Consultez et gérez les produits enregistrés.",
    "pt": "Consulte e administre os produtos cadastrados."
  },
  "Medicamento": {
    "en": "Medication",
    "fr": "Médicament",
    "pt": "Medicamento"
  },
  "Unidad": {
    "en": "Unit",
    "fr": "Unité",
    "pt": "Unidade"
  },
  "No se encontraron medicamentos": {
    "en": "No medications found",
    "fr": "Aucun médicament trouvé",
    "pt": "Nenhum medicamento encontrado"
  },
  "Prueba con otro nombre o modifica los filtros.": {
    "en": "Try another name or change the filters.",
    "fr": "Essayez un autre nom ou modifiez les filtres.",
    "pt": "Tente outro nome ou altere os filtros."
  },
  "Consultando medicamentos...": {
    "en": "Loading medications...",
    "fr": "Chargement des médicaments...",
    "pt": "Consultando medicamentos..."
  },
  "Estamos obteniendo la información del servidor.": {
    "en": "Retrieving information from the server.",
    "fr": "Récupération des informations du serveur.",
    "pt": "Obtendo informações do servidor."
  },
  "No se pudo cargar el catálogo": {
    "en": "Unable to load catalog",
    "fr": "Impossible de charger le catalogue",
    "pt": "Não foi possível carregar o catálogo"
  },
  "Comprueba que Spring Boot esté funcionando y que tu conexión con el servidor esté disponible.": {
    "en": "Make sure Spring Boot is running and the server is reachable.",
    "fr": "Vérifiez que Spring Boot fonctionne et que le serveur est accessible.",
    "pt": "Confira se o Spring Boot está funcionando e se o servidor está acessível."
  },
  "Intentar nuevamente": {
    "en": "Try again",
    "fr": "Réessayer",
    "pt": "Tentar novamente"
  },
  "La administración del catálogo, los precios y las existencias corresponde exclusivamente al ADMIN. Los medicamentos inactivos se conservan para mantener el historial de la veterinaria.": {
    "en": "Only administrators can manage the catalog, prices and stock. Inactive medications remain for clinical history.",
    "fr": "Seul l'administrateur gère le catalogue, les prix et les stocks. Les médicaments inactifs sont conservés pour l'historique.",
    "pt": "Somente o administrador gerencia catálogo, preços e estoque. Medicamentos inativos são preservados para o histórico."
  },
  "Descargar inventario completo en PDF": {
    "en": "Download full inventory as PDF",
    "fr": "Télécharger l'inventaire complet en PDF",
    "pt": "Baixar inventário completo em PDF"
  },
  "Descargar inventario completo en Excel": {
    "en": "Download full inventory as Excel",
    "fr": "Télécharger l'inventaire complet en Excel",
    "pt": "Baixar inventário completo em Excel"
  },
  "Resumen del inventario": {
    "en": "Inventory summary",
    "fr": "Résumé de l'inventaire",
    "pt": "Resumo do estoque"
  },
  "Cerrar formulario": {
    "en": "Close form",
    "fr": "Fermer le formulaire",
    "pt": "Fechar formulário"
  },
  "Ej. Amoxicilina": {
    "en": "E.g. Amoxicillin",
    "fr": "Ex. : amoxicilline",
    "pt": "Ex.: Amoxicilina"
  },
  "Ej. Frasco de 100 ml": {
    "en": "E.g. 100 ml bottle",
    "fr": "Ex. : flacon de 100 ml",
    "pt": "Ex.: frasco de 100 ml"
  },
  "Información general del medicamento...": {
    "en": "General medication information...",
    "fr": "Informations générales sur le médicament...",
    "pt": "Informações gerais do medicamento..."
  },
  "Ej. 250 mg": {
    "en": "E.g. 250 mg",
    "fr": "Ex. : 250 mg",
    "pt": "Ex.: 250 mg"
  },
  "Nombre, presentación o concentración...": {
    "en": "Name, form or concentration...",
    "fr": "Nom, présentation ou concentration...",
    "pt": "Nome, apresentação ou concentração..."
  },
  "Editar medicamento": {
    "en": "Edit medication",
    "fr": "Modifier le médicament",
    "pt": "Editar medicamento"
  },
  "Administración de Servicios 🩺": {
    "en": "Service Management 🩺",
    "fr": "Gestion des services 🩺",
    "pt": "Administração de serviços 🩺"
  },
  "Registra, consulta y administra los servicios disponibles en la veterinaria.": {
    "en": "Create, view and manage veterinary services.",
    "fr": "Créez, consultez et gérez les services vétérinaires.",
    "pt": "Cadastre, consulte e administre os serviços veterinários."
  },
  "+ Nuevo servicio": {
    "en": "+ New service",
    "fr": "+ Nouveau service",
    "pt": "+ Novo serviço"
  },
  "Total de servicios registrados": {
    "en": "Total registered services",
    "fr": "Total des services enregistrés",
    "pt": "Total de serviços cadastrados"
  },
  "Completa los datos del servicio veterinario.": {
    "en": "Complete the veterinary service details.",
    "fr": "Complétez les informations du service vétérinaire.",
    "pt": "Preencha os dados do serviço veterinário."
  },
  "Información del servicio veterinario": {
    "en": "Veterinary service information",
    "fr": "Informations sur le service vétérinaire",
    "pt": "Informações do serviço veterinário"
  },
  "Nombre del servicio": {
    "en": "Service name",
    "fr": "Nom du service",
    "pt": "Nome do serviço"
  },
  "El nombre del servicio es obligatorio.": {
    "en": "Service name is required.",
    "fr": "Le nom du service est obligatoire.",
    "pt": "O nome do serviço é obrigatório."
  },
  "La descripción del servicio es obligatoria.": {
    "en": "Service description is required.",
    "fr": "La description du service est obligatoire.",
    "pt": "A descrição do serviço é obrigatória."
  },
  "Precio en dólares (USD)": {
    "en": "Price in US dollars (USD)",
    "fr": "Prix en dollars américains (USD)",
    "pt": "Preço em dólares (USD)"
  },
  "Ingresa un valor mayor que cero.": {
    "en": "Enter a value greater than zero.",
    "fr": "Saisissez une valeur supérieure à zéro.",
    "pt": "Digite um valor maior que zero."
  },
  "El precio es obligatorio.": {
    "en": "Price is required.",
    "fr": "Le prix est obligatoire.",
    "pt": "O preço é obrigatório."
  },
  "El precio debe ser mayor que cero.": {
    "en": "Price must be greater than zero.",
    "fr": "Le prix doit être supérieur à zéro.",
    "pt": "O preço deve ser maior que zero."
  },
  "Servicios registrados": {
    "en": "Registered services",
    "fr": "Services enregistrés",
    "pt": "Serviços cadastrados"
  },
  "Consulta los tratamientos y servicios disponibles en la clínica.": {
    "en": "View treatments and services offered by the clinic.",
    "fr": "Consultez les traitements et services proposés par la clinique.",
    "pt": "Consulte os tratamentos e serviços disponíveis na clínica."
  },
  "Buscar servicio": {
    "en": "Search services",
    "fr": "Rechercher un service",
    "pt": "Buscar serviço"
  },
  "Puedes buscar por nombre o descripción.": {
    "en": "You can search by name or description.",
    "fr": "Vous pouvez chercher par nom ou description.",
    "pt": "Você pode buscar pelo nome ou descrição."
  },
  "Ordenar servicios": {
    "en": "Sort services",
    "fr": "Trier les services",
    "pt": "Ordenar serviços"
  },
  "Menor precio primero": {
    "en": "Lowest price first",
    "fr": "Prix croissant",
    "pt": "Menor preço primeiro"
  },
  "Mayor precio primero": {
    "en": "Highest price first",
    "fr": "Prix décroissant",
    "pt": "Maior preço primeiro"
  },
  "Consultando los servicios registrados...": {
    "en": "Loading registered services...",
    "fr": "Chargement des services enregistrés...",
    "pt": "Consultando serviços cadastrados..."
  },
  "No hay servicios registrados": {
    "en": "No services registered",
    "fr": "Aucun service enregistré",
    "pt": "Nenhum serviço cadastrado"
  },
  "Todavía no existen servicios veterinarios registrados en el sistema.": {
    "en": "There are no veterinary services registered yet.",
    "fr": "Aucun service vétérinaire n'est encore enregistré.",
    "pt": "Ainda não há serviços veterinários cadastrados."
  },
  "+ Registrar primer servicio": {
    "en": "+ Register first service",
    "fr": "+ Enregistrer le premier service",
    "pt": "+ Cadastrar primeiro serviço"
  },
  "No encontramos servicios": {
    "en": "No services found",
    "fr": "Aucun service trouvé",
    "pt": "Nenhum serviço encontrado"
  },
  "Prueba con otro nombre o descripción.": {
    "en": "Try another name or description.",
    "fr": "Essayez un autre nom ou une autre description.",
    "pt": "Tente outro nome ou descrição."
  },
  "Precio del servicio": {
    "en": "Service price",
    "fr": "Prix du service",
    "pt": "Preço do serviço"
  },
  "Ejemplo: Consulta veterinaria": {
    "en": "Example: veterinary consultation",
    "fr": "Exemple : consultation vétérinaire",
    "pt": "Exemplo: consulta veterinária"
  },
  "Describe en qué consiste el servicio": {
    "en": "Describe what the service includes",
    "fr": "Décrivez ce que comprend le service",
    "pt": "Descreva o que inclui o serviço"
  },
  "Ejemplo: 20.00": {
    "en": "Example: 20.00",
    "fr": "Exemple : 20,00",
    "pt": "Exemplo: 20,00"
  },
  "Ejemplo: consulta o vacunación": {
    "en": "Example: consultation or vaccination",
    "fr": "Exemple : consultation ou vaccination",
    "pt": "Exemplo: consulta ou vacinação"
  },
  "Administración de Veterinarios 👨‍⚕️": {
    "en": "Veterinarian Management 👨‍⚕️",
    "fr": "Gestion des vétérinaires 👨‍⚕️",
    "pt": "Administração de veterinários 👨‍⚕️"
  },
  "Asigna cuentas existentes, registra especialidades y administra los profesionales de la clínica.": {
    "en": "Assign existing accounts, record specialties and manage clinic professionals.",
    "fr": "Affectez des comptes existants, saisissez les spécialités et gérez les professionnels de la clinique.",
    "pt": "Vincule contas existentes, registre especialidades e gerencie os profissionais da clínica."
  },
  "+ Nuevo veterinario": {
    "en": "+ New veterinarian",
    "fr": "+ Nouveau vétérinaire",
    "pt": "+ Novo veterinário"
  },
  "Total de veterinarios registrados": {
    "en": "Total registered veterinarians",
    "fr": "Total des vétérinaires enregistrés",
    "pt": "Total de veterinários cadastrados"
  },
  "Información del veterinario": {
    "en": "Veterinarian information",
    "fr": "Informations du vétérinaire",
    "pt": "Informações do veterinário"
  },
  "Cuenta de usuario existente": {
    "en": "Existing user account",
    "fr": "Compte utilisateur existant",
    "pt": "Conta de usuário existente"
  },
  "Selecciona una cuenta...": {
    "en": "Select an account...",
    "fr": "Sélectionnez un compte...",
    "pt": "Selecione uma conta..."
  },
  "Solo aparecen cuentas con correo verificado y rol USER, pendientes o aprobadas.": {
    "en": "Only accounts with verified email and USER role, pending or approved, are shown.",
    "fr": "Seuls les comptes avec e-mail vérifié et rôle USER, en attente ou approuvés, sont affichés.",
    "pt": "São exibidas apenas contas com e-mail verificado e papel USER, pendentes ou aprovadas."
  },
  "Debes seleccionar una cuenta de usuario.": {
    "en": "You must select a user account.",
    "fr": "Vous devez sélectionner un compte utilisateur.",
    "pt": "Você deve selecionar uma conta de usuário."
  },
  "Consultando cuentas disponibles...": {
    "en": "Loading available accounts...",
    "fr": "Chargement des comptes disponibles...",
    "pt": "Consultando contas disponíveis..."
  },
  "No se pudieron consultar las cuentas.": {
    "en": "Unable to load accounts.",
    "fr": "Impossible de consulter les comptes.",
    "pt": "Não foi possível consultar as contas."
  },
  "No hay cuentas disponibles": {
    "en": "No accounts available",
    "fr": "Aucun compte disponible",
    "pt": "Nenhuma conta disponível"
  },
  "Primero debe existir un usuario registrado que haya verificado su correo electrónico.": {
    "en": "A registered user with verified email must exist first.",
    "fr": "Un utilisateur inscrit avec une adresse e-mail vérifiée doit d'abord exister.",
    "pt": "Primeiro deve existir um usuário cadastrado com e-mail verificado."
  },
  "↻ Consultar nuevamente": {
    "en": "↻ Load again",
    "fr": "↻ Consulter à nouveau",
    "pt": "↻ Consultar novamente"
  },
  "Cuenta seleccionada": {
    "en": "Selected account",
    "fr": "Compte sélectionné",
    "pt": "Conta selecionada"
  },
  "La cuenta vinculada se conserva sin cambios.": {
    "en": "The linked account remains unchanged.",
    "fr": "Le compte associé reste inchangé.",
    "pt": "A conta vinculada permanece inalterada."
  },
  "Exactamente 10 dígitos numéricos.": {
    "en": "Exactly 10 digits.",
    "fr": "Exactement 10 chiffres.",
    "pt": "Exatamente 10 dígitos."
  },
  "La cédula es obligatoria.": {
    "en": "ID number is required.",
    "fr": "Le numéro d'identité est obligatoire.",
    "pt": "O número de identidade é obrigatório."
  },
  "La cédula debe contener 10 números.": {
    "en": "The ID number must contain 10 digits.",
    "fr": "Le numéro d'identité doit contenir 10 chiffres.",
    "pt": "O número de identidade deve conter 10 dígitos."
  },
  "La especialidad es obligatoria.": {
    "en": "Specialty is required.",
    "fr": "La spécialité est obligatoire.",
    "pt": "A especialidade é obrigatória."
  },
  "El teléfono es obligatorio.": {
    "en": "Phone number is required.",
    "fr": "Le téléphone est obligatoire.",
    "pt": "O telefone é obrigatório."
  },
  "¿Qué sucederá al registrar?": {
    "en": "What happens upon registration?",
    "fr": "Que se passe-t-il lors de l'inscription ?",
    "pt": "O que acontecerá ao cadastrar?"
  },
  "Se vinculará la cuenta seleccionada, se creará su ficha profesional y el sistema le asignará automáticamente el rol VETERINARIO. Su correo y contraseña originales se conservarán.": {
    "en": "The selected account will be linked, a professional record created and the VETERINARIO role assigned automatically. Its email and password will be preserved.",
    "fr": "Le compte sélectionné sera associé, une fiche professionnelle sera créée et le rôle VETERINARIO sera attribué automatiquement. L'e-mail et le mot de passe seront conservés.",
    "pt": "A conta selecionada será vinculada, será criada uma ficha profissional e o papel VETERINARIO será atribuído automaticamente. O e-mail e a senha serão mantidos."
  },
  "Veterinarios registrados": {
    "en": "Registered veterinarians",
    "fr": "Vétérinaires enregistrés",
    "pt": "Veterinários cadastrados"
  },
  "Consulta y administra las fichas profesionales.": {
    "en": "View and manage professional records.",
    "fr": "Consultez et gérez les fiches professionnelles.",
    "pt": "Consulte e administre os cadastros profissionais."
  },
  "No se pudo cargar el listado.": {
    "en": "Unable to load the list.",
    "fr": "Impossible de charger la liste.",
    "pt": "Não foi possível carregar a lista."
  },
  "Consultando veterinarios...": {
    "en": "Loading veterinarians...",
    "fr": "Chargement des vétérinaires...",
    "pt": "Consultando veterinários..."
  },
  "Buscar veterinario": {
    "en": "Search veterinarians",
    "fr": "Rechercher un vétérinaire",
    "pt": "Buscar veterinário"
  },
  "También puedes buscar por teléfono o especialidad.": {
    "en": "You can also search by phone or specialty.",
    "fr": "Vous pouvez aussi rechercher par téléphone ou spécialité.",
    "pt": "Você também pode buscar por telefone ou especialidade."
  },
  "Todas las especialidades": {
    "en": "All specialties",
    "fr": "Toutes les spécialités",
    "pt": "Todas as especialidades"
  },
  "Ordenar": {
    "en": "Sort",
    "fr": "Trier",
    "pt": "Ordenar"
  },
  "Especialidad (A-Z)": {
    "en": "Specialty (A-Z)",
    "fr": "Spécialité (A-Z)",
    "pt": "Especialidade (A-Z)"
  },
  "Todavía no hay veterinarios": {
    "en": "No veterinarians yet",
    "fr": "Aucun vétérinaire pour le moment",
    "pt": "Ainda não há veterinários"
  },
  "Puedes asignar como veterinario a una persona que ya tenga una cuenta registrada y verificada.": {
    "en": "You can assign the veterinarian role to someone with an existing verified account.",
    "fr": "Vous pouvez attribuer le rôle de vétérinaire à une personne possédant un compte vérifié.",
    "pt": "Você pode atribuir a função de veterinário a alguém com uma conta existente e verificada."
  },
  "+ Asignar primer veterinario": {
    "en": "+ Assign first veterinarian",
    "fr": "+ Affecter le premier vétérinaire",
    "pt": "+ Vincular primeiro veterinário"
  },
  "No encontramos veterinarios": {
    "en": "No veterinarians found",
    "fr": "Aucun vétérinaire trouvé",
    "pt": "Nenhum veterinário encontrado"
  },
  "Prueba con otro nombre o especialidad.": {
    "en": "Try another name or specialty.",
    "fr": "Essayez un autre nom ou une autre spécialité.",
    "pt": "Tente outro nome ou especialidade."
  },
  "Profesional veterinario": {
    "en": "Veterinary professional",
    "fr": "Professionnel vétérinaire",
    "pt": "Profissional veterinário"
  },
  "Medicina general": {
    "en": "General medicine",
    "fr": "Médecine générale",
    "pt": "Medicina geral"
  },
  "Nombre, cédula, correo...": {
    "en": "Name, ID number, email...",
    "fr": "Nom, identité, e-mail...",
    "pt": "Nome, documento, e-mail..."
  },
  "🩺 Mis Atenciones Médicas": {
    "en": "🩺 My Medical Consultations",
    "fr": "🩺 Mes consultations médicales",
    "pt": "🩺 Meus atendimentos médicos"
  },
  "Consulta los diagnósticos, tratamientos e historial clínico de tus mascotas.": {
    "en": "View your pets' diagnoses, treatments and medical history.",
    "fr": "Consultez les diagnostics, traitements et antécédents médicaux de vos animaux.",
    "pt": "Consulte os diagnósticos, tratamentos e histórico clínico dos seus animais."
  },
  "Mis mascotas": {
    "en": "My pets",
    "fr": "Mes animaux",
    "pt": "Meus animais"
  },
  "Atenciones registradas": {
    "en": "Registered consultations",
    "fr": "Consultations enregistrées",
    "pt": "Atendimentos registrados"
  },
  "Historial clínico": {
    "en": "Medical history",
    "fr": "Historique clinique",
    "pt": "Histórico clínico"
  },
  "Filtrar por mascota": {
    "en": "Filter by pet",
    "fr": "Filtrer par animal",
    "pt": "Filtrar por animal"
  },
  "Todas mis mascotas": {
    "en": "All my pets",
    "fr": "Tous mes animaux",
    "pt": "Todos os meus animais"
  },
  "Consultando el historial médico de tus mascotas...": {
    "en": "Loading your pets' medical history...",
    "fr": "Chargement de l'historique médical de vos animaux...",
    "pt": "Consultando o histórico médico dos seus animais..."
  },
  "Todavía no tienes mascotas registradas.": {
    "en": "You have no pets registered yet.",
    "fr": "Vous n'avez pas encore enregistré d'animaux.",
    "pt": "Você ainda não cadastrou animais."
  },
  "🐾 Registrar mi mascota": {
    "en": "🐾 Register my pet",
    "fr": "🐾 Enregistrer mon animal",
    "pt": "🐾 Cadastrar meu animal"
  },
  "Tus mascotas todavía no tienen atenciones médicas registradas.": {
    "en": "Your pets don't have medical consultation records yet.",
    "fr": "Vos animaux n'ont pas encore de consultations médicales enregistrées.",
    "pt": "Seus animais ainda não têm atendimentos médicos registrados."
  },
  "📅 Consultar mis citas": {
    "en": "📅 View my appointments",
    "fr": "📅 Voir mes rendez-vous",
    "pt": "📅 Consultar minhas consultas"
  },
  "No se encontraron atenciones con los filtros seleccionados.": {
    "en": "No consultations match the selected filters.",
    "fr": "Aucune consultation ne correspond aux filtres sélectionnés.",
    "pt": "Nenhum atendimento corresponde aos filtros selecionados."
  },
  "Medicamentos utilizados": {
    "en": "Medications administered",
    "fr": "Médicaments utilisés",
    "pt": "Medicamentos utilizados"
  },
  "Medicamentos recetados": {
    "en": "Prescribed medications",
    "fr": "Médicaments prescrits",
    "pt": "Medicamentos prescritos"
  },
  "Los medicamentos registrados en la factura pueden consultarse desde Mis Facturas.": {
    "en": "You can view medications listed on the invoice under My Invoices.",
    "fr": "Vous pouvez consulter les médicaments facturés dans Mes factures.",
    "pt": "Os medicamentos faturados podem ser consultados em Minhas faturas."
  },
  "🧾 Consultar mis facturas": {
    "en": "🧾 View my invoices",
    "fr": "🧾 Voir mes factures",
    "pt": "🧾 Consultar minhas faturas"
  },
  "Resumen clínico de mis mascotas": {
    "en": "My pets' clinical summary",
    "fr": "Résumé clinique de mes animaux",
    "pt": "Resumo clínico dos meus animais"
  },
  "Mascota, diagnóstico o veterinario": {
    "en": "Pet, diagnosis or veterinarian",
    "fr": "Animal, diagnostic ou vétérinaire",
    "pt": "Animal, diagnóstico ou veterinário"
  },
  "Registra el diagnóstico y tratamiento de tus pacientes y consulta las atenciones realizadas.": {
    "en": "Record patient diagnoses and treatments, and view completed consultations.",
    "fr": "Enregistrez les diagnostics et traitements des patients et consultez les soins effectués.",
    "pt": "Registre diagnósticos e tratamentos dos pacientes e consulte os atendimentos realizados."
  },
  "Listas para atender": {
    "en": "Ready for consultation",
    "fr": "Prêts pour consultation",
    "pt": "Prontas para atendimento"
  },
  "Mis atenciones": {
    "en": "My consultations",
    "fr": "Mes consultations",
    "pt": "Meus atendimentos"
  },
  "Citas pendientes": {
    "en": "Pending appointments",
    "fr": "Rendez-vous en attente",
    "pt": "Consultas pendentes"
  },
  "No se pudo cargar toda la información clínica. Comprueba la conexión con el backend y presiona Actualizar datos.": {
    "en": "Unable to load all clinical information. Check the backend connection and click Refresh data.",
    "fr": "Impossible de charger toutes les informations cliniques. Vérifiez la connexion et actualisez les données.",
    "pt": "Não foi possível carregar todas as informações clínicas. Verifique a conexão com o backend e atualize os dados."
  },
  "🐾 Nueva atención médica": {
    "en": "🐾 New medical consultation",
    "fr": "🐾 Nouvelle consultation médicale",
    "pt": "🐾 Novo atendimento médico"
  },
  "Selecciona una cita confirmada y registra la información médica del paciente.": {
    "en": "Select a confirmed appointment and record the patient's medical information.",
    "fr": "Sélectionnez un rendez-vous confirmé et saisissez les informations médicales du patient.",
    "pt": "Selecione uma consulta confirmada e registre as informações médicas do paciente."
  },
  "Información importante": {
    "en": "Important information",
    "fr": "Information importante",
    "pt": "Informação importante"
  },
  "Solo puedes registrar atenciones de citas CONFIRMADAS que tengas asignadas. Al guardar la atención, el backend marcará automáticamente la cita como COMPLETADA.": {
    "en": "You can only record consultations for CONFIRMED appointments assigned to you. Saving will automatically mark them COMPLETED.",
    "fr": "Vous ne pouvez enregistrer que les consultations de rendez-vous CONFIRMÉS qui vous sont attribués. L'enregistrement les marquera comme TERMINÉS.",
    "pt": "Você só pode registrar atendimentos de consultas CONFIRMADAS atribuídas a você. Ao salvar, o sistema as marcará como CONCLUÍDAS."
  },
  "Consultando citas y atenciones médicas...": {
    "en": "Loading appointments and consultations...",
    "fr": "Chargement des rendez-vous et consultations...",
    "pt": "Consultando consultas e atendimentos médicos..."
  },
  "No tienes citas confirmadas disponibles para registrar una atención. Puedes revisar tus citas desde el menú lateral.": {
    "en": "You have no confirmed appointments available for a consultation. Check your appointments in the sidebar.",
    "fr": "Aucun rendez-vous confirmé disponible pour enregistrer une consultation. Consultez vos rendez-vous dans le menu latéral.",
    "pt": "Você não tem consultas confirmadas disponíveis. Veja suas consultas no menu lateral."
  },
  "Seleccionar cita confirmada *": {
    "en": "Select confirmed appointment *",
    "fr": "Sélectionner un rendez-vous confirmé *",
    "pt": "Selecionar consulta confirmada *"
  },
  "Selecciona una cita...": {
    "en": "Select an appointment...",
    "fr": "Sélectionnez un rendez-vous...",
    "pt": "Selecione uma consulta..."
  },
  "Debes seleccionar una cita confirmada.": {
    "en": "You must select a confirmed appointment.",
    "fr": "Vous devez sélectionner un rendez-vous confirmé.",
    "pt": "Você deve selecionar uma consulta confirmada."
  },
  "Diagnóstico *": {
    "en": "Diagnosis *",
    "fr": "Diagnostic *",
    "pt": "Diagnóstico *"
  },
  "Campo obligatorio. Máximo 2000 caracteres.": {
    "en": "Required field. Maximum 2000 characters.",
    "fr": "Champ obligatoire. 2 000 caractères maximum.",
    "pt": "Campo obrigatório. Máximo de 2.000 caracteres."
  },
  "Escribe un diagnóstico válido.": {
    "en": "Enter a valid diagnosis.",
    "fr": "Saisissez un diagnostic valide.",
    "pt": "Digite um diagnóstico válido."
  },
  "Tratamiento *": {
    "en": "Treatment *",
    "fr": "Traitement *",
    "pt": "Tratamento *"
  },
  "Escribe el tratamiento de la mascota.": {
    "en": "Enter the pet's treatment.",
    "fr": "Décrivez le traitement de l'animal.",
    "pt": "Descreva o tratamento do animal."
  },
  "(opcional)": {
    "en": "(optional)",
    "fr": "(facultatif)",
    "pt": "(opcional)"
  },
  "Máximo 2000 caracteres.": {
    "en": "Maximum 2000 characters.",
    "fr": "2 000 caractères maximum.",
    "pt": "Máximo de 2.000 caracteres."
  },
  "📋 Mis atenciones registradas": {
    "en": "📋 My recorded consultations",
    "fr": "📋 Mes consultations enregistrées",
    "pt": "📋 Meus atendimentos registrados"
  },
  "Historial de los pacientes que has atendido.": {
    "en": "History of the patients you treated.",
    "fr": "Historique des patients que vous avez soignés.",
    "pt": "Histórico dos pacientes atendidos por você."
  },
  "Cargando historial médico...": {
    "en": "Loading medical history...",
    "fr": "Chargement de l'historique médical...",
    "pt": "Carregando histórico médico..."
  },
  "Todavía no tienes atenciones médicas registradas.": {
    "en": "You have no recorded medical consultations yet.",
    "fr": "Vous n'avez pas encore de consultations médicales enregistrées.",
    "pt": "Você ainda não tem atendimentos médicos registrados."
  },
  "Describe el diagnóstico clínico...": {
    "en": "Describe the clinical diagnosis...",
    "fr": "Décrivez le diagnostic clinique...",
    "pt": "Descreva o diagnóstico clínico..."
  },
  "Describe el tratamiento recomendado...": {
    "en": "Describe the recommended treatment...",
    "fr": "Décrivez le traitement recommandé...",
    "pt": "Descreva o tratamento recomendado..."
  },
  "Anota indicaciones adicionales, cuidados o recomendaciones...": {
    "en": "Enter additional instructions, care or recommendations...",
    "fr": "Saisissez des instructions, soins ou recommandations supplémentaires...",
    "pt": "Anote instruções, cuidados ou recomendações adicionais..."
  },
  "Mis Citas 📅": {
    "en": "My Appointments 📅",
    "fr": "Mes rendez-vous 📅",
    "pt": "Minhas consultas 📅"
  },
  "Agenda y consulta las citas veterinarias de tus mascotas.": {
    "en": "Book and view veterinary appointments for your pets.",
    "fr": "Prenez rendez-vous et consultez les consultations de vos animaux.",
    "pt": "Agende e consulte os atendimentos veterinários dos seus animais."
  },
  "+ Agendar cita": {
    "en": "+ Book appointment",
    "fr": "+ Prendre rendez-vous",
    "pt": "+ Agendar consulta"
  },
  "Primero registra una mascota": {
    "en": "Register a pet first",
    "fr": "Enregistrez d'abord un animal",
    "pt": "Cadastre primeiro um animal"
  },
  "Para agendar una cita veterinaria necesitas tener al menos una mascota registrada en tu cuenta.": {
    "en": "To book a veterinary appointment, you need at least one pet on your account.",
    "fr": "Pour prendre rendez-vous, vous devez d'abord enregistrer au moins un animal.",
    "pt": "Para agendar uma consulta, você precisa ter ao menos um animal cadastrado."
  },
  "Ir a Mis Mascotas": {
    "en": "Go to My Pets",
    "fr": "Aller à Mes animaux",
    "pt": "Ir para Meus animais"
  },
  "Selecciona los datos y completa la información solicitada.": {
    "en": "Select the details and complete the requested information.",
    "fr": "Sélectionnez les données et complétez les informations demandées.",
    "pt": "Selecione os dados e preencha as informações solicitadas."
  },
  "Datos de la cita veterinaria": {
    "en": "Veterinary appointment details",
    "fr": "Détails du rendez-vous vétérinaire",
    "pt": "Dados da consulta veterinária"
  },
  "Selecciona la fecha y hora de tu cita.": {
    "en": "Select your appointment date and time.",
    "fr": "Sélectionnez la date et l'heure du rendez-vous.",
    "pt": "Selecione a data e o horário da consulta."
  },
  "Selecciona una fecha y hora futuras.": {
    "en": "Select a future date and time.",
    "fr": "Sélectionnez une date et une heure futures.",
    "pt": "Selecione uma data e horário futuros."
  },
  "Explica brevemente el motivo de la cita.": {
    "en": "Briefly explain the reason for the appointment.",
    "fr": "Expliquez brièvement le motif du rendez-vous.",
    "pt": "Explique brevemente o motivo da consulta."
  },
  "Mis citas registradas": {
    "en": "My registered appointments",
    "fr": "Mes rendez-vous enregistrés",
    "pt": "Minhas consultas registradas"
  },
  "Consulta fechas, servicios y estados de tus citas veterinarias.": {
    "en": "View dates, services and statuses of your veterinary appointments.",
    "fr": "Consultez les dates, services et statuts de vos rendez-vous vétérinaires.",
    "pt": "Consulte datas, serviços e status das suas consultas."
  },
  "Consultando tus citas veterinarias...": {
    "en": "Loading your appointments...",
    "fr": "Chargement de vos rendez-vous...",
    "pt": "Consultando suas consultas..."
  },
  "Todavía no tienes citas registradas": {
    "en": "You have no appointments yet",
    "fr": "Vous n'avez pas encore de rendez-vous",
    "pt": "Você ainda não tem consultas cadastradas"
  },
  "Agenda tu primera cita para recibir atención veterinaria para tu mascota.": {
    "en": "Book your first appointment to get veterinary care for your pet.",
    "fr": "Prenez votre premier rendez-vous pour les soins vétérinaires de votre animal.",
    "pt": "Agende sua primeira consulta para cuidar do seu animal."
  },
  "+ Agendar mi primera cita": {
    "en": "+ Book my first appointment",
    "fr": "+ Prendre mon premier rendez-vous",
    "pt": "+ Agendar minha primeira consulta"
  },
  "Prueba otro nombre o selecciona otro estado.": {
    "en": "Try another name or select another status.",
    "fr": "Essayez un autre nom ou sélectionnez un autre statut.",
    "pt": "Tente outro nome ou selecione outro status."
  },
  "Hora": {
    "en": "Time",
    "fr": "Heure",
    "pt": "Hora"
  },
  "Esta cita fue cancelada y permanece en tu historial.": {
    "en": "This appointment was cancelled and remains in your history.",
    "fr": "Ce rendez-vous a été annulé et reste dans votre historique.",
    "pt": "Esta consulta foi cancelada e permanece no histórico."
  },
  "Ejemplo: Vacunación anual de mi mascota": {
    "en": "Example: annual pet vaccination",
    "fr": "Exemple : vaccination annuelle de mon animal",
    "pt": "Exemplo: vacinação anual do meu animal"
  },
  "Mascota, servicio, motivo...": {
    "en": "Pet, service, reason...",
    "fr": "Animal, service, motif...",
    "pt": "Animal, serviço, motivo..."
  },
  "Mis citas asignadas": {
    "en": "My assigned appointments",
    "fr": "Mes rendez-vous attribués",
    "pt": "Minhas consultas atribuídas"
  },
  "Consulta tus pacientes y administra las citas que te han asignado.": {
    "en": "View your patients and manage your assigned appointments.",
    "fr": "Consultez vos patients et gérez les rendez-vous qui vous sont attribués.",
    "pt": "Consulte seus pacientes e administre suas consultas atribuídas."
  },
  "Total asignadas": {
    "en": "Total assigned",
    "fr": "Total attribué",
    "pt": "Total atribuído"
  },
  "🐾 Pacientes y citas": {
    "en": "🐾 Patients and appointments",
    "fr": "🐾 Patients et rendez-vous",
    "pt": "🐾 Pacientes e consultas"
  },
  "Aquí se muestran únicamente las citas asignadas a tu cuenta de veterinario.": {
    "en": "Only appointments assigned to your veterinarian account are shown here.",
    "fr": "Seuls les rendez-vous attribués à votre compte vétérinaire s'affichent ici.",
    "pt": "Aqui são exibidas apenas consultas atribuídas à sua conta de veterinário."
  },
  "Todas las citas": {
    "en": "All appointments",
    "fr": "Tous les rendez-vous",
    "pt": "Todas as consultas"
  },
  "⏳ Cargando tus citas asignadas...": {
    "en": "⏳ Loading your assigned appointments...",
    "fr": "⏳ Chargement de vos rendez-vous...",
    "pt": "⏳ Carregando suas consultas atribuídas..."
  },
  "🐾 Todavía no tienes citas asignadas.": {
    "en": "🐾 You have no assigned appointments yet.",
    "fr": "🐾 Vous n'avez pas encore de rendez-vous attribués.",
    "pt": "🐾 Você ainda não tem consultas atribuídas."
  },
  "🔎 No encontramos citas que coincidan con los filtros seleccionados.": {
    "en": "🔎 No appointments match the selected filters.",
    "fr": "🔎 Aucun rendez-vous ne correspond aux filtres sélectionnés.",
    "pt": "🔎 Nenhuma consulta corresponde aos filtros selecionados."
  },
  "✓ Aceptar": {
    "en": "✓ Accept",
    "fr": "✓ Accepter",
    "pt": "✓ Aceitar"
  },
  "✓ Lista para atención": {
    "en": "✓ Ready for consultation",
    "fr": "✓ Prêt pour la consultation",
    "pt": "✓ Pronta para atendimento"
  },
  "Atención finalizada": {
    "en": "Consultation completed",
    "fr": "Consultation terminée",
    "pt": "Atendimento concluído"
  },
  "? Esta acción actualizará su estado en el sistema.": {
    "en": "? This action will update its status in the system.",
    "fr": "? Cette action mettra à jour son statut dans le système.",
    "pt": "? Esta ação atualizará o status no sistema."
  },
  "Mascota, propietario, servicio...": {
    "en": "Pet, owner, service...",
    "fr": "Animal, propriétaire, service...",
    "pt": "Animal, tutor, serviço..."
  },
  "🩺 PANEL ADMINISTRATIVO": {
    "en": "🩺 ADMINISTRATION DASHBOARD",
    "fr": "🩺 TABLEAU DE BORD ADMINISTRATIF",
    "pt": "🩺 PAINEL ADMINISTRATIVO"
  },
  "¡Hola, administrador!": {
    "en": "Hello, administrator!",
    "fr": "Bonjour, administrateur !",
    "pt": "Olá, administrador!"
  },
  "Este es el resumen de la actividad de Veterinaria Arévalo.": {
    "en": "Here is a summary of Veterinaria Arévalo's activity.",
    "fr": "Voici un résumé de l'activité de Veterinaria Arévalo.",
    "pt": "Este é o resumo das atividades da Veterinaria Arévalo."
  },
  "🐾 GESTIÓN Y BIENESTAR ANIMAL": {
    "en": "🐾 ANIMAL CARE AND MANAGEMENT",
    "fr": "🐾 GESTION ET BIEN-ÊTRE ANIMAL",
    "pt": "🐾 GESTÃO E BEM-ESTAR ANIMAL"
  },
  "Cuidamos lo que más quieres.": {
    "en": "We care for those you love most.",
    "fr": "Nous prenons soin de ceux que vous aimez.",
    "pt": "Cuidamos de quem você mais ama."
  },
  "Organiza las citas, supervisa las atenciones y controla la actividad de la clínica desde un solo lugar.": {
    "en": "Manage appointments, oversee care and monitor clinic activity in one place.",
    "fr": "Gérez les rendez-vous, supervisez les soins et suivez l'activité de la clinique au même endroit.",
    "pt": "Organize consultas, acompanhe atendimentos e controle as atividades da clínica em um só lugar."
  },
  "📅 Revisar citas": {
    "en": "📅 Review appointments",
    "fr": "📅 Voir les rendez-vous",
    "pt": "📅 Revisar consultas"
  },
  "⚠️ Algunas consultas no respondieron. Comprueba la conexión con Spring Boot y los permisos de acceso.": {
    "en": "⚠️ Some requests failed. Check the Spring Boot connection and access permissions.",
    "fr": "⚠️ Certaines requêtes ont échoué. Vérifiez la connexion à Spring Boot et les autorisations.",
    "pt": "⚠️ Algumas consultas falharam. Verifique a conexão com Spring Boot e as permissões de acesso."
  },
  "Citas de hoy": {
    "en": "Today's appointments",
    "fr": "Rendez-vous du jour",
    "pt": "Consultas de hoje"
  },
  "Programadas para hoy": {
    "en": "Scheduled for today",
    "fr": "Prévus aujourd'hui",
    "pt": "Programadas para hoje"
  },
  "Registradas en la clínica": {
    "en": "Registered at the clinic",
    "fr": "Enregistrées à la clinique",
    "pt": "Registradas na clínica"
  },
  "Usuarios registrados": {
    "en": "Registered users",
    "fr": "Utilisateurs inscrits",
    "pt": "Usuários cadastrados"
  },
  "Por aprobar": {
    "en": "Awaiting approval",
    "fr": "En attente d'approbation",
    "pt": "Aguardando aprovação"
  },
  "Cuentas pendientes": {
    "en": "Pending accounts",
    "fr": "Comptes en attente",
    "pt": "Contas pendentes"
  },
  "Catálogo de la clínica": {
    "en": "Clinic catalog",
    "fr": "Catalogue de la clinique",
    "pt": "Catálogo da clínica"
  },
  "Facturas emitidas": {
    "en": "Invoices issued",
    "fr": "Factures émises",
    "pt": "Faturas emitidas"
  },
  "Total de comprobantes": {
    "en": "Total receipts",
    "fr": "Total des reçus",
    "pt": "Total de comprovantes"
  },
  "Facturas de hoy": {
    "en": "Today's invoices",
    "fr": "Factures du jour",
    "pt": "Faturas de hoje"
  },
  "Emitidas durante el día": {
    "en": "Issued today",
    "fr": "Émises aujourd'hui",
    "pt": "Emitidas durante o dia"
  },
  "Total facturado hoy": {
    "en": "Total invoiced today",
    "fr": "Total facturé aujourd'hui",
    "pt": "Total faturado hoje"
  },
  "Suma de facturas del día": {
    "en": "Sum of today's invoices",
    "fr": "Somme des factures du jour",
    "pt": "Soma das faturas do dia"
  },
  "📅 Próximas citas": {
    "en": "📅 Upcoming appointments",
    "fr": "📅 Prochains rendez-vous",
    "pt": "📅 Próximas consultas"
  },
  "Actividad programada de la clínica": {
    "en": "Scheduled clinic activity",
    "fr": "Activité prévue à la clinique",
    "pt": "Atividades programadas da clínica"
  },
  "Consultando próximas citas…": {
    "en": "Loading upcoming appointments…",
    "fr": "Chargement des prochains rendez-vous…",
    "pt": "Consultando próximas consultas…"
  },
  "No se pudo consultar las citas.": {
    "en": "Unable to load appointments.",
    "fr": "Impossible de consulter les rendez-vous.",
    "pt": "Não foi possível consultar as consultas."
  },
  "No hay próximas citas programadas.": {
    "en": "No upcoming appointments scheduled.",
    "fr": "Aucun rendez-vous à venir.",
    "pt": "Não há consultas futuras programadas."
  },
  "👥 Estado de usuarios": {
    "en": "👥 User status",
    "fr": "👥 Statut des utilisateurs",
    "pt": "👥 Status dos usuários"
  },
  "Distribución de cuentas registradas": {
    "en": "Distribution of registered accounts",
    "fr": "Répartition des comptes enregistrés",
    "pt": "Distribuição das contas cadastradas"
  },
  "Gestionar →": {
    "en": "Manage →",
    "fr": "Gérer →",
    "pt": "Gerenciar →"
  },
  "Rechazados": {
    "en": "Rejected",
    "fr": "Rejetés",
    "pt": "Rejeitados"
  },
  "Citas registradas en total": {
    "en": "Total registered appointments",
    "fr": "Nombre total de rendez-vous enregistrés",
    "pt": "Total de consultas registradas"
  },
  "🧾 Últimas facturas emitidas": {
    "en": "🧾 Latest invoices issued",
    "fr": "🧾 Dernières factures émises",
    "pt": "🧾 Últimas faturas emitidas"
  },
  "Comprobantes más recientes de Veterinaria Arévalo": {
    "en": "Most recent Veterinaria Arévalo receipts",
    "fr": "Derniers reçus de Veterinaria Arévalo",
    "pt": "Comprovantes mais recentes da Veterinaria Arévalo"
  },
  "Consultando facturas…": {
    "en": "Loading invoices…",
    "fr": "Chargement des factures…",
    "pt": "Consultando faturas…"
  },
  "No se pudieron consultar las facturas. Comprueba los permisos y la conexión con el backend.": {
    "en": "Unable to load invoices. Check permissions and backend connection.",
    "fr": "Impossible de consulter les factures. Vérifiez les autorisations et la connexion.",
    "pt": "Não foi possível consultar as faturas. Verifique permissões e conexão com backend."
  },
  "Todavía no existen facturas registradas.": {
    "en": "There are no invoices recorded yet.",
    "fr": "Aucune facture n'est encore enregistrée.",
    "pt": "Ainda não há faturas registradas."
  },
  "Mascotas sanas, historias más felices.": {
    "en": "Healthy pets, happier stories.",
    "fr": "Des animaux en bonne santé, des histoires plus heureuses.",
    "pt": "Animais saudáveis, histórias mais felizes."
  },
  "Supervisa usuarios, citas, servicios, veterinarios y facturación.": {
    "en": "Manage users, appointments, services, veterinarians and billing.",
    "fr": "Supervisez les utilisateurs, rendez-vous, services, vétérinaires et facturation.",
    "pt": "Acompanhe usuários, consultas, serviços, veterinários e faturamento."
  },
  "Ver veterinarios →": {
    "en": "View veterinarians →",
    "fr": "Voir les vétérinaires →",
    "pt": "Ver veterinários →"
  },
  "Bienvenida al administrador": {
    "en": "Administrator welcome",
    "fr": "Bienvenue à l'administrateur",
    "pt": "Boas-vindas ao administrador"
  },
  "Estadísticas generales de la veterinaria": {
    "en": "Overall clinic statistics",
    "fr": "Statistiques générales de la clinique",
    "pt": "Estatísticas gerais da clínica"
  },
  "Información administrativa": {
    "en": "Administrative information",
    "fr": "Informations administratives",
    "pt": "Informações administrativas"
  },
  "🐾 MI ESPACIO PERSONAL": {
    "en": "🐾 MY PERSONAL SPACE",
    "fr": "🐾 MON ESPACE PERSONNEL",
    "pt": "🐾 MEU ESPAÇO PESSOAL"
  },
  "¡Bienvenido a Veterinaria Arévalo!": {
    "en": "Welcome to Veterinaria Arévalo!",
    "fr": "Bienvenue à Veterinaria Arévalo !",
    "pt": "Bem-vindo à Veterinaria Arévalo!"
  },
  "Cuida a tus mejores amigos y consulta su información desde un solo lugar.": {
    "en": "Care for your best friends and view their information in one place.",
    "fr": "Prenez soin de vos meilleurs amis et consultez leurs informations au même endroit.",
    "pt": "Cuide dos seus melhores amigos e consulte seus dados em um só lugar."
  },
  "♥ ELLOS TAMBIÉN SON FAMILIA": {
    "en": "♥ THEY ARE FAMILY TOO",
    "fr": "♥ ILS FONT AUSSI PARTIE DE LA FAMILLE",
    "pt": "♥ ELES TAMBÉM SÃO FAMÍLIA"
  },
  "Su bienestar es nuestra prioridad.": {
    "en": "Their well-being is our priority.",
    "fr": "Leur bien-être est notre priorité.",
    "pt": "O bem-estar deles é nossa prioridade."
  },
  "Registra a tus mascotas, organiza las citas y mantén sus cuidados al día.": {
    "en": "Register your pets, schedule appointments and keep up with their care.",
    "fr": "Enregistrez vos animaux, organisez les rendez-vous et assurez le suivi de leurs soins.",
    "pt": "Cadastre seus animais, organize consultas e mantenha seus cuidados em dia."
  },
  "📅 Ver mis citas": {
    "en": "📅 View my appointments",
    "fr": "📅 Voir mes rendez-vous",
    "pt": "📅 Ver minhas consultas"
  },
  "⚠️ No se pudo cargar parte del resumen. Verifica que la API esté disponible.": {
    "en": "⚠️ Part of the overview could not be loaded. Make sure the API is available.",
    "fr": "⚠️ Une partie du résumé n'a pas pu être chargée. Vérifiez l'API.",
    "pt": "⚠️ Parte do resumo não foi carregada. Verifique a API."
  },
  "Mis compañeros de vida": {
    "en": "My lifelong companions",
    "fr": "Mes compagnons de vie",
    "pt": "Meus companheiros de vida"
  },
  "Mis citas": {
    "en": "My appointments",
    "fr": "Mes rendez-vous",
    "pt": "Minhas consultas"
  },
  "Registradas en el sistema": {
    "en": "Registered in the system",
    "fr": "Enregistrées dans le système",
    "pt": "Registradas no sistema"
  },
  "En espera de confirmación": {
    "en": "Awaiting confirmation",
    "fr": "En attente de confirmation",
    "pt": "Aguardando confirmação"
  },
  "Servicios disponibles": {
    "en": "Available services",
    "fr": "Services disponibles",
    "pt": "Serviços disponíveis"
  },
  "Atención para tu mascota": {
    "en": "Care for your pet",
    "fr": "Soins pour votre animal",
    "pt": "Atendimento para seu animal"
  },
  "Las citas programadas para tus mascotas": {
    "en": "Appointments scheduled for your pets",
    "fr": "Rendez-vous prévus pour vos animaux",
    "pt": "Consultas agendadas para seus animais"
  },
  "Cargando citas…": {
    "en": "Loading appointments…",
    "fr": "Chargement des rendez-vous…",
    "pt": "Carregando consultas…"
  },
  "No tienes próximas citas.": {
    "en": "You have no upcoming appointments.",
    "fr": "Vous n'avez pas de rendez-vous à venir.",
    "pt": "Você não tem próximas consultas."
  },
  "🐾 Mis mascotas": {
    "en": "🐾 My pets",
    "fr": "🐾 Mes animaux",
    "pt": "🐾 Meus animais"
  },
  "Tu familia de cuatro patas": {
    "en": "Your four-legged family",
    "fr": "Votre famille à quatre pattes",
    "pt": "Sua família de quatro patas"
  },
  "Cargando mascotas…": {
    "en": "Loading pets…",
    "fr": "Chargement des animaux…",
    "pt": "Carregando animais…"
  },
  "No se pudo consultar las mascotas.": {
    "en": "Unable to load pets.",
    "fr": "Impossible de consulter les animaux.",
    "pt": "Não foi possível consultar os animais."
  },
  "Mi mascota": {
    "en": "My pet",
    "fr": "Mon animal",
    "pt": "Meu animal"
  },
  "Pequeñas acciones, grandes historias.": {
    "en": "Small actions, great stories.",
    "fr": "De petits gestes, de grandes histoires.",
    "pt": "Pequenas ações, grandes histórias."
  },
  "Consulta los profesionales disponibles y agenda una cita cuando la necesites.": {
    "en": "Explore available professionals and book an appointment whenever you need one.",
    "fr": "Découvrez les professionnels disponibles et prenez rendez-vous quand vous en avez besoin.",
    "pt": "Conheça os profissionais disponíveis e agende uma consulta quando precisar."
  },
  "Conocer veterinarios →": {
    "en": "Meet the veterinarians →",
    "fr": "Découvrir les vétérinaires →",
    "pt": "Conhecer veterinários →"
  },
  "Bienvenida": {
    "en": "Welcome",
    "fr": "Bienvenue",
    "pt": "Boas-vindas"
  },
  "Mi resumen": {
    "en": "My overview",
    "fr": "Mon résumé",
    "pt": "Meu resumo"
  },
  "Información adicional": {
    "en": "Additional information",
    "fr": "Informations complémentaires",
    "pt": "Informações adicionais"
  },
  "¡Bienvenido, veterinario!": {
    "en": "Welcome, veterinarian!",
    "fr": "Bienvenue, vétérinaire !",
    "pt": "Bem-vindo, veterinário!"
  },
  "Consulta tus citas asignadas y el resumen de tus atenciones médicas.": {
    "en": "View your assigned appointments and medical consultation summary.",
    "fr": "Consultez vos rendez-vous attribués et le résumé de vos consultations.",
    "pt": "Consulte suas consultas atribuídas e o resumo dos atendimentos."
  },
  "💚 CADA MASCOTA MERECE EL MEJOR CUIDADO": {
    "en": "💚 EVERY PET DESERVES THE BEST CARE",
    "fr": "💚 CHAQUE ANIMAL MÉRITE LES MEILLEURS SOINS",
    "pt": "💚 TODO ANIMAL MERECE O MELHOR CUIDADO"
  },
  "Tu vocación hace la diferencia.": {
    "en": "Your dedication makes a difference.",
    "fr": "Votre vocation fait la différence.",
    "pt": "Sua vocação faz a diferença."
  },
  "Organiza tus citas y lleva el seguimiento de los pacientes que tienes asignados.": {
    "en": "Organize appointments and follow up on your assigned patients.",
    "fr": "Organisez les rendez-vous et assurez le suivi des patients qui vous sont confiés.",
    "pt": "Organize suas consultas e acompanhe os pacientes atribuídos a você."
  },
  "⚠️ No se pudo consultar toda la información. Comprueba la conexión o tus permisos de veterinario.": {
    "en": "⚠️ Unable to load all information. Check the connection or your veterinarian permissions.",
    "fr": "⚠️ Impossible de charger toutes les informations. Vérifiez la connexion ou vos autorisations.",
    "pt": "⚠️ Não foi possível consultar todos os dados. Verifique a conexão ou suas permissões de veterinário."
  },
  "Por revisar": {
    "en": "To review",
    "fr": "À examiner",
    "pt": "Para revisar"
  },
  "Registradas": {
    "en": "Registered",
    "fr": "Enregistrées",
    "pt": "Registradas"
  },
  "📅 Próximas citas asignadas": {
    "en": "📅 Upcoming assigned appointments",
    "fr": "📅 Prochains rendez-vous attribués",
    "pt": "📅 Próximas consultas atribuídas"
  },
  "Solo pacientes vinculados a tu cuenta profesional": {
    "en": "Only patients linked to your professional account",
    "fr": "Patients liés uniquement à votre compte professionnel",
    "pt": "Somente pacientes vinculados à sua conta profissional"
  },
  "Consultando tus citas…": {
    "en": "Loading your appointments…",
    "fr": "Chargement de vos rendez-vous…",
    "pt": "Consultando suas consultas…"
  },
  "Citas asignadas para hoy": {
    "en": "Appointments assigned for today",
    "fr": "Rendez-vous attribués aujourd'hui",
    "pt": "Consultas atribuídas para hoje"
  },
  "🧾 Facturas emitidas hoy": {
    "en": "🧾 Invoices issued today",
    "fr": "🧾 Factures émises aujourd'hui",
    "pt": "🧾 Faturas emitidas hoje"
  },
  "Comprobantes generados a partir de tus atenciones médicas": {
    "en": "Receipts generated from your medical consultations",
    "fr": "Reçus générés à partir de vos consultations médicales",
    "pt": "Comprovantes gerados pelos seus atendimentos médicos"
  },
  "Consultando las facturas emitidas…": {
    "en": "Loading issued invoices…",
    "fr": "Chargement des factures émises…",
    "pt": "Consultando faturas emitidas…"
  },
  "⚠️ No fue posible consultar las facturas. Comprueba la conexión e intenta actualizar los datos.": {
    "en": "⚠️ Unable to load invoices. Check the connection and refresh.",
    "fr": "⚠️ Impossible de charger les factures. Vérifiez la connexion et actualisez.",
    "pt": "⚠️ Não foi possível carregar as faturas. Verifique a conexão e atualize os dados."
  },
  "🧾 No has emitido facturas durante el día de hoy.": {
    "en": "🧾 You haven't issued any invoices today.",
    "fr": "🧾 Vous n'avez émis aucune facture aujourd'hui.",
    "pt": "🧾 Você não emitiu faturas hoje."
  },
  "Bienvenida al panel clínico": {
    "en": "Welcome to the clinical dashboard",
    "fr": "Bienvenue dans le tableau de bord clinique",
    "pt": "Boas-vindas ao painel clínico"
  },
  "Indicadores del veterinario": {
    "en": "Veterinarian indicators",
    "fr": "Indicateurs du vétérinaire",
    "pt": "Indicadores do veterinário"
  },
  "🧾 Facturación de la clínica": {
    "en": "🧾 Clinic Billing",
    "fr": "🧾 Facturation de la clinique",
    "pt": "🧾 Faturamento da clínica"
  },
  "Supervisa las facturas emitidas por todos los veterinarios y consulta los ingresos de Veterinaria Arévalo.": {
    "en": "Monitor invoices issued by all veterinarians and view Veterinaria Arévalo revenue.",
    "fr": "Supervisez les factures émises par les vétérinaires et consultez les recettes de Veterinaria Arévalo.",
    "pt": "Acompanhe as faturas emitidas por todos os veterinários e consulte as receitas da Veterinaria Arévalo."
  },
  "↓ Exportar CSV": {
    "en": "↓ Export CSV",
    "fr": "↓ Exporter en CSV",
    "pt": "↓ Exportar CSV"
  },
  "Total facturado": {
    "en": "Total billed",
    "fr": "Total facturé",
    "pt": "Total faturado"
  },
  "Facturas emitidas históricamente": {
    "en": "Invoices issued to date",
    "fr": "Factures émises à ce jour",
    "pt": "Faturas emitidas até hoje"
  },
  "Ingresos de hoy": {
    "en": "Today's revenue",
    "fr": "Recettes du jour",
    "pt": "Receitas de hoje"
  },
  "Ingresos del mes": {
    "en": "Monthly revenue",
    "fr": "Recettes du mois",
    "pt": "Receitas do mês"
  },
  "Mes actual": {
    "en": "Current month",
    "fr": "Mois en cours",
    "pt": "Mês atual"
  },
  "Correos enviados": {
    "en": "Emails sent",
    "fr": "E-mails envoyés",
    "pt": "E-mails enviados"
  },
  "BÚSQUEDA": {
    "en": "SEARCH",
    "fr": "RECHERCHE",
    "pt": "BUSCA"
  },
  "Buscar y filtrar facturas": {
    "en": "Search and filter invoices",
    "fr": "Rechercher et filtrer les factures",
    "pt": "Buscar e filtrar faturas"
  },
  "Localiza rápidamente cualquier comprobante.": {
    "en": "Find any receipt quickly.",
    "fr": "Retrouvez rapidement n'importe quel reçu.",
    "pt": "Encontre rapidamente qualquer comprovante."
  },
  "Propietario, mascota, veterinario o número": {
    "en": "Owner, pet, veterinarian or number",
    "fr": "Propriétaire, animal, vétérinaire ou numéro",
    "pt": "Tutor, animal, veterinário ou número"
  },
  "Día específico": {
    "en": "Specific day",
    "fr": "Jour précis",
    "pt": "Dia específico"
  },
  "Estado de factura": {
    "en": "Invoice status",
    "fr": "Statut de la facture",
    "pt": "Status da fatura"
  },
  "Emitidas": {
    "en": "Issued",
    "fr": "Émises",
    "pt": "Emitidas"
  },
  "Estado del correo": {
    "en": "Email status",
    "fr": "Statut de l'e-mail",
    "pt": "Status do e-mail"
  },
  "Accesos rápidos:": {
    "en": "Quick access:",
    "fr": "Accès rapide :",
    "pt": "Acesso rápido:"
  },
  "📅 Facturas de hoy": {
    "en": "📅 Today's invoices",
    "fr": "📅 Factures du jour",
    "pt": "📅 Faturas de hoje"
  },
  "📊 Este mes": {
    "en": "📊 This month",
    "fr": "📊 Ce mois-ci",
    "pt": "📊 Este mês"
  },
  "REGISTROS": {
    "en": "RECORDS",
    "fr": "ENREGISTREMENTS",
    "pt": "REGISTROS"
  },
  "Todas las facturas": {
    "en": "All invoices",
    "fr": "Toutes les factures",
    "pt": "Todas as faturas"
  },
  "Comprobantes emitidos por los profesionales de la clínica.": {
    "en": "Receipts issued by the clinic's professionals.",
    "fr": "Reçus émis par les professionnels de la clinique.",
    "pt": "Comprovantes emitidos pelos profissionais da clínica."
  },
  "Consultando facturación...": {
    "en": "Loading billing data...",
    "fr": "Chargement de la facturation...",
    "pt": "Consultando faturamento..."
  },
  "Espera mientras se recuperan los registros.": {
    "en": "Retrieving records...",
    "fr": "Récupération des enregistrements...",
    "pt": "Aguarde enquanto os registros são recuperados."
  },
  "Todavía no hay facturas": {
    "en": "No invoices yet",
    "fr": "Aucune facture pour le moment",
    "pt": "Ainda não há faturas"
  },
  "Cuando los veterinarios emitan comprobantes, aparecerán en este apartado.": {
    "en": "Receipts will appear here when veterinarians issue them.",
    "fr": "Les reçus apparaîtront ici lorsque les vétérinaires les émettront.",
    "pt": "Os comprovantes aparecerão aqui quando os veterinários os emitirem."
  },
  "No encontramos resultados": {
    "en": "No results found",
    "fr": "Aucun résultat trouvé",
    "pt": "Nenhum resultado encontrado"
  },
  "Modifica los filtros para encontrar otras facturas.": {
    "en": "Change filters to find other invoices.",
    "fr": "Modifiez les filtres pour trouver d'autres factures.",
    "pt": "Altere os filtros para encontrar outras faturas."
  },
  "Limpiar búsqueda": {
    "en": "Clear search",
    "fr": "Effacer la recherche",
    "pt": "Limpar busca"
  },
  "Número": {
    "en": "Number",
    "fr": "Numéro",
    "pt": "Número"
  },
  "DETALLE DEL COMPROBANTE": {
    "en": "RECEIPT DETAILS",
    "fr": "DÉTAILS DU REÇU",
    "pt": "DETALHES DO COMPROVANTE"
  },
  "Información del propietario": {
    "en": "Owner information",
    "fr": "Informations sur le propriétaire",
    "pt": "Informações do tutor"
  },
  "Conceptos facturados": {
    "en": "Billed items",
    "fr": "Éléments facturés",
    "pt": "Itens faturados"
  },
  "Esta atención no registra medicamentos facturados.": {
    "en": "No medications were billed for this consultation.",
    "fr": "Aucun médicament facturé pour cette consultation.",
    "pt": "Não há medicamentos faturados neste atendimento."
  },
  "Total medicamentos": {
    "en": "Medication total",
    "fr": "Total des médicaments",
    "pt": "Total de medicamentos"
  },
  "TOTAL": {
    "en": "TOTAL",
    "fr": "TOTAL",
    "pt": "TOTAL"
  },
  "Estado del envío por correo": {
    "en": "Email delivery status",
    "fr": "Statut de l'envoi par e-mail",
    "pt": "Status do envio por e-mail"
  },
  "El administrador puede supervisar el estado. El envío está reservado al veterinario responsable.": {
    "en": "The administrator can monitor status. Only the responsible veterinarian may send it.",
    "fr": "L'administrateur peut consulter le statut. L'envoi est réservé au vétérinaire responsable.",
    "pt": "O administrador pode acompanhar o status. O envio é exclusivo do veterinário responsável."
  },
  "Ej. Juan Pérez, Max o INT-00000001": {
    "en": "E.g. Juan Pérez, Max or INT-00000001",
    "fr": "Ex. : Juan Pérez, Max ou INT-00000001",
    "pt": "Ex.: Juan Pérez, Max ou INT-00000001"
  },
  "Consulta y descarga las facturas correspondientes a las atenciones veterinarias de tus mascotas.": {
    "en": "View and download invoices for your pets' veterinary care.",
    "fr": "Consultez et téléchargez les factures des soins vétérinaires de vos animaux.",
    "pt": "Consulte e baixe as faturas dos atendimentos veterinários dos seus animais."
  },
  "Comprobantes asociados a mis mascotas": {
    "en": "Receipts for my pets",
    "fr": "Reçus de mes animaux",
    "pt": "Comprovantes dos meus animais"
  },
  "Historial de mis facturas": {
    "en": "My invoice history",
    "fr": "Historique de mes factures",
    "pt": "Histórico das minhas faturas"
  },
  "Buscar factura": {
    "en": "Search invoices",
    "fr": "Rechercher une facture",
    "pt": "Buscar fatura"
  },
  "Más recientes": {
    "en": "Newest",
    "fr": "Plus récentes",
    "pt": "Mais recentes"
  },
  "Más antiguas": {
    "en": "Oldest",
    "fr": "Plus anciennes",
    "pt": "Mais antigas"
  },
  "Mayor valor de factura": {
    "en": "Highest invoice amount",
    "fr": "Montant le plus élevé",
    "pt": "Maior valor da fatura"
  },
  "Menor valor de factura": {
    "en": "Lowest invoice amount",
    "fr": "Montant le plus faible",
    "pt": "Menor valor da fatura"
  },
  "Consultando tus facturas...": {
    "en": "Loading your invoices...",
    "fr": "Chargement de vos factures...",
    "pt": "Consultando suas faturas..."
  },
  "Todavía no tienes facturas registradas. Cuando se registre una factura por la atención de una de tus mascotas, aparecerá aquí.": {
    "en": "You don't have any invoices yet. Invoices for your pets' care will appear here.",
    "fr": "Vous n'avez pas encore de factures. Celles des soins de vos animaux apparaîtront ici.",
    "pt": "Você ainda não tem faturas. As faturas dos atendimentos dos seus animais aparecerão aqui."
  },
  "No se encontraron facturas con los filtros seleccionados.": {
    "en": "No invoices match the selected filters.",
    "fr": "Aucune facture ne correspond aux filtres sélectionnés.",
    "pt": "Nenhuma fatura corresponde aos filtros selecionados."
  },
  "MI COMPROBANTE": {
    "en": "MY RECEIPT",
    "fr": "MON REÇU",
    "pt": "MEU COMPROVANTE"
  },
  "Total de esta factura": {
    "en": "Total for this invoice",
    "fr": "Total de cette facture",
    "pt": "Total desta fatura"
  },
  "Propietario:": {
    "en": "Owner:",
    "fr": "Propriétaire :",
    "pt": "Tutor:"
  },
  "Mascota:": {
    "en": "Pet:",
    "fr": "Animal :",
    "pt": "Animal:"
  },
  "Atención médica:": {
    "en": "Medical consultation:",
    "fr": "Consultation médicale :",
    "pt": "Atendimento médico:"
  },
  "Medicamentos de mi atención": {
    "en": "Medications used in my care",
    "fr": "Médicaments de ma consultation",
    "pt": "Medicamentos do meu atendimento"
  },
  "Esta factura no contiene medicamentos.": {
    "en": "This invoice contains no medications.",
    "fr": "Cette facture ne contient aucun médicament.",
    "pt": "Esta fatura não contém medicamentos."
  },
  "Total de mi factura": {
    "en": "My invoice total",
    "fr": "Total de ma facture",
    "pt": "Total da minha fatura"
  },
  "Los valores corresponden únicamente a esta factura. Los medicamentos recetados pueden tener subtotal cero cuando no fueron entregados.": {
    "en": "These amounts only apply to this invoice. Prescribed medications may have a zero subtotal if not dispensed.",
    "fr": "Ces montants concernent cette facture uniquement. Les médicaments prescrits peuvent avoir un sous-total nul s'ils n'ont pas été délivrés.",
    "pt": "Os valores correspondem apenas a esta fatura. Medicamentos prescritos podem ter subtotal zero se não forem entregues."
  },
  "Factura, mascota o servicio": {
    "en": "Invoice, pet or service",
    "fr": "Facture, animal ou service",
    "pt": "Fatura, animal ou serviço"
  },
  "Información relacionada": {
    "en": "Related information",
    "fr": "Informations associées",
    "pt": "Informações relacionadas"
  },
  "ÁREA PROFESIONAL · VETERINARIA ARÉVALO": {
    "en": "PROFESSIONAL AREA · VETERINARIA ARÉVALO",
    "fr": "ESPACE PROFESSIONNEL · VETERINARIA ARÉVALO",
    "pt": "ÁREA PROFISSIONAL · VETERINARIA ARÉVALO"
  },
  "Facturas de mis atenciones": {
    "en": "Invoices from my consultations",
    "fr": "Factures de mes consultations",
    "pt": "Faturas dos meus atendimentos"
  },
  "Consulta comprobantes emitidos, encuentra facturas por cliente o fecha y gestiona sus documentos.": {
    "en": "View issued receipts, find invoices by client or date and manage documents.",
    "fr": "Consultez les reçus émis, trouvez les factures par client ou date et gérez les documents.",
    "pt": "Consulte comprovantes emitidos, busque faturas por cliente ou data e gerencie documentos."
  },
  "Exportar CSV": {
    "en": "Export CSV",
    "fr": "Exporter en CSV",
    "pt": "Exportar CSV"
  },
  "Facturas registradas": {
    "en": "Registered invoices",
    "fr": "Factures enregistrées",
    "pt": "Faturas registradas"
  },
  "De mis atenciones médicas": {
    "en": "From my medical consultations",
    "fr": "De mes consultations médicales",
    "pt": "Dos meus atendimentos médicos"
  },
  "Comprobantes emitidos": {
    "en": "Receipts issued",
    "fr": "Reçus émis",
    "pt": "Comprovantes emitidos"
  },
  "Emitidas hoy": {
    "en": "Issued today",
    "fr": "Émises aujourd'hui",
    "pt": "Emitidas hoje"
  },
  "Según fecha de emisión": {
    "en": "By issue date",
    "fr": "Par date d'émission",
    "pt": "Por data de emissão"
  },
  "Por enviar": {
    "en": "To send",
    "fr": "À envoyer",
    "pt": "Para enviar"
  },
  "Facturas sin correo confirmado": {
    "en": "Invoices without confirmed email delivery",
    "fr": "Factures sans envoi confirmé",
    "pt": "Faturas sem envio confirmado"
  },
  "BÚSQUEDA Y ORGANIZACIÓN": {
    "en": "SEARCH AND ORGANIZATION",
    "fr": "RECHERCHE ET ORGANISATION",
    "pt": "BUSCA E ORGANIZAÇÃO"
  },
  "Filtrar facturas": {
    "en": "Filter invoices",
    "fr": "Filtrer les factures",
    "pt": "Filtrar faturas"
  },
  "Combina los filtros para localizar un comprobante específico.": {
    "en": "Combine filters to find a specific receipt.",
    "fr": "Combinez les filtres pour trouver un reçu précis.",
    "pt": "Combine filtros para encontrar um comprovante específico."
  },
  "Cliente, mascota o número de factura": {
    "en": "Client, pet or invoice number",
    "fr": "Client, animal ou numéro de facture",
    "pt": "Cliente, animal ou número da fatura"
  },
  "Fecha específica": {
    "en": "Specific date",
    "fr": "Date précise",
    "pt": "Data específica"
  },
  "Correo enviado": {
    "en": "Email sent",
    "fr": "E-mail envoyé",
    "pt": "E-mail enviado"
  },
  "Este mes": {
    "en": "This month",
    "fr": "Ce mois-ci",
    "pt": "Este mês"
  },
  "Historial de facturas": {
    "en": "Invoice history",
    "fr": "Historique des factures",
    "pt": "Histórico das faturas"
  },
  "Más recientes primero": {
    "en": "Newest first",
    "fr": "Plus récentes d'abord",
    "pt": "Mais recentes primeiro"
  },
  "Estamos recuperando los comprobantes del servidor.": {
    "en": "Retrieving receipts from the server.",
    "fr": "Récupération des reçus depuis le serveur.",
    "pt": "Recuperando comprovantes do servidor."
  },
  "Aún no tienes facturas emitidas": {
    "en": "You haven't issued any invoices yet",
    "fr": "Vous n'avez encore émis aucune facture",
    "pt": "Você ainda não emitiu faturas"
  },
  "Cuando emitas una factura desde una atención médica, aparecerá aquí.": {
    "en": "Invoices issued from medical consultations will appear here.",
    "fr": "Les factures émises lors des consultations médicales apparaîtront ici.",
    "pt": "As faturas emitidas a partir de atendimentos aparecerão aqui."
  },
  "No encontramos coincidencias": {
    "en": "No matches found",
    "fr": "Aucune correspondance trouvée",
    "pt": "Nenhuma correspondência encontrada"
  },
  "Prueba con otro nombre, número o rango de fechas.": {
    "en": "Try another name, number or date range.",
    "fr": "Essayez un autre nom, numéro ou période.",
    "pt": "Tente outro nome, número ou período."
  },
  "Quitar filtros": {
    "en": "Remove filters",
    "fr": "Supprimer les filtres",
    "pt": "Remover filtros"
  },
  "Comprobante": {
    "en": "Receipt",
    "fr": "Reçu",
    "pt": "Comprovante"
  },
  "Estos documentos son comprobantes internos del sistema veterinario y no sustituyen una factura electrónica autorizada por el SRI.": {
    "en": "These documents are internal veterinary receipts, not SRI-authorized electronic invoices.",
    "fr": "Ces documents sont des reçus internes vétérinaires et ne remplacent pas une facture électronique autorisée par le SRI.",
    "pt": "Estes documentos são comprovantes internos do sistema veterinário, não substituindo notas fiscais eletrônicas autorizadas pelo SRI."
  },
  "COMPROBANTE INTERNO": {
    "en": "INTERNAL RECEIPT",
    "fr": "REÇU INTERNE",
    "pt": "COMPROVANTE INTERNO"
  },
  "Resumen de cobro": {
    "en": "Payment summary",
    "fr": "Résumé des frais",
    "pt": "Resumo da cobrança"
  },
  "Medicamentos facturables": {
    "en": "Billable medications",
    "fr": "Médicaments facturables",
    "pt": "Medicamentos faturáveis"
  },
  "Medicamentos registrados": {
    "en": "Registered medications",
    "fr": "Médicaments enregistrés",
    "pt": "Medicamentos registrados"
  },
  "Impuestos": {
    "en": "Taxes",
    "fr": "Taxes",
    "pt": "Impostos"
  },
  "Ej. María, Firulais, INT-00000001...": {
    "en": "E.g. María, Firulais, INT-00000001...",
    "fr": "Ex. : María, Firulais, INT-00000001...",
    "pt": "Ex.: María, Firulais, INT-00000001..."
  },
  "Ver detalle de factura": {
    "en": "View invoice details",
    "fr": "Voir les détails de la facture",
    "pt": "Ver detalhes da fatura"
  },
  "Descargar PDF": {
    "en": "Download PDF",
    "fr": "Télécharger le PDF",
    "pt": "Baixar PDF"
  },
  "Enviar factura al correo del propietario": {
    "en": "Email invoice to owner",
    "fr": "Envoyer la facture au propriétaire",
    "pt": "Enviar fatura ao e-mail do tutor"
  },
  "Enviar al propietario": {
    "en": "Send to owner",
    "fr": "Envoyer au propriétaire",
    "pt": "Enviar ao tutor"
  },
  "Mis Mascotas 🐾": {
    "en": "My Pets 🐾",
    "fr": "Mes animaux 🐾",
    "pt": "Meus animais 🐾"
  },
  "Registra, consulta y actualiza la información de tus mascotas.": {
    "en": "Register, view and update your pets' information.",
    "fr": "Enregistrez, consultez et modifiez les informations de vos animaux.",
    "pt": "Cadastre, consulte e atualize os dados dos seus animais."
  },
  "No tienes notificaciones nuevas.": {
    "en": "You have no new notifications.",
    "fr": "Vous n'avez aucune nouvelle notification.",
    "pt": "Você não tem novas notificações."
  },
  "Aquí aparecerán los resultados de registrar o editar mascotas.": {
    "en": "Results from adding or editing pets will appear here.",
    "fr": "Les résultats d'enregistrement ou de modification d'animaux apparaîtront ici.",
    "pt": "Os resultados de cadastrar ou editar animais aparecerão aqui."
  },
  "Personaliza la visualización de esta página.": {
    "en": "Customize how this page looks.",
    "fr": "Personnalisez l'apparence de cette page.",
    "pt": "Personalize a exibição desta página."
  },
  "Alto contraste": {
    "en": "High contrast",
    "fr": "Contraste élevé",
    "pt": "Alto contraste"
  },
  "Facilita distinguir textos y elementos.": {
    "en": "Makes text and elements easier to distinguish.",
    "fr": "Facilite la distinction des textes et des éléments.",
    "pt": "Facilita distinguir textos e elementos."
  },
  "Tamaño del texto": {
    "en": "Text size",
    "fr": "Taille du texte",
    "pt": "Tamanho do texto"
  },
  "Aumenta o disminuye las letras.": {
    "en": "Increase or decrease text size.",
    "fr": "Augmentez ou réduisez la taille du texte.",
    "pt": "Aumente ou diminua o tamanho do texto."
  },
  "Elimina movimientos decorativos.": {
    "en": "Removes decorative motion.",
    "fr": "Supprime les mouvements décoratifs.",
    "pt": "Remove movimentos decorativos."
  },
  "Restablecer apariencia": {
    "en": "Reset appearance",
    "fr": "Réinitialiser l'apparence",
    "pt": "Redefinir aparência"
  },
  "+ Registrar mascota": {
    "en": "+ Register pet",
    "fr": "+ Enregistrer un animal",
    "pt": "+ Cadastrar animal"
  },
  "Completa los campos obligatorios para guardar la información.": {
    "en": "Complete the required fields to save the information.",
    "fr": "Remplissez les champs obligatoires pour enregistrer les informations.",
    "pt": "Preencha os campos obrigatórios para salvar as informações."
  },
  "Nombre de la mascota": {
    "en": "Pet name",
    "fr": "Nom de l'animal",
    "pt": "Nome do animal"
  },
  "Edad (años)": {
    "en": "Age (years)",
    "fr": "Âge (années)",
    "pt": "Idade (anos)"
  },
  "Ingresa una edad en años completos.": {
    "en": "Enter the age in whole years.",
    "fr": "Saisissez l'âge en années entières.",
    "pt": "Digite a idade em anos completos."
  },
  "Debes seleccionar el sexo.": {
    "en": "You must select the sex.",
    "fr": "Vous devez sélectionner le sexe.",
    "pt": "Você deve selecionar o sexo."
  },
  "Mis mascotas registradas": {
    "en": "My registered pets",
    "fr": "Mes animaux enregistrés",
    "pt": "Meus animais cadastrados"
  },
  "Consulta y administra la información de tus mascotas.": {
    "en": "View and manage your pets' information.",
    "fr": "Consultez et gérez les informations de vos animaux.",
    "pt": "Consulte e administre os dados dos seus animais."
  },
  "Consultando tus mascotas...": {
    "en": "Loading your pets...",
    "fr": "Chargement de vos animaux...",
    "pt": "Consultando seus animais..."
  },
  "Aún no tienes mascotas registradas": {
    "en": "You don't have any registered pets yet",
    "fr": "Vous n'avez pas encore d'animaux enregistrés",
    "pt": "Você ainda não tem animais cadastrados"
  },
  "Puedes registrar tu primera mascota utilizando el botón superior.": {
    "en": "You can register your first pet using the button above.",
    "fr": "Vous pouvez enregistrer votre premier animal avec le bouton ci-dessus.",
    "pt": "Você pode cadastrar seu primeiro animal pelo botão acima."
  },
  "+ Registrar mi primera mascota": {
    "en": "+ Register my first pet",
    "fr": "+ Enregistrer mon premier animal",
    "pt": "+ Cadastrar meu primeiro animal"
  },
  "✏️ Editar mascota": {
    "en": "✏️ Edit pet",
    "fr": "✏️ Modifier l'animal",
    "pt": "✏️ Editar animal"
  },
  "Notificaciones de mascotas": {
    "en": "Pet notifications",
    "fr": "Notifications des animaux",
    "pt": "Notificações dos animais"
  },
  "Opciones de accesibilidad": {
    "en": "Accessibility options",
    "fr": "Options d'accessibilité",
    "pt": "Opções de acessibilidade"
  },
  "Cerrar accesibilidad": {
    "en": "Close accessibility panel",
    "fr": "Fermer le panneau d'accessibilité",
    "pt": "Fechar acessibilidade"
  },
  "Disminuir tamaño del texto": {
    "en": "Decrease text size",
    "fr": "Réduire la taille du texte",
    "pt": "Diminuir tamanho do texto"
  },
  "Aumentar tamaño del texto": {
    "en": "Increase text size",
    "fr": "Augmenter la taille du texte",
    "pt": "Aumentar tamanho do texto"
  },
  "Ejemplo: Perro": {
    "en": "Example: Dog",
    "fr": "Exemple : Chien",
    "pt": "Exemplo: Cachorro"
  },
  "Ejemplo: Labrador": {
    "en": "Example: Labrador",
    "fr": "Exemple : Labrador",
    "pt": "Exemplo: Labrador"
  },
  "Registra los medicamentos utilizados o recetados y continúa con la facturación de la atención médica.": {
    "en": "Record used or prescribed medications, then continue to billing.",
    "fr": "Enregistrez les médicaments utilisés ou prescrits, puis passez à la facturation.",
    "pt": "Registre medicamentos usados ou prescritos e prossiga para o faturamento."
  },
  "Consultando atenciones y medicamentos...": {
    "en": "Loading consultations and medications...",
    "fr": "Chargement des consultations et médicaments...",
    "pt": "Consultando atendimentos e medicamentos..."
  },
  "No se pudieron cargar las atenciones": {
    "en": "Unable to load consultations",
    "fr": "Impossible de charger les consultations",
    "pt": "Não foi possível carregar os atendimentos"
  },
  "Comprueba tu conexión y vuelve a intentarlo.": {
    "en": "Check your connection and try again.",
    "fr": "Vérifiez votre connexion et réessayez.",
    "pt": "Verifique sua conexão e tente novamente."
  },
  "1. Seleccionar atención médica": {
    "en": "1. Select medical consultation",
    "fr": "1. Sélectionner une consultation médicale",
    "pt": "1. Selecionar atendimento médico"
  },
  "Selecciona la atención que deseas gestionar.": {
    "en": "Select the consultation you want to manage.",
    "fr": "Sélectionnez la consultation à gérer.",
    "pt": "Selecione o atendimento que deseja gerenciar."
  },
  "Seleccionar atención...": {
    "en": "Select consultation...",
    "fr": "Sélectionnez une consultation...",
    "pt": "Selecione um atendimento..."
  },
  "No tienes atenciones disponibles para gestionar.": {
    "en": "You have no consultations available to manage.",
    "fr": "Aucune consultation disponible à gérer.",
    "pt": "Você não tem atendimentos disponíveis para gerenciar."
  },
  "2. Medicamentos de la atención": {
    "en": "2. Consultation medications",
    "fr": "2. Médicaments de la consultation",
    "pt": "2. Medicamentos do atendimento"
  },
  "Consultando el historial de medicamentos...": {
    "en": "Loading medication history...",
    "fr": "Chargement de l'historique des médicaments...",
    "pt": "Consultando histórico de medicamentos..."
  },
  "No se pudo verificar el historial.": {
    "en": "Unable to verify history.",
    "fr": "Impossible de vérifier l'historique.",
    "pt": "Não foi possível verificar o histórico."
  },
  "Volver a consultar": {
    "en": "Check again",
    "fr": "Consulter à nouveau",
    "pt": "Consultar novamente"
  },
  "¿La atención necesita medicamentos adicionales?": {
    "en": "Does this consultation require additional medications?",
    "fr": "Cette consultation nécessite-t-elle des médicaments supplémentaires ?",
    "pt": "Este atendimento precisa de medicamentos adicionais?"
  },
  "Sí, necesita medicamentos": {
    "en": "Yes, medications required",
    "fr": "Oui, médicaments nécessaires",
    "pt": "Sim, precisa de medicamentos"
  },
  "Agregar medicamentos utilizados o recetados.": {
    "en": "Add administered or prescribed medications.",
    "fr": "Ajoutez les médicaments utilisés ou prescrits.",
    "pt": "Adicione medicamentos usados ou prescritos."
  },
  "No necesita medicamentos": {
    "en": "No medications needed",
    "fr": "Aucun médicament nécessaire",
    "pt": "Não precisa de medicamentos"
  },
  "Por ejemplo, una vacunación sin medicamentos adicionales. Continuar directamente a la factura.": {
    "en": "For example, a vaccination with no extra medications. Continue directly to billing.",
    "fr": "Par exemple, une vaccination sans médicament supplémentaire. Passez directement à la facturation.",
    "pt": "Por exemplo, uma vacinação sem medicamentos adicionais. Continue direto para a fatura."
  },
  "3. Agregar medicamentos": {
    "en": "3. Add medications",
    "fr": "3. Ajouter des médicaments",
    "pt": "3. Adicionar medicamentos"
  },
  "Selecciona el medicamento, indica la cantidad y especifica su utilización.": {
    "en": "Select the medication, quantity and how it is used.",
    "fr": "Sélectionnez le médicament, la quantité et son utilisation.",
    "pt": "Selecione o medicamento, indique a quantidade e o uso."
  },
  "Cargando catálogo de medicamentos...": {
    "en": "Loading medication catalog...",
    "fr": "Chargement du catalogue des médicaments...",
    "pt": "Carregando catálogo de medicamentos..."
  },
  "No se pudo cargar el catálogo.": {
    "en": "Unable to load the catalog.",
    "fr": "Impossible de charger le catalogue.",
    "pt": "Não foi possível carregar o catálogo."
  },
  "Seleccionar medicamento...": {
    "en": "Select medication...",
    "fr": "Sélectionnez un médicament...",
    "pt": "Selecione um medicamento..."
  },
  "- INACTIVO": {
    "en": "- INACTIVE",
    "fr": "- INACTIF",
    "pt": "- INATIVO"
  },
  "Los medicamentos inactivos se muestran, pero no pueden seleccionarse.": {
    "en": "Inactive medications are displayed but cannot be selected.",
    "fr": "Les médicaments inactifs sont affichés mais ne peuvent pas être sélectionnés.",
    "pt": "Medicamentos inativos aparecem, mas não podem ser selecionados."
  },
  "Tipo de registro": {
    "en": "Record type",
    "fr": "Type d'enregistrement",
    "pt": "Tipo de registro"
  },
  "Utilizado": {
    "en": "Administered",
    "fr": "Utilisé",
    "pt": "Utilizado"
  },
  "Recetado": {
    "en": "Prescribed",
    "fr": "Prescrit",
    "pt": "Prescrito"
  },
  "Recetado y entregado": {
    "en": "Prescribed and dispensed",
    "fr": "Prescrit et délivré",
    "pt": "Prescrito e entregue"
  },
  "Cantidad": {
    "en": "Quantity",
    "fr": "Quantité",
    "pt": "Quantidade"
  },
  "Ingresa la cantidad correspondiente.": {
    "en": "Enter the corresponding quantity.",
    "fr": "Saisissez la quantité correspondante.",
    "pt": "Digite a quantidade correspondente."
  },
  "Indicaciones (opcional)": {
    "en": "Instructions (optional)",
    "fr": "Instructions (facultatif)",
    "pt": "Orientações (opcional)"
  },
  "Estado: Activo": {
    "en": "Status: Active",
    "fr": "Statut : Actif",
    "pt": "Status: Ativo"
  },
  "Este registro descuenta las existencias según las validaciones del backend.": {
    "en": "This record reduces stock according to backend validation.",
    "fr": "Cet enregistrement réduit le stock selon les contrôles du serveur.",
    "pt": "Este registro desconta o estoque conforme as validações do backend."
  },
  "Este medicamento quedará registrado como recetado. No se descontará inventario por este registro.": {
    "en": "This medication will be recorded as prescribed. No stock will be deducted.",
    "fr": "Ce médicament sera enregistré comme prescrit. Aucun stock ne sera déduit.",
    "pt": "Este medicamento será registrado como prescrito. Nenhum estoque será descontado."
  },
  "Agregar medicamento": {
    "en": "Add medication",
    "fr": "Ajouter un médicament",
    "pt": "Adicionar medicamento"
  },
  "Medicamentos agregados": {
    "en": "Added medications",
    "fr": "Médicaments ajoutés",
    "pt": "Medicamentos adicionados"
  },
  "Retirar": {
    "en": "Remove",
    "fr": "Retirer",
    "pt": "Retirar"
  },
  "Todavía no has agregado medicamentos.": {
    "en": "You haven't added any medications yet.",
    "fr": "Vous n'avez pas encore ajouté de médicaments.",
    "pt": "Você ainda não adicionou medicamentos."
  },
  "Historial de medicamentos": {
    "en": "Medication history",
    "fr": "Historique des médicaments",
    "pt": "Histórico de medicamentos"
  },
  "Medicamentos que ya fueron registrados en esta atención.": {
    "en": "Medications already recorded for this consultation.",
    "fr": "Médicaments déjà enregistrés pour cette consultation.",
    "pt": "Medicamentos já registrados neste atendimento."
  },
  "No hay medicamentos registrados en esta atención.": {
    "en": "No medications are registered for this consultation.",
    "fr": "Aucun médicament enregistré pour cette consultation.",
    "pt": "Não há medicamentos registrados neste atendimento."
  },
  "4. Continuar a facturación": {
    "en": "4. Continue to billing",
    "fr": "4. Passer à la facturation",
    "pt": "4. Continuar para faturamento"
  },
  "Una vez revisada la atención y guardados los medicamentos, puedes consultar el resumen de los valores antes de emitir la factura.": {
    "en": "Once you've reviewed the consultation and saved medications, you can check the amounts before issuing the invoice.",
    "fr": "Après avoir vérifié la consultation et enregistré les médicaments, consultez les montants avant d'émettre la facture.",
    "pt": "Após revisar o atendimento e salvar os medicamentos, confira os valores antes de emitir a fatura."
  },
  "Guarda o retira los medicamentos pendientes antes de continuar.": {
    "en": "Save or remove pending medications before continuing.",
    "fr": "Enregistrez ou retirez les médicaments en attente avant de continuer.",
    "pt": "Salve ou remova os medicamentos pendentes antes de continuar."
  },
  "5. Vista previa de factura": {
    "en": "5. Invoice preview",
    "fr": "5. Aperçu de la facture",
    "pt": "5. Prévia da fatura"
  },
  "Revisa los datos y los valores calculados por el backend antes de emitir la factura.": {
    "en": "Check the details and amounts calculated by the backend before issuing the invoice.",
    "fr": "Vérifiez les détails et montants calculés par le serveur avant d'émettre la facture.",
    "pt": "Confira os dados e valores calculados pelo backend antes de emitir a fatura."
  },
  "Atención": {
    "en": "Consultation",
    "fr": "Consultation",
    "pt": "Atendimento"
  },
  "Correo del propietario": {
    "en": "Owner's email",
    "fr": "E-mail du propriétaire",
    "pt": "E-mail do tutor"
  },
  "Detalle de cobros": {
    "en": "Billing details",
    "fr": "Détails de facturation",
    "pt": "Detalhes da cobrança"
  },
  "Esta atención no tiene medicamentos adicionales. Se cobrará únicamente el servicio registrado.": {
    "en": "No additional medications for this consultation. Only the service will be charged.",
    "fr": "Aucun médicament supplémentaire pour cette consultation. Seul le service sera facturé.",
    "pt": "Este atendimento não possui medicamentos adicionais. Somente o serviço será cobrado."
  },
  "Impuestos configurados": {
    "en": "Configured taxes",
    "fr": "Taxes configurées",
    "pt": "Impostos configurados"
  },
  "Los valores mostrados provienen del backend. Verifica el resumen antes de emitir.": {
    "en": "Displayed amounts come from the backend. Check the summary before issuing.",
    "fr": "Les montants affichés proviennent du serveur. Vérifiez le résumé avant d'émettre.",
    "pt": "Os valores exibidos vêm do backend. Confira o resumo antes de emitir."
  },
  "Este documento es un comprobante interno del sistema. No representa una factura electrónica autorizada por el SRI.": {
    "en": "This is an internal system receipt, not an SRI-authorized electronic invoice.",
    "fr": "Ceci est un reçu interne du système et non une facture électronique autorisée par le SRI.",
    "pt": "Este documento é um comprovante interno, não uma nota fiscal eletrônica autorizada pelo SRI."
  },
  "Factura emitida correctamente": {
    "en": "Invoice issued successfully",
    "fr": "Facture émise avec succès",
    "pt": "Fatura emitida com sucesso"
  },
  "Medicamentos facturados": {
    "en": "Billed medications",
    "fr": "Médicaments facturés",
    "pt": "Medicamentos faturados"
  },
  "Factura sin medicamentos adicionales.": {
    "en": "Invoice without additional medications.",
    "fr": "Facture sans médicaments supplémentaires.",
    "pt": "Fatura sem medicamentos adicionais."
  },
  "La factura figura como enviada al correo del propietario.": {
    "en": "The invoice is marked as sent to the owner's email.",
    "fr": "La facture est indiquée comme envoyée à l'e-mail du propriétaire.",
    "pt": "A fatura consta como enviada ao e-mail do tutor."
  },
  "No existe un correo registrado para el propietario. No se puede enviar la factura por correo.": {
    "en": "No email is registered for the owner. The invoice cannot be emailed.",
    "fr": "Aucune adresse e-mail enregistrée pour le propriétaire. La facture ne peut pas être envoyée.",
    "pt": "Não há e-mail cadastrado para o tutor. A fatura não pode ser enviada."
  },
  "Actualizar información": {
    "en": "Refresh information",
    "fr": "Actualiser les informations",
    "pt": "Atualizar informações"
  },
  "Ej. 2": {
    "en": "E.g. 2",
    "fr": "Ex. : 2",
    "pt": "Ex.: 2"
  },
  "Escribe las indicaciones del medicamento...": {
    "en": "Enter medication instructions...",
    "fr": "Saisissez les instructions du médicament...",
    "pt": "Digite as orientações do medicamento..."
  },
  "Consulta los medicamentos registrados, sus presentaciones, precios y existencias disponibles en la veterinaria.": {
    "en": "View registered medications, forms, prices and stock available at the clinic.",
    "fr": "Consultez les médicaments enregistrés, leurs présentations, prix et stocks disponibles.",
    "pt": "Consulte os medicamentos cadastrados, apresentações, preços e estoque disponível."
  },
  "Total catálogo": {
    "en": "Catalog total",
    "fr": "Total du catalogue",
    "pt": "Total do catálogo"
  },
  "Con existencias": {
    "en": "In stock",
    "fr": "En stock",
    "pt": "Com estoque"
  },
  "Agotados": {
    "en": "Out of stock",
    "fr": "Épuisés",
    "pt": "Esgotados"
  },
  "Consulta, busca, filtra y ordena los medicamentos registrados.": {
    "en": "View, search, filter and sort registered medications.",
    "fr": "Consultez, recherchez, filtrez et triez les médicaments enregistrés.",
    "pt": "Consulte, busque, filtre e ordene os medicamentos cadastrados."
  },
  "Consultando catálogo de medicamentos...": {
    "en": "Loading medication catalog...",
    "fr": "Chargement du catalogue des médicaments...",
    "pt": "Consultando catálogo de medicamentos..."
  },
  "No hay medicamentos registrados": {
    "en": "No medications registered",
    "fr": "Aucun médicament enregistré",
    "pt": "Nenhum medicamento cadastrado"
  },
  "Cuando el administrador registre medicamentos, aparecerán en esta sección.": {
    "en": "Medications added by the administrator will appear here.",
    "fr": "Les médicaments enregistrés par l'administrateur apparaîtront ici.",
    "pt": "Medicamentos cadastrados pelo administrador aparecerão aqui."
  },
  "Prueba con otro nombre o modifica los filtros de búsqueda.": {
    "en": "Try a different name or search filter.",
    "fr": "Essayez un autre nom ou modifiez les filtres de recherche.",
    "pt": "Tente outro nome ou altere os filtros de busca."
  },
  "Existencias": {
    "en": "Stock",
    "fr": "Stock",
    "pt": "Estoque"
  },
  "Nombre, código, presentación...": {
    "en": "Name, code, form...",
    "fr": "Nom, code, présentation...",
    "pt": "Nome, código, apresentação..."
  },
  "NUESTROS SERVICIOS": {
    "en": "OUR SERVICES",
    "fr": "NOS SERVICES",
    "pt": "NOSSOS SERVIÇOS"
  },
  "Servicios Veterinarios 🩺": {
    "en": "Veterinary Services 🩺",
    "fr": "Services vétérinaires 🩺",
    "pt": "Serviços veterinários 🩺"
  },
  "Conoce los servicios disponibles para el cuidado y bienestar de tus mascotas.": {
    "en": "Explore the services available for your pets' health and well-being.",
    "fr": "Découvrez les services pour la santé et le bien-être de vos animaux.",
    "pt": "Conheça os serviços disponíveis para a saúde e o bem-estar dos seus animais."
  },
  "Consulta las opciones registradas en la veterinaria.": {
    "en": "View options available at the clinic.",
    "fr": "Consultez les options enregistrées à la clinique.",
    "pt": "Consulte as opções disponíveis na clínica."
  },
  "Catálogo de servicios": {
    "en": "Service catalog",
    "fr": "Catalogue des services",
    "pt": "Catálogo de serviços"
  },
  "Explora nuestras opciones y elige el servicio que necesita tu mascota.": {
    "en": "Explore our options and choose the service your pet needs.",
    "fr": "Découvrez nos options et choisissez le service adapté à votre animal.",
    "pt": "Conheça nossas opções e escolha o serviço de que seu animal precisa."
  },
  "Consultando los servicios veterinarios...": {
    "en": "Loading veterinary services...",
    "fr": "Chargement des services vétérinaires...",
    "pt": "Consultando serviços veterinários..."
  },
  "No hay servicios disponibles": {
    "en": "No services available",
    "fr": "Aucun service disponible",
    "pt": "Nenhum serviço disponível"
  },
  "Por el momento, el administrador no ha registrado servicios en la veterinaria.": {
    "en": "The administrator has not added any services yet.",
    "fr": "L'administrateur n'a pas encore enregistré de services.",
    "pt": "O administrador ainda não cadastrou serviços."
  },
  "No encontramos servicios con esa búsqueda": {
    "en": "No services match that search",
    "fr": "Aucun service ne correspond à cette recherche",
    "pt": "Nenhum serviço corresponde à busca"
  },
  "Prueba escribiendo otro nombre o elimina los filtros para ver el catálogo.": {
    "en": "Try another name or clear the filters to view the catalog.",
    "fr": "Essayez un autre nom ou effacez les filtres pour voir le catalogue.",
    "pt": "Tente outro nome ou limpe os filtros para ver o catálogo."
  },
  "Consultar precio": {
    "en": "View price",
    "fr": "Consulter le prix",
    "pt": "Consultar preço"
  },
  "📅 Ir a agendar": {
    "en": "📅 Book an appointment",
    "fr": "📅 Prendre rendez-vous",
    "pt": "📅 Ir para agendar"
  },
  "Para solicitar atención, entra a": {
    "en": "To request care, go to",
    "fr": "Pour demander des soins, rendez-vous sur",
    "pt": "Para solicitar atendimento, acesse"
  },
  ". Allí podrás elegir tu mascota, el servicio, el veterinario y la fecha deseada.": {
    "en": ". There you can choose your pet, service, veterinarian and desired date.",
    "fr": ". Vous pourrez y choisir votre animal, le service, le vétérinaire et la date souhaitée.",
    "pt": ". Lá você poderá escolher seu animal, o serviço, o veterinário e a data desejada."
  },
  "y selecciona la mascota, el servicio, el veterinario y la fecha deseada.": {
    "en": "and select the pet, service, veterinarian and desired date.",
    "fr": "puis sélectionnez l'animal, le service, le vétérinaire et la date souhaitée.",
    "pt": "e selecione o animal, o serviço, o veterinário e a data desejada."
  },
  "Resumen del catálogo de servicios": {
    "en": "Service catalog summary",
    "fr": "Résumé du catalogue de services",
    "pt": "Resumo do catálogo de serviços"
  },
  "Ejemplo: vacunación o consulta": {
    "en": "Example: vaccination or consultation",
    "fr": "Exemple : vaccination ou consultation",
    "pt": "Exemplo: vacinação ou consulta"
  },
  "Consulta los datos de los profesionales registrados en el sistema.": {
    "en": "View details of professionals registered in the system.",
    "fr": "Consultez les informations des professionnels enregistrés.",
    "pt": "Consulte os dados dos profissionais cadastrados no sistema."
  },
  "La búsqueda no distingue mayúsculas ni tildes.": {
    "en": "Search is case-insensitive and ignores accents.",
    "fr": "La recherche ignore les majuscules et les accents.",
    "pt": "A busca ignora maiúsculas e acentos."
  },
  "Ordenar por nombre": {
    "en": "Sort by name",
    "fr": "Trier par nom",
    "pt": "Ordenar por nome"
  },
  "Consultando los veterinarios registrados...": {
    "en": "Loading registered veterinarians...",
    "fr": "Chargement des vétérinaires enregistrés...",
    "pt": "Consultando veterinários cadastrados..."
  },
  "No hay veterinarios registrados": {
    "en": "No veterinarians registered",
    "fr": "Aucun vétérinaire enregistré",
    "pt": "Nenhum veterinário cadastrado"
  },
  "El administrador todavía no ha registrado profesionales veterinarios en el sistema.": {
    "en": "The administrator has not added any veterinarians yet.",
    "fr": "L'administrateur n'a pas encore enregistré de vétérinaires.",
    "pt": "O administrador ainda não cadastrou veterinários."
  },
  "Prueba otro nombre o selecciona una especialidad diferente.": {
    "en": "Try another name or select a different specialty.",
    "fr": "Essayez un autre nom ou choisissez une autre spécialité.",
    "pt": "Tente outro nome ou selecione outra especialidade."
  },
  "📅 Ir a agendar cita": {
    "en": "📅 Book an appointment",
    "fr": "📅 Prendre rendez-vous",
    "pt": "📅 Ir para agendar consulta"
  },
  "Para solicitar una atención veterinaria, ingresa a": {
    "en": "To request veterinary care, go to",
    "fr": "Pour demander des soins vétérinaires, rendez-vous sur",
    "pt": "Para solicitar atendimento veterinário, acesse"
  },
  "Resumen de veterinarios": {
    "en": "Veterinarian summary",
    "fr": "Résumé des vétérinaires",
    "pt": "Resumo de veterinários"
  },
  "Nombre, apellido o especialidad...": {
    "en": "First name, surname or specialty...",
    "fr": "Prénom, nom ou spécialité...",
    "pt": "Nome, sobrenome ou especialidade..."
  },
  "Ingresa el código de seis dígitos que enviamos a": {
    "en": "Enter the six-digit code we sent to",
    "fr": "Saisissez le code à six chiffres envoyé à",
    "pt": "Digite o código de seis dígitos que enviamos para"
  },
  "y establece tu nueva contraseña.": {
    "en": "and set your new password.",
    "fr": "et définissez votre nouveau mot de passe.",
    "pt": "e defina sua nova senha."
  },
  "Ingresa una dirección de correo válida.": {
    "en": "Enter a valid email address.",
    "fr": "Saisissez une adresse e-mail valide.",
    "pt": "Digite um endereço de e-mail válido."
  },
  "El código debe contener exactamente seis números.": {
    "en": "The code must contain exactly six digits.",
    "fr": "Le code doit contenir exactement six chiffres.",
    "pt": "O código deve conter exatamente seis dígitos."
  },
  "La contraseña debe tener entre 8 y 72 caracteres.": {
    "en": "Password must be between 8 and 72 characters.",
    "fr": "Le mot de passe doit contenir entre 8 et 72 caractères.",
    "pt": "A senha deve ter entre 8 e 72 caracteres."
  },
  "Por seguridad, el código vence en 10 minutos y solo puede utilizarse una vez.": {
    "en": "For security, the code expires after 10 minutes and can only be used once.",
    "fr": "Pour des raisons de sécurité, le code expire au bout de 10 minutes et ne peut être utilisé qu'une seule fois.",
    "pt": "Por segurança, o código expira em 10 minutos e só pode ser usado uma vez."
  },
  "Volver al inicio de sesión": {
    "en": "Return to sign in",
    "fr": "Retour à la connexion",
    "pt": "Voltar ao login"
  },
  "tucorreo@ejemplo.com": {
    "en": "yourmail@example.com",
    "fr": "votreadresse@exemple.fr",
    "pt": "seuemail@exemplo.com"
  },
  "💚 Cuidamos lo que más quieres": {
    "en": "💚 We care for those you love most",
    "fr": "💚 Nous prenons soin de ceux que vous aimez",
    "pt": "💚 Cuidamos de quem você mais ama"
  },
  "Ingresa al menos 3 caracteres.": {
    "en": "Enter at least 3 characters.",
    "fr": "Saisissez au moins 3 caractères.",
    "pt": "Digite pelo menos 3 caracteres."
  },
  "Utiliza al menos 6 caracteres.": {
    "en": "Use at least 6 characters.",
    "fr": "Utilisez au moins 6 caractères.",
    "pt": "Use pelo menos 6 caracteres."
  },
  "La contraseña debe tener mínimo 6 caracteres.": {
    "en": "Password must be at least 6 characters.",
    "fr": "Le mot de passe doit contenir au moins 6 caractères.",
    "pt": "A senha deve ter no mínimo 6 caracteres."
  },
  "Debes confirmar tu contraseña.": {
    "en": "You must confirm your password.",
    "fr": "Vous devez confirmer votre mot de passe.",
    "pt": "Você deve confirmar sua senha."
  },
  "¿Ya tienes una cuenta?": {
    "en": "Already have an account?",
    "fr": "Vous avez déjà un compte ?",
    "pt": "Já tem uma conta?"
  },
  "Inicia sesión": {
    "en": "Sign in",
    "fr": "Connectez-vous",
    "pt": "Entre"
  },
  "📧 Recibirás un código para verificar tu correo.": {
    "en": "📧 You'll receive a code to verify your email.",
    "fr": "📧 Vous recevrez un code pour vérifier votre e-mail.",
    "pt": "📧 Você receberá um código para verificar seu e-mail."
  },
  "La cuenta se habilita después de la aprobación del administrador.": {
    "en": "The account will be enabled after administrator approval.",
    "fr": "Le compte sera activé après l'approbation de l'administrateur.",
    "pt": "A conta será ativada após aprovação do administrador."
  },
  "Ingresa tu nombre completo": {
    "en": "Enter your full name",
    "fr": "Saisissez votre nom complet",
    "pt": "Digite seu nome completo"
  },
  "Mínimo 6 caracteres": {
    "en": "At least 6 characters",
    "fr": "Au moins 6 caractères",
    "pt": "Mínimo de 6 caracteres"
  },
  "UN PASO MÁS PARA COMENZAR": {
    "en": "ONE MORE STEP TO GET STARTED",
    "fr": "ENCORE UNE ÉTAPE POUR COMMENCER",
    "pt": "MAIS UM PASSO PARA COMEÇAR"
  },
  "Tu familia merece": {
    "en": "Your family deserves",
    "fr": "Votre famille mérite",
    "pt": "Sua família merece"
  },
  "el mejor cuidado.": {
    "en": "the best care.",
    "fr": "les meilleurs soins.",
    "pt": "o melhor cuidado."
  },
  "Verifica tu dirección de correo electrónico para completar el registro en nuestra veterinaria.": {
    "en": "Verify your email address to finish registering at our clinic.",
    "fr": "Vérifiez votre adresse e-mail pour terminer votre inscription à la clinique.",
    "pt": "Verifique seu endereço de e-mail para concluir o cadastro na clínica."
  },
  "Busca el mensaje con tu código.": {
    "en": "Find the message containing your code.",
    "fr": "Cherchez le message contenant votre code.",
    "pt": "Procure a mensagem com seu código."
  },
  "Ingresa los cuatro números": {
    "en": "Enter the four digits",
    "fr": "Saisissez les quatre chiffres",
    "pt": "Digite os quatro números"
  },
  "Escribe exactamente el código recibido.": {
    "en": "Enter the exact code you received.",
    "fr": "Saisissez exactement le code reçu.",
    "pt": "Digite exatamente o código recebido."
  },
  "💚 Historias de cuidado, juntos": {
    "en": "💚 Caring stories, together",
    "fr": "💚 Des histoires de soin, ensemble",
    "pt": "💚 Histórias de cuidado, juntos"
  },
  "Código enviado a:": {
    "en": "Code sent to:",
    "fr": "Code envoyé à :",
    "pt": "Código enviado para:"
  },
  "Escribe los cuatro números recibidos.": {
    "en": "Enter the four digits you received.",
    "fr": "Saisissez les quatre chiffres reçus.",
    "pt": "Digite os quatro números recebidos."
  },
  "El código es obligatorio.": {
    "en": "Code is required.",
    "fr": "Le code est obligatoire.",
    "pt": "O código é obrigatório."
  },
  "El código debe contener exactamente 4 números.": {
    "en": "The code must contain exactly 4 digits.",
    "fr": "Le code doit contenir exactement 4 chiffres.",
    "pt": "O código deve conter exatamente 4 dígitos."
  },
  "🔐 El código confirma que tienes acceso al correo registrado.": {
    "en": "🔐 This code confirms you can access the registered email.",
    "fr": "🔐 Ce code confirme que vous avez accès à l'e-mail enregistré.",
    "pt": "🔐 O código confirma que você tem acesso ao e-mail cadastrado."
  },
  "⏳ Tras verificarlo, deberás esperar la aprobación del administrador.": {
    "en": "⏳ After verification, you must wait for administrator approval.",
    "fr": "⏳ Après vérification, attendez l'approbation de l'administrateur.",
    "pt": "⏳ Após verificar, aguarde a aprovação do administrador."
  },
  "Información general. Si tu mascota tiene una emergencia, acude a un veterinario.": {
    "en": "General information. If your pet has an emergency, seek veterinary care.",
    "fr": "Informations générales. En cas d'urgence, consultez un vétérinaire.",
    "pt": "Informações gerais. Em caso de emergência, procure um veterinário."
  },
  "Asistente virtual": {
    "en": "Virtual assistant",
    "fr": "Assistant virtuel",
    "pt": "Assistente virtual"
  },
  "Asistente de Veterinaria Arévalo": {
    "en": "Veterinaria Arévalo assistant",
    "fr": "Assistant de Veterinaria Arévalo",
    "pt": "Assistente da Veterinaria Arévalo"
  },
  "Cerrar asistente": {
    "en": "Close assistant",
    "fr": "Fermer l'assistant",
    "pt": "Fechar assistente"
  },
  "Mascota": {
    "en": "Pet",
    "fr": "Animal",
    "pt": "Animal"
  },
  "🩺 Atenciones Médicas": {
    "en": "🩺 Medical Consultations",
    "fr": "🩺 Consultations médicales",
    "pt": "🩺 Atendimentos médicos"
  },
  "💊 Medicamentos disponibles": {
    "en": "💊 Available medications",
    "fr": "💊 Médicaments disponibles",
    "pt": "💊 Medicamentos disponíveis"
  },
  "💉 Medicamentos de la atención": {
    "en": "💉 Consultation medications",
    "fr": "💉 Médicaments de la consultation",
    "pt": "💉 Medicamentos do atendimento"
  },
  "🩺 Diagnóstico": {
    "en": "🩺 Diagnosis",
    "fr": "🩺 Diagnostic",
    "pt": "🩺 Diagnóstico"
  },
  "💚 Tratamiento": {
    "en": "💚 Treatment",
    "fr": "💚 Traitement",
    "pt": "💚 Tratamento"
  },
  "📝 Observaciones": {
    "en": "📝 Notes",
    "fr": "📝 Observations",
    "pt": "📝 Observações"
  },
  "💊 Medicamentos utilizados": {
    "en": "💊 Medications administered",
    "fr": "💊 Médicaments utilisés",
    "pt": "💊 Medicamentos utilizados"
  },
  "📋 Medicamentos recetados": {
    "en": "📋 Prescribed medications",
    "fr": "📋 Médicaments prescrits",
    "pt": "📋 Medicamentos prescritos"
  },
  "🐾 Mascota": {
    "en": "🐾 Pet",
    "fr": "🐾 Animal",
    "pt": "🐾 Animal"
  },
  "👤 Propietario": {
    "en": "👤 Owner",
    "fr": "👤 Propriétaire",
    "pt": "👤 Tutor"
  },
  "👨‍⚕️ Veterinario": {
    "en": "👨‍⚕️ Veterinarian",
    "fr": "👨‍⚕️ Vétérinaire",
    "pt": "👨‍⚕️ Veterinário"
  },
  "🩺 Servicio": {
    "en": "🩺 Service",
    "fr": "🩺 Service",
    "pt": "🩺 Serviço"
  },
  "No tienes citas próximas.": {
    "en": "You have no upcoming appointments.",
    "fr": "Vous n'avez aucun rendez-vous à venir.",
    "pt": "Você não tem próximas consultas."
  },
  "Facturas emitidas hoy": {
    "en": "Invoices issued today",
    "fr": "Factures émises aujourd'hui",
    "pt": "Faturas emitidas hoje"
  },
  "Cerrar mensaje": {
    "en": "Close message",
    "fr": "Fermer le message",
    "pt": "Fechar mensagem"
  }
};

@Injectable({ providedIn: 'root' })
export class IdiomaServicio implements OnDestroy {
  private readonly CLAVE = 'veterinaria-idioma';
  idioma: IdiomaPagina = 'es';
  private observador: MutationObserver | null = null;
  private originales = new WeakMap<Node, string>();
  private ultimasTraducciones = new WeakMap<Node, string>();
  private atributosOriginales = new WeakMap<Element, Map<string, string>>();
  private ultimosAtributos = new WeakMap<Element, Map<string, string>>();
  private iniciado = false;
  private programado = false;

  iniciar(): void {
    if (this.iniciado || typeof document === 'undefined' || typeof window === 'undefined') return;
    this.iniciado = true;
    try {
      const guardado = localStorage.getItem(this.CLAVE);
      if (guardado && this.esIdioma(guardado)) this.idioma = guardado;
    } catch { /* modo privado o almacenamiento deshabilitado */ }
    document.documentElement.lang = this.idioma;
    this.observador = new MutationObserver(() => this.programarTraduccion());
    this.observar();
    this.programarTraduccion();
  }

  cambiarIdioma(idioma: IdiomaPagina): void {
    if (!this.esIdioma(idioma)) return;
    this.idioma = idioma;
    if (typeof document !== 'undefined') document.documentElement.lang = idioma;
    try { localStorage.setItem(this.CLAVE, idioma); } catch { /* ignorar */ }
    this.programarTraduccion();
  }

  traducir(texto: string): string {
    if (this.idioma === 'es') return texto;
    const clave = texto.trim().replace(/\s+/g, ' ');
    return TRADUCCIONES[clave]?.[this.idioma] ?? texto;
  }

  private esIdioma(valor: string): valor is IdiomaPagina {
    return ['es','en','fr','pt'].includes(valor);
  }

  private observar(): void {
    if (!this.observador || typeof document === 'undefined') return;
    this.observador.observe(document.body, {
      childList: true, subtree: true, characterData: true, attributes: true,
      attributeFilter: ['placeholder', 'aria-label', 'title']
    });
  }

  private programarTraduccion(): void {
    if (this.programado || typeof window === 'undefined') return;
    this.programado = true;
    window.setTimeout(() => {
      this.programado = false;
      if (!this.iniciado) return;
      this.observador?.disconnect();
      try { this.aplicar(); } finally { this.observar(); }
    }, 0);
  }

  private aplicar(): void {
    if (typeof document === 'undefined') return;
    const raiz = document.body;
    const walker = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT);
    let nodo: Node | null;
    while ((nodo = walker.nextNode())) {
      const padre = nodo.parentElement;
      if (!padre || padre.closest('script,style,textarea,pre,code,[contenteditable],.no-traducir')) continue;
      const actual = nodo.textContent ?? '';
      let original = this.originales.get(nodo);
      // Angular puede modificar expresiones dinámicas; actualizar el origen
      // solamente si no se trata de nuestra última traducción.
      const anteriorTraducido = this.ultimasTraducciones.get(nodo);
      if (!original || (actual !== original && actual !== anteriorTraducido)) {
        original = actual;
        this.originales.set(nodo, original);
      }
      const fragmento = original.trim();
      const clave = fragmento.replace(/\s+/g, ' ');
      const nuevo = clave ? original.replace(fragmento, this.traducir(clave)) : original;
      if (actual !== nuevo && clave) nodo.textContent = nuevo;
      this.ultimasTraducciones.set(nodo, nuevo);
    }
    const atributos = ['placeholder', 'aria-label', 'title'];
    const elementos = raiz.querySelectorAll('[placeholder],[aria-label],[title]');
    for (const elemento of Array.from(elementos)) {
      if (elemento.closest('.no-traducir')) continue;
      let mapa = this.atributosOriginales.get(elemento);
      if (!mapa) { mapa = new Map(); this.atributosOriginales.set(elemento, mapa); }
      let ultimos = this.ultimosAtributos.get(elemento);
      if (!ultimos) { ultimos = new Map(); this.ultimosAtributos.set(elemento, ultimos); }
      for (const atributo of atributos) {
        if (!elemento.hasAttribute(atributo)) continue;
        const actual = elemento.getAttribute(atributo) ?? '';
        let original = mapa.get(atributo);
        if (!original || (actual !== original && actual !== ultimos.get(atributo))) {
          original = actual;
          mapa.set(atributo, original);
        }
        const nuevo = this.traducir(original);
        if (actual !== nuevo) elemento.setAttribute(atributo, nuevo);
        ultimos.set(atributo, nuevo);
      }
    }
  }

  ngOnDestroy(): void { this.iniciado = false; this.observador?.disconnect(); }
}
