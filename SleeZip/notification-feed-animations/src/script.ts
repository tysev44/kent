import React, { StrictMode, useCallback, useEffect, useRef, useState } from "https://esm.sh/react";
import { createRoot } from "https://esm.sh/react-dom/client";
import { Flipper, Flipped } from "https://esm.sh/react-flip-toolkit";
import { faker } from "https://esm.sh/@faker-js/faker";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<NotificationCenter />
	</StrictMode>
);

function generateNote(): NotificationProps {
	const emojiList = {
		male: ["👱🏻‍♂️", "👨🏻", "👨🏻‍🦳", "🧔🏽‍♂️", "👨🏾", "👨🏿‍🦱", "👨🏿‍🦲"],
		female: ["👱🏻‍♀️", "👩🏻", "👩🏻‍🦳", "👩🏽", "👩🏽‍🦱", "👧🏿", "👩🏿"]
	};
	const randomHue = faker.number.int({ max: 359 });
	const sex = faker.person.sex() as UserSex;
	const emojisBySex = emojiList[sex];
	const emojiIndex = faker.number.int({ max: emojisBySex.length - 1 });
	const user: User = {
		color: `hsl(${randomHue}, 90%, 90%)`,
		emoji: emojisBySex[emojiIndex],
		name: faker.person.fullName({ sex })
	};

	return {
		id: faker.string.uuid(),
		user,
		message: faker.hacker.phrase()
	};
}
function Avatar({ color, emoji }: AvatarProps) {
	const colorStyle = {
		backgroundColor: color
	};

	return (
		<div className="avatar" style={colorStyle}>{emoji}</div>
	);
}
function Notification({ user, message, fadingOut }: NotificationProps) {
	const noteClass = `note${fadingOut ? " note--out" : ""}`;

	return (
		<div className={noteClass}>
			<div className="note__inner">
				<Avatar color={user.color} emoji={user.emoji} />
				<div className="note__content">
					<h3 className="note__title">{user.name}</h3>
					<p className="note__message">{message}</p>
				</div>
			</div>
		</div>
	);
}
function NotificationCenter() {
	const [notes, setNotes] = useState<NotificationProps[]>([]);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const notesMax = 3;
	const intervalMs = 1000;

	const addNote = useCallback(() => {
		setNotes(prev => {
			if (prev.length < notesMax) {
				// allow population until max
				return [...prev, generateNote()];
			}
			// remove those faded out
			const updated = prev
				.filter((note) => !note.fadingOut)
				.map((note, i) => {
					if (i === 0) {
						return { ...note, fadingOut: true }
					}
					return note;
				});
			// add as usual
			updated.push(generateNote());

			return updated;
		});

		timeoutRef.current = setTimeout(addNote, intervalMs);
	}, []);

	useEffect(() => {
		timeoutRef.current = setTimeout(addNote, 1);

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return (
		<Flipper flipKey={notes.map(note => note.id).join("")}>
			<div className="note-center">
				{notes.map((note) => (
					<Flipped key={note.id} flipId={note.id}>
						{/* div is required for transitions to work */}
						<div>
							<Notification {...note} />
						</div>
					</Flipped>
				))}
			</div>
		</Flipper>
	);
}

type AvatarProps = {
	color: string;
	emoji: string;
};
type User = {
	color: string;
	emoji: string;
	name: string;
};
type UserSex = "female" | "male";
type NotificationProps = {
	id: string;
	user: User;
	message: string;
	fadingOut?: boolean;
};