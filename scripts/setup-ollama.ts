import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🤖 CONFIGURANDO OLLAMA PARA MODELOS LOCAIS\n');

// Verificar se o Ollama está instalado
function checkOllamaInstallation(): boolean {
    try {
        execSync('ollama --version', { stdio: 'pipe' });
        return true;
    } catch (error) {
        return false;
    }
}

// Baixar modelo do Ollama
async function downloadModel(modelName: string): Promise<boolean> {
    try {
        console.log(`📥 Baixando modelo: ${modelName}`);
        execSync(`ollama pull ${modelName}`, { stdio: 'inherit' });
        console.log(`✅ Modelo ${modelName} baixado com sucesso!\n`);
        return true;
    } catch (error) {
        console.log(`❌ Erro ao baixar modelo ${modelName}:`, error);
        return false;
    }
}

// Testar modelo
async function testModel(modelName: string): Promise<boolean> {
    try {
        console.log(`🧪 Testando modelo: ${modelName}`);
        const testPrompt = 'Responda em português: O que é a oração do coração?';
        
        const result = execSync(`ollama run ${modelName} "${testPrompt}"`, { 
            stdio: 'pipe',
            encoding: 'utf8',
            timeout: 30000 // 30 segundos
        });
        
        if (result && result.length > 0) {
            console.log(`✅ Modelo ${modelName} funcionando corretamente!\n`);
            return true;
        } else {
            console.log(`❌ Modelo ${modelName} não retornou resposta\n`);
            return false;
        }
    } catch (error) {
        console.log(`❌ Erro ao testar modelo ${modelName}:`, error);
        return false;
    }
}

// Função principal
async function main() {
    console.log('🔍 Verificando instalação do Ollama...\n');
    
    if (!checkOllamaInstallation()) {
        console.log('❌ Ollama não está instalado!');
        console.log('');
        console.log('📥 Para instalar o Ollama:');
        console.log('1. Acesse: https://ollama.ai/');
        console.log('2. Baixe e instale para seu sistema operacional');
        console.log('3. Execute este script novamente');
        console.log('');
        console.log('💡 Alternativa: Use o sistema sem IA local (apenas busca de texto)');
        process.exit(1);
    }
    
    console.log('✅ Ollama está instalado!\n');
    
    // Lista de modelos recomendados (em ordem de preferência)
    const models = [
        'llama3.2:3b',           // Modelo pequeno e rápido
        'llama3.2:1b',           // Modelo muito pequeno
        'mistral:7b',            // Modelo equilibrado
        'qwen2.5:3b',            // Modelo multilíngue
        'phi3:mini'              // Modelo da Microsoft
    ];
    
    console.log('📋 Modelos disponíveis para download:');
    models.forEach((model, index) => {
        console.log(`   ${index + 1}. ${model}`);
    });
    console.log('');
    
    // Tentar baixar o primeiro modelo disponível
    let modelInstalled = false;
    let installedModel = '';
    
    for (const model of models) {
        console.log(`🔄 Tentando baixar: ${model}`);
        if (await downloadModel(model)) {
            console.log(`🧪 Testando modelo: ${model}`);
            if (await testModel(model)) {
                modelInstalled = true;
                installedModel = model;
                break;
            }
        }
        console.log('');
    }
    
    if (modelInstalled) {
        console.log('🎉 CONFIGURAÇÃO CONCLUÍDA COM SUCESSO!');
        console.log('=====================================');
        console.log(`✅ Modelo instalado: ${installedModel}`);
        console.log('✅ Ollama configurado');
        console.log('✅ Sistema pronto para IA local');
        console.log('');
        console.log('🚀 Próximos passos:');
        console.log('1. Execute: pnpm db:push');
        console.log('2. Execute: pnpm dev');
        console.log('3. Acesse: http://localhost:3000');
        
        // Salvar o modelo escolhido em um arquivo de configuração
        const config = {
            ollamaModel: installedModel,
            installedAt: new Date().toISOString()
        };
        
        fs.writeFileSync(
            path.join(process.cwd(), 'ollama-config.json'),
            JSON.stringify(config, null, 2)
        );
        
        console.log('');
        console.log('📝 Configuração salva em: ollama-config.json');
        
    } else {
        console.log('⚠️  NENHUM MODELO FOI INSTALADO');
        console.log('================================');
        console.log('❌ Não foi possível baixar nenhum modelo');
        console.log('');
        console.log('💡 O sistema ainda funcionará, mas sem IA local');
        console.log('🔍 Apenas busca por similaridade de texto será disponível');
        console.log('');
        console.log('🔄 Para tentar novamente:');
        console.log('1. Verifique sua conexão com a internet');
        console.log('2. Execute: pnpm setup:ollama');
        console.log('3. Ou use o sistema sem IA local');
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    main().catch(console.error);
} 