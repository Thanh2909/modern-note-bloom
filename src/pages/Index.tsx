
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { NoteEditor } from "@/components/NoteEditor";
import { DrawingCanvas } from "@/components/DrawingCanvas";
import { OnboardingDialog } from "@/components/OnboardingDialog";
import { AuthDialog } from "@/components/AuthDialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Search, 
  Settings, 
  Moon, 
  Sun, 
  LogOut, 
  FileText, 
  Palette,
  Menu,
  Star,
  Hash
} from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  lastModified: Date;
  isFavorite: boolean;
}

const Index = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Ghi chú đầu tiên",
      content: "Chào mừng bạn đến với ứng dụng ghi chú thông minh! Đây là ghi chú mẫu để bạn bắt đầu.",
      tags: ["welcome", "demo"],
      lastModified: new Date(),
      isFavorite: true
    }
  ]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAuth, setShowAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newNoteDialog, setNewNoteDialog] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [showCanvas, setShowCanvas] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding && isAuthenticated) {
      setShowOnboarding(true);
    }
  }, [isAuthenticated]);

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const createNote = () => {
    if (!newNoteTitle.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tiêu đề ghi chú",
        variant: "destructive"
      });
      return;
    }

    const newNote: Note = {
      id: Date.now().toString(),
      title: newNoteTitle,
      content: newNoteContent,
      tags: [],
      lastModified: new Date(),
      isFavorite: false
    };

    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setNewNoteTitle("");
    setNewNoteContent("");
    setNewNoteDialog(false);
    
    toast({
      title: "Thành công",
      description: "Đã tạo ghi chú mới",
    });
  };

  const updateNote = (updatedNote: Note) => {
    setNotes(notes.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    ));
    setSelectedNote(updatedNote);
    
    toast({
      title: "Đã lưu",
      description: "Ghi chú đã được cập nhật",
    });
  };

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(notes.length > 1 ? notes.find(n => n.id !== noteId) || null : null);
    }
    
    toast({
      title: "Đã xóa",
      description: "Ghi chú đã được xóa",
    });
  };

  const toggleFavorite = (noteId: string) => {
    setNotes(notes.map(note =>
      note.id === noteId ? { ...note, isFavorite: !note.isFavorite } : note
    ));
    
    if (selectedNote?.id === noteId) {
      setSelectedNote({ ...selectedNote, isFavorite: !selectedNote.isFavorite });
    }
  };

  const handleAuth = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
      setShowAuth(false);
      toast({
        title: "Đăng nhập thành công",
        description: "Chào mừng bạn đến với ứng dụng ghi chú!",
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowAuth(true);
    setSelectedNote(null);
    toast({
      title: "Đã đăng xuất",
      description: "Hẹn gặp lại bạn!",
    });
  };

  if (!isAuthenticated) {
    return <AuthDialog open={showAuth} onAuth={handleAuth} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 transition-all duration-500">
      <SidebarProvider>
        <div className="flex w-full min-h-screen">
          <AppSidebar 
            notes={filteredNotes}
            selectedNote={selectedNote}
            onSelectNote={setSelectedNote}
            onDeleteNote={deleteNote}
            onToggleFavorite={toggleFavorite}
          />
          
          <main className="flex-1 flex flex-col">
            {/* Header */}
            <header className="h-16 border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60 flex items-center justify-between px-4 lg:px-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="lg:hidden" />
                <div className="hidden lg:flex items-center gap-2">
                  <FileText className="h-6 w-6 text-purple-600" />
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Smart Notes
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2 lg:gap-4">
                <div className="relative hidden sm:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm ghi chú..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                  />
                </div>

                <Dialog open={newNoteDialog} onOpenChange={setNewNoteDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300">
                      <Plus className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Tạo ghi chú</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Tạo ghi chú mới</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Tiêu đề</Label>
                        <Input
                          id="title"
                          value={newNoteTitle}
                          onChange={(e) => setNewNoteTitle(e.target.value)}
                          placeholder="Nhập tiêu đề ghi chú..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="content">Nội dung (tùy chọn)</Label>
                        <Textarea
                          id="content"
                          value={newNoteContent}
                          onChange={(e) => setNewNoteContent(e.target.value)}
                          placeholder="Nhập nội dung ban đầu..."
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setNewNoteDialog(false)}>
                          Hủy
                        </Button>
                        <Button onClick={createNote} className="bg-gradient-to-r from-purple-600 to-blue-600">
                          Tạo
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCanvas(!showCanvas)}
                  className="hover:bg-purple-100 dark:hover:bg-purple-900"
                >
                  <Palette className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="hover:bg-purple-100 dark:hover:bg-purple-900"
                >
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="hover:bg-red-100 dark:hover:bg-red-900 text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex">
              {/* Mobile search */}
              <div className="sm:hidden w-full p-4 border-b bg-white/50 dark:bg-gray-800/50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm ghi chú..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/50 dark:bg-gray-700/50"
                  />
                </div>
              </div>

              {/* Editor Area */}
              <div className="flex-1 flex flex-col">
                {selectedNote ? (
                  <div className="flex-1 flex flex-col lg:flex-row">
                    <div className="flex-1">
                      <NoteEditor 
                        note={selectedNote} 
                        onUpdate={updateNote}
                      />
                    </div>
                    {showCanvas && (
                      <div className="lg:w-80 border-l bg-white/50 dark:bg-gray-800/50">
                        <DrawingCanvas />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-white/30 dark:bg-gray-800/30">
                    <div className="text-center space-y-4 p-8">
                      <FileText className="h-16 w-16 mx-auto text-gray-400" />
                      <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-300">
                        Chọn một ghi chú để bắt đầu
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400">
                        Hoặc tạo ghi chú mới để ghi lại ý tưởng của bạn
                      </p>
                      <Button 
                        onClick={() => setNewNoteDialog(true)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Tạo ghi chú đầu tiên
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>

        <OnboardingDialog 
          open={showOnboarding} 
          onClose={() => {
            setShowOnboarding(false);
            localStorage.setItem('hasSeenOnboarding', 'true');
          }} 
        />
      </SidebarProvider>
    </div>
  );
};

export default Index;
