import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Copy, Download, AlertCircle, Github } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

// This interface now matches the backend's JSON response: {"readme": "..."}
interface GeneratedContent {
  readme: string;
}

export const ReadmeGenerator = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const validateGitHubUrl = (url: string): boolean => {
    // A simple regex to validate the basic structure of a GitHub repo URL.
    const githubRegex = /^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+$/;
    return githubRegex.test(url);
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
    setGeneratedContent(null); // Clear previous results
    
    try {
      // The API call now points to the full backend URL.
      // The payload key is 'repo_url' to match the Pydantic model in the backend.
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/generate-readme`, {
        repo_url: url,
      });

      // Set the state with the 'readme' field from the response.
      setGeneratedContent({ readme: response.data.readme });
      
      toast({
        title: "Success!",
        description: "README generated successfully.",
      });
    } catch (err) {
      // Improved error handling to display specific messages from the backend.
      if (axios.isAxiosError(err) && err.response) {
        // err.response.data.detail is the error message from FastAPI's HTTPException
        setError(err.response.data.detail || 'An unknown error occurred during generation.');
      } else {
        // This handles network errors or if the backend server isn't running.
        setError('Failed to connect to the server. Please ensure it is running and accessible.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (generatedContent) {
      // Use the 'readme' field for the clipboard content.
      await navigator.clipboard.writeText(generatedContent.readme);
      toast({
        title: "Copied!",
        description: "README content copied to clipboard.",
      });
    }
  };

  const handleDownload = () => {
    if (generatedContent) {
      // Use the 'readme' field for the downloadable file.
      const blob = new Blob([generatedContent.readme], { type: 'text/markdown' });
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = 'README.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
      
      toast({
        title: "Downloaded!",
        description: "README.md file downloaded successfully.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4"
    onKeyPress={(e) => {
      if (e.key === 'Enter') {
        handleGenerate();
      }}
    }
    >
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
          {isLoading && !error && (
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
              <AlertTitle>Error</AlertTitle>
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

                {/* ===== FINAL VERSION WITH ALL OVERRIDES ===== */}
                <div 
                  className="prose dark:prose-invert max-w-none rounded-lg border border-border bg-muted/30 p-6
                  
                  /*
                    This is the most forceful override possible.
                    It targets every common markdown element to ensure all text is white.
                  */
                  dark:!text-foreground
                  dark:[&_p]:!text-foreground
                  dark:[&_h1]:!text-foreground
                  dark:[&_h2]:!text-foreground
                  dark:[&_h3]:!text-foreground
                  dark:[&_h4]:!text-foreground
                  dark:[&_h5]:!text-foreground
                  dark:[&_h6]:!text-foreground
                  dark:[&_li]:!text-foreground
                  dark:[&_ul]:!text-foreground
                  dark:[&_ol]:!text-foreground
                  dark:[&_strong]:!text-foreground
                  dark:[&_em]:!text-foreground
                  dark:[&_blockquote]:!text-foreground
                  dark:[&_code]:!text-foreground
                  dark:[&_a]:!text-foreground
                  dark:[&_thead]:!text-foreground
                  dark:[&_tbody]:!text-foreground
                  dark:[&_tr]:!text-foreground
                  dark:[&_th]:!text-foreground
                  dark:[&_td]:!text-foreground
                  "
                >
                  <ReactMarkdown>
                    {generatedContent.readme}
                  </ReactMarkdown>
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