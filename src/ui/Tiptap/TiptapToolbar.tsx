import { Button, ButtonGroup } from '@nextui-org/react';
import { type Editor } from '@tiptap/react';
import { useCallback } from 'react';
import {
  PiImage,
  PiLink,
  PiListBullets,
  PiListNumbers,
  PiTextAlignCenter,
  PiTextAlignJustify,
  PiTextAlignLeft,
  PiTextAlignRight,
  PiTextBBold,
  PiTextHOne,
  PiTextHThree,
  PiTextHTwo,
  PiTextItalic,
  PiTextUnderline
} from 'react-icons/pi';

interface TiptapToolbarProps {
  editor: Editor | null;
}
const TiptapToolbar: React.FC<TiptapToolbarProps> = ({ editor }) => {
  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();

      return;
    }

    // update link
    editor
      ?.chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run();
  }, [editor]);

  const addImage = useCallback(() => {
    const url = window.prompt('URL');

    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }
  return (
    <div className="flex flex-row flex-wrap justify-start items-center w-full gap-4 mb-4">
      <ButtonGroup size="sm">
        <Button
          isIconOnly
          value="any"
          variant={editor?.isActive('bold') ? 'faded' : 'solid'}
          onClick={() => {
            editor?.chain().focus().toggleBold().run();
          }}
        >
          <PiTextBBold />
        </Button>
        <Button
          isIconOnly
          value="any"
          variant={editor?.isActive('italic') ? 'faded' : 'solid'}
          onClick={() => {
            editor?.chain().focus().toggleItalic().run();
          }}
        >
          <PiTextItalic />
        </Button>
        <Button
          isIconOnly
          value="any"
          variant={editor?.isActive('underline') ? 'faded' : 'solid'}
          onClick={() => {
            editor?.chain().focus().toggleUnderline().run();
          }}
        >
          <PiTextUnderline />
        </Button>
      </ButtonGroup>
      <ButtonGroup size="sm">
        <Button
          isIconOnly
          value="any"
          variant={
            editor?.isActive('heading', { level: 1 }) ? 'faded' : 'solid'
          }
          onClick={() => {
            editor?.chain().focus().toggleHeading({ level: 1 }).run();
          }}
        >
          <PiTextHOne />
        </Button>
        <Button
          isIconOnly
          value="any"
          variant={
            editor?.isActive('heading', { level: 2 }) ? 'faded' : 'solid'
          }
          onClick={() => {
            editor?.chain().focus().toggleHeading({ level: 2 }).run();
          }}
        >
          <PiTextHTwo />
        </Button>
        <Button
          isIconOnly
          value="any"
          variant={
            editor?.isActive('heading', { level: 3 }) ? 'faded' : 'solid'
          }
          onClick={() => {
            editor?.chain().focus().toggleHeading({ level: 3 }).run();
          }}
        >
          <PiTextHThree />
        </Button>
      </ButtonGroup>
      <ButtonGroup size="sm">
        <Button
          isIconOnly
          value="any"
          variant={
            editor?.isActive('text-align', { textAlign: 'left' })
              ? 'faded'
              : 'solid'
          }
          onClick={() => {
            editor?.chain().focus().setTextAlign('left').run();
          }}
        >
          <PiTextAlignLeft />
        </Button>
        <Button
          isIconOnly
          value="any"
          variant={
            editor?.isActive('text-align', { textAlign: 'center' })
              ? 'faded'
              : 'solid'
          }
          onClick={() => {
            editor?.chain().focus().setTextAlign('center').run();
          }}
        >
          <PiTextAlignCenter />
        </Button>
        <Button
          isIconOnly
          value="any"
          variant={
            editor?.isActive('text-align', { textAlign: 'right' })
              ? 'faded'
              : 'solid'
          }
          onClick={() => {
            editor?.chain().focus().setTextAlign('right').run();
          }}
        >
          <PiTextAlignRight />
        </Button>
        <Button
          isIconOnly
          value="any"
          variant={
            editor?.isActive('text-align', { textAlign: 'justify' })
              ? 'faded'
              : 'solid'
          }
          onClick={() => {
            editor?.chain().focus().setTextAlign('justify').run();
          }}
        >
          <PiTextAlignJustify />
        </Button>
      </ButtonGroup>
      <ButtonGroup size="sm">
        <Button
          isIconOnly
          value="any"
          variant={editor?.isActive('bulletList') ? 'faded' : 'solid'}
          onClick={() => {
            editor?.chain().focus().toggleBulletList().run();
          }}
        >
          <PiListBullets />
        </Button>
        <Button
          isIconOnly
          value="any"
          variant={editor?.isActive('orderedList') ? 'faded' : 'solid'}
          onClick={() => {
            editor?.chain().focus().toggleOrderedList().run();
          }}
        >
          <PiListNumbers />
        </Button>
      </ButtonGroup>
      <ButtonGroup size="sm">
        <Button
          isIconOnly
          value="any"
          variant={editor?.isActive('link') ? 'faded' : 'solid'}
          onClick={setLink}
        >
          <PiLink />
        </Button>
        <Button
          isIconOnly
          value="any"
          variant={editor?.isActive('image') ? 'faded' : 'solid'}
          onClick={addImage}
        >
          <PiImage />
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default TiptapToolbar;
