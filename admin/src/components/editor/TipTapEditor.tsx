import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import {
  Bold, Italic, UnderlineIcon, Strikethrough, Highlighter,
  Heading1, Heading2, Heading3, List, ListOrdered, Quote,
  AlignLeft, AlignCenter, AlignRight, Image as ImageIcon, Link2,
  Undo, Redo, Code, Pilcrow, Loader2,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useEffect, useRef, useState } from "react";
import { adminUploadImage } from "@/api/admin-api";

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

function ToolbarButton({
  onClick,
  active,
  title,
  disabled,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "p-1.5 rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:pointer-events-none disabled:opacity-40",
        active && "bg-gray-100 text-gray-900"
      )}
    >
      {children}
    </button>
  );
}

export function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const imageFileRef = useRef<HTMLInputElement>(null);
  const [imageUploading, setImageUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Underline,
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Start writing your blog post..." }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: "tiptap prose prose-sm max-w-none min-h-[320px] focus:outline-none" },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content]);

  const addImageFromUrl = () => {
    const url = prompt("Image URL (https://…):");
    if (url?.trim() && editor) editor.chain().focus().setImage({ src: url.trim() }).run();
  };

  const onPickImageFile = () => {
    imageFileRef.current?.click();
  };

  const onImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !editor) return;
    setImageUploading(true);
    try {
      const { url } = await adminUploadImage(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setImageUploading(false);
    }
  };

  if (!editor) return null;

  const groups = [
    {
      label: "History",
      items: [
        { icon: <Undo className="w-4 h-4" />, action: () => editor.chain().focus().undo().run(), title: "Undo" },
        { icon: <Redo className="w-4 h-4" />, action: () => editor.chain().focus().redo().run(), title: "Redo" },
      ],
    },
    {
      label: "Headings",
      items: [
        { icon: <Heading1 className="w-4 h-4" />, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), title: "Heading 1", active: editor.isActive("heading", { level: 1 }) },
        { icon: <Heading2 className="w-4 h-4" />, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), title: "Heading 2", active: editor.isActive("heading", { level: 2 }) },
        { icon: <Heading3 className="w-4 h-4" />, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), title: "Heading 3", active: editor.isActive("heading", { level: 3 }) },
        { icon: <Pilcrow className="w-4 h-4" />, action: () => editor.chain().focus().setParagraph().run(), title: "Paragraph", active: editor.isActive("paragraph") },
      ],
    },
    {
      label: "Format",
      items: [
        { icon: <Bold className="w-4 h-4" />, action: () => editor.chain().focus().toggleBold().run(), title: "Bold", active: editor.isActive("bold") },
        { icon: <Italic className="w-4 h-4" />, action: () => editor.chain().focus().toggleItalic().run(), title: "Italic", active: editor.isActive("italic") },
        { icon: <UnderlineIcon className="w-4 h-4" />, action: () => editor.chain().focus().toggleUnderline().run(), title: "Underline", active: editor.isActive("underline") },
        { icon: <Strikethrough className="w-4 h-4" />, action: () => editor.chain().focus().toggleStrike().run(), title: "Strikethrough", active: editor.isActive("strike") },
        { icon: <Highlighter className="w-4 h-4" />, action: () => editor.chain().focus().toggleHighlight().run(), title: "Highlight", active: editor.isActive("highlight") },
        { icon: <Code className="w-4 h-4" />, action: () => editor.chain().focus().toggleCode().run(), title: "Code", active: editor.isActive("code") },
      ],
    },
    {
      label: "Lists",
      items: [
        { icon: <List className="w-4 h-4" />, action: () => editor.chain().focus().toggleBulletList().run(), title: "Bullet List", active: editor.isActive("bulletList") },
        { icon: <ListOrdered className="w-4 h-4" />, action: () => editor.chain().focus().toggleOrderedList().run(), title: "Numbered List", active: editor.isActive("orderedList") },
        { icon: <Quote className="w-4 h-4" />, action: () => editor.chain().focus().toggleBlockquote().run(), title: "Blockquote", active: editor.isActive("blockquote") },
      ],
    },
    {
      label: "Align",
      items: [
        { icon: <AlignLeft className="w-4 h-4" />, action: () => editor.chain().focus().setTextAlign("left").run(), title: "Align Left", active: editor.isActive({ textAlign: "left" }) },
        { icon: <AlignCenter className="w-4 h-4" />, action: () => editor.chain().focus().setTextAlign("center").run(), title: "Align Center", active: editor.isActive({ textAlign: "center" }) },
        { icon: <AlignRight className="w-4 h-4" />, action: () => editor.chain().focus().setTextAlign("right").run(), title: "Align Right", active: editor.isActive({ textAlign: "right" }) },
      ],
    },
    {
      label: "Media",
      items: [
        {
          icon: imageUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />,
          action: onPickImageFile,
          title: "Upload image (JPEG/PNG)",
          disabled: imageUploading,
        },
        {
          icon: <Link2 className="w-4 h-4" />,
          action: addImageFromUrl,
          title: "Image from URL",
          disabled: imageUploading,
        },
      ],
    },
  ];

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <input
        ref={imageFileRef}
        type="file"
        accept="image/jpeg,image/png,.jpg,.jpeg,.png"
        className="hidden"
        onChange={onImageFileChange}
        aria-hidden
      />
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-100 bg-gray-50">
        {groups.map((group, gi) => (
          <div key={gi} className="flex items-center gap-0.5">
            {gi > 0 && <div className="w-px h-5 bg-gray-200 mx-1" />}
            {group.items.map((item, ii) => (
              <ToolbarButton
                key={ii}
                onClick={item.action}
                active={"active" in item ? item.active : undefined}
                disabled={"disabled" in item ? item.disabled : undefined}
                title={item.title}
              >
                {item.icon}
              </ToolbarButton>
            ))}
          </div>
        ))}
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="prose-headings:font-bold" />
    </div>
  );
}
