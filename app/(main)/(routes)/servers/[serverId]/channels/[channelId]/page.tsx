import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

interface ChannelIdPageProps {
	params: {
		channelId: string;
		serverId: string;
	};
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
	const { channelId, serverId } = params;

	const profile = await currentProfile();

	if (!profile) {
		return redirectToSignIn();
	}

	const channel = await db.channel.findUnique({
		where: {
			id: channelId,
		},
	});

	const member = await db.member.findFirst({
		where: {
			serverId,
			profileId: profile.id,
		},
	});

	if (!member || !channel) {
		return redirect("/");
	}

	return (
		<div className="bg-white dark:bg-[#313338] flex flex-col h-full">
			<ChatHeader name={channel.name} serverId={serverId} type="channel" />
			<ChatMessages
				name={channel.name}
				type="channel"
				apiUrl="/api/messages"
				socketUrl="/api/socket/messages"
				socketQuery={{ channelId, serverId }}
				paramKey="channelId"
				paramValue={channelId}
				chatId={channelId}
				member={member}
			/>
			<ChatInput
				name={channel?.name}
				type="channel"
				apiUrl="/api/socket/messages"
				query={{ channelId, serverId }}
			/>
		</div>
	);
};

export default ChannelIdPage;
