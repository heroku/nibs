CREATE SCHEMA IF NOT EXISTS salesforce;

CREATE TABLE IF NOT EXISTS salesforce.contact (
    id              BIGSERIAL,
    firstName       TEXT,
    lastName        TEXT,
    email           TEXT,
    mobilePhone     TEXT,
    leadsource      TEXT,
    accountid       TEXT,
    pictureURL__c   TEXT,
    preference__c   TEXT,
    size__c         TEXT,
    loyaltyid__c    TEXT,
    password__c     TEXT,
    fbuserid__c     TEXT,
    gender__c       TEXT,
    createddate     timestamp
  );

CREATE TABLE IF NOT EXISTS salesforce.interaction__c (
    id                      BIGSERIAL,
    contact__r__loyaltyid__c   TEXT,
    campaign__c             TEXT,
    product__c              TEXT,
    type__c                 TEXT,
    name__c                 TEXT,
    picture__c              TEXT,
    points__c               double precision,
    createddate             timestamp
  );

DROP TABLE IF EXISTS salesforce.campaign;
CREATE TABLE IF NOT EXISTS salesforce.campaign (
    id              BIGSERIAL PRIMARY KEY,
    sfId            TEXT,
    name            TEXT,
    startdate       DATE,
    enddate         DATE,
    description     TEXT,
    image__c        TEXT,
    campaignpage__c TEXT,
    publishdate__c  DATE,
    type            TEXT,
    status          TEXT
  );

DROP TABLE IF EXISTS salesforce.product2;
CREATE TABLE IF NOT EXISTS salesforce.product2 (
    id              BIGSERIAL PRIMARY KEY,
    name            TEXT,
    description     TEXT,
    image__c        TEXT,
    productpage__c  TEXT,
    publishdate__c  DATE,
    family          TEXT
  );

DROP TABLE IF EXISTS salesforce.store__c;
CREATE TABLE IF NOT EXISTS salesforce.store__c (
    id                      BIGSERIAL PRIMARY KEY,
    name                    TEXT,
    location__latitude__s   TEXT,
    location__longitude__s  TEXT
  );

INSERT INTO salesforce.campaign (id, name, description, image__c, type, status) VALUES
    (1, '10% of EcoTruffles', 'Twice as much Eco!', 'http://s3-us-west-1.amazonaws.com/sfdc-demo/nibs/truffles.jpg', 'Offer', 'In Progress'),
    (2, '10% off EcoChocolate: Fair Trade and Organic Chocolates', '0% off chocolate that makes you feel as good as they tastes! Fair Trade and Organic chocolates assortment...', 'https://s3-us-west-1.amazonaws.com/sfdc-demo/nibs/ritual2.jpg', 'Offer', 'In Progress'),
    (3, 'Buy 2 Get 1 Free: Dandelion Chocolate for Connoisseurs', 'Purists, Foodies and Afficionados: Buy 2 Bars Get 1 Free', 'https://s3-us-west-1.amazonaws.com/sfdc-demo/Purists+Campaign+.png', 'Offer', 'In Progress'),
    (4, 'Buy 4 Get 6: Best of San Francisco', 'Buy 4, get 6 of of the city''s finest native chocolatiers, old and new: Tcho, Dandelion, Recchiutti, Ghirardelli, Sharffenburger, Guittard.', 'https://s3-us-west-1.amazonaws.com/sfdc-demo/Best+of+San+Francisco+Campaign.png', 'Offer', 'In Progress'),
    (5, 'Free Shipping on Truffles for Mother''s Day', 'Free Shipping for all Mother’s Day gifts places >72 hours before Sunday, May 11', 'https://s3-us-west-1.amazonaws.com/sfdc-demo/nibs/soma1.jpg', 'Offer', 'In Progress'),
    (6, 'Free Shipping on Wine & Chocolate Pairings', 'Free Shipping on all wine, champagne, and chocolate pairings.', 'https://s3-us-west-1.amazonaws.com/sfdc-demo/nibs/dandelion2.jpg', 'Offer', 'In Progress'),
    (7, 'Nuts about nuts: 30% off mixed chocolate covered nuts', 'Are you nuts for nuts?', 'http://s3-us-west-1.amazonaws.com/sfdc-demo/nibs/nuts.jpg', 'Offer', 'In Progress');

INSERT INTO salesforce.product2 (id, name, description, image__c, family) VALUES
    (1, 'Caramelized Almonds', 'Addictive treats from the popular new boutique chocolatier in San Francisco''s Mission District.', 'https://s3-us-west-1.amazonaws.com/sfdc-demo/nibs/feve1.jpg', 'Nibs'),
    (2, 'Dandelion Assortment', 'Bring the flavor of San Francisco boutique chocolate into your home, or present as a gift to the foodie in your life.', 'https://s3-us-west-1.amazonaws.com/sfdc-demo/nibs/dandelion2.jpg', 'Nibs'),
    (3, 'Dandelion Small Batch', 'Experience the buzz around San Francisco''s newest boutique chocolatier. These beans are slow roasted whole for unparalleled flavor depth.', 'https://s3-us-west-1.amazonaws.com/sfdc-demo/nibs/dandelion1.jpg', 'Nibs'),
    (4, 'Matzo Crunch', 'A uniquely crunchy treat. So good we had to offer it all year round.', 'https://s3-us-west-1.amazonaws.com/sfdc-demo/nibs/matzo.jpg', 'Nibs'),
    (5, 'Patric IN-NIB-ITABLE', 'For the Nibs lovers in your life: a bar of 72% cacao, dark, sweet and strewn with crunchy nibs.', 'https://s3-us-west-1.amazonaws.com/sfdc-demo/nibs/patric2.jpg', 'Nibs'),
    (6, 'Patric Limited Edition', 'Salt and chocolate meet in a single bar. For sophisticated palettes.', 'https://s3-us-west-1.amazonaws.com/sfdc-demo/nibs/patric3.jpg', 'Nibs'),
    (7, 'Patric Mizzou Crunch', 'Some love smooth, some love crunch. This is a crunch! Lively on the palette.', 'https://s3-us-west-1.amazonaws.com/sfdc-demo/nibs/patric1.jpg', 'Nibs');

INSERT INTO salesforce.store__c (id, name, location__latitude__s, location__longitude__s) VALUES
    (1, 'Marquis', 37.785143, -122.403405),
    (2, 'Hilton', 37.786164, -122.410137),
    (3, 'Hyatt', 37.794157, -122.396311)
