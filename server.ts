import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Garantir que a pasta de uploads existe
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Arquivo para salvar os cliques permanentemente sem banco de dados
const STATS_FILE = path.join(process.cwd(), "stats.json");
const loadStats = () => {
  if (fs.existsSync(STATS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(STATS_FILE, "utf-8"));
    } catch (e) {
      return {};
    }
  }
  return {};
};

const saveStats = (stats: any) => {
  fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
};

// Configuração do Multer para Upload de Foto
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    // Sempre salvar como avatar.png para simplificar
    cb(null, "avatar.png");
  },
});
const upload = multer({ storage });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use("/uploads", express.static(UPLOADS_DIR));

  // Rota para rastrear cliques e salvar no arquivo
  app.post("/api/track-click", (req, res) => {
    const { linkId } = req.body;
    if (linkId) {
      const stats = loadStats();
      stats[linkId] = (stats[linkId] || 0) + 1;
      saveStats(stats);
      console.log(`[Analytics] Click saved for ${linkId}. Total: ${stats[linkId]}`);
      return res.json({ success: true, count: stats[linkId] });
    }
    res.status(400).json({ error: "Missing linkId" });
  });

  app.get("/api/stats", (req, res) => {
    res.json(loadStats());
  });

  // Rota para Upload de Foto
  app.post("/api/upload-avatar", upload.single("avatar"), (req, res) => {
    res.json({ success: true, url: "/uploads/avatar.png?t=" + Date.now() });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
