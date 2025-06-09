
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { 
  Pen, 
  Eraser, 
  Trash2, 
  Download, 
  Palette,
  Undo,
  Redo
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawingPoint {
  x: number;
  y: number;
  color: string;
  size: number;
  tool: 'pen' | 'eraser';
}

interface DrawingStroke {
  points: DrawingPoint[];
  tool: 'pen' | 'eraser';
  color: string;
  size: number;
}

export function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser'>('pen');
  const [brushSize, setBrushSize] = useState([3]);
  const [currentColor, setCurrentColor] = useState('#6366f1');
  const [strokes, setStrokes] = useState<DrawingStroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<DrawingPoint[]>([]);
  const [undoStack, setUndoStack] = useState<DrawingStroke[][]>([]);

  const colors = [
    '#6366f1', // Purple
    '#3b82f6', // Blue
    '#10b981', // Green
    '#f59e0b', // Yellow
    '#ef4444', // Red
    '#8b5cf6', // Violet
    '#06b6d4', // Cyan
    '#84cc16', // Lime
    '#f97316', // Orange
    '#ec4899', // Pink
    '#000000', // Black
    '#6b7280', // Gray
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Configure context
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.imageSmoothingEnabled = true;

    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redraw all strokes
    strokes.forEach(stroke => {
      if (stroke.points.length > 0) {
        ctx.beginPath();
        ctx.strokeStyle = stroke.tool === 'eraser' ? 'white' : stroke.color;
        ctx.lineWidth = stroke.size;
        ctx.globalCompositeOperation = stroke.tool === 'eraser' ? 'destination-out' : 'source-over';

        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        stroke.points.forEach(point => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
      }
    });

    // Draw current stroke
    if (currentStroke.length > 0) {
      ctx.beginPath();
      ctx.strokeStyle = currentTool === 'eraser' ? 'white' : currentColor;
      ctx.lineWidth = brushSize[0];
      ctx.globalCompositeOperation = currentTool === 'eraser' ? 'destination-out' : 'source-over';

      ctx.moveTo(currentStroke[0].x, currentStroke[0].y);
      currentStroke.forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    }

    ctx.globalCompositeOperation = 'source-over';
  }, [strokes, currentStroke, currentTool, currentColor, brushSize]);

  const getEventPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getEventPos(e);
    
    const point: DrawingPoint = {
      x: pos.x,
      y: pos.y,
      color: currentColor,
      size: brushSize[0],
      tool: currentTool
    };
    
    setCurrentStroke([point]);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;

    const pos = getEventPos(e);
    const point: DrawingPoint = {
      x: pos.x,
      y: pos.y,
      color: currentColor,
      size: brushSize[0],
      tool: currentTool
    };

    setCurrentStroke(prev => [...prev, point]);
  };

  const stopDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;

    setIsDrawing(false);
    
    if (currentStroke.length > 0) {
      const newStroke: DrawingStroke = {
        points: currentStroke,
        tool: currentTool,
        color: currentColor,
        size: brushSize[0]
      };
      
      setUndoStack(prev => [...prev, strokes]);
      setStrokes(prev => [...prev, newStroke]);
      setCurrentStroke([]);
    }
  };

  const clearCanvas = () => {
    setUndoStack(prev => [...prev, strokes]);
    setStrokes([]);
    setCurrentStroke([]);
  };

  const undo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      setStrokes(previousState);
      setUndoStack(prev => prev.slice(0, -1));
    }
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `drawing-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Palette className="h-5 w-5 text-purple-600" />
          Vẽ tay
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4 p-4">
        {/* Tools */}
        <div className="flex items-center gap-2">
          <Button
            variant={currentTool === 'pen' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentTool('pen')}
            className={cn(
              currentTool === 'pen' && "bg-gradient-to-r from-purple-600 to-blue-600"
            )}
          >
            <Pen className="h-4 w-4" />
          </Button>
          <Button
            variant={currentTool === 'eraser' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentTool('eraser')}
            className={cn(
              currentTool === 'eraser' && "bg-gradient-to-r from-purple-600 to-blue-600"
            )}
          >
            <Eraser className="h-4 w-4" />
          </Button>
          
          <div className="ml-auto flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={undoStack.length === 0}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearCanvas}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadCanvas}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Brush Size */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Kích thước: {brushSize[0]}px</label>
          <Slider
            value={brushSize}
            onValueChange={setBrushSize}
            max={20}
            min={1}
            step={1}
            className="w-full"
          />
        </div>

        {/* Colors */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Màu sắc:</label>
          <div className="grid grid-cols-6 gap-1">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setCurrentColor(color)}
                className={cn(
                  "w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110",
                  currentColor === color 
                    ? "border-gray-800 dark:border-white scale-110" 
                    : "border-gray-300 dark:border-gray-600"
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 min-h-0">
          <canvas
            ref={canvasRef}
            className="w-full h-full border rounded-lg bg-white cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Vẽ trực tiếp trên canvas hoặc sử dụng touch trên mobile
        </p>
      </CardContent>
    </Card>
  );
}
