-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_mainFolderId_fkey";

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_mainFolderId_fkey" FOREIGN KEY ("mainFolderId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
