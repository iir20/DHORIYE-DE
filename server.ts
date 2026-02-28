import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { createCanvas, loadImage } from "canvas";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || "",
  process.env.VITE_SUPABASE_ANON_KEY || ""
);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // Helper for IP hashing
  const getIpHash = (req: express.Request) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    return crypto.createHash('sha256').update(ip.toString()).digest('hex');
  };

  // OG Image Generator
  app.get("/api/og/:reportId", async (req, res) => {
    try {
      const { reportId } = req.params;
      const { data: report, error } = await supabase
        .from('reports')
        .select('*')
        .eq('id', reportId)
        .single();

      if (error || !report) return res.status(404).send('Report not found');

      const width = 1200;
      const height = 630;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');

      // Background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);

      // Accent
      ctx.fillStyle = '#e11d48';
      ctx.fillRect(0, 0, 40, height);

      // Text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 60px sans-serif';
      ctx.fillText('ধরিয়ে দে (Dhoriye De)', 80, 100);

      ctx.font = 'bold 30px sans-serif';
      ctx.fillStyle = '#e11d48';
      ctx.fillText(report.category.toUpperCase(), 80, 160);

      ctx.font = '40px sans-serif';
      ctx.fillStyle = '#cccccc';
      const words = report.description.split(' ');
      let line = '';
      let y = 250;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 1000 && n > 0) {
          ctx.fillText(line, 80, y);
          line = words[n] + ' ';
          y += 50;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 80, y);

      ctx.font = 'bold 24px sans-serif';
      ctx.fillStyle = '#666666';
      ctx.fillText(`ID: ${report.id} | Anonymous Corruption Report`, 80, height - 60);

      res.setHeader('Content-Type', 'image/png');
      canvas.createPNGStream().pipe(res);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error generating image');
    }
  });

  // API Routes
  app.get("/api/ip-hash", (req, res) => {
    res.json({ hash: getIpHash(req) });
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
