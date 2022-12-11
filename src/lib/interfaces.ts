/**
 * Represents a Discord message embed.
 */
export interface Embed {
	/**
	 * Embed title.
	 */
	title: any;
	/**
	 * Embed description.
	 */
	description: any;
	content: any;
	autodelete: any;
	/**
	 * Embed URL.
	 */
	url: any;
	/**
	 * Embed timestamp in epoch time.
	 */
	timestamp?: any;
	/**
	 * Embed color.
	 */
	color?: any;
	/**
	 * Embed image URL.
	 */
	image: any;
	/**
	 * Embed thumbnail URL.
	 */
	thumbnail: any;
	/**
	 * Embed footer object.
	 */
	footer: EmbedFooter;
	/**
	 * Embed author object.
	 */
	author: EmbedAuthor;
	/**
	 * Embed fields array.
	 */
	fields: EmbedField[];
	buttons: Buttons[];
}

export interface Buttons {
	label?: any;
	url?: any;
}

export interface EmbedFooter {
	/**
	 * Embed footer text.
	 */
	text: any;
	/**
	 * Embed footer icon URL.
	 */
	iconUrl: any;
}

export interface EmbedAuthor {
	/**
	 * Embed author name.
	 */
	name: any;
	/**
	 * Embed author URL.
	 */
	url: any;
	/**
	 * Embed author icon URL.
	 */
	iconUrl: any;
}

export interface EmbedField {
	/**
	 * Embed field name.
	 */
	name: any;
	/**
	 * Embed field value.
	 */
	value: any;
	/**
	 * Embed field inline flag.
	 */
	inline: boolean;
}
