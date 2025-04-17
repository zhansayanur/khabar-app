import { ChatHeader } from "@/components/chat/chat-header";
import { getOrCreateConvo } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
    params: {
      serverId: string;
      memberId: string;
    };
    searchParams: {
      video?: boolean;
    };
}

const MemberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {
    const profile = await currentProfile();
    
    if (!profile) {
            return auth().redirectToSignIn();
    }

    const currentMember = await db.member.findFirst({
        where: {
          serverId: params.serverId,
          profileId: profile.id,
        },
        include: {
          profile: true,
        },
    });

    if (!currentMember) {
        return redirect("/");
    }
    
    const conversation = await getOrCreateConvo(
        currentMember.id,
        params.memberId
    );

    if (!conversation) {
        return redirect(`/servers/${params.serverId}`);
    }

    const { memberOne, memberTwo } = conversation;

    const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

    return (
        <div className="bg-white dark:bg-slate-900 flex flex-col h-full">
            <ChatHeader
                imageUrl={otherMember.profile.imageUrl}
                name={otherMember.profile.name}
                serverId={params.serverId}
                type="conversation"
            />
            

        </div>
    );
}

export default MemberIdPage;