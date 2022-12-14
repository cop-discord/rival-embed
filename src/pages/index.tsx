import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Copier from "../components/Copier";
import DiscordEmbed from "../components/DiscordEmbed";
import LimitedInput from "../components/LimitedInput";
import Output from "../components/Output";
import ValueInput from "../components/ValueInput";
import { Buttons, Embed, EmbedField } from "../lib/interfaces";
import { embedToPartial } from "../lib/utils";

function ellipses(str: string, max = 50) {
	return str.length > max ? `${str.slice(0, max - 3)}...` : str;
}

function button(type: "blue" | "red" | "disabled" = "blue") {
	return `font-medium py-1 px-2 rounded transition ${
		type === "blue"
			? "bg-[#5865f2] hover:bg-[#4752c4] text-white"
			: type === "red"
			? "bg-[#d83c3e] hover:bg-[#a12d2f] text-white"
			: "bg-[#4f545c] cursor-not-allowed"
	}`;
}

function setAllDetails(open: boolean) {
	for (const details of Array.from(
		document.getElementsByTagName("details")
	)) {
		details.open = open;
	}
}

const infoEmbed: Embed = {
	author: {
		name: "",
		url: "",
		iconUrl: ""
	},
	title: "",
	url: "",
	description: ``,
	color: "",
	fields: [
	],
	image: "",
	thumbnail: "",
	footer: {
		text: "",
		iconUrl: ""
	},
	timestamp: true,
	content: "",
	autodelete: '',
	buttons: [
	]
};

export default function Home() {
	const [authorIcon, setAuthorIcon] = useState("");
	const [authorName, setAuthorName] = useState("");
	const [authorUrl, setAuthorUrl] = useState("");
	const [content, setContent] = useState("");
	const [autodelete, setAutoDelete] = useState("");
	const [title, setTitle] = useState("");
	const [url, setUrl] = useState("");
	const [description, setDescription] = useState("");
	const [color, setColor] = useState("#202225");
	const [colorEnabled, setColorEnabled] = useState(true);

	const [fields, setFields] = useState<EmbedField[]>([]);
	const [buttons, setButtons] = useState<Buttons[]>([]);

	const [image, setImage] = useState("");
	const [thumbnail, setThumbnail] = useState("");

	const [footerText, setFooterText] = useState("");
	const [footerIcon, setFooterIcon] = useState("");
	const [timestamp, setTimestamp] = useState<boolean | undefined>(undefined);

	const [embedLoaded, setEmbedLoaded] = useState(false);

	const [error, setError] = useState<string | undefined>(undefined);

	const [modal, setModal] = useState(false);

	const router = useRouter();

	useEffect(() => {
		(async () => {
			if (!router.isReady) return;

			const { data, id } = router.query;

			if (!data && !id) {
				if (!embedLoaded) loadEmbed(infoEmbed);
				return;
			}

			try {
				let embed: any;

				if (id) {
					embed = await fetch(`/api/load?id=${id}`)
						.then(res => res.json())
						.then(res => res.embed);

					if (!embed) {
						throw new Error("No embed found.");
					}
				} else if (data) {
					const embedString = Array.isArray(data) ? data[0] : data;

					embed = JSON.parse(atob(embedString));
				}

				loadEmbed(embed);
			} catch (e) {
				loadEmbed(infoEmbed);
				setError("An error occurred while importing the embed!");
			} finally {
				router.push("/", "/", { shallow: true });
			}
		})();
	}, [router]);

	useEffect(() => {
		if (
			title.length +
				description.length +
				fields.reduce(
					(acc, cur) => acc + cur.name.length + cur.value.length,
					0
				) +
				footerText.length +
				authorName.length >
			6000
		) {
			setError(
				"The total number of characters in the embed content must not exceed 6000!"
			);
		}
	}, [title, description, fields, buttons, autodelete, content, footerText, authorName]);

	function loadEmbed(embed: Embed) {
		setAuthorIcon(embed.author?.iconUrl ?? "");
		setAuthorName(embed.author?.name ?? "");
		setAuthorUrl(embed.author?.url ?? "");
		setContent(embed.content ?? "");
		setAutoDelete(embed.autodelete ?? "");
		setTitle(embed.title ?? "");
		setUrl(embed.url ?? "");
		setDescription(embed.description ?? "");

		setFields(embed.fields ?? []);
		setButtons(embed.buttons ?? []);

		setImage(embed.image ?? "");
		setThumbnail(embed.thumbnail ?? "");

		if (embed.color) setColor(embed.color);
		setColorEnabled(embed.color !== undefined);

		setFooterText(embed.footer?.text ?? "");
		setFooterIcon(embed.footer?.iconUrl ?? "");

		setTimestamp(embed.timestamp ?? false);

		setEmbedLoaded(true);
	}

	const embed: Embed = {
		author: {
			name: authorName,
			iconUrl: authorIcon,
			url: authorUrl
		},
		title: title,
		url: url,
		description: description,
		fields: fields.map(field => ({
			name: field.name,
			value: field.value,
			inline: field.inline
		})),
		image: image,
		thumbnail: thumbnail,
		color: colorEnabled ? color : undefined,
		footer: {
			text: footerText,
			iconUrl: footerIcon
		},
		timestamp,
		content: content,
		autodelete: autodelete,
		buttons: buttons.map(butto => ({
			label: butto.label,
			url: butto.url
		}))
	};

	return (
		<div className="screen flex min-h-screen">
			<div className="flex-1 embed-inputs">
				<div>
					<div className="flex justify-between">
						<h1 className="text-white font-semibold text-2xl">
							Discord Embed Creator
						</h1>
						<a
							href="Rival"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:underline"
						>
							Rival
						</a>
					</div>

					<div className="flex mt-2 gap-2">
						<button
							type="button"
							onClick={() => {
								setAllDetails(false);
								setAuthorName("");
								setAuthorIcon("");
								setAuthorUrl("");
								setTitle("");
								setUrl("");
								setButtons([]);
								setContent("");
								setAutoDelete("");
								setDescription("");
								setFields([]);
								setImage("");
								setThumbnail("");
								setColorEnabled(false);
								setFooterText("");
								setFooterIcon("");
								setTimestamp(undefined);
								setError(undefined);
							}}
							className={button("red")}
						>
							Clear All
						</button>

						<button
							type="button"
							onClick={() => setAllDetails(true)}
							className={button()}
						>
							Expand All
						</button>
						<button
							type="button"
							onClick={() => setAllDetails(false)}
							className={button()}
						>
							Collapse All
						</button>

						<button
							type="button"
							onClick={() => setModal(true)}
							className={button()}
						>
							Share Your Embed
						</button>
					</div>
				</div>

				{error ? (
					<div className="px-4 py-2 rounded bg-[#d83c3e] font-semibold text-white">
						{error}
					</div>
				) : null}
				<details open>
					<summary>
						<h2>
							Content
							{content ? (
								<> &ndash; {ellipses(content)}</>
							) : null}
						</h2>
					</summary>
						<ValueInput
						label="Content"
						value={[content, setContent]}
						limit={2000}
						textarea={true}
					/>
				</details>
				<details open>
					<summary>
						<h2>
							AutoDelete
							{autodelete ? (
								<> &ndash; {ellipses(autodelete)}</>
							) : null}
						</h2>
					</summary>
						<ValueInput
						label="AutoDelete"
						value={[autodelete, setAutoDelete]}
						limit={1}
						textarea={true}
					/>
				</details>
				<details open>
					<summary>
						<h2>
							Author
							{authorName ? (
								<> &ndash; {ellipses(authorName)}</>
							) : null}
						</h2>
					</summary>
					<ValueInput
						label="Author Name"
						value={[authorName, setAuthorName]}
						limit={256}
					/>
					<ValueInput
						label="Author URL"
						value={[authorUrl, setAuthorUrl]}
					/>
					<ValueInput
						label="Author Icon URL"
						value={[authorIcon, setAuthorIcon]}
					/>
				</details>
				<details open>
					<summary>
						<h2>
							Body
							{title ? <> &ndash; {ellipses(title)}</> : null}
						</h2>
					</summary>
					<ValueInput
						label="Title"
						value={[title, setTitle]}
						limit={256}
					/>
					<ValueInput label="Title URL" value={[url, setUrl]} />
					<ValueInput
						label="Description"
						value={[description, setDescription]}
						limit={4096}
						textarea={true}
					/>
					<div className="flex items-center gap-2">
						<label htmlFor="color">Color</label>
						<input
							type="color"
							id="color"
							value={color}
							onChange={e => setColor(e.target.value)}
							disabled={!colorEnabled}
							className="mt-2"
						/>
						<label
							htmlFor="color-enabled"
							className="text-sm text-white ml-2"
						>
							Enabled?
						</label>
						<input
							type="checkbox"
							checked={colorEnabled}
							id="color-enabled"
							value={color}
							onChange={e => setColorEnabled(!colorEnabled)}
							className="mt-2"
						/>
					</div>
				</details>
				<details open className="fields">
					<summary>
						<h2>Fields &ndash; {fields.length}</h2>
					</summary>
					{fields.map((field, index) => (
						<details key={index}>
							<summary>
								<h3 className="text-white font-semibold mr-auto">
									Field {index + 1} &ndash;{" "}
									{ellipses(field.name)}
								</h3>
								<button
									onClick={() => {
										if (index === 0) return;
										const newFields = [...fields];
										[
											newFields[index - 1],
											newFields[index]
										] = [
											newFields[index],
											newFields[index - 1]
										];
										setFields(newFields);
									}}
									className={button(
										index === 0 ? "disabled" : "blue"
									)}
								>
									Move Up
								</button>
								<button
									onClick={() => {
										if (index === fields.length - 1) return;
										const newFields = [...fields];
										[
											newFields[index + 1],
											newFields[index]
										] = [
											newFields[index],
											newFields[index + 1]
										];
										setFields(newFields);
									}}
									className={button(
										index === fields.length - 1
											? "disabled"
											: "blue"
									)}
								>
									Move Down
								</button>
								<button
									onClick={() => {
										setFields(
											fields.filter((_, i) => i !== index)
										);
									}}
									className={button("red")}
								>
									Delete
								</button>
							</summary>
							<div>
								<label htmlFor={`field-name-${index}`}>
									Name
								</label>
								<LimitedInput
									limit={256}
									required={true}
									type="text"
									id={`field-name-${index}`}
									value={field.name}
									onChange={e => {
										const newFields = [...fields];
										newFields[index].name = e.target.value;
										setFields(newFields);
									}}
								/>
							</div>
							<div>
								<label htmlFor={`field-value-${index}`}>
									Value
								</label>
								<LimitedInput
									limit={1024}
									required={true}
									textarea={true}
									id={`field-value-${index}`}
									value={field.value}
									onChange={e => {
										const newFields = [...fields];
										newFields[index].value = e.target.value;
										setFields(newFields);
									}}
								/>
							</div>
							<div className="flex items-center justify-start gap-2">
								<label htmlFor={`field-inline-${index}`}>
									Inline
								</label>
								<input
									type="checkbox"
									id={`field-inline-${index}`}
									checked={field.inline}
									onChange={e => {
										const newFields = [...fields];
										newFields[index].inline =
											e.target.checked;
										setFields(newFields);
									}}
									className="mt-2"
								/>
							</div>
						</details>
					))}
					<button
						type="button"
						onClick={() => {
							if (fields.length < 25)
								setFields([
									...fields,
									{
										name: "A New Field",
										value: "",
										inline: false
									}
								]);
						}}
						className={`mt-4 ${button(
							fields.length < 25 ? "blue" : "disabled"
						)}`}
					>
						Add Field
					</button>
				</details>
				<details open className="buttons">
					<summary>
						<h2>Buttons &ndash; {buttons.length}</h2>
					</summary>
					{buttons.map((butto, index) => (
						<details key={index}>
							<summary>
								<h3 className="text-white font-semibold mr-auto">
									Button {index + 1} &ndash;{" "}
									{ellipses(butto.label)}
								</h3>
								<button
									onClick={() => {
										if (index === 0) return;
										const newButtons = [...buttons];
										[
											newButtons[index - 1],
											newButtons[index]
										] = [
											newButtons[index],
											newButtons[index - 1]
										];
										setButtons(newButtons);
									}}
									className={button(
										index === 0 ? "disabled" : "blue"
									)}
								>
									Move Up
								</button>
								<button
									onClick={() => {
										if (index === buttons.length - 1) return;
										const newButtons = [...buttons];
										[
											newButtons[index + 1],
											newButtons[index]
										] = [
											newButtons[index],
											newButtons[index + 1]
										];
										setButtons(newButtons);
									}}
									className={button(
										index === buttons.length - 1
											? "disabled"
											: "blue"
									)}
								>
									Move Down
								</button>
								<button
									onClick={() => {
										setButtons(
											buttons.filter((_, i) => i !== index)
										);
									}}
									className={button("red")}
								>
									Delete
								</button>
							</summary>
							<div>
								<label htmlFor={`button-label-${index}`}>
									Name
								</label>
								<LimitedInput
									limit={256}
									required={true}
									type="text"
									id={`button-label-${index}`}
									value={butto.label}
									onChange={e => {
										const newButtons = [...buttons];
										newButtons[index].label = e.target.value;
										setButtons(newButtons);
									}}
								/>
							</div>
							<div>
								<label htmlFor={`button-label-${index}`}>
									Value
								</label>
								<LimitedInput
									limit={1024}
									required={true}
									textarea={true}
									id={`button-label-${index}`}
									value={butto.url}
									onChange={e => {
										const newButtons = [...buttons];
										newButtons[index].url = e.target.value;
										setButtons(newButtons);
									}}
								/>
							</div>
						</details>
					))}
					<button
						type="button"
						onClick={() => {
							if (buttons.length < 25)
								setButtons([
									...buttons,
									{
										label: "A New Button",
										url: ""
									}
								]);
						}}
						className={`mt-4 ${button(
							buttons.length < 25 ? "blue" : "disabled"
						)}`}
					>
						Add Button
					</button>
				</details>
				<details open>
					<summary>
						<h2>Images</h2>
					</summary>
					<ValueInput label="Image URL" value={[image, setImage]} />
					<ValueInput
						label="Thumbnail URL"
						value={[thumbnail, setThumbnail]}
					/>
				</details>
				<details open>
					<summary>
						<h2>
							Footer
							{footerText ? (
								<> &ndash; {ellipses(footerText)}</>
							) : null}
						</h2>
					</summary>
					<ValueInput
						label="Footer Text"
						value={[footerText, setFooterText]}
						limit={2048}
					/>
					<ValueInput
						label="Footer Icon URL"
						value={[footerIcon, setFooterIcon]}
					/>
					<div className="flex items-center gap-2">
						<label htmlFor="timestamp">Timestamp?</label>
						<input
							type="checkbox"
							id="timestamp"
							checked={!!timestamp}
							onChange={e =>
								setTimestamp(
									e.target.checked ? true : undefined
								)
							}
							className="mt-2"
						/>
					</div>
				</details>
			</div>

			<div className="flex-1 bg-[#36393f] p-8">
				<DiscordEmbed embed={embed} />

				<Output embed={embed} />
			</div>

			{modal ? (
				<>
					<div
						className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-50"
						onClick={() => setModal(false)}
					/>

					<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#292b2f] p-4 rounded">
						<h2 className="text-white text-xl font-semibold">
							Share Your Embed
						</h2>

						<p className="mb-2">
							Click the button below to copy a link to share your
							embed.
						</p>

						<p className="mb-1">
							The short link will be valid for one week.
						</p>

						<Copier
							getContent={async () => {
								const { id } = await fetch("/api/save", {
									body: JSON.stringify({
										embed: embedToPartial(embed)
									}),
									method: "POST",
									headers: {
										"Content-Type": "application/json"
									}
								}).then(res => res.json());

								return `${location.origin}/?id=${id}`;
							}}
							idleClassName={button()}
							loadingClassName={`${button(
								"disabled"
							)} animate-pulse`}
							copiedClassName={button("disabled")}
							errorClassName={button("disabled")}
							timeout={30000}
						>
							Copy Short Link
						</Copier>

						<p className="mt-2 mb-1">
							The permanent link contains all of your embed data.
						</p>

						<Copier
							getContent={() =>
								`${location.origin}/?data=${encodeURIComponent(
									btoa(JSON.stringify(embedToPartial(embed)))
								)}`
							}
							idleClassName={button()}
							copiedClassName={button("disabled")}
						>
							Copy Permanent Link
						</Copier>
					</div>
				</>
			) : null}
		</div>
	);
}
