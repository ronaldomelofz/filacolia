'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// // import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'sucinta' | 'completa' | 'error';
  hasMoreDetails?: boolean;
}

interface DocumentReference {
  volume: string;
  chapter: string;
  content: string;
  source: string;
}

interface BiblicalReference {
  number: string;
  reference: string;
  book: string;
  chapter: string;
  verse: string;
}

// Função para extrair e formatar referências bíblicas
function extractBiblicalReferences(text: string): BiblicalReference[] {
  const references: BiblicalReference[] = [];
  
  // Padrão para encontrar referências como "Cf. Mateus XIII, 44" ou "688: Cf. I Timóteo VI, 10"
  const patterns = [
    /(\d+):\s*Cf\.\s*([^,]+),\s*([^,]+)(?:,\s*([^,]+))?/g,
    /Cf\.\s*([^,]+),\s*([^,]+)(?:,\s*([^,]+))?/g
  ];
  
  patterns.forEach((pattern, index) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const number = index === 0 ? match[1] : '';
      const book = index === 0 ? match[2] : match[1];
      const chapter = index === 0 ? match[3] : match[2];
      const verse = index === 0 ? (match[4] || '') : (match[3] || '');
      
      references.push({
        number,
        reference: match[0],
        book: book.trim(),
        chapter: chapter.trim(),
        verse: verse.trim()
      });
    }
  });
  
  return references;
}

// Função para formatar o texto removendo referências e adicionando notas de rodapé
function formatTextWithFootnotes(text: string): { formattedText: string; footnotes: BiblicalReference[] } {
  const references = extractBiblicalReferences(text);
  
  // Remover as referências do texto principal
  let formattedText = text;
  references.forEach((ref, index) => {
    const footnoteNumber = index + 1;
    formattedText = formattedText.replace(ref.reference, `[${footnoteNumber}]`);
  });
  
  return { formattedText, footnotes: references };
}

// Componente para renderizar notas de rodapé
function FootnotesSection({ footnotes }: { footnotes: BiblicalReference[] }) {
  if (footnotes.length === 0) return null;

  return (
    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-l-4 border-blue-200 dark:border-blue-800">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
        📖 Referências Bíblicas
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {footnotes.map((ref, index) => (
          <div key={index} className="flex items-start space-x-2 text-xs">
            <span className="font-medium text-blue-600 dark:text-blue-400 min-w-[20px]">
              [{index + 1}]
            </span>
            <div className="flex-1">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {ref.book}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {' '}{ref.chapter}
                {ref.verse && `, ${ref.verse}`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente para renderizar mensagens do assistente com formatação melhorada
function AssistantMessage({ content, type, hasMoreDetails, onRequestMoreDetails }: { 
  content: string; 
  type?: 'sucinta' | 'completa' | 'error';
  hasMoreDetails?: boolean;
  onRequestMoreDetails?: () => void;
}) {
  // Função para extrair fontes das mensagens
  const extractSources = (text: string) => {
    const sourceMatch = text.match(/\*\*Fontes consultadas\*\*: (.+)/);
    if (sourceMatch) {
      return sourceMatch[1].split(', ').map(source => source.trim());
    }
    return [];
  };

  // Função para formatar o conteúdo removendo as fontes do final
  const formatContent = (text: string) => {
    return text.replace(/\*\*Fontes consultadas\*\*: .+/, '').trim();
  };

  // Função para extrair títulos dos volumes e seus conteúdos
  const extractVolumeSections = (text: string): DocumentReference[] => {
    const sections: DocumentReference[] = [];
    
    // Dividir o texto em seções baseadas nos títulos
    const parts = text.split(/\*\*(.+?)\*\*:/);
    
    for (let i = 1; i < parts.length; i += 2) {
      if (parts[i] && parts[i + 1]) {
        const title = parts[i].trim();
        const content = parts[i + 1].trim();
        
        // Extrair volume e capítulo do título
        const titleParts = title.split(' - ');
        const volume = titleParts[0] || '';
        const chapter = titleParts.slice(1).join(' - ') || '';
        
        if (content.length > 10) { // Mínimo de conteúdo
          sections.push({
            volume,
            chapter,
            content: content,
            source: 'filacolia'
          });
        }
      }
    }
    
    return sections;
  };

  const sources = extractSources(content);
  const formattedContent = formatContent(content);
  const volumeSections = extractVolumeSections(formattedContent);
  const { formattedText, footnotes } = formatTextWithFootnotes(formattedContent);

  return (
    <div className="space-y-4">
      {/* Conteúdo formatado */}
      <div className="prose prose-sm max-w-none">
        {formattedText.split('\n\n').map((paragraph, index) => {
          if (paragraph.trim().startsWith('**') && paragraph.includes('**:')) {
            // É um título de volume
            const titleMatch = paragraph.match(/\*\*(.+?)\*\*:\n(.+)/);
            if (titleMatch) {
              return (
                <div key={index} className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-l-4 border-blue-200 dark:border-blue-800">
                  <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">
                    {titleMatch[1]}
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {titleMatch[2]}
                  </p>
                </div>
              );
            }
          }
          
          // Parágrafo normal
          if (paragraph.trim()) {
            return (
              <p key={index} className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                {paragraph}
              </p>
            );
          }
          
          return null;
        })}
      </div>

      {/* Botão para mais detalhes (apenas para respostas sucintas) */}
      {type === 'sucinta' && hasMoreDetails && onRequestMoreDetails && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border-l-4 border-green-200 dark:border-green-800">
          <p className="text-sm text-green-700 dark:text-green-300 mb-3">
            💡 Encontrei mais informações sobre este tema. Gostaria de ver os detalhes completos?
          </p>
          <Button 
            onClick={onRequestMoreDetails}
            variant="outline" 
            size="sm"
            className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-900/50"
          >
            📚 Ver mais detalhes
          </Button>
        </div>
      )}

      {/* Notas de rodapé */}
      <FootnotesSection footnotes={footnotes} />

      {/* Fontes consultadas */}
      {sources.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <h5 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
            📚 Fontes consultadas:
          </h5>
          <div className="flex flex-wrap gap-1">
            {sources.map((source, index) => (
              <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                {source}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState('');

  const handleSubmit = async (e: React.FormEvent, requestType: 'sucinta' | 'completa' = 'sucinta') => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setLastQuery(input.trim());

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          requestType
        }),
      });

      if (!response.ok) {
        throw new Error('Erro na resposta da API');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
        type: data.type,
        hasMoreDetails: data.hasMoreDetails
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente.',
        type: 'error'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestMoreDetails = async () => {
    if (lastQuery && !isLoading) {
      setIsLoading(true);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [{ role: 'user', content: lastQuery }],
            requestType: 'completa'
          }),
        });

        if (!response.ok) {
          throw new Error('Erro na resposta da API');
        }

        const data = await response.json();
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.content,
          type: data.type,
          hasMoreDetails: data.hasMoreDetails
        };

        setMessages(prev => [...prev, assistantMessage]);
      } catch (error) {
        console.error('Erro ao solicitar mais detalhes:', error);
        
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Desculpe, ocorreu um erro ao buscar mais detalhes. Tente novamente.',
          type: 'error'
        };

        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 items-center justify-center p-4">
      <Card className="w-full max-w-4xl grid grid-rows-[min-content_1fr_min-content] h-[90vh] shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <CardHeader className="text-center border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            📚 Assistente da Filacolia
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Converse comigo sobre os textos dos Padres da Igreja Ortodoxa
          </p>
        </CardHeader>
        
        <CardContent className="pr-1 p-0">
          <ScrollArea className="h-full w-full pr-4 pl-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-12">
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📚</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Olá! Sou seu assistente da Filacolia</h3>
                  <p className="text-sm mb-6">Faça uma pergunta e eu responderei de forma clara e direta. Se quiser mais detalhes, posso expandir a resposta!</p>
                </div>
                <div className="text-sm space-y-3 max-w-md mx-auto">
                  <p className="font-medium text-gray-600 dark:text-gray-400">Exemplos de perguntas:</p>
                  <div className="space-y-2">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-l-3 border-blue-300">
                      <p className="text-blue-700 dark:text-blue-300">&ldquo;O que é a oração do coração?&rdquo;</p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border-l-3 border-green-300">
                      <p className="text-green-700 dark:text-green-300">&ldquo;Como os Padres ensinam sobre a humildade?&rdquo;</p>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border-l-3 border-purple-300">
                      <p className="text-purple-700 dark:text-purple-300">&ldquo;Fale sobre a vida ascética&rdquo;</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {messages.map(m => (
              <div key={m.id} className={`flex gap-4 mb-6 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'user' ? (
                  <>
                    <div className="flex-1 max-w-3xl">
                      <div className="bg-blue-500 text-white p-4 rounded-2xl rounded-br-md shadow-lg">
                        <div className="font-medium mb-1">Você</div>
                        <div className="text-sm leading-relaxed">
                          {m.content}
                        </div>
                      </div>
                    </div>
                    <Avatar className="w-10 h-10 bg-blue-500">
                      <AvatarFallback className="text-sm font-medium">EU</AvatarFallback>
                    </Avatar>
                  </>
                ) : (
                  <>
                    <Avatar className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500">
                      <AvatarFallback className="text-sm">📚</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 max-w-3xl">
                      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-bl-md shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="font-medium mb-2 text-gray-700 dark:text-gray-300">Assistente da Filacolia</div>
                        <AssistantMessage 
                          content={m.content} 
                          type={m.type}
                          hasMoreDetails={m.hasMoreDetails}
                          onRequestMoreDetails={handleRequestMoreDetails}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-4 mb-6 justify-start">
                <Avatar className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500">
                  <AvatarFallback className="text-sm">📚</AvatarFallback>
                </Avatar>
                <div className="flex-1 max-w-3xl">
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-bl-md shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="font-medium mb-2 text-gray-700 dark:text-gray-300">Assistente da Filacolia</div>
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
        </CardContent>

        <CardFooter className="border-t border-gray-200 dark:border-gray-700 p-4">
          <form className="w-full flex gap-3" onSubmit={(e) => handleSubmit(e, 'sucinta')}>
            <Input 
              placeholder="Pergunte sobre os textos da Filacolia..." 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl px-4 py-3"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl px-6 py-3 font-medium"
            >
              {isLoading ? 'Pensando...' : 'Enviar'}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
