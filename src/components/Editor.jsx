import React, { useEffect, useRef, useState } from "react";
import { ContentBlock, Editor, EditorState, convertFromRaw, convertToRaw } from "draft-js";
import { handleHeading } from "./utils/headerLogic";
import { handleUnderline } from "./utils/underlineLogic";
import { handleRed } from "./utils/redLogic";
import { handleBold } from "./utils/boldLogic";
import "./App.css";

export const MyEditor = () => {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const childRef = useRef(null);

    useEffect(() => {
        let localItem = localStorage.getItem("editorContext");
        if (localItem) {
            const context = convertFromRaw(JSON.parse(localItem));
            setEditorState(EditorState.createWithContent(context));
        }
    }, []);

    const handleChange = (editorState) => {
        const selection = editorState.getSelection();
        const content = editorState.getCurrentContent();
        const block = content.getBlockForKey(selection.getStartKey());
        const text = block.getText();
        const contentState = editorState.getCurrentContent();
        const selectionState = editorState.getSelection();
        const blockKey = block.getKey();

        if (text.startsWith("# ")) {
            const newEditorState = handleHeading(
                selectionState,
                contentState,
                block,
                text,
                blockKey,
                editorState
            );
            setEditorState(newEditorState);
            return true;
        } else if (text.startsWith("*** ")) {
            const newEditorState = handleUnderline(
                selectionState,
                contentState,
                block,
                text,
                blockKey,
                editorState
            );
            setEditorState(newEditorState);
            return true;
        } else if (text.startsWith("** ")) {
            const newEditorState = handleRed(
                selectionState,
                contentState,
                block,
                text,
                blockKey,
                editorState
            );
            setEditorState(newEditorState);
            return true;
        } else if (text.startsWith("* ")) {
            const newEditorState = handleBold(
                selectionState,
                contentState,
                block,
                text,
                blockKey,
                editorState
            );
            setEditorState(newEditorState);
            return true;
        }

        setEditorState(editorState);
        return false;
    };

    const handleSave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        localStorage.setItem(
            "editorContext",
            JSON.stringify(convertToRaw(editorState.getCurrentContent()))
        );
    };

    function myBlockStyleFn(contentBlock) {
        const type = contentBlock.getType();
        if (type === "block-bold") {
            return "BoldBlock";
        }
        if (type === "block-red") {
            return "RedBlock";
        }
        if (type === "block-underline") {
            return "UnderlineBlock";
        }
    }

    return (
        <div className="container">
            <div className="titleBar">
                <span></span>
                <p>Demo editor by Ishan Jaiswal</p>
                <button onClick={handleSave}>Save</button>
            </div>
            <div
                onClick={() => childRef.current && childRef.current.focus()}
                className="editor"
            >
                <Editor
                    ref={childRef}
                    editorState={editorState}
                    onChange={handleChange}
                    blockStyleFn={myBlockStyleFn}
                />
            </div>
        </div>
    );
}