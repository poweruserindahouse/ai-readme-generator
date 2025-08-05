import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Copy, Download, AlertCircle, Github } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GeneratedContent {
  markdown: string;
}

export const ReadmeGenerator = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const validateGitHubUrl = (url: string): boolean => {
    const githubRegex = /^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+\/?$/;
    return githubRegex.test(url);
  };

  const simulateGeneration = async (): Promise<string> => {
    // Simulate AI generation process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return `# Project Name

A comprehensive project description goes here.

## Features

- Feature 1: Description of the first key feature
- Feature 2: Description of the second key feature  
- Feature 3: Description of the third key feature

## Installation

\`\`\`bash
npm install
npm start
\`\`\`

## Usage

Instructions on how to use this project...

## Contributing

Guidelines for contributing to this project...

## License

This project is licensed under the MIT License.`;
  };

  const handleGenerate = async () => {
    setError(null);
    
    if (!url.trim()) {
      setError('Please enter a GitHub repository URL.');
      return;
    }

    if (!validateGitHubUrl(url)) {
      setError('Please enter a valid GitHub repository URL (e.g., https://github.com/username/repository-name).');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate the generation process
      const markdown = await simulateGeneration();
      setGeneratedContent({ markdown });
      
      toast({
        title: "Success!",
        description: "README generated successfully.",
      });
    } catch (err) {
      setError('Failed to generate README. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (generatedContent) {
      await navigator.clipboard.writeText(generatedContent.markdown);
      toast({
        title: "Copied!",
        description: "README content copied to clipboard.",
      });
    }
  };

  const handleDownload = () => {
    if (generatedContent) {
      const blob = new Blob([generatedContent.markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'README.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Downloaded!",
        description: "README.md file downloaded successfully.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-card bg-gradient-card border-border">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Github className="h-8 w-8 text-primary" />
            <CardTitle className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AI README Generator
            </CardTitle>
          </div>
          <CardDescription className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enter a public GitHub repository URL to automatically generate a professional README.md file using AI.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="url"
                placeholder="e.g., https://github.com/username/repository-name"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 h-12 text-base border-border focus:ring-primary"
                disabled={isLoading}
              />
              <Button
                onClick={handleGenerate}
                disabled={isLoading || !url.trim()}
                variant="default"
                size="lg"
                className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-glow"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate README'
                )}
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-3 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span>Cloning repository, analyzing code, and generating your README... this may take a moment.</span>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-medium">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Output Section */}
          <div className="space-y-4">
            {generatedContent ? (
              <>
                {/* Action Buttons */}
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="sm"
                    className="border-border hover:bg-accent"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Markdown
                  </Button>
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    size="sm"
                    className="border-border hover:bg-accent"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download .md
                  </Button>
                </div>

                {/* Generated Content */}
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <Textarea
                    value={generatedContent.markdown}
                    readOnly
                    className="min-h-[400px] font-mono text-sm bg-transparent border-0 resize-none focus:ring-0 text-foreground"
                  />
                </div>
              </>
            ) : (
              !isLoading && !error && (
                <div className="text-center py-16 text-muted-foreground">
                  <Github className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Your generated README will appear here.</p>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};