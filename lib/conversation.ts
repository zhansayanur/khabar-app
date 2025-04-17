import { db } from "@/lib/db";

export const getOrCreateConvo = async (memberOneId: string, memberTwoId: string) => {
    let conversation = await findConvo(memberOneId, memberTwoId) || await findConvo(memberTwoId, memberOneId);
  
    if (!conversation) {
      conversation = await createNewConvo(memberOneId, memberTwoId);
    }
  
    return conversation;
}

const findConvo = async (memberOneId: string, memberTwoId: string) => {
    try {
      return await db.conversation.findFirst({
        where: {
          AND: [
            { memberOneId: memberOneId },
            { memberTwoId: memberTwoId },
          ]
        },
        include: {
          memberOne: {
            include: {
              profile: true,
            }
          },
          memberTwo: {
            include: {
              profile: true,
            }
          }
        }
      });
    } catch {
      return null;
    }
}

const createNewConvo = async (memberOneId: string, memberTwoId: string) => {
    try {
      return await db.conversation.create({
        data: {
          memberOneId,
          memberTwoId,
        },
        include: {
          memberOne: {
            include: {
              profile: true,
            }
          },
          memberTwo: {
            include: {
              profile: true,
            }
          }
        }
      })
    } catch {
      return null;
    }
}