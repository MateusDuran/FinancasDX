import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface NewsArticle {
  title: string;
  description: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: Date;
  category: 'economia' | 'investimentos' | 'mercado' | 'cripto' | 'negocios';
  imageUrl?: string;
}

export interface FinancialTip {
  id: number;
  icon: string;
  title: string;
  description: string;
  category: 'economia' | 'investimento' | 'planejamento';
}

export interface EconomicIndicator {
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
}

@Injectable({
  providedIn: 'root'
})
export class FinancialNewsService {
  private newsCache$ = new BehaviorSubject<NewsArticle[]>([]);
  private lastFetch = 0;
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  constructor(private http: HttpClient) {}

  /**
   * Busca notícias financeiras de múltiplas fontes brasileiras
   * Usa cache para evitar requisições excessivas
   */
  getFinancialNews(): Observable<NewsArticle[]> {
    const now = Date.now();
    
    // Retorna cache se válido
    if (this.newsCache$.value.length > 0 && (now - this.lastFetch) < this.CACHE_DURATION) {
      return this.newsCache$.asObservable();
    }

    // Busca novas notícias
    return this.fetchNewsFromSources().pipe(
      map(news => {
        this.newsCache$.next(news);
        this.lastFetch = now;
        return news;
      }),
      catchError(() => {
        // Fallback: retorna notícias mockadas se API falhar
        return of(this.getMockNews());
      })
    );
  }

  /**
   * Busca notícias de fontes públicas
   * Nota: NewsAPI requer chave, então usaremos mock data como fallback
   */
  private fetchNewsFromSources(): Observable<NewsArticle[]> {
    // Para produção, você pode usar:
    // - NewsAPI (https://newsapi.org) - requer chave
    // - Hacker News Finance
    // - RSS feeds de sites financeiros brasileiros
    
    // Por enquanto, retornamos dados simulados realistas
    return of(this.getMockNews());
  }

  /**
   * Notícias mockadas com conteúdo real e atual
   */
  private getMockNews(): NewsArticle[] {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

    return [
      {
        title: 'Ibovespa opera em alta com expectativas sobre juros nos EUA',
        description: 'Investidores aguardam decisão do Fed sobre taxas de juros, enquanto mercado brasileiro reage positivamente.',
        summary: 'Principal índice da bolsa brasileira sobe 1,2% após sinais de que o Fed pode manter juros estáveis.',
        url: 'https://www.infomoney.com.br',
        source: 'InfoMoney',
        publishedAt: now,
        category: 'mercado',
        imageUrl: '📈'
      },
      {
        title: 'Dólar cai após intervenção do Banco Central',
        description: 'BC anuncia leilão de dólares e moeda americana recua frente ao real.',
        summary: 'Moeda americana fecha em R$ 4,98, queda de 0,32% após leilão de US$ 1 bilhão do BC.',
        url: 'https://www.valor.com.br',
        source: 'Valor Econômico',
        publishedAt: now,
        category: 'economia',
        imageUrl: '💵'
      },
      {
        title: 'Bitcoin ultrapassa marca de US$ 95 mil',
        description: 'Criptomoeda atinge novo recorde histórico com otimismo do mercado institucional.',
        summary: 'BTC sobe 8,5% nas últimas 24h e supera US$ 95k com entrada massiva de ETFs nos EUA.',
        url: 'https://www.coindesk.com',
        source: 'CoinDesk',
        publishedAt: yesterday,
        category: 'cripto',
        imageUrl: '₿'
      },
      {
        title: 'Tesouro Direto: títulos indexados à inflação são destaque',
        description: 'Analistas recomendam diversificação com papéis do governo diante de cenário incerto.',
        summary: 'Tesouro IPCA+ 2035 oferece taxa real de 6,2% ao ano, atraindo investidores conservadores.',
        url: 'https://www.tesourodireto.com.br',
        source: 'Tesouro Nacional',
        publishedAt: yesterday,
        category: 'investimentos',
        imageUrl: '🏦'
      },
      {
        title: 'Inflação: IPCA deve fechar 2025 próximo da meta',
        description: 'Projeções indicam controle da inflação, mas Banco Central mantém cautela.',
        summary: 'Estimativa do mercado aponta IPCA em 4,62% ao ano, dentro do intervalo de tolerância.',
        url: 'https://www.bcb.gov.br',
        source: 'Banco Central',
        publishedAt: twoDaysAgo,
        category: 'economia',
        imageUrl: '📊'
      },
      {
        title: 'Fundos imobiliários: rentabilidade supera a Selic',
        description: 'FIIs apresentam boa performance e analistas veem oportunidades no setor.',
        summary: 'Dividendos dos FIIs alcançam média de 0,82% ao mês, superando a taxa Selic atual.',
        url: 'https://www.infomoney.com.br',
        source: 'InfoMoney',
        publishedAt: twoDaysAgo,
        category: 'investimentos',
        imageUrl: '🏢'
      },
      {
        title: 'Startups brasileiras captam US$ 2 bi em investimentos',
        description: 'Apesar de cenário desafiador, ecossistema de inovação mostra resiliência.',
        summary: 'Fintechs e healthtechs lideram captações no primeiro semestre com aportes bilionários.',
        url: 'https://www.startse.com',
        source: 'StartSe',
        publishedAt: twoDaysAgo,
        category: 'negocios',
        imageUrl: '🚀'
      }
    ];
  }

  /**
   * Retorna dicas financeiras personalizadas
   */
  getFinancialTips(): Observable<FinancialTip[]> {
    return of([
      {
        id: 1,
        icon: '💰',
        title: 'Regra 50-30-20',
        description: 'Destine 50% da renda para necessidades, 30% para desejos e 20% para poupança e investimentos.',
        category: 'planejamento'
      },
      {
        id: 2,
        icon: '📈',
        title: 'Diversifique seus investimentos',
        description: 'Não coloque todos os ovos na mesma cesta. Distribua seu capital entre diferentes tipos de ativos.',
        category: 'investimento'
      },
      {
        id: 3,
        icon: '🎯',
        title: 'Crie uma reserva de emergência',
        description: 'Tenha de 6 a 12 meses de despesas guardados em investimentos líquidos para imprevistos.',
        category: 'planejamento'
      },
      {
        id: 4,
        icon: '📊',
        title: 'Acompanhe suas finanças regularmente',
        description: 'Revise seu orçamento semanalmente e analise investimentos mensalmente para manter o controle.',
        category: 'economia'
      },
      {
        id: 5,
        icon: '🔄',
        title: 'Reinvista seus rendimentos',
        description: 'O poder dos juros compostos funciona melhor quando você reinveste os ganhos.',
        category: 'investimento'
      },
      {
        id: 6,
        icon: '💳',
        title: 'Evite dívidas de cartão de crédito',
        description: 'As taxas de juros do rotativo são altíssimas. Pague sempre o valor total da fatura.',
        category: 'economia'
      }
    ]);
  }

  /**
   * Retorna indicadores econômicos simulados
   */
  getEconomicIndicators(): Observable<EconomicIndicator[]> {
    return of([
      {
        name: 'Selic',
        value: '11,75%',
        change: '+0,00%',
        trend: 'stable'
      },
      {
        name: 'IPCA',
        value: '4,62%',
        change: '-0,18%',
        trend: 'down'
      },
      {
        name: 'Dólar',
        value: 'R$ 4,98',
        change: '-0,32%',
        trend: 'down'
      },
      {
        name: 'Ibovespa',
        value: '125.840',
        change: '+1,24%',
        trend: 'up'
      }
    ]);
  }
}
