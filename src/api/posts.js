// 投稿データを保存するためのメモリストレージ（本番ではデータベースを使用）
let posts = [];
const MAX_POSTS = 1000;

export default function handler(req, res) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // 最新の1000件の投稿を取得
    const recentPosts = posts.slice(0, MAX_POSTS);
    res.status(200).json({ posts: recentPosts });
    return;
  }

  if (req.method === 'POST') {
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
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
