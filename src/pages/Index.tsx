import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, Play, Download, Sparkles, Zap, Wand2 } from "lucide-react";
import { FREE_MODE_LIMITS, PREMIUM_MODE_LIMITS } from "@/config/constants";
import { Link } from "react-router-dom";

export default function Index() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [framesPerImage, setFramesPerImage] = useState(24);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const { toast } = useToast();

  const currentLimits = isPremium ? PREMIUM_MODE_LIMITS : FREE_MODE_LIMITS;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > currentLimits.maxImages) {
      toast({
        title: "Too many images",
        description: `Maximum ${currentLimits.maxImages} images allowed in ${isPremium ? 'premium' : 'free'} mode`,
        variant: "destructive",
      });
      return;
    }
    setSelectedFiles(files);
  };

  const handleProcess = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast({
        title: "No images selected",
        description: "Please select images to process",
        variant: "destructive",
      });
      return;
    }

    if (framesPerImage > currentLimits.maxFramesPerImage) {
      toast({
        title: "Too many frames",
        description: `Maximum ${currentLimits.maxFramesPerImage} frames per image in ${isPremium ? 'premium' : 'free'} mode`,
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    // Simulate processing with progress updates
    const totalSteps = selectedFiles.length * framesPerImage;
    let currentStep = 0;

    const progressInterval = setInterval(() => {
      currentStep += Math.random() * 3;
      const newProgress = Math.min((currentStep / totalSteps) * 100, 95);
      setProgress(newProgress);

      if (currentStep >= totalSteps) {
        clearInterval(progressInterval);
        setProgress(100);
        setIsProcessing(false);
        toast({
          title: "Processing complete!",
          description: `Generated ${selectedFiles.length * framesPerImage} interpolated frames`,
        });
      }
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Frame Interpolation Studio
          </h1>
          <p className="text-lg text-gray-600">
            Transform your images into smooth animations with AI-powered frame interpolation
          </p>
          
          {/* Navigation */}
          <div className="mt-6">
            <Link to="/image-generator">
              <Button variant="outline" className="mr-4">
                <Wand2 className="w-4 h-4 mr-2" />
                Try Sketch to Image Generator
              </Button>
            </Link>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setIsPremium(false)}
              className={`px-4 py-2 rounded-md transition-all ${
                !isPremium
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Sparkles className="w-4 h-4 inline mr-2" />
              Free Mode
            </button>
            <button
              onClick={() => setIsPremium(true)}
              className={`px-4 py-2 rounded-md transition-all ${
                isPremium
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Zap className="w-4 h-4 inline mr-2" />
              Premium Mode
            </button>
          </div>
        </div>

        {/* Limits Display */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">
              {isPremium ? "Premium" : "Free"} Mode Limits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="font-semibold text-blue-700">Max Images</div>
                <div className="text-2xl font-bold text-blue-600">
                  {currentLimits.maxImages}
                </div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="font-semibold text-green-700">Frames per Image</div>
                <div className="text-2xl font-bold text-green-600">
                  {currentLimits.maxFramesPerImage}
                </div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="font-semibold text-purple-700">Total Frames</div>
                <div className="text-2xl font-bold text-purple-600">
                  {currentLimits.maxTotalFrames.toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Interface */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Input Section */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Images
              </CardTitle>
              <CardDescription>
                Select up to {currentLimits.maxImages} images for frame interpolation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="images">Select Images</Label>
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="mt-1"
                />
                {selectedFiles && (
                  <p className="text-sm text-gray-600 mt-2">
                    Selected: {selectedFiles.length} image(s)
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="frames">Frames per Image</Label>
                <Input
                  id="frames"
                  type="number"
                  min="1"
                  max={currentLimits.maxFramesPerImage}
                  value={framesPerImage}
                  onChange={(e) => setFramesPerImage(parseInt(e.target.value))}
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Max: {currentLimits.maxFramesPerImage} frames
                </p>
              </div>

              <Button
                onClick={handleProcess}
                disabled={isProcessing || !selectedFiles}
                className="w-full"
              >
                <Play className="w-4 h-4 mr-2" />
                {isProcessing ? "Processing..." : "Generate Frames"}
              </Button>
            </CardContent>
          </Card>

          {/* Progress Section */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Processing Status
              </CardTitle>
              <CardDescription>
                AI frame interpolation progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>

              {selectedFiles && (
                <div className="space-y-2 text-sm text-gray-600">
                  <div>Images: {selectedFiles.length}</div>
                  <div>Frames per image: {framesPerImage}</div>
                  <div>Total frames: {selectedFiles.length * framesPerImage}</div>
                </div>
              )}

              <Button
                variant="outline"
                disabled={progress < 100}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Results
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Feature Highlights */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card className="bg-white/60 backdrop-blur-sm text-center">
            <CardContent className="pt-6">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-semibold mb-1">AI-Powered</h3>
              <p className="text-sm text-gray-600">
                Advanced neural networks for smooth interpolation
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm text-center">
            <CardContent className="pt-6">
              <Zap className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <h3 className="font-semibold mb-1">High Performance</h3>
              <p className="text-sm text-gray-600">
                Fast processing with optimized algorithms
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm text-center">
            <CardContent className="pt-6">
              <Download className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-semibold mb-1">Easy Export</h3>
              <p className="text-sm text-gray-600">
                Download your animations in multiple formats
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
