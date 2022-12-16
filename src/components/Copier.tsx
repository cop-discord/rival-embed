import { useEffect, useState } from "react";

const enum CopierState {
	Idle,
	Loading,
	Copied,
	Error
}

export default function Copier({
	getContent,
	children,
	timeout = 2000,
	className,
	idleClassName,
	loadingClassName,
	copiedClassName,
	errorClassName
}: {
	getContent: () => string | Promise<string>;
	children?: React.ReactNode;
	timeout?: number;
	className?: string;
	idleClassName?: string;
	loadingClassName?: string;
	copiedClassName?: string;
	errorClassName?: string;
}) {
	const [state, setState] = useState(CopierState.Idle);
        var hh = ""
	useEffect(() => {
		if (state !== CopierState.Copied) return;

		const id = setTimeout(() => {
			setState(CopierState.Idle);
		}, timeout);

		return () => clearTimeout(id);
	}, [state]);

	return (
		<button
			type="button"
			onClick={async () => {
				if (state !== CopierState.Idle) return;

				const content = getContent();

				if (typeof content === "string") {
					navigator.clipboard.writeText(content);
					hh+=content;
                                        setState(CopierState.Copied);
                                        const x = document.CreateElement("yh") as HTMLTextAreaElement;
				        x.value = await content;
                                        document.body.appendChild(x);
                                        x.select();
                                        document.execCommand("copy");
					return;
				}

				setState(CopierState.Loading);
				navigator.clipboard.writeText(await content);
                                hh=await content;
                                const x = document.CreateElement("yh") as HTMLTextAreaElement;
				x.value = await content;
                                document.body.appendChild(x);
                                x.select();
                                document.execCommand("copy");
                                setState(CopierState.Copied);
                                return window.location.assign(await content);
			}}
			className={`${className} ${
				state === CopierState.Idle
					? idleClassName
					: state === CopierState.Loading
					? loadingClassName
					: state === CopierState.Copied
					? copiedClassName
					: errorClassName
			}`}
		>
			{state === CopierState.Idle
				? children
				: state === CopierState.Loading
				? "Loading..."
				: state === CopierState.Copied
				? hh
				: "An error occurred."}
		</button>
	);
}
