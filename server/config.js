module.exports = {

    databaseURL: process.env.DATABASE_URL || "postgres://@127.0.0.1:5432/nibs",

    // Nibs users are created as Contacts under a generic Account in SFDC. This is the id of the generic account.
    contactsAccountId: process.env.CONTACTS_ACCOUNT_ID,

    productFamily: process.env.PRODUCT_FAMILY || "Nibs",

    ionicApiToken: process.env.IONIC_API_TOKEN;

    // Used for picture upload (user profile and gallery)
    s3: {
        bucket: process.env.S3_BUCKET_NAME,
        awsKey: process.env.AWS_KEY,
        secret: process.env.AWS_SECRET
    }

};
