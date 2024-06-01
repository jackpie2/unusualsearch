from flask import Flask
import os
import psycopg
import pickle
from flask import request
from openai import OpenAI
from dotenv import dotenv_values
config = dotenv_values(".env")

app = Flask(__name__)

client = OpenAI(
    api_key=config['OPENAI_KEY'],
    base_url=config['OPENAI_BASEURL']
)

if os.path.exists('vectorizer.pkl'):
    with open('vectorizer.pkl', 'rb') as f:
        vectorizer = pickle.load(f)


if os.path.exists('pca.pkl'):
    with open('pca.pkl', 'rb') as f:
        pca = pickle.load(f)


@app.route("/similar")
def similar_articles():
    article_name = request.args.get('article_name')
    if not article_name:
        return {
            "message": "Missing article_name"
        }, 400

    with psycopg.connect(config["PG_URL"]) as conn:
        with conn.cursor() as cur:
            cur.execute("""select article_name, 
                        round((embedding_tfidf <=> (select embedding_tfidf from unusual_search.embeddings where article_name = %s))::numeric, 2) as distance,
                        url, extract
                        from unusual_search.embeddings
                        left join unusual_search.articles on article_name = name
                        order by distance asc
                        limit 5
                        offset 1
                        """, (article_name,))

            results = []

            for article in cur.fetchall():
                results.append({
                    "article_name": article[0],
                    "distance": article[1],
                    "url": article[2],
                    "extract": article[3]
                })

            return results


@app.route("/random")
def random_article():
    with psycopg.connect(config["PG_URL"]) as conn:
        with conn.cursor() as cur:
            cur.execute("""SELECT name, url, extract
                        FROM unusual_search.articles
                        ORDER BY random() LIMIT 1""")
            article = cur.fetchone()
            return {
                "article_name": article[0],
                "url": article[1],
                "extract": article[2]
            }


def tfidf_search(query):
    vec = vectorizer.transform([query]).toarray()
    if not vec[0].any():
        return {
            "message": "No matching articles found"
        }, 404

    vec = pca.transform(vec)[0]
    with psycopg.connect(config["PG_URL"]) as conn:
        plain_list = vec.tolist()
        results = []
        with conn.cursor() as cur:
            cur.execute("""SELECT article_name,
                        round((embedding_tfidf <=> %s::vector)::numeric, 2) AS distance,
                        url, extract
                        FROM unusual_search.embeddings 
                        left join unusual_search.articles on article_name = name
                        ORDER BY distance ASC LIMIT 10""", (plain_list,))
            embeddings = cur.fetchall()

        for embedding in embeddings:
            results.append({
                "article_name": embedding[0],
                "distance": embedding[1],
                "url": embedding[2],
                "extract": embedding[3]
            })

    return results


def openai_search(query):
    response = client.embeddings.create(
        input=query,
        model="text-embedding-3-small"
    )

    embedding = response.data[0].embedding

    with psycopg.connect(config["PG_URL"]) as conn:
        results = []
        with conn.cursor() as cur:
            cur.execute("""SELECT article_name,
                        round((embedding_openai <-> %s::vector)::numeric, 2) AS distance,
                        url, extract
                        FROM unusual_search.embeddings 
                        left join unusual_search.articles on article_name = name
                        ORDER BY distance ASC LIMIT 10""", (embedding,))
            embeddings = cur.fetchall()

            for embedding in embeddings:
                results.append({
                    "article_name": embedding[0],
                    "distance": embedding[1],
                    "url": embedding[2],
                    "extract": embedding[3]
                })

    return results


@app.route("/")
def search():
    query = request.args.get('q')
    mode = request.args.get('mode')

    if not query or len(query) < 2:
        return {
            "message": "Query too short"
        }, 400

    if mode == 'openai':
        return openai_search(query)
    else:
        return tfidf_search(query)


@app.route("/all")
def all_articles():
    with psycopg.connect(config["PG_URL"]) as conn:
        with conn.cursor() as cur:
            cur.execute("""SELECT name
                        FROM unusual_search.articles""")
            articles = cur.fetchall()
            return [article[0] for article in articles]
