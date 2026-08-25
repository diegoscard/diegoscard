import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Simulação simples de banco de dados em memória para os cliques
  // Nota: Isso será resetado se o container reiniciar.
  const clickStats: Record<string, number> = {};

  app.post("/api/track-click", (req, res) => {
    const { linkId } = req.body;
    if (linkId) {
      clickStats[linkId] = (clickStats[linkId] || 0) + 1;
      console.log(`[Analytics] Click tracked for ${linkId}. Total: ${clickStats[linkId]}`);
      return res.json({ success: true, count: clickStats[linkId] });
    }
    res.status(400).json({ error: "Missing linkId" });
  });

  app.get("/api/stats", (req, res) => {
    res.json(clickStats);
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
