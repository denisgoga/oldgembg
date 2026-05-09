-- Seed translations for Site & SEO + Popup Settings (de/it/es/fr)
-- Applies only when a locale key is missing (does not overwrite existing edits).

UPDATE site_settings
SET site_translations = site_translations || jsonb_build_object(
  'de',
  jsonb_build_object(
    'meta_title', 'OldGem.Net - Kostenlose Premium Old-Gem-Videos!',
    'meta_description', 'OldGem.Net - Kostenlose Premium-Old-Gem-Videos! Entdecke exklusive Inhalte mit kostenloser Registrierung.',
    'landing_headline', 'Empfohlener Inhalt',
    'landing_subhead', 'Entdecke unsere exklusive Sammlung. Klicke auf einen Beitrag und erhalte kostenlosen Zugriff.',
    'seo_intro', 'OldGem.Net bietet kostenlosen Zugang zu Premium-Video-Content. Entdecke die Sammlung unten, klicke auf ein beliebiges Video, um es mit einer schnellen kostenlosen Registrierung freizuschalten, und schau es auf jedem Gerät. Neue Inhalte werden regelmäßig hinzugefügt - alles, was du brauchst, ist ein kostenloses Konto.',
    'footer_text', 'Nur für Erwachsene. 18+. Indem du eintrittst, bestätigst du, dass du das gesetzliche Alter erreicht hast.'
  )
)
WHERE NOT (site_translations ? 'de');

UPDATE site_settings
SET site_translations = site_translations || jsonb_build_object(
  'it',
  jsonb_build_object(
    'meta_title', 'OldGem.Net - Video Old Gem Premium gratuiti!',
    'meta_description', 'OldGem.Net - Video Old Gem Premium gratuiti! Scopri contenuti esclusivi con una registrazione gratuita.',
    'landing_headline', 'Contenuti in evidenza',
    'landing_subhead', 'Scopri la nostra collezione premium. Clicca su qualsiasi elemento per ottenere accesso gratuito.',
    'seo_intro', 'OldGem.Net offre accesso gratuito a contenuti video premium. Sfoglia la collezione qui sotto, clicca su qualsiasi video per sbloccarlo con una rapida registrazione gratuita e guardalo su qualsiasi dispositivo. Nuovi contenuti vengono aggiunti regolarmente: ti serve solo un account gratuito.',
    'footer_text', 'Solo per adulti. 18+. Entrando, confermi di avere l''età legale.'
  )
)
WHERE NOT (site_translations ? 'it');

UPDATE site_settings
SET site_translations = site_translations || jsonb_build_object(
  'es',
  jsonb_build_object(
    'meta_title', 'OldGem.Net - ¡Videos premium Old Gem gratis!',
    'meta_description', 'OldGem.Net - ¡Videos premium Old Gem gratis! Disfruta de contenido exclusivo con el registro gratuito.',
    'landing_headline', 'Contenido destacado',
    'landing_subhead', 'Explora nuestra colección premium. Haz clic en cualquier elemento para obtener acceso gratuito.',
    'seo_intro', 'OldGem.Net ofrece acceso gratuito a contenido de video premium. Explora la colección a continuación, haz clic en cualquier video para desbloquearlo con un registro gratuito rápido y míralo en cualquier dispositivo. Se agregan contenidos con regularidad; solo necesitas una cuenta gratuita.',
    'footer_text', 'Solo para adultos. 18+. Al ingresar, confirmas que tienes la edad legal.'
  )
)
WHERE NOT (site_translations ? 'es');

UPDATE site_settings
SET site_translations = site_translations || jsonb_build_object(
  'fr',
  jsonb_build_object(
    'meta_title', 'OldGem.Net - Des vidéos premium Old Gem gratuites !',
    'meta_description', 'OldGem.Net - Des vidéos premium Old Gem gratuites ! Regardez du contenu exclusif avec une inscription gratuite.',
    'landing_headline', 'Contenu vedette',
    'landing_subhead', 'Découvrez notre collection premium. Cliquez sur n''importe quel élément pour obtenir un accès gratuit.',
    'seo_intro', 'OldGem.Net vous donne accès gratuitement à des contenus vidéo premium. Parcourez la collection ci-dessous, cliquez sur n''importe quelle vidéo pour la déverrouiller avec une inscription gratuite rapide, et regardez sur n''importe quel appareil. De nouveaux contenus sont ajoutés régulièrement : il vous suffit d''un compte gratuit.',
    'footer_text', 'Réservé aux adultes. 18+. En entrant, vous confirmez que vous avez l''âge légal.'
  )
)
WHERE NOT (site_translations ? 'fr');

-- Popup translations
UPDATE popup_settings
SET popup_translations = popup_translations || jsonb_build_object(
  'de',
  jsonb_build_object(
    'title', 'Kostenlose Registrierung',
    'description', 'Registriere dich kostenlos, um den Zugriff auf diesen Inhalt freizuschalten.',
    'button_text', 'Weiter zum kostenlosen Zugriff',
    'waiting_title', 'Warte auf die Registrierung',
    'waiting_description', 'Bitte schließe deine kostenlose Registrierung in dem neuen Fenster ab. Wenn du fertig bist, hast du vollen Zugriff auf alle Premium-Videos.',
    'waiting_button_text', 'Link erneut öffnen'
  )
)
WHERE NOT (popup_translations ? 'de');

UPDATE popup_settings
SET popup_translations = popup_translations || jsonb_build_object(
  'it',
  jsonb_build_object(
    'title', 'Registrazione gratuita',
    'description', 'Registrati gratuitamente per sbloccare l''accesso a questo contenuto.',
    'button_text', 'Continua per l''accesso gratuito',
    'waiting_title', 'In attesa della registrazione',
    'waiting_description', 'Completa la registrazione gratuita nella nuova finestra. Una volta finito, avrai accesso completo a tutti i video premium.',
    'waiting_button_text', 'Apri di nuovo il link'
  )
)
WHERE NOT (popup_translations ? 'it');

UPDATE popup_settings
SET popup_translations = popup_translations || jsonb_build_object(
  'es',
  jsonb_build_object(
    'title', 'Registro gratuito',
    'description', 'Regístrate gratis para desbloquear el acceso a este contenido.',
    'button_text', 'Continuar con el acceso gratuito',
    'waiting_title', 'Esperando el registro',
    'waiting_description', 'Completa tu registro gratuito en la nueva ventana. Cuando termines, tendrás acceso completo a todos los videos premium.',
    'waiting_button_text', 'Abrir el enlace de nuevo'
  )
)
WHERE NOT (popup_translations ? 'es');

UPDATE popup_settings
SET popup_translations = popup_translations || jsonb_build_object(
  'fr',
  jsonb_build_object(
    'title', 'Inscription gratuite',
    'description', 'Inscrivez-vous gratuitement pour débloquer l''accès à ce contenu.',
    'button_text', 'Continuer vers l''accès gratuit',
    'waiting_title', 'En attente de l''inscription',
    'waiting_description', 'Veuillez terminer votre inscription gratuite dans la nouvelle fenêtre. Une fois terminé, vous aurez un accès complet à toutes les vidéos premium.',
    'waiting_button_text', 'Ouvrir le lien à nouveau'
  )
)
WHERE NOT (popup_translations ? 'fr');

