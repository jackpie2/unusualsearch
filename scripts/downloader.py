import requests
import regex
from bs4 import BeautifulSoup
import threading
import psycopg
from dotenv import dotenv_values
config = dotenv_values(".env")

S = requests.Session()


def get(url):
    return S.get(url).content


def parse(content):
    return BeautifulSoup(content, 'html.parser')


def strip(text):
    text = regex.sub(r'\[.*\]', '', text)
    text = regex.sub(r'\n\n+', '\n', text)
    text = regex.sub(r'Retrieved from .*', '', text)
    text = regex.sub(r'References.*', '', text, flags=regex.DOTALL)
    return text


all_articles = parse(
    get('https://en.wikipedia.org/wiki/Wikipedia:Unusual_articles'))

tables = all_articles.find_all('table', {'class': 'wikitable'})
links = []
for table in tables:
    rows = table.find_all('tr')
    for row in rows:
        columns = row.find_all('td')

        if len(columns) > 0:
            links.extend(columns[0].find_all(
                'a', href=regex.compile(r'^/wiki/')))
articles = list(set([link['href'].split('/')[-1] for link in links]))


with psycopg.connect(config["DB_URL"]) as conn:
    def write_article(article_name):
        if len(article_name) > 100 or article_name == "Talk":
            print(
                f"Skipping article {article_name} as its name is too long or is Talk page")
            return
        url = f'https://en.wikipedia.org/wiki/{article_name}'
        soup = parse(get(url))
        content = soup.find('div', {'id': 'mw-content-text'})

        for infobox in content.find_all('table', {'class': 'infobox'}):
            infobox.decompose()

        for figure in content.find_all('figure'):
            figure.decompose()

        for table in content.find_all('table', {'class': 'metadata'}):
            table.decompose()

        for hatnote in content.find_all('div', {'class': 'hatnote'}):
            hatnote.decompose()

        text = strip(content.text)

        if len(text) < 10:
            print(f"Skipping article {article_name} as it is too short")
            return

        print(f"Writing article {article_name}")

        if "Wikipedia does not have an article with this exact name" in text:
            print(f"Article {article_name} does not exist")
            return

        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO unusual_search.articles (name, content, url, hash)
                VALUES (%s, %s, %s, MD5(%s)) ON CONFLICT (name) DO UPDATE SET 
                content = EXCLUDED.content, url = EXCLUDED.url, hash = EXCLUDED.hash
                """, (article_name, text, url, text))
            conn.commit()

    threads = []

    for article_name in articles:
        thread = threading.Thread(target=write_article, args=(article_name,))
        threads.append(thread)
        thread.start()

        if len(threads) > 15:
            for thread in threads:
                thread.join()
            threads = []

    for thread in threads:
        thread.join()
