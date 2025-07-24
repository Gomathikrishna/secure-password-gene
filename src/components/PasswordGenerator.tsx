import { useState, useCallback } from 'react';
import { Shield, Copy, Check, RotateCcw } from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useKV } from '@github/spark/hooks';
import { 
  generateSecurePassword, 
  calculatePasswordStrength, 
  type PasswordCriteria 
} from '@/lib/password-generator';

const DEFAULT_CRITERIA: PasswordCriteria = {
  length: 16,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true
};

export default function PasswordGenerator() {
  const [criteria, setCriteria] = useKV<PasswordCriteria>('password-criteria', DEFAULT_CRITERIA);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const strength = password ? calculatePasswordStrength(password, criteria) : null;

  const updateCriteria = useCallback((updates: Partial<PasswordCriteria>) => {
    setCriteria(current => ({ ...current, ...updates }));
  }, [setCriteria]);

  const generatePassword = useCallback(() => {
    if (!criteria.includeUppercase && !criteria.includeLowercase && 
        !criteria.includeNumbers && !criteria.includeSymbols) {
      toast.error('Please select at least one character type');
      return;
    }

    setIsGenerating(true);
    
    // Small delay for animation effect
    setTimeout(() => {
      try {
        const newPassword = generateSecurePassword(criteria);
        setPassword(newPassword);
        setCopied(false);
        toast.success('Password generated successfully');
      } catch (error) {
        toast.error('Failed to generate password');
      } finally {
        setIsGenerating(false);
      }
    }, 200);
  }, [criteria]);

  const copyToClipboard = useCallback(async () => {
    if (!password) return;

    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      toast.success('Password copied to clipboard');
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy password');
    }
  }, [password]);

  const hasNoCriteria = !criteria.includeUppercase && !criteria.includeLowercase && 
                        !criteria.includeNumbers && !criteria.includeSymbols;

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Shield size={32} weight="bold" />
            <h1 className="text-3xl font-bold">Password Generator</h1>
          </div>
          <p className="text-muted-foreground">
            Generate secure passwords with customizable criteria
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Password Criteria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Length Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Length</Label>
                <Badge variant="secondary">{criteria.length} characters</Badge>
              </div>
              <Slider
                value={[criteria.length]}
                onValueChange={([value]) => updateCriteria({ length: value })}
                min={4}
                max={128}
                step={1}
                className="w-full"
              />
              {criteria.length < 8 && (
                <p className="text-sm text-orange-600">
                  ⚠️ Passwords under 8 characters are not recommended
                </p>
              )}
            </div>

            {/* Character Type Options */}
            <div className="space-y-3">
              <Label>Include Characters</Label>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="uppercase"
                    checked={criteria.includeUppercase}
                    onCheckedChange={(checked) => 
                      updateCriteria({ includeUppercase: !!checked })
                    }
                  />
                  <Label htmlFor="uppercase" className="text-sm">
                    Uppercase (A-Z)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="lowercase"
                    checked={criteria.includeLowercase}
                    onCheckedChange={(checked) => 
                      updateCriteria({ includeLowercase: !!checked })
                    }
                  />
                  <Label htmlFor="lowercase" className="text-sm">
                    Lowercase (a-z)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="numbers"
                    checked={criteria.includeNumbers}
                    onCheckedChange={(checked) => 
                      updateCriteria({ includeNumbers: !!checked })
                    }
                  />
                  <Label htmlFor="numbers" className="text-sm">
                    Numbers (0-9)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="symbols"
                    checked={criteria.includeSymbols}
                    onCheckedChange={(checked) => 
                      updateCriteria({ includeSymbols: !!checked })
                    }
                  />
                  <Label htmlFor="symbols" className="text-sm">
                    Symbols (!@#$%^&*)
                  </Label>
                </div>
              </div>

              {hasNoCriteria && (
                <p className="text-sm text-destructive">
                  Please select at least one character type
                </p>
              )}
            </div>

            {/* Generate Button */}
            <Button
              onClick={generatePassword}
              disabled={hasNoCriteria || isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <RotateCcw className="animate-spin mr-2" size={16} />
              ) : (
                <Shield className="mr-2" size={16} />
              )}
              {isGenerating ? 'Generating...' : 'Generate Password'}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Password */}
        {password && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Generated Password</CardTitle>
                {strength && (
                  <Badge variant="outline" className={strength.color}>
                    {strength.label}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Password Display */}
              <div className="relative">
                <Input
                  value={password}
                  readOnly
                  className="font-mono text-sm pr-12"
                  onClick={copyToClipboard}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <Check size={16} className="text-green-600" />
                  ) : (
                    <Copy size={16} />
                  )}
                </Button>
              </div>

              {/* Strength Indicator */}
              {strength && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Strength</span>
                    <span className={strength.color}>{strength.label}</span>
                  </div>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full ${
                          i < strength.score
                            ? strength.score <= 1
                              ? 'bg-destructive'
                              : strength.score <= 2
                              ? 'bg-orange-500'
                              : strength.score <= 3
                              ? 'bg-blue-500'
                              : 'bg-green-500'
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    Estimated crack time: {strength.crackTime}
                  </p>
                </div>
              )}

              <Button
                variant="outline"
                onClick={copyToClipboard}
                className="w-full"
                disabled={copied}
              >
                {copied ? (
                  <>
                    <Check className="mr-2" size={16} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2" size={16} />
                    Copy to Clipboard
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}