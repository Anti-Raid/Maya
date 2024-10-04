import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder } from "discord.js";
import * as database from "../Serendipy/prisma";

export default {
	data: {
		meta: new SlashCommandBuilder()
			.setName("about")
			.setDescription("About AntiRaid Forums"),
		category: "general",
		accountRequired: false,
		permissionRequired: null,
	},
	async execute(client, interaction, otherData) {
		// Social Media
		const social: {
			name: string;
			url: string;
		}[] = [
			{
				name: "Discord Server",
				url: "https://discord.gg/9BJWSrEBBJ",
			},
			{
				name: "Github",
				url: "https://github.com/anti-raid",
			},
		];

		// Fetch list of partners from the database
		const partners = await database.Partners.getAllPartners();

		// Reply
		return await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("About AntiRaid Forums")
					.setURL("https://antiraid.xyz/forums")
					.setThumbnail("https://antiraid.xyz/logo.webp")
					.setColor("Random")
					.setDescription(
						"Oh, hello there. Welcome to AntiRaid Forums, here; you may ask questions, get AntiRaid Support, or even hang out."
					)
					.addFields(
						{
							name: "Social Media",
							value: social
								.map((s) => `[**${s.name}**](${s.url})`)
								.join("\n"),
							inline: true,
						},
						{
							name: "Partners",
							value: partners
								.map(
									(partner) =>
										`[**${partner.name}**](https://antiraid.xyz/partners/${partner.id}) - ${partner.description}`
								)
								.join("\n"),
							inline: true,
						}
					),
			],
		});
	},
	async autocomplete(client, interaction) {},
};
