import { NextRequest, NextResponse } from 'next/server';

interface FilacoliaDocument {
  content: string;
  volume: string;
  chapter: string;
  source: string;
}

// Base de conhecimento estática (carregada uma vez)
const baseConhecimento: FilacoliaDocument[] = [
  {
    content: "A oração do coração é uma prática fundamental na tradição ortodoxa. Os Padres ensinam que através da oração contínua e da vigilância espiritual, podemos combater as tentações da carne e aproximar-nos de Deus.",
    volume: "Tomo 1, Volume 1",
    chapter: "Sobre a Oração",
    source: "filocalia-tomo-1-volume-1"
  },
  {
    content: "A humildade é considerada a mãe de todas as virtudes. Os Padres da Igreja ensinam que sem humildade, nenhuma virtude pode ser verdadeiramente adquirida. É através da humildade que reconhecemos nossa dependência de Deus.",
    volume: "Tomo 1, Volume 2",
    chapter: "Sobre a Humildade",
    source: "filocalia-tomo-1-volume-2"
  },
  {
    content: "A vida ascética é o caminho da renúncia e da disciplina espiritual. Os monges e ascetas buscam purificar suas almas através do jejum, da vigília e da oração contínua, seguindo o exemplo de Cristo no deserto.",
    volume: "Tomo 2, Volume 1",
    chapter: "Vida Ascética",
    source: "filocalia-tomo-2-volume-1"
  },
  {
    content: "O amor ao próximo é essencial na vida cristã. Como ensinam os Padres, não podemos amar a Deus sem amar nosso irmão. O amor verdadeiro se manifesta através de atos de caridade e compaixão.",
    volume: "Tomo 2, Volume 2",
    chapter: "Sobre o Amor",
    source: "filocalia-tomo-2-volume-2"
  },
  {
    content: "A paciência é uma virtude fundamental que nos ajuda a suportar as provações da vida. Os Padres ensinam que através da paciência, desenvolvemos a fortaleza espiritual e nos tornamos mais semelhantes a Cristo.",
    volume: "Tomo 2, Volume 3",
    chapter: "Sobre a Paciência",
    source: "filocalia-tomo-2-volume-3"
  }
];

function dividirEmTrechos(texto: string): string[] {
  // Dividir por parágrafos
  const paragrafos = texto.split(/\n\s*\n/).filter(p => p.trim().length > 50);
  
  // Dividir parágrafos longos em sentenças
  const trechos: string[] = [];
  paragrafos.forEach(paragrafo => {
    if (paragrafo.length > 300) {
      const sentencas = paragrafo.split(/[.!?]+/).filter(s => s.trim().length > 30);
      trechos.push(...sentencas);
    } else {
      trechos.push(paragrafo);
    }
  });
  
  return trechos.filter(t => t.trim().length > 30);
}

function buscarDocumentosRelevantes(query: string, documentos: FilacoliaDocument[]): FilacoliaDocument[] {
  const queryLower = query.toLowerCase();
  const palavrasChave = queryLower.split(/\s+/).filter(p => p.length > 2);
  
  const documentosComRelevancia = documentos.map(doc => {
    let relevancia = 0;
    const conteudoLower = doc.content.toLowerCase();
    
    // Busca exata
    if (conteudoLower.includes(queryLower)) {
      relevancia += 15;
    }
    
    // Busca por palavras-chave
    palavrasChave.forEach(palavra => {
      const matches = (conteudoLower.match(new RegExp(palavra, 'g')) || []).length;
      relevancia += matches * 3;
    });
    
    return { ...doc, relevancia };
  });
  
  return documentosComRelevancia
    .filter(doc => doc.relevancia > 0)
    .sort((a, b) => b.relevancia - a.relevancia)
    .slice(0, 5);
}

function gerarRespostaSucinta(query: string, documentos: FilacoliaDocument[]): string {
  if (documentos.length === 0) {
    return "Desculpe, não encontrei informações específicas sobre isso na Filacolia. Pode reformular sua pergunta?";
  }
  
  const documentoMaisRelevante = documentos[0];
  const trechos = dividirEmTrechos(documentoMaisRelevante.content);
  const primeiroTrecho = trechos[0] || documentoMaisRelevante.content;
  
  const resposta = primeiroTrecho.substring(0, 300);
  return `${resposta}...\n\nGostaria de ver mais detalhes sobre este assunto?`;
}

function gerarRespostaCompleta(query: string, documentos: FilacoliaDocument[]): string {
  if (documentos.length === 0) {
    return "Desculpe, não encontrei informações específicas sobre isso na Filacolia. Pode reformular sua pergunta?";
  }
  
  let resposta = `Encontrei ${documentos.length} trechos relevantes na Filacolia:\n\n`;
  
  documentos.forEach((doc, index) => {
    resposta += `**${index + 1}. ${doc.chapter}** (${doc.volume})\n`;
    resposta += `${doc.content}\n\n`;
  });
  
  return resposta;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, requestType = 'sucinta' } = body;
    
    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Mensagens não fornecidas' },
        { status: 400 }
      );
    }
    
    const lastMessage = messages[messages.length - 1];
    const query = lastMessage.content;
    
    console.log('🔍 Buscando documentos relevantes...');
    const documentosRelevantes = buscarDocumentosRelevantes(query, baseConhecimento);
    
    console.log('📚 Gerando resposta...');
    let content: string;
    let type: string;
    let hasMoreDetails: boolean;
    
    if (requestType === 'sucinta') {
      content = gerarRespostaSucinta(query, documentosRelevantes);
      type = 'sucinta';
      hasMoreDetails = documentosRelevantes.length > 0;
    } else {
      content = gerarRespostaCompleta(query, documentosRelevantes);
      type = 'completa';
      hasMoreDetails = false;
    }
    
    return NextResponse.json({
      content,
      type,
      hasMoreDetails
    });
    
  } catch (error) {
    console.error('Erro na API de chat:', error);
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        content: 'Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente.',
        type: 'error'
      },
      { status: 500 }
    );
  }
} 