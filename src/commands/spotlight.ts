import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import * as database from "../Serendipy/prisma";
import paginationEmbed from "../pagination";

export default {
	data: {
		meta: new SlashCommandBuilder()
			.setName("spotlight")
			.setDescription("View AntiRaid Forums Spotlight"),
		category: "social",
		accountRequired: true,
		permissionRequired: null,
	},
	async execute(client, interaction, otherData) {
		const data = await database.Posts.listAllPosts();

		const pages: EmbedBuilder[] = data.map((post) => {
			const embed = new EmbedBuilder()
				.setTitle("Spotlight")
				.setDescription(post.caption)
				.setColor("Random")
				.setURL("https://antiraid.xyz/forums")
				.setThumbnail("https://antiraid.xyz/logo.webp")
				.setAuthor({
					name: post.user.usertag,
					iconURL:
						post.user.avatar === "None"
							? "https://antiraid.xyz/logo.webp"
							: post.user.avatar,
					url: `https://antiraid.xyz/forums/@${post.user.usertag}`,
				})
				.setTimestamp();

			if (post.image) embed.setImage(post.image);
			else if (post.plugins.find((a) => a.type === "tenor"))
				embed.setImage(
					post.plugins.find((a) => a.type === "tenor").href
				);
			return embed;
		});

		await paginationEmbed(interaction, pages, [
			{
				button: new ButtonBuilder()
					.setLabel("Upvote")
					.setStyle(ButtonStyle.Secondary)
					.setCustomId("upvote"),
				execute: async (page, collector) => {},
			},
			{
				button: new ButtonBuilder()
					.setLabel("Downvote")
					.setStyle(ButtonStyle.Secondary)
					.setCustomId("downvote"),
				execute: async (page, collector) => {},
			},
		]);
	},
	async autocomplete(client, interaction) {},
};
