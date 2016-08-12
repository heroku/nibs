angular.module('nibs.config', [])

    .constant('SERVER_URL', process.env.SERVER_URL || '@@serverUrl')

    .constant('FB_APP_ID', process.env.FB_APP_ID || '@@fbAppId')

    .constant('STATUS_LABELS', [

    ])

    .constant('STATUS_DESCRIPTIONS', [

    ]);
