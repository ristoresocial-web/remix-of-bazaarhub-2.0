import React from "react";
import { Globe } from "lucide-react";
import { useLanguage, LANGUAGES } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, currentLangOption } = useLanguage();

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="notranslate h-9 w-auto min-w-[120px] gap-1.5 rounded-pill border-border bg-background text-xs font-semibold">
        <Globe className="h-3.5 w-3.5 text-primary" />
        <SelectValue>
          {currentLangOption.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="notranslate max-h-72">
        {LANGUAGES.map((lang) => (
          <SelectItem key={lang.code} value={lang.code} className="text-xs">
            <span className="font-semibold">{lang.label}</span>
            {lang.code !== "en" && (
              <span className="ml-1.5 text-muted-foreground">({lang.labelEn})</span>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSwitcher;
