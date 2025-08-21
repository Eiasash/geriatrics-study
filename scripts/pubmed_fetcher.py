#!/usr/bin/env python3
"""
PubMed Geriatrics Paper Fetcher
Automatically fetches latest geriatrics research and generates Anki cards
"""

import requests
import json
from datetime import datetime, timedelta
from typing import List, Dict
import xml.etree.ElementTree as ET
import time
import hashlib

class PubMedFetcher:
    def __init__(self):
        self.base_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils"
        self.email = "eiasash@gmail.com"  # Update with your email
        
        # Geriatrics-specific search terms
        self.search_queries = {
            'delirium': '(delirium[Title/Abstract] AND elderly[Title/Abstract]) AND ("last 30 days"[PDat])',
            'frailty': '(frailty[Title/Abstract] OR "frailty syndrome"[MeSH]) AND ("last 30 days"[PDat])',
            'falls': '(falls[Title/Abstract] AND prevention[Title/Abstract] AND elderly) AND ("last 30 days"[PDat])',
            'dementia': '(dementia[Title/Abstract] OR alzheimer[Title/Abstract]) AND treatment AND ("last 30 days"[PDat])',
            'deprescribing': '(deprescribing[Title/Abstract] OR polypharmacy[Title/Abstract]) AND ("last 30 days"[PDat])',
            'sarcopenia': '(sarcopenia[Title/Abstract] AND (nutrition OR exercise)) AND ("last 30 days"[PDat])',
            'end_of_life': '("end of life care"[Title/Abstract] OR "palliative care"[Title/Abstract]) AND elderly AND ("last 30 days"[PDat])',
            'incontinence': '(incontinence[Title/Abstract] AND elderly[Title/Abstract]) AND ("last 30 days"[PDat])'
        }
        
        self.hebrew_mapping = {
            'delirium': 'דליריום',
            'frailty': 'שבריריות',
            'falls': 'נפילות',
            'dementia': 'דמנציה',
            'deprescribing': 'דה-פרסקייבינג',
            'sarcopenia': 'סרקופניה',
            'end_of_life': 'טיפול סוף-חיים',
            'incontinence': 'אי שליטה בסוגרים'
        }
    
    def search_pubmed(self, query: str, max_results: int = 5) -> List[str]:
        """Search PubMed and return PMIDs"""
        search_url = f"{self.base_url}/esearch.fcgi"
        params = {
            'db': 'pubmed',
            'term': query,
            'retmax': max_results,
            'retmode': 'json',
            'sort': 'relevance',
            'email': self.email
        }
        
        try:
            response = requests.get(search_url, params=params)
            data = response.json()
            return data.get('esearchresult', {}).get('idlist', [])
        except Exception as e:
            print(f"Search error: {e}")
            return []
    
    def fetch_article_details(self, pmid: str) -> Dict:
        """Fetch detailed article information"""
        fetch_url = f"{self.base_url}/efetch.fcgi"
        params = {
            'db': 'pubmed',
            'id': pmid,
            'rettype': 'abstract',
            'retmode': 'xml',
            'email': self.email
        }
        
        try:
            response = requests.get(fetch_url, params=params)
            root = ET.fromstring(response.content)
            
            article = root.find('.//PubmedArticle')
            if not article:
                return {}
            
            # Extract key information
            title = article.findtext('.//ArticleTitle', '')
            abstract = article.findtext('.//AbstractText', '')
            
            # Get authors
            authors = []
            for author in article.findall('.//Author'):
                last_name = author.findtext('LastName', '')
                first_name = author.findtext('ForeName', '')
                if last_name:
                    authors.append(f"{last_name} {first_name}".strip())
            
            # Get publication info
            journal = article.findtext('.//Journal/Title', '')
            year = article.findtext('.//PubDate/Year', '')
            
            # Extract key findings (simple NLP)
            key_findings = self.extract_key_findings(abstract)
            
            return {
                'pmid': pmid,
                'title': title,
                'abstract': abstract,
                'authors': ', '.join(authors[:3]) + (' et al.' if len(authors) > 3 else ''),
                'journal': journal,
                'year': year,
                'key_findings': key_findings,
                'url': f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/"
            }
        except Exception as e:
            print(f"Fetch error for PMID {pmid}: {e}")
            return {}
    
    def extract_key_findings(self, abstract: str) -> List[str]:
        """Extract key findings from abstract using simple patterns"""
        findings = []
        
        # Look for conclusion/results patterns
        patterns = [
            'concluded that', 'found that', 'demonstrated that',
            'showed that', 'revealed that', 'suggest that',
            'indicates that', 'associated with', 'significantly'
        ]
        
        sentences = abstract.split('. ')
        for sentence in sentences:
            lower_sent = sentence.lower()
            if any(pattern in lower_sent for pattern in patterns):
                # Clean and add if not too long
                clean_sent = sentence.strip()
                if 20 < len(clean_sent) < 200:
                    findings.append(clean_sent)
        
        return findings[:3]  # Return top 3 findings
    
    def generate_anki_cards(self, articles: List[Dict], topic: str) -> List[Dict]:
        """Generate Anki cards from articles"""
        cards = []
        hebrew_topic = self.hebrew_mapping.get(topic, topic)
        
        for article in articles:
            if not article.get('title'):
                continue
            
            # Card 1: Title -> Key Finding
            if article['key_findings']:
                cards.append({
                    'id': hashlib.md5(f"{article['pmid']}_1".encode()).hexdigest()[:8],
                    'front': f"[{hebrew_topic}] Study: {article['title']}\n\nWhat was the main finding?",
                    'back': f"{article['key_findings'][0]}\n\n📖 {article['authors']} ({article['year']})\n🔗 {article['url']}",
                    'tags': [topic, 'research', 'recent', hebrew_topic]
                })
            
            # Card 2: Clinical Application
            if len(article['key_findings']) > 1:
                cards.append({
                    'id': hashlib.md5(f"{article['pmid']}_2".encode()).hexdigest()[:8],
                    'front': f"[{hebrew_topic}] Based on {article['authors'].split(',')[0]} et al. ({article['year']}), what clinical practice change might be considered?",
                    'back': f"Finding: {article['key_findings'][1]}\n\nClinical relevance: Consider this evidence when treating elderly patients with {topic}-related conditions.\n\n🔗 Full study: {article['url']}",
                    'tags': [topic, 'clinical', 'evidence-based', hebrew_topic]
                })
        
        return cards
    
    def fetch_all_topics(self, days_back: int = 30) -> Dict:
        """Fetch papers for all geriatrics topics"""
        all_articles = {}
        all_cards = []
        
        print(f"🔍 Fetching geriatrics papers from last {days_back} days...")
        
        for topic, query in self.search_queries.items():
            print(f"\n📚 Searching {topic}...")
            pmids = self.search_pubmed(query, max_results=3)
            
            articles = []
            for pmid in pmids:
                article = self.fetch_article_details(pmid)
                if article:
                    articles.append(article)
                time.sleep(0.5)  # Be nice to PubMed API
            
            all_articles[topic] = articles
            cards = self.generate_anki_cards(articles, topic)
            all_cards.extend(cards)
            
            print(f"  ✓ Found {len(articles)} articles, generated {len(cards)} cards")
        
        return {
            'articles': all_articles,
            'cards': all_cards,
            'metadata': {
                'fetched_at': datetime.now().isoformat(),
                'total_articles': sum(len(v) for v in all_articles.values()),
                'total_cards': len(all_cards)
            }
        }
    
    def save_results(self, data: Dict, output_dir: str = 'data'):
        """Save fetched data and cards"""
        # Save articles
        with open(f'{output_dir}/pubmed_articles.json', 'w', encoding='utf-8') as f:
            json.dump(data['articles'], f, ensure_ascii=False, indent=2)
        
        # Save Anki cards
        with open(f'{output_dir}/pubmed_anki_cards.json', 'w', encoding='utf-8') as f:
            json.dump(data['cards'], f, ensure_ascii=False, indent=2)
        
        # Generate weekly digest
        digest = self.generate_digest(data['articles'])
        with open(f'{output_dir}/weekly_digest.md', 'w', encoding='utf-8') as f:
            f.write(digest)
        
        print(f"\n✅ Saved {data['metadata']['total_articles']} articles and {data['metadata']['total_cards']} cards")
    
    def generate_digest(self, articles: Dict) -> str:
        """Generate markdown digest of recent papers"""
        digest = f"# 📊 Geriatrics Research Digest\n\n"
        digest += f"*Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}*\n\n"
        
        for topic, topic_articles in articles.items():
            if not topic_articles:
                continue
            
            hebrew_name = self.hebrew_mapping.get(topic, topic)
            digest += f"\n## {topic.replace('_', ' ').title()} ({hebrew_name})\n\n"
            
            for article in topic_articles:
                digest += f"### 📄 {article['title']}\n"
                digest += f"- **Authors**: {article['authors']}\n"
                digest += f"- **Journal**: {article['journal']} ({article['year']})\n"
                digest += f"- **Link**: [{article['pmid']}]({article['url']})\n"
                
                if article['key_findings']:
                    digest += f"- **Key Finding**: {article['key_findings'][0][:150]}...\n"
                
                digest += "\n"
        
        return digest


def main():
    """Run the PubMed fetcher"""
    fetcher = PubMedFetcher()
    
    # Fetch recent papers
    data = fetcher.fetch_all_topics(days_back=30)
    
    # Save results
    fetcher.save_results(data)
    
    # Print summary
    print("\n" + "="*50)
    print("📈 SUMMARY")
    print("="*50)
    for topic, articles in data['articles'].items():
        if articles:
            print(f"{topic}: {len(articles)} new papers")
    print(f"\nTotal Anki cards generated: {len(data['cards'])}")
    print("\nFiles saved to ./data/")


if __name__ == "__main__":
    main()