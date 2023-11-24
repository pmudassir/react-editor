import {
    EditorState,
    ContentBlock,
    ContentState,
    SelectionState,
} from "draft-js";

const handleUnderline = (
    selectionState,
    contentState,
    block,
    text,
    blockKey,
    editorState
) => {
    const blockSelection = selectionState.merge({
        anchorKey: blockKey,
        anchorOffset: 0,
        focusKey: blockKey,
        focusOffset: text.indexOf(" ") + 1,
    });

    const updatedContentState = contentState.merge({
        blockMap: contentState.getBlockMap().merge({
            [blockKey]: block.merge({
                type: "block-underline",
                text: text.slice(4),
            }),
        }),
    });

    const newEditorState = EditorState.push(
        editorState,
        updatedContentState,
        "change-block-data"
    );

    return EditorState.forceSelection(newEditorState, blockSelection);
};

// Example Usage
const exampleEditorState = EditorState.createEmpty();

const selectionState = SelectionState.createEmpty("blockKey");
const contentState = ContentState.createFromText("Example Text");
const block = new ContentBlock({});
const text = "Example Underlined Text";
const blockKey = "blockKey";

const updatedEditorState = handleUnderline(
    selectionState,
    contentState,
    block,
    text,
    blockKey,
    exampleEditorState
);

  // Now 'updatedEditorState' contains the modified EditorState
