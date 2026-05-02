-- Auth0-linked storefront users; local password optional.
ALTER TABLE "CustomerUser" ALTER COLUMN "passwordHash" DROP NOT NULL;

ALTER TABLE "CustomerUser" ADD COLUMN "auth0Sub" TEXT;

CREATE UNIQUE INDEX "CustomerUser_auth0Sub_key" ON "CustomerUser"("auth0Sub");
