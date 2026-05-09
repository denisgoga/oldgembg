-- Overwrite popup translations for de/it/es/fr based on current English text.
-- Safe to run multiple times (idempotent for these locales).

UPDATE popup_settings
SET popup_translations =
  COALESCE(popup_translations, '{}'::jsonb)
  || jsonb_build_object(
    'de',
    jsonb_build_object(
      'title', 'Entsperre dieses Video',
      'description',
        'Entsperre das vollständige Video, indem du ein kostenloses Konto erstellst. Sofortiger Zugriff nach der E-Mail-Verifizierung!',
      'button_text', 'Kostenlose Registrierung',
      'waiting_title', 'Warte auf den Registrierungsbildschirm',
      'waiting_description',
        'Bitte schließe deine kostenlose Registrierung im neuen Fenster ab. Sobald du fertig bist, hast du vollen Zugriff auf alle Premium-Videos.',
      'waiting_button_text', 'Link erneut öffnen'
    ),
    'it',
    jsonb_build_object(
      'title', 'Sblocca questo video',
      'description',
        'Sblocca l''intero video creando un account gratuito. Accesso immediato dopo la verifica via email!',
      'button_text', 'Registrazione gratuita',
      'waiting_title', 'In attesa della schermata di registrazione',
      'waiting_description',
        'Completa la tua registrazione gratuita nella nuova finestra. Una volta finito, avrai accesso completo a tutti i video premium.',
      'waiting_button_text', 'Apri di nuovo il link'
    ),
    'es',
    jsonb_build_object(
      'title', 'Desbloquea este video',
      'description',
        'Desbloquea el video completo creando una cuenta gratuita. Acceso inmediato después de la verificación por correo electrónico.',
      'button_text', 'Registro gratuito',
      'waiting_title', 'Esperando la pantalla de registro',
      'waiting_description',
        'Completa tu registro gratuito en la nueva ventana. Cuando termines, tendrás acceso completo a todos los videos premium.',
      'waiting_button_text', 'Abrir el enlace de nuevo'
    ),
    'fr',
    jsonb_build_object(
      'title', 'Déverrouiller cette vidéo',
      'description',
        'Déverrouillez la vidéo complète en créant un compte gratuit. Accès immédiat après la vérification par e-mail !',
      'button_text', 'Inscription gratuite',
      'waiting_title', 'En attente de l''écran d''inscription',
      'waiting_description',
        'Veuillez terminer votre inscription gratuite dans la nouvelle fenêtre. Une fois terminé, vous aurez un accès complet à toutes les vidéos premium.',
      'waiting_button_text', 'Ouvrir à nouveau le lien'
    )
  );

