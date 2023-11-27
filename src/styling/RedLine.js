import {
    EditorState,
    ContentBlock,
    ContentState,
    SelectionState,
} from "draft-js";

const handleRed = (
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
                type: "block-red",
                text: text.slice(3),
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

const exampleEditorState = EditorState.createEmpty();

const selectionState = SelectionState.createEmpty("blockKey");
const contentState = ContentState.createFromText("Example Text");
const block = new ContentBlock({});
const text = "Example Red Text";
const blockKey = "blockKey";

const updatedEditorState = handleRed(
    selectionState,
    contentState,
    block,
    text,
    blockKey,
    exampleEditorState
);