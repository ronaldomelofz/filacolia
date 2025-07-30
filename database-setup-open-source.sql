-- Configuração do banco de dados para sistema open source da Filacolia
-- Este script não usa embeddings, apenas armazenamento de texto

-- Criar a tabela de documentos (sem embeddings)
CREATE TABLE IF NOT EXISTS documents (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    content_hash VARCHAR(50) UNIQUE,
    source_file TEXT,
    volume TEXT,
    chapter TEXT,
    chunk_index INTEGER,
    total_chunks INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhorar a performance de busca
CREATE INDEX IF NOT EXISTS documents_content_idx ON documents USING gin(to_tsvector('portuguese', content));
CREATE INDEX IF NOT EXISTS documents_volume_idx ON documents(volume);
CREATE INDEX IF NOT EXISTS documents_source_file_idx ON documents(source_file);
CREATE INDEX IF NOT EXISTS documents_content_hash_idx ON documents(content_hash);

-- Criar uma função para busca por similaridade de texto
CREATE OR REPLACE FUNCTION search_documents(query_text TEXT, limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
    id BIGINT,
    content TEXT,
    source_file TEXT,
    volume TEXT,
    chapter TEXT,
    similarity REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.id,
        d.content,
        d.source_file,
        d.volume,
        d.chapter,
        ts_rank(to_tsvector('portuguese', d.content), plainto_tsquery('portuguese', query_text)) as similarity
    FROM documents d
    WHERE to_tsvector('portuguese', d.content) @@ plainto_tsquery('portuguese', query_text)
    ORDER BY similarity DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Criar uma função para busca por palavras-chave
CREATE OR REPLACE FUNCTION search_by_keywords(keywords TEXT[], limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    id BIGINT,
    content TEXT,
    source_file TEXT,
    volume TEXT,
    chapter TEXT,
    match_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.id,
        d.content,
        d.source_file,
        d.volume,
        d.chapter,
        array_length(array(
            SELECT unnest(keywords) 
            WHERE lower(d.content) LIKE '%' || lower(unnest) || '%'
        ), 1) as match_count
    FROM documents d
    WHERE EXISTS (
        SELECT 1 
        FROM unnest(keywords) keyword 
        WHERE lower(d.content) LIKE '%' || lower(keyword) || '%'
    )
    ORDER BY match_count DESC, d.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Inserir dados de exemplo para teste (opcional)
INSERT INTO documents (content, content_hash, source_file, volume, chapter, chunk_index, total_chunks) 
VALUES (
    'A oração do coração é uma prática espiritual fundamental na tradição ortodoxa.',
    'test-hash-1',
    'exemplo.pdf',
    'Tomo 1, Volume 1',
    'Volume 1',
    1,
    1
) ON CONFLICT (content_hash) DO NOTHING;

-- Verificar se tudo foi criado corretamente
SELECT 
    'Tabela documents criada' as status,
    COUNT(*) as total_documents
FROM documents;

-- Mostrar as funções criadas
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE 'search%'; 