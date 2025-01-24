-- DropForeignKey
ALTER TABLE "Bookmark" DROP CONSTRAINT "Bookmark_meetingId_fkey";

-- AlterTable
ALTER TABLE "Bookmark" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN     "timestampMapping" JSONB;

-- CreateTable
CREATE TABLE "SpeakerMapping" (
    "id" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "customName" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpeakerMapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SpeakerMapping_meetingId_originalName_key" ON "SpeakerMapping"("meetingId", "originalName");

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpeakerMapping" ADD CONSTRAINT "SpeakerMapping_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
