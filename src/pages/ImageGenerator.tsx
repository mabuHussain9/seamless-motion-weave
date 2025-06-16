
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, Wand2, Download, Image as ImageIcon, Sparkles } from "lucide-react";

export default function ImageGenerator() {
  const [selectedSketch, setSelectedSketch] = useState<File | null>(null);
  const [sketchPreview, setSketchPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSketchUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedSketch(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setSketchPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (PNG, JPG, JPEG, WebP)",
          variant: "destructive",
        });
      }
    }
  };

  const handleGenerate = async () => {
    if (!selectedSketch) {
      toast({
        title: "No sketch selected",
        description: "Please upload a sketch to generate an image",
        variant: "destructive",
      });
      return;
    }

    if (!prompt.trim()) {
      toast({
        title: "No prompt provided",
        description: "Please enter a description for your image generation",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    // Simulate image generation with progress updates
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 95) {
          clearInterval(progressInterval);
          // Simulate completed generation
          setTimeout(() => {
            setProgress(100);
            setGeneratedImage("https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=512&h=512&fit=crop");
            setIsGenerating(false);
            toast({
              title: "Image generated successfully!",
              description: "Your sketch has been transformed into an AI-generated image",
            });
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'generated-image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    setSelectedSketch(null);
    setSketchPreview(null);
    setPrompt("");
    setProgress(0);
    setGeneratedImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Sketch to Image Generator
          </h1>
          <p className="text-lg text-gray-600">
            Transform your sketches into stunning AI-generated artwork
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Sketch Upload */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Sketch
                </CardTitle>
                <CardDescription>
                  Upload your sketch or drawing to transform it into an AI-generated image
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="sketch">Select Sketch</Label>
                  <Input
                    id="sketch"
                    type="file"
                    accept="image/*"
                    onChange={handleSketchUpload}
                    className="mt-1"
                  />
                </div>
                
                {sketchPreview && (
                  <div className="mt-4">
                    <Label>Preview</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <img
                        src={sketchPreview}
                        alt="Sketch preview"
                        className="max-w-full h-auto max-h-64 mx-auto rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Prompt Input */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5" />
                  Generation Prompt
                </CardTitle>
                <CardDescription>
                  Describe the style and details you want for your generated image
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="prompt">Image Description</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe the style, colors, mood, and details you want for your generated image..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="mt-1 min-h-[100px]"
                  />
                </div>

                <div className="flex gap-3 mt-4">
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !selectedSketch || !prompt.trim()}
                    className="flex-1"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isGenerating ? "Generating..." : "Generate Image"}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    disabled={isGenerating}
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            {/* Progress */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Generation Progress
                </CardTitle>
                <CardDescription>
                  AI image generation status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>

                  {isGenerating && (
                    <div className="text-sm text-gray-600">
                      <p>Processing your sketch...</p>
                      <p>This may take a few moments</p>
                    </div>
                  )}

                  {generatedImage && (
                    <Button
                      onClick={handleDownload}
                      className="w-full"
                      variant="outline"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Generated Image
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Generated Image */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Generated Image</CardTitle>
                <CardDescription>
                  Your AI-transformed artwork will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedImage ? (
                  <div className="border-2 border-gray-200 rounded-lg p-4">
                    <img
                      src={generatedImage}
                      alt="Generated artwork"
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">
                      Generated image will appear here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card className="bg-white/60 backdrop-blur-sm text-center">
            <CardContent className="pt-6">
              <Upload className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-semibold mb-1">Easy Upload</h3>
              <p className="text-sm text-gray-600">
                Simply upload your sketch or drawing
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm text-center">
            <CardContent className="pt-6">
              <Wand2 className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <h3 className="font-semibold mb-1">AI Transformation</h3>
              <p className="text-sm text-gray-600">
                Advanced AI converts sketches to detailed images
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm text-center">
            <CardContent className="pt-6">
              <Download className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-semibold mb-1">High Quality Output</h3>
              <p className="text-sm text-gray-600">
                Download your artwork in high resolution
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
