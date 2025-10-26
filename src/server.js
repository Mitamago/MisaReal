const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// CORS設定
app.use(cors());

// 静的ファイルの配信
app.use(express.static(__dirname));

// 投稿データを保存するためのメモリストレージ（グローバル変数として管理）
let posts = [];
const MAX_POSTS = 1000;

// API ルート
app.get('/api/posts', (req, res) => {
  // 最新の1000件の投稿を取得
  const recentPosts = posts.slice(0, MAX_POSTS);
  res.status(200).json({ posts: recentPosts });
});

app.post('/api/posts', express.json(), (req, res) => {

  const { author, content } = req.body;

  if (!author || !content) {
    res.status(400).json({ error: 'Author and content are required' });
    return;
  }

  if (content.length > 50) {
    res.status(400).json({ error: 'Content must be 50 characters or less' });
    return;
  }

  const now = new Date();
  const newPost = {
    id: Date.now(),
    author: author.trim(),
    content: content.trim(),
    date: now.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' }),
    time: now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
    timestamp: now.getTime()
  };

  // 投稿を先頭に追加
  posts.unshift(newPost);

  // 最大件数を超えた場合は古い投稿を削除
  if (posts.length > MAX_POSTS) {
    posts = posts.slice(0, MAX_POSTS);
  }

  res.status(201).json({ 
    success: true, 
    post: newPost,
    totalPosts: posts.length 
  });
});

// メインページ
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 サーバーが起動しました: http://localhost:${PORT}`);
  console.log('📱 ブラウザでアクセスしてください');
});
