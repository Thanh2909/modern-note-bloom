
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  Save, 
  Star, 
  Hash, 
  Image as ImageIcon, 
  X,
  Upload,
  Bold,
  Italic,
  List,
  Link2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  lastModified: Date;
  isFavorite: boolean;
}

interface NoteEditorProps {
  note: Note;
  onUpdate: (note: Note) => void;
}

export function NoteEditor({ note, onUpdate }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState<string[]>(note.tags);
  const [newTag, setNewTag] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags);
  }, [note]);

  const handleSave = () => {
    const updatedNote: Note = {
      ...note,
      title: title.trim() || "Ghi chú không tiêu đề",
      content,
      tags,
      lastModified: new Date(),
    };
    onUpdate(updatedNote);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const toggleFavorite = () => {
    const updatedNote: Note = {
      ...note,
      title,
      content,
      tags,
      isFavorite: !note.isFavorite,
      lastModified: new Date(),
    };
    onUpdate(updatedNote);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      imageFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setImages(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
      
      toast({
        title: "Thành công",
        description: `Đã thêm ${imageFiles.length} hình ảnh`,
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImages(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const insertMarkdown = (syntax: string, placeholder: string = "") => {
    const textarea = document.getElementById('note-content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let newText = "";
    switch (syntax) {
      case 'bold':
        newText = `**${selectedText || 'text in đậm'}**`;
        break;
      case 'italic':
        newText = `*${selectedText || 'text in nghiêng'}*`;
        break;
      case 'list':
        newText = `\n- ${selectedText || 'mục danh sách'}`;
        break;
      case 'link':
        newText = `[${selectedText || 'text hiển thị'}](URL)`;
        break;
    }

    const newContent = content.substring(0, start) + newText + content.substring(end);
    setContent(newContent);
    
    // Đặt con trỏ vào vị trí phù hợp
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + newText.length, start + newText.length);
    }, 0);
  };

  return (
    <div className="flex-1 flex flex-col bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
      {/* Editor Header */}
      <div className="border-b bg-white/80 dark:bg-gray-800/80 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-bold border-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Tiêu đề ghi chú..."
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFavorite}
              className={cn(
                "hover:bg-yellow-100 dark:hover:bg-yellow-900",
                note.isFavorite && "text-yellow-500"
              )}
            >
              <Star className={cn("h-4 w-4", note.isFavorite && "fill-current")} />
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Save className="h-4 w-4 mr-2" />
              Lưu
            </Button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
            >
              <Hash className="h-3 w-3 mr-1" />
              {tag}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeTag(tag)}
                className="ml-1 h-4 w-4 p-0 hover:bg-red-100 dark:hover:bg-red-900"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          <div className="flex items-center gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
              placeholder="Thêm tag..."
              className="w-24 h-6 text-xs"
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={addTag}
              className="h-6 text-xs"
            >
              Thêm
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertMarkdown('bold')}
            className="hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertMarkdown('italic')}
            className="hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertMarkdown('list')}
            className="hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => insertMarkdown('link')}
            className="hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <Link2 className="h-4 w-4" />
          </Button>
          
          <div className="ml-auto">
            <label htmlFor="image-upload">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
              >
                <span>
                  <Upload className="h-4 w-4 mr-1" />
                  Hình ảnh
                </span>
              </Button>
            </label>
            <input
              id="image-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Main Editor */}
        <div className="flex-1 p-4">
          <div
            className={cn(
              "relative h-full border-2 border-dashed rounded-lg transition-colors",
              isDragging 
                ? "border-purple-400 bg-purple-50 dark:bg-purple-900/20" 
                : "border-gray-200 dark:border-gray-600"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Textarea
              id="note-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Bắt đầu viết ghi chú của bạn... Bạn có thể sử dụng Markdown và kéo thả hình ảnh vào đây."
              className="h-full border-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-base leading-relaxed"
            />
            {isDragging && (
              <div className="absolute inset-0 flex items-center justify-center bg-purple-50/90 dark:bg-purple-900/90 rounded-lg">
                <div className="text-center">
                  <ImageIcon className="h-12 w-12 mx-auto text-purple-600 mb-2" />
                  <p className="text-purple-600 font-medium">Thả hình ảnh vào đây</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Images Panel */}
        {images.length > 0 && (
          <div className="lg:w-64 border-l bg-white/30 dark:bg-gray-800/30 p-4">
            <h3 className="font-medium mb-3 text-gray-700 dark:text-gray-300">
              Hình ảnh ({images.length})
            </h3>
            <ScrollArea className="h-64 lg:h-full">
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                {images.map((image, index) => (
                  <Card key={index} className="relative group overflow-hidden">
                    <CardContent className="p-0">
                      <img
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                        className="absolute top-1 right-1 h-6 w-6 p-0 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}
