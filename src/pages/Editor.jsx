import React, { useState, useEffect } from 'react';
import { Editor, EditorState, RichUtils, getDefaultKeyBinding, convertToRaw, convertFromRaw } from 'draft-js';
import "./editor.css";
import "../../node_modules/draft-js/dist/Draft.css";

const MyEditor = ({ onSave }) => {
    const [editorState, setEditorState] = useState(() => {
        const savedContent = localStorage.getItem('editorContent');
        return savedContent
            ? EditorState.createWithContent(convertFromRaw(JSON.parse(savedContent)))
            : EditorState.createEmpty();
    });

    useEffect(() => {
        const contentState = editorState.getCurrentContent();
        localStorage.setItem('editorContent', JSON.stringify(convertToRaw(contentState)));
    }, [editorState]);

    const handleKeyCommand = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);

        if (newState) {
            setEditorState(newState);
            return 'handled';
        }

        return 'not-handled';
    };

    const mapKeyToEditorCommand = (e) => {
        if (e.keyCode === 9 /* TAB */) {
            const newEditorState = RichUtils.onTab(e, editorState, 4 /* maxDepth */);
            if (newEditorState !== editorState) {
                setEditorState(newEditorState);
            }
            return;
        }
        return getDefaultKeyBinding(e);
    };

    const onBoldClick = () => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
    };

    const onHeadingClick = () => {
        setEditorState(RichUtils.toggleBlockType(editorState, 'header-one'));
    };

    const onRedLineClick = () => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'REDLINE'));
    };

    const onUnderlineClick = () => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'));
    };

    const editorStyle = {
        border: '1px solid #ddd',
        minHeight: '200px',
        padding: '10px',
    };

    return (
        <div>
            <div>
                <button onClick={onBoldClick}>Bold</button>
                <button onClick={onHeadingClick}>Heading 1</button>
                <button onClick={onRedLineClick}>Red Line</button>
                <button onClick={onUnderlineClick}>Underline</button>
            </div>
            <div style={editorStyle}>
                <Editor
                    editorState={editorState}
                    handleKeyCommand={handleKeyCommand}
                    keyBindingFn={mapKeyToEditorCommand}
                    onChange={setEditorState}
                />
            </div>
            <button onClick={() => onSave(editorState)}>Save</button>
        </div>
    );
};

export default MyEditor;