import React, { StrictMode, useCallback, useEffect, useRef, useState } from "https://esm.sh/react";
import { createRoot } from "https://esm.sh/react-dom/client";
import { Flipper, Flipped } from "https://esm.sh/react-flip-toolkit";
import { faker } from "https://esm.sh/@faker-js/faker";
createRoot(document.getElementById("root")).render(React.createElement(StrictMode, null,
    React.createElement(NotificationCenter, null)));
function generateNote() {
    const emojiList = {
        male: ["👱🏻‍♂️", "👨🏻", "👨🏻‍🦳", "🧔🏽‍♂️", "👨🏾", "👨🏿‍🦱", "👨🏿‍🦲"],
        female: ["👱🏻‍♀️", "👩🏻", "👩🏻‍🦳", "👩🏽", "👩🏽‍🦱", "👧🏿", "👩🏿"]
    };
    const randomHue = faker.number.int({ max: 359 });
    const sex = faker.person.sex();
    const emojisBySex = emojiList[sex];
    const emojiIndex = faker.number.int({ max: emojisBySex.length - 1 });
    const user = {
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
function Avatar({ color, emoji }) {
    const colorStyle = {
        backgroundColor: color
    };
    return (React.createElement("div", { className: "avatar", style: colorStyle }, emoji));
}
function Notification({ user, message, fadingOut }) {
    const noteClass = `note${fadingOut ? " note--out" : ""}`;
    return (React.createElement("div", { className: noteClass },
        React.createElement("div", { className: "note__inner" },
            React.createElement(Avatar, { color: user.color, emoji: user.emoji }),
            React.createElement("div", { className: "note__content" },
                React.createElement("h3", { className: "note__title" }, user.name),
                React.createElement("p", { className: "note__message" }, message)))));
}
function NotificationCenter() {
    const [notes, setNotes] = useState([]);
    const timeoutRef = useRef(null);
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
                    return Object.assign(Object.assign({}, note), { fadingOut: true });
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
    return (React.createElement(Flipper, { flipKey: notes.map(note => note.id).join("") },
        React.createElement("div", { className: "note-center" }, notes.map((note) => (React.createElement(Flipped, { key: note.id, flipId: note.id },
            React.createElement("div", null,
                React.createElement(Notification, Object.assign({}, note)))))))));
}