
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  FileText, 
  Star, 
  Trash2, 
  Clock,
  Hash
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

interface AppSidebarProps {
  notes: Note[];
  selectedNote: Note | null;
  onSelectNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
  onToggleFavorite: (noteId: string) => void;
}

export function AppSidebar({ 
  notes, 
  selectedNote, 
  onSelectNote, 
  onDeleteNote, 
  onToggleFavorite 
}: AppSidebarProps) {
  const { collapsed } = useSidebar();
  const [hoveredNote, setHoveredNote] = useState<string | null>(null);

  const favoriteNotes = notes.filter(note => note.isFavorite);
  const recentNotes = notes.slice(0, 5);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Hôm nay";
    if (days === 1) return "Hôm qua";
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const truncateContent = (content: string, maxLength: number = 50) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <Sidebar className={cn(
      "border-r bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg transition-all duration-300",
      collapsed ? "w-16" : "w-80"
    )}>
      <SidebarContent className="p-4">
        {!collapsed && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Ghi chú của tôi
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {notes.length} ghi chú
            </p>
          </div>
        )}

        <ScrollArea className="flex-1">
          {/* Favorite Notes */}
          {favoriteNotes.length > 0 && (
            <SidebarGroup className="mb-6">
              <SidebarGroupLabel className="text-yellow-600 dark:text-yellow-400 font-medium">
                <Star className="h-4 w-4 mr-2" />
                {!collapsed && "Yêu thích"}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {favoriteNotes.map((note) => (
                    <SidebarMenuItem key={`fav-${note.id}`}>
                      <SidebarMenuButton
                        onClick={() => onSelectNote(note)}
                        onMouseEnter={() => setHoveredNote(note.id)}
                        onMouseLeave={() => setHoveredNote(null)}
                        className={cn(
                          "w-full justify-start p-3 h-auto hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900/50 dark:hover:to-blue-900/50 transition-all duration-200",
                          selectedNote?.id === note.id && "bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-800/50 dark:to-blue-800/50 border-l-4 border-purple-500"
                        )}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <FileText className="h-4 w-4 mt-1 text-purple-600 flex-shrink-0" />
                          {!collapsed && (
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm truncate">
                                {note.title}
                              </h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                                {truncateContent(note.content)}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-400">
                                  {formatDate(note.lastModified)}
                                </span>
                                {hoveredNote === note.id && (
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleFavorite(note.id);
                                      }}
                                      className="h-6 w-6 p-0 hover:bg-yellow-100 dark:hover:bg-yellow-900"
                                    >
                                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteNote(note.id);
                                      }}
                                      className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900 text-red-500"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* All Notes */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-600 dark:text-gray-300 font-medium">
              <Clock className="h-4 w-4 mr-2" />
              {!collapsed && "Gần đây"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {notes.map((note) => (
                  <SidebarMenuItem key={note.id}>
                    <SidebarMenuButton
                      onClick={() => onSelectNote(note)}
                      onMouseEnter={() => setHoveredNote(note.id)}
                      onMouseLeave={() => setHoveredNote(null)}
                      className={cn(
                        "w-full justify-start p-3 h-auto hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900/50 dark:hover:to-blue-900/50 transition-all duration-200",
                        selectedNote?.id === note.id && "bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-800/50 dark:to-blue-800/50 border-l-4 border-purple-500"
                      )}
                    >
                      <div className="flex items-start gap-3 w-full">
                        <FileText className="h-4 w-4 mt-1 text-gray-500 flex-shrink-0" />
                        {!collapsed && (
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <h3 className="font-medium text-sm truncate flex-1">
                                {note.title}
                              </h3>
                              {note.isFavorite && (
                                <Star className="h-3 w-3 text-yellow-500 fill-current ml-2 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                              {truncateContent(note.content)}
                            </p>
                            {note.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {note.tags.slice(0, 2).map((tag) => (
                                  <Badge 
                                    key={tag} 
                                    variant="secondary" 
                                    className="text-xs px-2 py-0 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                                  >
                                    <Hash className="h-2 w-2 mr-1" />
                                    {tag}
                                  </Badge>
                                ))}
                                {note.tags.length > 2 && (
                                  <Badge variant="secondary" className="text-xs px-2 py-0">
                                    +{note.tags.length - 2}
                                  </Badge>
                                )}
                              </div>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-400">
                                {formatDate(note.lastModified)}
                              </span>
                              {hoveredNote === note.id && (
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onToggleFavorite(note.id);
                                    }}
                                    className={cn(
                                      "h-6 w-6 p-0 hover:bg-yellow-100 dark:hover:bg-yellow-900",
                                      note.isFavorite && "text-yellow-500"
                                    )}
                                  >
                                    <Star className={cn(
                                      "h-3 w-3",
                                      note.isFavorite && "fill-current"
                                    )} />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDeleteNote(note.id);
                                    }}
                                    className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900 text-red-500"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}
