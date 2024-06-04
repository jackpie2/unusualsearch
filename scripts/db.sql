--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Ubuntu 15.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 16.2

-- Started on 2024-06-04 20:18:43

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 827 (class 1259 OID 6218474)
-- Name: articles; Type: TABLE; Schema: unusual_search; Owner: postgres
--

CREATE TABLE unusual_search.articles (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    url text NOT NULL,
    content text NOT NULL,
    hash text NOT NULL,
    "extract" text
);


ALTER TABLE unusual_search.articles OWNER TO postgres;

--
-- TOC entry 828 (class 1259 OID 6218477)
-- Name: article_id_seq; Type: SEQUENCE; Schema: unusual_search; Owner: postgres
--

ALTER TABLE unusual_search.articles ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME unusual_search.article_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 830 (class 1259 OID 6224081)
-- Name: embeddings; Type: TABLE; Schema: unusual_search; Owner: postgres
--

CREATE TABLE unusual_search.embeddings (
    id integer NOT NULL,
    embedding_tfidf extensions.vector(2609),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    article_name text NOT NULL,
    hash text,
    embedding_openai extensions.vector(1536)
);


ALTER TABLE unusual_search.embeddings OWNER TO postgres;

--
-- TOC entry 829 (class 1259 OID 6224080)
-- Name: embeddings_id_seq; Type: SEQUENCE; Schema: unusual_search; Owner: postgres
--

CREATE SEQUENCE unusual_search.embeddings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE unusual_search.embeddings_id_seq OWNER TO postgres;

--
-- TOC entry 4968 (class 0 OID 0)
-- Dependencies: 829
-- Name: embeddings_id_seq; Type: SEQUENCE OWNED BY; Schema: unusual_search; Owner: postgres
--

ALTER SEQUENCE unusual_search.embeddings_id_seq OWNED BY unusual_search.embeddings.id;


--
-- TOC entry 4777 (class 2604 OID 6224084)
-- Name: embeddings id; Type: DEFAULT; Schema: unusual_search; Owner: postgres
--

ALTER TABLE ONLY unusual_search.embeddings ALTER COLUMN id SET DEFAULT nextval('unusual_search.embeddings_id_seq'::regclass);


--
-- TOC entry 4780 (class 2606 OID 6218487)
-- Name: articles article_link_key; Type: CONSTRAINT; Schema: unusual_search; Owner: postgres
--

ALTER TABLE ONLY unusual_search.articles
    ADD CONSTRAINT article_link_key UNIQUE (url);


--
-- TOC entry 4782 (class 2606 OID 6218483)
-- Name: articles article_name_key; Type: CONSTRAINT; Schema: unusual_search; Owner: postgres
--

ALTER TABLE ONLY unusual_search.articles
    ADD CONSTRAINT article_name_key UNIQUE (name);


--
-- TOC entry 4784 (class 2606 OID 6218489)
-- Name: articles article_pkey; Type: CONSTRAINT; Schema: unusual_search; Owner: postgres
--

ALTER TABLE ONLY unusual_search.articles
    ADD CONSTRAINT article_pkey PRIMARY KEY (id);


--
-- TOC entry 4786 (class 2606 OID 6224461)
-- Name: embeddings embeddings_article_name_key; Type: CONSTRAINT; Schema: unusual_search; Owner: postgres
--

ALTER TABLE ONLY unusual_search.embeddings
    ADD CONSTRAINT embeddings_article_name_key UNIQUE (article_name);


--
-- TOC entry 4788 (class 2606 OID 6224088)
-- Name: embeddings embeddings_pkey; Type: CONSTRAINT; Schema: unusual_search; Owner: postgres
--

ALTER TABLE ONLY unusual_search.embeddings
    ADD CONSTRAINT embeddings_pkey PRIMARY KEY (id);


--
-- TOC entry 4789 (class 2606 OID 6224287)
-- Name: embeddings unusual_search_embeddings_article_name_fkey; Type: FK CONSTRAINT; Schema: unusual_search; Owner: postgres
--

ALTER TABLE ONLY unusual_search.embeddings
    ADD CONSTRAINT unusual_search_embeddings_article_name_fkey FOREIGN KEY (article_name) REFERENCES unusual_search.articles(name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4959 (class 0 OID 6218474)
-- Dependencies: 827
-- Name: articles; Type: ROW SECURITY; Schema: unusual_search; Owner: postgres
--

ALTER TABLE unusual_search.articles ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4960 (class 0 OID 6224081)
-- Dependencies: 830
-- Name: embeddings; Type: ROW SECURITY; Schema: unusual_search; Owner: postgres
--

ALTER TABLE unusual_search.embeddings ENABLE ROW LEVEL SECURITY;

-- Completed on 2024-06-04 20:18:46

--
-- PostgreSQL database dump complete
--

