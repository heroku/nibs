angular.module('nibs.config', [])

    .constant('SERVER_URL', null)

    .constant('HOST', 'https: //demo-loyalty-generic.herokuapp.com/')

    .constant('FB_APP_ID', '180938355946407')

    .constant('STATUS_LABELS', [
        'Bronzo',
        'Argento',
        'Oro'
    ])

    .constant('STATUS_DESCRIPTIONS', [
        'Bronzo (Beginner) Sei per la prima volta nella struttura? o probabilmente sei un nostro cliente lontano, non ti preoccupare il nostro personale ti farà rilassare e vivere un esperienza meravigliosa  ',
        'Argento (Intermediate) Sei un tipo che gli piace rilassarsi, guarda i percorsi ti suggeriamo, ti vogliamo stupire con nuove emozioni ',
        'Oro (Super Power) semplicemente perfetto! Sei uno dei nostri top clienti, per te fantastiche offerte e prodotti dedicate al nostro cliente più affezionato '
    ]);
