import { useState } from "react";

import type { Embed } from "../lib/interfaces";
import { embedToObjectCode } from "../lib/utils";
import Highlight from "./Highlight";

function s(strings: TemplateStringsArray, ...values: string[]) {
	let escaped = "";

	for (let i = 0; i < strings.length; i++) {
		if (i > 0) {
			escaped += JSON.stringify(values[i - 1]);
		}
		escaped += strings[i];
	}

	return escaped;
}

export default function Output({ embed }: { embed: Embed }) {
	const [language, setLanguage] = useState<"json" | "js" | "py" | "rival">("rival");
	const [jsVersion, setJsVersion] = useState("14");
	const [jsMode, setJsMode] = useState("chained");

	let output = "";
	if (language === "json") {
		output = embedToObjectCode(embed, false);
	} else if (language === "rival") {
		const steps = [""];

		if (embed.author.name || embed.author.url || embed.author.iconUrl) {
			const substeps = [""];

			if (embed.author.name)
				substeps.push(`author: ${embed.author.name} `);
			if (embed.author.url)
				substeps.push(`&& url: ${embed.author.url} `);
			if (embed.author.iconUrl)
				substeps.push(`&& icon: ${embed.author.iconUrl}`);

			steps.push(`{${substeps.join("")}}$v`);
		}

		if (embed.title) steps.push(`{title: ${embed.title}}$v`);

		if (embed.content) steps.push(`{content: ${embed.content}}$v`);

		if (embed.autodelete) steps.push(`{autodelete: ${embed.autodelete}}`)

		if (embed.url) steps.push(`{url: ${embed.url}}$v`);

		if (embed.description)
			steps.push(`{description: ${embed.description}}$v`);

		if (embed.fields.length > 0) {
			const substeps = [""];

			for (const field of embed.fields) {
				substeps.push(`{field: ${field.name} && value: ${field.value} `);
				if (field.inline) substeps.push(`&& inline: true`);
				substeps.push(`}$v`);
			}

			steps.push(substeps.toString());
		}
		if (embed.buttons.length > 0) {
			const substeps = [""];

			for (const button of embed.buttons) {
				substeps.push(`{label: ${button.label} && `);
				substeps.push(`link: ${button.url}`);
				substeps.push(`}$v`);
			}

			steps.push(substeps.toString());
		}

		if (embed.image) steps.push(`{image: ${embed.image}}$v`);

		if (embed.thumbnail)
			steps.push(`{thumbnail: ${embed.thumbnail}}$v`);

		if (embed.color) steps.push(s`{color: ${embed.color}}$v`);

		if (embed.footer.text || embed.footer.iconUrl) {
			const substeps = [""];

			if (embed.footer.text)
				substeps.push(s`footer: ${embed.footer.text} `);
			if (embed.footer.iconUrl)
				substeps.push(s`&& icon: ${embed.footer.iconUrl}`);

			steps.push(`{${substeps.toString()}$v`);
		}

		if (embed.timestamp) steps.push(`{timestamp: true}$v`);

		output += steps.join("");
	} else {
		output += `embed = discord.Embed(`;

		const kwargs = [];

		if (embed.title) kwargs.push(s`title=${embed.title}`);
		if (embed.url) kwargs.push(s`url=${embed.url}`);
		if (embed.description) kwargs.push(s`description=${embed.description}`);
		if (embed.color)
			kwargs.push(`colour=${embed.color.replace("#", "0x")}`);
		if (embed.timestamp) kwargs.push(`timestamp=datetime.now()`);

		output += `${kwargs.join(",\n                      ")})\n`;

		if (embed.author.name || embed.author.url || embed.author.iconUrl) {
			output += `\nembed.set_author(`;

			const kwargs = [];

			if (embed.author.name) kwargs.push(s`name=${embed.author.name}`);
			if (embed.author.url) kwargs.push(s`url=${embed.author.url}`);
			if (embed.author.iconUrl)
				kwargs.push(s`icon_url=${embed.author.iconUrl}`);

			output += `${kwargs.join(`,\n                 `)})\n`;
		}

		if (embed.fields.length > 0) {
			for (const field of embed.fields) {
				output += s`\nembed.add_field(name=${field.name},\n`;
				output += s`                value=${field.value}`;
				if (field.inline) output += `,\n                inline=True`;
				output += ")";
			}
			output += "\n";
		}

		if (embed.image) output += s`\nembed.set_image(url=${embed.image})\n`;

		if (embed.thumbnail)
			output += s`\nembed.set_thumbnail(url=${embed.thumbnail})\n`;

		if (embed.footer.text || embed.footer.iconUrl) {
			output += `\nembed.set_footer(`;

			if (embed.footer.text) output += s`text=${embed.footer.text}`;
			if (embed.footer.iconUrl) {
				if (embed.footer.text) output += `,\n                 `;
				output += s`icon_url=${embed.footer.iconUrl}`;
			}
			output += `)\n`;
		}

		output += `\nawait ctx.send(embed=embed)`;
	}

	return (
		<div className="mt-8">
			<h2 className="text-xl font-semibold text-white">Output</h2>

			<div className="flex my-2 gap-2">
				<select
					name="language"
					id="language"
					value={language}
					onChange={e => setLanguage(e.target.value as "rival" | "py")}
				>
					<option value="json">JSON representation</option>
					<option value="rival">Rival</option>
					<option value="py">discord.py</option>
				</select>
			</div>

			<Highlight
				language={language === "json" ? "js" : language}
				className="rounded text-sm"
			>
				{output}
			</Highlight>
		</div>
	);
}
