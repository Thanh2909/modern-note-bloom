
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Search, 
  Star, 
  Palette, 
  ChevronRight, 
  CheckCircle,
  Plus,
  Save,
  Hash
} from "lucide-react";

interface OnboardingDialogProps {
  open: boolean;
  onClose: () => void;
}

const onboardingSteps = [
  {
    title: "Chào mừng đến với Smart Notes!",
    description: "Ứng dụng ghi chú thông minh được thiết kế đặc biệt cho học sinh và sinh viên.",
    icon: FileText,
    features: [
      "Giao diện hiện đại, dễ sử dụng",
      "Hỗ trợ markdown và vẽ tay",
      "Tìm kiếm thông minh",
      "Đồng bộ đa thiết bị"
    ]
  },
  {
    title: "Tạo và quản lý ghi chú",
    description: "Tạo ghi chú mới chỉ với vài cú nhấp chuột và tổ chức chúng hiệu quả.",
    icon: Plus,
    features: [
      "Nhấn nút '+' để tạo ghi chú mới",
      "Thêm tiêu đề và nội dung",
      "Sử dụng markdown cho định dạng",
      "Tự động lưu khi bạn gõ"
    ]
  },
  {
    title: "Tổ chức với tags và yêu thích",
    description: "Sử dụng tags để phân loại và đánh dấu ghi chú quan trọng.",
    icon: Hash,
    features: [
      "Thêm tags để phân loại ghi chú",
      "Đánh dấu sao cho ghi chú quan trọng",
      "Tìm kiếm theo tags hoặc nội dung",
      "Xem ghi chú yêu thích riêng biệt"
    ]
  },
  {
    title: "Tính năng vẽ tay và hình ảnh",
    description: "Thêm hình vẽ và hình ảnh để ghi chú của bạn sinh động hơn.",
    icon: Palette,
    features: [
      "Vẽ tay trực tiếp trên canvas",
      "Kéo thả hình ảnh vào ghi chú",
      "Nhiều màu sắc và kích thước bút",
      "Xuất và chia sẻ hình vẽ"
    ]
  },
  {
    title: "Bắt đầu sử dụng ngay!",
    description: "Bạn đã sẵn sàng tạo ra những ghi chú tuyệt vời. Chúc bạn học tập hiệu quả!",
    icon: CheckCircle,
    features: [
      "Tạo ghi chú đầu tiên của bạn",
      "Khám phá các tính năng",
      "Tùy chỉnh giao diện theo ý thích",
      "Chia sẻ với bạn bè nếu cần"
    ]
  }
];

export function OnboardingDialog({ open, onClose }: OnboardingDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skip = () => {
    onClose();
  };

  const currentStepData = onboardingSteps[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-full">
              <IconComponent className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl font-bold">
            {currentStepData.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-center text-gray-600 dark:text-gray-300">
            {currentStepData.description}
          </p>
          
          <div className="space-y-2">
            {currentStepData.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center gap-2 my-6">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-purple-600'
                    : index < currentStep
                    ? 'bg-purple-300'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={skip}
              className="text-gray-500 hover:text-gray-700"
            >
              Bỏ qua
            </Button>
            
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={prevStep}
                >
                  Quay lại
                </Button>
              )}
              <Button
                onClick={nextStep}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              >
                {currentStep === onboardingSteps.length - 1 ? 'Bắt đầu' : 'Tiếp theo'}
                {currentStep < onboardingSteps.length - 1 && (
                  <ChevronRight className="h-4 w-4 ml-1" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
