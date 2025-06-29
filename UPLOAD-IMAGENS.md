# Sistema de Upload de Imagens para Carros

## Funcionalidades Implementadas

### 📸 Upload de Imagens
- **Upload de arquivo**: Os usuários autenticados podem fazer upload de imagens locais
- **Formatos suportados**: JPG, JPEG, PNG, GIF
- **Tamanho máximo**: 5MB por imagem
- **Preview**: Visualização da imagem antes do salvamento
- **Armazenamento**: Imagens são salvas localmente no servidor

### 🔧 Tecnologias Utilizadas

#### Backend
- **Multer**: Para upload de arquivos
- **NestJS FileInterceptor**: Interceptador para processar uploads
- **Disk Storage**: Armazenamento local de arquivos
- **Static Files**: Servir imagens através de URLs públicas

#### Frontend
- **FormData**: Para envio de arquivos
- **File API**: Para manipulação de arquivos no browser
- **Preview**: Visualização usando FileReader API

### 📁 Estrutura de Arquivos

```
backend/
├── uploads/
│   └── cars/           # Imagens dos carros
├── src/
│   ├── cars/
│   │   ├── cars.controller.ts  # Endpoint de upload
│   │   └── cars.service.ts
│   └── main.ts         # Configuração de arquivos estáticos

frontend/
├── src/
│   ├── components/
│   │   └── ui/
│   │       └── ImageUpload.tsx  # Componente de upload
│   ├── services/
│   │   └── api.ts      # Serviço de upload
│   └── app/
│       └── gestao/
│           └── page.tsx # Integração no modal de carros
```

### 🚀 Como Usar

1. **Acesse o painel de gestão**: Faça login e vá para `/gestao`
2. **Adicione/Edite um carro**: Clique em "Adicionar Carro" ou edite um existente
3. **Upload da imagem**: 
   - Clique em "Escolher Imagem"
   - Selecione um arquivo de imagem (JPG, PNG, GIF)
   - Aguarde o upload ser concluído
   - Visualize o preview da imagem
4. **Salve o carro**: Complete os demais campos e salve

### 🛡️ Segurança

- **Autenticação obrigatória**: Apenas usuários logados podem fazer upload
- **Validação de tipo**: Apenas imagens são aceitas
- **Limite de tamanho**: Máximo 5MB por arquivo
- **Nomes únicos**: Arquivos recebem nomes únicos para evitar conflitos

### 📋 Endpoints da API

#### Upload de Imagem
```
POST /cars/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body: FormData com campo 'image'
```

**Resposta:**
```json
{
  "message": "Imagem enviada com sucesso",
  "imageUrl": "http://localhost:8080/uploads/cars/car-1234567890-123456789.jpg"
}
```

#### Servir Imagens
```
GET /uploads/cars/<filename>
```

### 🔄 Integração com Dashboard Analytics

As imagens uploadadas são automaticamente integradas ao sistema:
- **Catálogo**: Exibe as imagens dos carros
- **Dashboard**: Mostra imagens nos carros mais visualizados
- **Gestão**: Preview das imagens nos modais de edição

### 🎨 Interface do Usuário

- **Componente reutilizável**: `ImageUpload` pode ser usado em outros formulários
- **Loading states**: Indicadores visuais durante upload
- **Error handling**: Mensagens de erro claras
- **Preview instantâneo**: Visualização antes do salvamento
- **Botão de remoção**: Permite remover imagem selecionada

### 📝 Notas Técnicas

1. **CORS configurado**: Backend aceita uploads do frontend
2. **Multer configurado**: Upload configurado no AppModule
3. **Static assets**: Imagens servidas como arquivos estáticos
4. **Unique filenames**: Evita conflitos com timestamp + random
5. **Error boundaries**: Tratamento de erros em todos os níveis

### 🔮 Próximos Passos (Sugestões)

- [ ] Redimensionamento automático de imagens
- [ ] Compressão de imagens para otimizar tamanho
- [ ] Upload múltiplo (galeria de imagens)
- [ ] Integração com CDN (AWS S3, Cloudinary)
- [ ] Validação mais robusta (detecção de MIME type real)
- [ ] Cache de imagens
- [ ] Lazy loading para imagens

---

**Nota**: Este sistema usa armazenamento local para desenvolvimento. Em produção, considere usar um serviço de armazenamento em nuvem como AWS S3, Google Cloud Storage ou Cloudinary.
