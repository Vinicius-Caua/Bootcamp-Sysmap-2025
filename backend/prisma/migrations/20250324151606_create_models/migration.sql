/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Activities` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Activities_title_key" ON "Activities"("title");
